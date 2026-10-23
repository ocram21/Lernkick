import type {UserData}from'../lib/schema';
import {ExitButton} from './ExitButton';
import {PracticeSwitch}from'./PracticeSwitch';
export function VocabularyPanel({data,onChange,onStart,onExit}:{data:UserData;onChange:(data:UserData)=>Promise<boolean>;onStart:()=>void;onExit:()=>void}){
 const config=data.activities.vocabulary,enabled=Object.values(config.enabled).some(Boolean),active=Boolean(config.session&&config.session.index<config.session.ids.length);
 const choices=[{id:'terms',title:'Begriffe',checked:config.enabled.everyday||config.enabled.work},{id:'sentences',title:'Satzbau',checked:config.enabled.sentences},{id:'grammar',title:'Grammatik',checked:config.enabled.grammar},{id:'spelling',title:'Rechtschreibung',checked:config.enabled.spelling},{id:'proverbs',title:'Sprichwörter',checked:config.enabled.proverbs}] as const;
 return <section className="vocabulary-page"><ExitButton onClick={onExit}/><div className="vocabulary-options"><h1>Wortschatz</h1><p>Wähle deine Bereiche. Du kannst sie auch mischen.</p><div className="vocabulary-choices">{choices.map(option=><div className="vocabulary-choice" key={option.id}><div><h2>{option.title}</h2></div><PracticeSwitch label={option.title} checked={option.checked} onChange={value=>void onChange({...data,activities:{...data.activities,vocabulary:{...config,enabled:{...config.enabled,...(option.id==='terms'?{everyday:value,work:value}:{[option.id]:value})}}}})}/></div>)}</div>

 </div><div className="vocabulary-start">{!enabled&&<p role="status">Wähle mindestens einen Bereich aus.</p>}{config.session&&config.session.index<config.session.ids.length&&<button className="small-button practice-end" onClick={()=>void onChange({...data,activities:{...data.activities,vocabulary:{...config,session:null}}})}>Übung beenden</button>}<button className="primary" disabled={!enabled&&!active} onClick={onStart}>{config.session&&config.session.index<config.session.ids.length?'Runde fortsetzen':'Üben'}</button></div>
 </section>;
}
