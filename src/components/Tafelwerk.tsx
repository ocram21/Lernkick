import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Compass, Globe2, Landmark, TreeDeciduous } from 'lucide-react';
import lessonData from '../content/tafelwerk/math-lessons.json';
import { formatFractions, fractionParts, renderVisual } from '../content/tafelwerk/visuals';
import { germanCategories, germanLessons, type GermanLesson } from '../content/tafelwerk/german-lessons';

type Subject = 'Mathematik' | 'Geographie' | 'Sozialkunde' | 'Biologie' | 'Deutsch';
type Step = { headline:string; formula:string; explanation:string; visual:any; sub?:string };
type ArithmeticExample = { top?:string; bottom?:string; dividend?:string; divisor?:string; label:string };
type Lesson = { id:string; category:string; stage:string; title:string; subtitle:string; symbol:string; steps:Step[]; calculationKind?:'multiplication'|'division'; calculationExamples?:ArithmeticExample[]; selectedCalculationExample?:ArithmeticExample };
type GermanMode = 'labeled' | 'numbered' | 'blank';
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

function DeutschTafel({item,onBack}:{item:GermanLesson;onBack:()=>void}){
 const isReference=item.category!=='Sprachlehre';
 const [mode,setMode]=useState<GermanMode>('labeled');
 const [showAnswer,setShowAnswer]=useState(false);
 useEffect(()=>{setMode('labeled');setShowAnswer(false);},[item.id]);
 const modeLabels:Record<GermanMode,string>={labeled:'Beschriftet',numbered:'Nummeriert',blank:'Ohne Begriffe'};
 return <>
  <div className="tafelwerk-lesson-top"><button className="tafelwerk-back" onClick={onBack} aria-label="Zur Themenliste"><ArrowLeft size={18}/><span>Themen</span></button><span className="tafelwerk-current-lesson" title={item.title}>{item.id} · Priorität {item.priority}</span></div>
  <section className="deutsch-sheet" aria-label={`Deutschtafel: ${item.title}`}>
   <header className="deutsch-sheet-head"><h1>{item.title}</h1><span>{item.grade}</span></header>
   {isReference? <>
    <p className="deutsch-goal"><strong>Kernwissen:</strong> {item.goal}</p>
    <div className="deutsch-reference-list" aria-label={`Nachschlageübersicht: ${item.title}`}>
     {item.items.map(part=><article className="deutsch-reference-item" key={`${item.id}-${part.term}`}>
      <h2>{part.term}</h2><p>{part.example}</p>{part.note&&<small>{part.note}</small>}
     </article>)}
    </div>
   </> : <>
    <p className="deutsch-goal"><strong>Lernziel:</strong> {item.goal}</p>
    <p className="deutsch-question"><strong>Prüfe dich:</strong> {item.question}</p>
    <div className="deutsch-mode" role="group" aria-label="Lernstand der Tafel">{(Object.keys(modeLabels) as GermanMode[]).map(value=><button key={value} aria-pressed={mode===value} onClick={()=>setMode(value)}>{modeLabels[value]}</button>)}</div>
    <div className="deutsch-diagram" data-count={item.items.length} aria-label={`${modeLabels[mode]}: ${item.title}`}>
     {item.items.map((part,index)=><article className={`deutsch-tile mode-${mode}`} key={`${item.id}-${index}`}>
       <span className="deutsch-marker" aria-hidden="true">{mode==='blank'?'':index+1}</span>
       <div className="deutsch-tile-copy">{mode==='labeled'&&<strong>{part.term}</strong>}<span>{part.example}</span>{part.note&&<small>{part.note}</small>}</div>
     </article>)}
    </div>
    <button className="deutsch-answer-toggle" aria-expanded={showAnswer} onClick={()=>setShowAnswer(value=>!value)}>{showAnswer?'Lösung ausblenden':'Lösung anzeigen'}<ChevronRight size={16}/></button>
    {showAnswer&&<div className="deutsch-answer"><strong>Auflösung</strong><p>{item.answer}</p><ol>{item.items.map(part=><li key={part.term}>{part.term}</li>)}</ol></div>}
   </>}
   <footer className="deutsch-source">Niveau {item.grade} · HSA-Bezug: Fachlehrplan Deutsch Sekundarschule Sachsen-Anhalt, Abschnitt 3.3 · Priorität {item.priority} ist redaktionell.</footer>
  </section>
 </>;
}

export function Tafelwerk(){
 const [subject,setSubject]=useState<Subject|null>(null);
 const [category,setCategory]=useState<string|null>(null);
 const [lesson,setLesson]=useState<Lesson|null>(null);
 const [stepIndex,setStepIndex]=useState(0);
 const [germanCategory,setGermanCategory]=useState<string>(germanCategories[0]);
 const [germanLesson,setGermanLesson]=useState<GermanLesson|null>(null);
 const current=lesson?.steps[stepIndex];
 const sectionRef=useRef<HTMLElement>(null);
 const headingRef=useRef<HTMLHeadingElement>(null);
 const lastLessonId=useRef<string|null>(null);

 function showSubjects(){setLesson(null);setGermanLesson(null);setCategory(null);setSubject(null);setStepIndex(0);}
 function showLessons(){setLesson(null);setGermanLesson(null);setStepIndex(0);}
 async function openLesson(item:Lesson,example?:ArithmeticExample){
  lastLessonId.current=item.id;
  if(item.id==='schriftlich-mal'||item.id==='schriftlich-geteilt'){
   const {buildLongArithmeticSteps}=await import('../content/tafelwerk/long-arithmetic');
   const kind=item.id==='schriftlich-mal'?'multiplication':'division';
   const configured=(item.calculationExamples??(item.steps[0]?.visual?.examples as ArithmeticExample[]|undefined));
   const fallback=item.steps[0]?.visual;
   const examples=configured?.length?configured:[kind==='multiplication'?{top:fallback?.top??'24',bottom:fallback?.bottom??'13',label:`${fallback?.top??'24'} × ${fallback?.bottom??'13'}`}:{dividend:fallback?.dividend??'156',divisor:fallback?.divisor??'12',label:`${fallback?.dividend??'156'} : ${fallback?.divisor??'12'}`}];
   const selected=example??item.selectedCalculationExample??examples[0];
   const first=kind==='multiplication'?selected.top!:selected.dividend!;
   const second=kind==='multiplication'?selected.bottom!:selected.divisor!;
   setLesson({...item,calculationKind:kind,calculationExamples:examples,selectedCalculationExample:selected,steps:buildLongArithmeticSteps(kind,first,second)});
  }else setLesson(item);
  setStepIndex(0);
 }
 function selectSubject(item:Subject){setSubject(item);setGermanLesson(null);if(item==='Mathematik'){setCategory(categories[0]?.id??null);}if(item==='Deutsch')setGermanCategory(germanCategories[0]);}

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

  {subject&&subject!=='Mathematik'&&subject!=='Deutsch'&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>{subject}</h1></div>
   <div className="tafelwerk-empty"><span>Noch keine Tafeln</span><p>Hier können später wichtige Bilder und kurze Erklärschritte für {subject} abgelegt werden.</p></div>
  </>}

  {subject==='Deutsch'&&!germanLesson&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>Deutsch</h1></div>
   <div className="tafelwerk-catalog deutsch-catalog">
    <div className="deutsch-category-grid" aria-label="Themenbereiche">{germanCategories.map(item=><button key={item} aria-pressed={germanCategory===item} onClick={()=>setGermanCategory(item)}>{item}</button>)}</div>
    <div className="tafelwerk-lesson-grid" aria-label="Deutschthemen">{germanLessons.filter(item=>item.category===germanCategory).map(item=><button className="tafelwerk-lesson-choice" data-lesson={item.id} key={item.id} onClick={()=>{lastLessonId.current=item.id;setGermanLesson(item);}}><span className="tafelwerk-lesson-symbol deutsch-priority" aria-label={`Priorität ${item.priority}`}>{item.priority}</span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
    <p className="deutsch-catalog-note">HSA-Schwerpunkt bis Jahrgang 9 · A zuerst, B ergänzend</p>
   </div>
  </>}

  {subject==='Deutsch'&&germanLesson&&<DeutschTafel item={germanLesson} onBack={showLessons}/>}

  {subject==='Mathematik'&&!lesson&&<>
   <div className="tafelwerk-heading"><button className="tafelwerk-back" onClick={showSubjects} aria-label="Zur Fächerauswahl"><ArrowLeft size={18}/><span>Fächer</span></button><h1>Mathematik</h1></div>
   <div className="tafelwerk-catalog">
    <div className="tafelwerk-area-grid" aria-label="Themenbereiche">{categories.map(item=><button className="tafelwerk-area" key={item.id} aria-label={item.title} aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}><span className="tafelwerk-area-symbol" aria-hidden="true"><TafelSymbol value={item.icon}/></span><span>{categoryLabels[item.id]??item.title}</span></button>)}</div>
    <div className="tafelwerk-lesson-grid" aria-label="Einzelthemen">{lessons.filter(item=>item.category===category).map(item=><button className="tafelwerk-lesson-choice" data-lesson={item.id} key={item.id} onClick={()=>openLesson(item)}><span className="tafelwerk-lesson-symbol" aria-hidden="true"><TafelSymbol value={item.symbol}/></span><span>{item.title}</span><ChevronRight size={18}/></button>)}</div>
   </div>
  </>}

  {lesson&&current&&<>
   <div className="tafelwerk-lesson-top"><button className="tafelwerk-back" onClick={showLessons} aria-label="Zur Themenliste"><ArrowLeft size={18}/><span>Themen</span></button><span className="tafelwerk-current-lesson" title={lesson.title}>{lesson.title}</span>{lesson.steps.length>1&&<span className="tafelwerk-step-count">{stepIndex+1} / {lesson.steps.length}</span>}</div>
   {lesson.calculationExamples&&<div className="tafelwerk-example-choices" role="group" aria-label="Rechenbeispiel auswählen">{lesson.calculationExamples.map((example,index)=><button key={`${example.label}-${index}`} aria-pressed={lesson.selectedCalculationExample===example||lesson.selectedCalculationExample?.label===example.label} onClick={()=>openLesson(lesson,example)}>{example.label}</button>)}</div>}
   <section className="tafelwerk-board" aria-label="Mathematische Tafel" aria-live="polite">
    <div className="tafelwerk-board-head"><h1 ref={headingRef} tabIndex={-1}>{current.headline}</h1>{lesson.steps.length>1&&<span>{stepIndex+1}/{lesson.steps.length}</span>}</div>
   <div className="tafelwerk-board-body" tabIndex={lesson.calculationKind?0:undefined} aria-label={lesson.calculationKind?'Scrollbares schriftliches Rechenfeld':''}>
     {current.formula&&current.visual?.type!=='equation'&&!['long-multiplication','long-multiplication-grid','long-division-grid','long-addition','math-stack'].includes(current.visual?.type)&&<div className={`tafelwerk-formula ${current.formula.replace(/<[^>]+>/g,'').length>28?'tafelwerk-formula-small':''}`} dangerouslySetInnerHTML={{__html:formatFractions(current.formula)}}/>}
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

