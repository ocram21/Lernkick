import type {NBackProgress} from '../learning/nback';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import type { TrainingResult } from '../learning/journey';
export function NBackGame({ paused, theme, onExit, onRunningChange, onResult, onActivity,progress,onLevelChange }: {
    progress:NBackProgress;
    onLevelChange:(level:number)=>void;
    paused: boolean;
    theme: string;
    onExit: () => void;
    onRunningChange: (running: boolean) => void;
    onResult: (result: Omit<TrainingResult, 'module'>&{level:number;errors:number}) => void;
    onActivity: (milliseconds: number) => void;
}) {
    const frame = useRef<HTMLIFrameElement>(null), callbacks = useRef({ onRunningChange, onResult, onActivity,onLevelChange });
    callbacks.current = { onRunningChange, onResult, onActivity,onLevelChange };
    const [loaded, setLoaded] = useState(false), [attempt, setAttempt] = useState(0);
    function configure() { frame.current?.contentWindow?.postMessage({type:'lernkick:nback-progress',current:progress.current},location.origin); frame.current?.contentWindow?.postMessage({ type: 'lernkick:nback-pause', paused }, location.origin); frame.current?.contentWindow?.postMessage({ type: 'lernkick:theme', theme, palette: Object.fromEntries([['--page', '--ground'], ['--surface', '--panel'], ['--ink', '--ink'], ['--muted', '--muted'], ['--accent', '--accent'], ['--line', '--line'], ['--cell', '--ground'], ['--stimulus', '--accent'],['--calc-housing','--calc-housing'],['--calc-display','--calc-display'],['--calc-number','--calc-number'],['--calc-petrol','--calc-petrol'],['--calc-teal','--calc-teal'],['--calc-red','--calc-red'],['--calc-orange','--calc-orange'],['--calc-violet','--calc-violet'],['--calc-ink','--calc-ink']].map(([key, source]) => [key, getComputedStyle(document.documentElement).getPropertyValue(source)])) }, location.origin); }
    useEffect(() => { configure(); }, [paused, loaded, theme,progress.current]);
    useEffect(() => {
        const receive = (event: MessageEvent) => {
            if (event.origin !== location.origin || event.source !== frame.current?.contentWindow)
                return;
            const value = event.data;
            if (value?.type === 'lernkick:nback-state' && typeof value.running === 'boolean')
                callbacks.current.onRunningChange(value.running);
            if(value?.type==='lernkick:nback-state'&&Number.isInteger(value.level)&&value.level>=1&&value.level<=4)callbacks.current.onLevelChange(value.level);
            if (value?.type === 'lernkick:activity' && Number.isFinite(value.milliseconds))
                callbacks.current.onActivity(value.milliseconds);
            if (value?.type === 'lernkick:nback-result' && typeof value.id === 'string' && Number.isInteger(value.level)&&value.level>=1&&value.level<=4 && Number.isInteger(value.errors) && value.errors >= 0 && value.errors <= 48 && Number.isInteger(value.responses) && value.responses >= 4 && [value.hits, value.missed, value.falseAlarms].every(n => Number.isInteger(n) && n >= 0 && n <= 48)) {
                const targets = value.hits + value.missed, nonTargets = 48 - targets;
                if (targets > 0 && nonTargets > 0 && value.missed + value.falseAlarms === value.errors && value.falseAlarms <= nonTargets)
                    callbacks.current.onResult({ level:value.level,errors:value.errors,id: value.id, correct: 48 - value.errors, total: 48, successRatio: (value.hits / targets + (nonTargets - value.falseAlarms) / nonTargets) / 2, tasks: [value.id] });
            }
        };
        window.addEventListener('message', receive);
        return () => window.removeEventListener('message', receive);
    }, []);
    return <main className="nback-view"><div className="nback-toolbar"><button className="icon-button nback-back" aria-label="Ausgang" onClick={onExit}><ArrowLeft size={30}/>Ausgang</button><strong>Dual N-Back</strong></div>{!loaded && <p className="nback-loading" role="status">Spiel wird geladen … <button className="text-button" onClick={() => setAttempt(n => n + 1)}><RefreshCw size={16}/>Erneut laden</button></p>}<iframe key={attempt} ref={frame} src={`${import.meta.env.BASE_URL}games/dual-n-back/index.html`} title="Dual N-Back Training" className="nback-frame" onLoad={() => { setLoaded(true); configure(); }} allow="autoplay"/></main>;
}
