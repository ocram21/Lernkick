import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import lessonData from '../content/tafelwerk/math-lessons.json';
import { renderVisual } from '../content/tafelwerk/visuals';

type Subject = 'Mathematik' | 'Geographie' | 'Sozialkunde' | 'Biologie';
type Step = { headline:string; formula:string; explanation:string; visual:any; sub?:string };
type Lesson = { id:string; category:string; title:string; subtitle:string; symbol:string; steps:Step[] };
const categories=lessonData.categories;
const lessons=lessonData.lessons as Lesson[];
const subjects:Subject[]=['Mathematik','Geographie','Sozialkunde','Biologie'];

export function Tafelwerk(){
 const [subject,setSubject]=useState<Subject|null>(null);
 const [category,setCategory]=useState<string|null>(null);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [stepIndex,setStepIndex]=useState(0);
 const current=lesson?.steps[stepIndex];

 function showSubjects(){setLesson(null);setCategory(null);setSubject(null);setStepIndex(0);}
 function showCategories(){setLesson(null);setCategory(null);setStepIndex(0);}
 function showLessons(){setLesson(null);setStepIndex(0);}
 function openLesson(item:Lesson){setLesson(item);setStepIndex(0);}

 useEffect(()=>{
  if(!lesson)return;
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='ArrowLeft')setStepIndex(index=>Math.max(0,index-1));
   if(event.key==='ArrowRight')setStepIndex(index=>Math.min(lesson.steps.length-1,index+1));
  };
  window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
 },[lesson]);

 return <section className="tafelwerk" aria-label="Tafelwerk">
  {!subject&&<>
   <div className="tafelwerk-intro"><BookOpen size={22}/><h1>Tafelwerk</h1></div>
   <p className="tafelwerk-prompt">Wähle ein Fach.</p>
   <div className="tafelwerk-subject-grid">{subjects.map(item=><button className="tafelwerk-subject" key={item} onClick={()=>setSubject(item)}>{item}</button>)}</div>
  </>}

  {subject==='Mathematik'&&!category&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>Mathematik</h1></div>
   <p className="tafelwerk-prompt">Wähle einen Bereich.</p>
   <div className="tafelwerk-area-grid">{categories.map(item=>{const count=lessons.filter(l=>l.category===item.id).length;return <button className="tafelwerk-area" key={item.id} onClick={()=>setCategory(item.id)}><span className="tafelwerk-area-symbol" aria-hidden="true">{item.icon}</span><span>{item.title}</span><small>{count}</small></button>;})}</div>
  </>}

  {subject&&subject!=='Mathematik'&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>{subject}</h1></div>
   <div className="tafelwerk-empty"><span>Noch keine Tafeln</span><p>Hier können später wichtige Bilder und kurze Erklärschritte für {subject} abgelegt werden.</p></div>
  </>}

  {subject==='Mathematik'&&category&&!lesson&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showCategories} aria-label="Zur Bereichsauswahl"><ArrowLeft size={18}/><span>Bereiche</span></button><h1>{categories.find(item=>item.id===category)?.title}</h1></div>
   <div className="tafelwerk-lesson-grid">{lessons.filter(item=>item.category===category).map(item=><button className="tafelwerk-lesson-choice" key={item.id} onClick={()=>openLesson(item)}><span className="tafelwerk-lesson-symbol" aria-hidden="true">{item.symbol}</span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
  </>}

  {lesson&&current&&<>
   <div className="tafelwerk-lesson-top"><button className="tafelwerk-back" onClick={showLessons} aria-label="Zur Themenliste"><ArrowLeft size={18}/><span>Themen</span></button><span className="tafelwerk-current-lesson" title={lesson.title}>{lesson.title}</span><span className="tafelwerk-step-count">{stepIndex+1} / {lesson.steps.length}</span></div>
   <section className="tafelwerk-board" aria-label="Mathematische Tafel" aria-live="polite">
    <div className="tafelwerk-board-head"><h1>{current.headline}</h1><span>{stepIndex+1}/{lesson.steps.length}</span></div>
    <div className="tafelwerk-board-body">
     {current.visual?.type!=='equation'&&!['long-multiplication','long-addition'].includes(current.visual?.type)&&<div className={`tafelwerk-formula ${current.formula.replace(/<[^>]+>/g,'').length>28?'tafelwerk-formula-small':''}`} dangerouslySetInnerHTML={{__html:current.formula}}/>}
     {current.sub&&<p className="tafelwerk-subline">{current.sub}</p>}
     {current.visual&&<div className="tafelwerk-visual" dangerouslySetInnerHTML={{__html:renderVisual(current.visual)}}/>}
    </div>
    <div className="tafelwerk-progress" aria-label="Fortschritt durch die Lektion">{lesson.steps.map((item,index)=><button key={index} className={index===stepIndex?'current':index<stepIndex?'past':''} aria-label={`Schritt ${index+1} von ${lesson.steps.length}`} aria-current={index===stepIndex?'step':undefined} title={item.headline} onClick={()=>setStepIndex(index)}/>)}</div>
   </section>
   <p className="tafelwerk-explanation" key={`${lesson.id}-${stepIndex}`} aria-live="polite">{current.explanation}</p>
   <div className="tafelwerk-step-controls"><button className="small-button" disabled={stepIndex===0} onClick={()=>setStepIndex(index=>Math.max(0,index-1))}><ChevronLeft size={18}/>Zurück</button><button className="primary" onClick={()=>setStepIndex(index=>index===lesson.steps.length-1?0:index+1)}>{stepIndex===lesson.steps.length-1?'Von vorn':'Weiter'}<ChevronRight size={18}/></button></div>
  </>}
 </section>;
}

