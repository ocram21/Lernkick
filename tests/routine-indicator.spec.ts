import {test,expect} from './appTest';
import {emptyData} from '../src/lib/schema';
import {newJourney} from '../src/learning/journey';
for(const pink of [false,true])test(`Routine: Skala trifft LED-Gruppen, Licht bleibt sichtbar Pink ${pink}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 const data=emptyData();data.settings.pink=pink;data.journey={...newJourney({}),strength:80};
 await page.evaluate(d=>new Promise<void>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('user','readwrite');tx.objectStore('user').put(d,'data');tx.oncomplete=()=>{db.close();resolve();};};}),data);
 await page.reload();await expect(page.locator('.strength-led.lit')).toHaveCount(16);
 const alignment=await page.locator('.skill-instrument').evaluate(el=>{const leds=[...el.querySelectorAll('.strength-led')].map(x=>x.getBoundingClientRect());return [...el.querySelectorAll('.skill-scale>span')].map((x,i)=>{const r=x.getBoundingClientRect(),actual=i===0?r.left:i===4?r.right:r.left+r.width/2;const expected=i===0?leds[0].left:i===4?leds[19].right:(leds[i*5-1].right+leds[i*5].left)/2;return Math.abs(actual-expected);});});
 for(const delta of alignment)expect(delta).toBeLessThan(1);
 const colors=await page.locator('.strength-leds').evaluate(el=>{const lit=el.querySelector('.lit')!,off=el.querySelector('.strength-led:not(.lit)')!;return [getComputedStyle(lit).backgroundColor,getComputedStyle(off).backgroundColor];});expect(colors[0]).not.toBe(colors[1]);
 await page.screenshot({path:`test-results/routine-scale-${pink}.png`});
});
test('Kurze aktive Einheit erhöht Routine sofort, auch nach Reload; Tafelwerk ohne Lupe',async({page})=>{
 await page.clock.install();await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.locator('[data-module="math"]').click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 await page.clock.runFor(10000);await page.getByRole('button',{name:'Hilfe',exact:true}).click();await page.clock.runFor(10000);await page.getByRole('button',{name:'Ausgang',exact:true}).click();
 const meter=page.getByRole('meter',{name:'Routine',exact:true});const value=Number(await meter.getAttribute('aria-valuenow'));expect(value).toBeGreaterThan(0);expect(value).toBeLessThan(5);await expect(page.locator('.strength-led.partial')).toHaveCount(1);
 await page.reload();await expect(meter).toHaveAttribute('aria-valuenow',String(value));
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();await expect(page.getByRole('button',{name:'Große Leseansicht',exact:true})).toHaveCount(0);
});
