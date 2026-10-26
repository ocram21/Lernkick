import {complexChoices} from './complexes';
import type {Question,UserData} from '../lib/schema';
import {nextQuestion,shuffle} from '../lib/engine';
// Pick from the least-used selected complexes, then use the existing adaptive selector.
export function nextComplexQuestion(pool:Question[],data:UserData,subject:string,selected:readonly string[]|undefined,used:string[],free=false){
 const ids=complexChoices(subject,selected),available=pool.filter(q=>q.complexId&&ids.includes(q.complexId)&&!used.includes(q.id));
 const counts=ids.map(id=>({id,count:used.filter(key=>pool.some(q=>q.id===key&&q.complexId===id)).length})).filter(c=>available.some(q=>q.complexId===c.id));
 if(!counts.length)return undefined;const least=Math.min(...counts.map(c=>c.count)),eligible=counts.filter(c=>c.count===least).map(c=>c.id),balanced=available.filter(q=>eligible.includes(q.complexId!));
 return free?shuffle(balanced)[0]:nextQuestion(balanced,data,used);
}
