import {useEffect,useState,type CSSProperties,type RefObject} from 'react';
export type StatusReading={points:number;strength:number};
export function counterDigits(points:number){return Math.max(0,Math.trunc(points)).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:0}).padStart(6,'0');}
export function HomeStatus({points,strength,previous,onOpen}:{points:number;strength:number;previous:RefObject<StatusReading|null>;onOpen:()=>void}){
 const [change,setChange]=useState(()=>({from:previous.current??{points,strength},to:{points,strength}}));
 if(change.to.points!==points||change.to.strength!==strength)setChange({from:change.to,to:{points,strength}});
 useEffect(()=>{previous.current={points,strength};},[points,strength,previous]);
 const digits=counterDigits(points),before=counterDigits(change.from.points).padStart(digits.length,'0');
 const lit=Math.floor(Math.max(0,Math.min(100,strength))*.8),oldLit=Math.floor(Math.max(0,Math.min(100,change.from.strength))*.8);
 return <button className="home-status aluminum-frame" aria-label="Persönliche Statistik öffnen" aria-describedby="home-points home-strength" onClick={onOpen}>
  <strong className="points-row"><span id="home-points" className="sr-only">{points.toLocaleString('de-DE')} Punkte</span><span className="counter-digits" aria-hidden="true" style={{'--counter-scale':Math.min(1,6/digits.length)} as CSSProperties}>{[...digits].map((digit,index)=>{const from=before[before.length-digits.length+index]??'0',changed=from!==digit;return <span className="counter-window" key={digits.length-index}><span key={`${change.from.points}-${points}-${index}`} className={`counter-track${changed?' rolling':''}`}>{changed&&<span>{from}</span>}<span>{digit}</span></span></span>;})}</span><span className="points-label" aria-hidden="true">Punkte</span></strong>
  <span id="home-strength" className="strength-row"><span className="strength-caption">Lernstärke {strength.toLocaleString('de-DE',{maximumFractionDigits:1})} %</span><span className="strength-leds" role="meter" aria-label="Lernstärke" aria-valuemin={0} aria-valuemax={100} aria-valuenow={strength}>{Array.from({length:80},(_,index)=><i key={index} aria-hidden="true" className={`strength-led${index<lit?' lit':''}${index<lit&&index>=oldLit?' newly-lit':''}`} style={{'--led-color':`var(--led-${Math.min(4,Math.floor(index/16))})`} as CSSProperties}/>)}</span></span>
 </button>;
}
