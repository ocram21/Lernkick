import {ExitButton} from './ExitButton';
import {PracticeSwitch} from './PracticeSwitch';
import {complexesFor,complexChoices,type ComplexSubject} from '../learning/complexes';
import {subjectNames} from '../study/topics';
export function ComplexPanel({subject,selection,busy,onChange,onStart,onExit,active,onResume}:{subject:ComplexSubject;selection?:string[];busy:boolean;onChange:(ids:string[])=>void;onStart:()=>void;onExit:()=>void;active:boolean;onResume:()=>void}){
 const selected=complexChoices(subject,selection);
 return <section className="vocabulary-page complex-page"><ExitButton onClick={onExit}/><div className="vocabulary-options"><h1>{subjectNames[subject]}</h1><p>Wähle deine Lernkomplexe. Du kannst sie auch mischen.</p><div className="vocabulary-choices">{complexesFor(subject).map(c=><div className="vocabulary-choice" key={c.id}><div><h2>{c.title}</h2></div><PracticeSwitch label={c.title} checked={selected.includes(c.id)} disabled={busy} onChange={value=>onChange(value?[...selected,c.id]:selected.filter(id=>id!==c.id))}/></div>)}</div></div><div className="vocabulary-start">{!selected.length&&<p role="status">Wähle mindestens einen Lernkomplex aus.</p>}{active&&<button className="small-button" disabled={busy} onClick={onResume}>Angefangene Runde fortsetzen</button>}<button className="primary" disabled={busy||!selected.length} onClick={onStart}>Üben</button></div></section>;
}
