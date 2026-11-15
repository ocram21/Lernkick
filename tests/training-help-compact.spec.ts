import {test,expect} from './appTest';
for(const pink of [false,true])for(const viewport of [{width:320,height:568},{width:390,height:844},{width:844,height:390}])test(`Kurze Trainingsinfo ohne Scrollen ${pink} ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('button',{name:'Training',exact:true}).click();}
 const bulb=page.getByRole('button',{name:'Bosskampf aus',exact:true});await expect(bulb.locator('.boss-bulb')).toBeVisible();
 const a=(await bulb.boundingBox())!,b=(await page.getByRole('button',{name:'Training-Hilfe',exact:true}).boundingBox())!;expect(b.x-a.x-a.width).toBeGreaterThanOrEqual(18);
 await page.getByRole('button',{name:'Training-Hilfe',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog.locator('details')).toHaveCount(0);
 const text=dialog.locator('.box-help-text');
 expect(await text.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
 expect(await dialog.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
 await expect(dialog).toContainText('Statistik');await expect(dialog).toContainText('acht richtige gewinnen');await expect(dialog).toContainText('Dual N-Back');
 if(viewport.width===320)await page.screenshot({path:`test-results/training-info-short-${pink}.png`});
});
test('Rote Bosslampe leuchtet nur bei eingeschaltetem Bossmodus',async({page})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();await page.getByRole('button',{name:'Einstellungen',exact:true}).click();
 for(let i=0;i<5;i++)await page.getByRole('button',{name:'LernKick Startseite'}).click();await page.getByRole('button',{name:'Training',exact:true}).click();
 const lamp=page.locator('.boss-bulb');const off=await lamp.evaluate(el=>({fill:getComputedStyle(el).fill,filter:getComputedStyle(el).filter}));expect(off.filter).toBe('none');
 await page.getByRole('button',{name:'Bosskampf aus',exact:true}).click();await expect(page.getByRole('button',{name:'Bosskampf an',exact:true})).toHaveAttribute('aria-pressed','true');
 const on=await lamp.evaluate(el=>({fill:getComputedStyle(el).fill,filter:getComputedStyle(el).filter}));expect(on.fill).not.toBe(off.fill);expect(on.filter).toContain('drop-shadow');
 await page.screenshot({path:'test-results/training-bulb-on.png'});
 await page.getByRole('button',{name:'Bosskampf an',exact:true}).click();expect(await lamp.evaluate(el=>getComputedStyle(el).filter)).toBe('none');
});
