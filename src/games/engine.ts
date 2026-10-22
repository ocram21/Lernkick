import type { UserData } from '../lib/schema';
import terms from '../content/hangman.json';
import type {Difficulty}from'../activities/schema';
export const alphabet=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß'];
export const maxMisses=10;
export type Term={id:string;word:string;answer:string;hint:string;extra?:string;level?:Difficulty};
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
export function gameTerms(_data:UserData,level:Difficulty='normal',includeArchived=false):Term[]{
 return terms.filter(term=>term.level===level&&(includeArchived||!term.archived)).map(term=>({...term,level:term.level as Difficulty,answer:letters(term.word)}));
}
