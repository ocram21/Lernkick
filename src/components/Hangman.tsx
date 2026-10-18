import { useEffect,useRef } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { UserData } from '../lib/schema';
import { shuffle } from '../lib/engine';
import { addGuess, alphabet, gameTerms, hangmanState, letters, maxMisses } from '../games/engine';
import {DifficultySwitch}from'./PracticeSwitch';
import {addResult}from'../activities/schema';
const drawingSteps=[
 'M5 115H95', // 1: Fuß
 'M25 115V5', // 2: Stütze
 'M25 5H70', // 3: Querbalken
 'M70 5V20', // 4: Seil
 'head',     // 5: Kopf
 'M70 40V75',// 6: Körper
 'M70 48L50 62', // 7: linker Arm
 'M70 48L90 62', // 8: rechter Arm
 'M70 75L54 100',// 9: linkes Bein
 'M70 75L86 100',// 10: rechtes Bein
];
export function GallowsIcon(){return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 23H23M7 23V3H19V7"/><circle cx="19" cy="10" r="3"/><path d="M19 13V18M19 15L15 17M19 15L23 17M19 18L16 22M19 18L22 22"/></svg>;}
export function Hangman({data,onChange,onExit,onFinished,onRunning}:{data:UserData;onChange:(data:UserData)=>Promise<boolean>;onExit:()=>void;onFinished:()=>void;onRunning:()=>void}){
 const latest=useRef(data);latest.current=data;
 const activity=data.activities.hangman,session=activity.session,term=gameTerms(data,activity.level).find(term=>term.id===session?.termId),word=term?.answer??'',guessed=session?.guessed??[],state=hangmanState(word,guessed),ended=Boolean(session&&(session.revealed||state.won||state.lost));
 function change(next:UserData['activities']['hangman']){const value={...latest.current,activities:{...latest.current.activities,hangman:next}};latest.current=value;void onChange(value);}
 function restart(level=activity.level){const pool=gameTerms(data,level).filter(value=>value.id!==session?.termId);const next=shuffle(pool)[0];onRunning();change({...activity,level,session:{termId:next.id,guessed:[],hinted:false,revealed:false,recorded:false}});}
 useEffect(()=>{if(!session||!term)restart();},[Boolean(session),Boolean(term)]);
 useEffect(()=>{if(ended)onFinished();},[ended,onFinished]);
 function update(next:NonNullable<typeof session>){if(!term)return;const result=hangmanState(word,next.guessed),done=next.revealed||result.won||result.lost;const current=latest.current.activities.hangman;let results=current.results;if(done&&!next.recorded){results={...results,[term.id]:addResult(results[term.id],result.won&&!next.revealed)};next={...next,recorded:true};}change({...current,session:next,results});}
 function guess(letter:string){const current=latest.current.activities.hangman.session;if(!current||current.revealed)return;const before=hangmanState(word,current.guessed);if(before.won||before.lost)return;update({...current,guessed:addGuess(current.guessed,letter)});}
 useEffect(()=>{function key(event:KeyboardEvent){if(event.altKey||event.metaKey||event.ctrlKey||event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||(event.target instanceof HTMLElement&&event.target.closest('dialog')))return;if([...event.key].length===1&&alphabet.includes(letters(event.key))){event.preventDefault();guess(event.key);}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);});
 return <main className="game-view game-hangman"><div className="game-top"><button className="icon-button" aria-label="Spiel verlassen" onClick={onExit}><ArrowLeft/></button><h1>Galgenraten</h1></div><DifficultySwitch level={activity.level} onChange={level=>restart(level)}/>{term&&session&&<><div className="game-content"><div className="game-clue"><svg className="gallows" viewBox="0 0 100 120" role="img" aria-label={`${state.misses} von ${maxMisses} Fehlversuchen`}>{drawingSteps.slice(0,state.misses).map((step,index)=>step==='head'?<circle key={index} data-drawing-step={index+1} cx="70" cy="30" r="10"/>:<path key={index} data-drawing-step={index+1} d={step}/>)}</svg><p>{term.hint}</p></div><div className="word-slots" aria-label="Gesuchtes Wort">{[...word].map((letter,i)=><span key={i}>{guessed.includes(letter)||ended?letter:''}</span>)}</div><p className="game-instruction" role="status">{state.won?`Gelöst: ${term.word}`:state.lost||session.revealed?`Das Wort war: ${term.word}`:`${state.remaining} ${state.remaining===1?'Versuch':'Versuche'} übrig`}</p>{session.hinted&&<p className="hangman-help">{term.extra} Der erste Buchstabe ist {word[0]}.</p>}<div className="letter-keyboard" aria-label="Buchstaben">{alphabet.map(letter=><button key={letter} disabled={ended||guessed.includes(letter)} onClick={()=>guess(letter)}>{letter}</button>)}</div></div><div className="game-actions">{ended?<button className="primary" onClick={()=>restart()}>Noch einmal<RotateCcw size={18}/></button>:<div className="hangman-actions"><button className="small-button" disabled={session.hinted} onClick={()=>update({...session,hinted:true,guessed:addGuess(session.guessed,word[0])})}>Zusätzliche Hilfe</button><button className="text-button" onClick={()=>update({...session,revealed:true})}>Lösung zeigen</button></div>}</div></>}</main>;
}
