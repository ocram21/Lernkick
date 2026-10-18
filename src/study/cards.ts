import catalog from '../content/standardCards.json';
import words from '../content/vocabulary.json';
import { cardSchema, vocabularyEntrySchema, type Card, type Subject, type UserData, type VocabularyEntry, type Question } from '../lib/schema';
export const standardCards:Card[]=catalog.cards.map(card=>cardSchema.parse(card));
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
  return {...data,cards:[...data.cards.filter(c=>c.id!==parsed.id),parsed]};
}
export function deletePersonalCard(data:UserData,id:string):UserData {
  return isStandardCard(id)?data:{...data,cards:data.cards.filter(card=>card.id!==id)};
}
export const restoreStandardCards=(data:UserData):UserData=>({...data,study:{...data.study,hiddenDefaults:[]}});
export function cardQueue(data:UserData,cards:Card[],now=Date.now()):Card[] {
  return cards.filter(card=>!data.study.reviews[card.id]||data.study.reviews[card.id].due<=now).sort((a,b)=>{const priority=(card:Card)=>{const review=data.study.reviews[card.id];return !review?0:review.due<=now?-1:1;};return priority(a)-priority(b)||(data.study.reviews[a.id]?.due??0)-(data.study.reviews[b.id]?.due??0);}).slice(0,10);
}
export function rateCard(data:UserData,id:string,known:boolean,now=Date.now()):UserData {
  const old=data.study.reviews[id]??{box:0,due:0,attempts:0,known:0,lastRated:0};
  // Immediate repeat may be useful practice, but does not repeatedly grow the interval.
  const box=known?(old.attempts>0&&now-old.lastRated<86_400_000?Math.max(1,old.box):Math.min(5,old.box+1)):0;
  const days=[0,1,3,7,14,30];
  return {...data,study:{...data.study,reviews:{...data.study.reviews,[id]:{box,due:now+(known?days[box]*86_400_000:600_000),attempts:old.attempts+1,known:old.known+Number(known),lastRated:now}}}};
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
export const wordQuestion=(entry:VocabularyEntry):Question=>({id:entry.id,subject:'german',topic:'Alltagswortschatz',competency:'alltagswortschatz',difficulty:1,prompt:`Was bedeutet „${entry.word}“?`,options:[entry.meaning,...entry.distractors],correct:0,explanation:entry.meaning});
