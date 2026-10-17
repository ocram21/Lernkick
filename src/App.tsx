import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Zap, BookOpen, ChartNoAxesColumnIncreasing, Settings, WifiOff, Check, X, Plus, Download, Upload, Trash2, Pencil, RotateCcw, CircleHelp, RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { contentPacks, questions } from './content';
import { emptyData, cardSchema, type Card, type Subject, type UserData } from './lib/schema';
import { loadData, readBackup, saveData } from './lib/storage';
import { nextQuestion, shuffle } from './lib/engine';
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
const subjects = [
  { id: 'math', title: 'Mathematik', short: 'MA', label: 'Zahlen? Kriegst du hin.', color: '#d5f463' },
  { id: 'german', title: 'Deutsch', short: 'D', label: 'Finde die richtigen Worte.', color: '#c4b4f5' },
  { id: 'social', title: 'Sozialkunde', short: 'SK', label: 'Versteh, was uns verbindet.', color: '#f5b28d' },
  { id: 'biology', title: 'Biologie', short: 'Bio', label: 'Dem Leben auf der Spur.', color: '#8fd6ad' },
  { id: 'geography', title: 'Geografie', short: 'Geo', label: 'Deine Welt. Dein Wissen.', color: '#91c8e9' },
] as const;
type View = 'home' | 'progress' | 'cards' | 'settings' | 'help';
type Round = { subject: Subject; mode: 'adaptive' | 'free'; current: LearningTask; options: number[]; used: string[]; signatures: string[]; helpLevel: HelpLevel; panel: 'help' | 'pace' | null; milestones: string[]; answer: number | null; correct: number; points: number; done: boolean };
function newQuestion(q: LearningTask) { return { current:q,options:shuffle(q.options.map((_,i)=>i)),answer:null,helpLevel:(q.support?(q.generated?1:2):0) as HelpLevel,panel:(q.support?'help':null) as Round['panel'] }; }
export default function App() {
  const [data, setData] = useState<UserData>(emptyData);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>('home');
  const [round, setRound] = useState<Round | null>(null);
  const [exitRequested,setExitRequested]=useState(false);
  const exitTrigger=useRef<HTMLElement|null>(null);
  function requestExit() {
    if(saving)return;
    if(round&&!round.done){exitTrigger.current=document.activeElement as HTMLElement;setExitRequested(true);return;}
    setRound(null);setView('home');
  }
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const [mode, setMode] = useState<'adaptive' | 'free'>('adaptive');
  const [edit, setEdit] = useState<Card | null>(null);
  const [review, setReview] = useState<Card | null>(null);
  const [flipped, setFlipped] = useState(false);
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
    if (updating || round || edit) return;
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
    const task=selectTask(subject,mode,[],[]);if(!task)return;
    setRound({subject,mode,...newQuestion(task),used:[],signatures:[],milestones:[],correct:0,points:0,done:false});setMessage('');window.scrollTo(0,0);
  }
  async function answer(index:number) {
    if(!round||round.answer!==null||saving)return;
    setSaving(true);const correct=index===round.current.correct;
    const result=recordLearningAnswer(data,round.current,correct,round.helpLevel);
    await persist(result.data);setSaving(false);
    setRound({...round,answer:index,panel:null,correct:round.correct+Number(correct),points:round.points+result.points,milestones:[...round.milestones,...result.newMilestones]});
  }
  async function advance() {
    if(!round||round.answer===null||saving||exitRequested)return;
    const used=[...round.used,round.current.id],signatures=[...round.signatures,round.current.signature];
    if(used.length===10) {
      setSaving(true);await persist({...data,scores:{...data.scores,[round.subject]:Math.max(data.scores[round.subject],round.points)}});setSaving(false);setRound({...round,used,signatures,done:true});
    } else {
      const task=selectTask(round.subject,round.mode,used,signatures);
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
  const totalAttempts = Object.values(data.progress).reduce((n,p) => n+p.attempts,0);
  const due = Object.values(data.progress).filter(p => p.due <= Date.now()).length;
  const currentSubject = subjects.find(s => s.id === round?.subject);
  const compactHome = !round && view === 'home';
  return <div className={`app-shell ${round && !round.done ? 'learning' : ''} ${compactHome ? 'home-screen' : ''}`}>
    <header className="header"><button className="wordmark" disabled={Boolean(round&&!round.done&&saving)} onClick={requestExit} aria-label="LernKick Startseite"><Zap size={27} fill="currentColor"/>LERN<span>KICK</span></button><>{!round && view === 'home' ? <button className="header-update" disabled={!ready || updating} aria-busy={updating} onClick={manualUpdate}><RefreshCw size={17}/>{updating ? 'Prüfe …' : 'App aktualisieren'}</button> : <span className="local-status">{offline ? <WifiOff size={15}/> : <span className="status-dot"/>}{offline ? 'Du bist offline' : 'Dein Tempo. Dein Gerät.'}</span>}</></header>
    {storageError && <div role="alert" className="notice error">{storageError}</div>}
    {message && <div role="status" className="notice">{message}<button aria-label="Hinweis schließen" onClick={() => setMessage('')}><X size={20}/></button></div>}
    {needRefresh && !round && !edit && view !== 'home' && <div className="notice">Eine neue Version ist bereit. Deine Lernstände bleiben erhalten.<button className="small-button" disabled={updating} onClick={manualUpdate}>Jetzt aktualisieren</button></div>}
    {!ready ? <main><h1>Gleich geht’s los.</h1><p>{storageError ? 'Der Speicher muss zuerst wieder verfügbar sein.' : 'Deine Lernstände werden geladen …'}</p></main> : round ? <main className="round-view" style={{ '--subject': currentSubject?.color } as React.CSSProperties}>
      {round.done ? <section className="result"><div className="result-icon"><Check size={48}/></div><h1>Runde geschafft.</h1><p>Jede Frage bringt dich weiter. Auch die, die noch nicht sitzt.</p><div className="result-numbers"><span><strong>{round.correct}/10</strong>richtig beantwortet</span><span><strong>{round.points}</strong>Punkte</span></div><p>Was noch Übung braucht, kommt später wieder dran.</p>{round.milestones.length>0&&<p className="milestone-message">Ein neuer Lernschritt ist sichtbar. Schau dir dein Wimmelbild unter „Fortschritt“ an.</p>}<button className="primary" onClick={() => start(round.subject)}>Noch eine Runde <RotateCcw size={18}/></button><button className="text-button" onClick={() => { setRound(null); setView('home'); }}>Zur Fächerauswahl</button></section> : <>
      <div className="round-top"><button className="icon-button" aria-label="Runde verlassen" disabled={saving} onClick={requestExit}><ArrowLeft/></button><strong>{currentSubject?.title}</strong><span>Frage {round.used.length+1} von 10</span></div>
      <div className="round-track" aria-label={`Frage ${round.used.length+1} von 10`}>{Array.from({length:10},(_,i) => <span key={i} className={i < round.used.length ? 'filled' : i === round.used.length ? 'current' : ''}/>)}</div>
      <div className="round-scroll" key={round.current.id}><section className="question"><span className="question-topic">{round.subject==='math' ? mathById.get(round.current.skillId)?.title??'Mathe üben' : `${round.mode==='adaptive'?'Deine Lernrunde':'Freies Üben'} · Stufe ${round.current.difficulty}`}</span><h1 key={round.current.id}>{round.current.prompt}</h1></section>
      {round.subject==='math'&&<LearningTools task={round.current} helpLevel={round.helpLevel} panel={round.panel} pace={preferenceFor(data,round.subject).pace} alternate={preferenceFor(data,round.subject).explanation==='alternate'} onPanel={panel=>setRound({...round,panel})} onHelp={showHelp} onChoice={chooseLearningWay} disabled={saving}/>}
      <section className={`answers ${round.answer !== null ? 'answered' : ''} ${round.current.options.every(o => o.length < 28) && round.current.options.length === 4 ? 'answer-grid' : ''}`} aria-label="Antwortmöglichkeiten">{round.options.map((index, i) => <button key={index} disabled={round.answer !== null || saving} className={`answer ${round.answer !== null && index === round.current.correct ? 'correct' : round.answer === index ? 'incorrect' : ''}`} onClick={() => answer(index)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{round.current.options[index]}</span>{round.answer !== null && index === round.current.correct && <Check/>}{round.answer === index && index !== round.current.correct && <span className="answer-selection">Deine Wahl</span>}</button>)}</section>
      {round.answer !== null && <section className="feedback" aria-live="polite"><h2>{round.answer === round.current.correct ? 'Sitzt. Gut gemacht!' : 'Noch nicht ganz. Schau mal:'}</h2><p>{round.current.explanation}</p></section>}
      </div><div className="round-actions">{round.answer !== null ? <>{round.answer === round.current.correct ? <div className="auto-advance"><span>{autoAdvance ? `Weiter in ${seconds} s` : 'Automatik angehalten'}</span><button className="auto-toggle" onClick={() => setAutoAdvance(!autoAdvance)}>{autoAdvance ? 'Anhalten' : 'Automatisch weiter'}</button></div> : <p>Lies die Erklärung. Du bestimmst, wann es weitergeht.</p>}<button className="primary" disabled={saving} onClick={advance}>{round.used.length === 9 ? 'Runde abschließen' : 'Nächste Frage'}<ArrowRight size={20}/></button></> : <p>Wähle eine Antwort.</p>}</div>
      </>}
    </main> : <>
    <main>
      {view === 'home' && <>
        <section id="subjects" className="subjects-section"><div className="section-heading"><h1>Was geht heute?</h1><button className="help-button" onClick={() => setView('help')}><CircleHelp size={18}/>Hilfe</button></div><div className="mode-switch" role="group" aria-label="Lernmodus"><button aria-pressed={mode==='adaptive'} onClick={() => setMode('adaptive')}>Deine Lernrunde</button><button aria-pressed={mode==='free'} onClick={() => setMode('free')}>Freies Üben</button></div>
        <div className="subject-tile-grid">{subjects.map(s=>{
          const count=questions.filter(q=>q.subject===s.id).length;
          return <button key={s.id} className="subject-tile" style={{'--subject':s.color} as React.CSSProperties} disabled={updating} aria-label={`${s.title} ${count} Fragen (${s.short})`} title={s.title} onClick={()=>start(s.id)}><span aria-hidden="true">{s.short}</span></button>;
        })}</div></section>

      </>}
      {view === 'help' && <section className="help-page"><button className="text-button" onClick={()=>setView('home')}><ArrowLeft size={18}/>Zur Fächerauswahl</button><h1>So geht LernKick.</h1>
        <p>Mit LernKick übst du für deinen Schulabschluss. Du lernst in kleinen Schritten und in deinem Tempo.</p>
        <h2>Loslegen</h2><p>Wähle ein Fach: MA für Mathe, D für Deutsch, SK für Sozialkunde, Bio für Biologie und Geo für Geografie. „Deine Lernrunde“ sucht passende Aufgaben aus. „Freies Üben“ mischt die Fragen. Eine Runde hat zehn Aufgaben.</p>
        <h2>Antworten und Hilfe</h2><p>Tippe auf eine Antwort. Danach siehst du die Lösung und eine Erklärung. Bei einem Fehler entscheidest du selbst, wann du weitergehst. Mit „Anhalten“ kannst du jede Erklärung länger lesen.</p><p>In Mathe öffnet „Hilfe“ einen Hinweis, dann ein Beispiel und bei Bedarf die Lösung. Hilfe zu nutzen ist okay.</p>
        <h2>Deinen Lernweg wählen</h2><p>Tippe in Mathe auf „Lernweg“. Wähle „Mach’s leichter“, „Passt genau“, „Mehr Herausforderung“ oder „Erklär’s anders“. Du kannst deine Wahl jederzeit ändern.</p>
        <h2>Deinen Fortschritt sehen</h2><p>Unter „Fortschritt“ findest du dein Wimmelbild. Beim Üben kommen Bildteile dazu. Was du freigelegt hast, bleibt. Unter „Meine Karten“ kannst du eigene Fragen anlegen.</p>
        <h2>Aktualisieren und sichern</h2><p>Mit „App aktualisieren“ oben auf der Startseite holst du neue Inhalte. Dafür brauchst du Internet. Danach kannst du auch offline üben.</p><p>Unter „Einstellungen“ sicherst du deinen Stand mit „Sicherung exportieren“. „Sicherung importieren“ holt eine gespeicherte Sicherung zurück.</p>
        <button className="primary" onClick={()=>{setView('home');window.scrollTo(0,0);}}>Zurück zum Lernen<ArrowRight size={18}/></button>
      </section>}
      {view === 'progress' && <><h1>Dein Fortschritt.</h1><p>Hier siehst du, was du schon geübt hast. Vergleiche dich mit deinem eigenen Anfang.</p><div className="progress-summary"><span><strong>{totalAttempts}</strong>Antworten</span><span><strong>{due}</strong>zur Wiederholung fällig</span><span><strong>{Object.keys(data.learning.unlocks).length}</strong>Lernschritte sichtbar</span></div><CompetencyMosaic data={data}/><h2>Deine Bestleistungen</h2><p className="muted">Deine höchste Punktzahl einer abgeschlossenen Zehn-Fragen-Runde.</p><div className="score-list">{subjects.map(s=><div key={s.id}><span>{s.title}</span><strong>{data.scores[s.id]} <small>Punkte</small></strong></div>)}</div><h2>So lernst du weiter</h2><p>In Mathe wird jede kleine Fähigkeit einzeln betrachtet. Du kannst bei einem Thema sicher sein und ein anderes noch üben. Fehler und Hilfen zeigen, welche nächste Aufgabe passen könnte. Frühere Antworten bleiben erhalten.</p><p>Wiederholungen helfen dir, Gelerntes zu behalten. Dein Wimmelbild bleibt sichtbar, auch wenn du später erneut Unterstützung brauchst.</p></>}
      {view === 'cards' && <><div className="section-heading"><h1>Deine Karten.</h1><button className="small-button" onClick={() => {setEdit({id:crypto.randomUUID(),front:'',back:'',subject:'math'});setReview(null);}}><Plus size={18}/>Neue Karte</button></div><p>Deine eigenen Fragen. Deine eigenen Eselsbrücken.</p>
      {edit && <form className="card-editor" onSubmit={async e=>{e.preventDefault();if(saving)return;const parsed=cardSchema.safeParse(edit);if(!parsed.success){setMessage('Bitte fülle Frage und Antwort aus.');return;}setSaving(true);const saved=await persist({...data,cards:[...data.cards.filter(c=>c.id!==edit.id),parsed.data]});setSaving(false);if(saved)setEdit(null);}}><h2>{data.cards.some(c=>c.id===edit.id)?'Karte bearbeiten':'Neue Karte'}</h2><label>Fach<select value={edit.subject} onChange={e=>setEdit({...edit,subject:e.target.value as Subject})}>{subjects.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label><label>Frage<textarea required maxLength={500} value={edit.front} onChange={e=>setEdit({...edit,front:e.target.value})}/></label><label>Antwort<textarea required maxLength={1000} value={edit.back} onChange={e=>setEdit({...edit,back:e.target.value})}/></label><div className="actions"><button className="primary" type="submit" disabled={saving}>{saving ? 'Wird gespeichert …' : 'Karte speichern'} <Check size={18}/></button><button type="button" className="text-button" onClick={()=>setEdit(null)}>Abbrechen</button></div></form>}
      {review && <section className="review"><span>{flipped?'Antwort':'Frage'}</span><h2>{flipped?review.back:review.front}</h2><div className="actions"><button className="primary" onClick={()=>setFlipped(!flipped)}>{flipped?'Frage ansehen':'Antwort zeigen'}<RotateCcw size={18}/></button><button className="text-button" onClick={()=>{const next=data.cards[(data.cards.findIndex(c=>c.id===review.id)+1)%data.cards.length];setReview(next);setFlipped(false);}}>Nächste Karte</button><button className="text-button" onClick={()=>setReview(null)}>Beenden</button></div></section>}
      {!data.cards.length && !edit && <div className="empty-state"><BookOpen size={40}/><h2>Platz für dein Wissen.</h2><p>Erstelle deine erste Karte, zum Beispiel mit einer Rechenregel oder einem neuen Wort.</p></div>}
      <div className="own-cards">{data.cards.map(c=><article key={c.id}><button className="card-front" onClick={()=>{setReview(c);setFlipped(false);setEdit(null);}}>{c.front}<span>{subjects.find(s=>s.id===c.subject)?.title} · Wiederholen</span></button><button className="icon-button" aria-label={`Karte bearbeiten: ${c.front}`} onClick={()=>{setEdit(c);setReview(null);}}><Pencil size={18}/></button><button className="icon-button" aria-label={`Karte löschen: ${c.front}`} onClick={()=>{if(confirm('Diese eigene Karte löschen?')){persist({...data,cards:data.cards.filter(x=>x.id!==c.id)});if(review?.id===c.id)setReview(null);}}}><Trash2 size={18}/></button></article>)}</div></>}
      {view === 'settings' && <><h1>Alles bei dir.</h1><p>Deine Daten gehören auf dein Gerät. Du entscheidest, wann du sie sicherst.</p><section className="settings-section"><h2>Deine Daten sichern</h2><p>Ein Export enthält deine Lernstände, Bestleistungen, Einstellungen und eigenen Karten. Beim Geräte- oder Domainwechsel brauchst du diese Datei.</p><div className="actions"><button className="primary" onClick={exportData}><Download size={20}/>Sicherung exportieren</button><label className="small-button import-button"><Upload size={20}/>Sicherung importieren<input type="file" accept="application/json,.json" onChange={e=>{importData(e.target.files?.[0]);e.target.value='';}}/></label></div></section><section className="settings-section"><h2>Angenehm lernen</h2><label className="checkbox"><input type="checkbox" checked={data.settings.reducedMotion} onChange={e=>persist({...data,settings:{reducedMotion:e.target.checked}})}/>Weniger Bewegung</label></section><section className="settings-section"><h2>App installieren & offline lernen</h2><p>{offlineReady?'Die App ist für die Offline-Nutzung bereit.':'Beim ersten vollständigen Online-Aufruf wird die App für die Offline-Nutzung gespeichert.'}</p>{install?<button className="small-button" onClick={async()=>{await install.prompt();setInstall(null);}}>LernKick installieren <Download size={18}/></button>:<p>Öffne das Browser-Menü und wähle „App installieren“ oder „Zum Home-Bildschirm“. Auf iPhone und iPad findest du die Option im Teilen-Menü von Safari.</p>}</section><section className="settings-section"><h2>Über LernKick</h2><p>500 Übungsfragen · 100 je Fach. Die Aufgaben orientieren sich an den Fachlehrplänen der Sekundarschule in Sachsen-Anhalt. Sie sind selbst erstellt und keine offiziellen Prüfungsfragen. Die Freigabe durch Fachlehrkräfte steht noch aus.</p><h3>Lehrplanquellen</h3><p>Recherche: 17. Oktober 2026. Die aktuell verlinkten Fachlehrpläne tragen den Stand 1. August 2019. Auswahlfragen ergänzen das Üben von Rechenwegen, Schreiben, Experimenten und mündlichen Begründungen.</p><ul className="curriculum-sources">{contentPacks.flatMap(pack => pack.version === 2 ? pack.sources : []).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} (PDF)</a></li>)}</ul><p>Keine Accounts, keine Analyse-Tracker, keine Übertragung von Lernständen. Beim Online-Abruf erhält der Hosting-Anbieter technisch notwendige Verbindungsdaten. Betreiberangaben und rechtliche Prüfung müssen vor einem öffentlichen Pilotbetrieb ergänzt werden.</p></section></>}
    </main><nav className="bottom-nav" aria-label="Hauptnavigation">{([{id:'home',label:'Lernen',icon:Zap},{id:'progress',label:'Fortschritt',icon:ChartNoAxesColumnIncreasing},{id:'cards',label:'Meine Karten',icon:BookOpen},{id:'settings',label:'Einstellungen',icon:Settings}] as const).map(item=><button key={item.id} disabled={updating} aria-current={view===item.id?'page':undefined} onClick={()=>{setView(item.id);setEdit(null);setReview(null);setMessage('');window.scrollTo(0,0);}}><item.icon size={21}/><span>{item.label}</span></button>)}</nav></>}
    {exitRequested&&<LeaveRoundDialog returnFocusTo={exitTrigger.current} onStay={()=>setExitRequested(false)} onLeave={()=>{setExitRequested(false);setRound(null);setView('home');window.scrollTo(0,0);}}/>}
    <footer className="footer"><span>LERNKICK</span><span>Ein Schritt zählt.</span></footer>
  </div>;
}
