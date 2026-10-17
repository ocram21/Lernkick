import type { UserData } from '../lib/schema';
import { personalCards, personalVocabulary } from '../study/cards';
export const alphabet=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß'];
export const maxMisses=10;
export type Term={id:string;word:string;answer:string;hint:string};
/** Case folding preserves German letters as individual characters, including ß/ẞ. */
export function letters(word:string){return [...word].map(letter=>letter==='ß'||letter==='ẞ'?'ß':letter.toLocaleUpperCase('de')).join('');}
export function addGuess(guessed:string[],input:string):string[]{
 const letter=letters(input);return !alphabet.includes(letter)||guessed.includes(letter)?guessed:[...guessed,letter];
}
export function hangmanState(answer:string,guessed:string[]){
 const word=letters(answer),unique=[...new Set(guessed.map(letters).filter(letter=>alphabet.includes(letter)))];
 const misses=Math.min(maxMisses,unique.filter(letter=>!word.includes(letter)).length);
 return {misses,remaining:maxMisses-misses,won:misses<maxMisses&&Boolean(word)&&[...word].every(letter=>unique.includes(letter)),lost:misses===maxMisses};
}
export function gameTerms(data:UserData):Term[]{
 const cards=personalCards(data).flatMap(card=>{const match=card.front.match(/^Was (?:ist|sind|bedeutet|zeigt|beschreibt) (?:(?:ein|eine|das|der|die) )?([A-Za-zÄÖÜäöüßẞ]+)\?$/);return match?[{id:card.id,word:match[1],hint:card.back}]:[];});
 const vocabulary=personalVocabulary(data).map(entry=>({id:entry.id,word:entry.word,hint:entry.meaning}));
 const seen=new Set<string>();
 return [...cards,...vocabulary].flatMap(term=>{const answer=letters(term.word);if(!/^[A-ZÄÖÜß]{4,12}$/.test(answer)||term.hint.length>180||seen.has(answer))return [];seen.add(answer);return [{...term,answer,hint:term.hint.replace(new RegExp(term.word,'gi'),'…')}];});
}
