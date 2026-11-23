(() => {
 const $=id=>document.getElementById(id),S=window.CloseReadVocabulary;
 const add=(tag,text,parent)=>{const e=document.createElement(tag);e.textContent=text;parent.append(e);return e;};
 const params=new URLSearchParams(location.search),selected=params.get('article'),all=params.get('all')==='1';
 const detail=!!selected&&/^[a-f0-9]{64}$/.test(selected),collection=!detail&&!all;
 let articles=new Map(),serviceNote='',working=false,notesOpen=false;
 const noteKey=id=>'intensive-practice-'+id;
 function note(id){const x=JSON.parse(localStorage.getItem(noteKey(id))||'{"text":"","position":0}');if(typeof x.text!=='string'||!Number.isInteger(x.position)||x.position<0)throw Error('笔记数据异常，请勿清理浏览器数据。');return x;}
 function writable(){return detail&&articles.has(selected)&&!['trash','purge'].includes(localStorage.getItem('closeread-removed-'+selected));}
 function syncNote(){try{$('article-note').value=note(selected).text;$('article-note').disabled=!writable();$('note-status').textContent=writable()?'与阅读页使用同一份笔记，输入后自动保存。':'文章暂不可编辑，请检查本机服务或先恢复文章。';}catch(e){$('article-note').disabled=true;$('note-status').textContent=e.message;}}
 $('article-note').oninput=()=>{try{if(!writable())throw Error('文章已不可编辑');const latest=note(selected);localStorage.setItem(noteKey(selected),JSON.stringify({...latest,text:$('article-note').value}));$('note-status').textContent='已保存，与阅读页同步。';}catch(e){$('note-status').textContent='保存失败，请复制保留文字：'+e.message;}};
 function switchTab(value){notesOpen=value;$('tab-notes').setAttribute('aria-pressed',String(value));$('tab-words').setAttribute('aria-pressed',String(!value));$('note-area').hidden=!value;$('word-tools').hidden=value;$('words').hidden=value;$('count').hidden=value;if(value)syncNote();}
 $('tab-words').onclick=()=>switchTab(false);$('tab-notes').onclick=()=>switchTab(true);
 $('article-detail').hidden=!detail;
 if(detail){$('page-title').textContent='本篇生词与笔记';$('read-article').href='intensive.html?lesson='+selected;}
 else if(all)$('page-title').textContent='全部生词';
 $('removed').parentElement.hidden=collection;
 $('search-label').textContent=collection?'搜索文章或生词':'搜索词语、释义或原句';

 function render(){
  $('words').replaceChildren();let data;try{data=S.all(localStorage);}catch{$('status').textContent='浏览器暂时无法读取生词，请勿清理数据。';return;}
  const query=$('search').value.trim().toLocaleLowerCase(),removed=$('removed').checked;
  if(detail){$('article-name').textContent=articles.get(selected)?.lesson.title||'来源文章暂不可用';$('read-article').hidden=!writable();if(!writable())$('article-note').disabled=true;}
  if(collection){
   const ids=new Set(articles.keys());data.words.forEach(w=>ids.add(w.articleId));
   for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^intensive-practice-[a-f0-9]{64}$/.test(k))ids.add(k.slice('intensive-practice-'.length));}
   let count=0;
   for(const id of ids){
    if(localStorage.getItem('closeread-removed-'+id)==='purge')continue;
    const title=articles.get(id)?.lesson.title||'来源文章暂不可用 · '+id.slice(0,8),words=data.words.filter(w=>w.articleId===id&&!w.removedAt);
    let hasNote=false,noteError=false;try{hasNote=!!note(id).text.trim();}catch{noteError=true;}
    if(query&&![title,...words.flatMap(w=>[w.word,w.meaning,w.chinese,w.context])].join(' ').toLocaleLowerCase().includes(query))continue;
    const row=add('article','',$('words'));row.className='word-row';const link=add('a',title,row);link.href='vocabulary.html?article='+id;link.style.fontSize='20px';
    add('p',`${words.length} 个生词 · ${noteError?'笔记读取异常':hasNote?'有笔记':'暂无笔记'}`,row).className='meta';count++;
   }
   $('count').textContent=`${count} 篇文章`;$('status').textContent=serviceNote;
   if(!count)add('p',query?'没有找到匹配文章。':'还没有文章。先导入一篇材料，或保存生词与笔记。',$('words'));
   return;
  }
  const scoped=data.words.filter(w=>!detail||w.articleId===selected);
  const found=scoped.filter(w=>!!w.removedAt===removed&&[w.word,w.lemma,w.meaning,w.chinese,w.context,articles.get(w.articleId)?.lesson?.title||''].join(' ').toLocaleLowerCase().includes(query)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  $('count').textContent=`${removed?'已移除':'已保存'} ${scoped.filter(w=>!!w.removedAt===removed).length} 条 · 当前显示 ${found.length} 条`;
  $('status').textContent=[data.errors.length?`${data.errors.length} 组生词读取异常，已保留原数据。`:'',serviceNote].filter(Boolean).join(' ');
  if(!found.length)add('p',query?'没有匹配的生词，试试其他关键词。':removed?'暂无移除的生词。':'还没有保存生词。打开自己的精读文章，选词查询后点击“保存生词”。',$('words'));
  for(const w of found){
   const row=add('article','',$('words'));row.className='word-row';const head=add('div','',row);head.className='word-head';add('h2',w.word,head);
   const action=add('button',removed?'恢复':'移除',head);action.disabled=working;action.setAttribute('aria-label',`${removed?'恢复':'移除'}生词 ${w.word}`);
   action.onclick=async()=>{if(working)return;working=true;action.disabled=true;try{const ok=removed||await CloseReadData.confirmAction(`将“${w.word}”从生词本移除？可在“查看已移除”中恢复。原文与笔记保留。`);if(ok)S.change(localStorage,w,!removed);}catch(e){serviceNote='操作未完成：'+e.message;}finally{working=false;render();}};
   add('p',w.lemma+' · '+w.language,row).className='meta';add('p',w.meaning,row);add('blockquote',w.context,row);
   const details=add('details','',row);add('summary','讲解与中文辅助',details);add('p',w.explanation,details);const help=add('details','',details);add('summary','中文辅助',help);add('p',w.chinese,help);
   const source=articles.get(w.articleId);const state=localStorage.getItem('closeread-removed-'+w.articleId);
   if(source&&!['trash','purge'].includes(state)){const link=add('a',`回到文章 · ${source.lesson.title}`,row);link.href='intensive.html?lesson='+encodeURIComponent(w.articleId);link.target='_blank';link.rel='noopener';}
   else add('p','来源文章暂不可打开；若已移入回收站，请先恢复文章。',row).className='meta';
  }
 }
 async function refresh(){try{const r=await fetch('/api/lessons');if(!r.ok)throw Error();const x=await r.json();articles=new Map(x.items.map(a=>[a.id,a]));serviceNote='';}catch{serviceNote='暂未连接文章库，生词仍可查看；回到原文需启动本机服务。';}render();if(detail&&notesOpen)syncNote();}
 $('search').oninput=render;$('removed').onchange=render;$('refresh').onclick=refresh;
 window.addEventListener('storage',e=>{if(!e.key||e.key.startsWith('closeread-vocabulary-')||e.key.startsWith('closeread-removed-')||e.key.startsWith('intensive-practice-')){render();if(detail&&notesOpen)syncNote();}});
 render();refresh();
})();
