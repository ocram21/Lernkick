import type { Subject, UserData } from '../lib/schema';
const subjects:Subject[]=['math','german','social','biology','geography'];
// Logical milestones, independent of image assets or segment geometry. Legacy links stay stable.
const legacyMath=['number.compare','add.no-carry','add.carry','subtract.no-borrow','subtract.borrow','multiply.facts','divide.exact','fraction.basic','percent.basic','equation.linear','geometry.area','data.summary'];
export const progressTracks=Object.fromEntries(subjects.map(subject=>[subject,Array.from({length:12},(_,index)=>({id:`${subject}.practice80:step-${index+1}`,legacy:subject==='math'?[`math.${legacyMath[index]}:growing`,`math.${legacyMath[index]}:secure`]:[`${subject}.practice:step-${index+1}`]}))])) as Record<Subject,{id:string;legacy:string[]}[]>;
export function recordProgressEvidence(data:UserData,subject:Subject,signature:string,correct:boolean,help:number,now=Date.now()):{data:UserData;newMilestones:string[]} {
  const previous=data.learning.evidence[subject]??{window:[],seen:{}};
  const seenAt=previous.seen[signature];
  const seen={...previous.seen,[signature]:now};
  const independent=help===0&&(seenAt===undefined||now-seenAt>=86_400_000)&&!previous.window.some(entry=>entry.signature===signature);
  let window=independent?[...previous.window,{signature,correct,at:now}].slice(-5):previous.window;
  const unlocks={...data.learning.unlocks};const newMilestones:string[]=[];
  if(window.length===5&&window.filter(entry=>entry.correct).length>=4) {
    const milestone=progressTracks[subject].find(track=>![track.id,...track.legacy].some(id=>Boolean(unlocks[id])));
    if(milestone){unlocks[milestone.id]={at:now,subject,skillId:`${subject}.practice`,milestone:'practice80'};newMilestones.push(milestone.id);}
    window=[];
  }
  return {data:{...data,learning:{...data.learning,unlocks,evidence:{...data.learning.evidence,[subject]:{window,seen}}}},newMilestones};
}
