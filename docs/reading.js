(() => {
  const key='reading-key-demo-lina-v1', $=id=>document.getElementById(id);
  let data={}, failed=false;
  try {const value=JSON.parse(localStorage.getItem(key)||'{}'); if(value&&typeof value==='object')data=value;} catch {failed=true;}
  const headings=[...document.querySelectorAll('#lesson h2,#lesson h3')];
  headings.forEach((h,i)=>{h.id='lesson-'+i;});
  const sentences=['Hallo!','Ich heiße Lina.','Ich komme aus China.','Ich wohne in Berlin.','Ich lerne Deutsch.','Jeden Tag lerne ich zehn Minuten.'];
  let current=headings.some(h=>h.id===data.position)?data.position:headings[0].id;
  const previous=current;
  function save(){
    data={version:1,position:current,writing:$('writing').value,note:$('note').value,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(key,JSON.stringify(data));$('status').textContent='已保存到当前浏览器 · '+new Date().toLocaleTimeString('zh-CN');failed=false;}
    catch{failed=true;$('status').textContent='浏览器无法保存，请先导出练习，避免关闭后丢失。';}
  }
  function go(id){current=id;document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});save();}
  sentences.forEach((sentence,i)=>{const button=document.createElement('button');button.textContent=sentence;button.dataset.target=headings.filter(h=>h.tagName==='H3')[i].id;button.onclick=()=>go(button.dataset.target);$('sentences').append(button);});
  headings.filter(h=>h.tagName==='H2').forEach(h=>{const link=document.createElement('a');link.textContent=h.textContent;link.href='#'+h.id;link.onclick=e=>{e.preventDefault();go(h.id);};$('outline').append(link);});
  $('writing').value=typeof data.writing==='string'?data.writing:'';
  $('note').value=typeof data.note==='string'?data.note:'';
  ['writing','note'].forEach(id=>$(id).addEventListener('input',save));
  $('save').onclick=save;
  $('resume').onclick=()=>go(previous);
  $('resume').textContent=data.position?'继续上次 · '+document.getElementById(previous).textContent:'开始阅读';
  if(failed)$('status').textContent='无法读取上次记录。你仍可以阅读；请导出练习保留备份。';
  else if(data.position)$('status').textContent='上次读到：'+document.getElementById(previous).textContent+'。点击“继续上次”回到那里。';
  let pending=false;
  window.addEventListener('scroll',()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;const passed=headings.filter(h=>h.getBoundingClientRect().top<window.innerHeight*.4);const h=passed.at(-1);if(h&&h.id!==current){current=h.id;save();}document.querySelectorAll('#sentences button').forEach(b=>{const active=b.dataset.target===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});});},{passive:true});
  window.addEventListener('pagehide',save);
  $('export').onclick=()=>{save();const text='# Meet Lina · 我的精读练习\n\n原文：'+sentences.join(' ')+'\n\n阅读位置：'+document.getElementById(current).textContent+'\n\n## 我的介绍\n\n'+data.writing+'\n\n## 我的笔记\n\n'+data.note;const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Lina-精读练习.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
})();
