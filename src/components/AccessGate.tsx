import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Check,Delete,Zap} from 'lucide-react';
import {openDB} from 'idb';
import {dailyPin,hasPWAApproval,rememberPWAApproval} from '../lib/access';
export function AccessGate({children}:{children:ReactNode}){
 const [unlocked,setUnlocked]=useState(hasPWAApproval),[ready,setReady]=useState(false),[digits,setDigits]=useState(''),[error,setError]=useState('');
 const input=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  let live=true;
  const database=openDB('lernkick',1,{upgrade(db){if(!db.objectStoreNames.contains('user'))db.createObjectStore('user');}});
  void database.then(async db=>{try{const data=await db.get('user','data');if(live)document.documentElement.dataset.pink=String(data?.settings?.pink===true);}finally{db.close();}}).catch(()=>{}).finally(()=>{if(live)setReady(true);});
  // Cache the gate as well, even before the first successful entry. Prompt updates stay prompt updates.
  if(import.meta.env.PROD&&'serviceWorker'in navigator)void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`,{scope:import.meta.env.BASE_URL}).catch(()=>{});
  return()=>{live=false;};
 },[]);
 useEffect(()=>{if(ready&&!unlocked&&window.matchMedia('(pointer: fine)').matches)input.current?.focus();},[ready,unlocked]);
 function submit(){if(digits.length!==4)return;if(digits===dailyPin()){rememberPWAApproval();setDigits('');setError('');setUnlocked(true);}else{setDigits('');setError('Der Code passt nicht. Bitte versuche es erneut.');if(window.matchMedia('(pointer: fine)').matches)input.current?.focus();}}
 function append(digit:string){setError('');setDigits(value=>(value+digit).slice(0,4));}
 if(unlocked)return <>{children}</>;
 return <main className="access-screen"><div className="access-brand"><Zap size={26} fill="currentColor"/><strong>LERNKICK</strong></div><section className="access-panel" aria-labelledby="access-title"><h1 id="access-title">LernKick öffnen</h1><p>Gib deinen vierstelligen Zugangscode ein.</p>{!ready?<p role="status">Wird vorbereitet …</p>:<form onSubmit={event=>{event.preventDefault();submit();}}><label className="sr-only" htmlFor="access-pin">Zugangscode, vier Ziffern</label><div className="pin-entry"><input ref={input} id="access-pin" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4} autoComplete="off" value={digits} aria-describedby="pin-status" onChange={event=>{setError('');setDigits(event.target.value.replace(/[^0-9]/g,'').slice(0,4));}}/><div className="pin-positions" aria-hidden="true">{[0,1,2,3].map(i=><span key={i}>{digits.length>i?'•':''}</span>)}</div></div><p className="pin-status" id="pin-status" role={error?'alert':'status'}>{error||' '}</p><div className="pin-keypad">{[1,2,3,4,5,6,7,8,9].map(n=><button type="button" key={n} onClick={()=>append(String(n))}>{n}</button>)}<button type="button" aria-label="Letzte Ziffer löschen" disabled={!digits} onClick={()=>{setDigits(value=>value.slice(0,-1));setError('');}}><Delete size={24}/></button><button type="button" onClick={()=>append('0')}>0</button><button className="pin-confirm" type="submit" disabled={digits.length!==4} aria-label="Öffnen"><Check size={25}/><span>Öffnen</span></button></div></form>}</section></main>;
}
