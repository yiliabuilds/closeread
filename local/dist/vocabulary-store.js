window.CloseReadVocabulary=(()=>{
 const prefix='closeread-vocabulary-',validKey=k=>/^closeread-vocabulary-[a-f0-9]{64}$/.test(k);
 function read(storage,key){
  if(!validKey(key))throw Error('生词来源编号无效');
  const data=JSON.parse(storage.getItem(key)||'{"words":[]}');
  if(!data||!Array.isArray(data.words)||data.words.some(w=>!w||['word','context','language','lemma','meaning','explanation','chinese','createdAt'].some(k=>typeof w[k]!=='string')))throw Error('这篇文章的生词数据无法读取，请勿清理浏览器数据。');
  return data;
 }
 function all(storage){const words=[],errors=[];for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!validKey(key))continue;try{const data=read(storage,key);for(const w of data.words)words.push({...w,articleId:key.slice(prefix.length),storageKey:key});}catch{errors.push(key);}}return {words,errors};}
 function change(storage,item,remove){
  // Re-read immediately before writing, preserving words saved from another tab.
  const data=read(storage,item.storageKey);const found=data.words.find(w=>w.word===item.word&&w.context===item.context);
  if(!found)throw Error('生词已发生变化，请刷新列表。');
  if(remove)found.removedAt=new Date().toISOString();else delete found.removedAt;
  storage.setItem(item.storageKey,JSON.stringify(data));
 }
 return {all,change,read};
})();
