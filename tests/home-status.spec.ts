import {test,expect,type Page} from './appTest';
import {emptyData,type UserData} from '../src/lib/schema';
import {newJourney} from '../src/learning/journey';
async function seed(page:Page,data:UserData){await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await page.evaluate(value=>new Promise<void>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const tx=r.result.transaction('user','readwrite');tx.objectStore('user').put(value,'data');tx.oncomplete=()=>{r.result.close();resolve();};};}),data);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();}
const targets=(page:Page)=>page.locator('.counter-window').evaluateAll(els=>els.map(el=>el.querySelector('.counter-track')!.lastElementChild!.textContent).join(''));
// Measured on the preceding release: no extra height and no displacement of the keys.
const layouts=[[320,568,false,57.390625,188.390625],[375,667,false,86.1875,252.1875],[390,844,false,86.1875,252.1875],[1440,900,false,88.796875,261.796875],[320,568,true,61.390625,201.390625],[390,844,true,65.390625,205.390625]] as const;
for(const pink of [false,true])for(const [width,height,compact,statusHeight,keyY]of layouts)test(`Anzeige und Aluminium ohne Layoutwachstum ${width}, Pink ${pink}, kompakt ${compact}`,async({page})=>{
 await page.setViewportSize({width,height});const d=emptyData();d.settings.pink=pink;d.settings.compact=compact;d.journey={...newJourney(d.scores),totalPoints:5399,strength:80};await seed(page,d);
 expect(await targets(page)).toBe('005399');await expect(page.getByRole('meter',{name:'Lernstärke',exact:true})).toHaveAttribute('aria-valuenow','80');await expect(page.locator('.home-status progress')).toHaveCount(0);await expect(page.locator('.calculator-grid>.aluminum-frame')).toHaveCount(9);await expect(page.locator('.strength-led.lit')).toHaveCount(64);
 expect((await page.locator('.home-status').boundingBox())!.height).toBeLessThanOrEqual(statusHeight+.1);expect((await page.locator('.calculator-key').first().boundingBox())!.y).toBeCloseTo(keyY,1);
 expect(await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}))).toEqual({width,height});expect(await page.locator('.calculator-grid').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
 const frame=await page.locator('.calculator-key').first().evaluate(el=>getComputedStyle(el,'::after').pointerEvents);expect(frame).toBe('none');
 if(!compact&&[320,390,1440].includes(width))await page.screenshot({path:`test-results/status-${pink?'pink':'normal'}-${width}.png`});
 await page.getByRole('button',{name:'Persönliche Statistik öffnen'}).click();await expect(page.locator('.statistics-page')).toBeVisible();
});
for(const reduced of [false,true])test(`Rollenzähler: einzelne Ziffer, Übertrag, Sprung und Überlauf, reduziert ${reduced}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});const d=emptyData();d.journey={...newJourney(d.scores),totalPoints:5390};await seed(page,d);expect(await targets(page)).toBe('005390');
 page.on('dialog',dialog=>dialog.accept());
 for(const [points,changed]of [[5391,1],[5399,1],[5400,3],[812345,6],[1000000,7]] as const){
  await page.getByRole('button',{name:'Einstellungen',exact:true}).click();d.journey!.totalPoints=points;d.journey!.strength=points===5400?25:100;
  await page.locator('input[type=file]').setInputFiles({name:'counter-check.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(d))});await expect(page.getByRole('status')).toContainText('Sicherung übernommen');await page.getByRole('button',{name:'Training',exact:true}).click();
  expect(await targets(page)).toBe(String(points).padStart(6,'0'));await expect(page.locator('.counter-track.rolling')).toHaveCount(changed);
  const names=await page.locator('.counter-track.rolling').evaluateAll(els=>els.map(el=>getComputedStyle(el).animationName));expect(new Set(names)).toEqual(new Set([reduced?'none':'counter-roll']));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();expect(await targets(page)).toBe('1000000');await expect(page.locator('.counter-track.rolling')).toHaveCount(0);
});
