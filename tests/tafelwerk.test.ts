import {describe,expect,it} from 'vitest';
import data from '../src/content/tafelwerk/math-lessons.json';
import {formatFractions,renderVisual} from '../src/content/tafelwerk/visuals';
import {buildDivisionSteps,buildMultiplicationSteps} from '../src/content/tafelwerk/long-arithmetic';
const lesson=(id:string)=>data.lessons.find(item=>item.id===id)!;
describe('Mathe-Tafelwerk',()=>{
 it('behält alle Themen eindeutig und rendert jeden Schritt',()=>{
  expect(data.lessons).toHaveLength(59);
  expect(new Set(data.lessons.map(l=>l.id)).size).toBe(59);
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
 it('zeigt Addition und Subtraktion vollständig mit kleinen stellenrichtigen Ziffern',()=>{
  for(const [id,kind,expected] of [['schriftlich-addieren','addition','524'],['schriftlich-subtrahieren','subtraction','168']]){
   const steps=lesson(id).steps;expect(steps).toHaveLength(1);
   expect(steps[0].visual).toMatchObject({type:'written-reference',kind});
   const visual=renderVisual(steps[0].visual);expect(visual).toContain(expected);expect(visual).toContain('font-size="15"');
  }
  const ids=data.lessons.filter(l=>l.category==='verfahren').map(l=>l.id);
  expect(ids.indexOf('schriftlich-subtrahieren')).toBe(ids.indexOf('schriftlich-addieren')+1);
 });
 it('zeigt die festen Musterrechnungen mit Kästchen und vollständigen Ergebnissen',()=>{
  for(const id of ['schriftlich-mal','schriftlich-geteilt']){
   expect(lesson(id).steps).toHaveLength(1);
   expect(lesson(id).steps[0].visual.type).toBe('written-reference');
   const result=renderVisual(lesson(id).steps[0].visual);
   expect(result).toContain('class="written-reference"');
   expect(result).toContain(id==='schriftlich-mal'?'63288':'8505');
  }
 });
 it('berechnet schriftliche Multiplikation mit Teilprodukten, Versatz und Überträgen',()=>{
  const cases=[['24','13','312'],['2637','24','63288'],['305','24','7320'],['1002','30','30060'],['999','99','98901']];
  for(const [top,bottom,expected] of cases){
   const steps=buildMultiplicationSteps(top,bottom);const final=steps.at(-1)!;
   expect(final.visual.result,`${top}×${bottom}`).toBe(expected);
   const sum=final.visual.partials.reduce((total:number,row:{cells:(string|null)[]})=>total+Number(row.cells.filter(Boolean).join('')),0);
   expect(sum,`${top}×${bottom} partial sum`).toBe(Number(expected));
   expect(steps.map(step=>renderVisual(step.visual)).join('')).not.toMatch(/NaN|undefined|Infinity/);
  }
  const shift=buildMultiplicationSteps('2637','24').at(-1)!.visual.partials.map((row:any)=>row.label);
  expect(shift).toEqual(['× 4 Einer','× 2 Zehner']);
  expect(buildMultiplicationSteps('24','13').some(step=>step.explanation.includes('Übertrag'))).toBe(true);
 });
 it('berechnet schriftliche Division inklusive interner Quotientennullen und Resten',()=>{
  const cases=[['156','12','13','0'],['59535','7','8505','0'],['1005','5','201','0'],['1248','12','104','0'],['17','5','3','2'],['3','7','0','3']];
  for(const [dividend,divisor,wantQuotient,wantRemainder] of cases){
   const steps=buildDivisionSteps(dividend,divisor);const final=steps.at(-1)!;
   expect(final.visual.quotient,`${dividend}:${divisor}`).toBe(wantQuotient);
   expect(final.visual.remainder,`${dividend}:${divisor} remainder`).toBe(wantRemainder);
   expect(BigInt(divisor)*BigInt(final.visual.quotient)+BigInt(final.visual.remainder)).toBe(BigInt(dividend));
   expect(BigInt(final.visual.remainder)).toBeLessThan(BigInt(divisor));
   expect(steps.map(step=>renderVisual(step.visual)).join('')).not.toMatch(/NaN|undefined|Infinity/);
  }
  const ref=buildDivisionSteps('59535','7');
  expect(ref.some(step=>step.headline==='Quotientenziffer 0 notieren')).toBe(true);
  expect(ref.find(step=>step.headline==='Quotientenziffer 0 notieren')?.explanation).toContain('0 × 7 = 0');
 });
 it('erhält Multiplikations- und Divisionsinvarianten bei vielen gültigen Eingaben',()=>{
  let seed=721331;const rand=(limit:number)=>{seed=(seed*48271)%2147483647;return seed%limit;};
  for(let i=0;i<250;i++){
   const top=String(rand(99999)+1),bottom=String(rand(999)+1);
   const product=buildMultiplicationSteps(top,bottom).at(-1)!.visual;
   expect(BigInt(product.result)).toBe(BigInt(top)*BigInt(bottom));
   const divisor=String(rand(999)+1),quotient=String(rand(99999)),remainder=String(rand(Number(divisor)));
   const dividend=(BigInt(divisor)*BigInt(quotient)+BigInt(remainder)).toString();
   const division=buildDivisionSteps(dividend,divisor).at(-1)!.visual;
   expect(BigInt(division.quotient)*BigInt(divisor)+BigInt(division.remainder)).toBe(BigInt(dividend));
   expect(BigInt(division.remainder)).toBeLessThan(BigInt(divisor));
  }
 });
 it('erläutert die schriftlichen Verfahren bei unveränderter vollständiger Musterrechnung',()=>{
  expect(lesson('schriftlich-subtrahieren').steps[0].explanation).toContain('kleine 1 wird unten in die Zehnerspalte übertragen');
  const multiply=lesson('schriftlich-mal').steps[0];expect(multiply.explanation).toContain('52 740');expect(multiply.explanation).toContain('leere Einerstelle');
  const divide=lesson('schriftlich-geteilt').steps[0];expect(divide.explanation).toContain('3 : 7 = 0 Rest 3');
  for(const id of ['schriftlich-subtrahieren','schriftlich-mal','schriftlich-geteilt'])expect(lesson(id).steps).toHaveLength(1);
 });
 it('zeigt die noch fehlenden Bilder und getrennten Fälle aus dem Prüfprotokoll',()=>{
  const binom=lesson('binomische-formeln').steps;expect(binom).toHaveLength(3);expect(renderVisual(binom[0].visual)).toContain('zerlegt in a², ab, ab und b²');
  expect(binom[1].visual).toMatchObject({rows:expect.arrayContaining(['= a² − 2ab + b²'])});expect(binom[2].visual).toMatchObject({rows:expect.arrayContaining(['= a² − b²'])});
  const line=renderVisual(lesson('linear-ungleichung').steps[1].visual);expect(line).toContain('offener Kreis bei 4');expect(line).toContain('Lösungsbereich nach links');
  expect(lesson('linear-ungleichung').steps[2].visual).toMatchObject({rows:expect.arrayContaining(['x > 4'])});
  expect(renderVisual(lesson('aehnlichkeit').steps[0].visual)).toContain('Maßstab 1 zu 3');
  for(const s of lesson('tafelprojektion').steps){const picture=renderVisual(s.visual);expect(picture).toContain('Pᵍ(3|2)');expect(picture).toContain('Pᵃ(3|4)');}
  expect(lesson('negative-rechnen').steps[2].visual).toMatchObject({from:2,to:5});
  const median=lesson('median').steps[1];expect(median.formula).toContain('8,5');expect(renderVisual(median.visual).match(/visual-chip emphasis/g)).toHaveLength(2);
  expect(lesson('brueche-ungleich').steps[0].visual).toMatchObject({rows:expect.arrayContaining(['1/2 = (1 · 3)/(2 · 3) = 3/6','1/3 = (1 · 2)/(3 · 2) = 2/6'])});
 });
 it('stimmt Werkzeug, Messmarkierung und Kreisgrößen auf die Erklärung ab',()=>{
  const angle=lesson('winkel-messen').steps[1];expect(angle.headline).toBe('Mit dem Winkelmesser messen');expect(angle.explanation).toContain('Nullmarke rechts');expect(renderVisual(angle.visual)).toContain('45-Grad-Markierung');
  for(const [index,mode,result] of [[0,'circumference','18,85'],[1,'area','28,27']] as const){
   const step=lesson('kreis').steps[index];expect(step.visual).toMatchObject({type:'circle-reference',mode});const rendered=renderVisual(step.visual);expect(rendered).toContain('<circle');expect(rendered).toContain('r = 3 cm');expect(rendered).toContain('d = 6 cm');expect(rendered).toContain(result);
  }
 });
 it('zeichnet auch waagerechte und fallende Geraden endlich im Koordinatenbereich',()=>{
  for(const slope of [0,-2,2]){
   const result=renderVisual({type:'graph',mode:'line',slope,intercept:1});
   expect(result).not.toMatch(/NaN|Infinity/);
   expect(result).toContain('stroke="var(--calc-teal)"');
  }
 });
});
