import {it,expect} from 'vitest';
import {emptyData} from '../src/lib/schema';
import {rateCard} from '../src/study/cards';
import {cardDue,cardDay} from '../src/study/schedule';
for(const date of ['2026-03-28T23:55:00+01:00','2026-10-24T23:55:00+02:00'])it(`Zeitabstände bleiben exakt über Zeitumstellung: ${date}`,()=>{const now=Date.parse(date);let d=rateCard(emptyData(),'x',true,now);expect(d.study.reviews.x.due).toBe(now+600000);d=rateCard(d,'x',true,now+600000);expect(d.study.reviews.x.due).toBe(now+600000+cardDay);expect(cardDue(d.study.reviews.x,d.study.reviews.x.due-1)).toBe(false);expect(cardDue(d.study.reviews.x,d.study.reviews.x.due)).toBe(true);});
it('Vorhandene genaue Termine werden weder vorgezogen noch umgeschrieben',()=>{const d=emptyData();d.study.reviews.x={box:2,due:100000,attempts:2,known:2,lastRated:0};expect(cardDue(d.study.reviews.x,99999)).toBe(false);expect(rateCard(d,'x',true,99999)).toBe(d);expect(d.study.reviews.x.due).toBe(100000);});
