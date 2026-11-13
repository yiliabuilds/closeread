(() => {
 const $=id=>document.getElementById(id),now=new Date();
 const fmt=d=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric'}).format(d);
 $('date').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'}).format(now);
 $('lesson-count').textContent='1 篇示例';$('source-count').textContent='浏览器本地';
 $('continue').innerHTML='<p class="muted">v0.1 · 在线展示版</p><h1>读懂一句，再向前一步。</h1><p>用英语理解德语，需要时展开中文辅助。从 Lina 的自我介绍开始，体验逐句讲解、练习和笔记。</p><blockquote class="quote">Ich heiße Lina.<br><small>My name is Lina.</small></blockquote><a class="outline" href="reading.html">开始阅读 →</a><p class="hint">固定教学示例，不调用 AI、不需要密钥。<a href="about.html#local">自己的文章？了解完整本地版 →</a></p>';
 const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate()-(now.getDay()+6)%7,12),dates=Array.from({length:7},(_,i)=>new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+i,12));
 const key=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 $('week-range').textContent=fmt(dates[0])+' — '+fmt(dates[6]);
 let state={};try{state=JSON.parse(localStorage.getItem('reading-key-demo-planner-v1')||'{}');}catch{$('status').textContent='未能读取本地计划，请勿清理数据。';}
 const rows=(state.sessions||[]).filter(r=>r.status!=='cancelled'&&(r.status==='planned'||r.plannedDate||r.planSlot));
 $('plan-count').textContent='可体验自动排课';
 dates.forEach(d=>{const a=document.createElement('a');a.className='day'+(key(d)===key(now)?' today':'');a.href='workspace.html?date='+key(d)+'#plan';const t=document.createElement('time');t.textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'}).format(d);a.append(t);const p=document.createElement('p');p.textContent=rows.find(r=>(r.plannedDate||r.date)===key(d))?.title||'暂无安排';a.append(p);$('week').append(a);});
 $('sources').innerHTML='<p class="muted">学习计划可选择 Nicos Weg、简易德语新闻等外部资源。</p><a class="outline" href="workspace.html#plan">体验学习计划 →</a>';
 const s=$('splitter');let width=176;try{width=Number(localStorage.getItem('reading-key-demo-split'))||176;}catch{}
 const resize=n=>{width=Math.max(148,Math.min(260,n));document.documentElement.style.setProperty('--side',width+'px');s.setAttribute('aria-valuenow',width);try{localStorage.setItem('reading-key-demo-split',width);}catch{}};
 resize(width);s.onpointerdown=e=>{e.preventDefault();s.setPointerCapture(e.pointerId);};s.onpointermove=e=>{if(s.hasPointerCapture(e.pointerId))resize(e.clientX-document.querySelector('.layout').getBoundingClientRect().left);};s.ondblclick=()=>resize(176);s.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();resize(width+(e.key==='ArrowLeft'?-8:8));}};
 requestAnimationFrame(()=>{const d=document.querySelector('.today');if(d)$('week').scrollLeft=Math.max(0,d.offsetLeft-$('week').offsetLeft-100);});
})();
