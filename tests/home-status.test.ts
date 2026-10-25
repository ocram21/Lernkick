import {expect,test} from 'vitest';
import {counterDigits} from '../src/components/HomeStatus';
test('Punktestand hat mindestens sechs Stellen und schneidet große Werte nicht ab',()=>{for(const [value,text]of [[0,'000000'],[9,'000009'],[10,'000010'],[99,'000099'],[100,'000100'],[5390,'005390'],[5391,'005391'],[5399,'005399'],[5400,'005400'],[999999,'999999'],[1000000,'1000000'],[Number.MAX_SAFE_INTEGER,'9007199254740991']]as const)expect(counterDigits(value)).toBe(text);});
