import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,RefreshCw} from 'lucide-react';
/** Self-hosted, complete copy of the user's standalone game. No external navigation. */
export function NBackGame({paused,onExit,onRunningChange}:{paused:boolean;onExit:()=>void;onRunningChange:(running:boolean)=>void}){
 const frame=useRef<HTMLIFrameElement>(null),callback=useRef(onRunningChange);callback.current=onRunningChange;
 const [loaded,setLoaded]=useState(false),[attempt,setAttempt]=useState(0);
 function sendPause(){frame.current?.contentWindow?.postMessage({type:'lernkick:nback-pause',paused},location.origin);}
 useEffect(()=>{sendPause();},[paused,loaded]);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin===location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==='lernkick:nback-state'&&typeof event.data.running==='boolean')callback.current(event.data.running);};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 return <main className="nback-view"><div className="nback-toolbar"><button className="text-button" onClick={onExit}><ArrowLeft size={19}/>Zurück zu LernKick</button><strong>Dual N-Back</strong></div>{!loaded&&<p className="nback-loading" role="status">Spiel wird geladen … <button className="text-button" onClick={()=>setAttempt(n=>n+1)}><RefreshCw size={16}/>Erneut laden</button></p>}<iframe key={attempt} ref={frame} src={`${import.meta.env.BASE_URL}games/dual-n-back/index.html`} title="Dual N-Back Training" className="nback-frame" onLoad={()=>{setLoaded(true);sendPause();}} allow="autoplay"/></main>;
}
