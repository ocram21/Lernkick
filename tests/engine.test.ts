import { describe, expect, it } from 'vitest';
import { contentPacks, questions } from '../src/content';
import { nextQuestion, recordAnswer, shuffle } from '../src/lib/engine';
import { contentSchema, emptyData } from '../src/lib/schema';
import { readBackup } from '../src/lib/storage';
describe('Lernlogik', () => {
  it('hat validierte eindeutige Fragen in allen fünf Fächern', () => { for(const subject of ['math','german','social','biology','geography']) expect(questions.filter(q=>q.subject===subject)).toHaveLength(subject==='german'?150:100); expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length); });
  it('beginnt leicht und wiederholt keine Frage innerhalb einer Runde', () => { const pool=questions.filter(q=>q.subject==='math');const used:string[]=[];for(let i=0;i<10;i++){const q=nextQuestion(pool,emptyData(),used)!;if(i===0)expect(q.difficulty).toBe(1);expect(used).not.toContain(q.id);used.push(q.id);}expect(used).toHaveLength(10); });
  it('priorisiert fällige Fragen und setzt Fehler auf Box null',()=>{const q=questions[0];const {data}=recordAnswer(emptyData(),q,false,1000);expect(data.progress[q.id].box).toBe(0);expect(data.progress[q.id].due).toBe(601000);expect(nextQuestion(questions,data,[],602000)?.id).toBe(q.id);});
  it('steigert die Box und vergibt höchstens einmal je 24 Stunden Punkte',()=>{const q=questions[0];const first=recordAnswer(emptyData(),q,true,1000);const second=recordAnswer(first.data,q,true,2000);expect(first.points).toBe(10);expect(second.points).toBe(0);expect(second.data.progress[q.id].box).toBe(2);expect(recordAnswer(second.data,q,true,86401000).points).toBe(10);});
  it('schätzt Schwierigkeit erst über mehrere Antworten ein',()=>{let data=emptyData();for(let i=0;i<5;i++)data=recordAnswer(data,questions[i],true,1000+i).data;expect(nextQuestion(questions.filter(q=>q.subject==='math'),data,questions.slice(0,5).map(q=>q.id),2000)?.difficulty).toBe(3);});
  it('mischt ohne Datenverlust',()=>{const source=[1,2,3,4];expect(shuffle(source).sort()).toEqual(source);expect(source).toEqual([1,2,3,4]);});
});
describe('Datensicherung',()=>{it('liest eine eigene Sicherung vollständig ein',()=>expect(readBackup(JSON.stringify(emptyData()))).toEqual(emptyData()));it('weist fremde Versionen und ungültige Lernstände zurück',()=>{expect(()=>readBackup('{"version":2}')).toThrow();expect(()=>readBackup(JSON.stringify({...emptyData(),progress:{x:{box:99}}}))).toThrow();});});

describe('Redaktionelle Inhalte', () => {
  it('ordnet alle Fragen einer belegten Lehrplanquelle zu und bietet alle drei Stufen', () => {
    for (const pack of contentPacks) {
      expect(pack.version).toBe(2);
      if(pack.version !== 2) continue;
      expect(pack.reviewStatus).toBe('teacher-review-pending');
      const ids = new Set(pack.sources.map(source => source.id));
      for (const question of pack.questions) {
        expect(ids.has(question.curriculum!.sourceId)).toBe(true);
        expect(question.explanation.length).toBeGreaterThan(25);
      }
      expect(new Set(pack.questions.map(q => q.difficulty))).toEqual(new Set([1,2,3]));
      expect(new Set(pack.questions.map(q => q.prompt)).size).toBe(pack.questions.length);
      expect(pack.questions.some(q => q.curriculum!.stage === 'grade9')).toBe(true);
    }
  });
  it('weist Inhaltsdateien mit unbekannten oder fehlenden Quellen zurück', () => {
    const pack = contentPacks[0];
    expect(() => contentSchema.parse({...pack, sources: []})).toThrow();
    expect(() => contentSchema.parse({...pack, questions: [{...pack.questions[0], curriculum: { sourceId:'unbekannt', section:'3', stage:'foundation' }}]})).toThrow();
  });
  it('kann jedes Fach als Zehn-Fragen-Runde ohne Dopplungen zusammenstellen', () => {
    for(const subject of ['math','german','social','biology','geography']) {
      const pool=questions.filter(q=>q.subject===subject), used:string[]=[];
      for(let i=0;i<10;i++) { const q=nextQuestion(pool,emptyData(),used)!; expect(q).toBeDefined(); expect(used).not.toContain(q.id); used.push(q.id); }
    }
  });
});
