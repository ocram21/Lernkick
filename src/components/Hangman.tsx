import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { UserData } from '../lib/schema';
import { shuffle } from '../lib/engine';
import { addGuess, alphabet, gameTerms, hangmanState, letters, maxMisses } from '../games/engine';
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
export function Hangman({data,onExit,onFinished,onRunning}:{data:UserData;onExit:()=>void;onFinished:()=>void;onRunning:()=>void}){
 const [revision,setRevision]=useState(0);
 return <Round key={revision} data={data} onExit={onExit} onFinished={onFinished} onRestart={()=>{onRunning();setRevision(value=>value+1);}}/>;
}
function Round({data,onExit,onFinished,onRestart}:{data:UserData;onExit:()=>void;onFinished:()=>void;onRestart:()=>void}){
 const term=useMemo(()=>shuffle(gameTerms(data))[0],[data]);
 const [guessed,setGuessed]=useState<string[]>([]),[revealed,setRevealed]=useState(false);
 const word=term?.answer??'',state=hangmanState(word,guessed),ended=revealed||state.won||state.lost;
 useEffect(()=>{if(ended)onFinished();},[ended,onFinished]);
 function guess(letter:string){if(!ended&&term)setGuessed(previous=>{const before=hangmanState(word,previous);return before.won||before.lost?previous:addGuess(previous,letter);});}
 useEffect(()=>{
  function key(event:KeyboardEvent){
   if(event.altKey||event.metaKey||event.ctrlKey||event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||(event.target instanceof HTMLElement&&event.target.closest('dialog')))return;
   if([...event.key].length===1&&alphabet.includes(letters(event.key))){event.preventDefault();guess(event.key);}
  }
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 });
 return <main className="game-view game-hangman"><div className="game-top"><button className="icon-button" aria-label="Spiel verlassen" onClick={onExit}><ArrowLeft/></button><h1>Galgenraten</h1></div>
 {!term?<div className="game-content"><p>Es fehlen passende kurze Begriffe. Stelle Standardkarten wieder her oder ergänze Wörter im Wortschatz.</p><button className="small-button" onClick={onExit}>Zurück</button></div>:<>
  <div className="game-content">
   <div className="game-clue"><svg className="gallows" viewBox="0 0 100 120" role="img" aria-label={`${state.misses} von ${maxMisses} Fehlversuchen`}>{drawingSteps.slice(0,state.misses).map((step,index)=>step==='head'?<circle key={index} data-drawing-step={index+1} cx="70" cy="30" r="10"/>:<path key={index} data-drawing-step={index+1} d={step}/>)}</svg><p>{term.hint}</p></div>
   <div className="word-slots" aria-label="Gesuchtes Wort">{[...word].map((letter,i)=><span key={i}>{guessed.includes(letter)||ended?letter:''}</span>)}</div>
   <p className="game-instruction" role="status">{state.won?`Gelöst: ${term.word}`:state.lost||revealed?`Das Wort war: ${term.word}`:`${state.remaining} ${state.remaining===1?'Versuch':'Versuche'} übrig`}</p>
   <div className="letter-keyboard" aria-label="Buchstaben">{alphabet.map(letter=><button key={letter} disabled={ended||guessed.includes(letter)} onClick={()=>guess(letter)}>{letter}</button>)}</div>
  </div>
  <div className="game-actions">{ended?<button className="primary" onClick={onRestart}>Noch einmal<RotateCcw size={18}/></button>:<button className="text-button" onClick={()=>setRevealed(true)}>Lösung zeigen</button>}</div>
 </>}
 </main>;
}
