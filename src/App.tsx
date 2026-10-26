import {HelpPage} from './components/HelpPage';
import {HomeStatus,type StatusReading} from './components/HomeStatus';
import {GameHub} from './components/GameHub';
import {GeometryFigure} from './components/GeometryFigure';
import {subjectPool} from './learning/difficulty';
import {prepareVocabularyMode,prepareHangmanMode} from './activities/difficulty';
import {EquationPractice} from './components/EquationPractice';
import {LearningBox} from './components/LearningBox';
import {contentCounts} from './lib/contentCounts';
import {ExitButton} from './components/ExitButton';
import {BoardGame} from './components/BoardGame';
import {PauseControl,RoundReview} from './components/RoundReview';
import {addReview} from './lib/roundReview';
import {recordNBack} from './learning/nback';
import {PracticeSwitch,DifficultySwitch} from './components/PracticeSwitch';
import {CalculatorKey} from './components/CalculatorKey';
import {BossBattle} from './components/BossBattle';
import {Statistics} from './components/Statistics';
import {bossTasks,type BossTask} from './learning/boss';
import {beginBoss,endBoss,creditRun,finishRun,type BossResult,type BossSubject,type Area,splitTime} from './learning/statistics';
import {activeTime,completeTraining,newJourney,strengthAt,type ModuleId} from './learning/journey';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Zap, Settings, WifiOff, Check, X, Download, Upload, RotateCcw, CircleHelp, Bot, RefreshCw, Grid3X3, Images } from 'lucide-react';
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
import type { LearningTask, HelpLevel } from './learning/types';
import { LearningTools } from './components/LearningTools';

import {ResetProgressDialog}from'./components/ResetProgressDialog';
import {VocabularyPractice}from'./components/VocabularyPractice';
import {resetLearningProgress}from'./activities/progress';
import {mathCategories} from './learning/categories';
import {QuestionPrompt} from './components/QuestionPrompt';
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
type View = 'home' | 'cards' | 'settings' | 'help' | 'vocabulary' | 'boards' | 'box' | 'statistics';
type Round = UserData['rounds'][string];
function newQuestion(q: LearningTask) { return { equationSteps:[], current:q,options:shuffle(q.options.map((_,i)=>i)),answer:null,helpLevel:(q.support?(q.generated?1:2):0) as HelpLevel,panel:(q.support?'help':null) as Round['panel'] }; }
export default function App() {
  const [data, setData] = useState<UserData>(emptyData);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>('home');
  const [boss,setBoss]=useState<{initial:BossResult;tasks:BossTask[];test:boolean}|null>(null);
  const [bossClock,setBossClock]=useState<HTMLDivElement|null>(null);
  const [bossAbort,setBossAbort]=useState(0),[testMode,setTestMode]=useState(false);
  const previousHomeStatus=useRef<StatusReading|null>(null);
  const logoTaps=useRef(0),launchingBoss=useRef(false);
  const [boxPracticing,setBoxPracticing]=useState(false);
  const [studySession,setStudySession]=useState<UserData['cardSession']>(null);
  const [mathSetup,setMathSetup]=useState(false);
  const [categories,setCategories]=useState(mathCategories.filter(c=>c.id!=='mixed').map(c=>c.id));

  const [resetOpen,setResetOpen]=useState(false);
  const [game,setGame]=useState<'hangman'|'germany'|'vocabulary'|'nback'|'puzzle'|null>(null);
  const [gameDone,setGameDone]=useState(false);
  const [practicePaused,setPracticePaused]=useState(false);
  const [boardActive,setBoardActive]=useState(false);
  const [round, setRoundState] = useState<Round | null>(null);
  const visibleCard=useRef<string|null>(null);
  const visibleRound=useRef<string|null>(null);
  const advancedQuestion=useRef<string|null>(null);
  function setRound(value:Round|null) {
    if(!value||visibleRound.current===value.id)setRoundState(value);
    if(value)void persist({...dataRef.current,rounds:{...dataRef.current.rounds,[value.subject]:value}});
  }
  function requestExit(target:View='home') {
    if(boss){setBossAbort(n=>n+1);return;}
    if(game==='nback'){const child=document.querySelector('iframe')?.contentWindow as (Window&{lernkickSuspendRound?:()=>void})|null;child?.lernkickSuspendRound?.();}
    setPracticePaused(false);visibleCard.current=null;visibleRound.current=null;setRoundState(null);setStudySession(null);setGame(null);setMathSetup(false);setView(target);window.scrollTo(0,0);
  }
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState('');
  const [offline, setOffline] = useState(!navigator.onLine);
  const mode='adaptive' as 'adaptive' | 'free' | 'cards';
  const [edit, setEdit] = useState<Card | null>(null);
  const [install, setInstall] = useState<any>(null);
  const statsClock=useRef({id:'',previous:0,lastInput:0});
  const persistence = useRef(Promise.resolve());
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);
  const [updating, setUpdating] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const { needRefresh: [needRefresh], offlineReady: [offlineReady] } = useRegisterSW({ immediate: true, onNeedReload() {}, onRegisteredSW(_url, registration) { registrationRef.current = registration; if (navigator.onLine) registration?.update().catch(() => {}); }, onRegisterError() { setMessage('Offline-Modus konnte nicht eingerichtet werden. Bitte lade die App online erneut.'); } });
  useEffect(() => { loadData().then(value => { setData(value); setReady(true); }).catch(() => { setStorageError('Dein Gerätespeicher ist nicht verfügbar oder enthält nicht lesbare Daten. Bestehende Daten werden nicht überschrieben. Bitte prüfe die Browser-Einstellungen.'); }); }, []);
  useEffect(() => { const online = () => setOffline(!navigator.onLine); const prompt = (e: Event) => { e.preventDefault(); setInstall(e); }; window.addEventListener('online', online); window.addEventListener('offline', online); window.addEventListener('beforeinstallprompt', prompt); return () => { window.removeEventListener('online', online); window.removeEventListener('offline', online); window.removeEventListener('beforeinstallprompt', prompt); }; }, []);
  useEffect(() => { document.documentElement.dataset.motion = data.settings.reducedMotion ? 'reduced' : 'system'; }, [data.settings.reducedMotion]);
  const dataRef=useRef(data);dataRef.current=data;
  const [creatingCard,setCreatingCard]=useState<boolean|null>(null);
  const activePractice=useRef(false);activePractice.current=Boolean(!boss&&!practicePaused&&(round&&!round.done&&!mathSetup||studySession&&!studySession.done||game&&!gameDone&&game!=='nback'&&game!=='puzzle'||view==='box'&&(creatingCard!==null?creatingCard:boxPracticing)||view==='cards'&&Boolean(edit?.front.trim()&&edit?.back.trim())));
  function persist(next: UserData) {
    const previous=dataRef.current.cardSession;
    if(next.journey&&previous&&!previous.done&&next.cardSession?.id===previous.id&&next.cardSession.done)next={...next,journey:{...next.journey,statistics:finishRun(next.journey.statistics,previous.id,'cards',Date.now(),'cards',previous.subject)}};
    const clock=statsClock.current,completed=next.journey?.statistics.runs[clock.id];
    if(completed&&!dataRef.current.journey?.statistics.runs[clock.id]&&!document.hidden&&activeRun.current?.id===clock.id){const now=Date.now(),gap=now-clock.previous;if(gap>0&&gap<=2000&&now-clock.lastInput<=30000){const slices={...completed.slices};for(const [day,time]of Object.entries(splitTime(clock.previous,now)))slices[day]=(slices[day]??0)+time;next={...next,journey:{...next.journey!,statistics:{...next.journey!.statistics,runs:{...next.journey!.statistics.runs,[clock.id]:{...completed,slices}}}}};clock.previous=now;}}
    if(next.journey){const stats=next.journey.statistics,pending={...stats.pending};let changed=false;for(const [id,run]of Object.entries(pending)){const sessions=[...Object.values(next.rounds).map(r=>r.id),next.cardSession?.id,next.activities.vocabulary.session?.runId,next.activities.germany.session?.runId,next.activities.hangman.session?.runId];if(run.area!=='nback'&&!sessions.includes(id)){delete pending[id];changed=true;}}if(changed)next={...next,journey:{...next.journey,statistics:{...stats,pending}}};}
 dataRef.current=next;setData(next); persistence.current = persistence.current.catch(() => {}).then(() => saveData(next)); return persistence.current.then(() => true, () => { setStorageError('Speichern fehlgeschlagen. Bitte exportiere deine Daten, bevor du die App schließt.'); return false; }); }
  useEffect(()=>{
   let previous=performance.now(),lastInput=previous;
   const touch=(event:Event)=>{if(event.isTrusted)lastInput=performance.now();};const visibility=()=>{previous=performance.now();lastInput=0;};document.addEventListener('visibilitychange',visibility);
   window.addEventListener('pointerdown',touch);window.addEventListener('keydown',touch);window.addEventListener('input',touch);
   const timer=setInterval(()=>{const now=performance.now(),gap=now-previous;previous=now;
    if(document.hidden||!activePractice.current||now-lastInput>30000)return;
    const current=dataRef.current;if(current.journey)void persist({...current,journey:activeTime(current.journey,Math.min(gap,10000),Date.now())});
   },5000);
   return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointerdown',touch);window.removeEventListener('keydown',touch);window.removeEventListener('input',touch);};
  },[activePractice.current]);
  const activeRun=useRef<{id:string;area:Area;subject?:BossSubject}|null>(null);
  const vocab=data.activities.vocabulary.session,country=data.activities.germany.session,hang=data.activities.hangman.session,cardRun=studySession??(view==='box'&&boxPracticing?data.cardSession:null);
  activeRun.current=boss||practicePaused?null:round&&!round.done&&!mathSetup?{id:round.id,area:round.subject}:game==='vocabulary'&&vocab?.runId&&vocab.index<vocab.ids.length?{id:vocab.runId,area:'german'}:game==='germany'&&country?.runId&&!(country.round==='capitals'&&country.placed.length===16)?{id:country.runId,area:'germany'}:game==='hangman'&&hang?.runId&&!hang.recorded?{id:hang.runId,area:'hangman'}:cardRun&&!cardRun.done?{id:cardRun.id,area:'cards',subject:cardRun.subject}:null;
  const runKey=activeRun.current?.id;
  useEffect(()=>{const run=activeRun.current;if(!run){statsClock.current.id='';return;}const clock=statsClock.current={id:run.id,previous:Date.now(),lastInput:Date.now()};
    const input=(event:Event)=>{if(event.isTrusted)clock.lastInput=Date.now();};const visibility=()=>{clock.previous=Date.now();clock.lastInput=0;};
    window.addEventListener('pointerdown',input);window.addEventListener('keydown',input);document.addEventListener('visibilitychange',visibility);
    const timer=setInterval(()=>{const now=Date.now(),gap=now-clock.previous;clock.previous=now;if(document.hidden||activeRun.current?.id!==run.id||now-clock.lastInput>30000||gap<=0||gap>2000)return;const current=dataRef.current;if(current.journey)void persist({...current,journey:{...current.journey,statistics:creditRun(current.journey.statistics,run.id,run.area,gap,now,run.subject)}});},1000);
    return()=>{clearInterval(timer);window.removeEventListener('pointerdown',input);window.removeEventListener('keydown',input);document.removeEventListener('visibilitychange',visibility);};
  },[runKey,practicePaused]);
  async function launchBoss(subject:BossSubject){if(launchingBoss.current||boss)return;launchingBoss.current=true;try{const current=dataRef.current;if(!testMode&&(current.journey?.statistics.charges[subject]??0)<5){setMessage('Für diesen Bosskampf brauchst du fünf vollständig abgeschlossene Übungsrunden in diesem Fach.');return;}
    const tasks=bossTasks(current,subject,testMode);if(tasks.length<10){setMessage('Übe zuerst weitere Themen in diesem Fach. Für den Bosskampf werden zehn passende Aufgaben aus bereits geübten Themen benötigt. Deine Ladung bleibt erhalten.');return;}
    const initial:BossResult={id:crypto.randomUUID(),subject,difficulty:current.settings.difficulty,startedAt:Date.now(),status:'running',correct:0,wrong:0,won:false,durationMs:0};
    if(!testMode&&!(await persist({...current,journey:{...(current.journey??newJourney(current.scores)),statistics:beginBoss((current.journey??newJourney(current.scores)).statistics,initial)}})))return;
    setBossAbort(0);setBoss({initial,tasks,test:testMode});setMessage('');window.scrollTo(0,0);
    }finally{launchingBoss.current=false;}
  }
  function logoClick(){if(view==='settings'&&!boss){logoTaps.current++;if(logoTaps.current===5){logoTaps.current=0;setTestMode(value=>!value);setMessage(testMode?'Testmodus deaktiviert':'Testmodus aktiviert');}return;}logoTaps.current=0;requestExit('home');}
  useEffect(()=>{if(!ready)return;document.documentElement.dataset.theme='retro-tech';document.documentElement.dataset.pink=String(data.settings.pink);document.documentElement.dataset.compact=String(data.settings.compact);},[ready,data.settings.theme,data.settings.pink,data.settings.compact]);
  useEffect(()=>{const back=()=>{if(boss||game==='nback')requestExit('home');};window.addEventListener('popstate',back);return()=>window.removeEventListener('popstate',back);},[game,boss]);
  useEffect(()=>{let timer:ReturnType<typeof setTimeout>;const isText=(target:EventTarget|null)=>target instanceof HTMLTextAreaElement||target instanceof HTMLInputElement&&['text','search','email','number','url','tel','password'].includes(target.type);function focus(event:FocusEvent){if(isText(event.target)){clearTimeout(timer);document.documentElement.dataset.textInput='true';}}function blur(){clearTimeout(timer);timer=setTimeout(()=>{if(!isText(document.activeElement))delete document.documentElement.dataset.textInput;},200);}document.addEventListener('focusin',focus);document.addEventListener('focusout',blur);return()=>{clearTimeout(timer);document.removeEventListener('focusin',focus);document.removeEventListener('focusout',blur);};},[]);
  async function manualUpdate() {
    if (updating || boss || round || studySession || game || edit) return;
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
  function selectTask(subject:Subject,roundMode:'adaptive'|'free',used:string[],signatures:string[],selectedCategories?:string[]) {
    const pool=subjectPool(questions,subject,dataRef.current.settings.difficulty);
    if(roundMode==='adaptive'&&subject==='math'){const choices=selectedCategories??(round&&!round.done?(round.categories??[round.category??'mixed']):categories);return nextMathTask(pool,dataRef.current,{used,signatures,category:choices[used.length%choices.length]??'mixed'});}
    const question=roundMode==='free'?shuffle(pool.filter(q=>!used.includes(q.id)))[0]:nextQuestion(pool,data,used);
    return question?asTask(question):undefined;
  }
  function start(subject:Subject,replace=false) {
    setPracticePaused(false);setAutoAdvance(true);
    if(mode==='cards'){startCards(subject);return;}
    const saved=dataRef.current.rounds[subject];
    if(saved&&!saved.done&&!replace){visibleRound.current=saved.id;const level=dataRef.current.settings.difficulty;if((saved.globalDifficulty??'normal')!==level){const task=saved.answer===null?selectTask(subject,saved.mode,saved.used,saved.signatures,saved.categories??[saved.category??'mixed']):undefined;const updated={...saved,...(task?newQuestion(task):{}),globalDifficulty:level};setRoundState(updated);void persist({...dataRef.current,rounds:{...dataRef.current.rounds,[subject]:updated}});}else setRoundState(saved);return;}
    if(subject==='math'&&!mathSetup){setRoundState(null);setMathSetup(true);return;}
    setMathSetup(false);
    const task=selectTask(subject,mode,[],[],categories);if(!task)return;
    const id=crypto.randomUUID();visibleRound.current=id;
    setRound({globalDifficulty:dataRef.current.settings.difficulty,categories:subject==='math'?categories:undefined,id,kind:'subject',length:10,subject,mode,...newQuestion(task),used:[],signatures:[],correctSignatures:[],milestones:[],history:[],correct:0,points:0,done:false});setMessage('');window.scrollTo(0,0);
  }
  function endPractice(){
    const current=dataRef.current;
    if(round&&!round.done){const rounds={...current.rounds};delete rounds[round.subject];const subject=round.subject;const choices=round.categories;requestExit('home');if(subject==='math'){if(choices)setCategories([...new Set(choices.flatMap(id=>id==='other'?['ratio','geometry','units']:[id]))]);setMathSetup(true);}void persist({...current,rounds});return;}
    if(game&&game!=='nback'&&game!=='puzzle'){const id=game;requestExit(id==='vocabulary'?'vocabulary':'home');void persist({...current,activities:{...current.activities,[id]:{...current.activities[id],session:null}}});}
  }
  function startCards(subject:Subject,cards=personalCards(data,subject),returnView:NonNullable<UserData['cardSession']>['returnView']='home') {
    const session=dataRef.current.cardSession;const next=session&&!session.done&&session.subject===subject?session:{id:crypto.randomUUID(),subject,cards:cardQueue(data,cards),done:false,returnView,index:0,flipped:false,known:0};visibleCard.current=next.id;setStudySession(next);void persist({...dataRef.current,cardSession:next});setRound(null);setMessage('');window.scrollTo(0,0);
  }
  function nextWord(used:string[]) {const pool=personalVocabulary(data).map(wordQuestion);const question=nextQuestion(pool,data,used);return question?asTask(question):undefined;}
  function startVocabulary(){let next=prepareVocabularyMode(dataRef.current);const previous=next.activities.vocabulary.session;if(previous&&previous.index>=previous.ids.length)next={...next,activities:{...next.activities,vocabulary:{...next.activities.vocabulary,session:null}}};if(next!==dataRef.current)void persist(next);setPracticePaused(false);setGame('vocabulary');setGameDone(false);setMessage('');window.scrollTo(0,0);}
  async function answer(index:number,ownAnswer?:string) {
    if(!round||round.answer!==null||saving||practicePaused)return;
    setSaving(true);const correct=index===round.current.correct;
    const result=round.kind==='vocabulary'?{...recordAnswer(dataRef.current,round.current,correct),newMilestones:[]}:recordLearningAnswer(dataRef.current,round.current,correct,round.helpLevel);
    const history=addReview(round.history,{id:round.current.id,title:subjects.find(s=>s.id===round.subject)?.title??'Lernrunde',prompt:round.current.prompt,ownAnswer:ownAnswer??round.current.options[index],correctAnswer:round.current.options[round.current.correct],explanation:round.current.explanation,correct});
    const updated:Round={...round,history,answer:index,panel:null,correct:round.correct+Number(correct),correctSignatures:correct?[...round.correctSignatures,round.current.signature]:round.correctSignatures,points:round.points+result.points,milestones:[...round.milestones,...result.newMilestones]};
    await persist({...result.data,rounds:{...result.data.rounds,[round.subject]:updated}});setSaving(false);
    if(visibleRound.current===round.id)setRoundState(updated);
  }
  async function advance() {
    if(!round||round.answer===null||saving||practicePaused||advancedQuestion.current===`${round.id}:${round.current.id}`)return;
    advancedQuestion.current=`${round.id}:${round.current.id}`;
    const used=[...round.used,round.current.id],signatures=[...round.signatures,round.current.signature];
    if(used.length===round.length) {
      const before=dataRef.current;const journey=completeTraining(before.journey??newJourney(before.scores),{id:round.id,module:round.subject,correct:round.correct,total:round.length,tasks:signatures,correctTasks:round.correctSignatures});
      setSaving(true);await persist({...before,journey});setSaving(false);setRound({...round,points:journey.totalPoints-(before.journey?.totalPoints??0),used,signatures,done:true});
    } else {
      const task=round.kind==='vocabulary'?nextWord(used):selectTask(round.subject,round.mode,used,signatures);
      if(task)setRound({...round,...newQuestion(task),globalDifficulty:dataRef.current.settings.difficulty,used,signatures});
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
  const seconds=useAutoAdvance(Boolean(round&&!round.done&&round.answer!==null&&!round.panel&&!practicePaused&&!saving&&autoAdvance),round?.current.id,()=>{void advance();});
  function exportData() { const blob = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `lernkick-sicherung-${new Date().toISOString().slice(0,10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); }
  async function importData(file?: File) { if (!file) return; try { if(file.size > 5_000_000) throw new Error(); const next = readBackup(await file.text()); if (window.confirm(next.journey&&data.journey&&next.journey.profileId!==data.journey.profileId?'Die Datei gehört zu einem anderen Profil. Es wird vollständig übernommen, ohne die Lernstände zu vermischen. Dein aktuelles Profil wird vorher gesichert. Jetzt wechseln?':'Die Sicherung übernimmt Lernstände und eigene Karten. Dein aktueller Stand wird vorher automatisch gesichert; erreichte Punkte und Erfolge bleiben erhalten. Jetzt importieren?')) { await persistence.current;await backupBeforeImport();const saved=await persist(prepareImport(data,next)); if(saved)setMessage('Sicherung übernommen. Deine Lernstände sind wieder da.'); } } catch { setMessage('Diese Sicherung ist ungültig oder hat eine nicht unterstützte Version. Bitte wähle eine LernKick-JSON-Datei bis 5 MB.'); } }
  const currentSubject = subjects.find(s => s.id === round?.subject);
  const [strengthNow,setStrengthNow]=useState(Date.now());
  useEffect(()=>{const update=()=>setStrengthNow(Date.now()),timer=setInterval(update,60000);window.addEventListener('focus',update);document.addEventListener('visibilitychange',update);return()=>{clearInterval(timer);window.removeEventListener('focus',update);document.removeEventListener('visibilitychange',update);};},[]);
  useEffect(()=>{logoTaps.current=0;},[view]);
  const strength=data.journey?strengthAt(data.journey,strengthNow):0;
  const compactHome = !boss && !mathSetup && !round && !studySession && !game && view === 'home';
  return <div onClickCapture={event=>{if(!(event.target as HTMLElement).closest('.wordmark'))logoTaps.current=0;}} className={`app-shell ${view==='boards'?'boards-screen':''} ${boss||(round&&!round.done)||(studySession&&!studySession.done)||game?'learning':''} ${compactHome ? 'home-screen':mathSetup?'math-setup-screen':!round&&!studySession&&!game&&view==='settings'?'settings-screen':!round&&!studySession&&!game&&view==='vocabulary'?'vocabulary-screen':view==='box'?'box-screen':''}`}>
    <header className="header"><button className="wordmark" disabled={Boolean(((round&&!round.done)||studySession)&&saving)} onClick={logoClick} aria-label="LernKick Startseite"><Zap size={27} fill="currentColor"/>LERN<span>KICK</span></button>{testMode&&<small className="test-badge">TEST</small>}{boss&&<div id="boss-clock" ref={setBossClock}/>}<>{!boss && !round && !studySession && !game && view === 'home' ? <button className="header-update" disabled={!ready || updating} aria-busy={updating} onClick={manualUpdate}><RefreshCw size={17}/>{updating ? 'Prüfe …' : 'App aktualisieren'}</button> : !boss&&<div className="header-tools"><span className="local-status">{offline ? <WifiOff size={15}/> : <span className="status-dot"/>}{offline ? 'Du bist offline' : 'Dein Tempo. Dein Gerät.'}</span></div>}</></header>
    {storageError && <div role="alert" className="notice error">{storageError}</div>}
    {message && <div role="status" className="notice">{message}<button aria-label="Hinweis schließen" onClick={() => setMessage('')}><X size={20}/></button></div>}
    {needRefresh && !boss && !round && !studySession && !game && !edit && view !== 'home' && <div className="notice">Eine neue Version ist bereit. Deine Lernstände bleiben erhalten.<button className="small-button" disabled={updating} onClick={manualUpdate}>Jetzt aktualisieren</button></div>}
    {!ready ? <main><h1>Gleich geht’s los.</h1><p>{storageError ? 'Der Speicher muss zuerst wieder verfügbar sein.' : 'Deine Lernstände werden geladen …'}</p></main> : game==='puzzle'?<GameHub data={data} onChange={persist} onExit={()=>requestExit('home')}/> : boss ? <BossBattle key={boss.initial.id} {...boss} clockHost={bossClock} abortSignal={bossAbort} onFinish={async(result,slices)=>{const current=dataRef.current;if(!current.journey)return false;return persist({...current,journey:{...current.journey,statistics:endBoss(current.journey.statistics,result,slices)}});}} onExit={()=>{setBoss(null);setBossAbort(0);setView('home');}}/> : game==='nback' ? <NBackGame compact={data.settings.compact} paused={false} onExit={()=>requestExit('home')} progress={data.nback} onLevelChange={level=>{const current=dataRef.current;if(current.nback.current!==level)void persist({...current,nback:{...current.nback,current:level}});}} theme={data.settings.pink?'pink':'retro-tech'} onActivity={(milliseconds,id)=>{const current=dataRef.current;if(current.journey){const journey=activeTime(current.journey,milliseconds);void persist({...current,journey:id?{...journey,statistics:creditRun(journey.statistics,id,'nback',milliseconds)}:journey});}}} onAbort={id=>{const current=dataRef.current;if(current.journey){const pending={...current.journey.statistics.pending};delete pending[id];void persist({...current,journey:{...current.journey,statistics:{...current.journey.statistics,pending}}});}}} onCompleted={id=>{const current=dataRef.current;if(current.journey)void persist({...current,journey:{...current.journey,statistics:finishRun(current.journey.statistics,id,'nback')}});}} onResult={result=>{const current=dataRef.current;void persist({...current,nback:recordNBack(current.nback,{id:result.id,level:result.level,errors:result.errors,at:Date.now()}),journey:current.journey?completeTraining(current.journey,{...result,module:'nback'}):current.journey});}} onRunningChange={running=>setGameDone(!running)}/> : game==='germany' ? <CountryQuiz data={data} onChange={persist} onExit={()=>requestExit('home')} onEnd={endPractice} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)} paused={practicePaused} onPauseChange={setPracticePaused}/> : game==='vocabulary' ? <VocabularyPractice data={data} onChange={persist} onExit={()=>requestExit('home')} onEnd={endPractice} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)} paused={practicePaused} onPauseChange={setPracticePaused}/> : game ? <Hangman data={data} onChange={persist} onExit={()=>requestExit('home')} onEnd={endPractice} onFinished={()=>setGameDone(true)} onRunning={()=>setGameDone(false)} paused={practicePaused} onPauseChange={setPracticePaused}/> : studySession ? <CardStudy key={studySession.id} cards={studySession.cards} title={`Karten · ${subjects.find(s=>s.id===studySession.subject)?.title}`} done={studySession.done} onRate={async(id,known)=>{setSaving(true);const saved=await persist(rateCard(data,id,known));setSaving(false);return saved;}} session={studySession} onSession={value=>{const next={...studySession,...value};if(visibleCard.current===studySession.id)setStudySession(next);void persist({...dataRef.current,cardSession:next});}} onDone={()=>{const next={...(dataRef.current.cardSession??studySession),done:true};if(visibleCard.current===studySession.id)setStudySession(next);void persist({...dataRef.current,cardSession:next});}} onExit={()=>requestExit('home')} onRestart={()=>startCards(studySession.subject)}/> : mathSetup ? <main className="math-setup"><div className="math-setup-heading"><ExitButton onClick={()=>requestExit('home')}/><h1>Mathematik</h1></div><div className="math-category-heading"><h2>Kategorien</h2><button className="small-button" aria-pressed={categories.length===mathCategories.length-1} onClick={()=>setCategories(categories.length===mathCategories.length-1?[]:mathCategories.filter(c=>c.id!=='mixed').map(c=>c.id))}>Alle</button></div><div className="math-categories" aria-label="Mathe-Kategorien">{mathCategories.filter(c=>c.id!=='mixed').map(c=><button className="profiled-button" id={`category-${c.id}`} aria-describedby={c.id==='times'?'category-arithmetic':undefined} key={c.id} aria-pressed={categories.includes(c.id)} onClick={()=>setCategories(categories.includes(c.id)?categories.filter(id=>id!==c.id):[...categories,c.id])}>{c.label}</button>)}</div><div className="math-start">{round&&!round.done&&<button className="small-button" data-action="selection" onClick={()=>setMathSetup(false)}>Auswahl schließen</button>}{!categories.length&&<p role="status">Wähle mindestens eine Kategorie.</p>}<button className="primary" disabled={!categories.length} onClick={()=>start('math',true)}>{round&&!round.done?'Neue Runde starten':'Runde starten'}</button></div></main> : round ? <main className={`round-view ${round.current.diagram?'geometry-round':''}`} style={{ '--subject': currentSubject?.color } as React.CSSProperties}>
      {round.done ? <><ExitButton onClick={()=>requestExit('home')}/><section className="result"><div className="result-icon"><Check size={48}/></div><h1>{round.correct/round.length>.6?'Durchlauf bestanden.':'Weiter üben.'}</h1><p>Jede Frage bringt dich weiter. Auch die, die noch nicht sitzt.</p><div className="result-numbers"><span><strong>{round.correct}/{round.length}</strong>richtig beantwortet</span><span><strong>{round.points}</strong>Punkte</span></div><p>Was noch Übung braucht, kommt später wieder dran.</p>{round.correct/round.length<=.6&&<p>Zum Bestehen brauchst du mehr als 60 %. Deine erreichten Punkte bleiben erhalten.</p>}<button className="primary" onClick={()=>{if(round.subject==='german'){visibleRound.current=null;setRoundState(null);startVocabulary();}else start(round.subject);}}>Noch eine Runde <RotateCcw size={18}/></button></section></> : <>
      <div className={`round-top ${round.subject==='math'?'math-round-top':''}`}><ExitButton onClick={()=>requestExit('home')}/>{round.subject==='math'&&<button className="categories-button" disabled={saving} onClick={()=>{setCategories(round.categories??[round.category??'mixed']);setMathSetup(true);}}>Zu den Kategorien</button>}<strong>{round.kind==='vocabulary'?'Wortschatz':currentSubject?.title}</strong><span>Frage {round.used.length+1} von {round.length}</span><PauseControl paused={practicePaused} onChange={setPracticePaused}/>{practicePaused&&<button className="small-button practice-end" disabled={saving} onClick={endPractice}>Übung beenden</button>}</div>
      <div className="round-track" aria-label={`Frage ${round.used.length+1} von ${round.length}`}>{Array.from({length:round.length},(_,i) => <span key={i} className={i < round.used.length ? 'filled' : i === round.used.length ? 'current' : ''}/>)}</div>
      <div className="round-scroll" key={round.current.id}>{practicePaused?<RoundReview history={round.history}/>:<><section className="question"><span className="question-topic">{round.kind==='vocabulary'?'Alltagswortschatz':round.subject==='math' ? mathById.get(round.current.skillId)?.title??'Mathe üben' : `${round.mode==='adaptive'?'Lernrunde':'Freies Üben'} · Stufe ${round.current.difficulty}`}</span>{!round.current.equation&&<h1 key={round.current.id}><QuestionPrompt text={round.current.prompt} highlight={round.subject==='german'}/></h1>}</section>
      {round.kind==='subject'&&round.subject==='math'&&!round.current.equation&&!round.current.diagram&&<LearningTools task={round.current} helpLevel={round.helpLevel} panel={round.panel} alternate={preferenceFor(data,round.subject).explanation==='alternate'} onPanel={panel=>setRound({...round,panel})} onHelp={showHelp} disabled={saving}/>}
      {round.current.diagram&&<GeometryFigure diagram={round.current.diagram}/>}
      {round.current.equation?<EquationPractice key={round.current.id} initial={round.current.equation} steps={round.equationSteps??[]} disabled={round.answer!==null||saving} onStep={async(operation,solved)=>{const updated={...round,equationSteps:[...(round.equationSteps??[]),operation]};setRound(updated);if(solved){await answer(0,`x = ${round.current.options[0]}`);const latest=dataRef.current.rounds[round.subject];if(latest){const saved={...latest,equationSteps:updated.equationSteps};setRound(saved);}}}}/>:<>      <section className={`answers ${round.answer !== null ? 'answered' : ''} ${compactAnswers(round.current.options) ? 'answer-grid' : ''}`} aria-label="Antwortmöglichkeiten">{round.options.map((index, i) => <button key={index} disabled={round.answer !== null || saving} className={`answer ${round.answer !== null && index === round.current.correct ? 'correct' : round.answer === index ? 'incorrect' : ''}`} onClick={() => answer(index)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{round.current.options[index]}</span>{round.answer !== null && index === round.current.correct && <Check/>}{round.answer === index && index !== round.current.correct && <span className="answer-selection">Deine Wahl</span>}</button>)}</section></>}

      {round.answer !== null && <section className="feedback" aria-live="polite"><h2>{round.answer === round.current.correct ? 'Sitzt. Gut gemacht!' : 'Noch nicht ganz. Schau mal:'}</h2><p>{round.current.explanation}</p></section>}
      </>}</div><div className="round-actions">{practicePaused?<p>Drücke „Fortsetzen“, um zur aktuellen Aufgabe zurückzukehren.</p>:round.answer !== null ? <><div className="auto-advance"><span>{autoAdvance ? `Weiter in ${seconds} s` : 'Du bestimmst das Tempo.'}</span><button className="auto-toggle" onClick={() => setAutoAdvance(!autoAdvance)}>{autoAdvance ? 'Anhalten' : 'Automatisch weiter'}</button></div><button className="primary" disabled={saving} onClick={advance}>{round.used.length === round.length-1 ? 'Runde abschließen' : 'Nächste Frage'}<ArrowRight size={20}/></button></> : <p>{round.current.equation?'Gib eine Umformung hinter dem Strich ein.':'Wähle eine Antwort.'}</p>}</div>
      </>}
    </main> : <>
    <main>
      {view === 'home' && <>
        <section id="subjects" className="subjects-section"><div className="section-heading"><div className="global-difficulty"><DifficultySwitch level={data.settings.difficulty} onChange={difficulty=>void persist({...dataRef.current,settings:{...dataRef.current.settings,difficulty}})}/></div><button className="boss-switch" aria-pressed={data.settings.bossMode} disabled={!testMode&&!data.settings.bossMode&&!Object.values(data.journey?.statistics.charges??{}).some(n=>n===5)} onClick={()=>void persist({...dataRef.current,settings:{...dataRef.current.settings,bossMode:!dataRef.current.settings.bossMode}})}><Bot size={18}/>Bosskampf {data.settings.bossMode?'an':'aus'}</button></div>
        <div className="home-console">
        <HomeStatus reducedMotion={data.settings.reducedMotion} points={data.journey?.totalPoints??0} strength={strength} previous={previousHomeStatus} onOpen={()=>setView('statistics')}/>
        <div className="calculator-grid">{subjects.map(s=><CalculatorKey key={s.id} id={s.id} title={s.title} short={s.short} color={s.color} journey={data.journey??newJourney(data.scores)} disabled={updating} onClick={()=>{if(data.settings.bossMode){void launchBoss(s.id);return;}if(s.id==='german'){const next=prepareVocabularyMode(dataRef.current);if(next!==dataRef.current)void persist(next);setView('vocabulary');return;}start(s.id);}}/>)}{([{id:'vocabulary',title:'Games',color:'var(--calc-violet)'},{id:'hangman',title:'Galgenraten',color:'var(--calc-violet)'},{id:'germany',title:'Deutschlandquiz',color:'var(--calc-orange)'},{id:'nback',title:'Dual N-Back',color:'var(--calc-violet)'}] as const).map(item=><CalculatorKey key={item.id} {...item} journey={data.journey??newJourney(data.scores)} nback={data.nback} disabled={updating} onClick={()=>{setPracticePaused(false);if(item.id==='vocabulary'){setGame('puzzle');setGameDone(true);return;}if(item.id==='hangman'){const next=prepareHangmanMode(dataRef.current);if(next!==dataRef.current)void persist(next);}if(item.id==='nback')history.pushState({game:'nback'},'');setGame(item.id);setGameDone(item.id==='nback');setMessage('');window.scrollTo(0,0);}}/>)}</div></div></section>

      </>}
      {view==='statistics'&&<Statistics data={data} onExit={()=>setView('home')}/>}
      {view === 'help' && <HelpPage onExit={()=>requestExit('home')}/>}
      {view==='box'&&<LearningBox onPracticing={setBoxPracticing} data={data} onEditing={setCreatingCard} onChange={persist} onExit={()=>requestExit('home')}/>}
      {view==='boards'&&<BoardGame data={data} onChange={persist} onExit={()=>setView('home')} onActivityChange={setBoardActive}/>}
      {view==='cards'&&<><ExitButton onClick={()=>requestExit('home')}/><CardManager data={data} onChange={persist} edit={edit} setEdit={setEdit}/></>}
      {view==='vocabulary'&&<VocabularyPanel onExit={()=>requestExit('home')} data={data} onChange={persist} onResumeOld={data.rounds.german&&!data.rounds.german.done?()=>start('german'):undefined} onStart={startVocabulary}/>}
      {view==='settings'&&<section className="settings-page" aria-label="Einstellungen"><div className="settings-top"><ExitButton onClick={()=>requestExit('home')}/><button className="small-button" onClick={()=>setView('help')}><CircleHelp size={20}/>Hilfe</button></div><section className="settings-backup"><h2>Daten sichern</h2><div className="actions"><button className="small-button" onClick={exportData}><Download size={18}/>Sicherung exportieren</button><label className="small-button import-button"><Upload size={18}/>Sicherung importieren<input type="file" accept="application/json,.json" onChange={e=>{void importData(e.target.files?.[0]);e.target.value='';}}/></label></div></section><p className="local-data-help">Deine Lernstände liegen nur auf diesem Gerät. Gelöschte Browserdaten oder ein Gerätewechsel können sie entfernen. Nutze eine Sicherung zum Übertragen; es gibt keine automatische Synchronisierung.</p><section className="settings-preferences"><h2>Darstellung</h2><div className="settings-options"><div className="settings-switch"><span>Kompakt</span><PracticeSwitch label="Kompakt" showStatus={false} checked={data.settings.compact} onChange={compact=>void persist({...dataRef.current,settings:{...dataRef.current.settings,compact}})}/></div><div className="settings-switch"><span>Mit Pink</span><PracticeSwitch label="Mit Pink" showStatus={false} checked={data.settings.pink} onChange={pink=>void persist({...dataRef.current,settings:{...dataRef.current.settings,pink}})}/></div></div></section><section className="settings-reset"><button className="text-button" data-action="stop" onClick={()=>setResetOpen(true)}>Daten löschen</button></section><section className="settings-install"><h2>App installieren & offline lernen</h2>{install?<button className="small-button" onClick={async()=>{await install.prompt();setInstall(null);}}>LernKick installieren<Download size={18}/></button>:<><p><strong>Android:</strong> Browser-Menü → „App installieren“.</p><p><strong>iPhone:</strong> Safari → „Teilen“ → „Zum Home-Bildschirm“.</p></>}<p>{offlineReady?'Offline bereit.':'Einmal vollständig online öffnen, danach offline üben.'}</p></section><details className="settings-about"><summary>Über LernKick & Lehrplanquellen</summary><p>{contentCounts.questions} redaktionelle Fachfragen, zusätzliche generierte Mathevarianten, {contentCounts.cards} voreingestellte Lernkarten, {contentCounts.words} Begriffsaufgaben, {contentCounts.sentences} Satzbauaufgaben, {contentCounts.grammar} Grammatikaufgaben, {contentCounts.spelling} Rechtschreibaufgaben und {contentCounts.proverbs} Sprichwortaufgaben. Selbst erstellte Übungen, keine offiziellen Prüfungsfragen; fachliche Freigabe steht aus.</p><ul className="curriculum-sources">{contentPacks.flatMap(pack=>pack.version===2?pack.sources:[]).map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} (PDF)</a></li>)}</ul><p>Keine Konten oder Analyse-Tracker. Lernstände bleiben auf deinem Gerät. Der Hosting-Anbieter erhält beim Laden Verbindungsdaten.</p></details></section>}
    </main><nav className="bottom-nav" aria-label="Hauptnavigation">{([{id:'home',label:'Training',icon:Zap},{id:'box',label:'Lernkasten',icon:Images},{id:'settings',label:'Einstellungen',icon:Settings}] as const).map(item=><button key={item.id} disabled={updating} aria-current={view===item.id?'page':undefined} onClick={()=>{setView(item.id);setEdit(null);setMessage('');window.scrollTo(0,0);}}><item.icon size={21}/><span>{item.label}</span></button>)}</nav></>}

    {resetOpen&&<ResetProgressDialog onClose={()=>setResetOpen(false)} onReset={async()=>{await persistence.current;await backupBeforeImport();const saved=await persist(resetLearningProgress(data));if(saved)setMessage('Lernfortschritt zurückgesetzt. Deine Inhalte bleiben erhalten.');return saved;}}/>}


  </div>;
}
