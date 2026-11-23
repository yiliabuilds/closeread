(() => {
 if(!new URLSearchParams(location.search).has('lesson'))return;
 const add=(tag,text,parent)=>{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e;};
 const css=add('style',`#word-panel{position:fixed;right:24px;bottom:24px;width:min(380px,calc(100vw - 32px));max-height:70dvh;overflow:auto;background:#f6f7f9;color:#263b53;border:1px solid #b4c3d2;border-radius:4px;padding:20px;z-index:30;font:15px/1.7 "PingFang SC",sans-serif;box-shadow:0 6px 28px #20385818}#word-panel h2{font-size:21px;margin:8px 0;overflow-wrap:anywhere}#word-panel p{overflow-wrap:anywhere}#word-panel button,#word-list button{min-height:44px;border-radius:3px}#word-panel .word-close{float:right;border:0;background:transparent}#word-panel .word-help{font-size:13px;color:#64748b}#word-list{margin-top:36px;border-top:1px solid #d4dde7;padding-top:18px}#word-list article{padding:16px 0;border-bottom:1px solid #d4dde7}#word-list h3{font-size:18px}#word-panel [hidden]{display:none!important}`,document.head);
 const panel=add('section','',document.body);panel.id='word-panel';panel.hidden=true;panel.setAttribute('aria-label','上下文查词');
 const close=add('button','关闭 ×',panel);close.className='word-close';
 const title=add('h2','',panel),contextView=add('p','',panel);contextView.className='word-help';
 const hint=add('p','点击查询将把选词和所在原文片段发送给 DeepSeek，使用你的 API。',panel);hint.className='word-help';
 const query=add('button','查询词义',panel),status=add('p','',panel);status.setAttribute('role','status');
 const result=add('div','',panel),save=add('button','保存生词',panel);save.hidden=true;
 let selected=null,answer=null,pending=false,cache=new Map();
 const record=()=>window.CloseReadLookupRecord;
 const key=()=>`closeread-vocabulary-${record().id}`;
 const removed=()=>['trash','purge'].includes(localStorage.getItem('closeread-removed-'+record().id));
 function read(){const x=JSON.parse(localStorage.getItem(key())||'{"words":[]}');if(!Array.isArray(x.words))throw Error('生词数据无法读取');return x;}
 function showAnswer(value){answer=value;result.replaceChildren();add('h3',value.lemma,result);add('p',value.meaning,result);add('p',value.explanation,result);const help=add('details','',result);add('summary','中文辅助',help);add('p',value.chinese,help);save.hidden=false;}
 function pick(){
  if(pending)return;const s=getSelection();if(!s||s.isCollapsed||!record())return;
  const word=s.toString().trim();if(!word||word.length>100)return;
  const el=s.anchorNode?.nodeType===1?s.anchorNode:s.anchorNode?.parentElement;
  const source=el?.closest('[data-lookup-source],#original,#explanation blockquote');
  if(!source||!source.contains(s.focusNode))return;
  const context=source.dataset.lookupSource||source.textContent;
  if(context.length>3000||!context.includes(word))return;
  selected={word,context,language:record().language};answer=null;title.textContent=word;contextView.textContent=context;result.replaceChildren();save.hidden=true;status.textContent='';panel.hidden=false;panel.scrollTop=0;
  const cached=cache.get(JSON.stringify(selected));if(cached){showAnswer(cached);status.textContent='本页已查过，未再次调用 API。';}
 }
 document.addEventListener('pointerup',e=>{if(!panel.contains(e.target))setTimeout(pick,0);});document.addEventListener('keyup',e=>{if(e.key==='Shift'||e.key.startsWith('Arrow'))pick();if(e.key==='Escape')panel.hidden=true;});
 close.onclick=()=>{panel.hidden=true;};
 query.onclick=async()=>{
  if(pending||!selected)return;
  if(answer){status.textContent='已显示查询结果，不重复调用 API。';return;}
  pending=true;query.disabled=true;status.textContent='正在查词…';
  try{
   if(removed())throw Error('文章已移入回收站，请先恢复。');
   const cfg=await fetch('/api/settings');if(!cfg.ok)throw Error('请确认本机服务已启动。');const {token}=await cfg.json();
   const r=await fetch('/api/lookup',{method:'POST',headers:{'Content-Type':'application/json','X-Settings-Token':token},body:JSON.stringify(selected)});
   const x=await r.json();if(!r.ok)throw Error(x.error||'查询失败，请重启新版服务。');
   showAnswer(x);cache.set(JSON.stringify(selected),x);status.textContent='AI 释义，请结合原句核对。';
  }catch(e){status.textContent=e.message+' 未自动重试。';}finally{pending=false;query.disabled=false;}
 };
 save.onclick=()=>{try{if(!answer||removed())throw Error('文章不可保存，请返回文章库核对。');const data=read();const found=data.words.find(w=>w.word===selected.word&&w.context===selected.context);if(found)delete found.removedAt;else data.words.push({...selected,...answer,createdAt:new Date().toISOString()});localStorage.setItem(key(),JSON.stringify(data));status.textContent='已保存到本篇生词，完整备份会包含它。';renderWords();}catch(e){status.textContent='保存失败：'+e.message;}};
 let list;
 function renderWords(){if(!record())return;if(!list){list=add('details','',document.querySelector('main'));list.id='word-list';}
  list.replaceChildren();try{const data=read(),active=data.words.filter(w=>!w.removedAt);add('summary',`本篇生词 · ${active.length}`,list);const link=add('a','查看本篇生词与笔记',list);link.href='vocabulary.html?article='+encodeURIComponent(record().id);link.target='_blank';link.rel='noopener';for(const w of active){const row=add('article','',list);add('h3',w.word+' · '+w.lemma,row);add('p',w.meaning,row);add('p',w.context,row);const help=add('details','',row);add('summary','查看讲解与中文辅助',help);add('p',w.explanation,help);add('p',w.chinese,help);}}catch{add('summary','本篇生词无法读取，请勿清理浏览器数据',list);}}
 const observer=new MutationObserver(()=>{if(record()){renderWords();observer.disconnect();const help=add('p','选中原文中的词或短语即可查词；点击查询才调用 API。',document.querySelector('.tools')||document.querySelector('main'));help.style.cssText='font-size:14px;color:#64748b';}});
 observer.observe(document.querySelector('#explanation'),{childList:true});if(record()){renderWords();observer.disconnect();}
 window.addEventListener('storage',e=>{if(record()&&e.key===key())renderWords();if(record()&&e.key==='closeread-removed-'+record().id){panel.hidden=true;if(e.newValue==='purge')list?.replaceChildren();}});
})();
