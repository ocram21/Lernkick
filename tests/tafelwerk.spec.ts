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
    await page.getByRole('button',{name:'Mathematik',exact:true}).click();
    await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toBeFocused();
    continue;
   }
   for(let i=0;i<lesson.steps.length;i++){
    await expect(page.locator('.tafelwerk-board h1')).toHaveText(lesson.steps[i].headline);
    if(lesson.id==='schriftlich-subtrahieren'){
    const carries=page.locator('.written-reference text[font-size="15"]');await expect(carries).toHaveCount(2);
    expect(await carries.evaluateAll(els=>els.map(el=>({column:el.getAttribute('data-column'),y:el.getAttribute('y'),text:el.textContent})))).toEqual([{column:'2',y:'98',text:'1'},{column:'3',y:'98',text:'1'}]);
   }
   const overflow=await page.locator('.tafelwerk-board-body').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight,scrollHeight:el.scrollHeight}));
    expect(overflow.scroll,`${lesson.id}/${i}: horizontal`).toBeLessThanOrEqual(overflow.width+1);
    if((viewport.width===320||viewport.height<400)&&lesson.steps[i].visual.type==='reference-panels'){
     // Große gemeinsame Übersichten dürfen auf sehr kleinen Displays intern scrollen; nichts wird abgeschnitten.
     await expect(page.locator('.reference-panel').last()).toBeAttached();
     expect(await page.locator('.tafelwerk-board-body').evaluate(el=>getComputedStyle(el).overflowY)).toBe('auto');
    }else expect(overflow.scrollHeight,`${lesson.id}/${i}: vertical`).toBeLessThanOrEqual(overflow.height+1);
    const fits=await page.locator('.tafelwerk-detail').evaluate(el=>el.scrollHeight<=el.clientHeight+1);expect(fits,`${lesson.id}/${i}: Erklärung ohne Scrollen`).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(i<lesson.steps.length-1)await page.getByRole('button',{name:'Weiter',exact:true}).click();
   }
   await page.getByRole('button',{name:'Mathematik',exact:true}).click();
   await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toBeFocused();
  }
 }
});
test('Pfeiltasten bleiben auf die Tafel begrenzt; Schrittgrenzen und Rückweg',async({page})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
 await page.getByRole('button',{name:'Alltagsrechnen',exact:true}).click();await page.locator('[data-lesson="prozent"]').click();
 await expect(page.locator('.tafelwerk-board h1')).toBeFocused();await page.keyboard.press('ArrowLeft');await expect(page.getByRole('button',{name:'Zurück',exact:true})).toBeDisabled();
 await page.keyboard.press('ArrowRight');await expect(page.locator('.tafelwerk-step-count')).toHaveText('2 / 3');
 await page.getByRole('button',{name:'Schritt 3 von 3'}).click();await page.keyboard.press('ArrowRight');await expect(page.locator('.tafelwerk-step-count')).toHaveText('3 / 3');
 await page.getByRole('button',{name:'Training',exact:true}).focus();await page.keyboard.press('ArrowLeft');await expect(page.locator('.tafelwerk-step-count')).toHaveText('3 / 3');
 await page.getByRole('button',{name:'Mathematik',exact:true}).click();await expect(page.locator('[data-lesson="prozent"]')).toBeFocused();
});
test('Tafelwerk funktioniert offline und erhält Lernstände und gespeicherte Runden',async({page,context})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:/^Mathematik, \d+ abgeschlossene Runden$/,exact:true}).click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 await page.getByRole('button',{name:'Ausgang',exact:true}).click();
 const read=()=>page.evaluate(()=>new Promise<any>((resolve,reject)=>{const r=indexedDB.open('lernkick',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>{resolve(g.result);r.result.close();};};}));
 const before=await read();expect(before.rounds.math).toBeTruthy();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
 await page.getByRole('button',{name:'Alltagsrechnen',exact:true}).click();await page.locator('[data-lesson="prozent"]').click();await page.getByRole('button',{name:'Weiter',exact:true}).click();
 await expect(page.locator('.tafelwerk-board h1')).toHaveText('Grundwert: das Ganze');
 const after=await read();expect(after.rounds).toEqual(before.rounds);expect(after.progress).toEqual(before.progress);expect(after.journey.totalPoints).toEqual(before.journey.totalPoints);expect(after.cards).toEqual(before.cards);
 await context.setOffline(false);
});
test('Fertige Addition mit Überträgen bleibt auch in Pink und Kompakt stellenrichtig',async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('switch',{name:'Kompakt',exact:true}).click();
 await page.getByRole('button',{name:'Ausgang',exact:true}).click();await openMath(page);await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();await page.locator('[data-lesson="schriftlich-addieren"]').click();
 await expect(page.locator('.written-reference text[font-size="15"]')).toHaveCount(2);
 const columns=await page.locator('.written-reference text[data-column="2"]').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return r.x+r.width/2;}));
 for(const x of columns)expect(Math.abs(x-columns[0])).toBeLessThan(1);
 await expect(page.locator('.tafelwerk-board h1')).toBeInViewport();
 await page.screenshot({path:'test-results/addition-pink-compact.png'});
});
test('Schriftliche Musterrechnungen entsprechen der Heftanordnung',async({page})=>{
 for(const viewport of [{width:320,height:568},{width:390,height:844},{width:1440,height:900}]){
  await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await openMath(page);
  await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();
  for(const id of ['schriftlich-addieren','schriftlich-subtrahieren','schriftlich-mal','schriftlich-geteilt']){
   await page.locator(`[data-lesson="${id}"]`).click();
   await expect(page.locator('.written-reference')).toBeVisible();
   await expect(page.locator('.tafelwerk-step-count,.tafelwerk-progress,.tafelwerk-step-controls,.tafelwerk-example-choices')).toHaveCount(0);
   await expect(page.locator('.written-reference')).toHaveAttribute('aria-label',id==='schriftlich-addieren'?/348.*176.*524/:id==='schriftlich-subtrahieren'?/426.*258.*168/:id==='schriftlich-mal'?/2637.*24.*63288/:/59535.*7.*8505/);
   const overflow=await page.locator('.tafelwerk-board-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1);expect(overflow).toBe(true);
   const centers=await page.locator('.written-reference text[data-column="4"]').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().x+el.getBoundingClientRect().width/2));
   for(const center of centers)expect(Math.abs(center-centers[0])).toBeLessThan(1);
   await page.screenshot({path:`test-results/${id}-${viewport.width}.png`});
   await page.getByRole('button',{name:'Mathematik',exact:true}).click();await expect(page.locator(`[data-lesson="${id}"]`)).toBeFocused();
  }
 }
});

for(const {width,height} of [{width:320,height:568},{width:390,height:667},{width:390,height:844},{width:1440,height:900}])test(`Deutschthemen mit Bereichen wie Mathe ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 await expect(page.locator('.tafelwerk-subject-grid .calculator-key')).toHaveCount(5);
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();
 const topics=page.locator('.deutsch-topic-grid [data-lesson]');
 await expect(topics).toHaveCount(5);await expect(page.locator('.deutsch-reference-page')).toHaveCount(0);
 expect(await page.locator('.deutsch-topic-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(2);
 await expect(page.locator('.deutsch-category-title')).toHaveText('Grammatik');
 for(const [label,count] of [['Grammatik',5]] as const){
  await expect(page.locator('.deutsch-category-title')).toHaveText(label);
  await expect(topics).toHaveCount(count);

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
  await page.getByRole('button',{name:'Deutsch',exact:true}).click();await expect(choice).toBeFocused();
 }
 }
 await expect(page.getByRole('button',{name:'Zur Fächerauswahl'})).toHaveCount(0);await expect(page.getByRole('button',{name:'Mathematik',exact:true})).toBeVisible();
});

for(const pink of [false,true])test(`Tafelwerk übernimmt Lernkasten-Kacheln und violette Auswahl: Pink ${pink}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('button',{name:'Ausgang',exact:true}).click();}
 await page.getByRole('button',{name:'Lernkasten',exact:true}).click();
 const dimensions=await page.locator('.box-subjects button').evaluateAll(els=>els.map(el=>{const s=getComputedStyle(el);return [s.aspectRatio,s.borderRadius,s.minHeight];}));
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 const tiles=page.locator('.tafelwerk-subject-grid button');await expect(tiles).toHaveCount(5);
 expect(await tiles.evaluateAll(els=>els.map(el=>{const s=getComputedStyle(el);return [s.aspectRatio,s.borderRadius,s.minHeight];}))).toEqual(dimensions);
 await page.getByRole('button',{name:'Mathematik',exact:true}).click();await expect(page.getByRole('button',{name:'Mathematik',exact:true})).toHaveAttribute('aria-pressed','true');
 expect(await page.getByRole('button',{name:'Mathematik',exact:true}).evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(134, 80, 155)');
 await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();
 expect(await page.locator('.tafelwerk-area[aria-pressed=true]').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(134, 80, 155)');
 await page.screenshot({path:`test-results/tafelwerk-math-tiles-${pink?'pink':'normal'}.png`});
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();
 await expect(page.locator('.tafelwerk-subject-grid [aria-pressed=true]')).toHaveCount(1);
 await expect(page.locator('.deutsch-category-title')).toHaveText('Grammatik');
 await page.screenshot({path:`test-results/tafelwerk-deutsch-tiles-${pink?'pink':'normal'}.png`});
});

for(const viewport of [{width:320,height:568},{width:844,height:390}])test(`Fächer bleiben an derselben Stelle und führen zur gewählten Rubrik zurück ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 const position=()=>page.locator('.tafelwerk-subject-grid').evaluate(el=>{const r=el.getBoundingClientRect();return [r.x,r.y];});
 const original=await position();
 for(const name of ['Mathematik','Deutsch','Sozialkunde','Biologie','Geographie']){
  await page.getByRole('button',{name,exact:true}).click();expect(await position()).toEqual(original);await expect(page.locator('.tafelwerk-intro')).toBeVisible();
 }
 await page.getByRole('button',{name:'Mathematik',exact:true}).click();await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();await page.locator('[data-lesson="schriftlich-mal"]').click();
 expect(await position()).toEqual(original);await page.locator('.tafelwerk-detail').evaluate(el=>{el.scrollTop=el.scrollHeight;});
 expect(await position()).toEqual(original);await expect(page.getByRole('button',{name:'Mathematik',exact:true})).toBeInViewport();
 await page.getByRole('button',{name:'Mathematik',exact:true}).click();await expect(page.getByRole('button',{name:'Schriftlich rechnen',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();await page.locator('[data-lesson="DEU-03"]').click();
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();await expect(page.locator('.deutsch-category-title')).toHaveText('Grammatik');
 await page.locator('[data-lesson="DEU-03"]').click();await page.getByRole('button',{name:'Mathematik',exact:true}).click();await expect(page.locator('.deutsch-reference-page')).toHaveCount(0);await expect(page.locator('.tafelwerk-board')).toHaveCount(0);
 await expect(page.locator('.tafelwerk-back')).toHaveCount(0);
 await page.screenshot({path:`test-results/tafelwerk-persistent-subjects-${viewport.width}.png`});
});

for(const pink of [false,true])test(`Winkelmesser und Kreiszeichnungen sind selbsterklärend und passen auf das Handy Pink ${pink}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();}
 await openMath(page);await page.getByRole('button',{name:'Geometrie',exact:true}).click();
 for(const id of ['winkel-messen','kreis']){
  await page.locator(`[data-lesson="${id}"]`).click();
  await expect(page.getByRole('button',{name:'Weiter',exact:true})).toHaveCount(0);
  const visual=page.locator('.tafelwerk-visual svg');await expect(visual).toBeVisible();
  expect(await page.locator('.tafelwerk-detail').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  await page.screenshot({path:`test-results/${id}-reference-${pink}.png`});await page.getByRole('button',{name:'Mathematik',exact:true}).click();
 }
});

for(const pink of [false,true])test(`Neue Nachschlagezeichnungen und Beispiele aus dem Prüfprotokoll Pink ${pink}`,async({page})=>{
 await page.setViewportSize({width:320,height:568});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();}
 await openMath(page);
 for(const [id,step] of [['pythagoras',0],['aehnlichkeit',0],['tafelprojektion',0],['winkelbeziehungen',0],['brueche-ungleich',0]] as const){
  const lesson=data.lessons.find(item=>item.id===id)!,category=data.categories.find(item=>item.id===lesson.category)!;
  await page.getByRole('button',{name:category.title,exact:true}).click();await page.locator(`[data-lesson="${id}"]`).click();
  if(step)await page.getByRole('button',{name:'Weiter',exact:true}).click();
  expect(await page.locator('.tafelwerk-detail').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  if(id!=='brueche-ungleich')await expect(page.locator('.tafelwerk-visual svg')).toBeVisible();
  await page.screenshot({path:`test-results/audit-${id}-${pink}.png`});await page.getByRole('button',{name:'Mathematik',exact:true}).click();
 }
});
