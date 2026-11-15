import {test,expect,type Page} from './appTest';
import {readFileSync} from 'node:fs';
const data:typeof import('../src/content/tafelwerk/math-lessons.json')=JSON.parse(readFileSync(new URL('../src/content/tafelwerk/math-lessons.json',import.meta.url),'utf8'));
async function openMath(page:Page){await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();await page.getByRole('button',{name:'Mathematik',exact:true}).click();}
for(const viewport of [{width:320,height:568},{width:844,height:390},{width:1440,height:900}])test(`Alle Mathetafeln bleiben lesbar und bedienbar ${viewport.width}`,async({page})=>{
 test.setTimeout(180000);await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
 for(const category of data.categories){
  await page.getByRole('button',{name:category.title,exact:true}).click();
  for(const lesson of data.lessons.filter(l=>l.category===category.id)){
   await page.locator(`[data-lesson="${lesson.id}"]`).click();
   if(lesson.id==='schriftlich-mal'||lesson.id==='schriftlich-geteilt'){
    await expect(page.locator('.tafelwerk-step-count')).toContainText(' / ');
    await page.locator('.tafelwerk-lesson-top .tafelwerk-back').click();
    await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toBeFocused();
    continue;
   }
   for(let i=0;i<lesson.steps.length;i++){
    await expect(page.locator('.tafelwerk-board h1')).toHaveText(lesson.steps[i].headline);
    const overflow=await page.locator('.tafelwerk-board-body').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight,scrollHeight:el.scrollHeight}));
    expect(overflow.scroll,`${lesson.id}/${i}: horizontal`).toBeLessThanOrEqual(overflow.width+1);
    expect(overflow.scrollHeight,`${lesson.id}/${i}: vertical`).toBeLessThanOrEqual(overflow.height+1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(i<lesson.steps.length-1)await page.getByRole('button',{name:'Weiter',exact:true}).click();
   }
   await page.getByRole('button',{name:'Zur Themenliste',exact:true}).last().click();
   await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toBeFocused();
  }
 }
});
test('Pfeiltasten bleiben auf die Tafel begrenzt; Schrittgrenzen und Rückweg',async({page})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
 await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();await page.locator('[data-lesson="schriftlich-addieren"]').click();
 await expect(page.locator('.tafelwerk-board h1')).toBeFocused();await page.keyboard.press('ArrowLeft');await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeDisabled();
 await page.keyboard.press('ArrowRight');await expect(page.locator('.tafelwerk-step-count')).toHaveText('2 / 4');
 await page.getByRole('button',{name:'Schritt 4 von 4'}).click();await page.keyboard.press('ArrowRight');await expect(page.locator('.tafelwerk-step-count')).toHaveText('4 / 4');
 await page.getByRole('button',{name:'Training',exact:true}).focus();await page.keyboard.press('ArrowLeft');await expect(page.locator('.tafelwerk-step-count')).toHaveText('4 / 4');
 await page.getByRole('button',{name:'Zur Themenliste',exact:true}).last().click();await expect(page.locator('[data-lesson="schriftlich-addieren"]')).toBeFocused();
});
test('Tafelwerk funktioniert offline und erhält Lernstände und gespeicherte Runden',async({page,context})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Mathematik, Level 1',exact:true}).click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 await page.getByRole('button',{name:'Ausgang',exact:true}).click();
 const read=()=>page.evaluate(()=>new Promise<any>((resolve,reject)=>{const r=indexedDB.open('lernkick',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>{resolve(g.result);r.result.close();};};}));
 const before=await read();expect(before.rounds.math).toBeTruthy();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
 await page.getByRole('button',{name:'Alltagsrechnen',exact:true}).click();await page.locator('[data-lesson="prozent"]').click();await page.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect(page.locator('.tafelwerk-board h1')).toHaveText('Grundwert: Wie groß ist das Ganze?');
 const after=await read();expect(after.rounds).toEqual(before.rounds);expect(after.progress).toEqual(before.progress);expect(after.journey.totalPoints).toEqual(before.journey.totalPoints);expect(after.cards).toEqual(before.cards);
 await context.setOffline(false);
});
test('Überträge stehen stellengerecht; neue Schritte beginnen oben, auch in Pink und Kompakt',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('switch',{name:'Kompakt',exact:true}).click();
 await page.getByRole('button',{name:'Ausgang',exact:true}).click();await openMath(page);await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();await page.locator('[data-lesson="schriftlich-addieren"]').click();await page.getByRole('button',{name:'Weiter',exact:true}).click();
 const columns=await page.locator('.addition-digits').evaluateAll(rows=>rows.map(row=>[...row.children].map(cell=>{const b=cell.getBoundingClientRect();return b.x+b.width/2;})));
 for(const row of columns)for(let i=0;i<row.length;i++)expect(Math.abs(row[i]-columns[0][i])).toBeLessThan(1);
 await page.setViewportSize({width:320,height:568});await page.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect.poll(()=>page.locator('.tafelwerk').evaluate(el=>el.scrollTop)).toBe(0);await expect(page.locator('.tafelwerk-board h1')).toBeInViewport();
});
test('Schriftliche Multiplikation und Division bleiben schrittweise und stellenrichtig',async({page})=>{
 test.setTimeout(180000);
 for(const viewport of [{width:360,height:800},{width:430,height:932},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
  await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();
  await page.locator('[data-lesson="schriftlich-mal"]').click();
  await expect(page.locator('.tafelwerk-board h1')).toHaveText('Faktoren stellenrichtig aufschreiben');
  await expect(page.locator('.arithmetic-equation')).toContainText('2637 × 24');
  const multiplicationSteps=Number((await page.locator('.tafelwerk-step-count').innerText()).split(' / ')[1]);
  await page.locator('.tafelwerk-progress button[title="Hunderterziffer 6 mit 4 multiplizieren"]').click();
  await expect(page.locator('.tafelwerk-board h1')).toHaveText('Hunderterziffer 6 mit 4 multiplizieren');
  await expect(page.locator('.tafelwerk-board-body')).toContainText('Übertrag');
  await page.locator('.tafelwerk-progress button[title="Produkt und Probe"]').click();
  await expect(page.locator('.tafelwerk-board h1')).toHaveText('Produkt und Probe');await expect(page.locator('.arithmetic-equation')).toContainText('63288');
  expect(multiplicationSteps).toBeGreaterThan(8);
  const columns=await page.locator('.multiplication-visual .arith-row').first().locator('.arith-cell').evaluateAll((cells:Element[])=>cells.map(cell=>{const r=cell.getBoundingClientRect();return r.x+r.width/2;}));
  const aligned=await page.locator('.multiplication-visual .arith-row').evaluateAll((rows:Element[])=>rows.map(row=>Array.from(row.querySelectorAll('.arith-cell')).map(cell=>{const r=cell.getBoundingClientRect();return r.x+r.width/2;})));
  for(const row of aligned)for(let i=0;i<columns.length;i++)expect(Math.abs(row[i]-columns[i])).toBeLessThan(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);

  await page.locator('.tafelwerk-lesson-top .tafelwerk-back').click();
  await page.locator('[data-lesson="schriftlich-geteilt"]').click();
  await expect(page.locator('.arithmetic-equation')).toContainText('59535 : 7');
  await page.locator('.tafelwerk-progress button[title="Quotientenziffer 0 notieren"]').click();
  await expect(page.locator('.tafelwerk-board h1')).toHaveText('Quotientenziffer 0 notieren');
  await expect(page.locator('.tafelwerk-explanation')).toContainText('0 × 7 = 0');
  await expect(page.locator('.division-visual .arith-quotient .arith-cell').filter({hasText:'0'})).toHaveCount(1);
  await page.locator('.tafelwerk-progress button[title="Quotient, Rest und Probe"]').click();
  await expect(page.locator('.tafelwerk-board h1')).toHaveText('Quotient, Rest und Probe');
  await expect(page.locator('.arithmetic-equation')).toContainText('8505');
  await expect(page.locator('.division-check')).toContainText('7 × 8505 = 59535');
  const calculationField=page.locator('.tafelwerk-board-body');
  expect(await calculationField.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
  await calculationField.evaluate(el=>{el.scrollTop=el.scrollHeight;});
  await expect(page.locator('.division-check')).toBeInViewport();
  await expect(page.locator('.arithmetic-equation')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`test-results/long-arithmetic-${viewport.width}.png`,fullPage:false});
 }
});
