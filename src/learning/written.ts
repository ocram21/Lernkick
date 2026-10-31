export type WrittenKind='addsub'|'multiply'|'divide';
export type WrittenRow={label:string;cells:string[];editable:boolean;zeroBlank?:boolean};
export type WrittenTask={key:string;kind:WrittenKind;title:string;width:number;rows:WrittenRow[];answer:string;operands:number[];operation:string;decimalAfter?:number};
const digits=(n:number,width:number,shift=0)=>[...String(n)].concat(Array(shift).fill('')).join('').padStart(width,' ').split('').map(c=>c===' '?'':c);
const row=(label:string,cells:string[],editable=true,zeroBlank=false):WrittenRow=>({label,cells,editable,zeroBlank});
export function writtenTask(kind:WrittenKind,operands:number[],operation='+'):WrittenTask{
 const [a,b]=operands;let width=1,rows:WrittenRow[]=[],answer='',title='',decimalAfter:number|undefined;
 const key=`${kind}:${operation}:${(operation==='+'||kind==='multiply'?[...operands].sort((x,y)=>x-y):operands).join(',')}`;
 if(kind==='addsub'){
  const total=operation==='+'?operands.reduce((s,n)=>s+n,0):a-b;answer=String(total);width=Math.max(...operands.map(n=>String(n).length),answer.length);title=operands.join(` ${operation==='-'?'−':'+'} `);
  rows=operands.map((n,i)=>row(`${i===0?'Zahl':operation==='-'?'−':'+'} ${i+1}`,digits(n,width),false));
  if(operation==='+'){let carry=0;const cells=Array(width).fill('');for(let p=width-1;p>=0;p--){cells[p]=carry?String(carry):'';const sum=operands.reduce((s,n)=>s+Number(String(n).padStart(width,'0')[p]),carry);carry=Math.floor(sum/10);}rows.unshift(row('Überträge',cells,true,true));}
  else{let borrow=0;const cells=Array(width).fill('');for(let p=width-1;p>=0;p--){let top=Number(String(a).padStart(width,'0')[p])-borrow;const bottom=Number(String(b).padStart(width,'0')[p]);borrow=top<bottom?1:0;if(borrow)top+=10;cells[p]=String(top);}rows.unshift(row('Entbündelte obere Zahl',cells));}
  rows.push(row('Ergebnis',digits(total,width)));
 }else if(kind==='multiply'){
  answer=String(a*b);width=answer.length;title=`${a} × ${b}`;rows=[row('Erster Faktor',digits(a,width),false),row('× Zweiter Faktor',digits(b,width),false)];
  [...String(b)].reverse().forEach((d,shift)=>{let carry=0;const ac=String(a),cells=Array(width).fill('');for(let p=ac.length-1;p>=0;p--){const column=width-1-shift-(ac.length-1-p);cells[column]=carry?String(carry):'';carry=Math.floor((Number(ac[p])*Number(d)+carry)/10);}if(carry&&width-1-shift-ac.length>=0)cells[width-1-shift-ac.length]=String(carry);rows.push(row(`Überträge · Teilprodukt ${shift+1}`,cells,true,true));rows.push(row(`Teilprodukt ${shift+1} · ${shift===0?'Einer':shift===1?'Zehner':'Hunderter'}`,digits(a*Number(d)*10**shift,width)));});
  rows.push(row('Summe der Teilprodukte',digits(a*b,width)));
 }else{
  const result=a/b;if(!Number.isFinite(result)||result<=0||Math.round(result*10)!==result*10)throw Error('Nur positive, kurze endliche Ergebnisse');answer=String(result).replace('.',',');const decimal=!Number.isInteger(result),input=String(a)+(decimal?'0':'');width=Math.max(input.length,answer.length);const offset=width-input.length;decimalAfter=decimal?offset+String(a).length:undefined;title=`${a} : ${b}`;rows=[row('Dividend',input.padStart(width,' ').split('').map(c=>c===' '?'':c),false)];let remainder=0,started=false;
  for(let i=0;i<input.length;i++){const partial=remainder*10+Number(input[i]);if(!started&&partial<b&&i<input.length-1){remainder=partial;continue;}started=true;const q=Math.floor(partial/b),product=q*b;rows.push(row(`${rows.length===1?'Teildividend':'Nächste Ziffer herunterholen'} · Schritt ${i+1}`,digits(partial,i+offset+1).concat(Array(width-i-offset-1).fill(''))));const qc=Array(width).fill('');qc[i+offset]=String(q);rows.push(row(`Quotientziffer · Schritt ${i+1}`,qc));rows.push(row(`Multiplikation / abzuziehen · Schritt ${i+1}`,digits(product,i+offset+1).concat(Array(width-i-offset-1).fill(''))));remainder=partial-product;rows.push(row(`Rest nach Subtraktion · Schritt ${i+1}`,digits(remainder,i+offset+1).concat(Array(width-i-offset-1).fill(''))));}
  if(remainder!==0)throw Error('Division nicht endlich');rows.push(row('Quotient'+(decimal?' mit Dezimalkomma':''),answer.padStart(width,' ').split('').map(c=>c===' '?'':c)));
 }
 return {kind,key,title,width,rows,answer,operands,operation,...(decimalAfter?{decimalAfter}:{})};
}
/** Bounded shuffled candidates; canonical keys treat swapped summands/factors as one task. */
export function writtenRound(kind:WrittenKind,hard:boolean,seen:ReadonlySet<string>=new Set(),random= Math.random):WrittenTask[]{
 const pool:WrittenTask[]=[];for(let i=0;i<160;i++){
  if(kind==='addsub'){const sub=i%2===1;const a=hard?10000+i*137:18+i*3,b=hard?1200+i*17:14+i%29;pool.push(writtenTask(kind,sub?[a+b,a]:hard?[a,b,230+i*11,...(i%3===0?[1500+i*3]:[])]:[a,b],sub?'-':'+'));}
  else if(kind==='multiply')pool.push(writtenTask(kind,[hard?231+i*13:23+i*2,hard?12+i%77:2+i%8],'×'));
  else{const divisor=hard?(i%2?4:12):2+i%8,quotient=hard?(i%2?(15+i*2)/2:24+i):12+i;pool.push(writtenTask(kind,[divisor*quotient,divisor],':'));}
 }
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const unique=new Map(pool.map(t=>[t.key,t]));const ordered=[...[...unique.values()].filter(t=>!seen.has(t.key)),...[...unique.values()].filter(t=>seen.has(t.key))];if(kind==='addsub'&&!hard){const short=ordered.filter(t=>!seen.has(t.key)&&t.operands.every(n=>n<100)).slice(0,3);const keys=new Set(short.map(t=>t.key));return [...short,...ordered.filter(t=>!keys.has(t.key))].slice(0,10);}return ordered.slice(0,10);
}
export function checkWrittenRow(row:WrittenRow,values:readonly string[]){return row.cells.every((expected,i)=>{const value=(values[i]??'').trim();return expected===value||(row.zeroBlank&&!expected&&value==='0');});}
