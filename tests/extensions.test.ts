import { describe,it,expect } from 'vitest';
import { emptyData,cardSchema } from '../src/lib/schema';
import { findCards } from '../src/study/cardList';
import { personalCards } from '../src/study/cards';
import { gameTerms,crossword,letterBag,numberPuzzle,letters } from '../src/games/engine';
describe('Karten suchen und ordnen',()=>{
 it('kombiniert Suche in Antworten mit stabiler Reihenfolge und vorhandenen Karten ohne Datum',()=>{const cards=personalCards(emptyData());expect(findCards(cards,'SUMME','newest').some(card=>card.front==='Was ist eine Summe?')).toBe(true);const old={id:'own',subject:'math' as const,front:'Alt',back:'Bleibt'};const newer={...old,id:'new',front:'Neu',createdAt:100};expect(findCards([...cards,old,newer],'','newest').slice(0,2)).toEqual([newer,old]);expect(findCards([old,newer],'','oldest')).toEqual([old,newer]);expect(findCards([newer,old],'','alphabetical')).toEqual([old,newer]);expect(cardSchema.parse(old)).toEqual(old);});
});
describe('Lernstoff für Spiele',()=>{
 it('nutzt vorhandene Inhalte und entfernt persönliche Ausblendungen auch aus Spielen',()=>{const data=emptyData();const terms=gameTerms(data);expect(terms.length).toBeGreaterThan(40);expect(terms.find(term=>term.word==='Summe')?.hint).toContain('Addition');data.study.hiddenDefaults=['standard.math.v1.001'];expect(gameTerms(data).some(term=>term.id==='standard.math.v1.001')).toBe(false);expect(letters('Ökosystem')).toBe('OEKOSYSTEM');});
 it('baut echte Kreuzungen und mischbare Buchstaben ohne Wortverlust',()=>{const terms=gameTerms(emptyData());for(let i=0;i<50;i++){const cross=crossword(terms)!;expect(cross.terms[0].answer[cross.column]).toBe(cross.terms[1].answer[cross.row]);expect(cross.width).toBeLessThanOrEqual(7);expect(cross.height).toBeLessThanOrEqual(7);for(const term of cross.terms){const bag=letterBag(term.answer);expect([...bag].sort()).toEqual([...term.answer].sort());expect(bag.join('')).not.toBe(term.answer);}}expect(crossword([])).toBeUndefined();});
 it('verwendet gültige kurze Matheaufgaben aus dem Katalog',()=>{const q=numberPuzzle();expect(q.subject).toBe('math');expect(q.options[q.correct]).toBeTruthy();expect(q.prompt.length).toBeLessThanOrEqual(160);});
});
