import { readFileSync,writeFileSync } from 'node:fs';
const boards=JSON.parse(readFileSync('src/reference/catalog.json','utf8'));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const wrap=(s,max)=>{const lines=[];let line='';for(const word of String(s).split(/\s+/)){if(line&&line.length+word.length+1>max){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;};
const text=(s,x,y,size=23,color='#263440',max=52,weight=400)=>wrap(s,max).map((line,i)=>`<text x="${x}" y="${y+i*size*1.3}" fill="${color}" font-size="${size}" font-weight="${weight}">${escape(line)}</text>`).join('');
const line=(x1,y1,x2,y2,c='#32627c',width=3)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${width}"/>`;
function shape(kind,x,y){const a=`fill="#dcecf0" stroke="#32627c" stroke-width="3"`,g=content=>`<g transform="translate(${x},${y})">${content}</g>`;switch(kind){
 case 'square':return g(`<rect x="40" y="5" width="90" height="90" ${a}/>${text('a',80,117,20)}`);
 case 'rectangle':return g(`<rect x="15" y="20" width="150" height="75" ${a}/>${text('a',85,119,20)}${text('b',175,65,20)}`);
 case 'triangle':return g(`<path d="M5 95L180 95L65 5Z" ${a}/>${line(65,5,65,95)}${text('hₐ',74,57,19)}${text('a',92,119,20)}`);
 case 'circle':return g(`<circle cx="90" cy="53" r="48" ${a}/>${line(90,53,138,53)}${text('r',109,45,20)}`);
 case 'parallelogram':return g(`<path d="M5 95L145 95L180 5L40 5Z" ${a}/>${line(40,5,40,95)}${text('hₐ',48,62,18)}${text('a',85,117,20)}`);
 case 'trapezoid':return g(`<path d="M5 95L185 95L145 5L45 5Z" ${a}/>${line(45,5,45,95)}${text('a',90,117,20)}${text('c',90,0,20)}${text('h',52,55,18)}`);
 case 'cuboid':return g(`<path d="M15 35H140L175 8H50ZM15 35V95H140V35M140 95L175 68V8M15 95L50 68H175M50 8V68" ${a}/>${text('a',65,119,19)}${text('b',161,96,19)}${text('c',0,71,19)}`);
 case 'cube':return g(`<path d="M35 30L125 30L155 5L65 5ZM35 30V105H125V30M125 105L155 80V5M35 105L65 80H155M65 5V80" ${a}/>${text('a',70,125,19)}`);
 case 'cylinder':return g(`<path d="M45 20V100C45 122 145 122 145 100V20" ${a}/><ellipse cx="95" cy="20" rx="50" ry="17" ${a}/>${line(95,20,145,20)}${text('r',111,14,18)}${text('h',155,70,20)}`);
 case 'cone':return g(`<path d="M95 2L35 100Q95 132 155 100Z" ${a}/><ellipse cx="95" cy="100" rx="60" ry="20" fill="none" stroke="#32627c" stroke-width="3"/>${line(95,2,95,100)}${text('h',102,64,18)}${text('s',145,56,18)}`);
 case 'pyramid':return g(`<path d="M95 2L20 95L110 120L175 75ZM95 2L110 120M20 95L85 65L175 75M95 2L85 65" ${a}/>${line(95,2,95,95)}${text('h',100,56,18)}`);
 case 'sphere':return g(`<circle cx="95" cy="57" r="53" ${a}/><ellipse cx="95" cy="57" rx="53" ry="17" fill="none" stroke="#32627c" stroke-width="2"/>${line(95,57,148,57)}${text('r',115,49,19)}`);
 default:return '';
}}
function special(kind){
 if(kind==='pythagoras')return `<path d="M90 340V100L270 340Z" fill="#dfedf1" stroke="#32627c" stroke-width="4"/><path d="M90 315H115V340" fill="none" stroke="#32627c" stroke-width="3"/>${text('b = 4 cm',5,250,19)}${text('a = 3 cm',135,375,22)}${text('c = 5 cm',195,225,22)}${text('3² + 4² = 5²',400,195,31,'#196246',22,700)}${text('9 + 16 = 25',400,250,28,'#263440',22)}`;
 if(kind==='fractions')return `<circle cx="160" cy="205" r="80" fill="#d6e8e4" stroke="#27745a" stroke-width="3"/><path d="M160 125A80 80 0 0 1 240 205H160Z" fill="#27745a"/>${line(80,205,240,205,'#fff',3)}${line(160,125,160,285,'#fff',3)}${text('1 von 4 Teilen = 1/4',300,190,28)}${text('Vier gleich große Viertel bilden ein Ganzes.',300,238,23,'#263440',32)}`;
 if(kind==='percent'){let squares='';for(let i=0;i<100;i++)squares+=`<rect x="${40+(i%10)*18}" y="${125+Math.floor(i/10)*18}" width="16" height="16" fill="${i<20?'#27745a':'#dfebe5'}"/>`;return squares+text('20 von 100 = 20 %',300,190,30,'#196246',27,700)+text('Ein Prozent ist ein Hundertstel.',300,238,23);}
 if(kind==='charts'){let bars='';for(let i=0;i<3;i++){bars+=`<rect x="${110+i*100}" y="${300-[80,160,80][i]}" width="50" height="${[80,160,80][i]}" fill="${i===1?'#27745a':'#32627c'}"/>`+text(['A','B','C'][i],125+i*100,330,22)+text([10,20,10][i],115+i*100,290-[80,160,80][i],20);}return line(75,110,75,300)+line(75,300,380,300)+text('Anzahl',35,100,20)+bars+`<circle cx="590" cy="215" r="90" fill="#32627c"/><path d="M590 125A90 90 0 0 1 590 305V215Z" fill="#27745a"/><path d="M590 215V305A90 90 0 0 1 500 215Z" fill="#e3b26c"/>`+text('B: 50 %',550,345,22);}
 if(kind==='words'||kind==='sentence')return `<rect x="40" y="145" width="290" height="62" rx="8" fill="#e0e9f4"/><rect x="345" y="145" width="130" height="62" rx="8" fill="#d8ebe1"/><rect x="490" y="145" width="270" height="62" rx="8" fill="#f3e3d1"/>${text('Die Schülerin',62,186,29)}${text('liest',373,186,29)}${text('das Buch.',530,186,29)}${text('Subjekt',62,240,23,'#214d7c')}${text('Prädikat',343,240,23,'#196246')}${text('Akkusativobjekt',515,240,23,'#865021')}`;
 if(kind==='timeline')return line(80,200,720,200)+`<path d="M720 200L700 190V210Z" fill="#32627c"/>${[140,400,650].map((x,i)=>`<circle cx="${x}" cy="200" r="9" fill="#27745a"/>`+text(['Vergangenheit','Gegenwart','Zukunft'][i],x-80,250,23)).join('')}`;
 if(kind==='letter')return `<rect x="245" y="110" width="300" height="230" fill="#fff" stroke="#32627c" stroke-width="2"/>${text('Kontakt · Datum',265,145,18)}${text('Bewerbung um …',265,190,20,'#263440',24,700)}${[215,235,255,275].map(y=>line(265,y,520,y,'#a8b9c2',2)).join('')}${text('Gruß · Name',265,316,18)}`;
 if(kind==='reading')return flow(['Auftrag lesen','Textstelle finden','Antwort prüfen']);
 if(kind==='proportion')return `<g>${text('Direkt',70,155,28,'#196246',24,700)}${text('mehr Menge → mehr Preis',70,205,23,'#263440',26)}${text('Indirekt',420,155,28,'#214d7c',24,700)}${text('mehr Personen → weniger Zeit',420,205,23,'#263440',26)}</g>`;
 if(kind==='written')return `${text('234 · 16',100,155,30,'#263440',22,700)}${text('1404  (·6)',100,200,27)}${text('+2340  (·10)',80,242,27)}${line(70,258,350,258)}${text('3744',100,300,31,'#196246',22,700)}${text('936 : 4 = 234',430,155,29,'#263440',23,700)}${text('9−8=1  → 13',430,205,24)}${text('13−12=1 → 16',430,248,24)}${text('16−16=0',430,291,24)}`;
 if(kind==='map-tools')return `${line(170,120,170,295)}${line(90,205,250,205)}${text('N',160,105,24)}${text('O',265,215,24)}${text('S',160,325,24)}${text('W',55,215,24)}${[0,1,2,3].map(i=>line(430+i*60,150,430+i*60,290,'#a4b8c4',2)+line(430,150+i*45,610,150+i*45,'#a4b8c4',2)).join('')}${text('Breite: N / S',400,328,21)}${text('Länge: O / W',400,360,21)}`;
 if(kind==='earth')return `<circle cx="145" cy="220" r="77" fill="#8e6850"/><circle cx="145" cy="220" r="69" fill="#dd9c65"/><circle cx="145" cy="220" r="35" fill="#f4cf65"/><circle cx="145" cy="220" r="16" fill="#fff2ae"/>${text('Erdschichten',55,130,24,'#263440',20,700)}${text('Kruste → Mantel → Kern',35,330,18)}${text('Plattengrenze',290,130,24,'#263440',20,700)}<path d="M290 240H380L390 265H290Z M415 240H505V265H405Z" fill="#8e6850"/>${text('←',320,218,32)}${text('→',450,218,32)}${text('Beispiel: auseinander',285,330,18)}${text('Vulkan',580,130,24,'#263440',20,700)}<path d="M540 280L610 185L620 195L630 185L705 280Z" fill="#9b8877" stroke="#62574d" stroke-width="2"/><ellipse cx="620" cy="290" rx="36" ry="18" fill="#e49360"/><path d="M620 285V205L631 193L650 220" stroke="#d65a3e" stroke-width="8" fill="none"/>${text('Magma → Lava',552,330,18)}${text('Schematisch; Größen und Abstände nicht maßstäblich',95,373,18)}`;
 if(kind==='climate-water')return `${[0,1,2,3,4].map((v)=>`<rect x="50" y="${120+v*36}" width="250" height="36" fill="${['#d7edf6','#8ec6dc','#91ba82','#edc681','#dc9a6d'][v]}"/>`+text(['Polar','Subpolar','Gemäßigt','Subtropen','Tropen'][v],65,145+v*36,20)).join('')}${text('Pol → Äquator',70,335,20)}${text('Verdunstung → Wolken',355,150,24)}${text('↓ Niederschlag',450,210,24)}${text('Meer ← Fluss / Grundwasser',355,275,23,'#263440',33)}`;
 if(kind==='seasons')return `<circle cx="160" cy="215" r="65" fill="#f6d46a"/><circle cx="480" cy="215" r="55" fill="#8cb7d8"/><path d="M480 160A55 55 0 0 1 480 270Z" fill="#263440"/>${line(455,145,505,285,'#27745a',4)}${text('Sonne',110,315,24)}${text('Tag / Nacht',410,315,24)}${text('Achse: etwa 23,5° geneigt',340,120,21)}${text('Drehung: etwa 24 Stunden',340,350,21)}`;
 if(kind==='powers')return flow(['Gesetze','Ausführen','Recht sprechen']);
 if(kind==='system')return flow(['Wahlberechtigte','Bundestag','Bundesregierung']);
 if(kind==='elections')return `${text('Erststimme',65,160,30,'#214d7c',24,700)}${text('Person im Wahlkreis',65,220,24,'#263440',24)}${text('Zweitstimme',430,160,30,'#196246',24,700)}${text('Landesliste einer Partei',430,220,24,'#263440',24)}`;
 if(kind==='rights')return flow(['Menschenwürde','Gleichheit','Freiheit']);
 if(kind==='insurance')return `${text('Brutto',60,155,31,'#214d7c',24,700)}${text('− Steuern und Beiträge',60,210,26)}${text('= Netto',60,275,31,'#196246',24,700)}${text('5 Zweige',500,155,27,'#263440',20,700)}${text('Kranken · Pflege · Rente · Arbeitslosen · Unfall',440,200,22,'#263440',22)}`;
 return '';
}
function flow(labels){return labels.map((label,i)=>`<rect x="${35+i*255}" y="150" width="220" height="85" rx="9" fill="${['#dfe9f3','#dcece3','#f3e6d5'][i]}"/>`+text(label,50+i*255,185,25,'#263440',15,700)+(i<2?text('→',260+i*255,200,28):'')).join('');}
for(const board of boards){
 if(['anatomy','world','europe','americas','germany-physical'].includes(board.visual))continue;
 const cols=board.sections.some(s=>s.shape)?2:1;const hasSpecial=board.visual!=='panels';const top=hasSpecial?440:150;const gap=18;const panelW=cols===2?351:720;const panels=[];let y=top;
 for(let i=0;i<board.sections.length;i++){
  const s=board.sections[i],x=40+(i%cols)*(panelW+gap);if(cols===2&&i%2===0&&i>0)y+=320;
  const font=cols===2?20:24,max=cols===2?29:55;const contentLines=wrap(s.text,max),formulaLines=s.formula?wrap(s.formula,cols===2?28:53):[];const h=cols===2?302:60+contentLines.length*font*1.3+formulaLines.length*29+20;
  panels.push(`<rect x="${x}" y="${y}" width="${panelW}" height="${h}" rx="10" fill="#fff" stroke="#c8d5d9"/>`+text(s.title,x+18,y+36,cols===2?24:28,'#214d7c',cols===2?26:51,700));
  let ty=y+76;
  if(s.shape){panels.push(shape(s.shape,x+75,y+52));ty=y+205;}
  panels.push(text(s.text,x+18,ty,font,'#263440',max));ty+=contentLines.length*font*1.3+12;
  if(s.formula)panels.push(text(s.formula,x+18,ty,cols===2?19:24,'#196246',cols===2?30:53,600));
  if(cols===1)y+=h+gap;
 }
 const height=cols===2?y+335:y+22;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}" role="img"><title>${escape(board.title)}</title><desc>${escape(board.summary)}</desc><rect width="800" height="${height}" fill="#f7f7f0"/><g font-family="Arial,sans-serif">${text(board.title,40,58,34,'#18384b',42,700)}${text(board.summary,40,102,21,'#45565f',67)}${hasSpecial?`<g transform="translate(0 50)">${special(board.visual)}</g>`:''}${panels.join('')}</g></svg>`;
 writeFileSync('public/boards/'+board.id+'.svg',svg);board.figures[0].ratio=800/height;
}
writeFileSync('src/reference/catalog.json',JSON.stringify(boards,null,2)+'\n');
console.log('Vektortafeln gebaut.');

const seasons=boards.find(board=>board.id==='geography-seasons');
const earthAt=(x,y)=>`<circle cx="${x}" cy="${y}" r="35" fill="#85b4cf" stroke="#315a72" stroke-width="2"/><path d="M${x-20} ${y-47}L${x+20} ${y+47}" stroke="#27745a" stroke-width="4"/>`;
const orbit=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650" width="800" height="650"><title>Jahreszeiten auf der Nordhalbkugel</title><rect width="800" height="650" fill="#f7f7f0"/><g font-family="Arial,sans-serif">${text('Jahreszeiten: Die Achse bleibt geneigt',35,55,30,'#18384b',50,700)}${text('Schematisch: Erde, Sonne und Abstände nicht maßstäblich',35,95,20)}<ellipse cx="400" cy="315" rx="255" ry="175" fill="none" stroke="#b2c2c8" stroke-width="2" stroke-dasharray="7 7"/><circle cx="400" cy="315" r="52" fill="#f6d46a"/>${text('Sonne',365,322,23)}${earthAt(145,315)}${earthAt(655,315)}${earthAt(400,140)}${earthAt(400,490)}${text('Dezember',60,410,24)}${text('Nord: Winter',60,442,22)}${text('Juni',595,410,24)}${text('Nord: Sommer',572,442,22)}${text('September',500,155,23)}${text('März',490,500,23)}${text('Nordhalbkugel zur Sonne geneigt → höhere Sonne, längere Tage.',35,580,22,'#196246',62)}${text('Auf der Südhalbkugel sind Sommer und Winter vertauscht.',35,615,21,'#263440',66)}</g></svg>`;
writeFileSync('public/boards/geography-seasons-orbit.svg',orbit);
seasons.figures=[seasons.figures[0],{title:'Jahreszeiten im Jahreslauf',src:'geography-seasons-orbit.svg',ratio:800/650,hotspots:[]}];
writeFileSync('src/reference/catalog.json',JSON.stringify(boards,null,2)+'\n');
