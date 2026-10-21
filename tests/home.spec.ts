import { test, expect } from './appTest';
for(const viewport of [{width:320,height:568},{width:390,height:844},{width:1440,height:900}])test(`Neun beschriftete Tasten: ${viewport.width}`,async({page})=>{await page.setViewportSize(viewport);await page.goto('/');await expect(page.getByRole('heading',{name:'Dein Lern-Kick'})).toBeVisible();await expect(page.locator('.calculator-key')).toHaveCount(9);for(const name of ['Mathematik','Deutsch','Sozialkunde','Biologie','Geographie']){const button=page.getByRole('button',{name:new RegExp('^'+name+', Level ')});await expect(button.locator('.key-name')).toHaveText(({Mathematik:'MA',Deutsch:'D',Sozialkunde:'SK',Biologie:'Bio',Geographie:'Geo'} as Record<string,string>)[name]);const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
test('Hilfe erklärt die Funktionen und führt zurück zur Fächerauswahl',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Hilfe',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Kurze Hilfe'})).toBeVisible();
  expect((await page.locator('.help-page').innerText()).split(/\s+/).length).toBeLessThan(180);
  await expect(page.locator('.help-page')).not.toContainText(/IndexedDB|Algorithmus|24 Stunden|drei Sekunden/);
  await page.getByText('App installieren',{exact:true}).click();await expect(page.locator('.install-help')).toContainText('Android');await expect(page.locator('.install-help')).toContainText('iPhone');
  await page.getByRole('button',{name:'Ausgang',exact:true}).click();await expect(page.getByRole('heading',{name:'Dein Lern-Kick'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
  await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
});

for(const exit of ['Pfeil','Logo'])test(`Ausgang über ${exit} erhält die Runde ohne Rückfrage`,async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:/Mathematik, Level 1/}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  const {answerCorrect,storedAttempts}=await import('./helpers');await answerCorrect(page);
  await page.getByRole('button',{name:exit==='Logo'?'LernKick Startseite':'Ausgang',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Dein Lern-Kick'})).toBeVisible();expect(await storedAttempts(page)).toBe(1);
});
