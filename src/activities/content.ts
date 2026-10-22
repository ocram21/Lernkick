import advancedWordsV2 from '../content/vocabularyAdvanced.json';
import advancedSentences from '../content/sentencesAdvanced.json';
import {proverbTasks} from './proverbs';
import {grammarTasks} from './grammar';
import {shuffle} from '../lib/engine';
import {z}from'zod';
import topicWords from '../content/vocabularyTopics.json';
import sentencePack from '../content/sentences.json';
import {vocabularyEntrySchema}from'../lib/schema';
import {levelSchema,type Activities}from'./schema';
const advancedWords=[
{id:'vocabulary.hard.ambivalent',category:'everyday',topic:'Streber',word:'ambivalent',meaning:'Zwiespältig; mit widersprüchlichen Gefühlen oder Bewertungen',distractors:['Besonders eindeutig','Völlig gleichgültig']},
{id:'vocabulary.hard.implizit',category:'everyday',topic:'Streber',word:'implizit',meaning:'Mitgemeint, ohne ausdrücklich ausgesprochen zu werden',distractors:['Wörtlich ausgesprochen','Offensichtlich falsch']},
{id:'vocabulary.hard.resilienz',category:'everyday',topic:'Streber',word:'Resilienz',meaning:'Die Fähigkeit, Belastungen zu bewältigen und sich davon zu erholen',distractors:['Die Vermeidung aller Veränderungen','Ein besonders gutes Gedächtnis']},
{id:'vocabulary.hard.diskrepanz',category:'everyday',topic:'Streber',word:'Diskrepanz',meaning:'Eine Abweichung oder ein Widerspruch zwischen zwei Dingen',distractors:['Eine vollständige Übereinstimmung','Eine zufällige Begegnung']},
{id:'vocabulary.hard.differenziert',category:'everyday',topic:'Streber',word:'differenziert',meaning:'Mit genauer Unterscheidung verschiedener Aspekte',distractors:['Ohne Einzelheiten zu beachten','Unverständlich formuliert']},
{id:'vocabulary.hard.plausibel',category:'everyday',topic:'Streber',word:'plausibel',meaning:'Nachvollziehbar und einleuchtend',distractors:['Sicher bewiesen','Grundsätzlich unmöglich']},
{id:'vocabulary.hard.antizipieren',category:'everyday',topic:'Streber',word:'antizipieren',meaning:'Eine mögliche Entwicklung gedanklich vorwegnehmen',distractors:['Eine Entwicklung rückgängig machen','Eine Entscheidung aufschieben']},
{id:'vocabulary.hard.redundant',category:'everyday',topic:'Streber',word:'redundant',meaning:'Mehrfach vorhanden oder inhaltlich überflüssig',distractors:['Besonders knapp','Noch nicht vorhanden']},
{id:'vocabulary.hard.subjektiv',category:'everyday',topic:'Streber',word:'subjektiv',meaning:'Von der persönlichen Sichtweise geprägt',distractors:['Unabhängig von jeder Person','Wissenschaftlich bewiesen']},
{id:'vocabulary.hard.konsens',category:'everyday',topic:'Streber',word:'Konsens',meaning:'Eine gemeinsame Übereinstimmung in einer Frage',distractors:['Eine verbindliche Einzelanweisung','Eine anhaltende Meinungsverschiedenheit']},
{id:'vocabulary.hard.deckungsbeitrag',category:'work',topic:'Streber',word:'Deckungsbeitrag',meaning:'Umsatzerlös abzüglich variabler Kosten; trägt zur Deckung fixer Kosten bei',distractors:['Umsatz einschließlich aller Steuern','Gewinn nach Abzug sämtlicher Kosten']},
{id:'vocabulary.hard.liquiditaet',category:'work',topic:'Streber',word:'Liquidität',meaning:'Die Fähigkeit, fällige Zahlungen rechtzeitig zu leisten',distractors:['Die Höhe des Lagerbestands','Die Anzahl abgeschlossener Aufträge']},
{id:'vocabulary.hard.gewährleistung',category:'work',topic:'Streber',word:'Gewährleistung',meaning:'Gesetzliche Rechte bei einer mangelhaften Leistung',distractors:['Eine freiwillige Zusatzleistung ohne gesetzliche Grundlage','Eine Versicherung gegen alle Schäden']},
{id:'vocabulary.hard.ergonomie',category:'work',topic:'Streber',word:'Ergonomie',meaning:'Anpassung von Arbeitsmitteln und Abläufen an den Menschen',distractors:['Maximierung der Arbeitszeit','Ausschließliche Gestaltung von Pausenräumen']},
{id:'vocabulary.hard.disposition',category:'work',topic:'Streber',word:'Disposition',meaning:'Planung und Einteilung von Personal, Material oder Aufträgen',distractors:['Abschluss einer Buchhaltung','Reinigung eines Arbeitsplatzes']},
{id:'vocabulary.hard.brutto',category:'work',topic:'Streber',word:'Bruttowertschöpfung',meaning:'Wert der produzierten Leistungen abzüglich der Vorleistungen',distractors:['Summe aller Gehaltszahlungen','Verkaufspreis einschließlich Umsatzsteuer']},
{id:'vocabulary.hard.amortisation',category:'work',topic:'Streber',word:'Amortisation',meaning:'Rückfluss einer Investitionssumme durch erwirtschaftete Überschüsse',distractors:['Erhöhung des Kaufpreises','Vollständiger Ausfall einer Maschine']},
{id:'vocabulary.hard.skonto',category:'work',topic:'Streber',word:'Skonto',meaning:'Preisnachlass bei Zahlung innerhalb einer vereinbarten kurzen Frist',distractors:['Eine zusätzliche Liefergebühr','Ein Zuschlag bei verspäteter Zahlung']},
{id:'vocabulary.hard.tarifbindung',category:'work',topic:'Streber',word:'Tarifbindung',meaning:'Verbindliche Geltung eines Tarifvertrags für die Tarifgebundenen',distractors:['Freie Wahl aller Arbeitsbedingungen ohne Regeln','Ein staatlich festgesetzter Preis']},
{id:'vocabulary.hard.gefaehrdung',category:'work',topic:'Streber',word:'Gefährdungsbeurteilung',meaning:'Systematische Ermittlung und Bewertung von Gefährdungen bei der Arbeit',distractors:['Beurteilung nur nach einem Arbeitsunfall','Eine freiwillige Befragung zur Zufriedenheit']},
] as const;
export const words=[...topicWords.entries,...advancedWords.map(w=>({...w,archived:true,distractors:[...w.distractors]})),...advancedWordsV2].map(value=>vocabularyEntrySchema.and(z.object({category:z.enum(['everyday','work']),topic:z.string(),context:z.string().optional(),explanation:z.string().optional(),archived:z.boolean().optional()})).parse(value));
export const sentenceSchema=z.object({id:z.string(),level:levelSchema,archived:z.boolean().optional(),tokens:z.array(z.string()).min(3),solutions:z.array(z.array(z.string())).min(1),instruction:z.string(),hint:z.string()});
const fixedSentences=sentencePack.tasks.map(value=>sentenceSchema.parse({...value,...(value.level==='hard'?{archived:true}:{}),instruction:value.instruction.replace(/Zähle in dieser Reihenfolge auf:/g,'Verwende in deiner Aufzählung:')}));
export type SentenceTask=z.infer<typeof sentenceSchema>;
const people=['Mia','Ali','Lena','Ben','Nora','Emil','Sara','Tim','Lea','Omar'];
const actions=[['liest','ein Buch'],['schreibt','einen Brief'],['zeichnet','ein Bild'],['plant','einen Ausflug'],['kauft','frisches Obst'],['prüft','die Rechnung'],['repariert','das Fahrrad'],['sortiert','die Unterlagen']];
const generatedSentences:SentenceTask[]=people.flatMap((person,p)=>actions.flatMap(([verb,object],a)=>['heute','morgen','am Nachmittag'].map((_time,t)=>{
 const infinitives=['lesen','schreiben','zeichnen','planen','kaufen','prüfen','reparieren','sortieren'];
 const tokens=t===0?[person,verb,'heute',object,',','weil','das','wichtig','ist','.']:t===1?['Morgen',verb,person,object,'.']:[person,'möchte',object,infinitives[a],',','bevor','der Unterricht','beginnt','.'];
 const start=t===1?'„Morgen“':'dem Namen';
 return sentenceSchema.parse({id:`sentence.generated.v1.${p}.${a}.${t}`,level:'normal',tokens,solutions:[[...tokens]],instruction:`Bilde einen Satz. Beginne mit ${start}.`,hint:t===1?'Nach der Zeitangabe folgt das Verb.':'Im Hauptsatz steht das Verb an zweiter Stelle; im Nebensatz steht es am Ende.'});
})));
export const sentences=[...fixedSentences,...generatedSentences,...advancedSentences.map(value=>sentenceSchema.parse(value))];

export const wordById=new Map(words.map(word=>[word.id,word]));
export const sentenceById=new Map(sentences.map(task=>[task.id,task]));
export function sentenceText(tokens:string[]){return tokens.join(' ').replace(/\s+([,.;:!?])/g,'$1');}
/** Only explicitly identified simple enumeration exercises permit item permutations. */
function enumeration(task:SentenceTask){
 if(!/Zähle in dieser Reihenfolge auf:|Verwende in deiner Aufzählung:/.test(task.instruction))return null;
 const items=[...task.instruction.matchAll(/„([^“]+)“/g)].map(m=>m[1]);
 const solution=task.solutions[0],and=solution.indexOf('und'),comma=solution.indexOf(',');
 if(comma<1||and<comma)return null;
 const start=comma-1,end=and+1,words=solution.slice(start,end+1).filter(t=>t!==','&&t!=='und');
 if(words.length!==3||!words.every(w=>items.includes(w)))return null;
 return{start,end,words,solution};
}
export function sentenceError(task:SentenceTask,draft:number[]):string|null{
 if(draft.length!==task.tokens.length||new Set(draft).size!==draft.length||draft.some(i=>!task.tokens[i]))return 'Verwende jeden Baustein genau einmal.';
 const tokens=draft.map(i=>task.tokens[i]);
 if(task.solutions.some(solution=>solution.length===tokens.length&&solution.every((word,i)=>word===tokens[i])))return null;
 const list=enumeration(task);
 if(list){const {start,end,words,solution}=list;
  const outside=tokens.every((t,i)=>i>=start&&i<=end||t===solution[i]);
  const segment=tokens.slice(start,end+1),actual=segment.filter(t=>t!==','&&t!=='und');
  if(outside&&actual.length===3&&words.every(w=>actual.includes(w))){
   if(segment[1]!==','||segment[3]!=='und')return 'Setze zwischen die ersten beiden Gegenstände ein Komma und vor „und“ kein Komma.';
   return null;
  }
 }
 if(task.tokens.includes('.')&&tokens.at(-1)!=='.')return 'Setze den Satzpunkt an das Ende.';
 return 'Prüfe die Satzstellung: Anfang, Verb und Satzende müssen zusammenpassen.';
}
export function checkSentence(task:SentenceTask,draft:number[]){return sentenceError(task,draft)===null;}
export function moveToken(draft:number[],id:number,target:number){if(!Number.isInteger(id)||id<0||!Number.isFinite(target))return draft;const before=draft.indexOf(id),next=draft.filter(value=>value!==id),position=Math.max(0,Math.min(next.length,target-(before>=0&&before<target?1:0)));next.splice(position,0,id);return next;}
/** Four first-check successes raise one step; two failed tasks lower one step.
 * Corrections of the same task never count as a new first-check success. */
export function adaptNormal(activity:Activities['vocabulary'],id:string,correct:boolean){
 const previous=activity.adaptive;
 if(sentenceById.get(id)?.level!=='normal'||previous.lastTask===id)return previous;
 let {tier,successes,errors}=previous;
 if(correct){successes++;errors=0;if(successes>=4){tier=Math.min(2,tier+1);successes=0;}}
 else{successes=0;errors++;if(errors>=2){tier=Math.max(0,tier-1);errors=0;}}
 return {tier,successes,errors,lastTask:id};
}
export function sentenceBand(task:SentenceTask){const commas=task.tokens.filter(t=>t===',').length;return commas>1||task.tokens.length>12?2:commas&&task.tokens.length>10?1:0;}
export function normalSentenceQueue(activity:Activities['vocabulary'],exclude:string[]=[]){
 const tier=activity.adaptive.tier;
 return shuffle(sentences.filter(s=>!s.archived&&s.level==='normal'&&sentenceBand(s)<=tier&&!exclude.includes(s.id))).sort((a,b)=>{
  const ra=activity.sentences[a.id],rb=activity.sentences[b.id];
  // Failed tasks return only when they fit the current band; no difficult repeat lock.
  const priority=(r:typeof ra)=>!r?1:r.lastCorrect?2:0;
  return Number(activity.recent.includes(a.id))-Number(activity.recent.includes(b.id))||Number(Boolean(ra&&Date.now()-ra.at<86400000))-Number(Boolean(rb&&Date.now()-rb.at<86400000))||priority(ra)-priority(rb)||Math.abs(sentenceBand(a)-tier)-Math.abs(sentenceBand(b)-tier)||(ra?.at??0)-(rb?.at??0)||Number(b.tokens.includes(','))-Number(a.tokens.includes(','))||Number(b.instruction.includes('Zähle'))-Number(a.instruction.includes('Zähle'));
 }).map(s=>s.id);
}
/** Due mistakes first, then unseen tasks; learned tasks remain available for practice. */
export function practiceQueue(activity:Activities['vocabulary'],exclude:readonly string[]=[]):string[]{
 const terms=activity.enabled.everyday||activity.enabled.work;
 const groups=[terms?words.filter(w=>!w.archived&&w.id.startsWith('vocabulary.hard.')===(activity.level==='hard')).map(w=>w.id):[],activity.enabled.sentences?(activity.level==='normal'?normalSentenceQueue(activity):sentences.filter(s=>!s.archived&&s.level==='hard').map(s=>s.id)):[],activity.enabled.grammar?grammarTasks.filter(t=>!t.archived&&t.level===activity.level).map(t=>t.id):[],activity.enabled.proverbs?proverbTasks.filter(t=>t.level===activity.level).map(t=>t.id):[]].map(group=>group.filter(id=>!exclude.includes(id))).filter(group=>group.length);
 const result=(id:string)=>activity.words[id]??activity.sentences[id]??activity.grammar[id]??activity.proverbs[id];
 const ranked=groups.map(group=>shuffle(group).sort((a,b)=>{const ra=result(a),rb=result(b);const priority=(r:typeof ra)=>!r?1:r.lastCorrect?2:0;return Number(activity.recent.includes(a))-Number(activity.recent.includes(b))||Number(Boolean(ra&&Date.now()-ra.at<86400000))-Number(Boolean(rb&&Date.now()-rb.at<86400000))||priority(ra)-priority(rb);}));
 const queue:string[]=[];for(let i=0;queue.length<10;i++){let added=false;for(const group of shuffle(ranked))if(group[i]&&queue.length<10){queue.push(group[i]);added=true;}if(!added)break;}return shuffle(queue);
}

export function optionOrder(id:string){const options=[0,1,2],seed=[...id].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,7);const start=seed%3;return [...options.slice(start),...options.slice(0,start)];}
export function stableShuffle<T>(items:T[],seedText:string):T[]{let seed=[...seedText].reduce((n,c)=>Math.imul(n^c.charCodeAt(0),16777619)>>>0,2166136261);const next=[...items];for(let i=next.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[next[i],next[j]]=[next[j],next[i]];}if(next.length>1&&next.every((item,i)=>item===items[i]))next.push(next.shift()!);return next;}
