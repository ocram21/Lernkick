import {test,expect,type Page} from './appTest';
async function checkLightSurfaces(page:Page){
 const failures=await page.evaluate(()=>{
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
  const rgb=(value:string)=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data];};
  const luminance=(c:number[])=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  return [...document.querySelectorAll<HTMLElement>('button,span,p,label,small,strong,h1,h2,h3,legend,summary,a')].flatMap(el=>{
   const text=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
   if(!text||!el.checkVisibility()||el.closest('[disabled],.sr-only,[aria-hidden=true]'))return [];
   const rect=el.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight||rect.width===0)return [];
   let current:HTMLElement|null=el,bg:number[]|undefined;
   while(current){const style=getComputedStyle(current),c=rgb(style.backgroundColor);if(c[3]===255){bg=c;break;}current=current.parentElement;}
   if(!bg||luminance(bg)<.6)return [];
   const ink=rgb(getComputedStyle(el).color),a=luminance(ink),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   return ratio<4.5?[{text:text.slice(0,60),class:el.className,contrast:ratio.toFixed(2)}]:[];
  });
 });expect(failures).toEqual([]);
}
test('Pink: lesbare Schrift auf hellen Flächen in Navigation, Auswahl und Tafeln',async({page})=>{
 await page.goto('/');await expect(page.locator('.calculator-grid')).toBeVisible();
 await page.getByRole('button',{name:'Einstellungen',exact:true}).click();await page.getByRole('switch',{name:'Mit Pink',exact:true}).click();await checkLightSurfaces(page);
 await page.getByRole('button',{name:'Ausgang',exact:true}).click();await checkLightSurfaces(page);
 await page.getByRole('button',{name:'Training-Hilfe',exact:true}).click();await checkLightSurfaces(page);await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Lernkasten',exact:true}).click();await checkLightSurfaces(page);
 await page.getByRole('button',{name:'Karten hinzufügen',exact:true}).click();await checkLightSurfaces(page);await page.getByRole('button',{name:'Abbrechen',exact:true}).click();
 await page.getByRole('button',{name:'Tafelwerk',exact:true}).click();await checkLightSurfaces(page);
 await page.getByRole('button',{name:'Mathematik',exact:true}).click();await checkLightSurfaces(page);
 await page.getByRole('button',{name:'Schriftlich rechnen',exact:true}).click();await checkLightSurfaces(page);
 await page.locator('[data-lesson="schriftlich-subtrahieren"]').click();await checkLightSurfaces(page);await page.getByRole('button',{name:'Mathematik',exact:true}).click();
 await page.getByRole('button',{name:'Deutsch',exact:true}).click();await checkLightSurfaces(page);await page.locator('[data-lesson="DEU-01"]').click();await checkLightSurfaces(page);
 await page.screenshot({path:'test-results/pink-tafel-wortarten.png'});
 await page.getByRole('button',{name:'Training',exact:true}).click();
 const home=()=>page.getByRole('button',{name:'Ausgang',exact:true}).click();
 for(const module of ['math','german','social','biology','geography']){
  await page.locator(`[data-module=${module}]`).click();await checkLightSurfaces(page);
  await page.getByRole('button',{name:'Üben',exact:true}).click();await checkLightSurfaces(page);await home();
 }
 await page.getByRole('button',{name:'Games',exact:true}).click();await checkLightSurfaces(page);await home();
 await page.locator('[data-module=hangman]').click();await checkLightSurfaces(page);await home();
 await page.locator('[data-module=germany]').click();await checkLightSurfaces(page);await home();
 await page.getByRole('button',{name:'Persönliche Statistik öffnen'}).click();await checkLightSurfaces(page);

});
