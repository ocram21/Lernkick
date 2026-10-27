import {cardDue,cardIntervals,cardDayStart,compareCardDifficulty} from './schedule';
import {learningDay} from '../learning/journey';
import complexCards from '../content/complexCards.json' with {type:'json'};
import {visibleRubric} from './topics';
import {shuffle} from '../lib/engine';
import catalog from '../content/standardCards.json' with {type:'json'};
import words from '../content/vocabulary.json' with {type:'json'};
import { cardSchema, vocabularyEntrySchema, type Card, type Subject, type UserData, type VocabularyEntry, type Question } from '../lib/schema';
export const standardCards:Card[]=[...catalog.cards,...complexCards].map(card=>cardSchema.parse({...card,rubric:legacyCardRubric(card)}));
function legacyCardRubric(card:{id:string;subject:string;rubric:string;front:string}){
 if(card.id.startsWith('standard.complex.'))return card.rubric;
 if(card.subject==='biology'&&/Reflex|Nervenzelle/.test(card.front))return 'bio-senses';
 if(card.subject==='biology'&&/Gewebe|Chloroplasten|Virus|Bakterium|Antibiotika/.test(card.front))return 'bio-cells';
 if(card.subject==='social'&&/Medienkompetenz|Datenschutz|Meinungsfreiheit/.test(card.front))return 'soc-media';
 if(card.subject==='geography'&&/Landeshauptstadt|Ballungsraum|ländlicher Raum|Großlandschaft/.test(card.front))return 'geo-germany';
 return visibleRubric(card.subject as Subject,card.rubric);
}
export const standardVocabulary:VocabularyEntry[]=words.entries.map(entry=>vocabularyEntrySchema.parse(entry));
const defaultIds=new Set(standardCards.map(card=>card.id));
const vocabularyIds=new Set(standardVocabulary.map(entry=>entry.id));
export const isStandardCard=(id:string)=>defaultIds.has(id);
export const isStandardWord=(id:string)=>vocabularyIds.has(id);
export function personalCards(data:UserData,subject?:Subject):Card[] {
  return [...standardCards,...data.cards.filter(card=>!isStandardCard(card.id))].filter(card=>!subject||card.subject===subject);
}
export function savePersonalCard(data:UserData,card:Card):UserData {
  const parsed=cardSchema.parse(card);
  if(isStandardCard(parsed.id))return data;
  return {...data,cardSession:data.cardSession?.cards.some(c=>c.id===parsed.id)?null:data.cardSession,cards:[...data.cards.filter(c=>c.id!==parsed.id),parsed]};
}
export function deletePersonalCard(data:UserData,id:string):UserData {
  return isStandardCard(id)?data:{...data,cardSession:data.cardSession?.cards.some(c=>c.id===id)?null:data.cardSession,cards:data.cards.filter(card=>card.id!==id)};
}
export const restoreStandardCards=(data:UserData):UserData=>({...data,study:{...data.study,hiddenDefaults:[]}});
export function cardQueue(data:UserData,cards:Card[],now=Date.now()):Card[] {
  return shuffle(cards.filter(card=>cardDue(data.study.reviews[card.id],now))).sort((a,b)=>{const priority=(card:Card)=>{const review=data.study.reviews[card.id];return !review?0:cardDue(review,now)?-1:1;};return priority(a)-priority(b)||(data.study.reviews[a.id]&&data.study.reviews[b.id]?compareCardDifficulty(data.study.reviews[a.id],data.study.reviews[b.id]):0)||(data.study.reviews[a.id]?.due??0)-(data.study.reviews[b.id]?.due??0);}).slice(0,10);
}
export function extraCardQueue(data:UserData,cards:Card[]):Card[]{return shuffle(cards.filter(c=>(data.study.reviews[c.id]?.attempts??0)>0)).sort((a,b)=>compareCardDifficulty(data.study.reviews[a.id],data.study.reviews[b.id])).slice(0,10);}
export function rateCard(data:UserData,id:string,known:boolean,now=Date.now(),extra=false):UserData {
  if(extra)return data;
  const old=data.study.reviews[id]??{box:0,due:0,attempts:0,known:0,lastRated:0};
  const today=learningDay(now),first=old.attempts===0,sameDay=!first&&learningDay(old.lastRated)===today;
  const box=known?(first||old.box===0?1:sameDay||!cardDue(old,now)?old.box:Math.min(5,old.box+1)):0;
  const retries=known?0:Math.min(3,(old.retryDay===today?(old.retries??0):0)+1);
  // Existing deadlines change only on a regular rating. Three failed ratings in one day end short retries.
  const due=!known?(retries===3?cardDayStart(today+1):now+600_000):!first&&old.box>0&&(sameDay||!cardDue(old,now))?old.due:cardDayStart(today+cardIntervals[box]);
  return {...data,study:{...data.study,reviews:{...data.study.reviews,[id]:{box,due,attempts:old.attempts+1,known:old.known+Number(known),lastRated:now,retryDay:today,retries}}}};
}
export function personalVocabulary(data:UserData):VocabularyEntry[] {
  const ownIds=new Set(data.study.vocabulary.map(entry=>entry.id));
  return [...standardVocabulary.filter(entry=>!data.study.hiddenVocabulary.includes(entry.id)&&!ownIds.has(entry.id)).map(entry=>data.study.vocabularyEdits[entry.id]??entry),...data.study.vocabulary];
}
export function saveWord(data:UserData,entry:VocabularyEntry):UserData {
  const parsed=vocabularyEntrySchema.parse(entry);
  return isStandardWord(entry.id)&&!data.study.vocabulary.some(word=>word.id===entry.id)?{...data,study:{...data.study,vocabularyEdits:{...data.study.vocabularyEdits,[entry.id]:parsed}}}:{...data,study:{...data.study,vocabulary:[...data.study.vocabulary.filter(word=>word.id!==entry.id),parsed]}};
}
export function deleteWord(data:UserData,id:string):UserData {
  return {...data,study:{...data.study,vocabulary:data.study.vocabulary.filter(entry=>entry.id!==id),hiddenVocabulary:isStandardWord(id)?[...new Set([...data.study.hiddenVocabulary,id])]:data.study.hiddenVocabulary}};
}
export const wordQuestion=(entry:VocabularyEntry&{context?:string;explanation?:string}):Question=>({id:entry.id,subject:'german',topic:'Alltagswortschatz',competency:'alltagswortschatz',difficulty:1,prompt:`${entry.context?entry.context+'\n':''}Was bedeutet „${entry.word}“?`,options:[entry.meaning,...entry.distractors],correct:0,explanation:entry.explanation??entry.meaning});
