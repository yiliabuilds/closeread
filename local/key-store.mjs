import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export function createKeyStore(service){
 const call=(action,key)=>new Promise((resolve,reject)=>{
  const child=spawn('/usr/bin/python3',[fileURLToPath(new URL('./keychain.py',import.meta.url))],{stdio:['pipe','pipe','ignore']});
  let output='';const timer=setTimeout(()=>child.kill(),60000);
  child.stdout.on('data',chunk=>{output+=chunk;if(output.length>16000)child.kill();});
  child.on('error',()=>{clearTimeout(timer);reject(Error('无法启动本机钥匙串服务。'));});
  child.on('close',code=>{clearTimeout(timer);try{const result=JSON.parse(output);if(code!==0||result.error)throw Error();resolve(result);}catch{reject(Error('无法访问 macOS 钥匙串，请允许系统授权或解锁钥匙串后重试。'));}});
  child.stdin.on('error',()=>{});
  child.stdin.end(JSON.stringify({action,key,service}));
 });
 return {read:async()=>(await call('read')).key,save:key=>call('save',key),remove:()=>call('remove')};
}
