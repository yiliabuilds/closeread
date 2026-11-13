(()=>{
 const $=id=>document.getElementById(id);let token='',configured=false;
 function show(data){configured=data.configured;$('status').textContent=(configured?`密钥：•••••••• ${data.lastFour}\n${data.persistent?'已保存到本机钥匙串':'仅本次运行可用'}`:'尚未配置 API Key')+(data.error?'\n'+data.error:'');$('edit').textContent=configured?'更换密钥':'配置密钥';$('edit').disabled=false;$('remove').disabled=!configured;}
 async function request(method,body){const response=await fetch('/api/settings/key',{method,headers:{'Content-Type':'application/json','X-Settings-Token':token},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw Error(data.error||'设置未保存');return data;}
 const close=()=>{$('form').hidden=true;$('key').value='';};
 $('edit').onclick=()=>{$('form').hidden=false;$('confirmation').hidden=true;$('key').focus();};
 $('cancel').onclick=close;
 $('remove').onclick=()=>{close();$('confirmation').hidden=false;};
 $('keep').onclick=()=>{$('confirmation').hidden=true;};
 async function change(method,body){
  for(const id of ['save','edit','remove','confirm-remove','cancel','keep'])$(id).disabled=true;
  $('message').textContent='正在访问本机钥匙串；如出现系统授权窗口，请确认…';
  try{show(await request(method,body));close();$('confirmation').hidden=true;$('message').textContent=method==='DELETE'?'密钥已移除。已保存文章与笔记保持不变。':'已保存。之后的新请求使用此密钥，无需重新启动。';}
  catch(e){$('message').textContent=e instanceof TypeError?'无法连接本机服务。操作是否完成尚未确认，请恢复服务后刷新检查；不会自动重试。':e.message;}
  finally{for(const id of ['save','edit','confirm-remove','cancel','keep'])$(id).disabled=false;$('remove').disabled=!configured;$('key').value='';}
 }
 $('form').onsubmit=e=>{e.preventDefault();const key=$('key').value.trim();$('key').value='';change('POST',{key});};
 $('confirm-remove').onclick=()=>change('DELETE',{});
 window.addEventListener('pagehide',()=>{$('key').value='';});
 fetch('/api/settings').then(async response=>{if(!response.ok)throw Error();const data=await response.json();token=data.token;show(data);}).catch(()=>{$('status').textContent='设置服务尚未就绪。若刚升级，请关闭旧服务后重新运行“启动精读.command”，然后刷新本页。';});
})();
