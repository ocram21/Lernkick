import {test,expect} from './appTest';
import {answerWrong} from './helpers';
test('Fehlerrückmeldung bleibt stehen und Nachschlagen erhält die Aufgabe',async({page})=>{
 await page.goto('/');await page.locator('[data-module="math"]').click();await page.getByRole('button',{name:'Üben',exact:true}).click();
 const prompt=await page.locator('.question h1').innerText();
 await page.getByRole('button',{name:'Regel ansehen',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Regel nachschlagen'})).toBeVisible();
 await page.screenshot({path:'test-results/audit-reference-dialog.png'});
 await page.getByRole('button',{name:'Zur Aufgabe zurück',exact:true}).click();
 await expect(page.locator('.question h1')).toHaveText(prompt);
 await answerWrong(page);await expect(page.locator('.feedback')).toBeVisible();
 await page.waitForTimeout(2500);await expect(page.locator('.question h1')).toHaveText(prompt);await expect(page.locator('.feedback')).toBeVisible();
});
test('Tafelwerk bietet sichtbaren Rückweg und größere Leseansicht',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();
 await page.locator('[data-lesson="vorzeichen"]').click();await page.getByRole('button',{name:'Große Leseansicht',exact:true}).click();
 await page.screenshot({path:'test-results/audit-reading.png'});
 await expect(page.locator('.tafelwerk')).toHaveClass(/tafelwerk-reading/);await expect(page.locator('.tafelwerk-explanation')).toBeVisible();
 await page.getByRole('button',{name:'Themen',exact:true}).click();await expect(page.locator('[data-lesson="vorzeichen"]')).toBeVisible();
});
