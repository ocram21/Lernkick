import {LearningBoxHelp} from './LearningBoxHelp';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, Info, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import lessonData from '../content/tafelwerk/math-lessons.json';
import { formatFractions, fractionParts, renderVisual } from '../content/tafelwerk/visuals';
import { germanCategories, germanLessons, type GermanLesson } from '../content/tafelwerk/german-lessons';

type Subject = 'Mathematik' | 'Geographie' | 'Sozialkunde' | 'Biologie' | 'Deutsch';
type Step = { headline:string; formula:string; explanation:string; visual:any; sub?:string };
type Lesson = { id:string; category:string; stage:string; title:string; subtitle:string; symbol:string; steps:Step[] };
const categories=lessonData.categories;
const lessons=lessonData.lessons as Lesson[];
const subjects:{name:Subject;short:string}[]=[
 {name:'Mathematik',short:'MA'},
 {name:'Deutsch',short:'D'},
 {name:'Sozialkunde',short:'SK'},
 {name:'Biologie',short:'Bio'},
 {name:'Geographie',short:'Geo'}
];
const germanTopicLabels:Record<string,string>={'DEU-09':'Kommas setzen','DEU-10':'Großschreibung','DEU-14':'Argumentieren','DEU-15':'Texte planen und überarbeiten','DEU-18':'Zusammenfassung und Inhaltsangabe','DEU-19':'Bericht, Beschreibung, Erzählung'};
const categoryLabels:Record<string,string>={zahlen:'Zahlen',verfahren:'Rechnen',brueche:'Brüche',terme:'Terme',anwendung:'Alltag',funktionen:'Funktionen',geometrie:'Geometrie',daten:'Daten'};
function TafelSymbol({value}:{value:string}){
 const parts=fractionParts(value);
 return parts?<span className="fraction fraction-symbol"><span className="top">{parts[0]}</span><span className="bottom">{parts[1]}</span></span>:value;
}

export function Tafelwerk({initialLessonId}:{initialLessonId?:string}={}){
 const initialLesson=lessons.find(item=>item.id===initialLessonId);
 const [help,setHelp]=useState(false);
 const [reading,setReading]=useState(false);
 const [subject,setSubject]=useState<Subject>('Mathematik');
 const [category,setCategory]=useState<string|null>(initialLesson?.category??categories[0]?.id??null);
 const [lesson,setLesson]=useState<Lesson|null>(initialLesson??null);
 const [stepIndex,setStepIndex]=useState(0);
 const [germanCategory,setGermanCategory]=useState<string>(germanCategories[0].id);
 const [germanLesson,setGermanLesson]=useState<GermanLesson|null>(null);
 const current=lesson?.steps[stepIndex];
 const sectionRef=useRef<HTMLElement>(null);
 const headingRef=useRef<HTMLHeadingElement>(null);
 const lastLessonId=useRef<string|null>(null);

 function showLessons(){setGermanLesson(null);setLesson(null);setStepIndex(0);}
 function openLesson(item:Lesson){
  lastLessonId.current=item.id;
  setLesson(item);
  setStepIndex(0);
 }
 function selectSubject(item:Subject){
  if(item!==subject)lastLessonId.current=null;
  setGermanLesson(null);setLesson(null);setStepIndex(0);setSubject(item);
  if(item==='Mathematik'&&!category)setCategory(categories[0]?.id??null);
 }


 useEffect(()=>{
  if(lesson||germanLesson)headingRef.current?.focus();
  else if(lastLessonId.current){
   sectionRef.current?.querySelector<HTMLButtonElement>(`[data-lesson="${lastLessonId.current}"]`)?.focus();
   lastLessonId.current=null;
  }
 },[lesson,germanLesson]);

 useEffect(()=>{
  if(lesson)sectionRef.current?.querySelector('.tafelwerk-detail')?.scrollTo(0,0);
 },[lesson,stepIndex]);

 return <><section ref={sectionRef} className={`tafelwerk ${reading?'tafelwerk-reading':''}`} aria-label="Tafelwerk" onKeyDown={event=>{
  if(!lesson||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();
   setStepIndex(index=>Math.max(0,Math.min(lesson.steps.length-1,index+(event.key==='ArrowRight'?1:-1))));
  }
 }}>
  <div className="tafelwerk-intro"><span className="section-marker box-section-marker" aria-label="Bereich: Tafelwerk"><BookOpen size={23}/></span>{(lesson||germanLesson)&&<button className="tafelwerk-topic-return" onClick={showLessons}><ChevronLeft size={16}/>Themen</button>}<button className="box-help tafelwerk-reading-toggle" aria-label="Große Leseansicht" aria-pressed={reading} title="Große Leseansicht" onClick={()=>setReading(!reading)}><ZoomIn size={20}/></button><button className="box-help" aria-label="Tafelwerk-Hilfe" title="So nutzt du das Tafelwerk" onClick={()=>setHelp(true)}><Info size={20}/></button></div>
   <div className="box-subjects tafelwerk-subject-grid" aria-label="Fach wählen">{subjects.map(({name,short})=><button className="calculator-key subject-key" key={name} data-subject={name} aria-label={name} title={name==='Mathematik'||name==='Deutsch'?name:`${name}: noch keine Tafeln`} aria-pressed={subject===name} onClick={()=>selectSubject(name)}><span className="key-name">{short}</span></button>)}</div>

  {subject&&subject!=='Mathematik'&&subject!=='Deutsch'&&<>
   <div className="tafelwerk-heading"><h1>{subject}</h1></div>
   <div className="tafelwerk-empty"><span>Noch keine Tafeln</span><p>Für {subject} stehen noch keine Nachschlagetafeln bereit. In Mathematik und Deutsch findest du Regeln und Beispiele.</p></div>
  </>}

  {subject==='Deutsch'&&!germanLesson&&<>
   <div className="tafelwerk-catalog">
    <div className="tafelwerk-area-grid deutsch-area-grid" aria-label="Deutschbereiche">{germanCategories.map(item=><button className="tafelwerk-area" key={item.id} aria-label={item.title} aria-pressed={germanCategory===item.id} onClick={()=>setGermanCategory(item.id)}><span>{item.title}</span></button>)}</div>
    <div className="tafelwerk-lesson-grid deutsch-topic-grid" aria-label="Deutschthemen">{germanLessons.filter(item=>item.category===germanCategory).map(item=><button className="tafelwerk-lesson-choice" data-lesson={item.id} aria-label={item.title} key={item.id} onClick={()=>{lastLessonId.current=item.id;setGermanLesson(item);}}><span>{germanTopicLabels[item.id]??item.title}</span></button>)}</div>
   </div>
  </>}

  {subject==='Deutsch'&&germanLesson&&<>
   <section className="deutsch-reference-page" aria-labelledby={`${germanLesson.id}-title`}>
    <header className="deutsch-sheet-head"><h1 ref={headingRef} tabIndex={-1} id={`${germanLesson.id}-title`}>{germanLesson.title}</h1></header>
    <p className="deutsch-goal">{germanLesson.goal}</p>
    <div className="deutsch-reference-list">{germanLesson.items.map(part=><article className="deutsch-reference-item" key={part.term}>
     <h2>{part.term}</h2><p>{part.example}{part.note&&<small> · {part.note}</small>}</p>
    </article>)}</div>
   </section>
  </>}

  {subject==='Mathematik'&&!lesson&&<>
   <div className="tafelwerk-catalog">
    <div className="tafelwerk-area-grid" aria-label="Themenbereiche">{categories.map(item=><button className="tafelwerk-area" key={item.id} aria-label={item.title} aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}><span className="tafelwerk-area-symbol" aria-hidden="true"><TafelSymbol value={item.icon}/></span><span>{categoryLabels[item.id]??item.title}</span></button>)}</div>
    <div className="tafelwerk-lesson-grid" aria-label="Einzelthemen">{lessons.filter(item=>item.category===category).map(item=><button className="tafelwerk-lesson-choice" data-lesson={item.id} key={item.id} onClick={()=>openLesson(item)}><span className="tafelwerk-lesson-symbol" aria-hidden="true"><TafelSymbol value={item.symbol}/></span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
   </div>
  </>}

  {lesson&&current&&<>
   <div className="tafelwerk-detail">
   <section className="tafelwerk-board" aria-label="Mathematische Tafel" aria-live="polite">
    <div className="tafelwerk-board-head"><h1 ref={headingRef} tabIndex={-1}>{current.headline}</h1>{lesson.steps.length>1&&<span className="tafelwerk-step-count">{stepIndex+1} / {lesson.steps.length}</span>}</div>
   <div className="tafelwerk-board-body">
     {current.formula&&current.visual?.type!=='equation'&&!['long-multiplication','long-multiplication-grid','long-division-grid','long-addition','math-stack'].includes(current.visual?.type)&&<div className={`tafelwerk-formula ${current.formula.replace(/<[^>]+>/g,'').length>28?'tafelwerk-formula-small':''}`} dangerouslySetInnerHTML={{__html:formatFractions(current.formula)}}/>}
     {current.sub&&<p className="tafelwerk-subline">{current.sub}</p>}
     {current.visual&&<div className="tafelwerk-visual" dangerouslySetInnerHTML={{__html:renderVisual(current.visual)}}/>}
    </div>
    {lesson.steps.length>1&&<div className="tafelwerk-progress" aria-label="Fortschritt durch die Lektion">{lesson.steps.map((item,index)=><button key={index} className={index===stepIndex?'current':index<stepIndex?'past':''} aria-label={`Schritt ${index+1} von ${lesson.steps.length}`} aria-current={index===stepIndex?'step':undefined} title={item.headline} onClick={()=>setStepIndex(index)}/>)}</div>}
   </section>
   <p className="tafelwerk-explanation" key={`${lesson.id}-${stepIndex}`} aria-live="polite">{current.explanation}</p>
   {lesson.steps.length>1&&<div className="tafelwerk-step-controls"><button className="small-button" disabled={stepIndex===0} onClick={()=>setStepIndex(index=>Math.max(0,index-1))}><ChevronLeft size={18}/>Zurück</button><button className="primary" onClick={()=>stepIndex===lesson.steps.length-1?showLessons():setStepIndex(index=>index+1)}>{stepIndex===lesson.steps.length-1?'Zur Themenliste':'Weiter'}<ChevronRight size={18}/></button></div>}
   </div>
  </>}
 </section>{help&&<LearningBoxHelp onClose={()=>setHelp(false)} title="Das Tafelwerk" label="Tafelwerk-Hilfe schließen" paragraphs={['Wähle oben ein Fach und darunter eine Rubrik. Ein Themenbutton öffnet die zugehörige Nachschlagetafel.','Die Fächer bleiben sichtbar. Tippe erneut auf das aktuelle Fach, um zur Themenauswahl zurückzukehren. Ein anderes Fach wechselst du direkt an.','Die Tafeln erklären Regeln und Beispiele ohne Aufgaben oder Bewertung. Sie verändern deinen Lernstand nicht und sind auch offline verfügbar.']}/>}</>;
}

