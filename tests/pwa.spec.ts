import { readFileSync } from 'node:fs';
import type { Question } from '../src/lib/schema';
const questions: Question[] = ['math','german','social','biology','geography'].flatMap(subject => JSON.parse(readFileSync(new URL(`../src/content/${subject}.json`, import.meta.url), 'utf8')).questions);
import { emptyData } from '../src/lib/schema';
import { test, expect } from '@playwright/test';
for (const subject of ['Mathematik','Deutsch','Sozialkunde','Biologie','Geografie']) test(`${subject}: vollständige Runde, Speicherung, offline`,async({page,context})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
  await page.getByRole('button',{name:new RegExp(subject+' .*50 Fragen')}).click();
  for(let i=0;i<10;i++) { await expect(page.getByText(`Frage ${i+1} von 10`,{exact:true})).toBeVisible(); await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().click(); await expect(page.locator('.feedback')).toBeVisible(); await page.getByRole('button',{name:i===9?'Runde abschließen':'Nächste Frage'}).click(); }
  await expect(page.getByRole('heading',{name:'Runde geschafft.'})).toBeVisible();
  await page.getByRole('button',{name:'Zur Fächerauswahl'}).click();
  await page.getByRole('button',{name:'Fortschritt',exact:true}).click();
  await expect(page.locator('.progress-summary')).toContainText('10');
  await page.reload();
  await page.getByRole('button',{name:'Fortschritt',exact:true}).click();
  await expect(page.locator('.progress-summary')).toContainText('10');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);await page.reload();
  await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
  await page.getByRole('button',{name:new RegExp(subject+' .*50 Fragen')}).click();
  await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
});
test('eigene Karten erstellen, bearbeiten, wiederholen und löschen',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Meine Karten'}).click();await page.getByRole('button',{name:'Neue Karte',exact:true}).click();await page.getByRole('textbox',{name:'Frage',exact:true}).fill('Was ist ein Viertel von 20?');await page.getByRole('textbox',{name:'Antwort',exact:true}).fill('5');await page.getByRole('button',{name:'Karte speichern'}).click();await expect(page.locator('.card-editor')).toHaveCount(0);await page.reload();await page.getByRole('button',{name:'Meine Karten'}).click();await page.getByRole('button',{name:/Was ist ein Viertel von 20.*Wiederholen/}).click();await page.getByRole('button',{name:'Antwort zeigen'}).click();await expect(page.locator('.review h2')).toHaveText('5');await page.getByRole('button',{name:'Karte bearbeiten: Was ist ein Viertel von 20?'}).click();await page.getByRole('textbox',{name:'Antwort',exact:true}).fill('20 geteilt durch 4 = 5');await page.getByRole('button',{name:'Karte speichern'}).click();await expect(page.locator('.card-editor')).toHaveCount(0);page.on('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Karte löschen: Was ist ein Viertel von 20?'}).click();await expect(page.getByRole('heading',{name:'Platz für dein Wissen.'})).toBeVisible();});
test('kein horizontaler Überlauf auf kleinen Displays',async({page})=>{await page.setViewportSize({width:320,height:740});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});});
for (const viewport of [{width:375,height:667},{width:320,height:568},{width:844,height:390}]) {
  test(`Nächste Frage bleibt erreichbar bei ${viewport.width}×${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
    await expect(page.getByText(/Demo/i)).toHaveCount(0);
    for (const subject of ['Mathematik','Deutsch']) {
      await page.getByRole('button',{name:new RegExp(subject+' .*50 Fragen')}).click();
      for (let i=0;i<10;i++) {
        if(viewport.width===375) expect(await page.locator('.round-scroll').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
        await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().click();
        const next=page.getByRole('button',{name:i===9?'Runde abschließen':'Nächste Frage'});
        await expect(next).toBeEnabled();
        const rect=await next.boundingBox();
        expect(rect!.y).toBeGreaterThanOrEqual(0);
        expect(rect!.y+rect!.height).toBeLessThanOrEqual(viewport.height);
        expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
        if(viewport.width===375) expect(await page.locator('.round-scroll').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
        if(i===0 && subject==='Deutsch') await page.screenshot({path:`test-results/round-${viewport.width}.png`});
        await next.click();
      }
      await page.getByRole('button',{name:'Zur Fächerauswahl'}).click();
    }
  });
}

for (const [subject, title] of [['math','Mathematik'],['german','Deutsch'],['social','Sozialkunde'],['biology','Biologie'],['geography','Geografie']]) {
  test(`alle 50 Fragen erreichbar: ${title}`, async ({page}) => {
    await page.setViewportSize({width:375,height:667});
    await page.goto('/');
    await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
    const data=emptyData();
    for (const q of questions.filter(q=>q.subject===subject)) data.progress[q.id]={box:0,due:0,attempts:1,correct:0,lastAward:0};
    await page.evaluate(async value=>{
      const db=await new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
      await new Promise<void>((resolve,reject)=>{const tx=db.transaction('user','readwrite');tx.objectStore('user').put(value,'data');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
      db.close();
    },data);
    await page.reload();
    const seen=new Set<string>();
    for(let round=0;round<5;round++) {
      await page.getByRole('button',{name:new RegExp(title+' .*50 Fragen')}).click();
      for(let i=0;i<10;i++) {
        const prompt=await page.locator('.question h1').innerText();expect(seen.has(prompt)).toBe(false);seen.add(prompt);
        await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().click();
        const next=page.getByRole('button',{name:i===9?'Runde abschließen':'Nächste Frage'});await expect(next).toBeEnabled();
        const rect=await next.boundingBox();expect(rect!.y+rect!.height).toBeLessThanOrEqual(667);
        expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
        await next.click();
      }
      await page.getByRole('button',{name:'Zur Fächerauswahl'}).click();
    }
    expect(seen.size).toBe(50);
  });
}
