import {describe,it,expect} from 'vitest';
import {solvedBoard,shuffledPuzzle,puzzleSolvable,puzzleSolved,movePuzzle,adjacent,puzzleBoardSchema} from '../src/games/slidingPuzzle';
import {seededRandom} from '../src/learning/generator';
import {emptyData} from '../src/lib/schema';
import {practiceQueue,sentenceById,wordById} from '../src/activities/content';
import {grammarById} from '../src/activities/grammar';
import {spellingById} from '../src/activities/spelling';
import {proverbById} from '../src/activities/proverbs';
import {questions} from '../src/content';
import {bossTasks} from '../src/learning/boss';
import {migrateData} from '../src/learning/migration';
import {newJourney} from '../src/learning/journey';
describe('Klassisches Schiebepuzzle',()=>{
 it('erzeugt 200 nicht gelöste, lösbare Permutationen für beide Bild-/Zahlenlevel',()=>{for(let seed=0;seed<200;seed++){const board=shuffledPuzzle(seededRandom(seed));expect(puzzleBoardSchema.safeParse(board).success).toBe(true);expect(puzzleSolvable(board)).toBe(true);expect(puzzleSolved(board)).toBe(false);}});
 it('erlaubt nur direkte Nachbarn, keine Diagonalen oder Zeilenumbrüche',()=>{expect(adjacent(3,4)).toBe(false);expect(adjacent(15,10)).toBe(false);const board=solvedBoard();expect(movePuzzle(board,0)).toBe(board);expect(movePuzzle(board,10)).toBe(board);for(const position of [11,14]){const next=movePuzzle(board,position);expect(next).not.toBe(board);expect(next[position]).toBe(0);expect(next[15]).toBe(board[position]);expect(puzzleSolvable(next)).toBe(true);expect(puzzleSolved(movePuzzle(next,15))).toBe(true);}expect(puzzleSolved([])).toBe(false);expect(puzzleSolvable([2,1,...board.slice(2)])).toBe(false);});
});
describe('Deutsch zusammengeführt',()=>{
 const types={german:(id:string)=>questions.some(q=>q.subject==='german'&&q.id===id),terms:(id:string)=>wordById.has(id),sentences:(id:string)=>sentenceById.has(id),grammar:(id:string)=>grammarById.has(id),spelling:(id:string)=>spellingById.has(id),proverbs:(id:string)=>proverbById.has(id)};
 it('hat anfangs sechs aktive Bereiche und mischt sie in beiden Niveaus',()=>{for(const level of ['normal','hard'] as const){const d=emptyData(),c=d.activities.vocabulary;c.level=level;expect(Object.values(c.enabled).every(Boolean)).toBe(true);const queue=practiceQueue(c);expect(queue).toHaveLength(10);for(const matches of Object.values(types))expect(queue.some(matches)).toBe(true);}});
 for(const [type,matches] of Object.entries(types))it(`filtert normale Runden ausschließlich nach ${type}`,()=>{for(const level of ['normal','hard'] as const){const c=emptyData().activities.vocabulary;c.level=level;c.enabled={german:type==='german',everyday:type==='terms',work:type==='terms',sentences:type==='sentences',grammar:type==='grammar',spelling:type==='spelling',proverbs:type==='proverbs'};const queue=practiceQueue(c);expect(queue).toHaveLength(10);expect(queue.every(matches)).toBe(true);}});
 it('Deutsch-Boss umfasst alle verfügbaren Formate unabhängig von der normalen Auswahl',()=>{const d=emptyData();d.activities.vocabulary.enabled={german:true,everyday:false,work:false,sentences:false,grammar:false,spelling:false,proverbs:false};const tasks=bossTasks(d,'german');expect(tasks).toHaveLength(10);for(const matches of Object.values(types))expect(tasks.some(t=>matches(t.id))).toBe(true);});
 it('aktiviert sechs Bereiche einmalig und erhält alle alten Ergebnisse, Entwürfe und Zähler',()=>{const d=emptyData();d.journey=newJourney(d.scores);d.journey.totalPoints=1820;d.journey.statistics.charges.german=3;d.activities.vocabulary.words.keep={attempts:4,correct:3,lastCorrect:true,at:1};d.activities.vocabulary.session={ids:['sentence.normal.v1.001'],index:0,answer:null,draft:[1,0],solved:false};const raw:any=structuredClone(d);delete raw.activities.vocabulary.integrated;delete raw.activities.vocabulary.german;delete raw.activities.vocabulary.enabled.german;raw.activities.vocabulary.enabled.sentences=false;const migrated=migrateData(raw);expect(migrated.activities.vocabulary.words).toEqual(d.activities.vocabulary.words);expect(migrated.activities.vocabulary.session).toEqual(d.activities.vocabulary.session);expect(migrated.journey).toEqual(d.journey);expect(Object.values(migrated.activities.vocabulary.enabled).every(Boolean)).toBe(true);expect(migrateData(migrated)).toEqual(migrated);});
});
