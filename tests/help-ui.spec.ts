import {test,expect} from './appTest';
for(const pink of [false,true])for(const size of [{width:320,height:568},{width:375,height:667},{width:390,height:844},{width:1440,height:900}])test(`UI-Feinschliff ${size.width} Pink ${pink}`,async({page})=>{
 await page.setViewportSize(size);await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('button',{name:'Ausgang',exact:true}).click();}
 const geometry=await page.locator('.home-console').evaluate(el=>{const r=el.getBoundingClientRect(),keys=el.querySelectorAll('.calculator-key'),last=keys[keys.length-1].getBoundingClientRect(),style=getComputedStyle(el);return {gap:parseFloat(style.marginTop),bottom:r.bottom-last.bottom,left:keys[0].getBoundingClientRect().left-r.left,highlight:getComputedStyle(el,'::after').boxShadow,bottomEdge:r.bottom,nav:document.querySelector('.bottom-nav')!.getBoundingClientRect().top};});
 expect(geometry.gap).toBe(size.height<=600?12:24);expect(geometry.bottom).toBeCloseTo(3,1);expect(geometry.left).toBeCloseTo(3,1);expect(geometry.highlight).not.toBe('none');expect(geometry.bottomEdge).toBeLessThanOrEqual(geometry.nav);
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
 const shadows=await page.locator('.calculator-key[data-module="germany"] .key-name,.calculator-key[data-module="vocabulary"] .key-name').evaluateAll(elements=>elements.map(el=>getComputedStyle(el).textShadow));expect(shadows[0]).toBe(shadows[1]);expect(shadows[0]).not.toBe('none');
 if(size.width===320)await page.screenshot({path:`test-results/help-ui-home-${pink}.png`});
 await page.getByRole('button',{name:'Games',exact:true}).click();await page.getByRole('button',{name:'Codeknacker',exact:true}).click();
 const dot=await page.locator('.code-feedback i').first().evaluate(el=>({background:getComputedStyle(el).backgroundColor,radius:getComputedStyle(el).borderRadius,width:el.getBoundingClientRect().width}));expect(dot).toEqual({background:'rgb(136, 136, 136)',radius:'50%',width:8});
 expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
 if(size.width===320)await page.screenshot({path:`test-results/help-ui-code-${pink}.png`});
});
test('Aktuelle Hilfe ohne Sprachausgabe auch offline',async({page,context})=>{
 await page.goto('/');await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Hilfe',exact:true}).click();
 await expect(page.locator('.help-page')).not.toContainText('Balken darunter');await expect(page.locator('.help-page')).toContainText('von 80 auf 72');await expect(page.getByRole('button',{name:/vorlesen/i})).toHaveCount(0);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('button',{name:'Hilfe',exact:true}).click();await expect(page.locator('.help-page')).toContainText('keine weitere passende Farbe');
});
