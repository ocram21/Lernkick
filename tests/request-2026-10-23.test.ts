import {describe,it,expect} from 'vitest';
import {emptyData,dataSchema} from '../src/lib/schema';
import {migrateData} from '../src/learning/migration';
import {newJourney} from '../src/learning/journey';
import {equationTask,applyOperation,rational,numberText,solvedEquation} from '../src/learning/equations';
import {generateTask,seededRandom} from '../src/learning/generator';
import {nextMathTask} from '../src/learning/adaptive';
import {mathCategories} from '../src/learning/categories';
import {spellingTasks,spellingById} from '../src/activities/spelling';
import {grammarTasks} from '../src/activities/grammar';
import {sentences,practiceQueue,checkSentence} from '../src/activities/content';
import {prepareVocabularyMode} from '../src/activities/difficulty';

describe('Änderungen 23.10.: fachliche Aufgaben und Bestandsschutz',()=>{
 it('löst 800 Streber-Gleichungen aller vier Familien exakt und eindeutig',()=>{
  const families=new Set<string>();
  for(let i=0;i<800;i++){
   const t=equationTask(3,seededRandom(i*7919)),q=t.equation!,x=Number(t.options[0]);
   const value=(a:typeof q.a,b:typeof q.b)=>a.n/a.d*x+b.n/b.d;
   expect(value(q.a,q.b)).toBeCloseTo(value(q.c,q.d),10);
   expect(q.a.n/q.a.d).not.toBe(q.c.n/q.c.d);expect(q.c.n).not.toBe(0);
   families.add(q.a.d>1?'fraction-coefficient':q.b.d>1?'fraction-constant':q.a.n<0?'negative-coefficient':'signed');
   let current=q;
   for(const op of [(q.c.n<0?'+':'-')+numberText({...q.c,n:Math.abs(q.c.n)})+'x',(q.b.n<0?'+':'-')+numberText({...q.b,n:Math.abs(q.b.n)}),':'+numberText(rational(q.a.n*q.c.d-q.c.n*q.a.d,q.a.d*q.c.d))]){
    const next=applyOperation(current,op);expect(next).not.toHaveProperty('error');if('equation'in next)current=next.equation;
   }
   expect(solvedEquation(current)).toBe(true);expect(current.d.n/current.d.d).toBe(x);
  }
  expect(families.size).toBe(4);
 });
 it('begrenzt Normal-1×1 auf 100 und erweitert Streber mit moderaten Faktoren',()=>{
  for(const level of [1,2,3])for(let i=0;i<200;i++){
   const t=generateTask('math.multiply.facts',level,seededRandom(i*7919),true)!,[a,b]=t.generated!.operands;
   expect(Number(t.options[0])).toBe(a*b);expect(a).toBeLessThanOrEqual(25);expect(b).toBeLessThanOrEqual(16);
   if(level<3)expect(a*b).toBeLessThanOrEqual(100);else expect(a*b).toBeGreaterThan(100);
  }
  expect(mathCategories.find(c=>c.id==='times')?.label).toBe('1 × 1');expect(mathCategories.find(c=>c.id==='estimate')?.label).toBe('Schätzen');
 });
 for(const difficulty of ['normal','hard']as const)it(`mischt 40 Geometrie-Runden ausgewogen ohne direkte Typwiederholung: ${difficulty}`,()=>{
  for(let seed=0;seed<40;seed++){
   const d=emptyData();d.settings.difficulty=difficulty;const used:string[]=[],signatures:string[]=[],kinds:number[]=[];
   for(let i=0;i<10;i++){
    const t=nextMathTask([],d,{used,signatures,category:'geometry',random:seededRandom(seed*7919+i*37)})!;
    const kind=Number(t.signature.split(':')[2]);kinds.push(kind);used.push(t.id);signatures.push(t.signature);
    const {width:w,height:h}=t.diagram!;const answer=kind===0?2*(w+h):kind===1?w*h:w*h/2;
    expect(Number(t.options[0].split(' ')[0].replace(',','.'))).toBe(answer);
    if(i)expect(kind).not.toBe(kinds[i-1]);
   }
   const counts=[0,1,2].map(k=>kinds.filter(v=>v===k).length);expect(Math.max(...counts)-Math.min(...counts)).toBeLessThanOrEqual(1);expect(new Set(signatures).size).toBe(10);
  }
 });
 it('hat geprüfte Sätze und plausible eindeutige Optionen in beiden Niveaus',()=>{
  expect(spellingTasks).toHaveLength(30);expect(grammarTasks.filter(t=>!t.archived)).toHaveLength(44);
  for(const t of [...spellingTasks,...grammarTasks.filter(t=>!t.archived)]){expect(new Set(t.options).size).toBe(3);expect(t.explanation.length).toBeGreaterThan(20);}
  for(const t of sentences.filter(t=>!t.archived)){expect(t.id).toContain('sentence.subject.');expect(checkSentence(t,[...t.tokens.keys()])).toBe(true);}
  for(const level of ['normal','hard']as const){const c=emptyData().activities.vocabulary;c.level=level;c.enabled={everyday:false,work:false,sentences:false,grammar:false,proverbs:false,spelling:true};const ids=practiceQueue(c);expect(ids).toHaveLength(10);expect(new Set(ids).size).toBe(10);expect(ids.every(id=>spellingById.get(id)?.level===level)).toBe(true);}
 });
 it('ergänzt Rechtschreibung verlustfrei, bewahrt alte Einstellungen und offene Aufgaben',()=>{
  const d=emptyData();d.journey=newJourney(d.scores);d.journey.strength=80;d.journey.totalPoints=1820;d.cards=[{id:'keep',subject:'math',rubric:'arithmetic',front:'Meine Karte',back:'Meine Antwort'}];d.study.box.preset=false;d.study.box.own=false;d.activities.vocabulary.session={ids:['sentence.normal.v1.001'],index:0,draft:[1,0],answer:null,solved:false};d.activities.vocabulary.grammar.old={attempts:4,correct:3,lastCorrect:true,at:1};
  d.activities.vocabulary.enabled.spelling=false;const raw=JSON.parse(JSON.stringify(d));delete raw.activities.vocabulary.spelling;delete raw.activities.vocabulary.enabled.spelling;
  const migrated=migrateData(raw);expect(migrated).toEqual(d);expect(migrateData(migrated)).toEqual(migrated);expect(dataSchema.parse(migrated)).toEqual(d);
 });
 it('wechselt Rechtschreibniveau und erhält bereits bewertete Aufgaben und Punkte',()=>{
  const d=emptyData(),ids=spellingTasks.filter(t=>t.level==='normal').slice(0,10).map(t=>t.id);d.activities.vocabulary.session={globalDifficulty:'normal',ids,index:1,draft:[],answer:0,solved:true,first:{[ids[0]]:false,[ids[1]]:true}};d.settings.difficulty='hard';const next=prepareVocabularyMode(d);expect(next.activities.vocabulary.session!.ids.slice(0,2)).toEqual(ids.slice(0,2));expect(next.activities.vocabulary.session!.ids.slice(2).every(id=>spellingById.get(id)?.level==='hard')).toBe(true);expect(next.scores).toEqual(d.scores);
 });
});
