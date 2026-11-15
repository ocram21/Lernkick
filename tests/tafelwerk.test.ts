import {describe,expect,it} from 'vitest';
import data from '../src/content/tafelwerk/math-lessons.json';
import {formatFractions,renderVisual} from '../src/content/tafelwerk/visuals';
const lesson=(id:string)=>data.lessons.find(item=>item.id===id)!;
describe('Mathe-Tafelwerk',()=>{
 it('behält alle Themen eindeutig und rendert jeden Schritt',()=>{
  expect(data.lessons).toHaveLength(58);
  expect(new Set(data.lessons.map(l=>l.id)).size).toBe(58);
  for(const l of data.lessons){
   expect(data.categories.some(c=>c.id===l.category)).toBe(true);
   for(const step of l.steps){
    expect(step.headline.trim()).not.toBe('');expect(step.explanation.trim()).not.toBe('');
    const rendered=renderVisual(step.visual);expect(rendered,l.id).not.toBe('');
    expect(rendered,l.id).not.toMatch(/NaN|undefined|Infinity/);
   }
  }
 });
 it('formatiert ganze Bruchoperanden und bewahrt HTML-Attribute',()=>{
  for(const input of ['2⁄4','²⁄₄','2/4'])expect(formatFractions(input)).toContain('<span class="top">2</span><span class="bottom">4</span>');
  expect(formatFractions('(18 € · 100)/(60 €)')).toContain('<span class="top">18 € · 100</span><span class="bottom">60 €</span>');
  expect(formatFractions('0,25/100')).toContain('<span class="top">0,25</span>');
  expect(formatFractions('<span title="1/2">½</span>')).toContain('title="1/2"');
 });
 it('zeigt Prozentanteil und Prozentzahl ohne falsche Gleichsetzung',()=>{
  expect(lesson('bruch-dezimal-prozent').steps[0].visual).toMatchObject({rows:['¼ = 1 : 4 = 0,25','0,25 = 25/100 = 25 %']});
  expect(lesson('prozent').steps).toHaveLength(3);
  expect(JSON.stringify(lesson('prozent'))).not.toContain('= 30 %');
 });
 it('Vierfeldertafel hat konsistente Ränder und disjunkte Merkmale',()=>{
  const visual=lesson('vierfeldertafel').steps[0].visual as {rows:string[][]};
  const numbers=visual.rows.map(r=>r.slice(1).map(Number));
  for(const row of numbers)expect(row[0]+row[1]).toBe(row[2]);
  for(let i=0;i<3;i++)expect(numbers[0][i]+numbers[1][i]).toBe(numbers[2][i]);
  expect(visual.rows.map(r=>r[0])).toEqual(['Mit Abo','Ohne Abo','Gesamt']);
  expect(lesson('vierfeldertafel').steps[0].formula).toContain('8 mit Bus, 12 mit Rad');
 });
 it('entwickelt schriftliche Addition mit sichtbaren Überträgen',()=>{
  const steps=lesson('schriftlich-addieren').steps;
  expect(steps.map(s=>(s.visual as {result?:string}).result)).toEqual(['','','','524']);
  expect(steps[1].visual).toMatchObject({partial:'  4',carry:' 1 '});
  expect(steps[2].visual).toMatchObject({partial:' 24',carry:'11 '});
 });
 it('verschiebt bei der Division jede Ziffer nur einmal und zeigt Minuszeichen',()=>{
  const result=renderVisual(lesson('schriftlich-geteilt').steps[1].visual);
  expect(result).not.toContain('class="division-row " style="--division-offset:1"');
  expect(result.match(/aria-label="minus"/g)).toHaveLength(2);
 });
 it('zeichnet auch waagerechte und fallende Geraden endlich im Koordinatenbereich',()=>{
  for(const slope of [0,-2,2]){
   const result=renderVisual({type:'graph',mode:'line',slope,intercept:1});
   expect(result).not.toMatch(/NaN|Infinity/);
   expect(result).toContain('stroke="var(--calc-teal)"');
  }
 });
});
