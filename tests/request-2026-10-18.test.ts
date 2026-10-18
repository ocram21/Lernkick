import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {emptyData,dataSchema} from '../src/lib/schema';
import {adaptNormal,normalSentenceQueue,sentenceById,sentenceBand} from '../src/activities/content';
import {boards} from '../src/reference/catalog';
const svg=(name:string)=>readFileSync(new URL(`../public/boards/${name}.svg`,import.meta.url),'utf8');
describe('Änderungsauftrag 18.10.: adaptive Normal-Stufe',()=>{
 it('beginnt mit einfachen Kommas, steigt in Einzelschritten und geht nach zwei Fehleraufgaben zurück',()=>{
  const config=emptyData().activities.vocabulary;
  expect(sentenceById.get(normalSentenceQueue(config)[0])!.tokens).toContain(',');
  expect(normalSentenceQueue(config).every(id=>sentenceBand(sentenceById.get(id)!)===0)).toBe(true);
  const ids=normalSentenceQueue(config).slice(0,10);
  for(let i=0;i<8;i++){const before=config.adaptive.tier;config.adaptive=adaptNormal(config,ids[i],true);expect(config.adaptive.tier-before).toBeLessThanOrEqual(1);if(i===2)expect(config.adaptive.tier).toBe(0);if(i===3)expect(config.adaptive.tier).toBe(1);}
  expect(config.adaptive.tier).toBe(2);
  config.adaptive=adaptNormal(config,ids[8],false);expect(config.adaptive.tier).toBe(2);
  const failed=config.adaptive;expect(adaptNormal(config,ids[8],true)).toEqual(failed);
  config.adaptive=adaptNormal(config,ids[9],false);expect(config.adaptive.tier).toBe(1);
  const harder=normalSentenceQueue(config);expect(sentenceBand(sentenceById.get(harder[0])!)).toBe(1);expect(harder.every(id=>sentenceBand(sentenceById.get(id)!)<=1)).toBe(true);
 });
 it('ergänzt ältere Sicherungen rückwärtskompatibel und lässt Satzentwürfe und Ergebnisse unverändert',()=>{
  const data=emptyData();data.activities.vocabulary.sentences.a={attempts:2,correct:1,lastCorrect:true,at:30};
  const legacy=JSON.parse(JSON.stringify(data));delete legacy.activities.vocabulary.adaptive;
  const parsed=dataSchema.parse(legacy);expect(parsed.activities.vocabulary.sentences).toEqual(data.activities.vocabulary.sentences);expect(parsed.activities.vocabulary.adaptive).toEqual({tier:0,successes:0,errors:0,lastTask:null});
 });
});
describe('Lerntafeln: fachliche Darstellungsregeln',()=>{
 it('blendet nur das Anschreiben aus, behält dessen Rohdaten und die anderen Tafeln',()=>{expect(boards).toHaveLength(34);expect(boards.some(b=>b.id==='german-application')).toBe(false);expect(readFileSync(new URL('../src/reference/catalog.json',import.meta.url),'utf8')).toContain('german-application');});
 it('liefert stellenweise Ziffern, Überträge, mehrere Multiplikationen und Divisionen',()=>{const multiplication=svg('math-written'),division=svg('math-written-division');for(const expression of ['234 · 16 = 3744','2057 · 34 = 69938'])expect(multiplication).toContain(expression);expect(multiplication).toContain('Übertrag bei ·4');expect(multiplication).toContain('data-column="5" x="510"');for(const expression of ['936 : 4 = 234','12096 : 8 = 1512'])expect(division).toContain(expression);expect(division).toContain('marker-end');});
 it('zeigt Brüche ohne Schrägstriche und reduziert nur Längeneinheiten',()=>{const fractions=svg('math-fractions');expect(fractions).not.toMatch(/\d+\/\d+/);expect(fractions).toContain('stroke-width="2"');const units=svg('math-units');expect(units).not.toMatch(/\b(?:hm|dam)\b/);for(const unit of ['km','dm','cm','mm','kg','mg','1000'])expect(units).toContain(unit);});
 it('beschriftet die drei anatomischen Schemata dauerhaft und Amerika mit Bergen und Flüssen',()=>{for(const [name,labels]of Object.entries({nose:['Riechschleimhaut','Riechzellen','Riechkolben','Gehirn'],skin:['Oberhaut','Lederhaut','Unterhaut','Haar','Schweißdrüse','Nerven'],circulation:['Rechter Vorhof','Rechte Herzkammer','Linker Vorhof','Linke Herzkammer','Lunge','Aorta','Hohlvenen']}))for(const label of labels)expect(svg(name)).toContain(label);for(const label of ['Anden','Amazonas','Rocky Mountains','Flächentreue'])expect(svg('geography-americas')).toContain(label);expect(svg('geography-americas').match(/<path/g)!.length).toBeGreaterThan(30);});
});
