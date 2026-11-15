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
    await expect(page.locator('.tafelwerk-step-count')).toHaveCount(0);
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
test('Schriftliche Musterrechnungen entsprechen der Heftanordnung',async({page})=>{
 for(const viewport of [{width:320,height:568},{width:390,height:844},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
  await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();
  for(const id of ['schriftlich-mal','schriftlich-geteilt']){
   await page.locator(`[data-lesson="${id}"]`).click();
   await expect(page.locator('.written-reference')).toBeVisible();
   await expect(page.locator('.tafelwerk-step-count,.tafelwerk-progress,.tafelwerk-step-controls,.tafelwerk-example-choices')).toHaveCount(0);
   await expect(page.locator('.written-reference')).toHaveAttribute('aria-label',id==='schriftlich-mal'?/2637.*24.*63288/:/59535.*7.*8505/);
   const overflow=await page.locator('.tafelwerk-board-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1);expect(overflow).toBe(true);
   const centers=await page.locator('.written-reference text[data-column="4"]').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().x+el.getBoundingClientRect().width/2));
   for(const center of centers)expect(Math.abs(center-centers[0])).toBeLessThan(1);
   await page.screenshot({path:`test-results/${id}-${viewport.width}.png`});
   await page.getByRole('button',{name:'Zur Themenliste',exact:true}).click();await expect(page.locator(`[data-lesson="${id}"]`)).toBeFocused();
  }
 }
});

for(const {width,height} of [{width:320,height:568},{width:390,height:667},{width:390,height:844},{width:1440,height:900}])test(`Deutschthemen mit Bereichen wie Mathe ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 const borders=await page.locator('.tafelwerk-subject').evaluateAll(els=>els.map(el=>getComputedStyle(el).borderColor));expect(new Set(borders).size).toBe(1);
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();
 const topics=page.locator('.deutsch-topic-grid [data-lesson]');
 await expect(topics).toHaveCount(7);await expect(page.locator('.deutsch-reference-page')).toHaveCount(0);
 expect(await page.locator('.deutsch-topic-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(2);
 const areas=page.locator('[aria-label="Deutschbereiche"] .tafelwerk-area');await expect(areas).toHaveCount(4);
 for(const [label,count] of [['Grammatik',7],['Rechtschreibung',5],['Schreiben',4],['Lesen & Medien',4]] as const){
  const area=page.getByRole('button',{name:label,exact:true});await area.click();await expect(area).toHaveAttribute('aria-pressed','true');
  await expect(topics).toHaveCount(count);
  expect(await area.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 await expect(topics.locator('svg')).toHaveCount(0);
 const fits=await page.locator('.tafelwerk-catalog').evaluate(el=>el.scrollHeight<=el.clientHeight+1);expect(fits).toBe(true);
 for(const topic of await topics.all()){
  await expect(topic).toBeInViewport();
  expect(await topic.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
 }
 await page.screenshot({path:`test-results/deutsch-menu-${width}-${height}.png`});
 for(let i=0;i<count;i++){
  const choice=topics.nth(i),title=(await choice.getAttribute('aria-label'))!;await choice.click();
  await expect(page.locator('.deutsch-reference-page h1')).toHaveText(title.trim());
  await expect(page.locator('.deutsch-reference-page h1')).toBeFocused();
  await expect(page.locator('.deutsch-reference-page')).toHaveCount(1);
  expect(await page.locator('.deutsch-reference-list').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(2);
  if(label==='Grammatik'&&i===0){
   expect(await page.locator('.deutsch-reference-page').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
   await page.screenshot({path:`test-results/wortarten-${width}-${height}.png`});
  }
  await expect(page.locator('.deutsch-question,.deutsch-mode,.deutsch-answer')).toHaveCount(0);
  await expect(page.getByRole('button',{name:/Lösung|Beschriftet|Nummeriert|Ohne Begriffe/})).toHaveCount(0);
  expect(await page.locator('.deutsch-reference-page').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.getByRole('button',{name:'Zur Themenliste',exact:true}).click();await expect(choice).toBeFocused();
 }
 }
 await page.getByRole('button',{name:'Zur Fächerauswahl'}).click();await expect(page.getByRole('button',{name:'Mathematik',exact:true})).toBeVisible();
});
