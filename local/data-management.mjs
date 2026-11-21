import {mkdir,readdir,readFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {atomicJSON} from './batch-generation.mjs';

const idPattern=/^[a-f0-9]{64}$/;
export function assertId(id){if(!idPattern.test(id||''))throw Error('文章编号无效');}
async function exists(file){try{await readFile(file);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
export function createDataManager(dataDir,validate){
 const file=id=>{assertId(id);return path.join(dataDir,id+'.json');};
 const marker=id=>{assertId(id);return path.join(dataDir,id+'.trash.json');};
 const removed=id=>exists(marker(id));
 async function list(trash=false){
  await mkdir(dataDir,{recursive:true,mode:0o700});
  const result=[];
  for(const name of await readdir(dataDir))if(/^[a-f0-9]{64}\.json$/.test(name)){
   const id=name.slice(0,64);if(await removed(id)!==trash)continue;
   const record=JSON.parse(await readFile(file(id),'utf8'));
   if(trash)record.deletedAt=JSON.parse(await readFile(marker(id),'utf8')).deletedAt;
   result.push(record);
  }
  return result.sort((a,b)=>String(b.deletedAt||b.createdAt).localeCompare(String(a.deletedAt||a.createdAt)));
 }
 async function change(id,action){
  const target=file(id);
  if(action==='trash'){
   if(!await exists(target))throw Error('文章不存在');
   await atomicJSON(marker(id),{id,deletedAt:new Date().toISOString()});
  }else if(action==='restore'){
   if(!await exists(target))throw Error('文章文件不存在，无法恢复');
   await unlink(marker(id));
  }else if(action==='purge'){
   if(!await removed(id))throw Error('请先将文章移入回收站');
   // Only this article's exact, program-owned files; never arbitrary paths.
   const pattern=new RegExp('^'+id+'(?:\\.json|\\.failed\\.json|\\.batch-v1\\.json|\\.batch-error-[a-f0-9-]+\\.json)$');
   const names=(await readdir(dataDir)).filter(name=>pattern.test(name));
   // Delete caches first: a failed cache cleanup keeps the article recoverable.
   names.sort((a,b)=>Number(a===id+'.json')-Number(b===id+'.json'));
   for(const name of names)await unlink(path.join(dataDir,name));
   // Leave the tombstone until all content/cache removal succeeds.
   await unlink(marker(id));
  }else throw Error('不支持的操作');
 }
 async function backup(){return {format:'closeread-backup',version:1,createdAt:new Date().toISOString(),articles:await list(),trash:await list(true)};}
 function validateBackup(input){
  if(input?.format!=='closeread-backup'||input.version!==1||!Array.isArray(input.articles)||!Array.isArray(input.trash)||input.articles.length+input.trash.length>2000)throw Error('不是支持的 CloseRead 完整备份');
  const seen=new Set();
  for(const r of [...input.articles,...input.trash]){
   assertId(r?.id);if(seen.has(r.id))throw Error('备份中有重复文章编号');seen.add(r.id);
   if(typeof r.text!=='string'||r.text.length>3000||!['德语','英语','日语','法语','西班牙语','其他'].includes(r.language)||!Number.isFinite(Date.parse(r.createdAt)))throw Error('备份文章字段无效');
   validate(structuredClone(r.lesson),r.text);
  }
 }
 async function restoreBackup(input){
  validateBackup(input);await mkdir(dataDir,{recursive:true,mode:0o700});let restored=0,skipped=0;
  for(const [rows,trash] of [[input.articles,false],[input.trash,true]])for(const r of rows){
   if(await exists(file(r.id))||await removed(r.id)){skipped++;continue;}
   if(trash)await atomicJSON(marker(r.id),{id:r.id,deletedAt:r.deletedAt||new Date().toISOString()});
   await atomicJSON(file(r.id),{id:r.id,text:r.text,language:r.language,lesson:r.lesson,createdAt:r.createdAt,model:typeof r.model==='string'?r.model:'backup'});restored++;
  }
  return {restored,skipped};
 }
 return {list,removed,change,backup,validateBackup,restoreBackup};
}
