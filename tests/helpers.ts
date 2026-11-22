import {replayEquation,numberText,equationText} from '../src/learning/equations';
import { readFileSync } from 'node:fs';
import {expect} from './appTest';
import {grammarTasks} from '../src/activities/grammar';
import {proverbTasks} from '../src/activities/proverbs';
import {spellingTasks} from '../src/activities/spelling';
import subjectSentences from '../src/content/subjectSentences.json' with {type:'json'};
import type { Page } from '@playwright/test';
import type { Question } from '../src/lib/schema';
const complexCatalog=JSON.parse(readFileSync(new URL('../src/content/complexes/catalog.json',import.meta.url),'utf8')) as {id:string}[];
const newQuestions:Question[]=complexCatalog.flatMap(c=>JSON.parse(readFileSync(new URL(`../src/content/complexes/${c.id}.json`,import.meta.url),'utf8')));
export const catalog:Question[]=[...newQuestions,...['math','german','social','biology','geography'].flatMap(subject=>JSON.parse(readFileSync(new URL(`../src/content/${subject}.json`,import.meta.url),'utf8')).questions)];
const topicVocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabularyTopics.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
const advancedVocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabularyAdvanced.json',import.meta.url),'utf8')) as {word:string;meaning:string}[];
const vocabulary=JSON.parse(readFileSync(new URL('../src/content/vocabulary.json',import.meta.url),'utf8')).entries as {word:string;meaning:string}[];
const sentencePacks=[...JSON.parse(readFileSync(new URL('../src/content/sentences.json',import.meta.url),'utf8')).tasks,...JSON.parse(readFileSync(new URL('../src/content/sentencesAdvanced.json',import.meta.url),'utf8')),...subjectSentences];
const generatedSentence=(id:string)=>{const m=id.match(/^sentence\.generated\.v1\.(\d+)\.(\d+)\.(\d+)$/);if(!m)return undefined;const p=+m[1],a=+m[2],t=+m[3],person=['Mia','Ali','Lena','Ben','Nora','Emil','Sara','Tim','Lea','Omar'][p],actions=[['liest','ein Buch','lesen'],['schreibt','einen Brief','schreiben'],['zeichnet','ein Bild','zeichnen'],['plant','einen Ausflug','planen'],['kauft','frisches Obst','kaufen'],['prüft','die Rechnung','prüfen'],['repariert','das Fahrrad','reparieren'],['sortiert','die Unterlagen','sortieren']][a];if(!person||!actions)return undefined;const tokens=t===0?[person,actions[0],'heute',actions[1],',','weil','das','wichtig','ist','.']:t===1?['Morgen',actions[0],person,actions[1],'.']:[person,'möchte',actions[1],actions[2],',','bevor','der Unterricht','beginnt','.'];return {solutions:[tokens]};};
const findSentence=(id:string)=>sentencePacks.find((value:any)=>value.id===id)??generatedSentence(id);
export function solution(prompt:string,available:string[]=[]):string {
  const word=[...advancedVocabulary,...topicVocabulary,...vocabulary].find(entry=>prompt.endsWith(`Was bedeutet „${entry.word}“?`)&&available.includes(entry.meaning));if(word&&available.includes(word.meaning))return word.meaning;
  const normalize=(value:string)=>value.replace(/\s+/g,' ').trim();const activityQuestion=[...grammarTasks,...proverbTasks,...spellingTasks].find(q=>normalize(q.prompt)===normalize(prompt));if(activityQuestion)return activityQuestion.options[0];
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
 for(let i=0;i<8;i++){let round=await read();for(let retry=0;retry<30;retry++){const lines=await page.locator('.equation-lines').innerText();const last=equationText(replayEquation(round.current.equation,round.equationSteps??[]).equation);if(lines.trim().endsWith(last))break;await page.waitForTimeout(20);round=await read();}if(round.answer!==null)return;const q=replayEquation(round.current.equation,round.equationSteps??[]).equation;const op=q.c.n?`${q.c.n<0?'+':'-'}${numberText({...q.c,n:Math.abs(q.c.n)})}x`:q.b.n?`${q.b.n<0?'+':'-'}${numberText({...q.b,n:Math.abs(q.b.n)})}`:`:${numberText(q.a)}`;await page.getByRole('textbox',{name:'Operation auf beiden Seiten',exact:true}).fill(op);await page.getByRole('button',{name:'Prüfen',exact:true}).click();await page.waitForTimeout(30);}throw Error('Gleichung wurde nicht abgeschlossen');
}
export async function answerCorrect(page:Page) {
  await page.locator('.sentence-builder, .equation-work, [aria-label="Antwortmöglichkeiten"]').first().waitFor({state:'visible'});
  if(await page.locator('.sentence-builder').count()){const session=await page.evaluate(()=>new Promise<any>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>resolve(g.result.activities.vocabulary.session);};}));const task=findSentence(session.ids[session.index]) as any;if(!task)throw new Error(`Keine Satzlösung für ${session.ids[session.index]}`);const placed=page.getByRole('group',{name:'Dein Satz',exact:true}).getByRole('button',{name:/^Baustein/});for(const token of task.solutions[0]){const button=page.getByRole('button',{name:`Einsetzen: ${token}`,exact:true}).first();if(await button.count()){const count=await placed.count();await button.click();await expect(placed).toHaveCount(count+1);}}await page.getByRole('button',{name:'Überprüfen',exact:true}).click();return;}
  if(await page.locator('.equation-work').count()){await solveEquation(page);return;}
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').first().waitFor({state:'visible'});
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=await visibleSolution(page,available);
  await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').filter({has:page.getByText(value,{exact:true})}).click();
}
export async function answerWrong(page:Page) {
  await page.locator('.sentence-builder, .equation-work, [aria-label="Antwortmöglichkeiten"]').first().waitFor({state:'visible'});
  if(await page.locator('.sentence-builder').count()){const session=await page.evaluate(()=>new Promise<any>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>resolve(g.result.activities.vocabulary.session);};}));const task=findSentence(session.ids[session.index]) as any;if(!task)throw new Error(`Keine Satzlösung für ${session.ids[session.index]}`);const wrong=task.solutions[1]??[...task.solutions[0]].reverse(),placed=page.getByRole('group',{name:'Dein Satz',exact:true}).getByRole('button',{name:/^Baustein/});for(const token of wrong){const button=page.getByRole('button',{name:`Einsetzen: ${token}`,exact:true}).first();if(await button.count()){const count=await placed.count();await button.click();await expect(placed).toHaveCount(count+1);}}await page.getByRole('button',{name:'Überprüfen',exact:true}).click();return;}
  const available=await page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button').locator('span:nth-child(2)').allTextContents();
  const value=await visibleSolution(page,available);const buttons=page.getByRole('region',{name:'Antwortmöglichkeiten'}).getByRole('button');
  const count=await buttons.count();for(let i=0;i<count;i++)if(await buttons.nth(i).locator('span').nth(1).innerText()!==value){await buttons.nth(i).click();return;}
  throw new Error('Keine falsche Option');
}
export async function storedAttempts(page:Page):Promise<number> {
  return page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('lernkick',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,get=db.transaction('user').objectStore('user').get('data');get.onsuccess=()=>{const totals=new Map<string,number>(),add=(bucket:any)=>{for(const [id,value]of Object.entries(bucket??{}) as [string,any][])if(value&&typeof value.attempts==='number'&&typeof value.correct==='number')totals.set(id,Math.max(totals.get(id)??0,value.attempts));};add(get.result.progress);const a=get.result.activities;for(const bucket of [a.vocabulary.german,a.vocabulary.words,a.vocabulary.sentences,a.vocabulary.grammar,a.vocabulary.spelling,a.vocabulary.proverbs,a.germany.states,a.germany.capitals,a.hangman.results])add(bucket);resolve([...totals.values()].reduce((sum,value)=>sum+value,0));db.close();};get.onerror=()=>reject(get.error);};}));
}

async function visibleSolution(page:Page,available:string[]){
 const prompt=await page.locator('.question h1').innerText();
  const current=await page.evaluate(()=>new Promise<any>(resolve=>{const r=indexedDB.open('lernkick',1);r.onsuccess=()=>{const g=r.result.transaction('user').objectStore('user').get('data');g.onsuccess=()=>{resolve({rounds:Object.values(g.result.rounds).map((r:any)=>r.current),vocabulary:g.result.activities.vocabulary});r.result.close();};};}));
  const task=current.rounds.find((q:any)=>q.prompt===prompt);if(task)return task.options[task.correct];const id=current.vocabulary.session?.ids[current.vocabulary.session.index],question=id?catalog.find(value=>value.id===id):undefined;if(question)return question.options[question.correct];const activity=id?[...grammarTasks,...proverbTasks,...spellingTasks].find(value=>value.id===id):undefined;if(activity)return activity.options[0];return solution(prompt,available);
}
