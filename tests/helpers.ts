import {replayEquation,numberText,equationText} from '../src/learning/equations';
import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import type { Question } from '../src/lib/schema';
export const catalog:Question[]=['math','german','social','biology','geography'].flatMap(subject=>JSON.parse(readFileSync(new URL(`../src/content/${subject}.json`,import.meta.url),'utf8')).questions);
const topicVocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabularyTopics.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
const advancedVocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabularyAdvanced.json',import.meta.url),'utf8')) as {word:string;meaning:string}[];
const vocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabulary.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
export function solution(prompt:string,available:string[]=[]):string {
  const word=[...advancedVocabulary,...topicVocabulary,...vocabulary].find(entry=>prompt.endsWith(`Was bedeutet „${entry.word}“?`)&&available.includes(entry.meaning));if(word&&available.includes(word.meaning))return word.meaning;
  const question=catalog.find(q=>q.prompt===prompt);if(question)return question.options[question.correct];
  let match=prompt.match(/^Welche Zahl ist größer: (\d+) oder (\d+)\?$/);if(match)return String(Math.max(+match[1],+match[2]));
  match=prompt.match(/^Wie viel ist (\d+) ([+−×÷]) (\d+)\?$/);
  if(match){const a=+match[1],b=+match[3];return String(match[2]==='+'?a+b:match[2]==='−'?a-b:match[2]==='×'?a*b:a/b);}
  match=prompt.match(/^(\d+) Kisten enthalten je (\d+) Flaschen/);if(match)return String(+match[1]*+match[2]);
  match=prompt.match(/^(\d+) Stifte werden gleichmäßig auf (\d+) Personen/);if(match)return String(+match[1]/+match[2]);
  match=prompt.match(/^Wie viel sind (\d+)\/(\d+) von (\d+)\?$/);if(match)return String(+match[3]*+match[1]/+match[2]);
  match=prompt.match(/^Wie viel sind (\d+) % von (\d+)/);if(match)return String(+match[1]*+match[2]/100);
  match=prompt.match(/^Überschlage (\d+) × ([\d,]+)/);if(match)return String(Math.round(+match[1]/10)*10*Math.round(Number(match[2].replace(',','.'))));
  throw new Error('Keine Testlösung für: '+prompt);
}
export async function solveEquation(page:Page){
 const read=()=>page.evaluate(()=>new Promise<any>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>{resolve(g.result.rounds.math);r.result.close();};};}));
 for(let i=0;i<8;i++){let round=await read();for(let retry=0;retry<30;retry++){const lines=await page.locator('.equation-lines').innerText();const last=equationText(replayEquation(round.current.equation,round.equationSteps??[]).equation);if(lines.trim().endsWith(last))break;await page.waitForTimeout(20);round=await read();}if(round.answer!==null)return;const q=replayEquation(round.current.equation,round.equationSteps??[]).equation;const op=q.c.n?`-${numberText(q.c)}x`:q.b.n?`-${numberText(q.b)}`:`:${numberText(q.a)}`;await page.getByRole('textbox',{name:'Operation',exact:true}).fill(op);await page.getByRole('button',{name:'Prüfen',exact:true}).click();await page.waitForTimeout(30);}throw Error('Gleichung wurde nicht abgeschlossen');
}
export async function answerCorrect(page:Page) {
  if(await page.locator('.equation-work').count()){await solveEquation(page);return;}
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().waitFor({state:'visible'});
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=await visibleSolution(page,available);
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').filter({has:page.getByText(value,{exact:true})}).click();
}
export async function answerWrong(page:Page) {
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=await visibleSolution(page,available);const buttons=page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button');
  const count=await buttons.count();for(let i=0;i<count;i++)if(await buttons.nth(i).locator('span').nth(1).innerText()!==value){await buttons.nth(i).click();return;}
  throw new Error('Keine falsche Option');
}
export async function storedAttempts(page:Page):Promise<number> {
  return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,get=db.transaction('user').objectStore('user').get('data');get.onsuccess=()=>{resolve(Object.values(get.result.progress as Record<string,{attempts:number}>).reduce((sum,entry)=>sum+entry.attempts,0));db.close();};get.onerror=()=>reject(get.error);};}));
}

async function visibleSolution(page:Page,available:string[]){
 const prompt=await page.locator('.question h1').innerText();
 const current=await page.evaluate(()=>new Promise<any>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>{resolve(Object.values(g.result.rounds).map((r:any)=>r.current));r.result.close();};};}));
 const task=current.find((q:any)=>q.prompt===prompt);return task?task.options[task.correct]:solution(prompt,available);
}
