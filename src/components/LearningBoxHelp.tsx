import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import {boxHelpTitle,boxHelpParagraphs} from '../study/boxHelp';
export function LearningBoxHelp({onClose}:{onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const opener=document.activeElement as HTMLElement,node=ref.current!;node.showModal();return()=>{node.close();opener?.focus();};},[]);
 return <dialog ref={ref} className="box-help-dialog" aria-labelledby="box-help-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}><div className="box-help-heading"><h2 id="box-help-title">{boxHelpTitle}</h2><button className="box-help-close" aria-label="Lernkasten-Hilfe schließen" onClick={onClose} autoFocus><X size={22}/></button></div><div className="box-help-text">{boxHelpParagraphs.map(text=><p key={text}>{text}</p>)}</div></dialog>;
}
