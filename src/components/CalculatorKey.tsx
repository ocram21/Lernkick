import { Bot } from 'lucide-react';
import { moduleRules, type Journey, type ModuleId } from '../learning/journey';
export function CalculatorKey({ id, title, short, journey, onClick, disabled }: {
    id: ModuleId;
    title: string;
    short?: string;
    color: string;
    journey: Journey;
    onClick: () => void;
    disabled?: boolean;
}) {
    const m = journey.modules[id];
    return <button className={`calculator-key ${short ? 'subject-key' : 'game-key'}`} data-module={id} onClick={onClick} disabled={disabled} aria-label={`${title}, Level ${m.level}`}>
 <span className="key-name">{short ?? (id === 'germany' ? <>Deutschland<wbr />quiz</> : title)}</span><span className="key-details"><span className="key-level">{m.level}</span><span className={`boss-badge ${m.bossWins.length ? 'won' : ''}`} title={`${m.bossWins.length} Endgegner besiegt`}><Bot size={16}/>{m.bossWins.length > 1 && <small>×{m.bossWins.length}</small>}</span></span>
 <progress max={moduleRules[id].passes} value={m.progress} aria-label={`${title}: Fortschritt im aktuellen Level`}/>
 </button>;
}
