import {it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {standardCards} from '../src/study/cards';
import plan from '../docs/KARTENZIELE-BEDARF-2026-10-28.json';
import {readFileSync} from 'node:fs';
it('erhält jede der 758 bisherigen Karten vollständig und ergänzt nur neue IDs',()=>{
 expect(createHash('sha256').update(JSON.stringify(standardCards.slice(0,758))).digest('hex')).toBe(plan.beforeHash);
 expect(standardCards).toHaveLength(1216);
 for(const item of plan.items)expect(standardCards.filter(c=>c.rubric===item.rubric)).toHaveLength(item.target);
 expect(new Set(plan.items.map(i=>i.target)).size).toBeGreaterThan(8);
 expect(JSON.parse(readFileSync('public/release.json','utf8')).storageEpoch).toBe('cards-2026-10-28');
});
