import {ExitButton} from './ExitButton';
import type {NBackProgress} from '../learning/nback';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import type { TrainingResult } from '../learning/journey';
export function NBackGame({ compact,paused, theme, onExit, onRunningChange, onResult, onActivity,onCompleted,onAbort,progress,onLevelChange }: {
    compact:boolean;progress:NBackProgress;
    onLevelChange:(level:number)=>void;
    paused: boolean;
    theme: string;
    onExit: () => void;
    onRunningChange: (running: boolean) => void;
    onResult: (result: Omit<TrainingResult, 'module'>&{level:number;errors:number}) => void;
    onActivity: (milliseconds: number,id?:string) => void;
    onCompleted:(id:string)=>void;
    onAbort:(id:string)=>void;
}) {
    const frame = useRef<HTMLIFrameElement>(null), callbacks = useRef({ onRunningChange, onResult, onActivity,onCompleted,onAbort,onLevelChange });
    callbacks.current = { onRunningChange, onResult, onActivity,onCompleted,onAbort,onLevelChange };
    const [running,setRunning]=useState(false);
    const [loaded, setLoaded] = useState(false), [attempt, setAttempt] = useState(0);
    function configure() { frame.current?.contentWindow?.postMessage({type:'lernkick:nback-progress',current:progress.current,mastered:progress.mastered},location.origin); frame.current?.contentWindow?.postMessage({ type: 'lernkick:nback-pause', paused }, location.origin); frame.current?.contentWindow?.postMessage({ type: 'lernkick:theme', theme,compact, palette: Object.fromEntries([['--action-main','--action-main'],['--action-main-ink','--action-main-ink'],['--action-selection','--action-selection'],['--action-selection-ink','--action-selection-ink'],['--action-neutral','--action-neutral'],['--action-neutral-ink','--action-neutral-ink'],['--page', '--ground'], ['--surface', '--panel'], ['--ink', '--ink'], ['--muted', '--muted'], ['--accent', '--accent'], ['--line', '--line'], ['--cell', '--ground'], ['--stimulus', '--accent'],['--calc-housing','--calc-housing'],['--calc-display','--calc-display'],['--calc-number','--calc-number'],['--calc-petrol','--calc-petrol'],['--calc-teal','--calc-teal'],['--calc-red','--calc-red'],['--calc-orange','--calc-orange'],['--calc-violet','--calc-violet'],['--calc-ink','--calc-ink']].map(([key, source]) => [key, getComputedStyle(document.documentElement).getPropertyValue(source)])) }, location.origin); }
    useEffect(() => { configure(); }, [paused, loaded, theme,compact,progress.current]);
    useEffect(() => {
        const receive = (event: MessageEvent) => {
            if (event.origin !== location.origin || event.source !== frame.current?.contentWindow)
                return;
            const value = event.data;
            if (value?.type === 'lernkick:nback-state' && typeof value.running === 'boolean')
                {setRunning(value.running);callbacks.current.onRunningChange(value.running);}
            if(value?.type==='lernkick:nback-state'&&Number.isInteger(value.level)&&value.level>=1&&value.level<=4)callbacks.current.onLevelChange(value.level);
            if (value?.type === 'lernkick:activity' && Number.isFinite(value.milliseconds))
                callbacks.current.onActivity(value.milliseconds,typeof value.id==='string'?value.id:undefined);
            if(value?.type==='lernkick:nback-abort'&&typeof value.id==='string')callbacks.current.onAbort(value.id);
            if (value?.type === 'lernkick:nback-result' && typeof value.id === 'string' && Number.isInteger(value.level)&&value.level>=1&&value.level<=4 && Number.isInteger(value.errors) && value.errors >= 0 && value.errors <= 48 && Number.isInteger(value.responses) && value.responses >= 0 && [value.hits, value.missed, value.falseAlarms].every(n => Number.isInteger(n) && n >= 0 && n <= 48)) {
                const targets = value.hits + value.missed, nonTargets = 48 - targets;
                if (targets > 0 && nonTargets > 0 && value.missed + value.falseAlarms === value.errors && value.falseAlarms <= nonTargets) {
                    callbacks.current.onCompleted(value.id);
                    if(value.responses>=4)callbacks.current.onResult({ level:value.level,errors:value.errors,id: value.id, correct: 48 - value.errors, total: 48, successRatio: (value.hits / targets + (nonTargets - value.falseAlarms) / nonTargets) / 2, tasks: [value.id] });
                }
            }
        };
        window.addEventListener('message', receive);
        return () => window.removeEventListener('message', receive);
    }, []);
    return <main className="nback-view"><div className="nback-toolbar"><ExitButton onClick={onExit}/>{running&&<button className="small-button practice-end" onClick={()=>{(frame.current?.contentWindow as (Window&{lernkickEndRound?:()=>void})|null)?.lernkickEndRound?.();setRunning(false);onRunningChange(false);setLoaded(false);setAttempt(n=>n+1);}}>Übung beenden</button>}</div>{!loaded && <p className="nback-loading" role="status">Spiel wird geladen … <button className="text-button" onClick={() => setAttempt(n => n + 1)}><RefreshCw size={16}/>Erneut laden</button></p>}<iframe key={attempt} ref={frame} src={`${import.meta.env.BASE_URL}games/dual-n-back/index.html`} title="Dual N-Back Training" className="nback-frame" onLoad={() => { setLoaded(true); configure(); }} allow="autoplay"/></main>;
}
