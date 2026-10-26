import {describe,it,expect} from 'vitest';
import {learningComplexes,complexesFor,complexChoices} from '../src/learning/complexes';
import {nextComplexQuestion} from '../src/learning/complexSelection';
import {complexQuestions} from '../src/content/complexes';
import {questions,archivedSubjectQuestions} from '../src/content';
import {subjectPool} from '../src/learning/difficulty';
import {emptyData,dataSchema,questionSchema} from '../src/lib/schema';
import {topicsFor,rubricNames,selectedTopics} from '../src/study/topics';
import {standardCards} from '../src/study/cards';
import {bossTasks} from '../src/learning/boss';
import {migrateData} from '../src/learning/migration';
import {newJourney} from '../src/learning/journey';
import {asTask} from '../src/learning/tasks';
import {legacyComplex} from '../src/learning/legacyComplex';
describe('Lernkomplexe',()=>{
 it('14 gemeinsame Katalogeinträge mit vollständigen eindeutigen Pools und Karten',()=>{
  expect(complexQuestions).toHaveLength(700);expect(new Set(complexQuestions.map(q=>q.id)).size).toBe(700);expect(new Set(complexQuestions.map(q=>q.prompt)).size).toBe(700);
  for(const [subject,n] of [['biology',4],['geography',5],['social',5]] as const){expect(complexesFor(subject)).toHaveLength(n);expect(topicsFor(subject)).toEqual(complexesFor(subject).map(c=>c.id));}
  for(const c of learningComplexes){expect(rubricNames[c.id]).toBe(c.title);const pool=complexQuestions.filter(q=>q.complexId===c.id);expect(pool).toHaveLength(50);expect(pool.every(q=>q.subject===c.subject&&questionSchema.safeParse(q).success)).toBe(true);expect([1,2,3].map(d=>pool.filter(q=>q.difficulty===d).length)).toEqual([15,15,20]);expect(standardCards.filter(q=>q.rubric===c.id&&q.id.startsWith('standard.complex.'))).toHaveLength(8);}
 });
 it('Einzel- und Mehrfachwahl sind ausgeglichen, ohne Wiederholung und beachten Schwierigkeit',()=>{
  for(const c of learningComplexes)for(const difficulty of ['normal','hard'] as const){const data=emptyData();data.settings.difficulty=difficulty;const pool=subjectPool(questions,c.subject,difficulty),selection=[c.id],used:string[]=[];for(let i=0;i<10;i++){const q=nextComplexQuestion(pool,data,c.subject,selection,used)!;expect(q.complexId).toBe(c.id);expect(difficulty==='hard'?q.difficulty===3:q.difficulty<3).toBe(true);expect(used).not.toContain(q.id);used.push(q.id);}}
  for(const subject of ['biology','geography','social'] as const){const d=emptyData(),pool=subjectPool(questions,subject,'normal'),used:string[]=[],counts:Record<string,number>={};for(let i=0;i<10;i++){const q=nextComplexQuestion(pool,d,subject,undefined,used)!;used.push(q.id);counts[q.complexId!]=(counts[q.complexId!]??0)+1;}expect(Math.max(...Object.values(counts))-Math.min(...Object.values(counts))).toBeLessThanOrEqual(1);expect(nextComplexQuestion(pool,d,subject,[],[])).toBeUndefined();}
 });
 it('Leere und unbekannte Auswahl starten keinen Ersatzpool; erschöpfter Pool endet robust',()=>{expect(complexChoices('biology',[])).toEqual([]);expect(complexChoices('biology',['soc-state'])).toEqual([]);const d=emptyData(),pool=complexQuestions.filter(q=>q.complexId==='bio-cells');expect(nextComplexQuestion(pool,d,'biology',['bio-cells'],pool.map(q=>q.id))).toBeUndefined();});
 it('Alte Daten behalten Punkte, Lernstände, Kartenreview und laufende Aufgaben',()=>{
  const d=emptyData();d.journey={...newJourney(d.scores),totalPoints:432,strength:64};d.progress['biology-001']={box:2,due:0,attempts:3,correct:2,lastAward:1};d.study.reviews['standard.biology.v1.001']={box:2,due:0,attempts:3,known:2,lastRated:1};const legacy={...d};delete (legacy as any).complexSelection;const next=migrateData(legacy);expect(next.complexSelection).toEqual({});expect(next.progress).toEqual(d.progress);expect(next.journey).toEqual(d.journey);expect(next.study.reviews).toEqual(d.study.reviews);expect(selectedTopics('biology',['cells','body'])).toEqual(['bio-cells','bio-metabolism']);expect(dataSchema.safeParse(next).success).toBe(true);
 });
 it('Eine gespeicherte Aufgabe aus dem früheren Fragenkatalog bleibt vollständig lesbar',()=>{const d=emptyData(),q=archivedSubjectQuestions.find(q=>q.subject==='biology')!;d.rounds.biology={id:'legacy-round',kind:'subject',subject:'biology',mode:'adaptive',length:10,current:asTask(q),options:q.options.map((_,i)=>i),used:[],signatures:[],correctSignatures:[],helpLevel:0,panel:null,milestones:[],answer:null,correct:0,points:0,done:false,history:[]};const old=JSON.parse(JSON.stringify(d));delete old.complexSelection;const next=migrateData(old);expect(next.rounds.biology).toEqual(d.rounds.biology);expect(next.rounds.biology.current.options[next.rounds.biology.current.correct]).toBe(q.options[q.correct]);});
 it('Bosskampf verwendet seinen Fachpool unabhängig von der Auswahl; alte Nachweise bleiben nutzbar',()=>{
  for(const subject of ['biology','geography','social'] as const){const d=emptyData();d.complexSelection[subject]=[];for(const q of questions.filter(q=>q.subject===subject))d.progress[q.id]={box:1,due:0,attempts:1,correct:1,lastAward:0};expect(bossTasks(d,subject)).toHaveLength(10);expect(bossTasks(d,subject).every(q=>questions.some(p=>p.id===q.id&&p.subject===subject))).toBe(true);const old=archivedSubjectQuestions.find(q=>q.subject===subject)!;const legacy=emptyData();legacy.progress[old.id]={box:1,due:0,attempts:1,correct:1,lastAward:0};expect(legacyComplex(old)).toBeTruthy();expect(bossTasks(legacy,subject)).toHaveLength(10);}
 });
});
