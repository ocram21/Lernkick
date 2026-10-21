import {test as base,expect} from '@playwright/test';
import type {Page,BrowserContext} from '@playwright/test';
// Existing feature tests enter through the ordinary access UI. No production bypass exists.
async function attach(page:Page){
 await page.addLocatorHandler(page.locator('.access-screen form'),async()=>{
  await page.evaluate(()=>{
   const parts=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',calendar:'gregory',numberingSystem:'latn'}).formatToParts(new Date());
   const value=(kind:string)=>parts.find(p=>p.type===kind)!.value;
   const code=String(Math.floor(Math.sqrt(Number(value('day')+value('month')+value('year').padStart(4,'0'))))).padStart(4,'0');
   const input=document.querySelector<HTMLInputElement>('#access-pin')!;
   Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,code);input.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.getByRole('button',{name:'Öffnen',exact:true}).click();
 });
}
function attachContext(context:BrowserContext){context.on('page',page=>{void attach(page);});}
export const test=base.extend({browser:async({browser},use)=>{
 const proxy=new Proxy(browser,{get(target,key){if(key==='newContext')return async(...args:Parameters<typeof browser.newContext>)=>{const context=await target.newContext(...args);attachContext(context);return context;};const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;}});
 await use(proxy);
},page:async({page},use)=>{await attach(page);await use(page);}});
export {expect};
export type {Page,BrowserContext,Locator} from '@playwright/test';
