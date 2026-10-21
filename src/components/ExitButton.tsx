import {ArrowLeft} from 'lucide-react';
export function ExitButton({onClick}:{onClick:()=>void}){return <button className="exit-button" onClick={onClick}><ArrowLeft size={18}/>Ausgang</button>;}
