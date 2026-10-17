import { useEffect, useRef } from 'react';
export function LeaveRoundDialog({onStay,onLeave,returnFocusTo,description='Deine beantworteten Aufgaben bleiben gespeichert. Diese Runde wird beendet.'}:{description?:string;returnFocusTo:HTMLElement|null;onStay:()=>void;onLeave:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current!;dialog.showModal();return()=>{dialog.close();if(returnFocusTo?.isConnected)returnFocusTo.focus();};},[returnFocusTo]);
  return <dialog ref={ref} className="leave-round-dialog" aria-labelledby="leave-round-title" aria-describedby="leave-round-description" onCancel={event=>{event.preventDefault();onStay();}}>
    <h2 id="leave-round-title">Runde verlassen?</h2><p id="leave-round-description">{description}</p>
    <div className="leave-round-actions"><button className="primary" autoFocus onClick={onStay}>Weiterlernen</button><button className="text-button" onClick={onLeave}>Runde verlassen</button></div>
  </dialog>;
}
