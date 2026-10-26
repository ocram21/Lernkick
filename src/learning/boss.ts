import {legacyComplex} from './legacyComplex';
import type {UserData,Subject} from '../lib/schema';
import {questions,archivedSubjectQuestions} from '../content';
import {subjectPool} from './difficulty';
import {generateTask} from './generator';
import {equationTask} from './equations';
import {appliedMathTask} from './appliedMath';
import {asTask,skillFor} from './tasks';
import {grammarTasks} from '../activities/grammar';
import {spellingTasks} from '../activities/spelling';
import {proverbTasks} from '../activities/proverbs';
import {words,sentences,type SentenceTask} from '../activities/content';
import {wordQuestion} from '../study/cards';
import {shuffle} from '../lib/engine';
import type {LearningTask} from './types';
export type BossTask={id:string;prompt:string;options:string[];correct:number;explanation:string;task?:LearningTask;sentence?:SentenceTask};
export function bossTasks(data:UserData,subject:Subject,test=false):BossTask[]{
 const all=test||subject==='german';
 const level=data.settings.difficulty,hard=level==='hard',known=new Set(questions.filter(q=>data.progress[q.id]?.attempts).map(q=>q.competency));
 for(const q of archivedSubjectQuestions){if(q.subject===subject&&data.progress[q.id]?.attempts){const id=legacyComplex(q);if(id)known.add(id);}}
 const groups:BossTask[][]=[];
 if(subject==='math'){
  const skills=Object.entries(data.learning.competencies).filter(([,s])=>s.attempts>0).map(([id])=>id);
  for(const q of questions.filter(q=>q.subject==='math'&&data.progress[q.id]?.attempts))skills.push(skillFor(q));
  if(test)skills.push('math.add.carry','math.multiply.facts','math.equation.linear','math.geometry.area','math.percent.basic');
  const generated:BossTask[]=[];
  for(const skill of new Set(skills))for(let i=0;i<20;i++){
   const difficulty=hard?3:Math.min(2,data.learning.competencies[skill]?.level??1);
   const task=skill==='math.equation.linear'?equationTask(difficulty):skill==='math.geometry.area'?appliedMathTask('geometry',difficulty):skill==='math.ratio.proportion'?appliedMathTask('ratio',difficulty):skill==='math.measure.convert'?appliedMathTask('units',difficulty):generateTask(skill,difficulty);
   if(task)generated.push({...task,task});
  }
  groups.push(shuffle(generated));
 }
 groups.push(shuffle(subjectPool(questions,subject,level).filter(q=>all||data.progress[q.id]?.attempts||known.has(q.competency)).map(q=>({...q,task:asTask(q)}))));
 if(subject==='german'){
  const c=data.activities.vocabulary;
  for(const [tasks,results]of [[grammarTasks,c.grammar],[spellingTasks,c.spelling],[proverbTasks,c.proverbs]] as const)groups.push(shuffle(tasks.filter(t=>!('archived'in t&&t.archived)&&t.level===level&&(all||results[t.id]?.attempts)).map(t=>({...t,correct:0}))));
  groups.push(shuffle(words.filter(w=>!w.archived&&w.id.startsWith('vocabulary.hard.')===hard&&(all||c.words[w.id]?.attempts)).map(w=>({...wordQuestion(w),correct:0}))));
  groups.push(shuffle(sentences.filter(t=>!t.archived&&t.level===level&&(all||c.sentences[t.id]?.attempts)).map(sentence=>({id:sentence.id,prompt:sentence.instruction,options:[],correct:0,explanation:sentence.hint,sentence}))));
 }
 const result:BossTask[]=[],seen=new Set<string>();for(let i=0;result.length<10;i++){let added=false;for(const group of shuffle(groups)){const candidate=group[i];if(candidate&&!seen.has(candidate.id)&&result.length<10){result.push(candidate);seen.add(candidate.id);added=true;}}if(!added&&groups.every(g=>g.length<=i+1))break;}
 return shuffle(result);
}
