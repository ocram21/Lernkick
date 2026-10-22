import { test, expect } from './appTest';
for(const viewport of [{width:320,height:568},{width:375,height:667},{width:390,height:844},{width:1440,height:900}])test(`Neun beschriftete Tasten: ${viewport.width}`,async({page})=>{await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await expect(page.locator('.calculator-key')).toHaveCount(9);for(const name of ['Mathematik','Deutsch','Sozialkunde','Biologie','Geographie']){const button=page.getByRole('button',{name:new RegExp('^'+name+', Level ')});await expect(button.locator('.key-name')).toHaveText(({Mathematik:'MA',Deutsch:'D',Sozialkunde:'SK',Biologie:'Bio',Geographie:'Geo'} as Record<string,string>)[name]);const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);}await expect(page.getByRole('heading',{name:'Dein Lern-Kick'})).toHaveCount(0);const toggle=(await page.locator('.global-difficulty').boundingBox())!,heading=(await page.locator('.section-heading').boundingBox())!,nav=(await page.locator('.bottom-nav').boundingBox())!,last=(await page.locator('.calculator-key').last().boundingBox())!;expect(toggle.x).toBeCloseTo(heading.x,0);expect(toggle.y).toBeLessThan(heading.y+4);expect(last.y+last.height).toBeLessThanOrEqual(nav.y);expect(nav.y+nav.height).toBeLessThanOrEqual(viewport.height);const layout=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,viewport:innerHeight,overflow:[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().bottom>innerHeight+1).map(el=>({cls:el.className,bottom:el.getBoundingClientRect().bottom}))}));expect(layout.width).toBeLessThanOrEqual(viewport.width);expect(layout.height,JSON.stringify(layout)).toBeLessThanOrEqual(viewport.height+1);if(viewport.width===320)await page.screenshot({path:'test-results/home-switch-top-320.png'});});
test('Hilfe erklärt die Funktionen und führt zurück zur Fächerauswahl',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Hilfe',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Kurze Hilfe'})).toBeVisible();
  expect((await page.locator('.help-page').innerText()).split(/\s+/).length).toBeLessThan(180);
  await expect(page.locator('.help-page')).not.toContainText(/IndexedDB|Algorithmus|24 Stunden|drei Sekunden/);
  await page.getByText('App installieren',{exact:true}).click();await expect(page.locator('.install-help')).toContainText('Android');await expect(page.locator('.install-help')).toContainText('iPhone');
  await page.getByRole('button',{name:'Ausgang',exact:true}).click();await expect(page.locator('.calculator-grid')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
  await page.getByRole('button',{name:'Mathematik, Level 1'}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
});

for(const exit of ['Pfeil','Logo'])test(`Ausgang über ${exit} erhält die Runde ohne Rückfrage`,async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:/Mathematik, Level 1/}).click();await page.getByRole('button',{name:'Runde starten',exact:true}).click();
  const {answerCorrect,storedAttempts}=await import('./helpers');await answerCorrect(page);
  await page.getByRole('button',{name:exit==='Logo'?'LernKick Startseite':'Ausgang',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.calculator-grid')).toBeVisible();expect(await storedAttempts(page)).toBe(1);
});
