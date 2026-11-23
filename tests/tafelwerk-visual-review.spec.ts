import {test,expect} from './appTest';
test('Neue Übersichten bleiben vollständig auf einer Ansicht',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 for(const [category,id] of [['Terme & Gleichungen','gleichungssystem'],['Alltagsrechnen','dreisatz-direkt'],['Alltagsrechnen','einheiten'],['Funktionen','quadratische-funktion'],['Geometrie','pythagoras'],['Geometrie','winkelbeziehungen'],['Geometrie','tafelprojektion'],['Geometrie','kreis'],['Geometrie','winkel-messen'],['Daten & Kombinationen','kombinatorik'],['Daten & Kombinationen','wahrscheinlichkeit']]){
  await page.getByRole('button',{name:category,exact:true}).click();await page.locator(`[data-lesson="${id}"]`).click();
  await expect(page.locator('.tafelwerk-step-controls')).toHaveCount(0);
  expect(await page.locator('.tafelwerk-board-body').evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1),id).toBe(true);
  await page.screenshot({path:`test-results/uebersicht-${id}.png`});await page.getByRole('button',{name:'Mathematik',exact:true}).click();
 }
});
