import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import lessonData from '../content/tafelwerk/math-lessons.json';
import { formatFractions, fractionParts, renderVisual } from '../content/tafelwerk/visuals';

type Subject = 'Mathematik' | 'Geographie' | 'Sozialkunde' | 'Biologie';
type Step = { headline:string; formula:string; explanation:string; visual:any; sub?:string };
type Lesson = { id:string; category:string; stage:string; title:string; subtitle:string; symbol:string; steps:Step[] };
const categories=lessonData.categories;
const lessons=lessonData.lessons as Lesson[];
const subjects:Subject[]=['Mathematik','Geographie','Sozialkunde','Biologie'];
const stages=[{id:'5-6',label:'Klasse 5/6'},{id:'7-8',label:'Klasse 7/8'},{id:'9-10',label:'Klasse 9/10'}];
const categoryLabels:Record<string,string>={zahlen:'Zahlen',verfahren:'Rechnen',brueche:'Brüche',terme:'Terme',anwendung:'Alltag',funktionen:'Funktion',geometrie:'Geo',daten:'Daten'};
function TafelSymbol({value}:{value:string}){
 const parts=fractionParts(value);
 return parts?<span className="fraction fraction-symbol"><span className="top">{parts[0]}</span><span className="bottom">{parts[1]}</span></span>:value;
}

export function Tafelwerk(){
 const [subject,setSubject]=useState<Subject|null>(null);
 const [stage,setStage]=useState('5-6');
 const [category,setCategory]=useState<string|null>(null);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [stepIndex,setStepIndex]=useState(0);
 const current=lesson?.steps[stepIndex];

 function showSubjects(){setLesson(null);setCategory(null);setSubject(null);setStage('5-6');setStepIndex(0);}
 function showLessons(){setLesson(null);setStepIndex(0);}
 function openLesson(item:Lesson){setLesson(item);setStepIndex(0);}
 function lessonsForStage(value:string){return lessons.filter(item=>item.stage===value);}
 function categoriesForStage(value:string){const ids=new Set(lessonsForStage(value).map(item=>item.category));return categories.filter(item=>ids.has(item.id));}
 function selectSubject(item:Subject){setSubject(item);if(item==='Mathematik'){const first=lessonsForStage(stage)[0];setCategory(first?.category??null);}}
 function selectStage(value:string){setStage(value);setCategory(categoriesForStage(value)[0]?.id??null);}

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
   <div className="tafelwerk-subject-grid">{subjects.map(item=><button className="tafelwerk-subject" key={item} onClick={()=>selectSubject(item)}>{item}</button>)}</div>
  </>}

  {subject&&subject!=='Mathematik'&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>{subject}</h1></div>
   <div className="tafelwerk-empty"><span>Noch keine Tafeln</span><p>Hier können später wichtige Bilder und kurze Erklärschritte für {subject} abgelegt werden.</p></div>
  </>}

  {subject==='Mathematik'&&category&&!lesson&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>Mathematik</h1></div>
   <div className="tafelwerk-catalog">
    <div className="tafelwerk-stage-grid" aria-label="Klassenstufe">{stages.map(item=><button key={item.id} aria-pressed={stage===item.id} onClick={()=>selectStage(item.id)}>{item.label}</button>)}</div>
    <div className="tafelwerk-area-grid" aria-label="Themenbereiche">{categoriesForStage(stage).map(item=><button className="tafelwerk-area" key={item.id} aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}><span className="tafelwerk-area-symbol" aria-hidden="true"><TafelSymbol value={item.icon}/></span><span>{categoryLabels[item.id]??item.title}</span></button>)}</div>
    <div className="tafelwerk-lesson-grid" aria-label="Einzelthemen">{lessons.filter(item=>item.stage===stage&&item.category===category).map(item=><button className="tafelwerk-lesson-choice" key={item.id} onClick={()=>openLesson(item)}><span className="tafelwerk-lesson-symbol" aria-hidden="true"><TafelSymbol value={item.symbol}/></span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
   </div>
  </>}

  {lesson&&current&&<>
   <div className="tafelwerk-lesson-top"><button className="tafelwerk-back" onClick={showLessons} aria-label="Zur Themenliste"><ArrowLeft size={18}/><span>Themen</span></button><span className="tafelwerk-current-lesson" title={lesson.title}>{lesson.title}</span>{lesson.steps.length>1&&<span className="tafelwerk-step-count">{stepIndex+1} / {lesson.steps.length}</span>}</div>
   <section className="tafelwerk-board" aria-label="Mathematische Tafel" aria-live="polite">
    <div className="tafelwerk-board-head"><h1>{current.headline}</h1>{lesson.steps.length>1&&<span>{stepIndex+1}/{lesson.steps.length}</span>}</div>
    <div className="tafelwerk-board-body">
     {current.formula&&current.visual?.type!=='equation'&&!['long-multiplication','long-addition','long-division','math-stack'].includes(current.visual?.type)&&<div className={`tafelwerk-formula ${current.formula.replace(/<[^>]+>/g,'').length>28?'tafelwerk-formula-small':''}`} dangerouslySetInnerHTML={{__html:formatFractions(current.formula)}}/>}
     {current.sub&&<p className="tafelwerk-subline">{current.sub}</p>}
     {current.visual&&<div className="tafelwerk-visual" dangerouslySetInnerHTML={{__html:renderVisual(current.visual)}}/>}
    </div>
    {lesson.steps.length>1&&<div className="tafelwerk-progress" aria-label="Fortschritt durch die Lektion">{lesson.steps.map((item,index)=><button key={index} className={index===stepIndex?'current':index<stepIndex?'past':''} aria-label={`Schritt ${index+1} von ${lesson.steps.length}`} aria-current={index===stepIndex?'step':undefined} title={item.headline} onClick={()=>setStepIndex(index)}/>)}</div>}
   </section>
   <p className="tafelwerk-explanation" key={`${lesson.id}-${stepIndex}`} aria-live="polite">{current.explanation}</p>
   {lesson.steps.length>1&&<div className="tafelwerk-step-controls"><button className="small-button" disabled={stepIndex===0} onClick={()=>setStepIndex(index=>Math.max(0,index-1))}><ChevronLeft size={18}/>Zurück</button><button className="primary" onClick={()=>setStepIndex(index=>Math.min(lesson.steps.length-1,index+1))}>Weiter<ChevronRight size={18}/></button></div>}
  </>}
 </section>;
}

