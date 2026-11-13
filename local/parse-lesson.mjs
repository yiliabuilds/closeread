// Repair only narrowly recognised inline-token syntax, never evaluate expressions.
// Tokenise strings first so braces inside lesson text are never changed.
export function parseLesson(raw){
 try{return JSON.parse(raw);}catch(original){
  // Model sometimes writes a morphology illustration as an unescaped expression.
  // Only match an actual object opening, never text inside a JSON string.
  const edits=[];
  for(const token of raw.matchAll(/"(?:\\.|[^"\\])*"|\s+|[^\s"]/gs)){
   if(token[0]!=='{')continue;
   const match=raw.slice(token.index).match(/^\{\s*"(strong|code)"\s*:\s*"([^"\\\r\n]+)"\s*\+\s*"([^"\\\r\n]+)"\s*→\s*([^"{}\[\]\\\r\n]+)"\s*\}/u);
   if(match)edits.push({start:token.index,length:match[0].length,value:JSON.stringify({[match[1]]:`"${match[2]}" + "${match[3]}" → ${match[4]}`})});
  }
  for(const edit of edits.reverse())raw=raw.slice(0,edit.start)+edit.value+raw.slice(edit.start+edit.length);
  const tokens=raw.match(/"(?:\\.|[^"\\])*"|\s+|[^\s"]/gs)||[];
  const significant=tokens.map((value,index)=>({value,index})).filter(t=>!/^\s+$/.test(t.value));
  let repairs=edits.length;
  for(let i=0;i+4<significant.length;i++){
   const [a,b,c,d,e]=significant.slice(i,i+5);
   if(a.value==='{'&&['"strong"','"code"'].includes(b.value)&&c.value===':'&&d.value.startsWith('"')&&e.value===']'){
    tokens[d.index]+='}';repairs++;
   }
  }
  if(!repairs)throw original;
  const lesson=JSON.parse(tokens.join(''));
  lesson.formatRepair={kind:edits.length?'inline-token-syntax':'inline-token-closing-brace',count:repairs};
  return lesson;
 }
}
