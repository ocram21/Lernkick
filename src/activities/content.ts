import {z}from'zod';
import topicWords from '../content/vocabularyTopics.json';
import sentencePack from '../content/sentences.json';
import {vocabularyEntrySchema}from'../lib/schema';
import {levelSchema,type Activities}from'./schema';
export const words=topicWords.entries.map(value=>vocabularyEntrySchema.and(z.object({category:z.enum(['everyday','work']),topic:z.string()})).parse(value));
export const sentenceSchema=z.object({id:z.string(),level:levelSchema,tokens:z.array(z.string()).min(3),solutions:z.array(z.array(z.string())).min(1),instruction:z.string(),hint:z.string()});
export const sentences=sentencePack.tasks.map(value=>sentenceSchema.parse(value));
export type SentenceTask=z.infer<typeof sentenceSchema>;
export const wordById=new Map(words.map(word=>[word.id,word]));
export const sentenceById=new Map(sentences.map(task=>[task.id,task]));
export function sentenceText(tokens:string[]){return tokens.join(' ').replace(/\s+([,.;:!?])/g,'$1');}
export function checkSentence(task:SentenceTask,draft:number[]){if(draft.length!==task.tokens.length||new Set(draft).size!==draft.length||draft.some(i=>!task.tokens[i]))return false;const tokens=draft.map(i=>task.tokens[i]);return task.solutions.some(solution=>solution.length===tokens.length&&solution.every((word,i)=>word===tokens[i]));}
export function moveToken(draft:number[],id:number,target:number){if(!Number.isInteger(id)||id<0||!Number.isFinite(target))return draft;const before=draft.indexOf(id),next=draft.filter(value=>value!==id),position=Math.max(0,Math.min(next.length,target-(before>=0&&before<target?1:0)));next.splice(position,0,id);return next;}
/** Four first-check successes raise one step; two failed tasks lower one step.
 * Corrections of the same task never count as a new first-check success. */
export function adaptNormal(activity:Activities['vocabulary'],id:string,correct:boolean){
 const previous=activity.adaptive;
 if(sentenceById.get(id)?.level!=='normal'||previous.lastTask===id)return previous;
 let {tier,successes,errors}=previous;
 if(correct){successes++;errors=0;if(successes>=4){tier=Math.min(2,tier+1);successes=0;}}
 else{successes=0;errors++;if(errors>=2){tier=Math.max(0,tier-1);errors=0;}}
 return {tier,successes,errors,lastTask:id};
}
export function sentenceBand(task:SentenceTask){const commas=task.tokens.filter(t=>t===',').length;return commas>1||task.tokens.length>12?2:commas&&task.tokens.length>10?1:0;}
export function normalSentenceQueue(activity:Activities['vocabulary'],exclude:string[]=[]){
 const tier=activity.adaptive.tier;
 return sentences.filter(s=>s.level==='normal'&&sentenceBand(s)<=tier&&!exclude.includes(s.id)).sort((a,b)=>{
  const ra=activity.sentences[a.id],rb=activity.sentences[b.id];
  // Failed tasks return only when they fit the current band; no difficult repeat lock.
  const priority=(r:typeof ra)=>!r?1:r.lastCorrect?2:0;
  return priority(ra)-priority(rb)||Math.abs(sentenceBand(a)-tier)-Math.abs(sentenceBand(b)-tier)||(ra?.at??0)-(rb?.at??0)||Number(b.tokens.includes(','))-Number(a.tokens.includes(','))||Number(b.instruction.includes('Zähle'))-Number(a.instruction.includes('Zähle'));
 }).map(s=>s.id);
}
/** Due mistakes first, then unseen tasks; learned tasks remain available for practice. */
export function practiceQueue(activity:Activities['vocabulary']):string[]{
 const groups=[activity.enabled.everyday?words.filter(w=>w.category==='everyday').map(w=>w.id):[],activity.enabled.work?words.filter(w=>w.category==='work').map(w=>w.id):[],activity.enabled.sentences?(activity.level==='normal'?normalSentenceQueue(activity):sentences.filter(s=>s.level==='hard').map(s=>s.id)):[]].filter(group=>group.length);
 const result=(id:string)=>activity.words[id]??activity.sentences[id];
 for(const group of groups)if(!group[0]?.startsWith('sentence.normal'))group.sort((a,b)=>{const ra=result(a),rb=result(b);const priority=(r:typeof ra)=>!r?1:r.lastCorrect?2:0;return priority(ra)-priority(rb)||(ra?.at??0)-(rb?.at??0);});
 const queue:string[]=[];for(let i=0;queue.length<10;i++){let added=false;for(const group of groups)if(group[i]&&queue.length<10){queue.push(group[i]);added=true;}if(!added)break;}return queue;
}
export function optionOrder(id:string){const options=[0,1,2],seed=[...id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);const start=seed%3;return [...options.slice(start),...options.slice(0,start)];}
export function stableShuffle<T>(items:T[],seedText:string):T[]{let seed=[...seedText].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619)>>>0,2166136261);const next=[...items];for(let i=next.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[next[i],next[j]]=[next[j],next[i]];}if(next.length>1&&next.every((item,i)=>item===items[i]))next.push(next.shift()!);return next;}
