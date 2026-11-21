// Shared only by local pages. Never collects API settings or arbitrary storage.
window.CloseReadData=(()=>{
 const keys=new Set(['deutsch-os-v1','deutsch-os-reading-lina-v1','intensive-last-opened']);
 const allowed=k=>keys.has(k)||/^intensive-practice-[a-f0-9]{64}$/.test(k);
 const tombstone=id=>'closeread-removed-'+id;
 function confirmAction(message){return new Promise(resolve=>{
  const previous=document.activeElement,dialog=document.createElement('dialog');dialog.style.cssText='max-width:480px;width:calc(100% - 64px);padding:24px;border:1px solid #ccc;border-radius:14px;background:#f6f3ed;color:#17322f';
  const title=document.createElement('h2');title.textContent='确认操作';const titleId='data-confirm-title';title.id=titleId;dialog.setAttribute('aria-labelledby',titleId);const p=document.createElement('p');p.textContent=message;
  const cancel=document.createElement('button');cancel.textContent='取消';const accept=document.createElement('button');accept.textContent='确认';for(const b of [cancel,accept])b.style.cssText='min-height:44px;margin:8px';
  let accepted=false;cancel.onclick=()=>dialog.close();accept.onclick=()=>{accepted=true;dialog.close();};dialog.onclose=()=>{dialog.remove();previous?.focus();resolve(accepted);};dialog.append(title,p,cancel,accept);document.body.append(dialog);dialog.showModal();cancel.focus();
 });}
 async function request(route,body){
  const settings=await fetch('/api/settings');if(!settings.ok)throw Error('请重启新版本机服务后再试。');
  const {token}=await settings.json();
  const r=await fetch('/api/data/'+route,{method:body?'POST':'GET',headers:{'X-Settings-Token':token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const x=await r.json();if(!r.ok)throw Error(x.error||'操作未完成');return x;
 }
 function snapshot(){const values={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(allowed(k))values[k]=localStorage.getItem(k);}return values;}
 function validateBrowser(values){
  if(!values||typeof values!=='object'||Array.isArray(values))throw Error('备份缺少浏览器数据');
  for(const [k,v] of Object.entries(values)){
   if(!allowed(k)||typeof v!=='string')throw Error('备份包含不支持的浏览器字段');
   if(k==='intensive-last-opened'){if(!/^[a-f0-9]{64}$/.test(v))throw Error('阅读位置编号无效');continue;}
   const x=JSON.parse(v);if(!x||typeof x!=='object'||Array.isArray(x))throw Error('浏览器数据格式无效');
   if(k.startsWith('intensive-practice-')&&(typeof x.text!=='string'||!Number.isInteger(x.position)||x.position<0))throw Error('笔记数据无效');
   if(k==='deutsch-os-v1'){
    for(const name of ['materials','tasks','notes','reviews'])if(!Array.isArray(x[name]))throw Error('计划备份缺少字段');
    if(x.coreVersion===1)for(const name of ['sources','sessions','artifacts'])if(!Array.isArray(x[name]))throw Error('学习记录备份缺少字段');
    const inspect=o=>{if(!o||typeof o!=='object')return;for(const [key,value] of Object.entries(o)){if(['__proto__','prototype','constructor'].includes(key))throw Error('备份包含非法字段');if(/^(id|sourceId|materialId|sessionId|taskId)$/.test(key)&&value!=null&&value!==''&&(typeof value!=='string'||!/^[a-zA-Z0-9_-]+$/.test(value)))throw Error('计划编号无效');if(['url','sourceURL'].includes(key)&&value&&!/^https?:\/\//i.test(value))throw Error('备份包含不安全的链接');inspect(value);}};inspect(x);
   }
  }
 }
 function download(value){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='CloseRead-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
 async function article(id,action){
  await request('article',{id,action});
  localStorage.setItem(tombstone(id),action==='restore'?'restored':action);
  if(action==='purge')localStorage.removeItem('intensive-practice-'+id);
  if(action!=='restore'&&localStorage.getItem('intensive-last-opened')===id)localStorage.removeItem('intensive-last-opened');
 }
 return {request,snapshot,validateBrowser,download,article,tombstone,confirmAction};
})();
