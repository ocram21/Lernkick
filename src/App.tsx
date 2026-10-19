import {CalculatorKey} from './components/CalculatorKey';
import {BossChallenge} from './components/BossChallenge';
import {activeTime,bossResult,completeTraining,newJourney,strengthAt,type ModuleId} from './learning/journey';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Zap, BookOpen, Settings, WifiOff, Check, X, Download, Upload, RotateCcw, CircleHelp, RefreshCw, Grid3X3 } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { contentPacks, questions } from './content';
import { emptyData, type Card, type Subject, type UserData } from './lib/schema';
import { loadData, readBackup, saveData, backupBeforeImport } from './lib/storage';
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

import {ResetProgressDialog}from'./components/ResetProgressDialog';
import {VocabularyPractice}from'./components/VocabularyPractice';
import {resetLearningProgress}from'./activities/progress';
import { LeaveRoundDialog } from './components/LeaveRoundDialog';
import { CardManager } from './components/CardManager';
import { CardStudy } from './components/CardStudy';
import { VocabularyPanel } from './components/VocabularyPanel';
import { personalCards, cardQueue, rateCard, personalVocabulary, wordQuestion } from './study/cards';
import { compactAnswers } from './study/layout';
import { CountryQuiz } from './components/CountryQuiz';
import { NBackGame } from './components/NBackGame';
import { Hangman, GallowsIcon } from './components/Hangman';
const subjects = [
  { id: 'math', title: 'Mathematik', short: 'MA', label: 'Zahlen? Kriegst du hin.', color: 'var(--calc-orange)' },
  { id: 'german', title: 'Deutsch', short: 'D', label: 'Finde die richtigen Worte.', color: 'var(--calc-ink)' },
  { id: 'social', title: 'Sozialkunde', short: 'SK', label: 'Versteh, was uns verbindet.', color: 'var(--calc-orange)' },
  { id: 'biology', title: 'Biologie', short: 'Bio', label: 'Dem Leben auf der Spur.', color: 'var(--calc-ink)' },
  { id: 'geography', title: 'Geographie', short: 'Geo', label: 'Deine Welt. Dein Wissen.', color: 'var(--calc-ink)' },
] as const;
type View = 'home' | 'cards' | 'settings' | 'help' | 'vocabulary';
type Round = { id:string; kind:'subject'|'vocabulary'; length:number; subject: Subject; mode: 'adaptive' | 'free'; current: LearningTask; options: number[]; used: string[]; signatures: string[]; correctSignatures:string[]; helpLevel: HelpLevel; panel: 'help' | 'pace' | null; milestones: string[]; answer: number | null; correct: number; points: number; done: boolean };
function newQuestion(q: LearningTask) { return { current:q,options:shuffle(q.options.map((_,i)=>i)),answer:null,helpLevel:(q.support?(q.generated?1:2):0) as HelpLevel,panel:(q.support?'help':null) as Round['panel'] }; }
export default function App() {
  const [data, setData] = useState<UserData>(emptyData);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>('home');
  const [studySession,setStudySession]=useState<{id:string;subject:Subject;cards:Card[];done:boolean;returnView:View}|null>(null);
  const [exitTarget,setExitTarget]=useState<View>('home');
  const [resetOpen,setResetOpen]=useState(false);
  const [game,setGame]=useState<'hangman'|'germany'|'vocabulary'|'nback'|null>(null);
  const [gameDone,setGameDone]=useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [exitRequested,setExitRequested]=useState(false);
  const exitTrigger=useRef<HTMLElement|null>(null);
  function requestExit(target:View='home') {
    if(saving)return;
    if(game==='nback'){setGame(null);setView(target);return;}
    if((round&&!round.done)||(studySession&&!studySession.done)||(game&&!gameDone)){exitTrigger.current=document.activeElement as HTMLElement;setExitTarget(target);setExitRequested(true);return;}
    setRound(null);setStudySession(null);setGame(null);setView(target);
  }
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const mode='adaptive' as 'adaptive' | 'free' | 'cards';
  const [edit, setEdit] = useState<Card | null>(null);
  const [install, setInstall] = useState<any>(null);
  const persistence = useRef(Promise.resolve());
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [updating, setUpdating] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { needRefresh: [needRefresh], offlineReady: [offlineReady] } = useRegisterSW({ immediate: true, onNeedReload() {}, onRegisteredSW(_url, registration) { registrationRef.current = registration; if (navigator.onLine) registration?.update().catch(() => {}); }, onRegisterError() { setMessage('Offline-Modus konnte nicht eingerichtet werden. Bitte lade die App online erneut.'); } });
  useEffect(() => { loadData().then(value => { setData(value); setReady(true); }).catch(() => { setStorageError('Dein Gerätespeicher ist nicht verfügbar oder enthält nicht lesbare Daten. Bestehende Daten werden nicht überschrieben. Bitte prüfe die Browser-Einstellungen.'); }); }, []);
  useEffect(() => { const online = () => setOffline(!navigator.onLine); const prompt = (e: Event) => { e.preventDefault(); setInstall(e); }; window.addEventListener('online', online); window.addEventListener('offline', online); window.addEventListener('beforeinstallprompt', prompt); return () => { window.removeEventListener('online', online); window.removeEventListener('offline', online); window.removeEventListener('beforeinstallprompt', prompt); }; }, []);
  useEffect(() => { document.documentElement.dataset.motion = data.settings.reducedMotion ? 'reduced' : 'system'; }, [data.settings.reducedMotion]);
  const dataRef=useRef(data);dataRef.current=data;
  const interaction=useRef(0);
  const activePractice=useRef(false);activePractice.current=Boolean(round&&!round.done||game&&!gameDone);
  function persist(next: UserData) { if(next.journey&&dataRef.current.journey&&Object.keys(next.journey.modules).some(id=>next.journey!.modules[id as ModuleId].level>dataRef.current.journey!.modules[id as ModuleId].level))setMessage('Level geschafft! Du hast das gut geübt. Im nächsten Level festigst du dein Können mit etwas schwierigeren Aufgaben.');dataRef.current=next;setData(next); persistence.current = persistence.current.catch(() => {}).then(() => saveData(next)); return persistence.current.then(() => true, () => { setStorageError('Speichern fehlgeschlagen. Bitte exportiere deine Daten, bevor du die App schließt.'); return false; }); }
  useEffect(()=>{
   function activity(event:Event){if(!event.isTrusted||document.hidden||!activePractice.current)return;const now=Date.now(),gap=now-interaction.current;interaction.current=now;const current=dataRef.current;if(current.journey&&gap>0&&gap<=30000)void persist({...current,journey:activeTime(current.journey,gap,now)});}
   function reset(){interaction.current=0;}
   window.addEventListener('pointerdown',activity);window.addEventListener('keydown',activity);document.addEventListener('visibilitychange',reset);
   return()=>{window.removeEventListener('pointerdown',activity);window.removeEventListener('keydown',activity);document.removeEventListener('visibilitychange',reset);interaction.current=0;};
  },[Boolean(round),game]);
  useEffect(()=>{document.documentElement.dataset.theme='retro-tech';},[data.settings.theme]);
  useEffect(()=>{const back=()=>{if(game==='nback'){setGame(null);setView('home');}};window.addEventListener('popstate',back);return()=>window.removeEventListener('popstate',back);},[game]);
  useEffect(()=>{let timer:ReturnType<typeof setTimeout>;const isText=(target:EventTarget|null)=>target instanceof HTMLTextAreaElement||target instanceof HTMLInputElement&&['text','search','email','number','url','tel','password'].includes(target.type);function focus(event:FocusEvent){if(isText(event.target)){clearTimeout(timer);document.documentElement.dataset.textInput='true';}}function blur(){clearTimeout(timer);timer=setTimeout(()=>{if(!isText(document.activeElement))delete document.documentElement.dataset.textInput;},200);}document.addEventListener('focusin',focus);document.addEventListener('focusout',blur);return()=>{clearTimeout(timer);document.removeEventListener('focusin',focus);document.removeEventListener('focusout',blur);};},[]);
  async function manualUpdate() {
    if (updating || round || studySession || game || edit) return;
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
    setRound({id:crypto.randomUUID(),kind:'subject',length:10,subject,mode,...newQuestion(task),used:[],signatures:[],correctSignatures:[],milestones:[],correct:0,points:0,done:false});setMessage('');window.scrollTo(0,0);
  }
  function startCards(subject:Subject,cards=personalCards(data,subject),returnView:View='home') {
    setStudySession({id:crypto.randomUUID(),subject,cards:cardQueue(data,cards),done:false,returnView});setRound(null);setMessage('');window.scrollTo(0,0);
  }
  function nextWord(used:string[]) {const pool=personalVocabulary(data).map(wordQuestion);const question=nextQuestion(pool,data,used);return question?asTask(question):undefined;}
  function startVocabulary(){setGame('vocabulary');setGameDone(false);setMessage('');window.scrollTo(0,0);}
  async function answer(index:number) {
    if(!round||round.answer!==null||saving)return;
    setSaving(true);const correct=index===round.current.correct;
    const result=round.kind==='vocabulary'?{...recordAnswer(dataRef.current,round.current,correct),newMilestones:[]}:recordLearningAnswer(dataRef.current,round.current,correct,round.helpLevel);
    await persist(result.data);setSaving(false);
    setRound({...round,answer:index,panel:null,correct:round.correct+Number(correct),correctSignatures:correct?[...round.correctSignatures,round.current.signature]:round.correctSignatures,points:round.points+result.points,milestones:[...round.milestones,...result.newMilestones]});
  }
  async function advance() {
    if(!round||round.answer===null||saving||exitRequested)return;
    const used=[...round.used,round.current.id],signatures=[...round.signatures,round.current.signature];
    if(used.length===round.length) {
      const before=dataRef.current;const journey=completeTraining(before.journey??newJourney(before.scores),{id:round.id,module:round.subject,correct:round.correct,total:round.length,tasks:signatures,correctTasks:round.correctSignatures});
      setSaving(true);await persist({...before,scores:{...data.scores,[round.subject]:Math.max(data.scores[round.subject],round.points)},journey});setSaving(false);setRound({...round,points:journey.totalPoints-(before.journey?.totalPoints??0),used,signatures,done:true});
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
  async function importData(file?: File) { if (!file) return; try { if(file.size > 5_000_000) throw new Error(); const next = readBackup(await file.text()); if (window.confirm(next.journey&&data.journey&&next.journey.profileId!==data.journey.profileId?'Die Datei gehört zu einem anderen Profil. Es wird vollständig übernommen, ohne die Lernstände zu vermischen. Dein aktuelles Profil wird vorher gesichert. Jetzt wechseln?':'Die Sicherung übernimmt Lernstände und eigene Karten. Dein aktueller Stand wird vorher automatisch gesichert; erreichte Punkte und Erfolge bleiben erhalten. Jetzt importieren?')) { await persistence.current;await backupBeforeImport();const saved=await persist(prepareImport(data,next)); if(saved)setMessage('Sicherung übernommen. Deine Lernstände sind wieder da.'); } } catch { setMessage('Diese Sicherung ist ungültig oder hat eine nicht unterstützte Version. Bitte wähle eine LernKick-JSON-Datei bis 5 MB.'); } }
  const currentSubject = subjects.find(s => s.id === round?.subject);
  const compactHome = !round && !studySession && !game && view === 'home';
  return <div className={`app-shell ${(round&&!round.done)||(studySession&&!studySession.done)||game?'learning':''} ${compactHome ? 'home-screen':!round&&!studySession&&!game&&view==='settings'?'settings-screen':!round&&!studySession&&!game&&view==='vocabulary'?'vocabulary-screen':''}`}>
    <header className="header"><button className="wordmark" disabled={Boolean(((round&&!round.done)||studySession)&&saving)} onClick={()=>requestExit('home')} aria-label="LernKick Startseite"><Zap size={27} fill="currentColor"/>LERN<span>KICK</span></button><>{!round && !studySession && !game && view === 'home' ? <button className="header-update" disabled={!ready || updating} aria-busy={updating} onClick={manualUpdate}><RefreshCw size={17}/>{updating ? 'Prüfe …' : 'App aktualisieren'}</button> : <div className="header-tools"><span className="local-status">{offline ? <WifiOff size={15}/> : <span className="status-dot"/>}{offline ? 'Du bist offline' : 'Dein Tempo. Dein Gerät.'}</span></div>}</></header>
    {storageError && <div role="alert" className="notice error">{storageError}</div>}
    {message && <div role="status" className="notice">{message}<button aria-label="Hinweis schließen" onClick={() => setMessage('')}><X size={20}/></button></div>}
    {needRefresh && !round && !studySession && !game && !edit && view !== 'home' && <div className="notice">Eine neue Version ist bereit. Deine Lernstände bleiben erhalten.<button className="small-button" disabled={updating} onClick={manualUpdate}>Jetzt aktualisieren</button></div>}
    {!ready ? <main><h1>Gleich geht’s los.</h1><p>{storageError ? 'Der Speicher muss zuerst wieder verfügbar sein.' : 'Deine Lernstände werden geladen …'}</p></main> : game==='nback' ? <NBackGame paused={exitRequested} onExit={()=>requestExit('home')} theme="retro-tech" onActivity={milliseconds=>{const current=dataRef.current;if(current.journey)void persist({...current,journey:activeTime(current.journey,milliseconds)});}} onResult={result=>{const current=dataRef.current;if(current.journey)void persist({...current,journey:completeTraining(current.journey,{...result,module:'nback'})});}} onRunningChange={running=>setGameDone(!running)}/> : game==='germany' ? <CountryQuiz data={data} onChange={persist} onExit={()=>requestExit('home')} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)} paused={exitRequested}/> : game==='vocabulary' ? <VocabularyPractice data={data} onChange={persist} onExit={()=>requestExit('vocabulary')} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)} paused={exitRequested}/> : game ? <Hangman data={data} onChange={persist} onExit={()=>requestExit('home')} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)}/> : studySession ? <CardStudy key={studySession.id} cards={studySession.cards} title={`Karten · ${subjects.find(s=>s.id===studySession.subject)?.title}`} done={studySession.done} onRate={async(id,known)=>{setSaving(true);const saved=await persist(rateCard(data,id,known));setSaving(false);return saved;}} onDone={()=>setStudySession({...studySession,done:true})} onExit={()=>requestExit(studySession.returnView)} onRestart={()=>startCards(studySession.subject)}/> : round ? <main className="round-view" style={{ '--subject': currentSubject?.color } as React.CSSProperties}>
      {round.done ? <section className="result"><div className="result-icon"><Check size={48}/></div><h1>{round.correct/round.length>.6?'Durchlauf bestanden.':'Weiter üben.'}</h1><p>Jede Frage bringt dich weiter. Auch die, die noch nicht sitzt.</p><div className="result-numbers"><span><strong>{round.correct}/{round.length}</strong>richtig beantwortet</span><span><strong>{round.points}</strong>Punkte</span></div><p>Was noch Übung braucht, kommt später wieder dran.</p>{round.correct/round.length<=.6&&<p>Zum Bestehen brauchst du mehr als 60 %. Deine erreichten Punkte bleiben erhalten.</p>}<button className="primary" onClick={()=>round.kind==='vocabulary'?startVocabulary():start(round.subject)}>Noch eine Runde <RotateCcw size={18}/></button><button className="text-button" onClick={() => { setRound(null); setView(round.kind==='vocabulary'?'vocabulary':'home'); }}>{round.kind==='vocabulary'?'Zum Wortschatz':'Zur Fächerauswahl'}</button></section> : <>
      <div className="round-top"><button className="icon-button" aria-label="Runde verlassen" disabled={saving} onClick={()=>requestExit(round.kind==='vocabulary'?'vocabulary':'home')}><ArrowLeft/></button><strong>{round.kind==='vocabulary'?'Wortschatz':currentSubject?.title}</strong><span>Frage {round.used.length+1} von {round.length}</span></div>
      <div className="round-track" aria-label={`Frage ${round.used.length+1} von ${round.length}`}>{Array.from({length:round.length},(_,i) => <span key={i} className={i < round.used.length ? 'filled' : i === round.used.length ? 'current' : ''}/>)}</div>
      <div className="round-scroll" key={round.current.id}><section className="question"><span className="question-topic">{round.kind==='vocabulary'?'Alltagswortschatz':round.subject==='math' ? mathById.get(round.current.skillId)?.title??'Mathe üben' : `${round.mode==='adaptive'?'Lernrunde':'Freies Üben'} · Stufe ${round.current.difficulty}`}</span><h1 key={round.current.id}>{round.current.prompt}</h1></section>
      {round.kind==='subject'&&round.subject==='math'&&<LearningTools task={round.current} helpLevel={round.helpLevel} panel={round.panel} pace={preferenceFor(data,round.subject).pace} alternate={preferenceFor(data,round.subject).explanation==='alternate'} onPanel={panel=>setRound({...round,panel})} onHelp={showHelp} onChoice={chooseLearningWay} disabled={saving}/>}
      <section className={`answers ${round.answer !== null ? 'answered' : ''} ${compactAnswers(round.current.options) ? 'answer-grid' : ''}`} aria-label="Antwortmöglichkeiten">{round.options.map((index, i) => <button key={index} disabled={round.answer !== null || saving} className={`answer ${round.answer !== null && index === round.current.correct ? 'correct' : round.answer === index ? 'incorrect' : ''}`} onClick={() => answer(index)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{round.current.options[index]}</span>{round.answer !== null && index === round.current.correct && <Check/>}{round.answer === index && index !== round.current.correct && <span className="answer-selection">Deine Wahl</span>}</button>)}</section>
      {round.answer !== null && <section className="feedback" aria-live="polite"><h2>{round.answer === round.current.correct ? 'Sitzt. Gut gemacht!' : 'Noch nicht ganz. Schau mal:'}</h2><p>{round.current.explanation}</p></section>}
      </div><div className="round-actions">{round.answer !== null ? <>{round.answer === round.current.correct ? <div className="auto-advance"><span>{autoAdvance ? `Weiter in ${seconds} s` : 'Du bestimmst das Tempo.'}</span><button className="auto-toggle" onClick={() => setAutoAdvance(!autoAdvance)}>{autoAdvance ? 'Anhalten' : 'Automatisch weiter'}</button></div> : <p>Lies die Erklärung. Du bestimmst, wann es weitergeht.</p>}<button className="primary" disabled={saving} onClick={advance}>{round.used.length === round.length-1 ? 'Runde abschließen' : 'Nächste Frage'}<ArrowRight size={20}/></button></> : <p>Wähle eine Antwort.</p>}</div>
      </>}
    </main> : <>
    <main>
      {view === 'home' && <>
        <section id="subjects" className="subjects-section"><div className="section-heading"><h1>Dein Lern-Kick</h1><button className="help-button" onClick={()=>setView('help')}><CircleHelp size={18}/>Hilfe</button></div>
        <div className="home-status"><strong>{(data.journey?.totalPoints??0).toLocaleString('de-DE')} Punkte</strong><label>Lernstärke<progress max={100} value={data.journey?strengthAt(data.journey):0}/></label></div>
        <div className="calculator-grid">{subjects.map(s=><CalculatorKey key={s.id} id={s.id} title={s.title} short={s.short} color={s.color} journey={data.journey??newJourney(data.scores)} disabled={updating} onClick={()=>start(s.id)}/>)}{([{id:'vocabulary',title:'Wortschatz',color:'var(--calc-violet)'},{id:'hangman',title:'Galgenraten',color:'var(--calc-violet)'},{id:'germany',title:'Deutschlandquiz',color:'var(--calc-orange)'},{id:'nback',title:'Dual N-Back',color:'var(--calc-violet)'}] as const).map(item=><CalculatorKey key={item.id} {...item} journey={data.journey??newJourney(data.scores)} disabled={updating} onClick={()=>{if(item.id==='vocabulary'){setView('vocabulary');return;}if(item.id==='nback')history.pushState({game:'nback'},'');setGame(item.id);setGameDone(item.id==='nback');setMessage('');window.scrollTo(0,0);}}/>)}</div></section>

      </>}
      {view === 'help' && <section className="help-page concise-help"><button className="text-button" onClick={()=>setView('home')}><ArrowLeft size={18}/>Zur Fächerauswahl</button><h1>Kurze Hilfe</h1><p>Wähle ein Fach oder Spiel. Punkte, Lernstärke und die einzelnen Level siehst du auf der Startseite.</p><p>Mehr als 60 % richtige Antworten zählen als bestandener Durchlauf. Mehrere bestandene Durchläufe füllen dein Level. Wiederhole dieselben Aufgaben frühestens am nächsten Tag für weitere Punkte.</p><p>„Wortschatz“ enthält auch Berufswörter und Satzbau. „Hilfe“ unterstützt dich in Mathematik.</p><p>„Dual N-Back“ startet das Gedächtnisspiel mit Positionen und gesprochenen Buchstaben. Der Pfeil oben links bringt dich sofort zurück.</p><details className="install-help"><summary>App installieren</summary><p><strong>Android:</strong> Browser-Menü öffnen → „App installieren“ oder „Zum Startbildschirm“.</p><p><strong>iPhone:</strong> In Safari „Teilen“ → „Zum Home-Bildschirm“.</p></details><p className="help-footnote">Sichern und Aktualisieren findest du unter „Einstellungen“ beziehungsweise oben auf der Startseite.</p></section>}
      {view==='cards'&&<CardManager data={data} onChange={persist} edit={edit} setEdit={setEdit}/>}
      {view==='vocabulary'&&<VocabularyPanel data={data} onChange={persist} onStart={startVocabulary}/>}
      {view==='settings'&&<section className="settings-page"><h1>Einstellungen</h1><section className="settings-backup"><h2>Daten sichern</h2><div className="actions"><button className="small-button" onClick={exportData}><Download size={18}/>Sicherung exportieren</button><label className="small-button import-button"><Upload size={18}/>Sicherung importieren<input type="file" accept="application/json,.json" onChange={e=>{void importData(e.target.files?.[0]);e.target.value='';}}/></label></div></section><p className="local-data-help">Deine Lernstände liegen nur auf diesem Gerät. Gelöschte Browserdaten oder ein Gerätewechsel können sie entfernen. Nutze eine Sicherung zum Übertragen; es gibt keine automatische Synchronisierung.</p><section className="settings-reset"><h2>Lernfortschritt</h2><button className="text-button" onClick={()=>setResetOpen(true)}>Lernfortschritt zurücksetzen</button></section><section className="settings-install"><h2>App installieren & offline lernen</h2>{install?<button className="small-button" onClick={async()=>{await install.prompt();setInstall(null);}}>LernKick installieren<Download size={18}/></button>:<><p><strong>Android:</strong> Browser-Menü → „App installieren“.</p><p><strong>iPhone:</strong> Safari → „Teilen“ → „Zum Home-Bildschirm“.</p></>}<p>{offlineReady?'Offline bereit.':'Einmal vollständig online öffnen, danach offline üben.'}</p></section><details className="settings-about"><summary>Über LernKick & Lehrplanquellen</summary><p>500 redaktionelle Fragen, zusätzliche Mathevarianten, 75 Standardkarten, 400 Wörter und 200 Satzbauaufgaben. Selbst erstellte Übungen, keine offiziellen Prüfungsfragen; fachliche Freigabe steht aus.</p><ul className="curriculum-sources">{contentPacks.flatMap(pack=>pack.version===2?pack.sources:[]).map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} (PDF)</a></li>)}</ul><p>Keine Konten oder Analyse-Tracker. Lernstände bleiben auf deinem Gerät. Der Hosting-Anbieter erhält beim Laden Verbindungsdaten. Betreiberangaben und rechtliche Prüfung sind noch zu ergänzen.</p></details></section>}
    </main><nav className="bottom-nav" aria-label="Hauptnavigation">{([{id:'home',label:'Lernen',icon:Zap},{id:'cards',label:'Meine Karten',icon:BookOpen},{id:'settings',label:'Einstellungen',icon:Settings}] as const).map(item=><button key={item.id} disabled={updating} aria-current={view===item.id?'page':undefined} onClick={()=>{setView(item.id);setEdit(null);setMessage('');window.scrollTo(0,0);}}><item.icon size={21}/><span>{item.label}</span></button>)}</nav></>}
    {(()=>{const module:ModuleId|null=round?.done?round.subject:game&&gameDone?game:null;if(!module||!data.journey)return null;const m=data.journey.modules[module],level=m.completed.find(l=>l%5===0&&!m.bossAttempts.includes(l));return level?<BossChallenge key={`${module}:${level}`} module={module} level={level} onResult={won=>{void persist({...data,journey:bossResult(data.journey!,module,level,won)});setMessage(won?'Endgegner geschafft! Fünffache Bonuspunkte sind gespeichert.':'Dein Level bleibt geschafft. Du kannst weiterlernen.');}}/>:null;})()}
    {resetOpen&&<ResetProgressDialog onClose={()=>setResetOpen(false)} onReset={async()=>{await persistence.current;await backupBeforeImport();const saved=await persist(resetLearningProgress(data));if(saved)setMessage('Lernfortschritt zurückgesetzt. Deine Inhalte bleiben erhalten.');return saved;}}/>}
    {exitRequested&&<LeaveRoundDialog description={game==='nback'?'Die laufende N-Back-Runde wird beendet. Die Ergebnisse dieser Spielsitzung gehen beim Verlassen verloren.':game?'Dein Übungsstand bleibt auf diesem Gerät gespeichert.':undefined} returnFocusTo={exitTrigger.current} onStay={()=>setExitRequested(false)} onLeave={()=>{setExitRequested(false);setRound(null);setStudySession(null);setGame(null);setView(exitTarget);window.scrollTo(0,0);}}/>}

  </div>;
}
