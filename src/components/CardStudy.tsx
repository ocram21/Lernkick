import {ExitButton} from './ExitButton';
import { useState } from 'react';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import type { Card } from '../lib/schema';
export function CardStudy({cards,title,done,onRate,onDone,onExit,onRestart,session,onSession}:{session:{index:number;flipped:boolean;known:number};onSession:(value:{index:number;flipped:boolean;known:number})=>void;cards:Card[];title:string;done:boolean;onRate:(id:string,known:boolean)=>Promise<boolean>;onDone:()=>void;onExit:()=>void;onRestart:()=>void}) {
  const [index,setIndex]=useState(session.index),[flipped,setFlipped]=useState(session.flipped),[saving,setSaving]=useState(false),[known,setKnown]=useState(session.known);
  const card=cards[index];
  async function rate(value:boolean){if(!flipped||saving||!card)return;setSaving(true);const saved=await onRate(card.id,value);setSaving(false);if(!saved)return;onSession({index:Math.min(index+1,cards.length-1),flipped:false,known:known+Number(value)});setKnown(n=>n+Number(value));setFlipped(false);if(index+1===cards.length)onDone();else setIndex(index+1);}
  if(done)return <main className="round-view"><ExitButton onClick={onExit}/><section className="result"><Check size={40}/><h1>Runde geschafft.</h1><p>{known} von {cards.length} Karten als gewusst markiert.</p><button className="primary" onClick={onRestart}>Noch eine Runde<RotateCcw size={18}/></button></section></main>;
  return <main className="round-view card-study"><div className="round-top"><ExitButton onClick={onExit}/><strong>{title}</strong><span>{cards.length?`Karte ${index+1} von ${cards.length}`:''}</span></div>
    {!card?<div className="round-scroll empty-study"><h1>Für heute ist alles wiederholt.</h1><p>Bekannte Karten kommen später wieder. Neue Karten legst du unter „Meine Karten“ an.</p></div>:<><div className="round-scroll"><section className="question"><span className="question-topic">{flipped?'Antwort':'Meine Karten'}</span><h1>{card.front}</h1></section>{flipped&&<section className="card-solution" aria-live="polite"><h2>Antwort</h2><p>{card.back}</p></section>}</div><div className="round-actions">{flipped?<div className="card-rating"><button className="small-button" disabled={saving} onClick={()=>rate(false)}>Noch üben</button><button className="primary" data-action="confirm" disabled={saving} onClick={()=>rate(true)}>Gewusst<Check size={18}/></button></div>:<button className="primary" onClick={()=>{setFlipped(true);onSession({index,flipped:true,known});}}>Antwort zeigen</button>}</div></>}
  </main>;
}
