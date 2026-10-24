import { describe, expect, it } from 'vitest';
import { questions } from '../src/content';
import { dataSchema, emptyData, questionSchema, type UserData } from '../src/lib/schema';
import { mathById, mathCompetencies } from '../src/learning/mathCompetencies';
import { mathAssignments, asTask } from '../src/learning/tasks';
import { generateTask, seededRandom } from '../src/learning/generator';
import { nextMathTask, recordLearningAnswer } from '../src/learning/adaptive';
import { confidence, DAY, emptyCompetency, updateCompetency } from '../src/learning/mastery';
import { migrateData, prepareImport } from '../src/learning/migration';
import { mosaicWorlds, segmentVisible } from '../src/learning/mosaics';
import { readBackup } from '../src/lib/storage';
const pool=questions.filter(q=>q.subject==='math');
function legacyFixture() {const {learning:_,...old}=emptyData();return {...old,version:1,progress:{'math-002':{box:4,due:987654,attempts:9,correct:7,lastAward:123}},scores:{math:120,german:10,social:0,biology:0,geography:0},cards:[{id:'old-card',front:'Bleibt?',back:'Ja',subject:'math'}],settings:{reducedMotion:true}};}
function correctTask(data:UserData,skillId:string,seed:number,at:number,help:0|1|2|3=0,level=1) {return recordLearningAnswer(data,generateTask(skillId,level,seededRandom(seed))!,true,help,at).data;}
describe('Kompetenzstruktur',()=>{
  it('enthält eindeutige stabile IDs, gültige Voraussetzungen und keine Zyklen',()=>{
    expect(mathById.size).toBe(mathCompetencies.length);
    const visit=(id:string,path:string[])=>{expect(path).not.toContain(id);const node=mathById.get(id);expect(node).toBeDefined();for(const parent of node!.prerequisites)visit(parent,[...path,id]);};
    mathCompetencies.forEach(skill=>{expect(skill.levels).toHaveLength(3);visit(skill.id,[]);});
  });
  it('ordnet alle bisherigen Mathefragen prüfbar zu und kennzeichnet kombinierte Aufgaben',()=>{
    expect(Object.keys(mathAssignments)).toHaveLength(100);
    pool.forEach(q=>{const mapping=mathAssignments[q.id];expect(mathById.has(mapping.skillId)).toBe(true);expect(mapping.note.length).toBeGreaterThan(20);});
    expect(mathAssignments['math-099'].status).toBe('provisional');
  });
});
describe('Deterministische Generatoren',()=>{
  it('erzeugt für viele Parameter gültige Lösungen, eindeutige Antworten und passende Übergänge',()=>{
    for(const skill of mathCompetencies.filter(s=>s.generator))for(const level of [1,2,3])for(let seed=0;seed<150;seed++) {
      const task=generateTask(skill.id,level,seededRandom(seed))!;questionSchema.parse(task);
      const [a,b]=task.generated!.operands;const op=task.generated!.operation;
      const result=op==='compare'?Math.max(a,b):op==='add'?a+b:op==='subtract'?a-b:op==='multiply'?a*b:op==='estimate'?Math.round(a/10)*10*Math.round(b):op==='percent'?a*b/100:a/b;
      expect(Number(task.options[task.correct])).toBe(result);expect(Number.isInteger(result)).toBe(true);if(skill.id!=='math.number.negative')expect(result).toBeGreaterThanOrEqual(0);else expect(result).toBeLessThan(0);
      expect(task).toEqual(generateTask(skill.id,level,seededRandom(seed)));
      if(skill.id==='math.add.no-carry')expect(a%10+b%10).toBeLessThan(10);
      if(skill.id==='math.add.carry')expect(a%10+b%10).toBeGreaterThanOrEqual(10);
      if(skill.id==='math.subtract.no-borrow')expect(a%10).toBeGreaterThanOrEqual(b%10);
      if(skill.id==='math.subtract.borrow')expect(a%10).toBeLessThan(b%10);
      if(op==='divide'){expect(b).toBeGreaterThan(0);expect(a%b).toBe(0);}
    }
  });
  it('liefert auch mit konstanter Zufallsquelle neue Varianten ohne Endlosschleife',()=>{
    const used:string[]=[],signatures:string[]=[];const data=emptyData();
    for(let i=0;i<15;i++){const task=nextMathTask(pool,data,{used,signatures,random:()=>0})!;expect(task).toBeDefined();expect(signatures).not.toContain(task.signature);used.push(task.id);signatures.push(task.signature);}
  });
});
describe('Lernpfad',()=>{
  it('beginnt mit Zehnerübergang und verändert nur die geübte Einzelkompetenz',()=>{
    let data=emptyData();const first=nextMathTask(pool,data,{used:[],signatures:[],random:seededRandom(3)})!;
    expect(first.skillId).toBe('math.add.carry');expect(first.difficulty).toBe(1);
    data=correctTask(data,'math.number.compare',1,1000);expect(data.learning.competencies['math.number.compare'].level).toBe(1);
    expect(data.learning.competencies['math.add.carry']).toBeUndefined();
    expect(nextMathTask(pool,data,{used:[first.id],signatures:[first.signature]})!.skillId).toBe('math.add.carry');
  });
  it('steigert erst nach mehreren unabhängigen Beobachtungen und beachtet Voraussetzungen',()=>{
    let data=emptyData();for(const [index,seed] of [1,42,1111].entries())data=correctTask(data,'math.number.compare',seed,1000+index*1000);
    expect(data.learning.competencies['math.number.compare'].level).toBe(2);
    expect(confidence(data.learning.competencies['math.number.compare'])).toBe('growing');
    const next=nextMathTask(pool,data,{used:[],signatures:[],now:4000})!;expect(next.skillId).toBe('math.add.carry');
    const challenge=emptyData();challenge.settings.difficulty='hard';challenge.learning.preferences.math={pace:'challenge',explanation:'plain'};
    expect(nextMathTask(pool,challenge,{used:[],signatures:[]})!.skillId).toBe('math.add.carry');
    expect(nextMathTask(pool,challenge,{used:[],signatures:[]})!.difficulty).toBe(3);
    expect(challenge.learning.competencies).toEqual({});
  });
  it('bietet nach Fehlern leichtere neue Varianten und prüft danach die ursprüngliche Stufe',()=>{
    const original=generateTask('math.add.carry',3,seededRandom(4))!;
    let data=recordLearningAnswer(emptyData(),original,false,0,1000).data;
    const used=[original.id],signatures=[original.signature];
    for(let i=0;i<2;i++){const support=nextMathTask(pool,data,{used,signatures,now:2000+i*1000})!;expect(support.skillId).toBe(original.skillId);expect(support.difficulty).toBe(2);expect(support.support).toBe(true);used.push(support.id);signatures.push(support.signature);data=recordLearningAnswer(data,support,true,1,2000+i*1000).data;}
    const retry=nextMathTask(pool,data,{used,signatures,now:5000})!;expect(retry.difficulty).toBe(2);expect(retry.support).toBe(false);expect(signatures).not.toContain(retry.signature);
    data=recordLearningAnswer(data,retry,true,0,6000).data;expect(data.learning.recovery.math).toBeUndefined();
  });
  it('fängt wiederholte Fehler mit variierenden Aufgaben und einem Grundlagenschritt ab',()=>{
    let data=emptyData();const used:string[]=[],signatures:string[]=[];
    for(let i=0;i<3;i++){const task=generateTask('math.add.carry',1,seededRandom(i+10))!;used.push(task.id);signatures.push(task.signature);data=recordLearningAnswer(data,task,false,0,1000+i*1000).data;}
    const next=nextMathTask(pool,data,{used,signatures,now:5000})!;expect(next.skillId).toBe('math.add.no-carry');expect(next.support).toBe(true);
    data=recordLearningAnswer(data,next,true,1,6000).data;
    expect(nextMathTask(pool,data,{used:[...used,next.id],signatures:[...signatures,next.signature],now:7000})!.skillId).toBe('math.add.carry');
  });
  it('vergisst die ursprüngliche Herausforderung auch bei einem Fehler im Grundlagenschritt nicht',()=>{
    let data=emptyData();
    for(let i=0;i<3;i++)data=recordLearningAnswer(data,generateTask('math.add.carry',3,seededRandom(i*200+1))!,false,0,1000+i*1000).data;
    const foundation=nextMathTask(pool,data,{used:[],signatures:[],now:4000})!;
    expect(foundation.skillId).toBe('math.add.no-carry');
    data=recordLearningAnswer(data,foundation,false,0,5000).data;
    expect(data.learning.recovery.math.returnTo).toEqual({skillId:'math.add.carry',originalLevel:3});
    for(let i=0;i<3;i++){const task=generateTask('math.add.no-carry',1,seededRandom(1000+i*1000))!;data=recordLearningAnswer(data,task,true,i===2?0:1,6000+i*1000).data;}
    expect(data.learning.recovery.math.skillId).toBe('math.add.carry');
    const support=nextMathTask(pool,data,{used:[],signatures:[],now:10000})!;data=recordLearningAnswer(data,support,true,1,11000).data;
    expect(nextMathTask(pool,data,{used:[support.id],signatures:[support.signature],now:12000})!.difficulty).toBe(2);
  });
  it('macht eine Unterstützung aus dem Katalog nicht schwerer als die Ausgangsaufgabe',()=>{
    const task=asTask(pool.find(q=>q.id==='math-090')!);
    const data=recordLearningAnswer(emptyData(),task,false,0,1000).data;
    const support=nextMathTask(pool,data,{used:[task.id],signatures:[task.signature],now:2000})!;
    expect(support.difficulty).toBeLessThanOrEqual(task.difficulty);expect(support.support).toBe(true);
  });
  it('wertet Hilfe nicht als eigenständige Beherrschung und plant frühere Wiederholung',()=>{
    let state=emptyCompetency();for(let i=0;i<4;i++)state=updateCompetency(state,{taskId:'a'+i,signature:'a'+i,level:2,help:2,correct:true,at:1000+i});
    expect(state.level).toBe(1);expect(confidence(state)).toBe('practicing');expect(state.due).toBe(1003+30*60_000);
    const slow=updateCompetency(undefined,{taskId:'x',signature:'x',level:1,help:0,correct:true,at:1000+4*DAY});expect(slow.level).toBe(1); // no response-time input exists
  });
  it('verwechselt direkte Wiederholung und eine einzelne richtige Antwort nicht mit Sicherheit',()=>{
    let data=emptyData();for(let i=0;i<5;i++)data=correctTask(data,'math.number.compare',1,1000+i);
    expect(confidence(data.learning.competencies['math.number.compare'])).toBe('practicing');expect(data.learning.unlocks).toEqual({});
  });
  it('holt fällige Fähigkeiten in neuen Varianten und bestehende Leitnerfragen zurück',()=>{
    let data=correctTask(emptyData(),'math.number.compare',1,1000);
    expect(nextMathTask(pool,data,{used:[],signatures:[],now:1000+DAY})!.skillId).toBe('math.add.carry');
    data.learning.competencies['math.add.carry']={...emptyCompetency(),attempts:3};data.learning.competencies['math.number.negative']={...emptyCompetency(),attempts:4};
    data.progress['math-031']={box:0,due:1000,attempts:2,correct:0,lastAward:0};
    expect(nextMathTask(pool,data,{used:[],signatures:[],now:2000})!.id).toBe('math-031');
  });
  it('begrenzt Punkte für Generatorvarianten je Kompetenz und Tag ohne Minuspunkte',()=>{
    const first=generateTask('math.number.compare',1,seededRandom(1))!,second=generateTask('math.number.compare',1,seededRandom(40))!;
    const one=recordLearningAnswer(emptyData(),first,true,0,1000);expect(one.points).toBe(10);
    expect(recordLearningAnswer(one.data,second,true,0,2000).points).toBe(0);
    expect(recordLearningAnswer(one.data,second,false,0,2000).points).toBe(0);
    expect(recordLearningAnswer(one.data,second,true,0,1000+DAY).points).toBe(10);
  });
});
describe('Dauerhafte Freischaltungen und Migration',()=>{
  it('sichert über Zeit gefestigte Erfolge dauerhaft, auch nach Rückfall oder anderem Motiv',()=>{
    let data=emptyData();for(const [i,seed] of [1,42,1111,5000,9000].entries())data=correctTask(data,'math.number.compare',seed,1000+i*DAY);
    expect(confidence(data.learning.competencies['math.number.compare'])).toBe('secure');
    const unlocked=data.learning.unlocks['math.practice80:step-1'];expect(unlocked).toBeDefined();
    data=recordLearningAnswer(data,generateTask('math.number.compare',2,seededRandom(9))!,false,0,4*DAY).data;
    expect(confidence(data.learning.competencies['math.number.compare'])).not.toBe('secure');expect(data.learning.unlocks['math.practice80:step-1']).toEqual(unlocked);
    const segment=mosaicWorlds[0].segments[0];expect(segmentVisible(data,{...segment,id:'neues-motiv'})).toBe(true);
    expect(readBackup(JSON.stringify(data))).toEqual(data);
  });
  it('übernimmt alte Sicherungen vollständig, ohne Sicherheit oder Zeitpunkte zu erfinden',()=>{
    const old=legacyFixture(),next=migrateData(old);
    expect(next.version).toBe(7);expect(next.progress).toEqual(old.progress);expect(next.cards).toEqual(old.cards.map(card=>({rubric:'general',...card})));expect(next.scores).toEqual(old.scores);expect(next.settings).toEqual({...old.settings,pink:false,difficulty:'normal',compact:false,bossMode:false});
    const skill=next.learning.competencies['math.add.carry'];expect(skill.baseline).toEqual({attempts:9,correct:7});expect(skill.observations).toEqual([]);expect(confidence(skill)).toBe('new');expect(next.learning.unlocks).toEqual({});
    expect(readBackup(JSON.stringify(old))).toEqual(next);expect(migrateData(next)).toEqual(next);
  });
  it('behält dauerhafte Erfolge auch beim Wiederherstellen einer alten Sicherung',()=>{
    const current=emptyData();current.learning.unlocks['math.number.compare:growing']={at:1000,subject:'math',skillId:'math.number.compare',milestone:'growing'};
    const incoming=migrateData(legacyFixture()),restored=prepareImport(current,incoming);
    expect(restored.progress).toEqual(incoming.progress);expect(restored.cards).toEqual(incoming.cards);expect(restored.learning.unlocks).toEqual(current.learning.unlocks);
  });
  it('erhält unbekannte stabile IDs, weist beschädigte und künftige Sicherungen zurück',()=>{
    const data=emptyData();data.learning.unlocks['future.art:secure']={at:1,subject:'math',skillId:'future.art',milestone:'secure'};data.progress['old-unknown']={box:5,due:100,attempts:8,correct:7,lastAward:10};
    expect(readBackup(JSON.stringify(data))).toEqual(data);
    expect(()=>migrateData({...data,version:8})).toThrow();expect(()=>readBackup(JSON.stringify({...legacyFixture(),progress:{bad:{box:99}}}))).toThrow();expect(()=>dataSchema.parse({...data,learning:{}})).toThrow();
  });
  it('bietet für andere Fächer getrennte austauschbare Welten ohne Änderung ihrer Auswahl',()=>{
    expect(new Set(mosaicWorlds.map(w=>w.subject)).size).toBe(5);
    let data=emptyData();for(const q of questions.filter(q=>q.subject==='german').slice(0,5))data=recordLearningAnswer(data,asTask(q),true,0,1000).data;
    expect(data.learning.unlocks['german.practice80:step-1']).toBeDefined();expect(data.learning.recovery.german).toBeUndefined();
    expect(mosaicWorlds.find(w=>w.subject==='german')!.segments.some(s=>segmentVisible(data,s))).toBe(true);
  });
});
