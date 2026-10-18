import { test, expect } from '@playwright/test';
for(const viewport of [{width:320,height:568},{width:360,height:640},{width:390,height:844},{width:844,height:390},{width:1440,height:900}])test(`Fortschrittsbilder ohne Scrollen: ${viewport.width}×${viewport.height}`,async({page})=>{
  await page.setViewportSize(viewport);await page.goto('/');await page.getByRole('button',{name:'Fortschritt',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Fortschritt',exact:true})).toBeVisible();
  const main=page.getByRole('main');await expect(main.getByRole('heading')).toHaveCount(1);await expect(main.locator('p,details,.progress-summary,.score-list')).toHaveCount(0);await expect(main).not.toContainText(/Wimmelbild|Bestleistung|Punkte/);
  const selector=page.getByRole('group',{name:'Fach für den Fortschritt'});
  for(const [name,short] of [['Mathematik','Mathe'],['Deutsch','Deutsch'],['Sozialkunde','Sozialkunde'],['Biologie','Bio'],['Geografie','Geo']]){
    const button=selector.getByRole('button',{name:new RegExp('^'+name+' ')});await expect(button).toHaveText(short);const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);expect(box!.width).toBeGreaterThanOrEqual(44);await button.click();await expect(button).toHaveAttribute('aria-pressed','true');
    const image=page.locator('.competency-mosaic');await expect(image).toBeVisible();await expect(image.getByRole('img')).toHaveCount(12);const picture=await image.boundingBox();const nav=await page.getByRole('navigation',{name:'Hauptnavigation'}).boundingBox();expect(picture!.y+picture!.height).toBeLessThanOrEqual(nav!.y);expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await selector.getByRole('button',{name:/^Mathematik /}).click();await page.screenshot({path:`test-results/progress-compact-${viewport.width}.png`});
});
