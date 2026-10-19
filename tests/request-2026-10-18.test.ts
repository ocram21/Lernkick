import {describe,it,expect} from 'vitest';
import {emptyData,dataSchema} from '../src/lib/schema';
import {adaptNormal,normalSentenceQueue,sentenceById,sentenceBand} from '../src/activities/content';

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
