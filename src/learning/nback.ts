import {z} from 'zod';
const level=z.number().int().min(1).max(4);
export const nbackResultSchema=z.object({id:z.string(),level,errors:z.number().int().min(0).max(48),at:z.number().nonnegative()});
export const nbackSchema=z.object({current:level.nullable(),mastered:z.array(level).max(4).refine(a=>new Set(a).size===a.length),bestErrors:z.record(z.string().regex(/^[1-4]$/),z.number().int().min(0).max(48)),results:z.array(nbackResultSchema).max(100)});
export type NBackProgress=z.infer<typeof nbackSchema>;
export const emptyNBack=():NBackProgress=>({current:null,mastered:[],bestErrors:{},results:[]});
// Existing game rule: at most two missed matches/false alarms passes a round.
export const passedNBack=(errors:number)=>Number.isInteger(errors)&&errors>=0&&errors<=2;
export function recordNBack(progress:NBackProgress,input:z.input<typeof nbackResultSchema>):NBackProgress{
 const result=nbackResultSchema.parse(input);if(progress.results.some(r=>r.id===result.id))return progress;
 return {current:passedNBack(result.errors)?Math.min(4,result.level+1):result.level,mastered:[...new Set([...progress.mastered,...(passedNBack(result.errors)?[result.level]:[])])].sort(),bestErrors:{...progress.bestErrors,[result.level]:Math.min(progress.bestErrors[result.level]??48,result.errors)},results:[...progress.results,result].slice(-100)};
}
/** Starting at N1 or N2 was possible; an ongoing N3/N4 proves only N2 / N2+N3. */
export function recoverNBack(progress:NBackProgress,value:unknown):NBackProgress{
 const run=z.object({level,sequence:z.array(z.object({letter:z.string(),position:z.number().int().min(0).max(8),answers:z.object({audio:z.boolean(),position:z.boolean()})})).min(25).max(28),index:z.number().int().nonnegative()}).safeParse(value);
 if(!run.success||run.data.sequence.length!==24+run.data.level||run.data.index>=run.data.sequence.length)return progress;
 return {...progress,current:progress.current??run.data.level,mastered:[...new Set([...progress.mastered,...[2,3].filter(n=>n<run.data.level)])].sort()};
}
export function mergeNBack(a:NBackProgress,b:NBackProgress):NBackProgress{
 const results=new Map([...a.results,...b.results].map(r=>[r.id,r]));
 return {current:b.current??a.current,mastered:[...new Set([...a.mastered,...b.mastered])].sort(),bestErrors:Object.fromEntries([...new Set([...Object.keys(a.bestErrors),...Object.keys(b.bestErrors)])].map(k=>[k,Math.min(a.bestErrors[k]??48,b.bestErrors[k]??48)])),results:[...results.values()].sort((a,b)=>a.at-b.at).slice(-100)};
}
