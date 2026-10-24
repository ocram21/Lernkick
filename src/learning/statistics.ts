import {z} from 'zod';
export const subjects=['math','german','social','biology','geography'] as const;
export const areas=[...subjects,'vocabulary','hangman','germany','nback','cards'] as const;
export type Area=typeof areas[number];
export type BossSubject=typeof subjects[number];
const nonnegative=z.number().nonnegative(),counts=z.record(z.string(),nonnegative);
const pendingSchema=z.object({area:z.enum(areas),subject:z.enum(subjects).optional(),slices:counts});
const runSchema=pendingSchema.extend({at:nonnegative,kind:z.enum(['regular','cards','boss'])});
const bossSchema=z.object({id:z.string(),subject:z.enum(subjects),difficulty:z.enum(['normal','hard']),startedAt:nonnegative,endedAt:nonnegative.optional(),status:z.enum(['running','aborted','finished']),correct:z.number().int().min(0).max(10),wrong:z.number().int().min(0).max(10),won:z.boolean(),durationMs:nonnegative.max(180000)});
export const statisticsSchema=z.object({since:nonnegative,pending:z.record(z.string(),pendingSchema),runs:z.record(z.string(),runSchema),bosses:z.record(z.string(),bossSchema),charges:z.record(z.string(),z.number().int().min(0).max(5))});
export type Statistics=z.infer<typeof statisticsSchema>;
export type BossResult=z.infer<typeof bossSchema>;
export const emptyStatistics=():Statistics=>({since:0,pending:{},runs:{},bosses:{},charges:{}});
const calendar=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'});
export function dayKey(now:number){const parts=calendar.formatToParts(new Date(now)),p=(key:string)=>parts.find(v=>v.type===key)!.value;return `${p('year')}-${p('month')}-${p('day')}`;}
export function splitTime(start:number,end:number):Record<string,number>{
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return{};
 const result:Record<string,number>={};let cursor=start;
 while(cursor<end){const day=dayKey(cursor);let boundary=end;if(dayKey(end-1)!==day){let low=cursor,high=end;while(high-low>1){const middle=Math.floor((low+high)/2);if(dayKey(middle)===day)low=middle;else high=middle;}boundary=high;}result[day]=(result[day]??0)+boundary-cursor;cursor=boundary;}
 return result;
}
export function creditRun(s:Statistics,id:string,area:Area,milliseconds:number,now=Date.now(),subject?:BossSubject):Statistics{
 if(s.runs[id]||!Number.isFinite(milliseconds)||milliseconds<=0||milliseconds>30000)return s;
 const old=s.pending[id]??{area,subject,slices:{}};if(old.area!==area)return s;
 const slices={...old.slices};for(const [day,time]of Object.entries(splitTime(now-milliseconds,now)))slices[day]=(slices[day]??0)+time;
 return {...s,since:s.since||now,pending:{...s.pending,[id]:{...old,slices}}};
}
export function finishRun(s:Statistics,id:string,area:Area,at=Date.now(),kind:'regular'|'cards'|'boss'='regular',subject?:BossSubject):Statistics{
 if(s.runs[id])return s;
 const pending={...s.pending},run=pending[id]??{area,subject,slices:{}};delete pending[id];
 const charge=kind==='regular'&&subjects.includes(area as BossSubject);
 return {...s,since:s.since||at,pending,runs:{...s.runs,[id]:{...run,area,subject:subject??run.subject,kind,at}},charges:charge?{...s.charges,[area]:Math.min(5,(s.charges[area]??0)+1)}:s.charges};
}
export function roundCount(s:Statistics,area:Area){return Object.values(s.runs).filter(r=>r.area===area&&r.kind==='regular').length;}
export function beginBoss(s:Statistics,result:BossResult):Statistics{return {...s,since:s.since||result.startedAt,bosses:{...s.bosses,[result.id]:result}};}
export function endBoss(s:Statistics,result:BossResult,slices:Record<string,number>):Statistics{
 const previous=s.bosses[result.id];if(!previous||previous.status!=='running')return s;
 const next={...s,bosses:{...s.bosses,[result.id]:result}};
 if(result.status!=='finished')return next;
 return {...next,charges:{...s.charges,[result.subject]:0},runs:{...s.runs,[result.id]:{area:result.subject,subject:result.subject,kind:'boss' as const,at:result.endedAt!,slices}}};
}
export function mergeStatistics(a:Statistics,b:Statistics):Statistics{
 const bosses={...a.bosses,...b.bosses};for(const [id,old]of Object.entries(a.bosses))if(old.status!=='running'&&bosses[id]?.status==='running')bosses[id]=old;
 const runs={...a.runs,...b.runs},charges:Statistics['charges']={};
 for(const subject of subjects){const last=Math.max(0,...Object.values(bosses).filter(r=>r.subject===subject&&r.status==='finished').map(r=>r.endedAt??0));const charge=Math.min(5,Object.values(runs).filter(r=>r.area===subject&&r.kind==='regular'&&r.at>last).length);if(charge||subject in a.charges||subject in b.charges)charges[subject]=charge;}
 return {since:a.since&&b.since?Math.min(a.since,b.since):a.since||b.since,pending:{...a.pending,...b.pending},runs,bosses,charges};
}
export function monthDays(month:string){const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m,0)).getUTCDate();}
export function shiftMonth(month:string,delta:number){const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+delta,1)).toISOString().slice(0,7);}
export function monthSummary(s:Statistics,month:string,filter:'all'|Area){const days=Array(monthDays(month)).fill(0) as number[];
 for(const run of Object.values(s.runs))if(filter==='all'||run.area===filter||run.subject===filter)for(const [day,time]of Object.entries(run.slices))if(day.startsWith(month+'-'))days[Number(day.slice(8))-1]+=time;
 return {days,minutes:days.reduce((a,b)=>a+b,0)/60000,activeDays:days.filter(n=>n>0).length};
}

// A page reload cannot resume the local boss task state. Keep the attempt, but never spend its charge.
export function interruptBosses(s:Statistics,now=Date.now()):Statistics{const bosses={...s.bosses};let changed=false;for(const [id,b]of Object.entries(bosses))if(b.status==='running'){bosses[id]={...b,status:'aborted',endedAt:now,durationMs:Math.max(0,Math.min(180000,now-b.startedAt))};changed=true;}return changed?{...s,bosses}:s;}
