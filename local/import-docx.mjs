import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export function extractDocx(bytes){
 return new Promise((resolve,reject)=>{
  const child=spawn('python3',[fileURLToPath(new URL('./extract-docx.py',import.meta.url))],{stdio:['pipe','pipe','ignore']});
  let output='',done=false;
  const finish=(err,value)=>{if(done)return;done=true;clearTimeout(timer);err?reject(err):resolve(value);};
  const timer=setTimeout(()=>{child.kill();finish(Error('提取超时，请使用较小的文件。'));},10000);
  child.on('error',()=>finish(Error('Word 提取程序无法启动，请确认 Python 3 可用。')));
  child.stdout.on('data',chunk=>{output+=chunk;if(output.length>4000000){child.kill();finish(Error('提取文字过多，请拆分文件。'));}});
  child.on('close',()=>{try{const result=JSON.parse(output);if(result.error)finish(Error(result.error));else finish(null,result);}catch{finish(Error('文档读取失败，请检查文件。'));}});
  child.stdin.on('error',()=>{});child.stdin.end(bytes);
 });
}
