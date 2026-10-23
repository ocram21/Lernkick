import {z} from 'zod';
import type {LearningTask} from './types';
export const diagramSchema=z.object({shape:z.enum(['rectangle','triangle']),width:z.number().positive().max(100),height:z.number().positive().max(100)});
export type Diagram=z.infer<typeof diagramSchema>;
const display=(n:number)=>Number(n.toFixed(3)).toLocaleString('de-DE',{maximumFractionDigits:3});
export function appliedMathTask(category:string,level:number,random=Math.random,geometryKind?:number):LearningTask|undefined{
 const int=(a:number,b:number)=>a+Math.floor(random()*(b-a+1)),difficulty=Math.max(1,Math.min(3,level));let result=0,prompt='',explanation='',unit='',skillId='',diagram:Diagram|undefined,values:number[]=[],signature='';
 if(category==='ratio'){
  skillId='math.ratio.proportion';const n=int(2,7),target=difficulty===3?n*2:((value:number)=>value===n?value+1:value)(int(2,12)),price=int(3,15),cost=difficulty===2?price/2:price;
  if(difficulty===3){const hours=int(3,12);result=hours/2;unit='h';prompt=`${n} Personen brauchen für dieselbe Arbeit ${hours} Stunden. Wie lange brauchen ${target} Personen bei gleicher Leistung je Person?`;explanation=`Die Arbeit bleibt gleich: ${n} · ${hours} : ${target} = ${display(result)} h.`;values=[hours*2,hours];signature=`ratio:inverse:${n}:${hours}:${target}`;}
  else{result=target*cost;unit='€';prompt=`${n} Werkstücke kosten zusammen ${display(n*cost)} €. Was kosten ${target} gleiche Werkstücke?`;explanation=`Je Stück: ${display(n*cost)} : ${n} = ${display(cost)} €. Dann ${target} · ${display(cost)} = ${display(result)} €.`;values=[n*cost,(n*cost)/target];signature=`ratio:direct:${n}:${cost}:${target}`;}
 }else if(category==='units'){
  skillId='math.measure.convert';const pairs=difficulty===1?[['m','cm',100],['kg','g',1000],['l','ml',1000],['cm','mm',10]]:difficulty===2?[['cm','m',.01],['g','kg',.001],['ml','l',.001],['m','km',.001]]:[['kg','t',.001],['mm','m',.001],['min','h',1/60],['h','min',60]];
  const [from,to,factor]=pairs[int(0,pairs.length-1)] as [string,string,number];const source=difficulty===1?int(2,25):from==='min'?int(2,12)*15:from==='h'?int(2,20)/4:int(5,180)*25;result=source*factor;unit=to;prompt=`Rechne um: ${display(source)} ${from} = ? ${to}`;explanation=`${display(source)} ${from} ${factor<1?'geteilt durch '+display(1/factor):'mal '+display(factor)} ergibt ${display(result)} ${to}.`;values=[result*10,result/10];signature=`units:${source}:${from}:${to}`;
 }else if(category==='geometry'){
  const kind=geometryKind??int(0,2),width=int(difficulty===1?3:6,difficulty===1?9:16),height=int(2,difficulty===1?6:10);
  diagram={shape:kind===2?'triangle':'rectangle',width,height};skillId='math.geometry.area';unit=kind===0?'cm':'cm²';
  result=kind===0?2*(width+height):kind===1?width*height:width*height/2;
  prompt=kind===0?'Rechteck: Wie groß ist der Umfang?':kind===1?'Rechteck: Wie groß ist der Flächeninhalt?':'Rechtwinkliges Dreieck: Wie groß ist der Flächeninhalt?';
  explanation=kind===0?`U = 2 · (${width} + ${height}) = ${display(result)} cm.`:kind===1?`A = ${width} · ${height} = ${display(result)} cm².`:`A = ${width} · ${height} : 2 = ${display(result)} cm².`;
  values=kind===0?[width+height,width*height]:[2*(width+height),kind===1?width*height/2:width*height];signature=`geometry:v2:${kind}:${difficulty}:${width}:${height}`;
 }else return;
 const choices=[...new Set([result,...values,result+1,result+2])].slice(0,3);return{id:`practice.math.v3:${signature}`,subject:'math',topic:category,competency:skillId,difficulty,prompt,options:choices.map(n=>`${display(n)} ${unit}`),correct:0,explanation,skillId,signature,generated:{version:1,operands:[result,difficulty],operation:category as 'ratio'|'units'|'geometry'},diagram,help:{hint:'Nutze die gegebenen Größen.',example:explanation,alternate:explanation}};
}
