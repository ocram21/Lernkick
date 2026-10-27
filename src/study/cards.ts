import {cardDue,cardIntervals,cardDeadline,cardMastered,compareCardDifficulty} from './schedule';
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
export function rateCard(data:UserData,id:string,known:boolean,now=Date.now()):UserData {
  const old=data.study.reviews[id];
  if(old&&!cardDue(old,now)||cardMastered(old))return data;
  const previous=old??{box:0,due:0,attempts:0,known:0,lastRated:0};
  const {masteredAt:_mastered,stageFiveAt:_stageFive,...base}=previous;
  const mastered=known&&previous.box===5&&(previous.stageFiveAt!==undefined||previous.known>=5);
  const box=known?Math.min(5,previous.box+1):Math.max(0,previous.box-1);
  const stageFiveAt=box===5?(mastered?(previous.stageFiveAt??previous.lastRated):now):undefined;
  const due=mastered?cardDeadline(previous):now+(known?cardIntervals[box]:cardIntervals[0]);
  const review={...base,box,due,attempts:previous.attempts+1,known:previous.known+Number(known),lastRated:now,...(stageFiveAt!==undefined?{stageFiveAt}:{}),...(mastered?{masteredAt:now}:{})};
  return {...data,study:{...data.study,reviews:{...data.study.reviews,[id]:review}}};
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
