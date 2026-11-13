(() => {
 const style=document.createElement('style');style.textContent='.learning-item{padding:18px 0;border-bottom:1px solid var(--line)}.learning-item:last-child{border-bottom:0}.learning-item h3{margin:8px 0;font-size:19px}.learning-item a{font-size:13px;display:inline-block;padding:6px 0}.lesson-menu a{display:block;padding:9px 0;min-height:44px}.lesson>section{scroll-margin-top:20px}.lesson>section>h2{margin-top:32px;border-top:1px solid var(--line);padding-top:24px}.lesson-menu h2{margin-top:0!important;border:0!important;padding:0!important}.learning-item p{margin:10px 0}.learning-item blockquote{margin:12px 0}.result-text{overflow-wrap:anywhere}';document.head.append(style);
 const $=id=>document.getElementById(id);let current,items=[],position=0;
 const say=t=>$('message').textContent=t;
 const node=(tag,text,parent)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
 const params=new URLSearchParams(location.search),lessonId=params.get('lesson');
 const readerMode=params.has('lesson')||params.get('sample')==='pharmacy';
 const pageView=params.get('view')||'library';
 if(pageView==='home'&&!readerMode){location.replace('index.html');return;}
 let selectedSource=null;
 node('style','#result{scroll-margin-top:90px}.lesson article.lesson{border:0;background:transparent;padding:0}#article-count{display:block;font-size:14px;color:var(--muted);margin:8px 0}',document.head);
 node('style',`main.library-main{max-width:928px}.entry{max-width:none}.page-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:20px 0}.page-actions a{padding:10px 16px;border:1px solid var(--line);border-radius:9px;text-decoration:none}.page-actions a.main-action{background:var(--ink);color:var(--paper)}.segment-card{padding:18px 0;border-bottom:1px solid var(--line)}.segment-card label{display:flex;gap:10px;align-items:center}.segment-card input{width:20px;height:20px}.segment-card p{white-space:pre-wrap}.segment-card textarea{min-height:140px}.library-search{display:block;width:100%;font:inherit;padding:12px;border:1px solid var(--line);border-radius:9px;margin:12px 0}.workspace.outline-closed{grid-template-columns:1fr}.workspace.outline-closed>.source{display:none}.lesson>article.lesson{border:0;padding:0;background:transparent}.tools{flex-wrap:wrap}.top{flex-wrap:wrap}#title{font-size:30px}#message{overflow-wrap:anywhere;min-height:2em}.source a{display:block;padding:8px 0}.source{top:80px}.reader-top{position:sticky;top:0;z-index:5}.lesson>section{scroll-margin-top:95px!important}@media(max-width:760px){.source{max-height:45dvh;overflow:auto}.page-actions a{min-height:44px}}`,document.head);
 function readingLink(record,parent,label){const a=node('a',label||`${record.lesson.title} · ${record.language} · ${record.createdAt.slice(0,10)} ↗`,parent);a.href='intensive.html?lesson='+encodeURIComponent(record.id);a.target='_blank';a.rel='noopener';a.style.cssText='display:block;padding:16px;margin:8px 0;border:1px solid var(--line);border-radius:12px;background:white;text-decoration:none';return a;}
 const linaSentence={quote:'Ich heiße Lina.',meaning:'My name is Lina.',parts:[['Ich','I'],['heiße','am called'],['Lina','name']],paragraphs:[
  ['The whole pattern ',{strong:'Ich heiße …'},' tells someone your name. Learn it as a useful chunk.'],
  ['The dictionary form is ',{strong:'heißen'},'. With ',{strong:'ich'},', it becomes ',{strong:'heiße'},'. For now, you do not need the full verb table.'],
  [{strong:'Notice: '},{code:'ß'},' is a German letter, not the letter B. Keep the spelling ',{strong:'heiße'},' when you copy this sentence.']
 ],help:[['整句是“我叫 Lina”。拆开看：Ich = 我，heiße = 叫作，Lina = 姓名。把 ',{strong:'Ich heiße …'},' 当作完整表达记住。'],['词典里的形式是 ',{strong:'heißen'},'，和 ',{strong:'ich'},' 搭配时变成 ',{strong:'heiße'},'，现在不用背整张变化表。',{strong:'ß'},' 是德语字母，不是 B；抄写时保留 ',{strong:'heiße'},' 的拼写。下面填入你的名字试试。']],practice:'Ich heiße ________.'};
 function renderLinaSentence(data,parent,number='②',language='de'){
  const inline=(tokens,p)=>tokens.forEach(t=>{if(typeof t==='string')p.append(document.createTextNode(t));else node(t.strong?'strong':'code',t.strong||t.code,p);});
  const article=node('article','',parent);article.lang='en';article.className='lesson';
  node('h3',number+' '+data.quote,article).lang=language;
  const meaning=node('p','',article);node('strong','Meaning: ',meaning);meaning.append(document.createTextNode(data.meaning));
  if(data.parts.length){const build=node('p','',article);node('strong','Build it: ',build);data.parts.forEach(([word,gloss],i)=>{if(i)build.append(document.createTextNode(' + '));node('code',word,build).lang=language;build.append(document.createTextNode(' ('+gloss+')'));});}
  if(data.partsWarning)node('p','Build it contains a form that needs checking against the original.',article).className='notice';
  data.paragraphs.forEach(tokens=>inline(tokens,node('p','',article)));
  const help=node('details','',article);help.lang='zh-CN';node('summary',number==='②'?'中文辅助 · 姓名表达':'中文辅助',help);data.help.forEach(tokens=>inline(tokens,node('p','',help)));
  if(data.practice){const exercise=node('p','',article);node('strong','Your turn: ',exercise);exercise.append(document.createTextNode(data.practice));}
 }
 function showLinaPreview(){
  const main=document.querySelector('main');main.replaceChildren();
  node('h1','Lina 单句模板对照',main);
  node('p','固定样稿内容 · 仅验证呈现方式 · 不调用 API，不写入学习记录',main).className='notice';
  const back=node('a','打开原版 Lina 对照 ↗',main);back.href='reading.html#lesson-4';back.target='_blank';back.rel='noopener';
  const returnLink=node('a','返回精读工作区',main);returnLink.href='intensive.html';returnLink.style.marginLeft='20px';
  const wrap=node('div','',main);wrap.style.cssText='max-width:760px;margin:24px auto';renderLinaSentence(linaSentence,wrap);
  document.title='Lina 单句模板对照';window.scrollTo(0,0);
 }
 if(new URLSearchParams(location.search).get('sample')==='lina-template'){showLinaPreview();return;}
 const linaEntry=node('a','查看 Lina 单句模板对照（不调用 API）',$('generate').parentElement);linaEntry.href='intensive.html?sample=lina-template';linaEntry.style.cssText='display:block;margin:18px 0';
 const pharmacySample={id:'editorial-pharmacy-v1',editorial:true,language:'德语',model:'editorial-example',text:'Heute fühle ich mich nicht gut.\nDeshalb gehe ich in die Apotheke.\nDie Apothekerin fragt: „Was fehlt Ihnen?“\nIch antworte: „Mein Kopf tut weh und mein Hals tut auch weh.“',lesson:{title:'At the pharmacy · 在药店',goal:{en:'Learn to say how you feel, explain what you do next, and name a body part that hurts. You do not need to memorise every word.',zh:'学会描述身体感受、说明接下来的行动，以及说出哪里疼。不要求记住所有词。'},overview:{en:'Feeling → action → question → answer.\nThe person feels unwell. Deshalb connects that reason to an action: going to the pharmacy. The pharmacist asks about the problem; the answer gives specific details.\nFirst question: Why does the person go to the pharmacy?',zh:'感受 → 行动 → 提问 → 回答。第一句是不舒服，第二句用 Deshalb 引出行动；药剂师询问，最后说明头和喉咙疼。先想一想：为什么去药店？'},guided:[
 {title:'Read and understand · 对照理解',en:'Heute fühle ich mich nicht gut.\nToday I do not feel well.\n\nDeshalb gehe ich in die Apotheke.\nThat is why I am going to the pharmacy.\n\nDie Apothekerin fragt: „Was fehlt Ihnen?“\nThe pharmacist asks, “What seems to be the matter?”\n\nIch antworte: „Mein Kopf tut weh und mein Hals tut auch weh.“\nI answer, “My head hurts, and my throat hurts too.”',zh:'今天我感觉不舒服。因此我去药店。女药剂师问：“您哪里不舒服？”我回答：“我头疼，喉咙也疼。”'},
 {title:'Say how you feel · 描述自己的感受',en:'Ich fühle mich nicht gut.\nI do not feel well.\n\nIch → I\nfühle → feel\nmich → the reflexive pronoun used with ich here\nnicht gut → not well\n\nLearn a pattern, not four separate words: Ich fühle mich + a description.\nThe dictionary expression is sich fühlen. With ich, this sentence uses fühle mich. English says “I feel well,” without “myself.” German uses mich in this pattern. Learn ich fühle mich together.\n\nIch fühle mich gut. — I feel well.\nIch fühle mich nicht gut. — I do not feel well.\nAdding nicht changes the meaning. This does not tell us exactly what is wrong; that comes later.',zh:'把 Ich fühle mich 整块记住。词典表达是 sich fühlen；主语为 ich 时，这里用 fühle mich。英语不说 I feel myself well，但德语这个表达需要 mich。加上 nicht 就从“感觉不错”变成“不舒服”，哪里不舒服则由后文说明。'},
 {title:'Put today first · 先说“今天”',en:'Ich | fühle | mich heute nicht gut.\nHeute | fühle | ich mich nicht gut.\n\nBoth describe how I feel today. The second puts today first. In these German statements, the verb occupies the second position. When Heute comes first, fühle follows, and ich comes after the verb. This is not caused by the first-person ending.\n\nTry it: How would you say “Today I feel well”? Change just one part.',zh:'两句意思相同，第二句先说“今天”。这里动词占第二个成分位置，所以 Heute 后接 fühle，再接 ich。这不是第一人称词尾造成的语序。试着只改一个地方，说“今天我感觉不错”。'},
 {title:'Connect a reason to an action · 从感受说到行动',en:'Deshalb gehe ich in die Apotheke.\nThat is why I am going to the pharmacy.\n\nDeshalb → that is why / therefore. It points back to the reason: I do not feel well.\ngehe → go / am going. Dictionary form: gehen. With ich, use gehe.\nin die Apotheke → to / into the pharmacy. Learn it as a destination phrase.\n\nHeute | fühle | ich …\nDeshalb | gehe | ich …\nThe first word changes, but the verb still takes the second position. Avoid: Deshalb ich gehe …\n\nCheck: Does Deshalb introduce a reason or a result? It introduces the result: going to the pharmacy.',zh:'Deshalb 回指前面的原因并引出结果。gehe 来自 gehen，与 ich 搭配；in die Apotheke 是去药店。Heute 与 Deshalb 都可以占第一位，动词仍在第二位，不要写成 Deshalb ich gehe。'},
 {title:'Why in die? · 想知道为什么是 die？',optional:true,en:'Apotheke is a feminine noun: die Apotheke. Here, in introduces a destination and takes the accusative case. For a singular feminine noun, the article is still die.\nYou do not need the full case table today. Keep in die Apotheke gehen as a useful phrase.',zh:'Apotheke 是阴性名词。这里 in 表示进入的目的地，搭配第四格；阴性单数定冠词在第四格仍是 die。不能只靠名词阴性解释整个结构。今天先整体记住即可。'},
 {title:'Understand a polite question · 听懂礼貌询问',en:'Was fehlt Ihnen?\nWhat seems to be the matter?\n\nThe verb fehlen often means “to be missing.” In this pharmacy conversation, learn Was fehlt Ihnen? as a whole question about symptoms. “What is missing?” is not the natural translation here.\n\nIhnen is the dative form of formal Sie. The capital I belongs to the polite form. Recognise this polite question; you do not need every form of “you” today.\n\nTwo words to recognise:\ndie Apothekerin → the female pharmacist\nfragt → asks, from fragen\nThese help you follow the story. They are not today’s main memorisation target.',zh:'fehlen 常表示“缺少”，但这里整句是在询问身体哪里不舒服，不能只翻成“缺什么”。Ihnen 是正式称呼 Sie 的第三格形式，首字母大写。Apothekerin 是女药剂师，fragt 来自 fragen，意思是问；这两个词认识即可。'},
 {title:'Say where it hurts · 把“不舒服”说具体',en:'Mein Kopf tut weh.\nMy head hurts.\n\nder Kopf → head\nder Hals → throat / neck; here, throat\nmein → my\ntut weh → hurts\n\nFor the two singular masculine nouns in this text, use: Mein + body part + tut weh.\nMein Kopf tut weh. — My head hurts.\nMein Hals tut weh. — My throat hurts.\nChange the body part; keep the rest of this pattern. Do not assume every body part takes mein and tut.\n\nMein Hals tut auch weh.\nMy throat hurts too.\nauch → also / too. The person already mentioned a headache; auch adds another problem.',zh:'Kopf 是头，Hals 可以指颈部或喉部，这里指喉咙。mein 是我的，tut weh 表示疼。本篇这两个阳性单数名词可以用 Mein + 身体部位 + tut weh，但不能推广为所有部位都用 mein 和 tut。auch 表示“也”，是在头疼之外补充喉咙疼。'},
 {title:'See the verb in a sentence · 在句子中理解可分动词',optional:true,en:'Dictionary form: wehtun, a separable verb.\nMein Hals | tut | auch | weh.\nHere, tut is the conjugated part. weh appears at the end of this main clause. Notice the complete sentence, not just two disconnected fragments.',zh:'词典形式是可分动词 wehtun。在这个主句中，变位部分 tut 在前，weh 在句末，中间可以有 auch。用完整例句观察，不要只背两个孤立片段。'},
 {title:'Keep three expressions · 今天真正带走什么',en:'Ich fühle mich nicht gut. — I do not feel well.\nDeshalb gehe ich in die Apotheke. — That is why I am going to the pharmacy.\nMein Hals tut weh. — My throat hurts.\n\nAlso recognise Was fehlt Ihnen?, so you can understand the question before answering. You do not need to memorise the whole lesson.',zh:'主要掌握描述不舒服、说明去药店、表达喉咙疼这三句，再认得对方询问哪里不舒服的问句即可。不必背整篇讲解。'}
 ],exercise:{en:'A. Write “Today I feel well.” Start with Heute.\n\nB. Imagine you have a sore throat but no headache. Answer Was fehlt Ihnen? with one short sentence.\n\nC. Choose the correct order and explain why:\nDeshalb ich gehe in die Apotheke.\nDeshalb gehe ich in die Apotheke.',zh:'A：以 Heute 开头写“今天我感觉不错”。B：假设只有喉咙疼，没有头疼，用一句话回答。C：选择正确语序并解释原因。',answer:'A. Heute fühle ich mich gut. Remove nicht to change “not well” to “well”.\n\nB. Mein Hals tut weh. Give the relevant symptom without repeating the headache.\n\nC. Deshalb gehe ich in die Apotheke. Deshalb takes the first position, so the verb gehe comes next.'},selfCheck:{en:'Without looking at the text, can you say you do not feel well, say your throat hurts, and explain why Deshalb connects the first two sentences?\nIf yes, you have learned something usable—not just read a translation.',zh:'不看原文，能否表达不舒服、说出喉咙疼，并理解 Deshalb 怎样连接前两句？能做到就已学到可用的表达，不必以记住多少术语来判断。'}}};
 const sampleEntry=node('a','打开药店教学示范 · 人工编写，不调用 API ↗',$('generate').parentElement);sampleEntry.href='intensive.html?sample=pharmacy';sampleEntry.target='_blank';sampleEntry.rel='noopener';sampleEntry.style.cssText='display:block;margin-top:16px';
 linaEntry.target='_blank';linaEntry.rel='noopener';
 if(!readerMode&&pageView==='create'){
  const importer=node('section','',$('generate').parentElement);$('generate').before(importer);
  node('h2','从 Word 导入原文',importer);
  node('p','仅支持 .docx，最大 5 MB。文件仅在本机提取，不发送给 AI；PDF 稍后支持。',importer).className='hint';
  const label=node('label','选择 Word 文件 ',importer),file=node('input','',label);file.type='file';file.accept='.docx';
  const status=node('p','',importer);status.setAttribute('role','status');
  const preview=node('div','',importer);preview.hidden=true;
  const pasteMode=node('button','或粘贴文本',importer);pasteMode.type='button';
  const pasteBox=node('div','',importer);pasteBox.hidden=true;
  const caption=node('label','粘贴原文',pasteBox);
  const editor=node('textarea','',pasteBox);editor.id='paste-source';caption.htmlFor=editor.id;editor.rows=7;
  const prepare=node('button','进入选段',pasteBox);prepare.type='button';
  const choices=node('div','',preview),count=node('p','',preview);
  $('text').hidden=true;$('text').required=false;$('text').previousElementSibling.hidden=true;
  $('submit').textContent='生成所选内容的精读';$('submit').disabled=true;
  let selections=[];
  const selected=()=>selections.filter(x=>x.box.checked).map(x=>x.field.value.trim()).join('\n\n');selectedSource=selected;
  const update=()=>{const n=selected().length;count.textContent=`已选 ${selections.filter(x=>x.box.checked).length} 段 · ${n} 字符 · 每次精读 10–3000 字符`;if(!$('submit').dataset.busy)$('submit').disabled=n<10||n>3000;};
  const rebuild=()=>{choices.replaceChildren();selections=[];editor.value.split(/\n+/).map(s=>s.trim()).filter(Boolean).forEach((text,i)=>{const card=node('section','',choices);card.className='segment-card';const row=node('label','',card),box=node('input','',row);box.type='checkbox';box.checked=editor.value.length<=3000;row.append(document.createTextNode(`第 ${i+1} 段`));const content=node('p',text,card),edit=node('button','编辑本段',card);edit.type='button';const field=node('textarea','',card);field.value=text;field.hidden=true;field.setAttribute('aria-label',`第 ${i+1} 段`);edit.onclick=()=>{field.hidden=!field.hidden;content.hidden=!field.hidden;edit.textContent=field.hidden?'编辑本段':'完成编辑';};field.oninput=()=>{content.textContent=field.value;update();};box.onchange=update;selections.push({box,field});});pasteBox.hidden=true;update();};
  if(params.get('from')==='home'){try{const draft=JSON.parse(sessionStorage.getItem('home-import-draft')||'null');if(draft&&Array.isArray(draft.paragraphs)&&draft.paragraphs.every(p=>typeof p==='string')){editor.value=draft.paragraphs.join('\n\n');rebuild();preview.hidden=false;status.textContent=draft.name+' · 请勾选本次要学习的段落。';sessionStorage.removeItem('home-import-draft');}}catch{status.textContent='未能恢复导入内容，请在此重新选择文件。';}}
  pasteMode.onclick=()=>{pasteBox.hidden=!pasteBox.hidden;};
  prepare.onclick=()=>{if(!editor.value.trim())return;if(selections.length&&!confirm('替换当前选段？已保存的文章不受影响。'))return;rebuild();preview.hidden=false;status.textContent='直接勾选并生成，不需要再次复制原文。';};
  file.onchange=async()=>{const chosen=file.files[0];if(!chosen)return;if(!/\.docx$/i.test(chosen.name)||chosen.size>5*1024*1024){status.textContent='请选择不超过 5 MB 的 .docx 文件。';file.value='';return;}if(selections.length&&!confirm('替换当前选段和编辑内容？已保存的精读不受影响。')){file.value='';return;}file.disabled=true;status.textContent='正在本机提取文字…';try{const result=await api('/api/import-docx',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:chosen});editor.value=result.paragraphs.join('\n\n');rebuild();preview.hidden=false;status.textContent=`${chosen.name} · 提取 ${result.paragraphs.length} 段。${result.notice}`;}catch(e){status.textContent=e.message+' 原有选段仍保留。';}finally{file.disabled=false;file.value='';}};
 }
 node('p','按句阅读，每句话下展开讲解。已保存文章在新标签页打开，不重复调用 AI。',$('generate')).className='hint';
 async function api(url,options){const r=await fetch(url,options);if(!r.headers.get('content-type')?.includes('application/json'))throw Error('请通过本机服务 http://127.0.0.1:4180/intensive.html 打开。');const x=await r.json();if(!r.ok)throw Error(x.error||'请求失败');return x;}
 const localKey=()=>`intensive-practice-${current.id}`;
 function persist(){if(!current)return;try{localStorage.setItem(localKey(),JSON.stringify({text:$('practice').value,position}));$('practice-status').textContent='练习与位置已保存在当前浏览器';}catch{$('practice-status').textContent='浏览器保存失败，请立即导出备份。';}}
 function splitExplanation(text,lang){
  // Protect punctuation before BOTH manual splitting and Intl sentence segmentation.
  const saved=[];let prefix='\uE000';while(text.includes(prefix))prefix+='\uE000';
  const protectedText=lang==='en'?text.replace(/\.{2,}|…|\b(?:e\.g\.|i\.e\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|vs\.|etc\.)|\b\d+(?:\.\d+)+/gu,match=>{saved.push(match);return prefix+(saved.length-1)+'\uE001';}):text;
  const prepared=lang==='en'?protectedText.replace(/\.\s+(?=[a-zäöüß])/gu,'.\n'):protectedText;
  const restore=value=>saved.reduce((s,original,i)=>s.split(prefix+i+'\uE001').join(original),value);
  return prepared.split(/\n+/).flatMap(line=>typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(lang,{granularity:'sentence'}).segment(line)].map(x=>restore(x.segment)):[restore(line)]);
 }
 function vocabularyKey(v){
  // Do not infer mastery or equate senses from lemma alone.
  const norm=x=>String(x||'').normalize('NFC').replace(/\s+/gu,' ').trim();
  return JSON.stringify([v.surface,v.lemma,v.en,v.zh,v.note?.en,v.note?.zh,v.example?.en,v.example?.zh].map(norm));
 }
 function paragraphs(text,parent,lang){
  const pieces=splitExplanation(text,lang);
  pieces.filter(x=>x.trim()).forEach(t=>{node('p',t.trim(),parent).className='result-text';});
 }
 function bilingual(pair,parent){const en=node('div','',parent);en.lang='en';paragraphs(pair.en,en,'en');const d=node('details','',parent);d.lang='zh-CN';node('summary','中文辅助',d);paragraphs(pair.zh,d,'zh');}
 function warning(item,parent){if(item.quoteStatus==='unverified')node('p','原文对应需核对：未匹配到相同文字，请对照原文。',parent).className='notice error';}
 function section(title){const labels={'In this lesson':'阅读目录','Today’s small goal':'今天的小目标','Read for the situation':'理解情境','Read and understand':'对照理解','Useful words':'重点词汇','How the sentences work':'句子拆解','Patterns you can use':'可以使用的表达','Make a small change':'动手练习','Check what you can do':'学习自测'};const part=node('section','',$('explanation'));part.dataset.part=$('explanation').children.length-1;part.id='reading-part-'+part.dataset.part;node('h2',labels[title]?title+' · '+labels[title]:title,part);return part;}
 function block(title,pair){const part=section(title);warning(pair,part);bilingual(pair,part);return part;}
 function renderLesson(lesson){
  $('result').querySelector('.notice').textContent=current.editorial?'人工编写教学示范 · 用于体验已确认的教学风格，不是 DeepSeek 自动生成结果。':'AI 生成，可能有误。例句是练习参考，不是自动评分；不确定的讲解请核实。';
  const menu=section('In this lesson');menu.className='lesson-menu';
  if(lesson.goal)block('Today’s small goal',lesson.goal);
  if(lesson.overview)block('Read for the situation',lesson.overview);
  if(lesson.schemaVersion===3){
   const language=({'德语':'de','英语':'en','日语':'ja','法语':'fr','西班牙语':'es'})[current.language]||'und';
   lesson.sentences.forEach((s,i)=>{const part=section(`Sentence ${i+1} · 第 ${i+1} 句`);renderLinaSentence(s,part,String(i+1)+'.',language);});
  }else if(lesson.guided){
   const translations=['Today I do not feel well.','That is why I am going to the pharmacy.','The pharmacist asks, “What seems to be the matter?”','I answer, “My head hurts, and my throat hurts too.”'];
   const groups=[[1,2],[3,4],[5],[6,7]];
   current.text.split('\n').forEach((quote,i)=>{
    const part=section(`Sentence ${i+1} · 第 ${i+1} 句`);part.dataset.sentence=i;node('blockquote',quote,part);node('p',translations[i],part).lang='en';
    groups[i].forEach(index=>{const item=lesson.guided[index];let target=part;if(item.optional){target=node('details','',part);node('summary',item.title,target);}else node('h3',item.title,part);bilingual(item,target);});
   });
   block(lesson.guided[8].title,lesson.guided[8]);
  }else if(lesson.schemaVersion===2){
   const seen=new Map(),usedChunks=new Set();
   lesson.sections.forEach((s,i)=>{
   const part=section(`Sentence ${i+1} · 第 ${i+1} 句`);part.dataset.sentence=i;
   const source=node('blockquote',s.quote,part);source.id='source-sentence-'+i;warning(s,part);bilingual(s.translation,part);
   node('h3','Words · 词语对应',part);const vocabulary=node('div','',part);let repeats=0;
   const repeated=node('details','',vocabulary);const summary=node('summary','查看已讲词汇',repeated);
   s.vocabulary.forEach(v=>{
    const key=vocabularyKey(v),first=seen.get(key);
    const duplicate=first!==undefined&&v.quoteStatus!=='unverified';
    const row=node('div','',duplicate?repeated:vocabulary);row.className='learning-item';
    if(duplicate){repeats++;node('p',`与第 ${first+1} 句相同的词义与讲解`,row).className='hint';}else{seen.set(key,i);}
    node('h3',v.surface,row);node('p','Dictionary form: '+v.lemma,row).className='hint';const link=node('a',`From sentence ${i+1} ↗`,row);link.href='#source-sentence-'+i;warning(v,row);node('h4','Meaning',row);bilingual(v,row);
    if(v.example){node('h4','Example',row);bilingual(v.example,row);}
    if(v.note){const extra=node('details','',row);node('summary','Optional usage note',extra);bilingual(v.note,extra);}
   });
   if(repeats){summary.textContent=`查看已讲词汇 · ${repeats} 条重复讲解`;vocabulary.append(repeated);}else{repeated.remove();}
   node('p','同词同讲解默认折叠；不同词形、意思或用法仍保留。仅作用于本篇，不代表你已掌握。',vocabulary).className='hint';
   if(s.grammar.length){node('h3','Understand the sentence · 理解这句话',part);s.grammar.forEach(g=>{const row=node('div','',part);row.className='learning-item';node('h4',g.title,row);bilingual(g,row);});}
   lesson.chunks.forEach((c,j)=>{if(!usedChunks.has(j)&&s.quote.includes(c.quote)){usedChunks.add(j);node('h3','Try it · 试着用一下',part);node('h4',c.expression,part);warning(c,part);bilingual(c,part);bilingual(c.example,part);}});
   });
   const unmatched=lesson.chunks.filter((c,j)=>!usedChunks.has(j));
   if(unmatched.length){const extra=section('Other expressions · 待核对的补充表达');node('p','These expressions could not be linked to a sentence automatically. Compare them with the original.',extra);unmatched.forEach(c=>{node('h3',c.expression,extra);node('p','Source wording: '+c.quote,extra);warning(c,extra);bilingual(c,extra);bilingual(c.example,extra);});}
  }else{
   const notice=section('旧版内容 · 保留原讲解');node('p','这篇是旧版生成结果：已按句分段，但未自动猜分翻译、词汇和语法，也没有重新调用 AI。新版分组适用于之后生成的精读。',notice).className='notice';
   lesson.sections.forEach((s,i)=>block(`第 ${i+1} 句 · ${s.quote}`,s));
   const chunks=section('重点表达 · 原有内容');lesson.chunks.forEach(c=>{const row=node('div','',chunks);row.className='learning-item';node('h3',c.quote,row);warning(c,row);bilingual(c,row);});
  }
  const exercise=block('Make a small change',lesson.exercise);
  const materials=lesson.exercise.materials;
  const hasMaterials=Array.isArray(materials)&&materials.length>0&&materials.length<=40&&materials.every(s=>typeof s==='string'&&s.trim().length>0&&s.length<16000);
  if(hasMaterials){
   node('h3','Your material · 题目材料',exercise);
   const materialList=node('ul','',exercise);materialList.lang=current.language==='德语'?'de':'';
   materials.forEach(s=>{node('li',s,materialList).className='result-text';});
   node('p','Write your attempt in the notes below, then compare. · 先在下方练习框作答，再看参考答案。',exercise).className='hint';
  }else if(lesson.schemaVersion===3){
   node('p','这道练习未提供独立的题目材料，可能无法完整作答。可以先跳过；原讲解和笔记仍保留，没有自动重新生成。',exercise).className='notice';
  }
  const answer=node('details','',exercise);node('summary',!hasMaterials&&lesson.schemaVersion===3?'Saved reference answer · 原有参考答案（题目待补全）':'Example answer — try first · 做完再看参考答案',answer);node('p',lesson.exercise.answer,answer).className='result-text';
  if(lesson.selfCheck)block('Check what you can do',lesson.selfCheck);
  [...$('explanation').children].slice(1).forEach(part=>{const a=node('a',part.querySelector('h2').textContent,menu);a.href='#'+part.id;});
 }
 function show(record){current=record;$('result').hidden=false;$('title').textContent=record.lesson.title;$('original').textContent=record.text;$('explanation').replaceChildren();$('explanation').lang='zh-CN';renderLesson(record.lesson);position=0;$('practice').value='';$('practice-status').textContent='';try{const p=JSON.parse(localStorage.getItem(localKey())||'{}');$('practice').value=typeof p.text==='string'?p.text:'';position=Number.isInteger(p.position)?p.position:0;}catch{$('practice-status').textContent='上次练习无法读取，请勿清理浏览器数据。';}$('result').scrollIntoView();}
 function renderList(){
  const query=($('article-search')?.value||'').normalize('NFC').toLocaleLowerCase().trim();
  let found=items.filter(r=>(r.lesson.title+' '+r.text).normalize('NFC').toLocaleLowerCase().includes(query));
  if(pageView==='home')found=found.slice(0,3);
  if($('resume-reading')){let last;try{last=localStorage.getItem('intensive-last-opened');}catch{}const record=items.find(r=>r.id===last);$('resume-reading').hidden=!record;if(record)$('resume-reading').href='intensive.html?lesson='+encodeURIComponent(record.id);}
  $('saved').replaceChildren();
  if(!found.length)node('p',query?'没有匹配的文章，请换个关键词。':'还没有保存的精读，点击「新建精读」开始。',$('saved'));
  found.forEach(item=>readingLink(item,$('saved')));
  if($('article-count'))$('article-count').textContent=query?`找到 ${found.length} 篇 / 共 ${items.length} 篇`:`共 ${items.length} 篇`;
 }
 async function list(){const x=await api('/api/lessons');items=x.items;renderList();}
 const pendingKey='intensive-unfinished-request';
 const resumeJob=node('button','继续未完成的精读',$('message').parentElement);resumeJob.type='button';resumeJob.hidden=true;
 function updateResume(){try{resumeJob.hidden=!localStorage.getItem(pendingKey);}catch{resumeJob.hidden=true;}}
 async function generateReading(text,language){
  if($('submit').dataset.busy)return;
  if(text.trim().length<10||text.trim().length>3000){say('请选择 10–3000 字符，可编辑段落缩短本次内容。');return;}
  const request=JSON.stringify({text,language});try{localStorage.setItem(pendingKey,request);}catch{}
  resumeJob.hidden=true;$('submit').disabled=true;$('submit').dataset.busy='true';say('正在解析第一部分；较长文章会自动分批，每部分最多等待约两分钟。关闭页面会暂停后续部分，回来后可继续。');
  try{
   let record;
   do{
    record=await api('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:request});
    if(record.pending)say(record.next==='summary'?`已保存 ${record.completed}/${record.total} 部分，正在整理整篇目标与练习…`:`已保存 ${record.completed}/${record.total} 部分，正在解析第 ${record.completed+1}/${record.total} 部分…`);
   }while(record.pending);
   try{if(localStorage.getItem(pendingKey)===request)localStorage.removeItem(pendingKey);}catch{}
   say(record.saveWarning||(record.cached?'已读取保存结果，没有重新生成。':'已生成并保存到本机。'));
   if(record.saveWarning){
    const backup=node('button','下载本次结果备份（保存失败，请勿重新生成）',$('message'));backup.type='button';
    backup.onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='精读-'+record.id.slice(0,8)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
   }else readingLink(record,$('message'),'在新标签页阅读 ↗');
   await list();
  }catch(err){say(err.message+' 已完成的分批结果会保留；继续可能产生 API 费用，不会自动重试。');}finally{delete $('submit').dataset.busy;const n=selectedSource?selectedSource().trim().length:$('text').value.trim().length;$('submit').disabled=n<10||n>3000;updateResume();}
 }
 $('generate').onsubmit=e=>{e.preventDefault();generateReading(selectedSource?selectedSource():$('text').value,$('language').value);};
 resumeJob.onclick=()=>{try{const request=JSON.parse(localStorage.getItem(pendingKey));if(request&&typeof request.text==='string')generateReading(request.text,request.language);}catch{say('未完成记录无法读取，请重新选择原文；服务端已成功的批次仍会复用。');}};
 updateResume();
 $('refresh').onclick=()=>list().catch(e=>say(e.message));$('practice').oninput=persist;
 $('continue').onclick=()=>{const sections=$('explanation').children;sections[Math.min(Math.max(0,position),sections.length-1)]?.scrollIntoView();};
 window.addEventListener('scroll',()=>{if(!current)return;const sections=[...$('explanation').children].filter(el=>el.getBoundingClientRect().top<100);if(sections.length){const next=Number(sections.at(-1).dataset.part);if(next!==position){position=next;persist();}}},{passive:true});
 $('export').onclick=()=>{if(!current)return;const blob=new Blob([JSON.stringify({...current,practice:$('practice').value,position},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='精读-'+current.id.slice(0,8)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 if(readerMode){
  const main=document.querySelector('main');
  [...main.children].forEach(el=>{el.hidden=el.id!=='result';});
  const top=document.querySelector('.top');top.replaceChildren();top.classList.add('reader-top');
  const back=node('a','← 文章库',top);back.href='intensive.html';
  const toggle=node('button','',top);toggle.type='button';toggle.setAttribute('aria-controls','reading-sidebar');
  const workspace=document.querySelector('.workspace'),sidebar=document.querySelector('.source');sidebar.id='reading-sidebar';
  let expanded=!matchMedia('(max-width:760px)').matches;
  const setOutline=()=>{workspace.classList.toggle('outline-closed',!expanded);sidebar.hidden=!expanded;toggle.textContent=expanded?'收起目录':'展开目录';toggle.setAttribute('aria-expanded',String(expanded));};toggle.onclick=()=>{expanded=!expanded;setOutline();};setOutline();
  const note=node('button','笔记 ↓',top);note.onclick=()=>$('practice').focus();
  $('result').prepend($('title'));
  const notice=$('result').querySelector(':scope > .notice');if(notice)$('result').append(notice);
  const originalShow=show;
  show=record=>{originalShow(record);try{if(!record.editorial)localStorage.setItem('intensive-last-opened',record.id);}catch{}const menu=$('explanation').querySelector('.lesson-menu');sidebar.querySelector('h2').textContent='原文 / 目录';if(menu){const nav=node('nav','',sidebar);nav.setAttribute('aria-label','阅读目录');sidebar.insertBefore(nav,$('original'));menu.querySelectorAll('a').forEach(a=>{const link=a.cloneNode(true);link.onclick=()=>{if(matchMedia('(max-width:760px)').matches){expanded=false;setOutline();}};nav.append(link);});menu.hidden=true;}};
  const status=node('p','正在读取已保存的精读…',main);status.setAttribute('role','status');main.insertBefore(status,$('result'));
  if(params.get('sample')==='pharmacy'){show(pharmacySample);document.title=pharmacySample.lesson.title;status.textContent='人工编写示范 · 不调用 API';}
  else if(!/^[a-f0-9]{64}$/.test(lessonId||'')){status.textContent='文章地址无效，请返回文章库重新打开。';}
  else api('/api/lessons').then(x=>{const record=x.items.find(r=>r.id===lessonId);if(!record){status.textContent='未找到这篇文章，请返回文章库。已保存的其他文章不受影响。';return;}show(record);document.title=record.lesson.title;status.textContent='已读取保存结果 · 不调用 AI · 本篇笔记独立保存';}).catch(()=>{status.textContent='暂时无法读取文章，请确认本机服务已启动，然后刷新。本页不会自动调用 AI。';});
  return;
 }
 const main=document.querySelector('main'),heading=main.querySelector('h1'),entry=document.querySelector('.entry'),savedSection=document.querySelector('.saved');
 main.classList.add('library-main');
 document.querySelector('.top').replaceChildren();
 const home=node('a','← 学习首页',document.querySelector('.top'));home.href='index.html';
 const library=node('a','文章库',document.querySelector('.top'));library.href='intensive.html';
 const settingsLink=node('a','我的 · API 设置',document.querySelector('.top'));settingsLink.href='settings.html';
 heading.textContent=pageView==='home'?'从一篇文章，开始精读。':pageView==='create'?'新建精读':'我的精读';document.title=heading.textContent;
 const actions=node('div','',main);actions.className='page-actions';heading.after(actions);
 const add=node('a','＋ 新建精读',actions);add.href='intensive.html?view=create';add.className='main-action';
 entry.hidden=pageView!=='create';savedSection.hidden=pageView==='create';
 if(pageView==='create'){add.hidden=true;linaEntry.hidden=true;sampleEntry.hidden=true;}
 if(pageView==='library'){
  const label=node('label','搜索标题或原文',savedSection),search=node('input','',savedSection);search.type='search';search.id='article-search';search.className='library-search';search.placeholder='搜索标题或原文…';label.htmlFor=search.id;
  savedSection.insertBefore(label,$('refresh'));savedSection.insertBefore(search,$('refresh'));search.oninput=renderList;
  const count=node('span','',savedSection);count.id='article-count';savedSection.insertBefore(count,$('saved'));
 }
 if(pageView==='home'){
  const resume=node('a','继续上次阅读',actions);resume.id='resume-reading';resume.hidden=true;resume.target='_blank';resume.rel='noopener';
  const date=node('p','',main);heading.before(date);const updateDate=()=>date.textContent=new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});updateDate();setInterval(updateDate,60000);
  savedSection.querySelector('h2').textContent='最近学习';
  const all=node('a','查看全部文章 →',savedSection);all.href='intensive.html';
  const legacy=node('details','',main);node('summary','其他学习工具',legacy);const old=node('a','计划与记录',legacy);old.href='index.html?legacy=1';
  const example=node('a','认识 Lina · 示例',legacy);example.href='reading.html';example.style.display='block';
 }
 api('/api/status').then(x=>{$('connection').textContent=x.configured?`本机服务已连接 · ${x.model}`:'尚未配置密钥，请点击顶部“我的 · API 设置”。';return list();}).catch(()=>{$('connection').textContent='无法读取文章库，请确认“启动精读.command”正在运行后刷新。';});
})();
