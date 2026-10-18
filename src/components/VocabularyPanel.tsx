import type {UserData}from'../lib/schema';
import {PracticeSwitch,DifficultySwitch}from'./PracticeSwitch';
export function VocabularyPanel({data,onChange,onStart}:{data:UserData;onChange:(data:UserData)=>Promise<boolean>;onStart:()=>void}){
 const config=data.activities.vocabulary,enabled=Object.values(config.enabled).some(Boolean);
 return <section className="vocabulary-page"><div className="vocabulary-options"><h1>Wortschatz</h1><p>Wähle deine Bereiche. Du kannst sie auch mischen.</p><div className="vocabulary-choices">{([{id:'everyday',title:'Alltag',detail:'200 Wörter für jeden Tag'},{id:'work',title:'Beruf',detail:'200 Wörter aus der Arbeitswelt'},{id:'sentences',title:'Satzbau',detail:'200 Sätze zum Sortieren'}]as const).map(option=><div className="vocabulary-choice" key={option.id}><div><h2>{option.title}</h2><p>{option.detail}</p></div><PracticeSwitch label={option.title} checked={config.enabled[option.id]} onChange={value=>void onChange({...data,activities:{...data.activities,vocabulary:{...config,enabled:{...config.enabled,[option.id]:value},session:null}}})}/></div>)}</div>
 {config.enabled.sentences&&<><h2 className="sentence-level-title">Satzbau: Schwierigkeit</h2><DifficultySwitch level={config.level} onChange={level=>void onChange({...data,activities:{...data.activities,vocabulary:{...config,level,session:null}}})}/><p className="muted">Normal: kurze Sätze, später einfache Kommas. Für Streber: längere Sätze mit mehreren Kommas.</p></>}
 </div><div className="vocabulary-start">{!enabled&&<p role="status">Wähle mindestens einen Bereich aus.</p>}<button className="primary" disabled={!enabled} onClick={onStart}>{config.session&&config.session.index<config.session.ids.length?'Runde fortsetzen':'Üben'}</button></div>
 </section>;
}
