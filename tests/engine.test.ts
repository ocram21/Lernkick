import { describe, expect, it } from 'vitest';
import { questions } from '../src/content';
import { nextQuestion, recordAnswer, shuffle } from '../src/lib/engine';
import { emptyData } from '../src/lib/schema';
import { readBackup } from '../src/lib/storage';
describe('Lernlogik', () => {
  it('hat mindestens zehn validierte eindeutige Fragen pro spielbarem Fach', () => { for(const subject of ['math','german']) expect(questions.filter(q=>q.subject===subject).length).toBeGreaterThanOrEqual(10); expect(new Set(questions.map(q=>q.id)).size).toBe(questions.length); });
  it('beginnt leicht und wiederholt keine Frage innerhalb einer Runde', () => { const pool=questions.filter(q=>q.subject==='math');const used:string[]=[];for(let i=0;i<10;i++){const q=nextQuestion(pool,emptyData(),used)!;if(i===0)expect(q.difficulty).toBe(1);expect(used).not.toContain(q.id);used.push(q.id);}expect(used).toHaveLength(10); });
  it('priorisiert fällige Fragen und setzt Fehler auf Box null',()=>{const q=questions[0];const {data}=recordAnswer(emptyData(),q,false,1000);expect(data.progress[q.id].box).toBe(0);expect(data.progress[q.id].due).toBe(601000);expect(nextQuestion(questions,data,[],602000)?.id).toBe(q.id);});
  it('steigert die Box und vergibt höchstens einmal je 24 Stunden Punkte',()=>{const q=questions[0];const first=recordAnswer(emptyData(),q,true,1000);const second=recordAnswer(first.data,q,true,2000);expect(first.points).toBe(10);expect(second.points).toBe(0);expect(second.data.progress[q.id].box).toBe(2);expect(recordAnswer(second.data,q,true,86401000).points).toBe(10);});
  it('schätzt Schwierigkeit erst über mehrere Antworten ein',()=>{let data=emptyData();for(let i=0;i<5;i++)data=recordAnswer(data,questions[i],true,1000+i).data;expect(nextQuestion(questions.filter(q=>q.subject==='math'),data,questions.slice(0,5).map(q=>q.id),2000)?.difficulty).toBe(3);});
  it('mischt ohne Datenverlust',()=>{const source=[1,2,3,4];expect(shuffle(source).sort()).toEqual(source);expect(source).toEqual([1,2,3,4]);});
});
describe('Datensicherung',()=>{it('liest eine eigene Sicherung vollständig ein',()=>expect(readBackup(JSON.stringify(emptyData()))).toEqual(emptyData()));it('weist fremde Versionen und ungültige Lernstände zurück',()=>{expect(()=>readBackup('{"version":2}')).toThrow();expect(()=>readBackup(JSON.stringify({...emptyData(),progress:{x:{box:99}}}))).toThrow();});});
