import { test, expect } from './appTest';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
import { answerCorrect, answerWrong } from './helpers';
import { emptyData } from '../src/lib/schema';
import {newJourney} from '../src/learning/journey';

test('Update-Button im Header ist sichtbar und erklärt den Offline-Fall',async({page,context})=>{
  await page.setViewportSize({width:320,height:568});await page.goto('/');
  const button=page.getByRole('button',{name:'App aktualisieren',exact:true});await expect(button).toBeVisible();
  const rect=await button.boundingBox();expect(rect!.y+rect!.height).toBeLessThan(568);expect(rect!.height).toBeGreaterThanOrEqual(44);
  await context.setOffline(true);await button.click();await expect(page.getByRole('status')).toContainText('Zum Aktualisieren brauchst du Internet');
  await page.screenshot({path:'test-results/update-mobile.png',fullPage:false});
});

test('Antwort bleibt zwei Sekunden sichtbar; Automatik lässt sich anhalten und fortsetzen',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:/Mathematik, Level /}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  const answer=()=>answerCorrect(page);
  await answer();await expect(page.locator('.feedback')).toBeVisible();
  await page.clock.install();
  // Re-arm via pause so the mocked clock owns both timers.
  await page.getByRole('button',{name:'Anhalten',exact:true}).click();
  await page.getByRole('button',{name:'Automatisch weiter',exact:true}).click();
  await page.clock.runFor(1999);await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
  await page.clock.runFor(1);await expect(page.getByText('Frage 2 von 10',{exact:true})).toBeVisible();
  await answer();await page.getByRole('button',{name:'Anhalten',exact:true}).click();
  await page.clock.runFor(5000);await expect(page.getByText('Frage 2 von 10',{exact:true})).toBeVisible();await expect(page.locator('.feedback')).toBeVisible();
  await page.getByRole('button',{name:'Automatisch weiter',exact:true}).click();await page.clock.runFor(3000);await expect(page.getByText('Frage 3 von 10',{exact:true})).toBeVisible();
  await answer();await page.getByRole('button',{name:'Nächste Frage',exact:true}).click();await page.clock.runFor(4000);await expect(page.getByText('Frage 4 von 10',{exact:true})).toBeVisible();
  await page.screenshot({path:'test-results/auto-next-mobile.png'});
});


test('Falsche Antworten zeigen die Lösung zwei Sekunden und wechseln einschließlich der letzten Frage automatisch',async({page})=>{
  await page.clock.install();await page.goto('/');await page.getByRole('button',{name:/Mathematik, Level /}).click();await page.getByRole('button',{name:'Alle',exact:true}).click();await page.getByRole('button',{name:'Grundrechenarten',exact:true}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  for(let i=0;i<10;i++) {
    await answerWrong(page);await expect(page.locator('.feedback p')).not.toBeEmpty();await expect(page.getByRole('button',{name:'Anhalten',exact:true})).toBeVisible();
    await page.clock.runFor(1900);await expect(page.getByText(`Frage ${i+1} von 10`,{exact:true})).toBeVisible();await page.clock.runFor(150);
  }
  await expect(page.getByRole('heading',{name:'Weiter üben.'})).toBeVisible();await expect(page.locator('.result-numbers')).toContainText('0/10');
});

test('echtes PWA-Update mit anschließendem Neuladen erhält lokale Nutzerdaten',async({page})=>{
  const root=resolve('dist');let version=1;
  const types:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
  const server=createServer((request,response)=>{
    const path=new URL(request.url!,'http://localhost').pathname;const file=resolve(root,'.'+(path==='/'?'/index.html':path));
    if(!file.startsWith(root+sep)){response.writeHead(403);response.end();return;}
    try { let body:Buffer|string=readFileSync(file);if(path==='/sw.js')body=body.toString()+`\nself.addEventListener('message',event=>{if(event.data?.type==='TEST_VERSION')event.ports[0].postMessage(${version});});`;
      response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});response.end(body);
    }catch{response.writeHead(404);response.end();}
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const address=server.address() as {port:number};
  try{
    await page.goto(`http://127.0.0.1:${address.port}/`);await expect(page.getByRole('button',{name:'App aktualisieren',exact:true})).toBeVisible();
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
    const data=emptyData();data.cards=[{id:'update-test',front:'Bleibt meine Karte?',back:'Ja.',subject:'math'}];data.progress['math-001']={box:2,due:123456,attempts:3,correct:2,lastAward:123};data.scores.math=30;data.journey=newJourney({},Date.now());data.journey.totalPoints=1145;data.journey.modules.math={level:11,progress:2,completed:[1,2,3,4,5,6,7,8,9,10],bossWins:[5,10],bossAttempts:[5,10],lastActivity:1};data.activities.germany.states['15']={attempts:2,correct:1,lastCorrect:true,at:123};data.activities.vocabulary.session={ids:['sentence.normal.v1.001'],index:0,answer:null,draft:[2,0],solved:false};data.activities.hangman.session={termId:'hangman.normal.001',guessed:['K'],hinted:true,revealed:false,recorded:false};data.study.reviews['update-test']={box:4,due:999999,attempts:5,known:4,lastRated:123};
    await page.evaluate(async data=>{const db=await new Promise<IDBDatabase>(resolve=>{const request=indexedDB.open('lernkick',1);request.onsuccess=()=>resolve(request.result);});await new Promise<void>(resolve=>{const tx=db.transaction('user','readwrite');tx.objectStore('user').put(data,'data');tx.oncomplete=()=>resolve();});db.close();},data);
    await page.getByRole('button',{name:'App aktualisieren',exact:true}).click();await expect(page.getByRole('status')).toContainText('Alles aktuell');
    version=2;
    await Promise.all([page.waitForEvent('load'),page.getByRole('button',{name:'App aktualisieren',exact:true}).click()]);
    const currentVersion=()=>page.evaluate(()=>new Promise<number>(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=event=>resolve(event.data);navigator.serviceWorker.controller!.postMessage({type:'TEST_VERSION'},[channel.port2]);}));
    await expect.poll(currentVersion).toBe(2);
    await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Karten verwalten',exact:true}).click();await expect(page.getByRole('button',{name:/Bleibt meine Karte.*Wiederholen/})).toBeVisible();
    const stored=await page.evaluate(()=>new Promise(resolve=>{const request=indexedDB.open('lernkick',1);request.onsuccess=()=>{const db=request.result;const get=db.transaction('user').objectStore('user').get('data');get.onsuccess=()=>{resolve(get.result);db.close();};};}));expect(stored).toMatchObject(data);expect((stored as any).journey.totalPoints).toBe(1145);
  }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
