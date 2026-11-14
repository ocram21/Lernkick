// Übernommene, für die LernKick-Palette angepasste Mathe-Visualisierungen.
const svgEsc=(str:string|number)=>String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function svg(content:string, title:string, viewBox:string='0 0 320 190') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${svgEsc(title)}">${content}</svg>`;
}
function svgText(x:number,y:number,t:string|number,color:string='var(--calc-ink)',size:number=14,anchor:string='middle') {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}" font-family="Arial,sans-serif" font-weight="700">${svgEsc(t)}</text>`;
}
function numberLine(v:any) {
  const x = (n:number) => 20+(n+5)*27;
  let marks='';
  for (let n=-5; n<=6; n++) {
    marks += `<line x1="${x(n)}" y1="${n===0&&v.emphasizeZero?'68':'75'}" x2="${x(n)}" y2="${n===0&&v.emphasizeZero?'90':'84'}" stroke="${n===0&&v.emphasizeZero?'var(--calc-orange)':'var(--calc-ink)'}" stroke-width="${n===0&&v.emphasizeZero?'3':'1.4'}"/>`;
    marks += svgText(x(n),103,n,'var(--calc-ink)',11);
  }
  let move='';
  if (v.from !== v.to) {
    const sx=x(v.from), ex=x(v.to), arcY=33;
    const mid=(sx+ex)/2;
    move = `<path d="M ${sx} 69 Q ${mid} ${arcY} ${ex} 68" fill="none" stroke="var(--calc-teal)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M ${ex-((ex>sx)?8:-8)} 62 L ${ex} 68 L ${ex-((ex>sx)?8:-8)} 76" fill="none" stroke="var(--calc-teal)" stroke-width="3" stroke-linecap="round"/>`;
  }
  return svg(`<line x1="15" y1="79" x2="312" y2="79" stroke="var(--calc-ink)" stroke-width="2"/><path d="M 15 79 l 7 -4 m -7 4 l 7 4 M 312 79 l -7 -4 m 7 4 l -7 4" fill="none" stroke="var(--calc-ink)" stroke-width="1.8"/>${marks}${move}<circle cx="${x(v.from)}" cy="79" r="6" fill="var(--calc-orange)"/><circle cx="${x(v.to)}" cy="79" r="6" fill="var(--calc-teal)"/>`,v.caption,'0 0 330 116');
}
function graph(v:any) {
  const ox=92,oy=158,scale=24,px=(n:number)=>ox+n*scale,py=(n:number)=>oy-n*scale;
  let grid='';
  for(let x=-3;x<=7;x++) grid+=`<line x1="${px(x)}" y1="14" x2="${px(x)}" y2="206" stroke="var(--calc-housing)" opacity=".42"/>${svgText(px(x),oy+17,x,'var(--calc-ink)',9)}`;
  for(let y=-2;y<=6;y++) grid+=`<line x1="20" y1="${py(y)}" x2="260" y2="${py(y)}" stroke="var(--calc-housing)" opacity=".42"/>${y?svgText(ox-12,py(y)+3,y,'var(--calc-ink)',9):''}`;
  let line='';
  if(v.mode==='line') {
    const m=v.slope??2,b=v.intercept??1;
    const x1=Math.max(-3,(-2-b)/m),x2=Math.min(7,(6-b)/m);
    line=`<line x1="${px(x1)}" y1="${py(m*x1+b)}" x2="${px(x2)}" y2="${py(m*x2+b)}" stroke="var(--calc-teal)" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  const axes=`<path d="M 20 ${oy} H 264 M ${ox} 206 V 12" fill="none" stroke="var(--calc-ink)" stroke-width="2"/><path d="M 264 ${oy} l -7 -4 m 7 4 l -7 4 M ${ox} 12 l -4 7 m 4 -7 l 4 7" fill="none" stroke="var(--calc-ink)" stroke-width="2" stroke-linecap="round"/>${svgText(276,oy-7,'x','var(--calc-ink)',13)}${svgText(ox+10,10,'y','var(--calc-ink)',13)}`;
  let guides='',points='';
  if(v.mode==='point') {
    const x=px(v.x),y=py(v.y);
    guides=`<path d="M ${x} ${oy} V ${y} H ${ox}" fill="none" stroke="var(--calc-orange)" stroke-width="2" stroke-dasharray="4 4"/>`;
    points=`<circle cx="${x}" cy="${y}" r="5.5" fill="var(--calc-orange)"/><rect x="${x+8}" y="${y-24}" width="72" height="21" rx="4" fill="var(--calc-display)" stroke="var(--calc-housing)"/><text x="${x+14}" y="${y-10}" fill="var(--calc-ink)" font-size="11" font-family="Barlow,sans-serif" font-weight="700">P(${v.x} | ${v.y})</text>`;
  } else if(v.mode==='line') {
    points=(v.points??[]).map((p:any)=>{
      const x=px(p.x),y=py(p.y),lx=x+(p.dx??14),ly=y+(p.dy??-11),width=58;
      return `<circle cx="${x}" cy="${y}" r="5.7" fill="var(--calc-orange)" stroke="var(--calc-display)" stroke-width="1.5"/><path d="M ${x} ${y} L ${lx} ${ly+3}" stroke="var(--calc-orange)" stroke-width="1.2"/><rect x="${lx}" y="${ly-10}" width="${width}" height="20" rx="4" fill="var(--calc-display)" stroke="var(--calc-housing)"/><text x="${lx+4}" y="${ly+4}" fill="var(--calc-ink)" font-size="10" font-family="Barlow,sans-serif" font-weight="700">${svgEsc(p.label)}</text>`;
    }).join('');
  }
  return svg(`${grid}${line}${axes}${guides}${points}`,'Koordinatensystem mit x- und y-Achse, Pfeilspitzen und lesbaren Punktkoordinaten','0 0 320 220');
}

function transversal() {
  const points=[{x:105,y:44,labels:[['α',83,32,'var(--calc-orange)'],['β',128,32,'var(--calc-violet)'],['γ',82,67,'var(--calc-teal)'],['δ',128,67,'var(--calc-violet)']]},{x:185,y:115,labels:[['α′',162,103,'var(--calc-orange)'],['β′',208,103,'var(--calc-teal)'],['γ′',161,138,'var(--calc-ink)'],['δ′',208,138,'var(--calc-ink)']]}];
  const labels=points.flatMap(p=>p.labels.map(([t,x,y,color]:any)=>`<text x="${x}" y="${y}" fill="${color}" font-size="13" font-family="Barlow,sans-serif" font-weight="700">${svgEsc(t)}</text>`)).join('');
  const diagram=svg(`<line x1="18" y1="44" x2="292" y2="44" stroke="var(--calc-ink)" stroke-width="2.3"/><line x1="18" y1="115" x2="292" y2="115" stroke="var(--calc-ink)" stroke-width="2.3"/><line x1="61" y1="5" x2="229" y2="154" stroke="var(--calc-teal)" stroke-width="3"/><circle cx="105" cy="44" r="3.5" fill="var(--calc-orange)"/><circle cx="185" cy="115" r="3.5" fill="var(--calc-orange)"/>${labels}${svgText(287,37,'g','var(--calc-ink)',12)}${svgText(287,108,'h','var(--calc-ink)',12)}`,'Zwei parallele Geraden g und h mit einer schneidenden Transversalen','0 0 310 160');
  return `<div class="transversal-work">${diagram}<div class="transversal-key"><span><b>Stufen:</b> α = α′</span><span><b>Wechsel:</b> γ = β′</span><span><b>Scheitel:</b> α = δ</span><span><b>Neben:</b> α + β = 180°</span></div></div>`;
}
function distribute(v:any) {
  const rows = [24, 67, 110];
  let content = `<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="var(--calc-teal)"/></marker></defs>`;
  content += `<circle cx="34" cy="81" r="22" fill="var(--calc-display)" stroke="var(--calc-orange)" stroke-width="2"/>${svgText(34,87,'3','var(--calc-orange)',18)}`;
  content += svgText(34,119,'Faktor','var(--calc-ink)',10);
  rows.forEach((y, i) => {
    content += `<rect x="91" y="${y}" width="201" height="34" rx="8" fill="var(--calc-display)" stroke="var(--calc-housing)"/>`;
    content += svgText(143,y+22,'x','var(--calc-teal)',16)+svgText(191,y+22,'+','var(--calc-ink)',14)+svgText(239,y+22,'2','var(--calc-orange)',16);
    if (v.stage === 'groups') {
      content += `<path class="distribute-arrow" d="M 58 81 C 71 81 73 ${y+17} 87 ${y+17}" fill="none" stroke="var(--calc-teal)" stroke-width="2" marker-end="url(#arrowhead)"/>`;
    } else {
      const fromY = y+17;
      content += `<path class="distribute-arrow" d="M 151 ${fromY} C 151 151 144 151 137 158" fill="none" stroke="var(--calc-teal)" stroke-width="2" marker-end="url(#arrowhead)"/>`;
      content += `<path class="distribute-arrow" d="M 239 ${fromY} C 239 151 229 151 219 158" fill="none" stroke="var(--calc-orange)" stroke-width="2" marker-end="url(#arrowhead)"/>`;
    }
  });
  if (v.stage === 'groups') content += svgText(190,176,'Drei gleiche Gruppen: jeweils x + 2','var(--calc-ink)',11);
  else content += `${svgText(132,178,'3 · x','var(--calc-teal)',15)}${svgText(180,178,'+','var(--calc-ink)',15)}${svgText(229,178,'3 · 2','var(--calc-orange)',15)}`;
  return svg(content, v.stage === 'groups' ? 'Der Faktor 3 bildet drei gleiche Gruppen aus x und 2' : 'Der Faktor 3 wird zu beiden Summanden geleitet','0 0 320 190');
}
function angleVisual(v:any) {
  let labels = svgText(160,37,'60°','var(--calc-orange)',17);
  if(v.active==='vertical' || v.active==='adjacent') labels+=svgText(160,160,'60°','var(--calc-teal)',17);
  if(v.active==='adjacent') labels+=svgText(86,99,'120°','var(--calc-teal)',15)+svgText(236,99,'120°','var(--calc-teal)',15);
  return svg(`<path d="M 105 0 L 215 190 M 215 0 L 105 190" stroke="var(--calc-ink)" stroke-width="3" stroke-linecap="round"/>${labels}<circle cx="160" cy="95" r="4" fill="#fff"/>`,'Zwei sich schneidende Geraden und ihre Winkel');
}
function triangleVisual(v:any) {
  if(v.label==='angles') return svg(`<path d="M 50 158 L 265 158 L 177 7 Z" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/>${svgText(88,144,'50°','var(--calc-orange)',16)}${svgText(236,144,'60°','var(--calc-orange)',16)}${svgText(174,51,'70°','var(--calc-teal)',16)}`,'Dreieck mit Innenwinkeln 50, 60 und 70 Grad');
  return svg(`<path d="M 58 154 L 58 34 L 218 154 Z" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/><path d="M 58 139 H 73 V 154" fill="none" stroke="var(--calc-orange)" stroke-width="2"/>${svgText(35,95,'a = 3 cm','var(--calc-ink)',12)}${svgText(140,177,'b = 4 cm','var(--calc-ink)',12)}${svgText(154,75,v.label==='result'?'c = 5 cm':'c = ?','var(--calc-orange)',13)}`,'Rechtwinkliges Dreieck mit Katheten 3 und 4 Zentimeter und Hypotenuse 5 Zentimeter');
}
function rectangle(v:any) {
  let grid='';
  if(v.mode==='area') {
    for (let i=1;i<5;i++) grid+=`<line x1="${45+i*44}" y1="27" x2="${45+i*44}" y2="159" stroke="var(--calc-ink)" opacity=".8"/>`;
    for (let j=1;j<3;j++) grid+=`<line x1="45" y1="${27+j*44}" x2="265" y2="${27+j*44}" stroke="var(--calc-ink)" opacity=".8"/>`;
  }
  return svg(`<rect x="45" y="27" width="220" height="132" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/>${grid}${svgText(155,180,'5 cm','var(--calc-ink)',13)}${svgText(283,96,'3 cm','var(--calc-ink)',13)}`,'Rechteck mit fünf Zentimetern Länge und drei Zentimetern Breite');
}
function boxShape() {
  return svg(`<polygon points="89,52 214,52 266,21 140,21" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="2"/><polygon points="214,52 266,21 266,126 214,158" fill="var(--calc-number)" stroke="var(--calc-teal)" stroke-width="2"/><rect x="89" y="52" width="125" height="106" fill="var(--calc-number)" stroke="var(--calc-teal)" stroke-width="2"/>${svgText(150,176,'3 cm','var(--calc-ink)',13)}${svgText(257,163,'2 cm','var(--calc-ink)',13)}${svgText(73,110,'4 cm','var(--calc-ink)',13)}`,'Quader mit Länge 3, Breite 2 und Höhe 4 Zentimeter');
}
function combinations(v:any) {
  let g='';
  for(let a=0;a<v.shirts;a++) for(let b=0;b<v.pants;b++) {
    const x=45+b*78,y=10+a*81;
    g+=`<rect x="${x}" y="${y}" width="66" height="67" rx="9" fill="var(--calc-display)" stroke="var(--calc-housing)"/>`;
    g+=`<path d="M ${x+15} ${y+17} L ${x+24} ${y+8} H ${x+41} L ${x+50} ${y+17} L ${x+42} ${y+28} V ${y+48} H ${x+24} V ${y+28} Z" fill="${a===0?'var(--calc-teal)':'var(--calc-orange)'}"/>`;
    g+=svgText(x+33,y+62,`T${a+1} + H${b+1}`,'var(--calc-ink)',10);
  }
  return svg(g,'Sechs mögliche Kombinationen aus zwei T-Shirts und drei Hosen','0 0 320 177');
}
export function renderVisual(v:any) {
  if(!v) return '';
  let html='';
  switch(v.type) {
    case 'chips': html=`<div class="visual-chips">${v.values.map((it:any,i:number)=>`<span class="visual-chip ${i===v.values.length-1?'emphasis':''}">${it}</span>`).join('')}</div>`;break;
    case 'numberline': html=numberLine(v);break;
    case 'bags': html=`<div class="bag-row">${Array.from({length:v.count},()=>`<div class="bag">${v.content}</div>`).join('')}</div>`;break;
    case 'fractions': html=v.parts.map((p:any,pi:number)=>`<div class="fraction-block"><div class="fraction-block-label">${p.label}</div><div class="fraction-strip">${Array.from({length:p.d},(_,i)=>`<span class="fraction-cell ${i<p.n?'filled':''} ${pi>0?'secondary':''}"></span>`).join('')}</div></div>`).join('');break;
    case 'balance': html=`<div class="balance-line"><div class="balance-pan"><span>Links</span><strong>${v.left}</strong></div><span class="balance-equal">=</span><div class="balance-pan"><span>Rechts</span><strong>${v.right}</strong></div></div>`;break;
    case 'table': html=`<table class="viz-table"><thead><tr>${v.heads.map((x:any)=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${v.rows.map((r:any,i:number)=>`<tr class="${v.focus===i?'focus':''}">${r.map((x:any)=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;break;
    case 'percent': html=`<div class="percent-strip"><span class="percent-fill" style="width:${Math.max(0,Math.min(100,Number(v.filled)))}%"></span></div><span class="viz-label">${v.label}</span>`;break;
    case 'grid': html=`<div class="square-grid" style="grid-template-columns: repeat(${v.n},1fr)">${Array.from({length:v.n*v.n},()=>'<span></span>').join('')}</div>`;break;
    case 'array': html=`<div class="viz-array">${v.rows.map((r:string,i:number)=>`<div class="${i===v.rows.length-1?'line':''}">${r.replace(/ /g,'&nbsp;')}</div>`).join('')}</div>`;break;
    case 'graph': html=graph(v);break;
    case 'distribute': html=distribute(v);break;
    case 'angles': html=angleVisual(v);break;
    case 'triangle': html=triangleVisual(v);break;
    case 'rect': html=rectangle(v);break;
    case 'box': html=boxShape();break;
    case 'combos': html=combinations(v);break;
    case 'math-stack': html=`<div class="math-stack" role="group" aria-label="Zusammenhängender Rechenweg">${v.rows.map((row:string)=>`<div>${svgEsc(row)}</div>`).join('')}</div>`;break;
    case 'long-division': html=`<div class="long-division" aria-label="Schriftliche Division"><div class="division-quotient">${svgEsc(v.quotient)}</div><div class="division-start">${svgEsc(v.divisor)} ⟌ ${svgEsc(v.dividend)}</div>${v.rows.map((row:string,i:number)=>`<div class="division-row ${i===v.rows.length-1?'division-result':''}">${svgEsc(row)}</div>${i===0||i===2?'<div class="division-rule"></div>':''}`).join('')}</div>`;break;
    case 'linear-function': html=`<div class="linear-function-work">${graph({mode:'line',slope:2,intercept:1,points:[{x:0,y:1,label:'(0|1)',dx:-62,dy:-16},{x:1,y:3,label:'(1|3)',dx:11,dy:15}]})}<table class="function-values"><thead><tr>${v.values[0].map((x:string)=>`<th scope="col">${svgEsc(x)}</th>`).join('')}</tr></thead><tbody>${v.values.slice(1).map((row:string[])=>`<tr>${row.map((x:string)=>`<td>${svgEsc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;break;
    case 'transversal': html=transversal();break;
    case 'equation': html=`<table class="equation-work" aria-label="Umformung der Gleichung"><tbody>${v.rows.map((row:any)=>`<tr><td>${row.left}</td><td>=</td><td>${row.right}</td><td class="equation-operation">${row.operation?`│ ${row.operation}`:''}</td></tr>`).join('')}</tbody></table>`;break;
    case 'long-multiplication': html=`<div class="long-calculation" aria-label="Schriftliche Multiplikation">${[['',''+v.top],['×',''+v.bottom],['rule',''],...v.partials.map((value:string)=>['',value]),...(v.result?[['rule',''],['result',''+v.result]]:[])].map(([sign,value]:string[])=>sign==='rule'?'<div class="calculation-rule"></div>':`<div class="calculation-line ${sign==='result'?'calculation-result':''}"><span>${sign==='result'?'':sign}</span><span>${value}</span></div>`).join('')}</div>`;break;
    case 'long-addition': html=`<div class="long-calculation" aria-label="Schriftliche Addition">${[['', ''+v.first],['+',''+v.second],['rule',''],['result',''+v.result]].map(([sign,value]:string[])=>sign==='rule'?'<div class="calculation-rule"></div>':`<div class="calculation-line ${sign==='result'?'calculation-result':''}"><span>${sign==='result'?'':sign}</span><span>${value}</span></div>`).join('')}</div>`;break;
    default: return '';
  }
  return `<div class="board-visual">${html}</div>`;
}
