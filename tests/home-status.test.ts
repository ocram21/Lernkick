import {expect,test} from 'vitest';
import {counterDigits,counterValue,wheelOffset} from '../src/components/HomeStatus';
test('Punktestand hat mindestens sechs Stellen und schneidet große Werte nicht ab',()=>{for(const [value,text]of [[0,'000000'],[9,'000009'],[10,'000010'],[99,'000099'],[100,'000100'],[5390,'005390'],[5391,'005391'],[5399,'005399'],[5400,'005400'],[999999,'999999'],[1000000,'1000000'],[Number.MAX_SAFE_INTEGER,'9007199254740991']]as const)expect(counterDigits(value)).toBe(text);});

test('Mechanisch gekoppelte Rollen: Übertrag bewegt die nächste Stelle nur am Übergang',()=>{
 expect(wheelOffset(9,1)).toBe(9);expect(wheelOffset(9.5,1)).toBe(9.5);expect(wheelOffset(9.5,10)).toBe(.5);expect(wheelOffset(10,1)).toBe(0);expect(wheelOffset(10,10)).toBe(1);
 expect(wheelOffset(99.5,1)).toBe(9.5);expect(wheelOffset(99.5,10)).toBe(9.5);expect(wheelOffset(99.5,100)).toBe(.5);expect(wheelOffset(100,100)).toBe(1);expect(wheelOffset(98.9,100)).toBe(0);
});
test('Zählweg bleibt vorwärts, begrenzt und erreicht für kleine und große Gewinne exakt den echten Zielwert',()=>{
 for(const [from,to]of [[9,10],[99,100],[5399,5499],[10,1000000]]){let before=from;for(let i=0;i<=100;i++){const value=counterValue(from,to,i/100);expect(value).toBeGreaterThanOrEqual(before);expect(value).toBeLessThanOrEqual(to);before=value;}expect(counterValue(from,to,1)).toBe(to);}
 expect(counterValue(10,1000000,.15)).toBe(20);expect(counterValue(10,1000000,.85)).toBe(999990);
});
