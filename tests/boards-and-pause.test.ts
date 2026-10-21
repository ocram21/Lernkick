import {describe,it,expect} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {boards,boardSchema,checkBoard,reorderTerms,shuffledTerms,validOrder} from '../src/boards/model';
import {emptyData,dataSchema} from '../src/lib/schema';
import {migrateData,prepareImport} from '../src/learning/migration';
import {emptyNBack,recordNBack,recoverNBack} from '../src/learning/nback';
import {addReview} from '../src/lib/roundReview';
describe('Tafelpakete',()=>{
 it('normalisiert nur Auge und Ohr und erhält die Originaldateien bytegenau',()=>{
  expect(boards.map(b=>b.entries.length)).toEqual([16,10]);
  for(const board of boards){const path=new URL('../public/'+board.image,import.meta.url);expect(existsSync(path)).toBe(true);expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(board.sha256);expect(board.status).toBe('draft');expect(board.approvedForTeaching).toBe(false);}
  const result=spawnSync('python3',['scripts/import-boards.py'],{encoding:'utf8'});expect(result.status,result.stderr).toBe(0);
 });
 it('weist doppelte Nummern und leere Begriffe zurück',()=>{
  const board=boards[0];expect(boardSchema.safeParse({...board,entries:[board.entries[0],board.entries[0]]}).success).toBe(false);expect(boardSchema.safeParse({...board,entries:[{number:1,term:' '},board.entries[1]]}).success).toBe(false);
 });
 it('bewegt jeden Eintrag an jede Grenze inklusive Anfang und Ende',()=>{
  for(const board of boards){const order=board.entries.map((_,i)=>i);for(let source=0;source<order.length;source++)for(let boundary=0;boundary<=order.length;boundary++){const next=reorderTerms(order,source,boundary);expect(validOrder(board,next)).toBe(true);expect(next.indexOf(source)).toBe(boundary-(source<boundary?1:0));expect(next.filter(n=>n!==source)).toEqual(order.filter(n=>n!==source));}expect(checkBoard(board,order).every(Boolean)).toBe(true);expect(checkBoard(board,[...order].reverse()).every(Boolean)).toBe(false);for(let i=0;i<100;i++){const next=shuffledTerms(order.length);expect(validOrder(board,next)).toBe(true);expect(next).not.toEqual(order);}}
 });
});
describe('Dauerhafter N-Back-Fortschritt',()=>{
 it('wertet nur die bisherige Grenze von höchstens zwei Fehlern als gemeistert',()=>{
  const initial=emptyNBack();const failed=recordNBack(initial,{id:'failed',level:2,errors:3,at:1});expect(failed.mastered).toEqual([]);expect(failed.current).toBe(2);
  const passed=recordNBack(failed,{id:'passed',level:2,errors:2,at:2});expect(passed.mastered).toEqual([2]);expect(passed.current).toBe(3);expect(passed.bestErrors['2']).toBe(2);expect(recordNBack(passed,{id:'passed',level:2,errors:2,at:2})).toBe(passed);
  const next=recordNBack(passed,{id:'failed3',level:3,errors:10,at:3});expect(next.mastered).toEqual([2]);expect(next.current).toBe(3);
 });
 it('rekonstruiert N2/N3 aus laufendem N4, behauptet aber weder N1 noch N4',()=>{
  const run={level:4,index:3,sequence:Array.from({length:28},()=>({letter:'T',position:0,answers:{audio:false,position:false}}))};expect(recoverNBack(emptyNBack(),run).mastered).toEqual([2,3]);expect(recoverNBack(emptyNBack(),{...run,level:2,sequence:run.sequence.slice(0,26)}).mastered).toEqual([]);
 });
 it('erhält Erfolge beim Import älterer Sicherungen und begrenzt den Ergebnisverlauf',()=>{
  const current=emptyData();current.nback=recordNBack(current.nback,{id:'keep',level:3,errors:0,at:1});const incoming=emptyData();expect(prepareImport(current,incoming).nback.mastered).toEqual([3]);let state=current.nback;for(let i=0;i<120;i++)state=recordNBack(state,{id:'r'+i,level:1,errors:5,at:i+2});expect(state.results).toHaveLength(100);expect(state.mastered).toEqual([3]);expect(state.bestErrors['3']).toBe(0);
 });
});
describe('Rückblick und Speicherung',()=>{
 it('begrenzter Rückblick verändert keine Bewertung oder andere Lerndaten',()=>{
  const data=emptyData();data.scores.math=1000;const snapshot=JSON.stringify(data);let history=[] as ReturnType<typeof addReview>;
  for(let i=0;i<50;i++)history=addReview(history,{id:String(i),title:'Mathe',prompt:'2 − 8?',ownAnswer:'6',correctAnswer:'−6',correct:false,explanation:'Sechs Schritte links von null.'});expect(history).toHaveLength(40);expect(JSON.stringify(data)).toBe(snapshot);
 });
 it('liest ältere v3-Daten mit Pink standardmäßig aus und schützt Punkte, Level und Historien',()=>{
  const old=JSON.parse(JSON.stringify(emptyData()));delete old.settings.pink;delete old.nback;delete old.boards;old.scores.math=1100;old.progress.keep={box:3,due:2,attempts:5,correct:4,lastAward:1};const next=migrateData(old);expect(next.settings.pink).toBe(false);expect(next.scores.math).toBe(1100);expect(next.progress).toEqual(old.progress);expect(dataSchema.parse({...next,settings:{...next.settings,pink:true}}).settings.pink).toBe(true);
 });
});
