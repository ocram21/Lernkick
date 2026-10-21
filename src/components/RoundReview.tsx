import {QuestionPrompt} from './QuestionPrompt';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Pause,Play} from 'lucide-react';
import type {ReviewEntry} from '../lib/roundReview';
export function PauseControl({paused,onChange}:{paused:boolean;onChange:(value:boolean)=>void}){return <button className="pause-button" aria-label={paused?'Fortsetzen':'Pause'} aria-pressed={paused} onClick={()=>onChange(!paused)}>{paused?<Play size={17}/>:<Pause size={17}/>} <span className="pause-label">{paused?'Fortsetzen':'Pause'}</span></button>;}
export function RoundReview({history}:{history:ReviewEntry[]}){
 const [index,setIndex]=useState(Math.max(0,history.length-1));
 useEffect(()=>setIndex(Math.max(0,history.length-1)),[history.length]);
 const entry=history[index];
 return <section className="round-review" aria-label="Rückblick"><div className="review-navigation"><button className="icon-button" aria-label="Vorherige beantwortete Aufgabe" disabled={index===0||!entry} onClick={()=>setIndex(index-1)}><ArrowLeft/></button><strong>{entry?`Rückblick ${index+1} von ${history.length}`:'Pause'}</strong><button className="icon-button" aria-label="Nächste beantwortete Aufgabe" disabled={!entry||index===history.length-1} onClick={()=>setIndex(index+1)}><ArrowRight/></button></div><p>Nur ansehen. Dein Lernstand bleibt unverändert.</p>{entry?<><span className="question-topic">{entry.title}</span><h1><QuestionPrompt text={entry.prompt} highlight={entry.title==='Deutsch'}/></h1><dl><dt>Deine Antwort</dt><dd>{entry.ownAnswer||'Keine Antwort eingesetzt.'}</dd><dt>Richtige Lösung</dt><dd>{entry.correctAnswer}</dd></dl><strong>{entry.correct?'Richtig gelöst.':'Noch üben.'}</strong><p>{entry.explanation}</p></>:<p>Noch keine Aufgabe beantwortet. Mit „Fortsetzen“ kehrst du zur aktuellen Aufgabe zurück.</p>}</section>;
}
