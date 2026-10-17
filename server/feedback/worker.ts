/** Deploy separately from the static PWA. No secrets or identifiers are returned to the browser. */
export interface Env {
 GITHUB_TOKEN:string; RATE_SALT:string; ALLOWED_ORIGIN:string;
 IP_LIMITER:{limit:(input:{key:string})=>Promise<{success:boolean}>};
 GLOBAL_LIMITER:{limit:(input:{key:string})=>Promise<{success:boolean}>};
}
export type Feedback={name:string;area:string;message:string};
export function validateFeedback(value:unknown):Feedback|undefined{
 if(!value||typeof value!=='object'||Array.isArray(value))return;
 const fields=value as Record<string,unknown>;
 if(typeof fields.message!=='string'||fields.name!==undefined&&typeof fields.name!=='string'||fields.area!==undefined&&typeof fields.area!=='string')return;
 const name=(fields.name as string|undefined??'').trim(),area=(fields.area as string|undefined??'').trim(),message=fields.message.trim();
 if(!message||name.length>80||area.length>100||message.length>3000)return;
 return {name,area,message};
}
export function issueBody(feedback:Feedback){
 const text=`Name: ${feedback.name.replace(/[\r\n]/g,' ')||'anonym'}\nBereich: ${feedback.area.replace(/[\r\n]/g,' ')||'nicht angegeben'}\nNachricht:\n${feedback.message}`;
 // A literal code block prevents mentions and user-controlled Markdown from gaining special meaning.
 const longest=Math.max(2,...(text.match(/`+/g)??[]).map(value=>value.length));const fence='`'.repeat(longest+1);
 return `${fence}text\n${text}\n${fence}`;
}
async function boundedBody(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new Error('empty');let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const result=await reader.read();if(result.done)break;size+=result.value.byteLength;if(size>16_384){await reader.cancel();throw new Error('large');}chunks.push(result.value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(bytes));
}
export default {async fetch(request:Request,env:Env):Promise<Response>{
 const origin=request.headers.get('Origin');
 const headers:Record<string,string>={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if(origin===env.ALLOWED_ORIGIN){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';}
 const reply=(status:number,error?:string)=>new Response(JSON.stringify(error?{ok:false,error}:{ok:true}),{status,headers});
 if(new URL(request.url).pathname!=='/feedback')return reply(404,'Nicht gefunden.');
 if(!origin||origin!==env.ALLOWED_ORIGIN)return reply(403,'Nicht erlaubt.');
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return reply(405,'Nur POST ist erlaubt.');
 if(!env.GITHUB_TOKEN||!env.RATE_SALT||!env.IP_LIMITER||!env.GLOBAL_LIMITER)return reply(503,'Versand nicht eingerichtet.');
 if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return reply(415,'JSON erforderlich.');
 try{
  const minute=Math.floor(Date.now()/60_000);
  // Rotating HMAC: no stable device ID, no raw IP in application storage, logs, or GitHub.
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.RATE_SALT),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signature=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${minute}:${request.headers.get('CF-Connecting-IP')??'unknown'}`));
  const bucket=Array.from(new Uint8Array(signature),byte=>byte.toString(16).padStart(2,'0')).join('');
  const limits=await Promise.all([env.IP_LIMITER.limit({key:bucket}),env.GLOBAL_LIMITER.limit({key:'feedback'})]);
  if(limits.some(limit=>!limit.success)){headers['Retry-After']='60';return reply(429,'Bitte eine Minute warten.');}
  let raw;try{raw=await boundedBody(request);}catch(error){return reply(error instanceof Error&&error.message==='large'?413:400,'Ungültige oder zu große Eingabe.');}
  const feedback=validateFeedback(raw);if(!feedback)return reply(400,'Bitte Eingaben prüfen.');
  const response=await fetch('https://api.github.com/repos/ocram21/Lernkick/issues',{method:'POST',headers:{Authorization:`Bearer ${env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2026-03-10','User-Agent':'Lernkick-Feedback'},body:JSON.stringify({title:'Feedback aus Lern-Kick',body:issueBody(feedback)}),signal:AbortSignal.timeout(10_000)});
  if(response.status!==201)return reply(502,'GitHub konnte die Nachricht nicht annehmen.');
  return reply(201);
 }catch{return reply(503,'Versand vorübergehend nicht verfügbar.');}
}};
