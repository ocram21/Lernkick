import { test, expect, type Page } from './appTest';
import { readFileSync } from 'node:fs';
import { emptyData, type UserData } from '../src/lib/schema';
import { answerCorrect, answerWrong } from './helpers';
async function stored(page:Page):Promise<UserData> {return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,get=db.transaction('user').objectStore('user').get('data');get.onsuccess=()=>{resolve(get.result);db.close();};get.onerror=()=>reject(get.error);};}));}
async function seed(page:Page,data:unknown) {await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await page.evaluate(value=>new Promise<void>((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('user','readwrite');tx.objectStore('user').put(value,'data');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),data);await page.reload();await expect(page.locator('.calculator-grid')).toBeVisible();}
async function importData(page:Page,data:unknown) {await page.getByRole('button',{name:'Einstellungen',exact:true}).click();page.once('dialog',dialog=>dialog.accept());await page.locator('.import-button input').setInputFiles({name:'sicherung.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await expect(page.getByRole('status')).toContainText('Sicherung übernommen');}
async function leaveRound(page:Page) {await page.getByRole('button',{name:'Ausgang',exact:true}).click();}

test('Mathe beginnt mit Zehnerübergang, Hilfestufen ohne lokale Stufen sind erreichbar',async({page})=>{
  await page.setViewportSize({width:320,height:568});await page.goto('/');await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  await expect(page.locator('.question-topic')).toHaveText('Addieren mit Zehnerübergang');
  await expect(page.locator('.question h1')).toContainText('Wie viel ist');
  await page.getByRole('button',{name:'Hilfe',exact:true}).click();await expect(page.getByText('Ein Hinweis',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Beispiel ansehen',exact:true}).click();await expect(page.getByText('Ein Beispiel',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Lösung erklären',exact:true}).click();await expect(page.getByText('Lösung verstehen',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Hilfe schließen',exact:true}).click();await answerCorrect(page);
  await page.getByRole('button',{name:'Nächste Frage',exact:true}).click();
  await expect(page.getByRole('button',{name:'Stufe',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Hilfe',exact:true}).click();await expect(page.getByText('Ein Hinweis',{exact:true})).toBeVisible();
  await page.screenshot({path:'test-results/pilot-help-mobile.png'});
  const data=await stored(page);const state=data.learning.competencies['math.add.carry'];expect(state.observations[0].help).toBe(3);expect(state.helpRequests).toBeGreaterThanOrEqual(3);expect(data.learning.unlocks).toEqual({});
});

test('Fehler führen zu neuen unterstützten Aufgaben; Hilfen und Weiter-Button bleiben offline nutzbar',async({page,context})=>{
  await page.goto('/');await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Alle',exact:true}).click();await page.getByRole('button',{name:'Grundrechenarten',exact:true}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  const seen=new Set<string>();
  for(let i=0;i<5;i++){
    const prompt=await page.locator('.question h1').innerText();expect(seen.has(prompt)).toBe(false);seen.add(prompt);
    await answerWrong(page);await expect(page.locator('.feedback')).toBeVisible();await expect(page.getByRole('button',{name:'Anhalten',exact:true})).toHaveCount(1);
    const next=page.getByRole('button',{name:'Nächste Frage',exact:true});const rect=await next.boundingBox();expect(rect!.y+rect!.height).toBeLessThanOrEqual(844);await next.click();
    await expect(page.getByRole('button',{name:'Hilfe',exact:true})).toHaveAttribute('aria-expanded','true');await expect(page.getByText('Ein Hinweis',{exact:true})).toBeVisible();
  }
  const data=await stored(page);expect(data.learning.recovery.math.failures).toBeGreaterThan(0);expect(data.learning.competencies['math.add.carry'].correct).toBe(0);
});

test('Kompetenznachweise bleiben gespeichert ohne eine zweite Fortschrittsseite',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Alle',exact:true}).click();await page.getByRole('button',{name:'Grundrechenarten',exact:true}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();for(let i=0;i<5;i++){await answerCorrect(page);await page.getByRole('button',{name:'Nächste Frage',exact:true}).click();}await leaveRound(page);expect(Object.keys((await stored(page)).learning.unlocks).length).toBeGreaterThan(0);await expect(page.locator('.calculator-key')).toHaveCount(9);await expect(page.locator('.competency-mosaic')).toHaveCount(0);});
test('IndexedDB-Version 1 migriert ohne Verlust und exportiert eine importierbare neue Sicherung',async({page})=>{
  const {learning:_,...fields}=emptyData();const legacy={...fields,version:1,progress:{'math-002':{box:4,due:123456,attempts:9,correct:7,lastAward:123},'unknown-old-id':{box:2,due:42,attempts:2,correct:1,lastAward:1}},scores:{...fields.scores,math:90},cards:[{id:'old-card',front:'Meine alte Karte',back:'Bleibt erhalten.',subject:'math'}],settings:{reducedMotion:true}};
  await seed(page,legacy);const migrated=await stored(page);expect(migrated.version).toBe(7);expect(migrated.progress).toEqual(legacy.progress);expect(migrated.scores).toEqual(legacy.scores);expect(migrated.cards).toEqual(legacy.cards.map(card=>({rubric:'general',...card})));expect(migrated.settings).toEqual({...legacy.settings,pink:false,difficulty:'normal',compact:false});expect(migrated.learning.competencies['math.add.carry'].baseline).toEqual({attempts:9,correct:7});expect(migrated.learning.unlocks).toEqual({});
  await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await expect(page.getByRole('button',{name:'Karten verwalten',exact:true})).toHaveCount(0);expect((await stored(page)).cards).toEqual(migrated.cards);
  await page.getByRole('button',{name:'Einstellungen',exact:true}).click();const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Sicherung exportieren',exact:true}).click();const download=await downloadEvent;const exported=JSON.parse(readFileSync((await download.path())!,'utf8'));expect(exported).toEqual(migrated);
  await importData(page,legacy);await expect.poll(()=>stored(page)).toEqual(migrated);
  await importData(page,exported);await expect.poll(()=>stored(page)).toEqual(migrated);
});

test('historische Freischaltungen bleiben nach Rückfall, Export, Import und Neustart gespeichert',async({page})=>{
  const data=emptyData(),now=Date.now();data.learning.competencies['math.add.carry']={baseline:{attempts:0,correct:0},observations:[0,1,2].map(i=>({taskId:'old'+i,signature:'old'+i,at:now-(3-i)*86_400_000,correct:true,help:0,level:1})),helpRequests:0,attempts:3,correct:3,due:now-1000,level:2};data.learning.unlocks['math.number.compare:growing']={at:now-86_400_000,subject:'math',skillId:'math.number.compare',milestone:'growing'};data.learning.unlocks['math.number.compare:secure']={at:now-1000,subject:'math',skillId:'math.number.compare',milestone:'secure'};data.learning.unlocks['future.segment:secure']={at:now,subject:'math',skillId:'future.segment',milestone:'secure'};
  await seed(page,data);await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();await answerWrong(page);await leaveRound(page);
  const after=await stored(page);expect(after.learning.unlocks).toEqual(data.learning.unlocks);await importData(page,after);await page.reload();
  const {learning:_,...old}=emptyData();await importData(page,{...old,version:1});
  expect((await stored(page)).learning.unlocks).toEqual(data.learning.unlocks);

});
