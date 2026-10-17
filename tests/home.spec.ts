import { test, expect } from '@playwright/test';
for(const viewport of [{width:320,height:568},{width:360,height:640},{width:390,height:844},{width:844,height:390},{width:1440,height:900}]) {
  test(`Startseite passt ohne Scrollen: ${viewport.width}×${viewport.height}`,async({page})=>{
    await page.setViewportSize(viewport);await page.goto('/');
    await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const nav=await page.getByRole('navigation',{name:'Hauptnavigation'}).boundingBox();
    for(const name of ['Mathematik','Deutsch','Sozialkunde','Biologie','Geografie']) {
      const button=page.getByRole('button',{name:new RegExp(name+' .*100 Fragen')});
      const box=await button.boundingBox();expect(box!.y).toBeGreaterThanOrEqual(0);expect(box!.y+box!.height).toBeLessThanOrEqual(nav!.y+1);expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(await button.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
    }
    const update=await page.getByRole('button',{name:'App aktualisieren',exact:true}).boundingBox();const logo=await page.getByRole('button',{name:'LernKick Startseite'}).boundingBox();
    expect(update!.x).toBeGreaterThanOrEqual(logo!.x+logo!.width);expect(update!.y).toBeLessThanOrEqual(logo!.y+logo!.height);
    await page.screenshot({path:`test-results/compact-home-${viewport.width}.png`});
  });
}
test('Hilfe erklärt die Funktionen und führt zurück zur Fächerauswahl',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Hilfe',exact:true}).click();
  await expect(page.getByRole('heading',{name:'So geht LernKick.'})).toBeVisible();
  for(const heading of ['Loslegen','Antworten und Hilfe','Deinen Lernweg wählen','Deinen Fortschritt sehen','Aktualisieren und sichern']) await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();
  expect((await page.locator('.help-page').innerText()).split(/\s+/).length).toBeLessThan(260);
  await expect(page.locator('.help-page')).not.toContainText(/IndexedDB|Algorithmus|24 Stunden|drei Sekunden/);
  await page.getByRole('button',{name:'Zurück zum Lernen'}).click();await expect(page.getByRole('heading',{name:'Was geht heute?'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
  await page.getByRole('button',{name:'Mathematik 100 Fragen'}).click();await expect(page.getByText('Frage 1 von 10',{exact:true})).toBeVisible();
});
