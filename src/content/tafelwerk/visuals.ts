import { renderWrittenReference } from './written-reference';
// Übernommene, für die LernKick-Palette angepasste Mathe-Visualisierungen.
const svgEsc=(str:string|number)=>String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const vulgarFractions:Record<string,[string,string]>={
  '¼':['1','4'],'½':['1','2'],'¾':['3','4'],'⅐':['1','7'],'⅑':['1','9'],'⅒':['1','10'],
  '⅓':['1','3'],'⅔':['2','3'],'⅕':['1','5'],'⅖':['2','5'],'⅗':['3','5'],'⅘':['4','5'],
  '⅙':['1','6'],'⅚':['5','6'],'⅛':['1','8'],'⅜':['3','8'],'⅝':['5','8'],'⅞':['7','8']
};
const superscriptDigits:Record<string,string>={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const subscriptDigits:Record<string,string>={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
export function fractionParts(value:string):[string,string]|null{
  if(vulgarFractions[value])return vulgarFractions[value];
  const match=value.match(/^([⁰¹²³⁴⁵⁶⁷⁸⁹]+)⁄([₀₁₂₃₄₅₆₇₈₉]+)$/u);
  return match?[Array.from(match[1],digit=>superscriptDigits[digit]).join(''),Array.from(match[2],digit=>subscriptDigits[digit]).join('')]:null;
}
export function formatFractions(markup:string){
  // Only transform text, never HTML tags or attributes. Support both slash forms.
  const fraction=(n:string,d:string)=>`<span class="fraction"><span class="top">${n}</span><span class="bottom">${d}</span></span>`;
  return markup.split(/(<[^>]*>)/g).map(part=>part.startsWith('<')?part:part
    .replace(/(\([^()]+\)|[A-Za-z0-9]+(?:,[0-9]+)?)\s*[\/⁄]\s*(\([^()]+\)|[A-Za-z0-9]+(?:,[0-9]+)?)/g,(_match:string,n:string,d:string)=>fraction(n.replace(/^\(|\)$/g,''),d.replace(/^\(|\)$/g,'')))
    .replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)⁄([₀₁₂₃₄₅₆₇₈₉]+)/gu,(_match:string,n:string,d:string)=>fraction(Array.from(n,digit=>superscriptDigits[digit]).join(''),Array.from(d,digit=>subscriptDigits[digit]).join('')))
    .replace(/[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/gu,(value:string)=>fraction(...vulgarFractions[value]))
  ).join('');
}

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
    const m=v.slope??2,n=v.intercept??1;
    const bounds=m===0?[-3,7]:[(-2-n)/m,(6-n)/m].sort((a,b)=>a-b);
    const x1=Math.max(-3,bounds[0]),x2=Math.min(7,bounds[1]);
    line=x1<=x2&&!(m===0&&(n < -2||n > 6))?`<line x1="${px(x1)}" y1="${py(m*x1+n)}" x2="${px(x2)}" y2="${py(m*x2+n)}" stroke="var(--calc-teal)" stroke-width="3.5" stroke-linecap="round"/>`:'';
  }
  const axes=`<path d="M 20 ${oy} H 264 M ${ox} 206 V 12" fill="none" stroke="var(--calc-ink)" stroke-width="2"/><path d="M 264 ${oy} l -7 -4 m 7 4 l -7 4 M ${ox} 12 l -4 7 m 4 -7 l 4 7" fill="none" stroke="var(--calc-ink)" stroke-width="2" stroke-linecap="round"/>${svgText(276,oy-7,'x','var(--calc-ink)',13)}${svgText(ox+10,10,'y','var(--calc-ink)',13)}`;
  let guides='',points='';
  if(v.mode==='point') {
    const x=px(v.x),y=py(v.y);
    guides=`<path d="M ${x} ${oy} V ${y} H ${ox}" fill="none" stroke="var(--calc-orange)" stroke-width="2" stroke-dasharray="4 4"/>`;
    points=`<circle cx="${x}" cy="${y}" r="5.5" fill="var(--calc-orange)"/><rect x="${x+8}" y="${y-24}" width="72" height="21" rx="4" fill="var(--calc-display)" stroke="var(--calc-housing)"/><text x="${x+14}" y="${y-10}" fill="var(--calc-ink)" font-size="11" font-family="Barlow,sans-serif" font-weight="700">P(${v.x} | ${v.y})</text>`;
  } else if(v.mode==='line') {
    points=(v.points??[]).map((p:any)=>{
      const x=px(p.x),y=py(p.y);
      const label=p.label?`<text x="${x+8}" y="${y-8}" fill="var(--calc-orange)" font-size="10" font-family="Barlow,sans-serif" font-weight="700">${svgEsc(p.label)}</text>`:'';
      return `<circle cx="${x}" cy="${y}" r="5.7" fill="var(--calc-orange)" stroke="var(--calc-display)" stroke-width="1.5"/>${label}`;
    }).join('');
  }
  return svg(`${grid}${line}${axes}${guides}${points}`,'Koordinatensystem mit x- und y-Achse, Pfeilspitzen und lesbaren Punktkoordinaten','0 0 320 220');
}

function parabola() {
  const px=(x:number)=>160+x*46,py=(y:number)=>176-y*35;
  const points=[-2,-1,0,1,2];
  const grid=points.map(x=>`<path d="M ${px(x)} 22 V 176" stroke="var(--calc-housing)"/>${svgText(px(x),193,x,'var(--calc-ink)',11)}`).join('');
  const curve=Array.from({length:81},(_,i)=>{const x=-2+i/20;return `${i?'L':'M'} ${px(x)} ${py(x*x)}`;}).join(' ');
  return svg(`${grid}<path d="M 45 176 H 278 M 160 182 V 14" fill="none" stroke="var(--calc-ink)" stroke-width="2"/>${svgText(283,171,'x')}${svgText(173,17,'y')}${[1,2,3,4].map(y=>svgText(148,py(y)+4,y,'var(--calc-ink)',11)).join('')}<path d="${curve}" fill="none" stroke="var(--calc-teal)" stroke-width="3"/>${points.map(x=>`<circle cx="${px(x)}" cy="${py(x*x)}" r="4" fill="var(--calc-orange)"/>`).join('')}${svgText(211,162,'S(0 | 0)','var(--calc-orange)',12)}`,'Parabel y = x² mit den Punkten (−2 | 4), (−1 | 1), (0 | 0), (1 | 1), (2 | 4); Scheitel im Ursprung','0 0 320 205');
}
function symmetry() {
  return svg(`<path d="M 160 14 V 172" stroke="var(--calc-orange)" stroke-width="2" stroke-dasharray="5 4"/><path d="M 160 30 L 70 145 H 250 Z" fill="var(--calc-teal)" fill-opacity=".15" stroke="var(--calc-teal)" stroke-width="2.5"/><path d="M 106 99 H 214 M 160 88 H 171 V 99" fill="none" stroke="var(--calc-ink)" stroke-width="2"/><circle cx="106" cy="99" r="4" fill="var(--calc-ink)"/><circle cx="214" cy="99" r="4" fill="var(--calc-ink)"/>${svgText(96,91,'P')}${svgText(225,91,'P′')}${svgText(132,116,'d','var(--calc-ink)',12)}${svgText(188,116,'d','var(--calc-ink)',12)}${svgText(160,190,'Spiegelachse','var(--calc-orange)',13)}`,'Achsensymmetrisches Dreieck mit senkrechter Spiegelachse. P und P′ haben denselben Abstand d zur Achse. Ihre Verbindung steht senkrecht zur Achse.','0 0 320 205');
}
function triangleArea() {
  return svg(`<rect x="50" y="25" width="220" height="132" fill="none" stroke="var(--calc-housing)" stroke-width="2" stroke-dasharray="5 4"/><path d="M 50 157 L 50 25 L 270 157 Z" fill="var(--calc-teal)" fill-opacity=".25" stroke="var(--calc-teal)" stroke-width="3"/><path d="M 50 142 H 65 V 157" fill="none" stroke="var(--calc-orange)" stroke-width="2"/>${svgText(160,180,'g = 5 cm','var(--calc-ink)',13)}${svgText(25,95,'3 cm','var(--calc-orange)',12)}${svgText(112,135,'A = 7,5 cm²','var(--calc-ink)',14)}`,'Rechtwinkliges Dreieck als Hälfte eines Rechtecks: Grundseite 5 cm, senkrechte Höhe 3 cm, Fläche 7,5 cm²','0 0 320 195');
}

function transversal(v:any) {
  const r=16;
  const arc=(x:number,y:number,start:number,end:number,color:string)=>{const point=(degree:number)=>{const a=degree*Math.PI/180;return `${(x+r*Math.cos(a)).toFixed(1)} ${(y+r*Math.sin(a)).toFixed(1)}`;};return `<path d="M ${point(start)} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${point(end)}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>`;};
  const upper=[105,44],lower=[185,115];
  const pairs:Record<string,Array<{at:number[];from:number;to:number;label:string;lx:number;ly:number;color:string}>>={
    corresponding:[{at:upper,from:180,to:222,label:'α',lx:77,ly:26,color:'var(--calc-orange)'},{at:lower,from:180,to:222,label:'α′',lx:145,ly:101,color:'var(--calc-teal)'}],
    alternate:[{at:upper,from:42,to:180,label:'γ',lx:91,ly:80,color:'var(--calc-orange)'},{at:lower,from:222,to:360,label:'β′',lx:206,ly:93,color:'var(--calc-teal)'}],
    vertical:[{at:upper,from:180,to:222,label:'α',lx:77,ly:26,color:'var(--calc-orange)'},{at:upper,from:0,to:42,label:'δ',lx:137,ly:76,color:'var(--calc-teal)'}],
    adjacent:[{at:upper,from:180,to:222,label:'α',lx:77,ly:26,color:'var(--calc-orange)'},{at:upper,from:222,to:360,label:'β',lx:132,ly:25,color:'var(--calc-teal)'}]
  };
  const marks=(pairs[v.active]??pairs.corresponding).map(item=>`${arc(item.at[0],item.at[1],item.from,item.to,item.color)}${svgText(item.lx,item.ly,item.label,item.color,15)}`).join('');
  const diagram=svg(`<line x1="18" y1="44" x2="292" y2="44" stroke="var(--calc-ink)" stroke-width="2.3"/><line x1="18" y1="115" x2="292" y2="115" stroke="var(--calc-ink)" stroke-width="2.3"/><line x1="61" y1="5" x2="229" y2="154" stroke="var(--calc-ink)" stroke-width="3" stroke-linecap="round"/>${marks}<circle cx="105" cy="44" r="3" fill="var(--calc-ink)"/><circle cx="185" cy="115" r="3" fill="var(--calc-ink)"/>${svgText(287,37,'g','var(--calc-ink)',12)}${svgText(287,108,'h','var(--calc-ink)',12)}`,'Parallele Geraden g und h mit farbig markierten Winkelbögen am jeweiligen Schnittpunkt','0 0 310 160');
  return `<div class="transversal-work">${diagram}</div>`;
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
function angleVisual(_v:any) {
 const cx=146,cy=151,r=88;let ticks='';
 for(let degree=0;degree<=180;degree+=5){
  const a=-degree*Math.PI/180,major=degree%30===0||degree===45;
  const x1=cx+(r-(major?10:5))*Math.cos(a),y1=cy+(r-(major?10:5))*Math.sin(a),x2=cx+r*Math.cos(a),y2=cy+r*Math.sin(a);
  const color=degree===45?'var(--calc-orange)':'var(--calc-ink)';
  ticks+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${degree===45?3:1}"/>`;
  if(major){const tx=cx+(r-20)*Math.cos(a),ty=cy+(r-20)*Math.sin(a);ticks+=svgText(tx,ty+3,degree,color,10);}
 }
 return svg(`<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="var(--calc-ink)" stroke-width="1.4"/><line x1="24" y1="${cy}" x2="300" y2="${cy}" stroke="var(--calc-ink)" stroke-width="2"/>${ticks}<line x1="${cx}" y1="${cy}" x2="250" y2="47" stroke="var(--calc-teal)" stroke-width="3"/><path d="M 173.6 123.4 A 39 39 0 0 1 185 151" fill="none" stroke="var(--calc-orange)" stroke-width="3"/>${svgText(204,138,'45°','var(--calc-orange)',15)}<circle cx="${cx}" cy="${cy}" r="3" fill="var(--calc-orange)"/>${svgText(cx,176,'Mittelpunkt am Scheitel','var(--calc-ink)',11)}`,'Winkelmesser mit Nullmarke rechts, 5-Grad-Teilung und hervorgehobener 45-Grad-Markierung','0 40 320 145');
}
function circleReference(v:any){
 const area=v.mode==='area';
 const formula=area?'A = π · r²':'U = π · d';
 const result=area?'A ≈ 28,27 cm²':'U ≈ 18,85 cm';
 return svg(`<circle cx="90" cy="90" r="64" fill="var(--calc-teal)" fill-opacity="${area ? .18 : 0}" stroke="var(--calc-orange)" stroke-width="3"/><line x1="26" y1="90" x2="154" y2="90" stroke="var(--calc-orange)" stroke-width="2"/><line x1="90" y1="90" x2="135.25" y2="44.75" stroke="var(--calc-teal)" stroke-width="3"/><circle cx="90" cy="90" r="3" fill="var(--calc-ink)"/>${svgText(90,112,'d = 6 cm','var(--calc-ink)',13)}${svgText(83,39,'r = 3 cm','var(--calc-ink)',13)}${svgText(81,82,'M','var(--calc-ink)',12)}${svgText(176,53,formula,'var(--calc-ink)',20,'start')}${svgText(176,91,area?'r = 3 cm':'d = 2r = 6 cm','var(--calc-ink)',15,'start')}${svgText(176,126,result,'var(--calc-ink)',16,'start')}`,'Kreis mit Mittelpunkt M, Radius 3 cm und Durchmesser 6 cm. '+(area?'Flächeninhalt ungefähr 28,27 Quadratzentimeter.':'Umfang ungefähr 18,85 Zentimeter.'),'0 0 360 180');
}
function triangleVisual(v:any) {
  if(v.label==='angles') return svg(`<path d="M 50 158 L 265 158 L 177 7 Z" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/><path d="M 80 158 A 30 30 0 0 0 69 135 M 235 158 A 30 30 0 0 0 246 135" fill="none" stroke="var(--calc-orange)" stroke-width="3" stroke-linecap="round"/><path d="M 192 28 A 30 30 0 0 1 162 28" fill="none" stroke="var(--calc-teal)" stroke-width="3.2" stroke-linecap="round"/>${svgText(93,145,'50°','var(--calc-orange)',14)}${svgText(222,145,'60°','var(--calc-orange)',14)}${svgText(177,57,v.result?'70°':'γ','var(--calc-teal)',18)}`,v.result?'Dreieck mit Innenwinkeln 50 Grad, 60 Grad und 70 Grad':'Dreieck mit Innenwinkeln 50 Grad, 60 Grad und dem gesuchten Winkel Gamma');
  return svg(`<path d="M 58 154 L 58 34 L 218 154 Z" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/><path d="M 58 139 H 73 V 154" fill="none" stroke="var(--calc-orange)" stroke-width="2"/>${svgText(35,95,'a = 3 cm','var(--calc-ink)',12)}${svgText(140,177,'b = 4 cm','var(--calc-ink)',12)}${svgText(154,75,v.label==='result'?'c = 5 cm':'c = ?','var(--calc-orange)',13)}`,'Rechtwinkliges Dreieck mit Katheten 3 und 4 Zentimeter und Hypotenuse 5 Zentimeter');
}
function pythagorasSquares() {
  const square=(x:number,y:number,n:number,label:string,color:string)=>{
    const cell=8;let cells='';
    for(let row=0;row<n;row++)for(let col=0;col<n;col++)cells+=`<rect x="${x+col*cell}" y="${y+row*cell}" width="${cell}" height="${cell}" fill="${color}" fill-opacity=".17" stroke="var(--calc-ink)" stroke-opacity=".6" stroke-width=".7"/>`;
    return `${cells}${svgText(x+cell*n/2,y+cell*n+17,label,'var(--calc-ink)',12)}`;
  };
  return svg(`<path d="M 24 114 L 24 57 L 100 114 Z" fill="var(--calc-display)" stroke="var(--calc-ink)" stroke-width="2.5"/><path d="M 24 104 H 34 V 114" fill="none" stroke="var(--calc-orange)" stroke-width="2"/>${svgText(20,83,'3','var(--calc-ink)',11)}${svgText(62,132,'4','var(--calc-ink)',11)}${svgText(69,72,'c','var(--calc-ink)',11)}${square(132,57,3,'a²','var(--calc-teal)')}${svgText(166,81,'+','var(--calc-orange)',18)}${square(180,53,4,'b²','var(--calc-teal)')}${svgText(225,81,'=','var(--calc-orange)',18)}${square(240,49,5,'c²','var(--calc-orange)')}`,'Rechtwinkliges Dreieck und die Flächen der Quadrate über seinen Seiten','0 0 340 145');
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
function projectionVisual(v:any) {
 const view=(ox:number,vertical:string,value:number,title:string,label:string,active:boolean)=>{
  const color=active?'var(--calc-orange)':'var(--calc-teal)',px=ox+60,py=140-value*20;let ticks='';
  for(let n=0;n<=4;n++)ticks+=svgText(ox+n*20,157,n,'var(--calc-ink)',10);
  for(let n=1;n<=5;n++)ticks+=svgText(ox-10,144-n*20,n,'var(--calc-ink)',10);
  return `${svgText(ox+58,18,title,'var(--calc-ink)',13)}<path d="M ${ox} 30 V 140 H ${ox+100}" fill="none" stroke="var(--calc-ink)" stroke-width="2"/>${ticks}${svgText(ox+110,144,'x','var(--calc-ink)',12)}${svgText(ox-7,27,vertical,'var(--calc-ink)',12)}<path d="M ${px} 140 V ${py} H ${ox}" fill="none" stroke="${color}" stroke-dasharray="4 3" stroke-width="2"/><circle cx="${px}" cy="${py}" r="4" fill="${color}"/>${svgText(px+8,py-9,label,'var(--calc-ink)',12,'start')}`;
 };
 return svg(view(25,'y',2,'Grundriss: von oben','Pᵍ(3|2)',v.active==='ground')+view(205,'z',4,'Aufriss: von vorn','Pᵃ(3|4)',v.active==='front'),'Punkt P(3|2|4): Grundriss Pᵍ(3|2) von oben und Aufriss Pᵃ(3|4) von vorn','0 0 360 170');
}
function binomialSquares(){
 const rect=(x:number,y:number,w:number,h:number,label:string,color:string)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" fill-opacity=".22" stroke="var(--calc-ink)" stroke-width="1.4"/>${svgText(x+w/2,y+h/2+5,label,'var(--calc-ink)',18)}`;
 return svg(`${rect(25,25,90,90,'a²','var(--calc-teal)')}${rect(115,25,60,90,'ab','var(--calc-orange)')}${rect(25,115,90,60,'ab','var(--calc-orange)')}${rect(115,115,60,60,'b²','var(--calc-violet)')}${svgText(70,17,'a')}${svgText(145,17,'b')}${svgText(14,75,'a')}${svgText(14,150,'b')}${svgText(194,70,'(a + b)²','var(--calc-ink)',20,'start')}${svgText(194,108,'= a² + 2ab + b²','var(--calc-ink)',16,'start')}`,'Quadrat mit Seitenlänge a plus b, zerlegt in a², ab, ab und b²','0 0 340 190');
}
function inequalityLine(v:any){
 const x=(n:number)=>38+(n+1)*35,bound=Number(v.bound),less=v.direction==='less';
 let ticks='';for(let n=-1;n<=6;n++)ticks+=`<line x1="${x(n)}" y1="70" x2="${x(n)}" y2="82" stroke="var(--calc-ink)"/>${svgText(x(n),103,n,'var(--calc-ink)',13)}`;
 const end=less?16:304;
 return svg(`<line x1="12" y1="76" x2="310" y2="76" stroke="var(--calc-ink)" stroke-width="2"/>${ticks}<path d="M ${x(bound)} 57 H ${end}m${less?7:-7} -5 ${less?-7:7} 5 ${less?7:-7} 5" fill="none" stroke="var(--calc-teal)" stroke-width="3"/><circle cx="${x(bound)}" cy="57" r="6" fill="var(--calc-display)" stroke="var(--calc-teal)" stroke-width="3"/>${svgText(160,28,`x ${less?'<':'>'} ${bound}`,'var(--calc-ink)',20)}` ,`Zahlengerade: x ${less?'kleiner':'größer'} als ${bound}; offener Kreis bei ${bound}, Lösungsbereich nach ${less?'links':'rechts'}`,'0 0 320 118');
}
function similarTriangles(){
 const h=Math.sqrt(3*3-2.625*2.625);
 const triangle=(ox:number,scale:number,large:boolean)=>{
  const a=[ox,130],b=[ox+4*scale,130],c=[ox+2.625*scale,130-h*scale],suffix=large?'′':'';
  const side=(p:number[],q:number[],color:string)=>`<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${color}" stroke-width="3"/>`;
  return side(a,b,'var(--calc-orange)')+side(a,c,'var(--calc-teal)')+side(b,c,'var(--calc-violet)')+svgText((a[0]+b[0])/2,150,`c${suffix} = ${large?12:4}`,'var(--calc-ink)',13)+svgText((a[0]+c[0])/2-10,(a[1]+c[1])/2-9,`b${suffix} = ${large?9:3}`,'var(--calc-ink)',12)+svgText((b[0]+c[0])/2+9,(b[1]+c[1])/2-9,`a${suffix} = ${large?6:2}`,'var(--calc-ink)',12);
 };
 return svg(`${svgText(52,27,'klein','var(--calc-ink)',15)}${svgText(212,27,'groß: Faktor 3','var(--calc-ink)',15)}${triangle(20,16,false)}${triangle(110,48,true)}`,'Zwei ähnliche Dreiecke im Maßstab 1 zu 3: entsprechende Seiten a und a′ mit 2 und 6, b und b′ mit 3 und 9, c und c′ mit 4 und 12','0 0 340 162');
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
    case 'chips': html=`<div class="visual-chips">${v.values.map((it:any,i:number)=>`<span class="visual-chip ${(v.emphasisIndices??[Number.isInteger(v.emphasisIndex)?v.emphasisIndex:v.values.length-1]).includes(i)?'emphasis':''}">${it}</span>`).join('')}</div>`;break;
    case 'numberline': html=numberLine(v);break;
    case 'bags': html=`<div class="bag-row">${Array.from({length:v.count},()=>`<div class="bag">${v.content}</div>`).join('')}</div>`;break;
    case 'fractions': html=v.parts.map((p:any,pi:number)=>`<div class="fraction-block"><div class="fraction-block-label">${p.label}</div><div class="fraction-strip">${Array.from({length:p.d},(_,i)=>`<span class="fraction-cell ${i<p.n?'filled':''} ${pi>0?'secondary':''}"></span>`).join('')}</div></div>`).join('');break;
    case 'balance': html=`<div class="balance-line"><div class="balance-pan"><span>Links</span><strong>${v.left}</strong></div><span class="balance-equal">=</span><div class="balance-pan"><span>Rechts</span><strong>${v.right}</strong></div></div>`;break;
    case 'table': html=`<table class="viz-table"><thead><tr>${v.heads.map((x:any)=>`<th scope="col">${formatFractions(svgEsc(x))}</th>`).join('')}</tr></thead><tbody>${v.rows.map((r:any,i:number)=>`<tr class="${v.focus===i?'focus':''}">${r.map((x:any)=>`<td>${formatFractions(svgEsc(x))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;break;
    case 'sign-rules': html=`<div class="sign-rule-grid">${v.groups.map((group:any)=>`<section class="sign-rule-group"><h2>${svgEsc(group.title)}</h2>${group.examples.map((example:string)=>`<div class="sign-rule-example">${svgEsc(example)}</div>`).join('')}</section>`).join('')}</div>`;break;
    case 'percent': html=`<div class="percent-strip"><span class="percent-fill" style="width:${Math.max(0,Math.min(100,Number(v.filled)))}%"></span></div><span class="viz-label">${v.label}</span>`;break;
    case 'grid': html=`<div class="square-grid" style="grid-template-columns: repeat(${v.n},1fr)">${Array.from({length:v.n*v.n},()=>'<span></span>').join('')}</div>`;break;
    case 'array': html=`<div class="viz-array">${v.rows.map((r:string,i:number)=>`<div class="${i===v.rows.length-1?'line':''}">${r.replace(/ /g,'&nbsp;')}</div>`).join('')}</div>`;break;
    case 'graph': html=graph(v);break;
    case 'parabola': html=parabola();break;
    case 'symmetry': html=symmetry();break;
    case 'triangle-area': html=triangleArea();break;
    case 'distribute': html=distribute(v);break;
    case 'binomial-squares': html=binomialSquares();break;
    case 'inequality-line': html=inequalityLine(v);break;
    case 'similar-triangles': html=similarTriangles();break;
    case 'circle-reference': html=circleReference(v);break;
    case 'angles': html=angleVisual(v);break;
    case 'triangle': html=triangleVisual(v);break;
    case 'pythagoras-squares': html=pythagorasSquares();break;
    case 'rect': html=rectangle(v);break;
    case 'box': html=boxShape();break;
    case 'projection': html=projectionVisual(v);break;
    case 'combos': html=combinations(v);break;
    case 'math-stack': html=`<div class="math-stack" role="group" aria-label="Zusammenhängender Rechenweg">${v.rows.map((row:string)=>`<div>${formatFractions(svgEsc(row))}</div>`).join('')}</div>`;break;
    case 'long-division': {const columns=String(v.dividend).length;const digits=(value:string,offset=0)=>Array.from({length:columns},(_,i)=>`<span class="division-digit">${i>=offset&&i<offset+value.length?svgEsc(value[i-offset]):'&nbsp;'}</span>`).join('');const rows=(v.rows??[]).map((row:any)=>row.rule?`<div class="division-rule" style="--division-offset:${row.at??0};--division-length:${row.length??columns}"></div>`:`<div class="division-row ${row.result?'division-result':''}" style="--division-offset:0"><span class="division-digits">${digits(String(row.value),row.at??0)}</span>${row.subtract?'<span class="division-minus" aria-label="minus">−</span>':''}</div>`).join('');html=`<div class="long-division" style="--division-columns:${columns}" role="group" aria-label="Schriftliche Division ${svgEsc(v.dividend)} geteilt durch ${svgEsc(v.divisor)}"><div class="division-quotient"><span class="division-digits">${digits(String(v.quotient),v.quotientAt??0)}</span></div><div class="division-divisor">${svgEsc(v.divisor)}</div><div class="division-start"><span class="division-digits">${digits(String(v.dividend))}</span></div><div class="division-work">${rows}</div></div>`;break;}
    case 'written-reference': html=renderWrittenReference(v.kind);break;
    case 'multiplication-grid': {
      const columns=Number(v.columns), cell=(value:string|null|undefined,classes='')=>`<span class="arith-cell ${value==null?'is-empty':''} ${classes}">${value==null?'&nbsp;':svgEsc(value)}</span>`;
      const row=(label:string,cells:(string|null)[],kind='',active:number[]=[])=>(`<div class="arith-row ${kind}"><span class="arith-label">${svgEsc(label)}</span>${Array.from({length:columns},(_,i)=>cell(cells[i],`${active.includes(i)?'is-active':''} ${i===v.activeAddColumn?'is-add-active':''}`)).join('')}</div>`);
      const blank:Array<string|null>=Array(columns).fill(null);
      const carryCells=[...blank];if(v.carryIn?.value)carryCells[v.carryIn.column]=String(v.carryIn.value);
      const addCarryCells=[...blank];if(v.addCarry?.value)addCarryCells[v.addCarry.column]=String(v.addCarry.value);
      const topCells=Array(columns-v.top.length).fill(null).concat([...String(v.top)]);
      const bottomCells=Array(columns-v.bottom.length).fill(null).concat([...String(v.bottom)]);
      const activeTop=v.activeTopIndex==null?[]:[columns-v.top.length+v.activeTopIndex];
      const activeBottom=v.activeBottomIndex==null?[]:[columns-v.bottom.length+v.activeBottomIndex];
      const parts=(v.partials??[]).map((part:any,index:number)=>row(`${index?'＋ ':''}${part.label}`,part.cells,`arith-partial ${part.complete?'is-complete':''}`,v.activeAddColumn==null?[]:[v.activeAddColumn])).join('');
      const carries=v.carryIn?.value?row('Übertrag',carryCells,'arith-carry-row'):'';
      const addCarry=v.addCarry?.value?row('Übertrag',addCarryCells,'arith-carry-row'):'';
      const result=v.resultCells?row('Ergebnis',v.resultCells,`arith-result ${v.final?'is-final':''}`,v.activeAddColumn==null?[]:[v.activeAddColumn]):'';
      html=`<div class="arithmetic-visual multiplication-visual"><div class="arithmetic-equation">${svgEsc(v.top)} × ${svgEsc(v.bottom)}${v.final?` = ${svgEsc(v.result)}`:''}</div><div class="arithmetic-grid" style="--arith-columns:${columns}" role="group" aria-label="Rechenschritte schriftlich multiplizieren">${carries}${row('1. Faktor',topCells,'arith-factor',activeTop)}${row('× 2. Faktor',bottomCells,'arith-factor',activeBottom)}<div class="arith-rule"><span></span></div>${parts}${v.resultCells?`<div class="arith-rule"><span></span></div>${addCarry}${result}`:''}</div></div>`;
      break;
    }
    case 'division-grid': {
      const columns=String(v.dividend).length, cell=(value:string|null|undefined,classes='')=>`<span class="arith-cell ${value==null?'is-empty':''} ${classes}">${value==null?'&nbsp;':svgEsc(value)}</span>`;
      const row=(label:string,cells:(string|null)[],kind='',active:number[]=[])=>(`<div class="arith-row ${kind}"><span class="arith-label">${svgEsc(label)}</span>${Array.from({length:columns},(_,i)=>cell(cells[i],`${active.includes(i)?'is-active':''}`)).join('')}</div>`);
      const aligned=(value:string,end:number)=>{const cells:Array<string|null>=Array(columns).fill(null);[...String(value)].forEach((digit,i)=>{const col=end-String(value).length+1+i;if(col>=0&&col<columns)cells[col]=digit;});return cells;};
      const quotientCells=(v.quotientCells??Array(columns).fill('')).map((digit:string)=>digit||null);
      const dividendCells=[...String(v.dividend)];
      const work=(v.groups??[]).map((group:any,index:number)=>{
        const active=index===v.activeGroup?[group.end]:[];
        let rows='';
        if(group.brought){
          const broughtCells=aligned(group.brought.rest,group.brought.from);broughtCells[group.brought.to]=String(group.brought.digit);
          rows+=row('↓ Ziffer holen',broughtCells,'arith-brought',[group.brought.to]);
        }
        rows+=row('Teilzahl',aligned(String(group.partial),group.end),`arith-partial ${index===v.activeGroup?'is-current':''}`,active);
        if(group.product!=null){
          rows+=row(`− ${group.quotientDigit} × ${v.divisor}`,aligned(String(group.product),group.end),'arith-subtract',active);
          rows+='<div class="arith-rule"><span></span></div>';
          rows+=row('Rest',aligned(String(group.remainder),group.end),'arith-remainder');
        }
        return rows;
      }).join('');
      const quotient=v.final?String(v.quotient):quotientCells.filter((digit:string|null)=>digit!=null).join('');
      html=`<div class="arithmetic-visual division-visual"><div class="arithmetic-equation"><span>${svgEsc(v.dividend)} : ${svgEsc(v.divisor)} =</span><strong>${svgEsc(quotient||'…')}</strong>${v.final&&BigInt(v.remainder||'0')>0n?`<small>Rest ${svgEsc(v.remainder)}</small>`:''}</div><div class="arithmetic-grid" style="--arith-columns:${columns}" role="group" aria-label="Rechenschritte schriftlich dividieren">${row('Quotient',quotientCells,'arith-quotient',v.activeIndex==null?[]:[v.activeIndex])}${row('Dividend',dividendCells,'arith-factor',v.activeIndex==null?[]:[v.activeIndex])}${work}${v.final?`<div class="division-check">Probe: ${svgEsc(v.divisor)} × ${svgEsc(v.quotient)}${BigInt(v.remainder||'0')>0n?` + ${svgEsc(v.remainder)}`:''} = ${svgEsc(v.dividend)}</div>`:''}</div></div>`;
      break;
    }
    case 'linear-function': {const m=Number(v.slope??2),n=Number(v.n??1);html=`<div class="linear-function-work">${graph({mode:'line',slope:m,intercept:n,points:[{x:0,y:n},{x:1,y:m+n}]})}<table class="function-values"><thead><tr>${v.values[0].map((x:string)=>`<th scope="col">${svgEsc(x)}</th>`).join('')}</tr></thead><tbody>${v.values.slice(1).map((row:string[])=>`<tr>${row.map((x:string)=>`<td>${svgEsc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;break;}
    case 'transversal': html=transversal(v);break;
    case 'equation': html=`<table class="equation-work" aria-label="Umformung der Gleichung"><tbody>${v.rows.map((row:any)=>`<tr><td>${row.left}</td><td>=</td><td>${row.right}</td><td class="equation-operation">${row.operation?`│ ${row.operation}`:''}</td></tr>`).join('')}</tbody></table>`;break;
    case 'long-multiplication': {const values=[String(v.top),String(v.bottom),...(v.partials??[]).map(String),...(v.result?[String(v.result)]:[])];const columns=Math.max(...values.map(value=>value.length),2);const row=(value:string,sign='',className='')=>`<div class="multiplication-row ${className}"><span class="multiplication-sign">${sign}</span><span class="multiplication-digits" style="--multiplication-columns:${columns}">${Array.from({length:columns},(_,i)=>`<span>${i<columns-value.length?'&nbsp;':svgEsc(value[i-(columns-value.length)])}</span>`).join('')}</span></div>`;const rule=(extra='')=>`<div class="inline-multiplication-rule ${extra}" style="--multiplication-columns:${columns}"></div>`;html=`<div class="inline-multiplication" role="group" aria-label="Schriftliche Multiplikation ${svgEsc(v.top)} mal ${svgEsc(v.bottom)}"><div class="multiplication-stack">${row(String(v.top))}${row(String(v.bottom),'×')}${rule()}${(v.partials??[]).map((value:string,i:number)=>row(String(value),i?'+':'','multiplication-partial')).join('')}${v.result?`${rule('result-rule')}${row(String(v.result),'','multiplication-result')}`:''}</div></div>`;break;}
    case 'long-addition': {
      const columns=Math.max(String(v.first).length,String(v.second).length,String(v.result??'').length);
      const row=(value:string,sign='',className='')=>`<div class="calculation-line ${className}"><span>${sign}</span><span class="addition-digits">${Array.from(value.padStart(columns,' '),digit=>`<span>${digit===' '?'&nbsp;':svgEsc(digit)}</span>`).join('')}</span></div>`;
      html=`<div class="long-calculation" style="--addition-columns:${columns}" role="group" aria-label="Schriftliche Addition">${row(String(v.first))}${row(String(v.second),'+')}${v.carry?row(String(v.carry),'','calculation-carry'):''}<div class="calculation-rule"></div>${v.partial?row(String(v.partial),'','calculation-partial'):''}${v.result?row(String(v.result),'','calculation-result'):''}</div>`;
      break;
    }
    default: return '';
  }
  return `<div class="board-visual">${html}</div>`;
}
