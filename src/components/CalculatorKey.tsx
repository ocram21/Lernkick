import type {NBackProgress} from '../learning/nback';
import {roundCount,subjects,type BossSubject} from '../learning/statistics';
import { Bot } from 'lucide-react';
import { moduleRules, type Journey, type ModuleId } from '../learning/journey';
export function CalculatorKey({ id, title, short, journey, onClick, disabled, nback,puzzleLevel }: {
    id: ModuleId;
    title: string;
    short?: string;
    color: string;
    journey: Journey;
    onClick: () => void;
    disabled?: boolean;
    nback?:NBackProgress;puzzleLevel?:1|2;
}) {
    const results=Object.values(journey.statistics.bosses).filter(b=>b.subject===id&&b.status==='finished'),wins=results.filter(b=>b.won).length;
    const m = journey.modules[id],isSubject=subjects.includes(id as BossSubject),charge=journey.statistics.charges[id]??0;
    return <button className={`calculator-key ${short ? 'subject-key' : 'game-key'}`} data-module={id} onClick={onClick} disabled={disabled} aria-label={`${title}, Level ${id==='vocabulary'?puzzleLevel??1:m.level}`} aria-describedby={isSubject?`rounds-${id}`:undefined}>
 <span className="key-name">{short ?? (id === 'germany' ? <>Deutschland<wbr />quiz</> : title)}</span>{id==='nback'&&nback?<><span className="nback-mastery">{[1,2,3].map(n=><span key={n} className={nback.mastered.includes(n)?'mastered':''} aria-label={`N${n} ${nback.mastered.includes(n)?'gemeistert':'noch nicht gemeistert'}`}>N{n}</span>)}</span></>:<span className="key-details"><span className="key-level">{isSubject?roundCount(journey.statistics,id):id==='vocabulary'?puzzleLevel??1:m.level}</span>{isSubject&&<span className="boss-unit"><small className="boss-record" aria-label={`${wins} Siege, ${results.length-wins} Niederlagen`}>{wins} : {results.length-wins}</small><span className={`boss-badge ${charge===5?'charged':''}`} aria-label={`${charge} von 5 Runden geladen`} title={`${charge} von 5 Runden bis zum Bosskampf`}><Bot size={16}/><small>{charge}</small></span></span>}</span>}
 {isSubject&&<span className="sr-only" id={`rounds-${id}`}>{roundCount(journey.statistics,id)} abgeschlossene Runden seit Erfassung. {charge} von 5 Runden bis zum Bosskampf geladen.</span>}
 {id!=='vocabulary'&&<progress max={moduleRules[id].passes} value={m.progress} aria-label={`${title}: Fortschritt im aktuellen Level`}/>}
 </button>;
}
