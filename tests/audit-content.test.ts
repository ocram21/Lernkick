import {describe,it,expect} from 'vitest';
import grammar from '../src/content/grammarV3.json';
import {complexQuestions} from '../src/content/complexes';
import {bossTasks} from '../src/learning/boss';
import {emptyData} from '../src/lib/schema';
describe('Verlässliche Lernrückmeldung',()=>{
 it('gibt bei den Sachfachfragen mehr als die ausgewählte Antwort zurück',()=>{
  const normalize=(s:string)=>s.trim().replace(/[.!?\s]+$/,'');
  for(const q of complexQuestions)expect(normalize(q.explanation),q.id).not.toBe(normalize(q.options[q.correct]));
 });
 it('wertet zulässige Sprachvarianten nicht als falsche Alternative',()=>{
  const dative=grammar.find(q=>q.id==='grammar.v3.normal.1')!;
  expect(dative.prompt).toContain('Singular');
  const application=grammar.find(q=>q.id==='grammar.v3.normal.16')!;
  expect(application.options.slice(1)).not.toContain('auf');
 });
 it('zieht im Deutschboss keine ungeübten Bereiche hinzu',()=>{
  const d=emptyData();const practiced=grammar.filter(q=>q.level==='normal').slice(0,12);
  for(const q of practiced)d.activities.vocabulary.grammar[q.id]={attempts:1,correct:1,lastCorrect:true,at:Date.now()};
  const tasks=bossTasks(d,'german');expect(tasks).toHaveLength(10);
  for(const q of tasks)expect(practiced.some(p=>p.id===q.id)).toBe(true);
 });
});
