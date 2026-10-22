import {z} from 'zod';
import type {LearningTask} from './types';
const integer=z.number().int().min(-1e9).max(1e9);
export const rationalSchema=z.object({n:integer,d:integer.positive()});
export type Rational=z.infer<typeof rationalSchema>;
export const equationSchema=z.object({a:rationalSchema,b:rationalSchema,c:rationalSchema,d:rationalSchema});
export type Equation=z.infer<typeof equationSchema>;
function bigGcd(a:bigint,b:bigint):bigint{return b?bigGcd(b,a%b):a;}
function fromBig(n:bigint,d:bigint):Rational{if(d===0n)throw Error('Diese Zahl ist nicht zulässig.');const sign=d<0n?-1n:1n,g=bigGcd(n<0n?-n:n,d<0n?-d:d)||1n;return rationalSchema.parse({n:Number(n/g*sign),d:Number(d/g*sign)});}
export function rational(n:number,d=1):Rational{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d))throw Error('Diese Zahl ist nicht zulässig.');return fromBig(BigInt(n),BigInt(d));}
const add=(a:Rational,b:Rational)=>fromBig(BigInt(a.n)*BigInt(b.d)+BigInt(b.n)*BigInt(a.d),BigInt(a.d)*BigInt(b.d));
const mul=(a:Rational,b:Rational)=>fromBig(BigInt(a.n)*BigInt(b.n),BigInt(a.d)*BigInt(b.d));
const negate=(a:Rational)=>({...a,n:-a.n});
export function numberText(r:Rational){return r.d===1?String(r.n):`${r.n}/${r.d}`;}
function parseNumber(value:string):Rational{value=value.replace(/^\((.*)\)$/,'$1');if(!/^[+-]?\d+(?:[.,]\d{1,6}|\/\d+)?$/.test(value))throw Error('Gib eine Zahl oder einen Bruch ein.');if(value.includes('/')){const [n,d]=value.split('/').map(Number);return rational(n,d);}const [whole,decimal]=value.replace(',','.').split('.');return decimal?rational(Number(whole+decimal),10**decimal.length):rational(Number(whole));}
function expression(value:string):[Rational,Rational]{value=value.replace(/[−–]/g,'-').replace(/\s/g,'').replace(/(\d)\*x/g,'$1x');if(!value)throw Error('Gib einen Term ein.');const tokens=value.match(/[+-]?[^+-]+/g)??[];if(tokens.join('')!==value)throw Error('Prüfe die Schreibweise.');let x=rational(0),n=rational(0);for(const token of tokens){if(token.endsWith('x')){let c=token.slice(0,-1);if(c===''||c==='+')c='1';if(c==='-')c='-1';x=add(x,parseNumber(c));}else n=add(n,parseNumber(token));}return [x,n];}
function side(a:Rational,b:Rational){const x=a.n===0?'':a.n===a.d?'x':a.n===-a.d?'-x':`${numberText(a)}x`;if(!b.n)return x||'0';return x?`${x} ${b.n<0?'−':'+'} ${numberText({...b,n:Math.abs(b.n)})}`:numberText(b);}
export function equationText(q:Equation){return `${side(q.a,q.b)} = ${side(q.c,q.d)}`;}
const same=(a:Rational,b:Rational)=>BigInt(a.n)*BigInt(b.d)===BigInt(b.n)*BigInt(a.d);
export function applyOperation(q:Equation,raw:string):{equation:Equation;operation:string}|{error:string}{try{
 let input=raw.trim().replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,':');const pipe=input.lastIndexOf('|');if(pipe>=0){const prefix=input.slice(0,pipe).trim();if(prefix){const parts=prefix.split('=');if(parts.length!==2)throw Error('Schreibe die Operation hinter den Strich.');const [a,b]=expression(parts[0]),[c,d]=expression(parts[1]);if(!same(a,q.a)||!same(b,q.b)||!same(c,q.c)||!same(d,q.d))throw Error('Die Gleichung vor dem Strich stimmt nicht mit der aktuellen Zeile überein.');}input=input.slice(pipe+1).trim();}
 const op=input[0],value=input.slice(1).replace(/\s/g,'');if(!['+','-','*',':','/'].includes(op)||!value)throw Error('Gib eine Operation ein, zum Beispiel −4 oder :3.');let next:Equation;
 if(op==='+'||op==='-'){let [x,n]=expression(value);if(op==='-'){x=negate(x);n=negate(n);}next={a:add(q.a,x),b:add(q.b,n),c:add(q.c,x),d:add(q.d,n)};}
 else{if(value.includes('x'))throw Error('Multipliziere oder teile nur durch eine Zahl ungleich null.');let factor=parseNumber(value);if(!factor.n)throw Error('Multiplizieren oder Teilen mit null ist keine zulässige Äquivalenzumformung.');if(op===':'||op==='/')factor=rational(factor.d,factor.n);next={a:mul(q.a,factor),b:mul(q.b,factor),c:mul(q.c,factor),d:mul(q.d,factor)};}
 return {equation:next,operation:input};
 }catch(error){return {error:error instanceof z.ZodError?'Die Zahlen werden zu groß. Wähle einen einfacheren Schritt.':error instanceof Error?error.message:'Prüfe deine Eingabe.'};}}
export function solvedEquation(q:Equation){return q.a.n===q.a.d&&q.b.n===0&&q.c.n===0||q.c.n===q.c.d&&q.d.n===0&&q.a.n===0;}
export function replayEquation(initial:Equation,operations:readonly string[]){let equation=initial;const lines=[equationText(initial)];for(const operation of operations){const result=applyOperation(equation,operation);if('error'in result)break;lines[lines.length-1]+=` | ${result.operation}`;equation=result.equation;lines.push(equationText(equation));}return {equation,lines};}
export function equationTask(level:number,random= Math.random):LearningTask{const int=(a:number,b:number)=>a+Math.floor(random()*(b-a+1)),difficulty=Math.max(1,Math.min(3,level)),solution=int(difficulty===1?1:-9,12),a=difficulty===1?1:int(2,7),c=difficulty===3?int(1,a-1):0,b=int(2,15),d=(a-c)*solution+b,equation={a:rational(a),b:rational(b),c:rational(c),d:rational(d)},prompt=equationText(equation),signature=`equation:${a}:${b}:${c}:${d}`;return{id:`practice.math.v2:${signature}`,subject:'math',topic:'Gleichungen',competency:'equation.linear',difficulty,prompt,options:[String(solution),String(solution+1)],correct:0,explanation:`Die Gleichung ist für x = ${solution} erfüllt. Beide Seiten ergeben ${a*solution+b}.`,skillId:'math.equation.linear',signature,generated:{version:1,operands:[a,solution],operation:'equation'},equation,help:{hint:'Führe auf beiden Seiten dieselbe Operation aus.',example:'3x + 4 = 19 | −4 ergibt 3x = 15.',alternate:'Sammle die x-Terme auf einer Seite und die Zahlen auf der anderen.'}};}
