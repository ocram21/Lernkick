import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Zap, BookOpen, ChartNoAxesColumnIncreasing, Settings, WifiOff, Check, X, Download, Upload, RotateCcw, CircleHelp, RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { contentPacks, questions } from './content';
import { emptyData, type Card, type Subject, type UserData } from './lib/schema';
import { loadData, readBackup, saveData } from './lib/storage';
import { nextQuestion, recordAnswer, shuffle } from './lib/engine';
import { activateUpdate, findUpdate } from './lib/updates';
import { useAutoAdvance } from './lib/useAutoAdvance';
import { nextMathTask, recordLearningAnswer, preferenceFor } from './learning/adaptive';
import { asTask } from './learning/tasks';
import { mathById } from './learning/mathCompetencies';
import { prepareImport } from './learning/migration';
import { emptyCompetency } from './learning/mastery';
import type { LearningTask, HelpLevel, Pace } from './learning/types';
import { LearningTools } from './components/LearningTools';
import { CompetencyMosaic } from './components/CompetencyMosaic';
import { LeaveRoundDialog } from './components/LeaveRoundDialog';
import { CardManager } from './components/CardManager';
import { CardStudy } from './components/CardStudy';
import { VocabularyPanel } from './components/VocabularyPanel';
import { personalCards, cardQueue, rateCard, personalVocabulary, wordQuestion } from './study/cards';
import { compactAnswers } from './study/layout';
const subjects = [
  { id: 'math', title: 'Mathematik', short: 'MA', label: 'Zahlen? Kriegst du hin.', color: '#d5f463' },
  { id: 'german', title: 'Deutsch', short: 'D', label: 'Finde die richtigen Worte.', color: '#c4b4f5' },
  { id: 'social', title: 'Sozialkunde', short: 'SK', label: 'Versteh, was uns verbindet.', color: '#f5b28d' },
  { id: 'biology', title: 'Biologie', short: 'Bio', label: 'Dem Leben auf der Spur.', color: '#8fd6ad' },
  { id: 'geography', title: 'Geografie', short: 'Geo', label: 'Deine Welt. Dein Wissen.', color: '#91c8e9' },
] as const;
type View = 'home' | 'progress' | 'cards' | 'settings' | 'help' | 'vocabulary';
type Round = { kind:'subject'|'vocabulary'; length:number; subject: Subject; mode: 'adaptive' | 'free'; current: LearningTask; options: number[]; used: string[]; signatures: string[]; helpLevel: HelpLevel; panel: 'help' | 'pace' | null; milestones: string[]; answer: number | null; correct: number; points: number; done: boolean };
function newQuestion(q: LearningTask) { return { current:q,options:shuffle(q.options.map((_,i)=>i)),answer:null,helpLevel:(q.support?(q.generated?1:2):0) as HelpLevel,panel:(q.support?'help':null) as Round['panel'] }; }
export default function App() {
  const [data, setData] = useState<UserData>(emptyData);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>('home');
  const [studySession,setStudySession]=useState<{id:string;subject:Subject;cards:Card[];done:boolean;returnView:View}|null>(null);
  const [exitTarget,setExitTarget]=useState<View>('home');
  const [vocabularyEditing,setVocabularyEditing]=useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [exitRequested,setExitRequested]=useState(false);
  const exitTrigger=useRef<HTMLElement|null>(null);
  function requestExit(target:View='home') {
    if(saving)return;
    if((round&&!round.done)||(studySession&&!studySession.done)){exitTrigger.current=document.activeElement as HTMLElement;setExitTarget(target);setExitRequested(true);return;}
    setRound(null);setStudySession(null);setView(target);
  }
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [mode, setMode] = useState<'adaptive' | 'free' | 'cards'>('adaptive');
  const [edit, setEdit] = useState<Card | null>(null);
  const [install, setInstall] = useState<any>(null);
  const persistence = useRef(Promise.resolve());
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [updating, setUpdating] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const { needRefresh: [needRefresh], offlineReady: [offlineReady] } = useRegisterSW({ immediate: true, onNeedReload() {}, onRegisteredSW(_url, registration) { registrationRef.current = registration; if (navigator.onLine) registration?.update().catch(() => {}); }, onRegisterError() { setMessage('Offline-Modus konnte nicht eingerichtet werden. Bitte lade die App online erneut.'); } });
  useEffect(() => { loadData().then(value => { setData(value); setReady(true); }).catch(() => { setStorageError('Dein Gerätespeicher ist nicht verfügbar oder enthält nicht lesbare Daten. Bestehende Daten werden nicht überschrieben. Bitte prüfe die Browser-Einstellungen.'); }); }, []);
  useEffect(() => { const online = () => setOffline(!navigator.onLine); const prompt = (e: Event) => { e.preventDefault(); setInstall(e); }; window.addEventListener('online', online); window.addEventListener('offline', online); window.addEventListener('beforeinstallprompt', prompt); return () => { window.removeEventListener('online', online); window.removeEventListener('offline', online); window.removeEventListener('beforeinstallprompt', prompt); }; }, []);
  useEffect(() => { document.documentElement.dataset.motion = data.settings.reducedMotion ? 'reduced' : 'system'; }, [data.settings.reducedMotion]);
  function persist(next: UserData) { setData(next); persistence.current = persistence.current.catch(() => {}).then(() => saveData(next)); return persistence.current.then(() => true, () => { setStorageError('Speichern fehlgeschlagen. Bitte exportiere deine Daten, bevor du die App schließt.'); return false; }); }
  async function manualUpdate() {
    if (updating || round || studySession || edit || vocabularyEditing) return;
    if (!navigator.onLine) { setMessage('Zum Aktualisieren brauchst du Internet. Verbinde dich mit WLAN oder mobilen Daten und tippe erneut auf „App aktualisieren“.'); return; }
    setUpdating(true);
    setMessage('Neue Version wird gesucht und bei Bedarf heruntergeladen …');
    try {
      await persistence.current;
      const registration = registrationRef.current || ('serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined);
      if (!registration) { setMessage('Die App wird noch eingerichtet. Bitte versuche es in wenigen Sekunden erneut.'); return; }
      if (await findUpdate(registration)) {
        setMessage('Die neue Version ist bereit und wird geöffnet. Deine Lernstände bleiben erhalten.');
        await activateUpdate(registration);
        window.location.reload();
      } else {
        setMessage('Alles aktuell. Du hast die neueste verfügbare Version.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Aktualisierung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setUpdating(false);
    }
  }
  function selectTask(subject:Subject,roundMode:'adaptive'|'free',used:string[],signatures:string[]) {
    const pool=questions.filter(q=>q.subject===subject);
    if(roundMode==='adaptive'&&subject==='math')return nextMathTask(pool,data,{used,signatures});
    const question=roundMode==='free'?shuffle(pool.filter(q=>!used.includes(q.id)))[0]:nextQuestion(pool,data,used);
    return question?asTask(question):undefined;
  }
  function start(subject:Subject) {
    if(mode==='cards'){startCards(subject);return;}
    const task=selectTask(subject,mode,[],[]);if(!task)return;
    setRound({kind:'subject',length:10,subject,mode,...newQuestion(task),used:[],signatures:[],milestones:[],correct:0,points:0,done:false});setMessage('');window.scrollTo(0,0);
  }
  function startCards(subject:Subject,cards=personalCards(data,subject),returnView:View='home') {
    setStudySession({id:crypto.randomUUID(),subject,cards:cardQueue(data,cards),done:false,returnView});setRound(null);setMessage('');window.scrollTo(0,0);
  }
  function nextWord(used:string[]) {const pool=personalVocabulary(data).map(wordQuestion);const question=nextQuestion(pool,data,used);return question?asTask(question):undefined;}
  function startVocabulary() {
    const task=nextWord([]);if(!task)return;
    setRound({kind:'vocabulary',length:Math.min(10,personalVocabulary(data).length),subject:'german',mode:'adaptive',...newQuestion(task),used:[],signatures:[],milestones:[],correct:0,points:0,done:false});setMessage('');window.scrollTo(0,0);
  }
  async function answer(index:number) {
    if(!round||round.answer!==null||saving)return;
    setSaving(true);const correct=index===round.current.correct;
    const result=round.kind==='vocabulary'?{...recordAnswer(data,round.current,correct),newMilestones:[]}:recordLearningAnswer(data,round.current,correct,round.helpLevel);
    await persist(result.data);setSaving(false);
    setRound({...round,answer:index,panel:null,correct:round.correct+Number(correct),points:round.points+result.points,milestones:[...round.milestones,...result.newMilestones]});
  }
  async function advance() {
    if(!round||round.answer===null||saving||exitRequested)return;
    const used=[...round.used,round.current.id],signatures=[...round.signatures,round.current.signature];
    if(used.length===round.length) {
      setSaving(true);await persist(round.kind==='vocabulary'?data:{...data,scores:{...data.scores,[round.subject]:Math.max(data.scores[round.subject],round.points)}});setSaving(false);setRound({...round,used,signatures,done:true});
    } else {
      const task=round.kind==='vocabulary'?nextWord(used):selectTask(round.subject,round.mode,used,signatures);
      if(task)setRound({...round,...newQuestion(task),used,signatures});
      else setMessage('Für diese Runde gibt es gerade keine neue Aufgabe. Deine Antworten sind gespeichert. Du kannst zur Fächerauswahl zurückkehren.');
    }
  }
  function showHelp(level:HelpLevel) {
    if(!round||saving)return;
    const nextLevel=Math.max(round.helpLevel,level) as HelpLevel;
    setRound({...round,helpLevel:nextLevel,panel:'help'});
    if(nextLevel>round.helpLevel) {
      const skill=data.learning.competencies[round.current.skillId]??emptyCompetency();
      void persist({...data,learning:{...data.learning,competencies:{...data.learning.competencies,[round.current.skillId]:{...skill,helpRequests:skill.helpRequests+1}}}});
    }
  }
  function chooseLearningWay(choice:Pace|'alternate') {
    if(!round||saving)return;
    const preference=preferenceFor(data,round.subject);
    const next=choice==='alternate'?{...preference,explanation:preference.explanation==='plain'?'alternate' as const:'plain' as const}:{...preference,pace:choice};
    const skill=data.learning.competencies[round.current.skillId]??emptyCompetency();
    void persist({...data,learning:{...data.learning,preferences:{...data.learning.preferences,[round.subject]:next},competencies:choice==='alternate'&&round.helpLevel===0?{...data.learning.competencies,[round.current.skillId]:{...skill,helpRequests:skill.helpRequests+1}}:data.learning.competencies}});
    setRound({...round,panel:choice==='alternate'?'help':'pace',helpLevel:choice==='alternate'?Math.max(1,round.helpLevel) as HelpLevel:round.helpLevel});
  }
  const seconds=useAutoAdvance(Boolean(round&&!round.done&&round.answer===round.current.correct&&!round.panel&&!exitRequested&&autoAdvance),round?.current.id,()=>{void advance();});
  function exportData() { const blob = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lernkick-sicherung-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); }
  async function importData(file?: File) { if (!file) return; try { if(file.size > 5_000_000) throw new Error(); const next = readBackup(await file.text()); if (window.confirm('Die Sicherung ersetzt die Lernstände und eigenen Karten auf diesem Gerät. Freigelegte Bildteile bleiben erhalten. Vorher bei Bedarf exportieren. Jetzt importieren?')) { persist(prepareImport(data,next)); setMessage('Sicherung übernommen. Deine Lernstände sind wieder da.'); } } catch { setMessage('Diese Sicherung ist ungültig oder hat eine nicht unterstützte Version. Bitte wähle eine LernKick-JSON-Datei bis 5 MB.'); } }
  const currentSubject = subjects.find(s => s.id === round?.subject);
  const compactHome = !round && !studySession && view === 'home';
  return <div className={`app-shell ${(round&&!round.done)||(studySession&&!studySession.done)?'learning':''} ${compactHome ? 'home-screen' : !round&&!studySession&&view==='progress'?'progress-screen':!round&&!studySession&&view==='settings'?'settings-screen':''}`}>
    <header className="header"><button className="wordmark" disabled={Boolean(((round&&!round.done)||studySession)&&saving)} onClick={()=>requestExit('home')} aria-label="LernKick Startseite"><Zap size={27} fill="currentColor"/>LERN<span>KICK</span></button><>{!round && !studySession && view === 'home' ? <button className="header-update" disabled={!ready || updating} aria-busy={updating} onClick={manualUpdate}><RefreshCw size={17}/>{updating ? 'Prüfe …' : 'App aktualisieren'}</button> : <span className="local-status">{offline ? <WifiOff size={15}/> : <span className="status-dot"/>}{offline ? 'Du bist offline' : 'Dein Tempo. Dein Gerät.'}</span>}</></header>
    {storageError && <div role="alert" className="notice error">{storageError}</div>}
    {message && <div role="status" className="notice">{message}<button aria-label="Hinweis schließen" onClick={() => setMessage('')}><X size={20}/></button></div>}
    {needRefresh && !round && !studySession && !edit && !vocabularyEditing && view !== 'home' && <div className="notice">Eine neue Version ist bereit. Deine Lernstände bleiben erhalten.<button className="small-button" disabled={updating} onClick={manualUpdate}>Jetzt aktualisieren</button></div>}
    {!ready ? <main><h1>Gleich geht’s los.</h1><p>{storageError ? 'Der Speicher muss zuerst wieder verfügbar sein.' : 'Deine Lernstände werden geladen …'}</p></main> : studySession ? <CardStudy key={studySession.id} cards={studySession.cards} title={`Meine Karten · ${subjects.find(s=>s.id===studySession.subject)?.title}`} done={studySession.done} onRate={async(id,known)=>{setSaving(true);const saved=await persist(rateCard(data,id,known));setSaving(false);return saved;}} onDone={()=>setStudySession({...studySession,done:true})} onExit={()=>requestExit(studySession.returnView)} onRestart={()=>startCards(studySession.subject)} onCreate={()=>{setStudySession(null);setView('cards');setEdit({id:crypto.randomUUID(),front:'',back:'',subject:studySession.subject});}}/> : round ? <main className="round-view" style={{ '--subject': currentSubject?.color } as React.CSSProperties}>
      {round.done ? <section className="result"><div className="result-icon"><Check size={48}/></div><h1>Runde geschafft.</h1><p>Jede Frage bringt dich weiter. Auch die, die noch nicht sitzt.</p><div className="result-numbers"><span><strong>{round.correct}/{round.length}</strong>richtig beantwortet</span><span><strong>{round.points}</strong>Punkte</span></div><p>Was noch Übung braucht, kommt später wieder dran.</p>{round.milestones.length>0&&<p className="milestone-message">Ein neuer Lernschritt ist sichtbar. Schau unter „Fortschritt“, wie dein Bild wächst.</p>}<button className="primary" onClick={()=>round.kind==='vocabulary'?startVocabulary():start(round.subject)}>Noch eine Runde <RotateCcw size={18}/></button><button className="text-button" onClick={() => { setRound(null); setView(round.kind==='vocabulary'?'vocabulary':'home'); }}>{round.kind==='vocabulary'?'Zum Wortschatz':'Zur Fächerauswahl'}</button></section> : <>
      <div className="round-top"><button className="icon-button" aria-label="Runde verlassen" disabled={saving} onClick={()=>requestExit(round.kind==='vocabulary'?'vocabulary':'home')}><ArrowLeft/></button><strong>{round.kind==='vocabulary'?'Wortschatz':currentSubject?.title}</strong><span>Frage {round.used.length+1} von {round.length}</span></div>
      <div className="round-track" aria-label={`Frage ${round.used.length+1} von ${round.length}`}>{Array.from({length:round.length},(_,i) => <span key={i} className={i < round.used.length ? 'filled' : i === round.used.length ? 'current' : ''}/>)}</div>
      <div className="round-scroll" key={round.current.id}><section className="question"><span className="question-topic">{round.kind==='vocabulary'?'Alltagswortschatz':round.subject==='math' ? mathById.get(round.current.skillId)?.title??'Mathe üben' : `${round.mode==='adaptive'?'Deine Lernrunde':'Freies Üben'} · Stufe ${round.current.difficulty}`}</span><h1 key={round.current.id}>{round.current.prompt}</h1></section>
      {round.kind==='subject'&&round.subject==='math'&&<LearningTools task={round.current} helpLevel={round.helpLevel} panel={round.panel} pace={preferenceFor(data,round.subject).pace} alternate={preferenceFor(data,round.subject).explanation==='alternate'} onPanel={panel=>setRound({...round,panel})} onHelp={showHelp} onChoice={chooseLearningWay} disabled={saving}/>}
      <section className={`answers ${round.answer !== null ? 'answered' : ''} ${compactAnswers(round.current.options) ? 'answer-grid' : ''}`} aria-label="Antwortmöglichkeiten">{round.options.map((index, i) => <button key={index} disabled={round.answer !== null || saving} className={`answer ${round.answer !== null && index === round.current.correct ? 'correct' : round.answer === index ? 'incorrect' : ''}`} onClick={() => answer(index)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{round.current.options[index]}</span>{round.answer !== null && index === round.current.correct && <Check/>}{round.answer === index && index !== round.current.correct && <span className="answer-selection">Deine Wahl</span>}</button>)}</section>
      {round.answer !== null && <section className="feedback" aria-live="polite"><h2>{round.answer === round.current.correct ? 'Sitzt. Gut gemacht!' : 'Noch nicht ganz. Schau mal:'}</h2><p>{round.current.explanation}</p></section>}
      </div><div className="round-actions">{round.answer !== null ? <>{round.answer === round.current.correct ? <div className="auto-advance"><span>{autoAdvance ? `Weiter in ${seconds} s` : 'Automatik angehalten'}</span><button className="auto-toggle" onClick={() => setAutoAdvance(!autoAdvance)}>{autoAdvance ? 'Anhalten' : 'Automatisch weiter'}</button></div> : <p>Lies die Erklärung. Du bestimmst, wann es weitergeht.</p>}<button className="primary" disabled={saving} onClick={advance}>{round.used.length === round.length-1 ? 'Runde abschließen' : 'Nächste Frage'}<ArrowRight size={20}/></button></> : <p>Wähle eine Antwort.</p>}</div>
      </>}
    </main> : <>
    <main>
      {view === 'home' && <>
        <section id="subjects" className="subjects-section"><div className="section-heading"><h1>Was geht heute?</h1><button className="help-button" onClick={() => setView('help')}><CircleHelp size={18}/>Hilfe</button></div><div className="mode-switch" role="group" aria-label="Lernmodus"><button aria-pressed={mode==='adaptive'} onClick={() => setMode('adaptive')}>Deine Lernrunde</button><button aria-pressed={mode==='free'} onClick={() => setMode('free')}>Freies Üben</button><button aria-pressed={mode==='cards'} onClick={()=>setMode('cards')}>Meine Karten</button></div>
        <div className="subject-tile-grid">{subjects.map(s=>{
          const count=questions.filter(q=>q.subject===s.id).length;
          return <button key={s.id} className="subject-tile" style={{'--subject':s.color} as React.CSSProperties} disabled={updating} aria-label={`${s.title} ${count} Fragen (${s.short})`} title={s.title} onClick={()=>start(s.id)}><span aria-hidden="true">{s.short}</span></button>;
        })}<button className="subject-tile vocabulary-tile" onClick={()=>setView('vocabulary')}><BookOpen size={24}/><span>Wortschatz</span></button></div></section>

      </>}
      {view === 'help' && <section className="help-page concise-help"><button className="text-button" onClick={()=>setView('home')}><ArrowLeft size={18}/>Zur Fächerauswahl</button><h1>Kurze Hilfe</h1><p>Wähle eine Lernform und dann ein Fach.</p><p>Bei Karten: Antwort aufdecken, dann „Gewusst“ oder „Noch üben“ wählen.</p><p>„Wortschatz“ übt Alltagswörter; unter „Meine Karten“ verwaltest du Lernkarten.</p><p>„Hilfe“ unterstützt in Mathe, „Fortschritt“ zeigt dein Bild.</p><details className="install-help"><summary>App installieren</summary><p><strong>Android:</strong> Browser-Menü öffnen → „App installieren“ oder „Zum Startbildschirm“.</p><p><strong>iPhone:</strong> In Safari „Teilen“ → „Zum Home-Bildschirm“.</p></details><p className="help-footnote">Sichern und Aktualisieren findest du unter „Einstellungen“ beziehungsweise oben auf der Startseite.</p></section>}
      {view === 'progress' && <><h1>Fortschritt</h1><CompetencyMosaic data={data}/></>}
      {view==='cards'&&<CardManager data={data} onChange={persist} edit={edit} setEdit={setEdit}/>}
      {view==='vocabulary'&&<VocabularyPanel data={data} onChange={persist} onStart={startVocabulary} onEditing={setVocabularyEditing}/>}
      {view==='settings'&&<section className="settings-page"><h1>Einstellungen</h1><section className="settings-backup"><h2>Daten sichern</h2><div className="actions"><button className="small-button" onClick={exportData}><Download size={18}/>Sicherung exportieren</button><label className="small-button import-button"><Upload size={18}/>Sicherung importieren<input type="file" accept="application/json,.json" onChange={e=>{void importData(e.target.files?.[0]);e.target.value='';}}/></label></div></section><section className="settings-install"><h2>App installieren & offline lernen</h2>{install?<button className="small-button" onClick={async()=>{await install.prompt();setInstall(null);}}>LernKick installieren<Download size={18}/></button>:<><p><strong>Android:</strong> Browser-Menü → „App installieren“.</p><p><strong>iPhone:</strong> Safari → „Teilen“ → „Zum Home-Bildschirm“.</p></>}<p>{offlineReady?'Offline bereit.':'Einmal vollständig online öffnen, danach offline üben.'}</p></section><details className="settings-about"><summary>Über LernKick & Lehrplanquellen</summary><p>500 redaktionelle Fragen, zusätzliche Mathevarianten, 75 Standardkarten und Alltagswortschatz. Selbst erstellte Übungen, keine offiziellen Prüfungsfragen; fachliche Freigabe steht aus.</p><ul className="curriculum-sources">{contentPacks.flatMap(pack=>pack.version===2?pack.sources:[]).map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} (PDF)</a></li>)}</ul><p>Keine Konten oder Analyse-Tracker. Lernstände bleiben auf deinem Gerät. Der Hosting-Anbieter erhält beim Laden Verbindungsdaten. Betreiberangaben und rechtliche Prüfung sind noch zu ergänzen.</p></details></section>}
    </main><nav className="bottom-nav" aria-label="Hauptnavigation">{([{id:'home',label:'Lernen',icon:Zap},{id:'progress',label:'Fortschritt',icon:ChartNoAxesColumnIncreasing},{id:'cards',label:'Meine Karten',icon:BookOpen},{id:'settings',label:'Einstellungen',icon:Settings}] as const).map(item=><button key={item.id} disabled={updating} aria-current={view===item.id?'page':undefined} onClick={()=>{setView(item.id);setEdit(null);setMessage('');window.scrollTo(0,0);}}><item.icon size={21}/><span>{item.label}</span></button>)}</nav></>}
    {exitRequested&&<LeaveRoundDialog returnFocusTo={exitTrigger.current} onStay={()=>setExitRequested(false)} onLeave={()=>{setExitRequested(false);setRound(null);setStudySession(null);setView(exitTarget);window.scrollTo(0,0);}}/>}
    <footer className="footer"><span>LERNKICK</span><span>Ein Schritt zählt.</span></footer>
  </div>;
}
