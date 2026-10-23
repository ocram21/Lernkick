import {test,expect} from './appTest';
import {answerCorrect,answerWrong,storedAttempts} from './helpers';
async function home(page:import('@playwright/test').Page){await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();}
for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
 test(`Mathe: Auswahl, automatischer Wechsel, Ausgang und Wiederaufnahme ${viewport.width}`,async({page})=>{
  await page.setViewportSize(viewport);await home(page);await page.getByRole('switch',{name:'Streber',exact:true}).click();await page.getByRole('button',{name:'Mathematik, Level 1',exact:true}).click();
  await page.getByRole('button',{name:'Alle',exact:true}).click();await page.getByRole('button',{name:'Negative Zahlen',exact:true}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  const prompt=await page.locator('.question h1').innerText();expect(prompt).toContain('−');
  await answerWrong(page);await page.getByRole('button',{name:'Ausgang',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.calculator-grid')).toBeVisible();
  await page.reload();await page.getByRole('button',{name:'Mathematik, Level 1',exact:true}).click();await expect(page.locator('.question h1')).toHaveText(prompt);await expect(page.locator('.feedback')).toBeVisible();
  await page.getByRole('button',{name:'Nächste Frage',exact:true}).click();await expect(page.getByText('Frage 2 von 10',{exact:true})).toBeVisible();
  await page.clock.install();await answerCorrect(page);await expect(page.locator('.feedback')).toContainText('Sitzt.');await page.clock.runFor(1900);await expect(page.getByText('Frage 2 von 10',{exact:true})).toBeVisible();await page.clock.runFor(200);await expect(page.getByText('Frage 3 von 10',{exact:true})).toBeVisible();expect(await storedAttempts(page)).toBe(2);
  await page.screenshot({path:`test-results/oct20-math-${viewport.width}.png`});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
 test(`Galgenraten: QWERTZ und gespeicherte Buchstaben ${viewport.width}`,async({page})=>{
  await page.setViewportSize(viewport);await home(page);await page.getByRole('button',{name:'Galgenraten, Level 1',exact:true}).click();
  await expect(page.locator('.keyboard-row').first()).toHaveText('QWERTZUIOPÜ');await page.locator('.keyboard-row').first().getByRole('button',{name:'Q',exact:true}).click();await page.getByRole('button',{name:'Ausgang',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Galgenraten, Level 1',exact:true}).click();await expect(page.locator('.keyboard-row').getByRole('button',{name:'Q',exact:true})).toBeDisabled();await page.screenshot({path:`test-results/oct20-hangman-${viewport.width}.png`});
 });
}
test('Deutsch: Zitat hervorgehoben; automatische Wechsel stoppen nach Ausgang',async({page})=>{
 await home(page);
 await page.evaluate(()=>new Promise<void>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const tx=r.result.transaction('user','readwrite'),store=tx.objectStore('user'),get=store.get('data');get.onsuccess=()=>{const data=get.result;data.progress['german-032']={box:0,due:0,attempts:1,correct:0,lastAward:0};store.put(data,'data');};tx.oncomplete=()=>{r.result.close();resolve();};};}));
 await page.reload();await page.getByRole('button',{name:'Deutsch, Level 1',exact:true}).click();
 const quote=page.locator('.quoted-example');await expect(quote).toHaveText('„Der Bus fährt um 8:10 Uhr. Lea kommt um 8:15 Uhr.“');expect(await quote.first().evaluate(el=>getComputedStyle(el).color)).not.toBe(await page.locator('.question h1').evaluate(el=>getComputedStyle(el).color));
 await page.clock.install();await answerCorrect(page);const prompt=await page.locator('.question h1').innerText();await page.getByRole('button',{name:'Ausgang',exact:true}).click();await page.clock.runFor(5000);await page.getByRole('button',{name:'Deutsch, Level 1',exact:true}).click();await expect(page.locator('.question h1')).toHaveText(prompt);expect(await storedAttempts(page)).toBe(2);
});
test('Lernstärke sammelt aktive Tageszeit, vor dem Tagesziel noch ohne Gutschrift',async({page})=>{
 await page.clock.install();await home(page);await page.getByRole('button',{name:'Deutsch, Level 1',exact:true}).click();await page.clock.runFor(15000);await page.getByRole('button',{name:'Ausgang',exact:true}).click();await expect(page.locator('.home-status')).toContainText('Lernstärke 0 %');await expect(page.locator('.home-status strong')).toHaveText('0 Punkte');
});
test('N-Back: große Tasten in richtiger Reihenfolge; Ausgang erhält die pausierte Runde',async({page})=>{
 await home(page);await page.getByRole('button',{name:'Dual N-Back, Level 1',exact:true}).click();const game=page.frameLocator('iframe');await game.getByRole('button',{name:'Training starten',exact:true}).click();await expect(game.locator('.answers button')).toHaveText(['Position','Audio']);const position=await game.getByRole('button',{name:'Position',exact:true}).boundingBox(),audio=await game.getByRole('button',{name:'Audio',exact:true}).boundingBox();expect(position!.x).toBeLessThan(audio!.x);expect(position!.height).toBeGreaterThanOrEqual(72);
 const frame=page.frames().find(f=>f.url().includes('/games/dual-n-back/'))!;const before=await frame.evaluate(()=>JSON.parse(localStorage.getItem('lernkick.nback.round.v1')!));await page.getByRole('button',{name:'Ausgang',exact:true}).click();await page.getByRole('button',{name:'Dual N-Back, Level 1',exact:true}).click();await expect(game.getByRole('button',{name:'Weiter spielen',exact:true})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('lernkick.nback.round.v1'))).not.toBeNull();const resumed=page.frames().find(f=>f.url().includes('/games/dual-n-back/'))!;const after=await resumed.evaluate(()=>JSON.parse(localStorage.getItem('lernkick.nback.round.v1')!));expect(after.resultId).toBe(before.resultId);expect(after.index).toBe(before.index);
});

for(const subject of ['Sozialkunde','Biologie','Geographie'])test(`${subject}: Antwort und Aufgabe nach Ausgang und Neuladen erhalten`,async({page})=>{
 await home(page);await page.getByRole('button',{name:`${subject}, Level 1`,exact:true}).click();await answerWrong(page);const prompt=await page.locator('.question h1').innerText();await page.getByRole('button',{name:'Ausgang',exact:true}).click();await page.reload();await page.getByRole('button',{name:`${subject}, Level 1`,exact:true}).click();await expect(page.locator('.question h1')).toHaveText(prompt);await expect(page.locator('.answer.incorrect')).toHaveCount(1);expect(await storedAttempts(page)).toBe(1);
});
test('Deutschlandquiz: offene Felder kontrastreich, belegte weiß und nach Ausgang erhalten',async({page})=>{
 await home(page);await page.getByRole('button',{name:'Deutschlandquiz, Level 1',exact:true}).click();
 await page.evaluate(()=>new Promise<void>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const tx=r.result.transaction('user','readwrite'),store=tx.objectStore('user'),get=store.get('data');get.onsuccess=()=>{const data=get.result;data.activities.germany.session.round='capitals';data.activities.germany.session.placed=['01'];store.put(data,'data');};tx.oncomplete=()=>{r.result.close();resolve();};};}));
 await page.reload();await page.getByRole('button',{name:'Deutschlandquiz, Level 1',exact:true}).click();await expect(page.locator('.capital-target.placed')).toHaveCount(1);expect(await page.locator('.capital-target.placed').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');await expect(page.locator('.capital-target:not(.placed)').first()).toHaveText('Einsetzen');expect(await page.locator('.capital-target:not(.placed)').first().evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe('rgb(255, 255, 255)');await page.screenshot({path:'test-results/oct20-capitals.png'});
});
