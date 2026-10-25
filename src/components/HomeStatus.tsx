import {useEffect,useState,type CSSProperties,type RefObject} from 'react';
export type StatusReading={points:number;strength:number};
export function counterDigits(points:number){return Math.max(0,Math.trunc(points)).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:0}).padStart(6,'0');}
export function HomeStatus({points,strength,previous,onOpen}:{points:number;strength:number;previous:RefObject<StatusReading|null>;onOpen:()=>void}){
 const [change,setChange]=useState(()=>({from:previous.current??{points,strength},to:{points,strength}}));
 if(change.to.points!==points||change.to.strength!==strength)setChange({from:change.to,to:{points,strength}});
 useEffect(()=>{previous.current={points,strength};},[points,strength,previous]);
 const digits=counterDigits(points),before=counterDigits(change.from.points).padStart(digits.length,'0');
 const lit=Math.floor(Math.max(0,Math.min(100,strength))*.4),oldLit=Math.floor(Math.max(0,Math.min(100,change.from.strength))*.4);
 return <button className="home-status" aria-label="Persönliche Statistik öffnen" aria-describedby="home-points home-strength" onClick={onOpen}>
  <span className="score-block"><span className="status-label">Score</span><strong className="points-row"><span id="home-points" className="sr-only">Score {points.toLocaleString('de-DE')}</span><span className="counter-digits" aria-hidden="true" style={{'--counter-scale':Math.min(1,6/digits.length)} as CSSProperties}>{[...digits].map((digit,index)=>{const from=before[before.length-digits.length+index]??'0',changed=from!==digit;return <span className="counter-window" key={digits.length-index}><span key={`${change.from.points}-${points}-${index}`} className={`counter-track${changed?' rolling':''}`}>{changed&&<span>{from}</span>}<span>{digit}</span></span></span>;})}</span></strong></span>
  <span id="home-strength" className="strength-row"><span className="strength-caption status-label">Skill <span className="skill-value">{strength.toLocaleString('de-DE',{maximumFractionDigits:1})} %</span></span><span className="skill-instrument"><span className="strength-leds" role="meter" aria-label="Skill" aria-valuemin={0} aria-valuemax={100} aria-valuenow={strength}>{Array.from({length:40},(_,index)=><i key={index} aria-hidden="true" className={`strength-led${index<lit?' lit':''}${index<lit&&index>=oldLit?' newly-lit':''}`}/>)}</span><span className="skill-scale" aria-hidden="true">{[0,25,50,75,100].map(value=><span key={value}>{value}</span>)}</span></span></span>
 </button>;
}
