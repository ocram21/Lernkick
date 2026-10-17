import { ArrowRight, CircleHelp, SlidersHorizontal } from 'lucide-react';
import type { HelpLevel, LearningTask, Pace } from '../learning/types';
export function LearningTools({task,helpLevel,panel,pace,alternate,onPanel,onHelp,onChoice,disabled}:{task:LearningTask;helpLevel:HelpLevel;panel:'help'|'pace'|null;pace:Pace;alternate:boolean;onPanel:(panel:'help'|'pace'|null)=>void;onHelp:(level:HelpLevel)=>void;onChoice:(choice:Pace|'alternate')=>void;disabled:boolean}) {
  return <section className="learning-tools" aria-label="Hilfe und Lernweg">
    <div className="tool-bar"><button disabled={disabled} aria-expanded={panel==='help'} onClick={()=>{onPanel(panel==='help'?null:'help');if(panel!=='help'&&helpLevel===0)onHelp(1);}}><CircleHelp size={18}/>Hilfe</button><button disabled={disabled} aria-expanded={panel==='pace'} onClick={()=>onPanel(panel==='pace'?null:'pace')}><SlidersHorizontal size={18}/>Lernweg</button></div>
    {panel==='pace'&&<div className="tool-panel"><p>Was brauchst du gerade?</p><div className="pace-choices">{([{id:'easier',label:'Mach’s leichter'},{id:'fit',label:'Passt genau'},{id:'challenge',label:'Mehr Herausforderung'}] as const).map(choice=><button key={choice.id} disabled={disabled} aria-pressed={pace===choice.id} onClick={()=>onChoice(choice.id)}>{choice.label}</button>)}<button disabled={disabled} aria-pressed={alternate} onClick={()=>onChoice('alternate')}>Erklär’s anders</button></div><p className="tool-note">Deine Wahl gilt für die nächsten Aufgaben. Du kannst sie jederzeit ändern.</p></div>}
    {panel==='help'&&<div className="tool-panel" aria-live="polite"><strong>{helpLevel===3?'Lösung verstehen':helpLevel===2?'Ein Beispiel':'Ein Hinweis'}</strong><p>{helpLevel===3?task.explanation:helpLevel===2?task.help.example:alternate?task.help.alternate:task.help.hint}</p>
      {helpLevel<3&&task.help.visual&&<CalculationVisual visual={task.help.visual}/>}
      {helpLevel<3&&<button className="text-button" disabled={disabled} onClick={()=>onHelp((helpLevel+1) as HelpLevel)}>{helpLevel===1?'Beispiel ansehen':'Lösung erklären'}<ArrowRight size={16}/></button>}
      <button className="text-button" disabled={disabled} onClick={()=>onPanel(null)}>Hilfe schließen</button>
    </div>}
  </section>;
}
function CalculationVisual({visual}:{visual:NonNullable<LearningTask['help']['visual']>}) {
  if(visual.kind==='groups')return <div className="dot-groups" role="img" aria-label={`${visual.start} Gruppen mit je ${visual.change} Punkten`}>{Array.from({length:visual.start},(_,i)=><span key={i}>{Array.from({length:visual.change},(_,j)=><i key={j}/>)}</span>)}</div>;
  // Show the starting number and direction without giving away the endpoint at hint level.
  const forward=visual.change>=0;
  return <svg className="number-line" viewBox="0 0 300 55" role="img" aria-label={`Zahlenstrahl: Starte bei ${visual.start}, gehe ${Math.abs(visual.change)} Schritte nach ${forward?'rechts':'links'}.`}><line x1="15" y1="23" x2="285" y2="23"/>{[35,80,125,170,215,260].map(x=><line key={x} x1={x} y1="17" x2={x} y2="29"/>)}<circle cx={forward?80:215} cy="23" r="5"/><path d={forward?'M90 10 H210 l-8 -5 M210 10 l-8 5':'M205 10 H85 l8 -5 M85 10 l8 5'}/><text x={forward?80:215} y="48" textAnchor="middle">Start: {visual.start}</text><text x={forward?200:100} y="48" textAnchor="middle">{forward?'+':'−'} {Math.abs(visual.change)}</text></svg>;
}
