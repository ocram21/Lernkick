import {statisticsSchema,emptyStatistics,finishRun} from './statistics';
import { z } from 'zod';
export const moduleIds = ['math', 'german', 'social', 'biology', 'geography', 'vocabulary', 'hangman', 'germany', 'nback'] as const;
export type ModuleId = typeof moduleIds[number];
const count = z.number().int().nonnegative();
const moduleSchema = z.object({ level: count.min(1), progress: count, completed: z.array(count), bossWins: z.array(count), bossAttempts: z.array(count), lastActivity: z.number().nonnegative() });
export const journeySchema = z.object({ schemaVersion: z.literal(1), statistics:statisticsSchema.default(emptyStatistics), strengthModel:z.union([z.literal(2),z.literal(3)]).optional(),strengthDay:count.optional(),dayLearningMs:z.number().min(0).max(1800000).optional(),activeLearningMs:z.number().nonnegative().optional(),profileId: z.string().min(1), totalPoints: count, modules: z.record(z.enum(moduleIds), moduleSchema), events: z.record(z.string(), z.number().nonnegative()), tasks: z.record(z.string(), z.number().nonnegative()), strength: z.number().min(0).max(100), strengthAt: z.number().nonnegative(), lastActivity: z.number().nonnegative() }).superRefine((journey,context)=>{
    if(journey.strengthModel===3&&(journey.strengthDay===undefined||journey.dayLearningMs===undefined))context.addIssue({code:'custom',message:'Der Tagesstand der Lernstärke fehlt.'});
    for(const id of moduleIds){
        const module=journey.modules[id];
        const invalid=module.progress>=moduleRules[id].passes||module.completed.some(level=>level<1||level>=module.level)||[module.completed,module.bossWins,module.bossAttempts].some(list=>new Set(list).size!==list.length)||module.bossAttempts.some(level=>level%5!==0||!module.completed.includes(level))||module.bossWins.some(level=>!module.bossAttempts.includes(level));
        if(invalid)context.addIssue({code:'custom',path:['modules',id],message:'Level, Fortschritt und Erfolge passen nicht zusammen.'});
    }
});
export type Journey = z.infer<typeof journeySchema>;
export const rules = { dailyMinutes:30,strengthDays:7,decayFactor:.9, repeatHours: 24, maxInteractionGap: 30000 };
// Successful complete runs required per level. A word is one run in Hangman;
// country quiz is 32 first placements; N-back is 48 binary decisions.
export const moduleRules: Record<ModuleId, {
    passes: number;
    points: number;
    minimum: number;
    boss: string;
}> = {
    math: { passes: 3, points: 10, minimum: 10, boss: 'Zahlenroboter' }, german: { passes: 3, points: 10, minimum: 10, boss: 'Buchmonster' }, social: { passes: 3, points: 10, minimum: 10, boss: 'Alltagsdetektiv' }, biology: { passes: 3, points: 10, minimum: 10, boss: 'Zellwächter' }, geography: { passes: 3, points: 10, minimum: 10, boss: 'Weltentdecker' }, vocabulary: { passes: 3, points: 10, minimum: 10, boss: 'Wortdrache' }, hangman: { passes: 5, points: 10, minimum: 1, boss: 'Buchstabenfuchs' }, germany: { passes: 2, points: 10, minimum: 32, boss: 'Länderwächter' }, nback: { passes: 3, points: 10, minimum: 48, boss: 'Gedächtnisbot' }
};
export function newJourney(scores: Record<string, number>, now = Date.now()): Journey { return { schemaVersion: 1, statistics:emptyStatistics(), strengthModel:3,strengthDay:learningDay(now),dayLearningMs:0,activeLearningMs:0,profileId: crypto.randomUUID(), totalPoints: Object.values(scores).reduce((a, b) => a + b, 0), modules: Object.fromEntries(moduleIds.map(id => [id, { level: 1, progress: 0, completed: [], bossWins: [], bossAttempts: [], lastActivity: 0 }])) as unknown as Journey['modules'], events: {}, tasks: {}, strength: 0, strengthAt: now, lastActivity: 0 }; }
const day = 86400000;
const calendar=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'});
export function learningDay(now:number){const parts=calendar.formatToParts(new Date(now)),part=(name:string)=>Number(parts.find(p=>p.type===name)!.value);return Date.UTC(part('year'),part('month')-1,part('day'))/day;}
export const strengthTargetMinutes=rules.dailyMinutes,strengthDailyGain=100/rules.strengthDays;
const targetMs=strengthTargetMinutes*60000;
export function upgradeStrength(j:Journey,now=Date.now()):Journey{return j.strengthModel===3?j:{...j,strengthModel:3,strengthDay:learningDay(now),dayLearningMs:0,activeLearningMs:j.activeLearningMs??0};}
function atDay(j:Journey,today:number){const missing=Math.max(0,today-j.strengthDay!-Number(j.dayLearningMs!>=targetMs));return j.strength*Math.pow(rules.decayFactor,missing);}
export function strengthAt(j:Journey,now=Date.now()){return j.strengthModel!==3||now<j.strengthAt?j.strength:atDay(j,learningDay(now));}
export function settleStrength(j:Journey,now=Date.now()):Journey{const next=upgradeStrength(j,now);if(now<next.strengthAt)return next;const today=learningDay(now);if(today<=next.strengthDay!)return next;return {...next,strength:atDay(next,today),strengthDay:today,dayLearningMs:today===next.strengthDay?next.dayLearningMs:0,strengthAt:now};}
function creditDay(j:Journey,milliseconds:number,today:number,now:number):Journey{
 if(milliseconds<=0||today<j.strengthDay!)return j;
 const previous=today===j.strengthDay?j.dayLearningMs!:0,used=Math.min(targetMs,previous+milliseconds),gain=previous<targetMs&&used>=targetMs?strengthDailyGain:0;
 const strength=atDay(j,today)+gain;
 return {...j,strength:strength>=100-1e-8?100:Math.min(100,strength),strengthDay:today,dayLearningMs:used,activeLearningMs:(j.activeLearningMs??0)+milliseconds,strengthAt:now,lastActivity:now};
}
export function activeTime(j:Journey,milliseconds:number,now=Date.now()):Journey{
 if(!Number.isFinite(milliseconds)||milliseconds<=0||milliseconds>rules.maxInteractionGap||!Number.isFinite(now)||now<=j.strengthAt)return j;
 const duration=Math.min(milliseconds,now-j.strengthAt),start=now-duration,next=upgradeStrength(j,now),first=learningDay(start),last=learningDay(now);
 if(first===last)return creditDay(next,duration,last,now);
 // A valid interaction interval is at most 30 seconds; split precisely at local midnight.
 let low=start,high=now;while(high-low>1){const middle=Math.floor((low+high)/2);if(learningDay(middle)===first)low=middle;else high=middle;}
 return creditDay(creditDay(next,high-start,first,high),now-high,last,now);
}
export function mergeStrength(current:Journey,incoming:Journey,now=Date.now()){
 const a=settleStrength(current,now),b=settleStrength(incoming,now),today=Math.max(a.strengthDay!,b.strengthDay!);
 return {strengthModel:3 as const,strength:Math.max(a.strength,b.strength),strengthDay:today,dayLearningMs:Math.max(a.strengthDay===today?a.dayLearningMs!:0,b.strengthDay===today?b.dayLearningMs!:0),strengthAt:Math.max(a.strengthAt,b.strengthAt),lastActivity:Math.max(a.lastActivity,b.lastActivity),activeLearningMs:Math.max(a.activeLearningMs??0,b.activeLearningMs??0)};
}
export type TrainingResult = {
    id: string;
    module: ModuleId;
    correct: number;
    total: number;
    tasks: string[];
    correctTasks?: string[];
    successRatio?: number;
    at?: number;
};
export function completeTraining(j: Journey, r: TrainingResult): Journey {
    const now = r.at ?? Date.now(), rule = moduleRules[r.module];
    if (j.events[r.id] !== undefined || !Number.isInteger(r.correct) || !Number.isInteger(r.total) || r.total < rule.minimum || r.correct < 0 || r.correct > r.total || new Set(r.tasks).size !== r.tasks.length || r.tasks.length === 0 || (r.correctTasks !== undefined && (r.correctTasks.length !== r.correct || new Set(r.correctTasks).size !== r.correctTasks.length || r.correctTasks.some(id=>!r.tasks.includes(id)))) || (r.successRatio !== undefined && (!Number.isFinite(r.successRatio) || r.successRatio < 0 || r.successRatio > 1)))
        return j;
    const fresh = r.tasks.filter(id => j.tasks[`${r.module}:${id}`] === undefined || now - j.tasks[`${r.module}:${id}`] >= rules.repeatHours * 3600000), eligible = fresh.length / r.tasks.length;
    const awardedCorrect=r.correctTasks?r.correctTasks.filter(id=>fresh.includes(id)).length:r.tasks.length===r.total?Math.max(0,r.correct-(r.tasks.length-fresh.length)):fresh.length===r.tasks.length?r.correct:0;
    const passed = (r.successRatio ?? r.correct / r.total) > .6 && eligible > .6;
    const old = j.modules[r.module], progress = old.progress + Number(passed), finished = progress >= rule.passes;
    return { ...j, statistics:finishRun(j.statistics,r.id,r.module,now), totalPoints: j.totalPoints + Math.floor(awardedCorrect * rule.points), events: { ...j.events, [r.id]: now }, tasks: { ...j.tasks, ...Object.fromEntries(fresh.map(id => [`${r.module}:${id}`, now])) }, modules: { ...j.modules, [r.module]: { ...old, progress: finished ? 0 : progress, level: old.level + Number(finished), completed: finished ? [...old.completed, old.level] : old.completed, lastActivity: Math.max(now, old.lastActivity) } } };
}
export function bossResult(j: Journey, module: ModuleId, level: number, correct: boolean, now = Date.now()): Journey { const m = j.modules[module]; if (level % 5 || !m.completed.includes(level) || m.bossAttempts.includes(level))
    return j; return { ...j, totalPoints: j.totalPoints + (correct ? moduleRules[module].points * 5 : 0), modules: { ...j.modules, [module]: { ...m, bossAttempts: [...m.bossAttempts, level], bossWins: correct ? [...m.bossWins, level] : m.bossWins } } }; }
