import type { UserData } from '../lib/schema';
import { questions } from '../content';
import { personalCards, personalVocabulary } from '../study/cards';
import { shuffle } from '../lib/engine';
export type GameKind='crossword'|'scramble'|'numbers'|'hangman';
export const gameNames:Record<GameKind,string>={crossword:'Kreuzworträtsel',scramble:'Wortsalat',numbers:'Zahlenrätsel',hangman:'Galgenraten'};
export type Term={id:string;word:string;answer:string;hint:string};
export function letters(word:string){return word.toLocaleUpperCase('de').replaceAll('Ä','AE').replaceAll('Ö','OE').replaceAll('Ü','UE').replaceAll('ẞ','SS').replaceAll('ß','SS');}
export function gameTerms(data:UserData):Term[]{
  const cards=personalCards(data).flatMap(card=>{const match=card.front.match(/^Was (?:ist|sind|bedeutet|zeigt|beschreibt) (?:(?:ein|eine|das|der|die) )?([A-Za-zÄÖÜäöüß]+)\?$/);return match?[{id:card.id,word:match[1],hint:card.back}]:[];});
  const vocabulary=personalVocabulary(data).map(entry=>({id:entry.id,word:entry.word,hint:entry.meaning}));
  const seen=new Set<string>();
  return [...cards,...vocabulary].flatMap(term=>{const answer=letters(term.word);if(!/^[A-Z]{4,12}$/.test(answer)||term.hint.length>180||seen.has(answer))return [];seen.add(answer);return [{...term,answer,hint:term.hint.replace(new RegExp(term.word,'gi'),'…')}];});
}
export type Crossing={terms:[Term,Term];row:number;column:number;width:number;height:number};
export function crossword(terms:Term[],random=Math.random):Crossing|undefined{
  const pool=shuffle(terms.filter(term=>term.answer.length<=7&&term.hint.length<=100),random);
  for(const a of pool)for(const b of pool){if(a.answer===b.answer)continue;for(let x=0;x<a.answer.length;x++)for(let y=0;y<b.answer.length;y++)if(a.answer[x]===b.answer[y])return {terms:[a,b],row:y,column:x,width:a.answer.length,height:b.answer.length};}
}
export function letterBag(answer:string,random=Math.random):string[]{
  const mixed=shuffle([...answer],random);if(mixed.join('')===answer){const different=mixed.findIndex(letter=>letter!==mixed[0]);if(different>0)[mixed[0],mixed[different]]=[mixed[different],mixed[0]];}return mixed;
}
export function numberPuzzle(random=Math.random){return shuffle(questions.filter(q=>q.subject==='math'&&q.difficulty<=2&&q.prompt.length<=160&&q.options.every(option=>option.length<=16)&&q.explanation.length<=200),random)[0];}
