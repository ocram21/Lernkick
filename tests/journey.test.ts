import { describe, it, expect } from 'vitest';
import { newJourney, completeTraining, activeTime, strengthAt, bossResult, moduleIds } from '../src/learning/journey';
import { emptyData, dataSchema } from '../src/lib/schema';
import { readBackup } from '../src/lib/storage';
import { prepareImport, migrateData } from '../src/learning/migration';
import { sentences, checkSentence, sentenceError } from '../src/activities/content';
const now = 1800000000000, day = 86400000;
const run = (id: string, correct = 7, at = now) => ({ id, module: 'math' as const, correct, total: 10, tasks: Array.from({ length: 10 }, (_, i) => `${id}.${i}`), at });
describe('Unabhängige Level und dauerhafte Punkte', () => {
    it('erfordert strikt mehr als 60 %, mehrere Durchläufe und zählt ein Ergebnis nur einmal', () => { const start = newJourney({ math: 250 }, now); const failed = completeTraining(start, run('sixty', 6)); expect(failed.modules.math.level).toBe(1); expect(failed.modules.math.progress).toBe(0); expect(failed.totalPoints).toBe(310); let j = completeTraining(failed, run('one')); expect(j.modules.math.progress).toBe(1); expect(completeTraining(j, run('one'))).toEqual(j); j = completeTraining(j, run('two')); j = completeTraining(j, run('three')); expect(j.modules.math.level).toBe(2); expect(j.modules.math.progress).toBe(0); expect(j.modules.math.completed).toEqual([1]); expect(j.modules.german.level).toBe(1); expect(j.totalPoints).toBe(520); });
    it('vergibt weder Level noch Punkte für direkte Wiederholung, unvollständige oder manipulierte Ergebnisse', () => { let j = completeTraining(newJourney({}, now), run('one')); const again = completeTraining(j, { ...run('two'), tasks: run('one').tasks }); expect(again.totalPoints).toBe(j.totalPoints); expect(again.modules.math.progress).toBe(1); expect(completeTraining(j, { ...run('short'), total: 2 })).toEqual(j); expect(completeTraining(j, { ...run('bad'), correct: 11 })).toEqual(j); expect(completeTraining(j, { ...run('bad'), tasks: ['same', 'same'] })).toEqual(j); const later = completeTraining(j, { ...run('next', 7, now + day), tasks: run('one').tasks }); expect(later.totalPoints).toBe(j.totalPoints + 70); });
    it('behält besiegte Endgegner und gibt nur einmal fünffache Punkte, Fehler blockieren keinen Aufstieg', () => { let j = newJourney({}, now); j.modules.math = { ...j.modules.math, level: 6, completed: [1, 2, 3, 4, 5] }; const win = bossResult(j, 'math', 5, true, now); expect(win.totalPoints).toBe(50); expect(win.modules.math.bossWins).toEqual([5]); expect(bossResult(win, 'math', 5, true)).toEqual(win); const fail = bossResult(j, 'math', 5, false); expect(fail.totalPoints).toBe(0); expect(fail.modules.math.level).toBe(6); expect(bossResult(j, 'math', 10, true)).toEqual(j); });
    it('wertet N-Back nach ausgewogener Trefferrate statt bloßem Nicht-Reagieren', () => { const j = newJourney({}, now); const passive = completeTraining(j, { id: 'passive', module: 'nback', correct: 36, total: 48, successRatio: .5, tasks: ['sequence1'], at: now }); expect(passive.modules.nback.progress).toBe(0); const active = completeTraining(j, { id: 'active', module: 'nback', correct: 38, total: 48, successRatio: .7, tasks: ['sequence2'], at: now }); expect(active.modules.nback.progress).toBe(1); });
    it('vergibt bei gemischten Wiederholungen nur für tatsächlich neue richtige Aufgaben Punkte',()=>{let j=newJourney({},now);j.tasks['math:old']=now;const tasks=['old',...Array.from({length:9},(_,i)=>'new'+i)];const result=completeTraining(j,{id:'mixed',module:'math',correct:1,total:10,tasks,correctTasks:['old'],at:now});expect(result.totalPoints).toBe(0);});
    it('vergibt für wiederholte N-Back-Sammelergebnisse keine Punkte',()=>{let j=newJourney({},now);j=completeTraining(j,{id:'n1',module:'nback',correct:48,total:48,tasks:['sequence'],at:now});const repeated=completeTraining(j,{id:'n2',module:'nback',correct:48,total:48,tasks:['sequence'],at:now});expect(repeated.totalPoints).toBe(j.totalPoints);});
    it('funktioniert für alle neun konfigurierten Module', () => { for (const module of moduleIds) {
        const total = module === 'germany' ? 32 : module === 'nback' ? 48 : 10;
        const j = completeTraining(newJourney({}, now), { id: module, module, correct: total, total, tasks: [module], at: now });
        expect(j.modules[module].progress).toBe(1);
        expect(j.totalPoints).toBe(total * 10);
    } });
});
describe('Lernstärke mit aktiver Zeit und Offline-Zeitstempeln', () => {
    function train(j = newJourney({}, now), at = now) { for (let i = 1; i <= 60; i++)
        j = activeTime(j, 30000, at + i * 30000); return j; }
    it('gewinnt bei 30 Minuten täglich zehn Punkte und klemmt bei 100', () => { let j = newJourney({}, now); for (let d = 0; d < 12; d++)
        j = train(j, now + d * day); expect(j.strength).toBe(100); });
    it('bewahrt die aktive Lernzeit auch nach Pausen und wächst bei Rückkehr weiter', () => { let j = train(); const last = j.lastActivity; expect(strengthAt(j, last + 2 * day)).toBeCloseTo(10); expect(strengthAt(j, last + 3 * day)).toBeCloseTo(10); expect(strengthAt(j, last + 7 * day)).toBeCloseTo(10); expect(strengthAt(j, last + 14 * day)).toBeCloseTo(10); j = train(j, last + 14 * day); expect(j.strength).toBeCloseTo(20); });
    it('belohnt keine geöffnete App, langen Pausen oder rückwärts laufende Uhr', () => { const j = newJourney({}, now); expect(activeTime(j, 60000, now + 60000)).toEqual(j); expect(activeTime(j, 1000, now - 1)).toEqual(j); expect(strengthAt(j, now + day)).toBe(0); expect(activeTime(j, NaN, now)).toEqual(j); });
});
describe('Sicherung und Import', () => {
    it('erhält Format 3 mit mehreren Leveln und Siegen bei wiederholter Migration vollständig', () => { const data = emptyData(); data.journey = newJourney(data.scores, now); data.journey.totalPoints = 1145; data.journey.modules.math = { level: 11, progress: 2, completed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], bossWins: [5, 10], bossAttempts: [5, 10], lastActivity: now }; expect(migrateData(migrateData(data))).toEqual(data); expect(readBackup(JSON.stringify(data))).toEqual(data); });
    it('übernimmt Punkte aus einer alten Sicherung in ein neues lokales Profil', () => { const current = { ...emptyData(), journey: newJourney({}, now) }, old = emptyData(); old.scores.math = 300; expect(prepareImport(current, old).journey!.totalPoints).toBe(300); });
    it('weist widersprüchliche Level und Endgegner beim Import zurück',()=>{const data={...emptyData(),journey:newJourney({},now)};data.journey.modules.math.progress=999;expect(()=>readBackup(JSON.stringify(data))).toThrow();data.journey.modules.math.progress=0;data.journey.modules.math.bossWins=[5];expect(()=>readBackup(JSON.stringify(data))).toThrow();});
    it('weist beschädigte und zukünftige Journey-Formate zurück statt sie als leeren Stand zu deuten', () => { const data = { ...emptyData(), journey: newJourney({}, now) }; expect(() => readBackup(JSON.stringify({ ...data, journey: { ...data.journey, schemaVersion: 2 } }))).toThrow(); expect(() => dataSchema.parse({ ...data, journey: { ...data.journey, totalPoints: -1 } })).toThrow(); });
    it('zieht bei Import älterer Daten weder Punkte noch Siege ab', () => { const data = { ...emptyData(), journey: newJourney({}, now) }; data.journey.totalPoints = 1145; data.journey.modules.math.bossWins = [5]; const imported = prepareImport(data, emptyData()); expect(imported.journey).toEqual(data.journey); });
});
describe('Satzbau: gleichwertige Aufzählungen', () => {
    const task = sentences.find(t => t.id === 'sentence.normal.v1.071')!;
    const draft = (tokens: string[]) => { const used = new Set<number>(); return tokens.map(t => { const i = task.tokens.findIndex((token, i) => token === t && !used.has(i)); used.add(i); return i; }); };
    it('akzeptiert alle sechs Gegenstandsreihenfolgen', () => { for (const items of [['Brot', 'Käse', 'Obst'], ['Brot', 'Obst', 'Käse'], ['Käse', 'Brot', 'Obst'], ['Käse', 'Obst', 'Brot'], ['Obst', 'Käse', 'Brot'], ['Obst', 'Brot', 'Käse']])
        expect(checkSentence(task, draft(['Ich', 'nehme', items[0], ',', items[1], 'und', items[2], 'mit', '.']))).toBe(true); });
    it('erkennt Kommafehler, fehlende/doppelte Wörter und falsche Satzstellung getrennt', () => { expect(sentenceError(task, draft(['Ich', 'nehme', 'Brot', 'Käse', ',', 'und', 'Obst', 'mit', '.']))).toContain('Komma'); expect(checkSentence(task, draft(['Ich', 'nehme', 'Brot', ',', 'Käse', 'und', 'Obst', 'mit']))).toBe(false); expect(checkSentence(task, [0, 0, 2, 3, 4, 5, 6, 7, 8])).toBe(false); expect(sentenceError(task, draft(['nehme', 'Ich', 'Brot', ',', 'Käse', 'und', 'Obst', 'mit', '.']))).toContain('Satzstellung'); });
});
