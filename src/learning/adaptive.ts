import {equationTask} from './equations';
import {inMathCategory} from './categories';
import type { Question, Subject, UserData } from '../lib/schema';
import { recordAnswer } from '../lib/engine';
import { mathById, mathCompetencies } from './mathCompetencies';
import { generateTask, seededRandom } from './generator';
import { asTask, skillFor } from './tasks';
import { confidence, updateCompetency, DAY } from './mastery';
import type { HelpLevel, LearningTask } from './types';
import { recordProgressEvidence } from './progressRules';
export const preferenceFor=(data:UserData,subject:Subject)=>data.learning.preferences[subject]??{pace:'fit' as const,explanation:'plain' as const};
export type SelectionContext={used:string[];signatures:string[];now?:number;random?:()=>number;category?:string};
export function nextMathTask(pool:Question[],data:UserData,context:SelectionContext):LearningTask|undefined {
  const now=context.now??Date.now(),random=context.random??Math.random;const preference=preferenceFor(data,'math');
  if(context.category==='equation'){for(let i=0;i<100;i++){const task=equationTask(preference.pace==='easier'?1:preference.pace==='challenge'?3:2,i<20?random:seededRandom(i*7919));if(!context.signatures.includes(task.signature)&&!context.used.includes(task.id)&&(!data.learning.variants[task.signature]||now-data.learning.variants[task.signature].at>=DAY))return task;}return;}
  pool=pool.filter(q=>inMathCategory(skillFor(q),context.category));
  const available=pool.filter(q=>!context.used.includes(q.id));
  const fresh=(task:LearningTask)=>!(data.progress[task.id]?.correct>=2&&now-data.progress[task.id].lastAward<7*DAY)&&inMathCategory(task.skillId,context.category)&&!(data.learning.variants[task.signature]&&(data.learning.variants[task.signature].correct>=2?now-data.learning.variants[task.signature].at<7*DAY:now-data.learning.variants[task.signature].at<DAY))&&!context.used.includes(task.id)&&!context.signatures.includes(task.signature)&&!pool.some(q=>context.used.includes(q.id)&&q.prompt===task.prompt);
  const choose=(skillId:string,level:number,support=false,ceiling=support?level:3)=>{
    if(!support)level=preference.pace==='easier'?1:preference.pace==='challenge'?3:2;
    // Finite attempts plus deterministic fallback: even a constant RNG cannot loop forever.
    for(let i=0;i<80;i++) {
      const task=generateTask(skillId,level,i<24?random:seededRandom(i*7919),context.category==='times');
      if(!task)break;
      if(fresh(task))return {...task,support};
    }
    const candidates=available.filter(q=>skillFor(q)===skillId&&q.difficulty<=ceiling).map(asTask).filter(fresh);
    candidates.sort((a,b)=>Math.abs(a.difficulty-level)-Math.abs(b.difficulty-level));
    return candidates[0]?{...candidates[0],support}:undefined;
  };
  const recovery=data.learning.recovery.math;
  if(recovery&&inMathCategory(recovery.skillId,context.category)) {
    const skill=mathById.get(recovery.skillId);
    // After repeated errors, interleave a prerequisite rather than trapping the learner.
    if(recovery.failures>0&&recovery.failures%3===0&&recovery.supportLeft===2&&skill?.prerequisites.length) {
      const last=Object.values(data.learning.competencies).flatMap(s=>s.observations).sort((a,b)=>b.at-a.at)[0];
      if(last&&data.learning.competencies[recovery.skillId]?.observations.at(-1)?.taskId===last.taskId) {
        const foundation=choose(skill.prerequisites[0],1,true);if(foundation)return foundation;
      }
    }
    const task=choose(recovery.skillId,recovery.supportLeft>0?Math.max(1,recovery.originalLevel-1):recovery.originalLevel,recovery.supportLeft>0,recovery.originalLevel);
    if(task)return task;
    for(const prerequisite of skill?.prerequisites??[]) {const fallback=choose(prerequisite,1,true,recovery.originalLevel);if(fallback)return fallback;}
    const foundation=choose('math.number.compare',1,true);if(foundation)return foundation;
  }
  // The mixed entry introduces carrying briefly, then negative subtraction.
  if(!context.category||context.category==='mixed') {
    const carry=data.learning.competencies['math.add.carry']?.attempts??0;
    const negative=data.learning.competencies['math.number.negative']?.attempts??0;
    if(carry<3){const task=choose('math.add.carry',1);if(task)return task;}
    if(negative<4){const task=choose('math.number.negative',1);if(task)return task;}
  }
  // Explicit old Leitner entries remain reachable even when prerequisites were never observed.
  const dueQuestions=available.filter(q=>data.progress[q.id]?.attempts>0&&data.progress[q.id].due<=now).sort((a,b)=>data.progress[a.id].due-data.progress[b.id].due);
  const review=dueQuestions.map(asTask).find(fresh);if(review)return review;
  const eligible=mathCompetencies.filter(skill=>inMathCategory(skill.id,context.category)&&!['math.number.compare','math.add.no-carry'].includes(skill.id));
  const overdue=eligible.filter(skill=>data.learning.competencies[skill.id]?.observations.length&&data.learning.competencies[skill.id].due<=now).sort((a,b)=>data.learning.competencies[a.id].due-data.learning.competencies[b.id].due);
  const ongoing=eligible.filter(skill=>confidence(data.learning.competencies[skill.id])==='practicing').sort((a,b)=>(data.learning.competencies[b.id].observations.at(-1)?.at??0)-(data.learning.competencies[a.id].observations.at(-1)?.at??0));
  const newSkills=eligible.filter(skill=>!data.learning.competencies[skill.id]?.observations.length);
  const rest=[...eligible].sort((a,b)=>(data.learning.competencies[a.id]?.attempts??0)-(data.learning.competencies[b.id]?.attempts??0));
  for(const skill of [...overdue,...ongoing,...newSkills,...rest]) {
    const base=data.learning.competencies[skill.id]?.level??1;
    const desired=preference.pace==='easier'?Math.max(1,base-1):preference.pace==='challenge'?Math.min(3,base+1):base;
    const task=choose(skill.id,desired);if(task)return task;
  }
  // Catalog fallback keeps a round playable if a future competency pack is incomplete.
  return available.map(asTask).find(fresh);
}
export function recordLearningAnswer(data:UserData,task:LearningTask,correct:boolean,help:HelpLevel,now=Date.now()):{data:UserData;points:number;newMilestones:string[]} {
  const recorded=recordAnswer(data,task,correct,now);const learning={...data.learning,competencies:{...data.learning.competencies},unlocks:{...data.learning.unlocks},recovery:{...data.learning.recovery},awards:{...data.learning.awards}};
  const state=updateCompetency(learning.competencies[task.skillId],{taskId:task.id,signature:task.signature,at:now,correct,help,level:task.difficulty});
  learning.competencies[task.skillId]=state;
  learning.variants=Object.fromEntries(Object.entries({...learning.variants,[task.signature]:{correct:(learning.variants[task.signature]?.correct??0)+Number(correct),at:now}}).sort((a,b)=>b[1].at-a[1].at).slice(0,2000));
  // Generated IDs are transient evidence; the bounded signature history owns repetition.
  const generatedIds=Object.keys(recorded.data.progress).filter(id=>id.startsWith('practice.math.'));
  for(const id of generatedIds.slice(0,Math.max(0,generatedIds.length-2000)))delete recorded.data.progress[id];
  if(task.subject==='math') {
    const pending=learning.recovery.math;
    if(!correct)learning.recovery.math={skillId:task.skillId,originalLevel:pending?.skillId===task.skillId?pending.originalLevel:task.difficulty,supportLeft:2,failures:pending?.skillId===task.skillId?pending.failures+1:1,...(pending?{returnTo:pending.skillId===task.skillId?pending.returnTo:pending.returnTo??{skillId:pending.skillId,originalLevel:pending.originalLevel}}:{})};
    else if(pending?.skillId===task.skillId) {
      if(pending.supportLeft>0)learning.recovery.math={...pending,supportLeft:pending.supportLeft-1};
      else if(help===0){if(pending.returnTo)learning.recovery.math={...pending.returnTo,supportLeft:1,failures:0};else delete learning.recovery.math;}
      else learning.recovery.math={...pending,supportLeft:1};
    }
  }
  let points=recorded.points;
  if(task.generated) {
    const award=learning.awards[task.skillId];
    points=correct&&(award===undefined||now-award>=DAY)?task.difficulty*10:0;
    if(points)learning.awards[task.skillId]=now;
    else recorded.data.progress[task.id].lastAward=data.progress[task.id]?.lastAward??0;
  }
  const progress=recordProgressEvidence({...recorded.data,learning},task.subject,task.signature,correct,help,now);
  return {...progress,points};
}
