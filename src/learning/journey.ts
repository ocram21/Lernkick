import { z } from 'zod';
export const moduleIds = ['math', 'german', 'social', 'biology', 'geography', 'vocabulary', 'hangman', 'germany', 'nback'] as const;
export type ModuleId = typeof moduleIds[number];
const count = z.number().int().nonnegative();
const moduleSchema = z.object({ level: count.min(1), progress: count, completed: z.array(count), bossWins: z.array(count), bossAttempts: z.array(count), lastActivity: z.number().nonnegative() });
export const journeySchema = z.object({ schemaVersion: z.literal(1), strengthModel:z.literal(2).optional(),activeLearningMs:z.number().nonnegative().optional(),profileId: z.string().min(1), totalPoints: count, modules: z.record(z.enum(moduleIds), moduleSchema), events: z.record(z.string(), z.number().nonnegative()), tasks: z.record(z.string(), z.number().nonnegative()), strength: z.number().min(0).max(100), strengthAt: z.number().nonnegative(), lastActivity: z.number().nonnegative() }).superRefine((journey,context)=>{
    for(const id of moduleIds){
        const module=journey.modules[id];
        const invalid=module.progress>=moduleRules[id].passes||module.completed.some(level=>level<1||level>=module.level)||[module.completed,module.bossWins,module.bossAttempts].some(list=>new Set(list).size!==list.length)||module.bossAttempts.some(level=>level%5!==0||!module.completed.includes(level))||module.bossWins.some(level=>!module.bossAttempts.includes(level));
        if(invalid)context.addIssue({code:'custom',path:['modules',id],message:'Level, Fortschritt und Erfolge passen nicht zusammen.'});
    }
});
export type Journey = z.infer<typeof journeySchema>;
export const rules = { strengthPerMinute: 10 / 30, graceDays: 2, decayPerDay: 5, repeatHours: 24, maxInteractionGap: 30000 };
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
export function newJourney(scores: Record<string, number>, now = Date.now()): Journey { return { schemaVersion: 1, strengthModel:2,activeLearningMs:0,profileId: crypto.randomUUID(), totalPoints: Object.values(scores).reduce((a, b) => a + b, 0), modules: Object.fromEntries(moduleIds.map(id => [id, { level: 1, progress: 0, completed: [], bossWins: [], bossAttempts: [], lastActivity: 0 }])) as unknown as Journey['modules'], events: {}, tasks: {}, strength: 0, strengthAt: now, lastActivity: 0 }; }
const day = 86400000;
export const strengthTargetMinutes=300;
export function upgradeStrength(j:Journey):Journey{return j.strengthModel===2?j:{...j,strengthModel:2,activeLearningMs:0};}
export function strengthAt(j: Journey, now = Date.now()) { if(j.strengthModel===2)return j.strength; const elapsed = Math.max(0, Math.floor((now - j.lastActivity) / day) - rules.graceDays), previous = Math.max(0, Math.floor((j.strengthAt - j.lastActivity) / day) - rules.graceDays); return Math.max(0, j.strength - Math.max(0, elapsed - previous) * rules.decayPerDay); }
export function activeTime(j: Journey, milliseconds: number, now = Date.now()): Journey { if (!Number.isFinite(milliseconds) || milliseconds <= 0 || milliseconds > rules.maxInteractionGap || now < j.strengthAt)
    return j; return { ...upgradeStrength(j),activeLearningMs:(j.activeLearningMs??0)+milliseconds, strength: Math.min(100, strengthAt(j, now) + milliseconds / 60000 * (100/strengthTargetMinutes)), strengthAt: now, lastActivity: now }; }
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
    return { ...j, totalPoints: j.totalPoints + Math.floor(awardedCorrect * rule.points), events: { ...j.events, [r.id]: now }, tasks: { ...j.tasks, ...Object.fromEntries(fresh.map(id => [`${r.module}:${id}`, now])) }, modules: { ...j.modules, [r.module]: { ...old, progress: finished ? 0 : progress, level: old.level + Number(finished), completed: finished ? [...old.completed, old.level] : old.completed, lastActivity: Math.max(now, old.lastActivity) } } };
}
export function bossResult(j: Journey, module: ModuleId, level: number, correct: boolean, now = Date.now()): Journey { const m = j.modules[module]; if (level % 5 || !m.completed.includes(level) || m.bossAttempts.includes(level))
    return j; return { ...j, totalPoints: j.totalPoints + (correct ? moduleRules[module].points * 5 : 0), modules: { ...j.modules, [module]: { ...m, bossAttempts: [...m.bossAttempts, level], bossWins: correct ? [...m.bossWins, level] : m.bossWins } } }; }
