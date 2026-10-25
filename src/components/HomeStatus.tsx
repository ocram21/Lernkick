import {useEffect,useRef,useState,type CSSProperties,type RefObject} from 'react';
export type StatusReading={points:number;strength:number};
export function counterDigits(points:number){return Math.max(0,Math.trunc(points)).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:0}).padStart(6,'0');}
// Higher wheels advance only during the final unit before their carry.
export function wheelOffset(value:number,place:number){const digit=Math.floor(value/place)%10;return digit+(place===1?value-Math.floor(value):Math.max(0,value%place-(place-1)));}
export function counterValue(from:number,to:number,progress:number){const t=Math.max(0,Math.min(1,progress)),gain=to-from;if(t===1)return to;if(gain<=200)return from+gain*t*t*(3-2*t);if(t<.3)return from+20*t/.3;if(t>.7)return to-20+20*(t-.7)/.3;return from+20+(gain-40)*(t-.3)/.4;}
export function HomeStatus({points,strength,previous,onOpen,reducedMotion=false}:{points:number;strength:number;previous:RefObject<StatusReading|null>;onOpen:()=>void;reducedMotion?:boolean}){
 const [display,setDisplay]=useState(()=>reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches?points:previous.current?.points??points);
 const displayed=useRef(display),[running,setRunning]=useState(false);
 const [change,setChange]=useState(()=>({from:previous.current??{points,strength},to:{points,strength}}));
 if(change.to.points!==points||change.to.strength!==strength)setChange({from:change.to,to:{points,strength}});
 // Mark the target as seen immediately; leaving during a roll must not replay the award.
 useEffect(()=>{previous.current={points,strength};},[points,strength,previous]);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)'),from=displayed.current;let frame=0,active=true;
  const show=(value:number)=>{displayed.current=value;setDisplay(value);};
  const finish=()=>{cancelAnimationFrame(frame);show(points);setRunning(false);};
  if(reducedMotion||media.matches||points<=from){finish();return;}
  const start=performance.now();setRunning(true);
  const step=(now:number)=>{if(!active)return;const t=Math.min(1,(now-start)/2800);show(counterValue(from,points,t));if(t<1)frame=requestAnimationFrame(step);else setRunning(false);};
  const motionChanged=()=>{if(media.matches){active=false;finish();}};
  media.addEventListener('change',motionChanged);frame=requestAnimationFrame(step);
  return()=>{active=false;cancelAnimationFrame(frame);media.removeEventListener('change',motionChanged);};
 },[points,reducedMotion]);
 const digits=counterDigits(points),lit=Math.floor(Math.max(0,Math.min(100,strength))/5),oldLit=Math.floor(Math.max(0,Math.min(100,change.from.strength))/5);
 return <button className="home-status" aria-label="Persönliche Statistik öffnen" aria-describedby="home-points home-strength" onClick={onOpen}>
  <span className="score-block"><span className="status-label">Score</span><strong className="points-row"><span id="home-points" className="sr-only">Score {points.toLocaleString('de-DE')}</span><span className={`counter-digits${running?' odometer-running':''}`} data-value={Math.floor(display)} aria-hidden="true" style={{'--counter-scale':Math.min(1,6/digits.length)} as CSSProperties}>{[...digits].map((_,index)=><span className="counter-window" key={digits.length-index}><span className="counter-track" style={{transform:`translateY(-${wheelOffset(display,10**(digits.length-index-1))}em)`}}>{Array.from({length:11},(_,digit)=><span key={digit}>{digit%10}</span>)}</span></span>)}</span></strong></span>
  <span id="home-strength" className="strength-row"><span className="strength-caption status-label">Skill</span><span className="skill-instrument"><span className="strength-leds" role="meter" aria-label="Skill" aria-valuemin={0} aria-valuemax={100} aria-valuenow={strength} aria-valuetext={`${strength.toLocaleString('de-DE',{maximumFractionDigits:1})} %`}>{Array.from({length:20},(_,index)=><i key={index} aria-hidden="true" className={`strength-led${index<lit?' lit':''}${index<lit&&index>=oldLit?' newly-lit':''}`}/>)}</span><span className="skill-scale" aria-hidden="true">{[0,25,50,75,100].map(value=><span key={value}>{value}</span>)}</span></span></span>
 </button>;
}
