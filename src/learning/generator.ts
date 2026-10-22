import { mathById } from './mathCompetencies';
import type { LearningTask } from './types';
export function seededRandom(seed: number) { let state=seed>>>0; return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;}; }
export function generateTask(skillId: string, level: number, random: ()=>number = Math.random,smallFacts=false): LearningTask | undefined {
  const skill=mathById.get(skillId);if(!skill?.generator)return;
  const difficulty=Math.max(1,Math.min(3,Math.round(level)));
  const integer=(min:number,max:number)=>{const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new Error('Zufallswert muss zwischen 0 (inklusive) und 1 (exklusive) liegen.');return min+Math.floor(r*(max-min+1));};
  let a=0,b=0,result=0,explanation='',prompt='';const operation=skill.generator==='negative'?'subtract':skill.generator==='fraction'?'divide':skill.generator;
  const example=skill.example;
  if(skill.generator==='fraction') {
    b=difficulty===1?[2,4][integer(0,1)]:integer(3,difficulty===2?10:20);
    const numerator=difficulty===1?1:integer(1,b-1),total=b*integer(2,difficulty===1?12:difficulty===2?25:60);
    a=total*numerator;result=a/b;
    prompt=`Wie viel sind ${numerator}/${b} von ${total}?`;
    explanation=`Teile ${total} durch den Nenner ${b}: ${total/b}. Multipliziere mit dem Zähler ${numerator}: ${total/b} × ${numerator} = ${result}.`;
  } else if(skill.generator==='percent') {
    a=integer(2,difficulty===1?15:difficulty===2?50:150)*20;
    b=difficulty===1?[10,50][integer(0,1)]:integer(1,difficulty===2?10:19)*5;result=a*b/100;
    prompt=`Wie viel sind ${b} % von ${a}${skillId==='math.percent.change'?' € Rabatt':''}?`;
    explanation=`${b} % bedeutet ${b} von 100. Rechne ${a} ÷ 100 × ${b} = ${result}${skillId==='math.percent.change'?' € Rabatt':''}.`;
  } else if(skill.generator==='negative') {
    a=integer(1,difficulty===1?8:difficulty===2?20:60);b=a+integer(1,difficulty===1?9:difficulty===2?20:60);result=a-b;
    prompt=`Wie viel ist ${a} − ${b}?`;explanation=`Starte auf dem Zahlenstrahl bei ${a}. Gehe ${b} Schritte nach links: erst ${a} Schritte bis 0, dann noch ${b-a} Schritte. Du landest bei ${result}.`;
  } else if(skill.generator==='estimate') {
    const base=integer(2,difficulty===1?9:30)*10, multiplier=integer(2,9);a=base+integer(1,4);b=multiplier+.1;result=base*multiplier;
    prompt=`Überschlage ${a} × ${b.toLocaleString('de-DE')}. Runde beide Faktoren auf ganze Zehner beziehungsweise Einer.`;
    explanation=`${a} wird auf ${base} gerundet, ${b.toLocaleString('de-DE')} auf ${multiplier}. ${base} × ${multiplier} = ${result}.`;
  } else if(operation==='compare') {
    a=integer(difficulty===1?24:difficulty===2?80:180,difficulty===1?89:difficulty===2?199:999);b=a+integer(1,difficulty===1?9:difficulty===2?15:25)*(random()<.5?-1:1);
    result=Math.max(a,b);prompt=`Welche Zahl ist größer: ${a} oder ${b}?`;
    explanation=`${result} ist größer. Auf dem Zahlenstrahl liegt ${result} rechts von ${Math.min(a,b)}.`;
  } else if(operation==='add') {
    if(skillId==='math.add.carry') {
      const ones=integer(2,9);a=integer(difficulty===1?1:difficulty===2?3:10,difficulty===1?3:difficulty===2?9:30)*10+ones;b=integer(11-ones,9)+(difficulty===1?0:integer(1,difficulty===2?3:8)*10);result=a+b;
      const toTen=10-ones;explanation=`Ergänze ${a} zuerst mit ${toTen} zum nächsten Zehner. Von ${b} bleiben ${b-toTen}. Rechne ${a+toTen} + ${b-toTen} = ${result}.`;
    } else {
      const ones=integer(1,7), tens=difficulty===1?integer(1,2):integer(1,difficulty===2?4:7);a=tens*10+ones;b=integer(1,9-ones)+(difficulty===1?0:integer(1,difficulty===2?3:8)*10);result=a+b;
      explanation=`Addiere die Zehner und die Einer getrennt: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} und ${a%10} + ${b%10}. Zusammen ergibt das ${result}.`;
    }
    prompt=`Wie viel ist ${a} + ${b}?`;
  } else if(operation==='subtract') {
    if(skillId==='math.subtract.borrow') {
      const ones=integer(0,7);a=integer(difficulty===1?2:5,difficulty===1?4:difficulty===2?12:40)*10+ones;b=integer(ones+1,9)+(difficulty===3&&a>=30?10:0);
      result=a-b;explanation=`Ziehe zuerst ${ones} ab, bis ${a-ones} erreicht ist. Dann noch ${b-ones} zurück: ${a-ones} − ${b-ones} = ${result}.`;
    } else {
      const ones=integer(2,9);a=(difficulty===1?integer(1,2):integer(1,difficulty===2?4:8))*10+ones;b=integer(1,ones)+(difficulty===3?10:0);result=a-b;
      explanation=`Ziehe Zehner und Einer getrennt ab. ${a} − ${b} ergibt ${result}. Die Probe ist ${result} + ${b} = ${a}.`;
    }
    prompt=`Wie viel ist ${a} − ${b}?`;
  } else if(operation==='multiply') {
    a=smallFacts?integer(difficulty===1?2:3,10):integer(difficulty===1?3:difficulty===2?6:12,difficulty===1?10:difficulty===2?15:25);b=integer(difficulty===1?2:3,smallFacts?10:difficulty===1?10:difficulty===2?12:18);result=a*b;
    prompt=difficulty===3?`${a} Kisten enthalten je ${b} Flaschen. Wie viele Flaschen sind es zusammen?`:`Wie viel ist ${a} × ${b}?`;
    explanation=`${a} gleich große Gruppen mit je ${b} ergeben ${result}. Die passende Rechnung ist ${a} × ${b} = ${result}.`;
  } else {
    b=difficulty===1?[2,5,10][integer(0,2)]:integer(2,10);result=integer(difficulty===1?3:6,difficulty===1?10:difficulty===2?20:40);a=b*result;
    prompt=difficulty===3?`${a} Stifte werden gleichmäßig auf ${b} Personen verteilt. Wie viele bekommt jede Person?`:`Wie viel ist ${a} ÷ ${b}?`;
    explanation=`Suche die passende Malaufgabe: ${b} × ${result} = ${a}. Daher ist ${a} ÷ ${b} = ${result}; es bleibt kein Rest.`;
  }
  const values=operation==='compare'?[result,Math.min(a,b)]:[...new Set([result,result+1,Math.max(0,result-1),result+10,Math.abs(a-b),a+b])].slice(0,4);
  const visual=operation==='add'||operation==='subtract'?{kind:'number-line' as const,start:a,change:operation==='add'?b:-b}:operation==='multiply'&&a<=5&&b<=10?{kind:'groups' as const,start:a,change:b}:undefined;
  return {id:`practice.math.v1:${skillId}:${difficulty}:${a}:${b}`,subject:'math',topic:skillId,competency:skillId,difficulty,prompt,options:values.map(String),correct:0,explanation,skillId,signature:`${operation}:${a}:${b}`,generated:{version:1,operands:[a,b],operation},help:{hint:skill.hint,example,alternate:operation==='compare'?`Stell dir Hausnummern vor. Die größere Zahl kommt beim Vorwärtszählen später. ${skill.example}`:`Prüfe mit der Gegenrechnung oder zerlege die Zahlen. ${skill.example}`,visual}};
}
