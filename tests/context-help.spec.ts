import {test,expect} from './appTest';
for(const pink of [false,true])for(const width of [320,390,1440])test(`Bereichshilfe und zentrierte Fachkacheln ${pink} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 if(pink){await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await page.getByRole('button',{name:'Training',exact:true}).click();}
 const info=page.getByRole('button',{name:'Training-Hilfe',exact:true});const reference=(await info.boundingBox())!;
 const boss=(await page.locator('.boss-switch').boundingBox())!;expect(boss.x+boss.width).toBeLessThan(reference.x);await info.click();
 const dialog=page.getByRole('dialog');await expect(dialog).toContainText('Training und Schwierigkeit');await expect(dialog).toContainText('Games');await expect(dialog).toContainText('Score und Skill');await expect(dialog.locator('details')).toHaveCount(0);await expect(dialog).toContainText('Nach zwei vollständigen Runden');await expect(dialog).not.toContainText('Sicherung importieren');
 await page.keyboard.press('Escape');await expect(info).toBeFocused();
 for(const [section,label] of [['Lernkasten','Lernkasten-Hilfe'],['Tafelwerk','Tafelwerk-Hilfe']]){
  await page.getByRole('button',{name:section,exact:true}).click();const box=(await page.getByRole('button',{name:label,exact:true}).boundingBox())!;expect(box.x).toBeCloseTo(reference.x,0);expect(box.y).toBeCloseTo(reference.y,0);
  for(const tile of await page.locator('.box-subjects .calculator-key').all()){
   const centered=await tile.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector('.key-name')!.getBoundingClientRect();return Math.abs(a.x+a.width/2-b.x-b.width/2)<1&&getComputedStyle(el).textAlign==='center';});expect(centered).toBe(true);
  }
 }
 await page.getByRole('button',{name:'Einstellungen',exact:true}).click();const settingsInfo=page.getByRole('button',{name:'Einstellungen-Hilfe',exact:true});await expect(settingsInfo).toHaveText('');await settingsInfo.click();
 await expect(page.locator('.help-page')).toContainText('Einstellungen und Sicherung');await expect(page.locator('.help-page')).not.toContainText('Bosskampf');await expect(page.locator('.help-page')).not.toContainText('Games');
 await page.getByRole('button',{name:'Training',exact:true}).click();if(width===390)await page.screenshot({path:`test-results/training-info-${pink}.png`});
});
