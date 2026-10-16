import { test, expect } from '@playwright/test';
for (const subject of ['Mathematik','Deutsch']) test(`${subject}: vollständige Runde, Speicherung, offline`,async({page,context})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
  await page.getByRole('button',{name:new RegExp(subject+' .*10 Fragen')}).click();
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
  await page.getByRole('button',{name:new RegExp(subject+' .*10 Fragen')}).click();
  await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
});
test('eigene Karten erstellen, bearbeiten, wiederholen und löschen',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Meine Karten'}).click();await page.getByRole('button',{name:'Neue Karte',exact:true}).click();await page.getByRole('textbox',{name:'Frage',exact:true}).fill('Was ist ein Viertel von 20?');await page.getByRole('textbox',{name:'Antwort',exact:true}).fill('5');await page.getByRole('button',{name:'Karte speichern'}).click();await expect(page.locator('.card-editor')).toHaveCount(0);await page.reload();await page.getByRole('button',{name:'Meine Karten'}).click();await page.getByRole('button',{name:/Was ist ein Viertel von 20.*Wiederholen/}).click();await page.getByRole('button',{name:'Antwort zeigen'}).click();await expect(page.locator('.review h2')).toHaveText('5');await page.getByRole('button',{name:'Karte bearbeiten: Was ist ein Viertel von 20?'}).click();await page.getByRole('textbox',{name:'Antwort',exact:true}).fill('20 geteilt durch 4 = 5');await page.getByRole('button',{name:'Karte speichern'}).click();await expect(page.locator('.card-editor')).toHaveCount(0);page.on('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Karte löschen: Was ist ein Viertel von 20?'}).click();await expect(page.getByRole('heading',{name:'Platz für dein Wissen.'})).toBeVisible();});
test('kein horizontaler Überlauf auf kleinen Displays',async({page})=>{await page.setViewportSize({width:320,height:740});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});});
