import {arcadeGames,gameWins} from '../games/arcade';
import type {NBackProgress} from '../learning/nback';
import {roundCount,subjects,type BossSubject} from '../learning/statistics';
import { Bot } from 'lucide-react';
import { type Journey, type ModuleId } from '../learning/journey';
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
    const results=Object.values(journey.statistics.bosses).filter(b=>b.subject===id&&b.status==='finished'),wins=results.filter(b=>b.won).length;
    const m = journey.modules[id],isSubject=subjects.includes(id as BossSubject),charge=journey.statistics.charges[id]??0;
    return <button className={`calculator-key ${short ? 'subject-key' : 'game-key'}`} data-module={id} onClick={onClick} disabled={disabled} aria-label={id==='vocabulary'?'Games':`${title}, Level ${m.level}`}  aria-describedby={isSubject?`rounds-${id}`:id==='vocabulary'?'games-rounds':undefined}>
 {id==='vocabulary'?<><span className="games-key-heading"><span className="key-name">Games</span><svg className="game-star" width="24" height="24" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path fill="currentColor" d="M50 0 61.226 34.549 97.553 34.549 68.164 55.902 79.389 90.451 50 69.098 20.611 90.451 31.836 55.902 2.447 34.549 38.774 34.549Z"/></svg></span><span className="game-counts">{arcadeGames.map(game=><span key={game.id} aria-label={`${game.name}: ${gameWins(journey,game.id)} erfolgreiche Runden`}><span className="game-number" aria-hidden="true">{game.number}</span><span>{gameWins(journey,game.id)}</span></span>)}</span></>:<> <span className="key-name">{short ?? (id === 'germany' ? <>Deutschland<wbr />quiz</> : title)}</span>{id==='nback'&&nback?<><span className="nback-mastery">{[1,2,3].map(n=><span key={n} className={nback.mastered.includes(n)?'mastered':''} aria-label={`N${n} ${nback.mastered.includes(n)?'gemeistert':'noch nicht gemeistert'}`}>N{n}</span>)}</span></>:<span className="key-details"><span className="key-level">{isSubject?roundCount(journey.statistics,id):m.level}</span>{isSubject&&<span className="boss-unit"><small className="boss-record" aria-label={`${wins} Siege, ${results.length-wins} Niederlagen`}>{wins} : {results.length-wins}</small><span className={`boss-badge ${charge===5?'charged':''}`} aria-label={`${charge} von 5 Runden geladen`} title={`${charge} von 5 Runden bis zum Bosskampf`}><Bot size={16}/><small>{charge}</small></span></span>}</span>}</>}
 {id==='vocabulary'&&<span className="sr-only" id="games-rounds">{arcadeGames.map(game=>`${game.name}: ${gameWins(journey,game.id)} erfolgreiche Runden`).join('; ')}</span>}
 {isSubject&&<span className="sr-only" id={`rounds-${id}`}>{roundCount(journey.statistics,id)} abgeschlossene Runden seit Erfassung. {charge} von 5 Runden bis zum Bosskampf geladen.</span>}
 </button>;
}
