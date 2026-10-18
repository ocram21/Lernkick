import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import type { Question } from '../src/lib/schema';
export const catalog:Question[]=['math','german','social','biology','geography'].flatMap(subject=>JSON.parse(readFileSync(new URL(`../src/content/${subject}.json`,import.meta.url),'utf8')).questions);
const topicVocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabularyTopics.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
const vocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabulary.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
export function solution(prompt:string,available:string[]=[]):string {
  const word=[...topicVocabulary,...vocabulary].find(entry=>prompt===`Was bedeutet „${entry.word}“?`&&available.includes(entry.meaning));if(word&&available.includes(word.meaning))return word.meaning;
  const question=catalog.find(q=>q.prompt===prompt);if(question)return question.options[question.correct];
  let match=prompt.match(/^Welche Zahl ist größer: (\d+) oder (\d+)\?$/);if(match)return String(Math.max(+match[1],+match[2]));
  match=prompt.match(/^Wie viel ist (\d+) ([+−×÷]) (\d+)\?$/);
  if(match){const a=+match[1],b=+match[3];return String(match[2]==='+'?a+b:match[2]==='−'?a-b:match[2]==='×'?a*b:a/b);}
  match=prompt.match(/^(\d+) Kisten enthalten je (\d+) Flaschen/);if(match)return String(+match[1]*+match[2]);
  match=prompt.match(/^(\d+) Stifte werden gleichmäßig auf (\d+) Personen/);if(match)return String(+match[1]/+match[2]);
  throw new Error('Keine Testlösung für: '+prompt);
}
export async function answerCorrect(page:Page) {
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().waitFor({state:'visible'});
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=solution(await page.locator('.question h1').innerText(),available);
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').filter({has:page.getByText(value,{exact:true})}).click();
}
export async function answerWrong(page:Page) {
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=solution(await page.locator('.question h1').innerText(),available);const buttons=page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button');
  const count=await buttons.count();for(let i=0;i<count;i++)if(await buttons.nth(i).locator('span').nth(1).innerText()!==value){await buttons.nth(i).click();return;}
  throw new Error('Keine falsche Option');
}
export async function storedAttempts(page:Page):Promise<number> {
  return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,get=db.transaction('user').objectStore('user').get('data');get.onsuccess=()=>{resolve(Object.values(get.result.progress as Record<string,{attempts:number}>).reduce((sum,entry)=>sum+entry.attempts,0));db.close();};get.onerror=()=>reject(get.error);};}));
}
