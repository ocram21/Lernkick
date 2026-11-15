import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Compass, Globe2, Landmark, TreeDeciduous } from 'lucide-react';
import lessonData from '../content/tafelwerk/math-lessons.json';
import { formatFractions, fractionParts, renderVisual } from '../content/tafelwerk/visuals';

type Subject = 'Mathematik' | 'Geographie' | 'Sozialkunde' | 'Biologie' | 'Deutsch';
type Step = { headline:string; formula:string; explanation:string; visual:any; sub?:string };
type Lesson = { id:string; category:string; stage:string; title:string; subtitle:string; symbol:string; steps:Step[] };
const categories=lessonData.categories;
const lessons=lessonData.lessons as Lesson[];
const subjects:{name:Subject;icon:typeof Compass}[]=[
 {name:'Mathematik',icon:Compass},
 {name:'Geographie',icon:Globe2},
 {name:'Sozialkunde',icon:Landmark},
 {name:'Biologie',icon:TreeDeciduous},
 {name:'Deutsch',icon:BookOpen}
];
const categoryLabels:Record<string,string>={zahlen:'Zahlen',verfahren:'Rechnen',brueche:'Brüche',terme:'Terme',anwendung:'Alltag',funktionen:'Funktionen',geometrie:'Geometrie',daten:'Daten'};
function TafelSymbol({value}:{value:string}){
 const parts=fractionParts(value);
 return parts?<span className="fraction fraction-symbol"><span className="top">{parts[0]}</span><span className="bottom">{parts[1]}</span></span>:value;
}

export function Tafelwerk(){
 const [subject,setSubject]=useState<Subject|null>(null);
 const [category,setCategory]=useState<string|null>(null);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [stepIndex,setStepIndex]=useState(0);
 const current=lesson?.steps[stepIndex];
 const sectionRef=useRef<HTMLElement>(null);
 const headingRef=useRef<HTMLHeadingElement>(null);
 const lastLessonId=useRef<string|null>(null);

 function showSubjects(){setLesson(null);setCategory(null);setSubject(null);setStepIndex(0);}
 function showLessons(){setLesson(null);setStepIndex(0);}
 function openLesson(item:Lesson){lastLessonId.current=item.id;setLesson(item);setStepIndex(0);}
 function selectSubject(item:Subject){setSubject(item);if(item==='Mathematik'){setCategory(categories[0]?.id??null);}}

 useEffect(()=>{
  if(lesson)headingRef.current?.focus();
  else if(lastLessonId.current){
   sectionRef.current?.querySelector<HTMLButtonElement>(`[data-lesson="${lastLessonId.current}"]`)?.focus();
   lastLessonId.current=null;
  }
 },[lesson]);

 useEffect(()=>{
  if(lesson&&sectionRef.current)sectionRef.current.scrollTop=0;
 },[lesson,stepIndex]);

 return <section ref={sectionRef} className="tafelwerk" aria-label="Tafelwerk" onKeyDown={event=>{
  if(!lesson||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();
   setStepIndex(index=>Math.max(0,Math.min(lesson.steps.length-1,index+(event.key==='ArrowRight'?1:-1))));
  }
 }}>
  <div className="tafelwerk-intro section-marker" aria-label="Bereich: Tafelwerk"><BookOpen size={23}/></div>
  {!subject&&<>
   <p className="tafelwerk-prompt">Wähle ein Fach.</p>
   <div className="tafelwerk-subject-grid">{subjects.map(({name,icon:Icon})=><button className="tafelwerk-subject" key={name} data-subject={name} onClick={()=>selectSubject(name)}><Icon className="tafelwerk-subject-icon" size={26} strokeWidth={1.7} aria-hidden="true"/><span>{name}</span></button>)}</div>
  </>}

  {subject&&subject!=='Mathematik'&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>{subject}</h1></div>
   <div className="tafelwerk-empty"><span>Noch keine Tafeln</span><p>Hier können später wichtige Bilder und kurze Erklärschritte für {subject} abgelegt werden.</p></div>
  </>}

  {subject==='Mathematik'&&!lesson&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>Mathematik</h1></div>
   <div className="tafelwerk-catalog">
    <div className="tafelwerk-area-grid" aria-label="Themenbereiche">{categories.map(item=><button className="tafelwerk-area" key={item.id} aria-label={item.title} aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}><span className="tafelwerk-area-symbol" aria-hidden="true"><TafelSymbol value={item.icon}/></span><span>{categoryLabels[item.id]??item.title}</span></button>)}</div>
    <div className="tafelwerk-lesson-grid" aria-label="Einzelthemen">{lessons.filter(item=>item.category===category).map(item=><button className="tafelwerk-lesson-choice" data-lesson={item.id} key={item.id} onClick={()=>openLesson(item)}><span className="tafelwerk-lesson-symbol" aria-hidden="true"><TafelSymbol value={item.symbol}/></span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
   </div>
  </>}

  {lesson&&current&&<>
   <div className="tafelwerk-lesson-top"><button className="tafelwerk-back" onClick={showLessons} aria-label="Zur Themenliste"><ArrowLeft size={18}/><span>Themen</span></button><span className="tafelwerk-current-lesson" title={lesson.title}>{lesson.title}</span>{lesson.steps.length>1&&<span className="tafelwerk-step-count">{stepIndex+1} / {lesson.steps.length}</span>}</div>
   <section className="tafelwerk-board" aria-label="Mathematische Tafel" aria-live="polite">
    <div className="tafelwerk-board-head"><h1 ref={headingRef} tabIndex={-1}>{current.headline}</h1>{lesson.steps.length>1&&<span>{stepIndex+1}/{lesson.steps.length}</span>}</div>
    <div className="tafelwerk-board-body">
     {current.formula&&current.visual?.type!=='equation'&&!['long-multiplication','long-addition','math-stack'].includes(current.visual?.type)&&<div className={`tafelwerk-formula ${current.formula.replace(/<[^>]+>/g,'').length>28?'tafelwerk-formula-small':''}`} dangerouslySetInnerHTML={{__html:formatFractions(current.formula)}}/>}
     {current.sub&&<p className="tafelwerk-subline">{current.sub}</p>}
     {current.visual&&<div className="tafelwerk-visual" dangerouslySetInnerHTML={{__html:renderVisual(current.visual)}}/>}
    </div>
    {lesson.steps.length>1&&<div className="tafelwerk-progress" aria-label="Fortschritt durch die Lektion">{lesson.steps.map((item,index)=><button key={index} className={index===stepIndex?'current':index<stepIndex?'past':''} aria-label={`Schritt ${index+1} von ${lesson.steps.length}`} aria-current={index===stepIndex?'step':undefined} title={item.headline} onClick={()=>setStepIndex(index)}/>)}</div>}
   </section>
   <p className="tafelwerk-explanation" key={`${lesson.id}-${stepIndex}`} aria-live="polite">{current.explanation}</p>
   {lesson.steps.length>1&&<div className="tafelwerk-step-controls"><button className="small-button" disabled={stepIndex===0} onClick={()=>setStepIndex(index=>Math.max(0,index-1))}><ChevronLeft size={18}/>Zurück</button><button className="primary" onClick={()=>stepIndex===lesson.steps.length-1?showLessons():setStepIndex(index=>index+1)}>{stepIndex===lesson.steps.length-1?'Zur Themenliste':'Weiter'}<ChevronRight size={18}/></button></div>}
  </>}
 </section>;
}

