import {describe,it,expect} from 'vitest';
import {emptyData,dataSchema} from '../src/lib/schema';
import {questions} from '../src/content';
import {nextMathTask,recordLearningAnswer} from '../src/learning/adaptive';
import {generateTask,seededRandom} from '../src/learning/generator';
import {DAY,emptyCompetency} from '../src/learning/mastery';
import {inMathCategory} from '../src/learning/categories';
import {practiceQueue,wordById,sentences,checkSentence,normalSentenceQueue} from '../src/activities/content';
import {migrateData} from '../src/learning/migration';
const pool=questions.filter(q=>q.subject==='math');
describe('Änderungsauftrag 20. Oktober',()=>{
 it('wechselt nach drei Aufgaben mit Zehnerübergang zu negativen Ergebnissen',()=>{
  let data=emptyData();const used:string[]=[],signatures:string[]=[];
  for(let i=0;i<7;i++){
   const task=nextMathTask(pool,data,{used,signatures,random:seededRandom(i*97),now:1000+i})!;
   expect(task.skillId).toBe(i<3?'math.add.carry':'math.number.negative');
   if(i>=3){expect(Number(task.options[task.correct])).toBeLessThan(0);expect(task.help.visual?.kind).toBe('number-line');}
   data=recordLearningAnswer(data,task,true,0,1000+i).data;used.push(task.id);signatures.push(task.signature);
  }
 });
 it('wählt alle Kategorien unabhängig von drei Schwierigkeitsstufen',()=>{
  for(const category of ['arithmetic','negative','fraction','percent','estimate','other'])for(const pace of ['easier','fit','challenge'] as const){
   const data=emptyData();data.learning.preferences.math={pace,explanation:'plain'};
   const task=nextMathTask(pool,data,{used:[],signatures:[],category,random:seededRandom(12)})!;
   expect(task).toBeDefined();expect(inMathCategory(task.skillId,category)).toBe(true);
   if(task.generated)expect(task.difficulty).toBe(pace==='easier'?1:pace==='fit'?2:3);
  }
 });
 it('sperrt konkrete Varianten nach zwei Erfolgen für sieben Tage und begrenzt die Historie',()=>{
  const task=generateTask('math.number.negative',2,()=>0)!;
  let data=recordLearningAnswer(emptyData(),task,true,0,1000).data;
  data=recordLearningAnswer(data,task,true,0,1001).data;
  expect(dataSchema.parse(data).learning.variants[task.signature].correct).toBe(2);
  const select=(now:number)=>nextMathTask(pool,data,{category:'negative',used:[],signatures:[],random:()=>0,now})!;
  expect(select(2*DAY).signature).not.toBe(task.signature);
  expect(select(8*DAY).signature).toBe(task.signature);
  data.learning.variants=Object.fromEntries(Array.from({length:2000},(_,i)=>['old'+i,{correct:1,at:i}]));
  data=recordLearningAnswer(data,task,true,0,9*DAY).data;
  expect(Object.keys(data.learning.variants)).toHaveLength(2000);
 });
 it('behält alte Punkte, Einstellungen und Kompetenzdaten bei der Ergänzung der Sitzungsspeicher',()=>{
  const data=emptyData();data.scores.math=350;data.settings.reducedMotion=true;data.learning.competencies.old={...emptyCompetency(),attempts:5,correct:3};
  const legacy=JSON.parse(JSON.stringify(data));delete legacy.rounds;delete legacy.cardSession;delete legacy.learning.variants;
  const restored=migrateData(legacy);expect(restored.scores.math).toBe(350);expect(restored.settings.reducedMotion).toBe(true);expect(restored.learning.competencies.old.correct).toBe(3);expect(restored.rounds).toEqual({});
 });
 it('trennt anspruchsvollen Wortschatz vom Normalmodus und hält zehn Fragen verfügbar',()=>{
  for(const level of ['normal','hard'] as const)for(const category of ['everyday','work'] as const){
   const config=emptyData().activities.vocabulary;config.level=level;config.enabled={everyday:category==='everyday',work:category==='work',sentences:false};
   const ids=practiceQueue(config);expect(ids).toHaveLength(10);expect(ids.every(id=>id.startsWith('vocabulary.hard.')===(level==='hard'))).toBe(true);expect(ids.every(id=>['everyday','work'].includes(wordById.get(id)?.category??''))).toBe(true);
  }
 });
 it('validiert jede generierte Satzkombination und vermeidet kürzlich gezeigte Sätze',()=>{
  const generated=sentences.filter(s=>s.id.startsWith('sentence.generated'));
  expect(generated).toHaveLength(240);expect(new Set(generated.map(t=>t.tokens.join(' '))).size).toBe(240);
  for(const task of generated){expect(checkSentence(task,task.tokens.map((_,i)=>i))).toBe(true);expect(checkSentence(task,task.tokens.map((_,i)=>i).reverse())).toBe(false);}
  const config=emptyData().activities.vocabulary;const id=normalSentenceQueue(config)[0];config.sentences[id]={at:Date.now(),correct:0,attempts:1,lastCorrect:false};expect(normalSentenceQueue(config)[0]).not.toBe(id);
 });
});
