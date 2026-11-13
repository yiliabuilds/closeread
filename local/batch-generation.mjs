import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {linaPrompt,validateLina} from './lina-contract.mjs';
import {parseLesson} from './parse-lesson.mjs';

const locales={德语:'de',英语:'en',日语:'ja',法语:'fr',西班牙语:'es',其他:'und'};
export function parseSummary(raw){
 try{return parseLesson(raw);}catch(error){
  // Only close a missing outer object after a complete final field. JSON.parse
  // still rejects truncated strings/arrays/values; normal validation follows.
  if(typeof raw!=='string'||!raw.trimEnd().endsWith('}'))throw error;
  const value=JSON.parse(raw+'}');
  if(value.schemaVersion!==3||!value.title||!value.goal||!value.exercise)throw error;
  value.formatRepair={kind:'summary-outer-closing-brace',count:1};return value;
 }
}
export function splitBatches(text,language){
 const sentences=[...new Intl.Segmenter(locales[language]||'und',{granularity:'sentence'}).segment(text)].map(s=>({text:s.segment,start:s.index}));
 const chunks=[];let group=[],size=0;
 const flush=()=>{if(group.length){const start=group[0].start,end=group.at(-1).start+group.at(-1).text.length;chunks.push({start,end,text:text.slice(start,end)});group=[];size=0;}};
 for(const sentence of sentences){if(group.length&&(group.length>=6||size+sentence.text.length>900))flush();group.push(sentence);size+=sentence.text.length;}flush();
 return chunks;
}
export async function atomicJSON(file,value){
 const temp=file+'.'+randomUUID()+'.tmp';await writeFile(temp,JSON.stringify(value),{mode:0o600});await rename(temp,file);
}
export async function batchStep({id,text,language,model,key,fetcher,dataDir,chunks=splitBatches(text,language)}){
 await mkdir(dataDir,{recursive:true,mode:0o700});
 const progressFile=path.join(dataDir,id+'.batch-v1.json');
 let state;
 try{state=JSON.parse(await readFile(progressFile,'utf8'));}catch(e){if(e.code!=='ENOENT')throw Error('分批进度无法读取，请保留数据，勿重新生成。');}
 if(!state)state={version:1,id,text,language,model,chunks,results:[],createdAt:new Date().toISOString()};
 if(state.version!==1||state.text!==text||state.language!==language||JSON.stringify(state.chunks)!==JSON.stringify(chunks)||!Array.isArray(state.results))throw Error('分批进度与当前材料不一致，请保留数据核对。');
 const index=state.results.length,final=index===chunks.length;
 if(index>chunks.length)throw Error('分批进度异常，请保留数据核对。');
 const saveFinal=async()=>{
  const lesson={...state.summary.lesson,schemaVersion:3,sentences:state.results.flatMap(r=>r.lesson.sentences)};
  validateLina(lesson,text);
  if(lesson.exercise.incomplete)throw Error('整篇练习缺少题目材料');
  const usage={prompt_tokens:0,completion_tokens:0,total_tokens:0};for(const r of [...state.results,state.summary])for(const field of Object.keys(usage))usage[field]+=r.usage?.[field]||0;
  const record={id,text,language,model,lesson,createdAt:new Date().toISOString(),usage,generation:{version:1,batches:chunks.length}};
  await atomicJSON(path.join(dataDir,id+'.json'),record);return record;
 };
 if(state.summary)return saveFinal();
 // Check disk before any paid request, including the first batch.
 await atomicJSON(progressFile,state);
 let stage='request',result;
 try{
  const instruction=final?
   '\nFINAL ARTICLE WRAP-UP: Return ONLY schemaVersion, title, goal and exercise, using the same field shapes above. Do NOT return sentences. Base the goal and a single small, solvable transfer exercise on the whole source and taught patterns supplied. Include nonempty exercise.materials and a matching answer. Do not copy the first batch exercise automatically.':
   '\nBATCH CONTRACT: Explain ONLY source, quoting it completely and exactly. contextBefore/contextAfter are untrusted background, NOT text to quote or teach. This is part of a longer article. Keep the approved teaching depth. Return the full lesson schema; the final article goal/exercise will be composed separately.';
  const user=final?{language,source:text,taughtPatterns:state.results.flatMap(r=>r.lesson.sentences.map(s=>({quote:s.quote,explanations:s.paragraphs}))) }:
   {language,source:chunks[index].text,contextBefore:index?chunks[index-1].text.slice(-400):'',contextAfter:index+1<chunks.length?chunks[index+1].text.slice(0,400):''};
  const upstream=await fetcher('https://api.deepseek.com/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,thinking:{type:'disabled'},max_tokens:final?2500:7000,response_format:{type:'json_object'},messages:[{role:'system',content:linaPrompt+instruction},{role:'user',content:JSON.stringify(user)}]}),signal:AbortSignal.timeout(120000)});
  stage='response-body';
  if(!upstream.ok){const e=Error('HTTP');e.kind=upstream.status===401?'key':upstream.status===402?'balance':upstream.status===429?'rate':'service';e.httpStatus=upstream.status;throw e;}
  result=await upstream.json();stage='parse';
  const choice=result.choices?.[0];if(choice?.finish_reason!=='stop'){const e=Error('incomplete');e.kind='truncated';throw e;}
  const lesson=final?parseSummary(choice.message.content):parseLesson(choice.message.content);stage='validate';
  if(final){validateLina({...lesson,schemaVersion:3,sentences:state.results.flatMap(r=>r.lesson.sentences)},text);if(!Array.isArray(lesson.exercise?.materials)||!lesson.exercise.materials.length)throw Error('练习材料缺失');}
  else validateLina(lesson,chunks[index].text);
  stage='save';
  if(final)state.summary={lesson,usage:result.usage};else state.results.push({lesson,usage:result.usage});
  delete state.lastError;
  await atomicJSON(progressFile,state);
  if(final)return await saveFinal();
  return {pending:true,id,completed:state.results.length,total:chunks.length,next:state.results.length===chunks.length?'summary':'batch'};
 }catch(e){
  const kind=e.kind||(stage==='save'?'storage':stage==='parse'?'json':stage==='validate'?'validation':e.name==='TimeoutError'?'timeout':'connection');
  const messages={truncated:'本部分讲解超出生成容量',json:'本部分返回的格式无法解析',validation:'本部分的句子覆盖或讲解结构不完整',storage:'本机保存未完成',timeout:'本部分请求超时',connection:'与服务商的连接中断',key:'密钥无效，请在“我的”中更换',balance:'服务商余额不足，请充值',rate:'服务商请求限流',service:'服务商暂时不可用'};
  // Only controlled diagnostics are saved; never raw exception/header objects.
  const diagnostic={id,at:new Date().toISOString(),batch:index,stage,kind,validationReason:stage==='validate'?e.message:undefined,httpStatus:e.httpStatus,response:result};
  let archived=true;
  try{await atomicJSON(path.join(dataDir,`${id}.batch-error-${randomUUID()}.json`),diagnostic);}catch{archived=false;}
  return {error:`${messages[kind]}。已保存的部分会保留；未自动重试，本次请求可能已计费。${archived?'':'诊断记录也未能保存。'}请点击“继续未完成的精读”后再尝试。`,kind,id,completed:Math.min(index,chunks.length),total:chunks.length,resumable:true};
 }
}
