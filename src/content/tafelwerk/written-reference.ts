// Feste, stellengetreue Musterrechnungen nach der üblichen Heftanordnung.
export function renderWrittenReference(kind:'multiplication'|'division'){
 const multiplication=kind==='multiplication';
 const cols=multiplication?10:12,rows=multiplication?7:10,cell=28;
 const digitRow=(text:string,col:number,row:number,small=false)=>[...text].map((digit,i)=>`<text data-column="${col+i}" x="${(col+i+.5)*cell}" y="${(row+.5)*cell}" text-anchor="middle" dominant-baseline="central" font-size="${small?15:23}">${digit}</text>`).join('');
 const rule=(start:number,end:number,row:number,double=false)=>`<path d="M${start*cell} ${row*cell}H${end*cell}${double?`M${start*cell} ${row*cell+4}H${end*cell}`:''}" stroke="var(--calc-ink)" stroke-width="2"/>`;
 let grid='';
 for(let x=0;x<=cols;x++)grid+=`<path d="M${x*cell} 0V${rows*cell}"/>`;
 for(let y=0;y<=rows;y++)grid+=`<path d="M0 ${y*cell}H${cols*cell}"/>`;
 const work=multiplication
  ?digitRow('2637·24',2,1)+rule(1,9,2)+digitRow('5274',4,2)+digitRow('10548',4,3)+digitRow('1',5,4,true)+rule(1,9,5)+digitRow('63288',4,5)+rule(1,9,6,true)
  :digitRow('59535:7=8505',0,0)+digitRow('56',0,1)+rule(0,2,2)+digitRow('35',1,2)+digitRow('35',1,3)+rule(1,3,4)+digitRow('03',2,4)+digitRow('0',3,5)+rule(2,4,6)+digitRow('35',3,6)+digitRow('35',3,7)+rule(3,5,8)+digitRow('0',4,8);
 const arrows=multiplication?'':[2,3,4].map((col,i)=>{
  const x=(col+.5)*cell,y=(2+i*2)*cell-5;
  return `<path d="M${x} ${cell}V${y}m-4-7 4 7 4-7" fill="none" stroke="var(--calc-teal)" stroke-width="2"/>`;
 }).join('');
 const title=multiplication?'Schriftliche Multiplikation: 2637 mal 24 ergibt 63288':'Schriftliche Division: 59535 geteilt durch 7 ergibt 8505';
 return `<svg class="written-reference" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${cols*cell+4} ${rows*cell+4}" role="img" aria-label="${title}"><g stroke="var(--calc-ink)" stroke-opacity=".18" stroke-width=".6">${grid}</g><g fill="var(--calc-ink)" font-family="Barlow, sans-serif" font-weight="600">${work}</g>${arrows}</svg>`;
}
