import {test,expect} from './appTest';
test('Bruchkoeffizienten stehen waagerecht; Operationsfeld ist leer und bleibt bedienbar',async({page})=>{
 await page.goto('/');await page.locator('[data-module="math"]').click();await page.getByRole('button',{name:'Alle',exact:true}).click();await page.getByRole('button',{name:'Gleichungen',exact:true}).click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 await page.evaluate(()=>new Promise<void>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const db=r.result,t=db.transaction('user','readwrite'),s=t.objectStore('user'),g=s.get('data');g.onsuccess=()=>{const d=g.result,q=d.rounds.math;q.current.equation={a:{n:11,d:2},b:{n:4,d:1},c:{n:-1,d:2},d:{n:58,d:1}};q.current.prompt='11/2x + 4 = -1/2x + 58';q.equationSteps=[];s.put(d,'data');};t.oncomplete=()=>{db.close();resolve();};};}));
 await page.reload();await page.locator('[data-module="math"]').click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 const fractions=page.locator('.equation-lines h1 .math-fraction');await expect(fractions).toHaveCount(2);await expect(fractions.first()).toHaveText('112');
 const alignment=await fractions.first().evaluate(el=>{const css=getComputedStyle(el),top=el.children[0].getBoundingClientRect(),bottom=el.children[1].getBoundingClientRect();return {align:css.verticalAlign,bar:top.bottom-parseFloat(getComputedStyle(el.children[0]).borderBottomWidth)/2,center:(el.getBoundingClientRect().top+el.getBoundingClientRect().bottom)/2,gap:bottom.top-top.bottom};});
 expect(alignment.align).toBe('middle');expect(Math.abs(alignment.bar-alignment.center)).toBeLessThan(2);
 await page.screenshot({path:'test-results/equation-fraction-alignment.png'});
 const input=page.getByRole('textbox',{name:'Operation auf beiden Seiten',exact:true});await expect(input).toHaveValue('');await expect(input).not.toHaveAttribute('placeholder',/.+/);
 await input.fill('+1/2x');await page.getByRole('button',{name:'Prüfen',exact:true}).click();await expect(page.locator('.equation-lines p')).toContainText('6x');await expect(page.locator('.equation-lines h1 .math-fraction')).toHaveCount(3);
 await page.screenshot({path:'test-results/equation-horizontal-fractions.png'});
});
