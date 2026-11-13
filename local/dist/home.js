(() => {
 const query=new URLSearchParams(location.search);
 if(query.has('legacy')||location.hash){location.replace('workspace.html'+location.search+location.hash);return;}
 const $=id=>document.getElementById(id);
 const el=(tag,text,parent,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;parent.append(n);return n;};
 const link=(text,url,parent,cls)=>{const n=el('a',text,parent,cls);n.href=url;return n;};
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
 const raw=key=>{try{return localStorage.getItem(key);}catch{return null;}};
 const key=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 const fmt=(d,options)=>new Intl.DateTimeFormat('en-US',options).format(d);
 function localData(){
  let state;try{state=JSON.parse(localStorage.getItem('deutsch-os-v1')||'{}');}catch{$('status').textContent='本地计划暂时无法读取，原数据未改动。';return {sources:[],sessions:[]};}
  return {sources:state.sources||state.materials||[],sessions:state.sessions||(state.tasks||[]).map(t=>({...t,status:t.completed?'completed':'planned'}))};
 }
 function dashboard(){
  const now=new Date(),today=key(now),monday=new Date(now.getFullYear(),now.getMonth(),now.getDate()-((now.getDay()+6)%7),12);
  $('date').textContent=fmt(now,{weekday:'short',month:'short',day:'numeric'});$('date').dateTime=today;
  const dates=Array.from({length:7},(_,i)=>new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+i,12));
  $('week-range').textContent=fmt(dates[0],{month:'short',day:'numeric'})+' — '+fmt(dates[6],{month:'short',day:'numeric'});
  const {sources,sessions}=localData(),rows=sessions.filter(s=>s.status!=='cancelled'&&(s.status==='planned'||s.plannedDate||s.planSlot));
  const weekly=rows.filter(s=>dates.some(d=>key(d)===(s.plannedDate||s.date)));
  $('plan-count').textContent=weekly.length?'本周 '+weekly.filter(s=>s.status==='completed').length+' / '+weekly.length+' 项':'本周暂无安排';
  $('week').replaceChildren();
  dates.forEach(d=>{const date=key(d),tasks=rows.filter(s=>(s.plannedDate||s.date)===date),a=link('', 'workspace.html?date='+date+'#plan',$('week'),'day'+(date===today?' today':''));el('time',fmt(d,{weekday:'short',month:'short',day:'numeric'}),a).dateTime=date;if(date===today)a.setAttribute('aria-current','date');el('p',tasks[0]?.title||'暂无安排',a,tasks.length?'':'muted');if(tasks.length>1)el('p','共 '+tasks.length+' 项',a,'extra');else if(date===today)el('p','今天',a,'extra');});
  $('source-count').textContent=sources.length+' 个';$('sources').replaceChildren();
  const used=s=>Math.max(Number(s.updatedAt)||0,...sessions.filter(r=>r.sourceId===s.id).map(r=>Number(r.updatedAt)||0));
  [...sources].sort((a,b)=>used(b)-used(a)).slice(0,3).forEach(s=>{const a=link('','workspace.html#materials',$('sources'),'source-row');el('span',s.title||'未命名来源',a);el('small',s.type||'学习材料',a);});
  if(!sources.length){const p=el('p','还没有来源 · ',$('sources'),'muted');link('＋ 添加','workspace.html?add=source#materials',p);}
 }
 async function loadReading(){
  const box=$('continue');
  try{
   const response=await fetch('/api/lessons');if(!response.ok)throw Error();const {items}=await response.json();if(!Array.isArray(items))throw Error();
   $('lesson-count').textContent=items.length+' 篇';box.replaceChildren();
   const current=items.find(r=>r.id===raw('intensive-last-opened'));
   if(current){
    const lesson=current.lesson,notes=read('intensive-practice-'+current.id,{}),sentences=lesson.sentences||lesson.sections||[];
    const offset=1+Number(Boolean(lesson.goal))+Number(Boolean(lesson.overview));
    const pos=Number.isInteger(notes.position)?notes.position:0,index=pos-offset;
    el('p','继续上次 · '+current.language,box,'muted');el('h1',lesson.title,box);
    if(index>=0&&index<sentences.length){el('p','第 '+(index+1)+' 句 / 共 '+sentences.length+' 句',box,'muted');el('blockquote',sentences[index].quote||'',box,'quote');}
    else el('p',sentences.length?'共 '+sentences.length+' 句 · 将回到上次阅读位置':'已保存的精读 · 将回到上次阅读位置',box,'muted');
    if(notes.text)el('p','上次笔记 · '+String(notes.text).split('\n').find(s=>s.trim()),box,'note');
    const a=link('接着读 →','intensive.html?lesson='+encodeURIComponent(current.id),box,'outline');a.target='_blank';a.rel='noopener';
   }else{
    el('p',items.length?'已有 '+items.length+' 篇精读，等待你打开':'还没有文章',box,'muted');
    el('h1','放一篇文章进来，它会拆成逐句讲解。',box);
    const drop=el('button','',box,'drop');drop.type='button';el('span','拖入 .docx，或点击选择文件',drop);el('small','选择后进入选段，不会直接调用 AI',drop);
    const file=el('input','',box);file.type='file';file.accept='.docx';file.hidden=true;drop.onclick=()=>file.click();
    const upload=async f=>{if(!f)return;if(!/\.docx$/i.test(f.name)||f.size>5*1024*1024){$('status').textContent='请选择不超过 5 MB 的 .docx 文件。';return;}drop.disabled=true;$('status').textContent='正在本机提取文字…';try{const r=await fetch('/api/import-docx',{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:f});const data=await r.json();if(!r.ok)throw Error(data.error||'提取失败');sessionStorage.setItem('home-import-draft',JSON.stringify({name:f.name,paragraphs:data.paragraphs}));location.href='intensive.html?view=create&from=home';}catch(e){$('status').textContent=e.message+'。也可以点击左侧“新建精读”直接导入。';drop.disabled=false;}};
    file.onchange=()=>upload(file.files[0]);drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag');};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');upload(e.dataTransfer.files[0]);};
    const p=el('p','也可以 ',box,'hint');link('直接粘贴文本','intensive.html?view=create',p);p.append(' · 没有自己的材料？');const a=link('看一篇示例 ↗','reading.html',p);a.target='_blank';a.rel='noopener';el('p','生成时使用你自己的 API；已保存文章可以直接阅读。',box,'hint');
    if(items.length)link('打开我的精读 →','intensive.html',box,'outline');
   }
  }catch{$('lesson-count').textContent='暂不可读';box.replaceChildren();el('h1','精读，从自己的材料开始。',box);el('p','文章库暂时无法读取，请确认本机服务正在运行。原有文章未被删除。',box,'muted');const retry=el('button','重新读取',box,'outline');retry.onclick=loadReading;}
 }
 const splitter=$('splitter');let width=176;
 function resize(n,save=true){width=Math.max(148,Math.min(260,n));document.documentElement.style.setProperty('--side',width+'px');splitter.setAttribute('aria-valuenow',String(width));if(save)try{localStorage.setItem('home-split-width',String(width));}catch{}}
 resize(Number(raw('home-split-width'))||176,false);
 splitter.onpointerdown=e=>{if(matchMedia('(max-width:767px)').matches)return;e.preventDefault();splitter.setPointerCapture(e.pointerId);document.body.classList.add('resizing');};
 splitter.onpointermove=e=>{if(splitter.hasPointerCapture(e.pointerId))resize(e.clientX-document.querySelector('.layout').getBoundingClientRect().left);};
 const end=()=>document.body.classList.remove('resizing');splitter.onpointerup=end;splitter.onpointercancel=end;splitter.onlostpointercapture=end;
 splitter.ondblclick=()=>resize(176);splitter.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();resize(width+(e.key==='ArrowLeft'?-8:8));}};
 dashboard();loadReading();requestAnimationFrame(()=>{const d=document.querySelector('.day.today');if(d)$('week').scrollLeft=Math.max(0,d.offsetLeft-$('week').offsetLeft-100);});
 window.addEventListener('storage',()=>{dashboard();loadReading();});window.addEventListener('focus',dashboard);setInterval(dashboard,60000);
})();
