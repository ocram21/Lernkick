import type { CompetencyState, Observation } from '../lib/schema';
export const DAY=86_400_000;
export const emptyCompetency = (): CompetencyState => ({baseline:{attempts:0,correct:0},observations:[],helpRequests:0,attempts:0,correct:0,due:0,level:1});
export function independentObservations(state?: CompetencyState): Observation[] {
  // Re-answering an identical variant immediately is practice, not independent evidence.
  return (state?.observations??[]).filter((o,i,all)=>o.correct&&o.help===0&&!all.slice(0,i).some(previous=>previous.signature===o.signature&&o.at-previous.at<DAY));
}
export function confidence(state?: CompetencyState): 'new'|'practicing'|'growing'|'secure' {
  if(!state?.observations.length)return 'new';
  const recent=state.observations.slice(-6),independent=independentObservations({...state,observations:recent});
  if(independent.length<3||new Set(independent.map(o=>o.signature)).size<3)return 'practicing';
  const span=independent.at(-1)!.at-independent[0].at;
  return span>=20*60*60*1000&&recent.slice(-2).every(o=>o.correct&&o.help===0)?'secure':'growing';
}
export function prerequisiteReady(state?: CompetencyState): boolean {
  const evidence=independentObservations(state);
  return new Set(evidence.map(o=>o.signature)).size>=2 || Boolean(state&&state.baseline.attempts>=3&&state.baseline.correct/state.baseline.attempts>=.6);
}
export function updateCompetency(state: CompetencyState | undefined, observation: Observation): CompetencyState {
  const old=state??emptyCompetency();const observations=[...old.observations,observation].slice(-12);
  const recent=observations.slice(-4),independent=independentObservations({...old,observations:recent});
  let level=old.level;
  if(!observation.correct) level=Math.max(1,Math.min(level,observation.level)-1);
  else if(observation.help>0) level=Math.min(level,observation.level);
  else if(independent.length>=3&&new Set(independent.map(o=>o.signature)).size>=3&&independent.filter(o=>o.level>=level).length>=3) level=Math.min(3,level+1);
  const provisional={...old,observations,attempts:old.attempts+1,correct:old.correct+Number(observation.correct),level};
  const interval=!observation.correct?10*60_000:observation.help>0?30*60_000:confidence(provisional)==='secure'?7*DAY:confidence(provisional)==='growing'?DAY:4*60*60_000;
  return {...provisional,due:observation.at+interval};
}
