import type {NBackProgress} from '../learning/nback';
import { Bot } from 'lucide-react';
import { moduleRules, type Journey, type ModuleId } from '../learning/journey';
export function CalculatorKey({ id, title, short, journey, onClick, disabled, nback }: {
    id: ModuleId;
    title: string;
    short?: string;
    color: string;
    journey: Journey;
    onClick: () => void;
    disabled?: boolean;
    nback?:NBackProgress;
}) {
    const m = journey.modules[id];
    return <button className={`calculator-key ${short ? 'subject-key' : 'game-key'}`} data-module={id} onClick={onClick} disabled={disabled} aria-label={`${title}, Level ${m.level}`}>
 <span className="key-name">{short ?? (id === 'germany' ? <>Deutschland<wbr />quiz</> : title)}</span>{id==='nback'&&nback?<><span className="nback-mastery">{[1,2,3].map(n=><span key={n} className={nback.mastered.includes(n)?'mastered':''} aria-label={`N${n} ${nback.mastered.includes(n)?'gemeistert':'noch nicht gemeistert'}`}>N{n}</span>)}</span></>:<span className="key-details"><span className="key-level">{m.level}</span><span className={`boss-badge ${m.bossWins.length ? 'won' : ''}`} title={`${m.bossWins.length} Endgegner besiegt`}><Bot size={16}/>{m.bossWins.length > 1 && <small>×{m.bossWins.length}</small>}</span></span>}
 <progress max={moduleRules[id].passes} value={m.progress} aria-label={`${title}: Fortschritt im aktuellen Level`}/>
 </button>;
}
