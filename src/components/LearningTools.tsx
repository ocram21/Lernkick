import { ArrowRight, CircleHelp, SlidersHorizontal } from 'lucide-react';
import type { HelpLevel, LearningTask, Pace } from '../learning/types';
export function LearningTools({task,helpLevel,panel,pace,alternate,onPanel,onHelp,onChoice,disabled}:{task:LearningTask;helpLevel:HelpLevel;panel:'help'|'pace'|null;pace:Pace;alternate:boolean;onPanel:(panel:'help'|'pace'|null)=>void;onHelp:(level:HelpLevel)=>void;onChoice:(choice:Pace|'alternate')=>void;disabled:boolean}) {
  return <section className="learning-tools" aria-label="Hilfe und Stufe">
    <div className="tool-bar"><button disabled={disabled} aria-expanded={panel==='help'} onClick={()=>{onPanel(panel==='help'?null:'help');if(panel!=='help'&&helpLevel===0)onHelp(1);}}><CircleHelp size={18}/>Hilfe</button><button disabled={disabled} aria-expanded={panel==='pace'} onClick={()=>onPanel(panel==='pace'?null:'pace')}><SlidersHorizontal size={18}/>Stufe</button></div>
    {panel==='pace'&&<div className="tool-panel"><p>Was brauchst du gerade?</p><div className="pace-choices">{([{id:'easier',label:'Leicht'},{id:'fit',label:'Mittel'},{id:'challenge',label:'Schwer'}] as const).map(choice=><button key={choice.id} disabled={disabled} aria-pressed={pace===choice.id} onClick={()=>onChoice(choice.id)}>{choice.label}</button>)}</div><p className="tool-note">Deine Wahl gilt für die nächsten Aufgaben. Du kannst sie jederzeit ändern.</p></div>}
    {panel==='help'&&<div className="tool-panel" aria-live="polite"><strong>{helpLevel===3?'Lösung verstehen':helpLevel===2?'Ein Beispiel':'Ein Hinweis'}</strong><p>{helpLevel===3?task.explanation:helpLevel===2?task.help.example:alternate?task.help.alternate:task.help.hint}</p>
      {helpLevel<3&&task.help.visual&&<CalculationVisual visual={task.help.visual}/>}
      {helpLevel<3&&<button className="text-button" disabled={disabled} onClick={()=>onHelp((helpLevel+1) as HelpLevel)}>{helpLevel===1?'Beispiel ansehen':'Lösung erklären'}<ArrowRight size={16}/></button>}
      <button className="text-button" disabled={disabled} onClick={()=>onPanel(null)}>Hilfe schließen</button>
    </div>}
  </section>;
}
function CalculationVisual({visual}:{visual:NonNullable<LearningTask['help']['visual']>}) {
  if(visual.kind==='groups')return <div className="dot-groups" role="img" aria-label={`${visual.start} Gruppen mit je ${visual.change} Punkten`}>{Array.from({length:visual.start},(_,i)=><span key={i}>{Array.from({length:visual.change},(_,j)=><i key={j}/>)}</span>)}</div>;
  const end=visual.start+visual.change,min=Math.min(0,visual.start,end),max=Math.max(0,visual.start,end),span=Math.max(1,max-min);
  const x=(n:number)=>20+(n-min)/span*260;
  const marks=[...new Set([min,0,visual.start,end,max])].sort((a,b)=>a-b);
  return <svg className="number-line" viewBox="0 0 300 75" role="img" aria-label={`Zahlenstrahl: ${visual.start} ${visual.change>=0?'+':'−'} ${Math.abs(visual.change)} = ${end}`}><defs><marker id="line-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="currentColor"/></marker></defs><line x1="15" y1="44" x2="285" y2="44"/>{marks.map(n=><g key={n}><line x1={x(n)} y1="39" x2={x(n)} y2="49"/><text x={x(n)} y="69" textAnchor="middle">{n}</text></g>)}<path d={`M${x(visual.start)} 35 Q${(x(visual.start)+x(end))/2} -10 ${x(end)} 35`} markerEnd="url(#line-arrow)"/><circle cx={x(visual.start)} cy="44" r="4"/></svg>;
}
