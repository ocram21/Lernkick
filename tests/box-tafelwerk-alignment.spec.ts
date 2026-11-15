import {test,expect} from './appTest';
for(const pink of [false,true])for(const {width,height,compact} of [{width:320,height:568,compact:false},{width:390,height:667,compact:false},{width:390,height:844,compact:false},{width:1440,height:900,compact:false},{width:390,height:844,compact:true}])test(`Gleiche Fachpositionen und Info in Lernkasten und Tafelwerk ${pink} ${width}x${height} kompakt ${compact}`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink||compact){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();if(pink)await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();if(compact)await page.getByRole('switch',{name:'Kompakt',exact:true}).click();}
 await page.getByRole('button',{name:'Lernkasten',exact:true}).click();await expect(page.getByRole('button',{name:'Ausgang',exact:true})).toHaveCount(0);
 const geometry=()=>page.locator('.box-subjects button').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));
 const box=await geometry();await page.getByRole('button',{name:'Deutsch',exact:true}).click();
 const color=await page.locator('.box-subjects [aria-pressed=true]').evaluate(el=>getComputedStyle(el).backgroundColor);expect(color).toBe('rgb(134, 80, 155)');
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();expect(await geometry()).toEqual(box);
 await expect(page.getByRole('button',{name:'Mathematik',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-lesson="vorzeichen"]')).toBeVisible();
 await page.getByRole('button',{name:'Tafelwerk-Hilfe',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('Das Tafelwerk');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Tafelwerk-Hilfe',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();expect(await geometry()).toEqual(box);expect(await page.locator('.box-subjects [aria-pressed=true]').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe(color);
 if(width===390)await page.screenshot({path:`test-results/aligned-tafelwerk-${pink}.png`});
});
