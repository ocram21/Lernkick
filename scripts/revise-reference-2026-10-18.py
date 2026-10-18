"""Rebuild only the diagrams requested on 18 October. Original, labelled SVG schemata.
No external fonts, scripts or runtime network dependencies.
"""
import json,html,pathlib,math
root=pathlib.Path(__file__).resolve().parents[1]
catalog=json.loads((root/'src/reference/catalog.json').read_text())
byid={b['id']:b for b in catalog}
esc=lambda x:html.escape(str(x))
def text(t,x,y,size=23,color='#203d49',anchor='start',weight=400):
 return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{weight}">{esc(t)}</text>'
def path(d,color='#32627c',width=3,fill='none',arrow=False):
 return f'<path d="{d}" stroke="{color}" stroke-width="{width}" fill="{fill}"'+(' marker-end="url(#arrow)"'if arrow else'')+'/>'
def box(x,y,w,h,fill='#e0ece8',stroke='#718c87'):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}"/>'
def write(name,title,body,height=720):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="{height}" viewBox="0 0 800 {height}" role="img"><title>{esc(title)}</title><desc>Beschriftetes Lernschema. Größen vereinfacht.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs><rect width="800" height="{height}" fill="#f7f7f0"/><g font-family="Arial,sans-serif">'+text(title,35,50,30,weight=700)+body+text('LernKick · eigenes, vereinfachtes Lernschema',35,height-22,17)+'</g></svg>'
 (root/f'public/boards/{name}.svg').write_text(svg)
 return {'title':title,'src':name+'.svg','ratio':800/height,'hotspots':[]}
# Written calculations: one fixed x coordinate per decimal place, not spaced prose.
def digits(value,row,origin=270,step=48,size=38,color='#203d49'):
 value=str(value);return ''.join(f'<text data-column="{i}" x="{origin+i*step}" y="{row}" text-anchor="middle" font-family="monospace" font-size="{size}" fill="{color}">{esc(c)}</text>'for i,c in enumerate(value.rjust(6))if c!=' ')
def carry(a,d):
 out={};c=0
 for i,ch in enumerate(reversed(str(a))):
  c=(int(ch)*d+c)//10
  if c:out[i+1]=c
 return ''.join(str(out.get(i,'' )or ' ')for i in reversed(range(6)))
def multiplication(a,b,y):
 body=text(f'{a} · {b} = {a*b}',35,y,28,weight=700)
 # Carries for each multiplier digit are independently labelled and aligned over a.
 row=y+48
 for i,ch in enumerate(reversed(str(b))):
  body+=text(f'Übertrag bei ·{ch}:',40,row,20)+digits(carry(a,int(ch)),row,size=22,color='#28614e');row+=34
 body+=digits(a,row+10)+digits('×'+str(b),row+60)+path(f'M240 {row+76}H555')
 row+=128
 for i,ch in enumerate(reversed(str(b))):
  value=a*int(ch)*10**i;body+=digits(value,row)+text(f'· {int(ch)*10**i}',590,row,22);row+=51
 body+=text('+',215,row-51,30)+path(f'M240 {row-32}H555')+digits(a*b,row+15,color='#28614e')
 return body
byid['math-written']['figures']=[write('math-written','Schriftlich multiplizieren',multiplication(234,16,100)+multiplication(2057,34,610),1160)]
def division(a,b,y):
 s=str(a);body=text(f'{a} : {b} = {a//b}',35,y,29,weight=700)
 x=90;step=52;row=y+64
 for i,c in enumerate(s):body+=text(c,x+i*step,row,38,anchor='middle')
 body+=text(f': {b} = {a//b}',x+len(s)*step+18,row,34)
 remainder=0;started=False
 for i,ch in enumerate(s):
  current=remainder*10+int(ch);q=current//b
  if not started and not q and i<len(s)-1:remainder=current;continue
  started=True;product=q*b
  def aligned(v,yy):return ''.join(text(c,x+(i-len(str(v))+1+j)*step,yy,34,anchor='middle')for j,c in enumerate(str(v)))
  body+=aligned(product,row+48)+text('−',x+(i-len(str(product)))*step,row+48,26,anchor='middle')+path(f'M{x+(i-max(len(str(current)),len(str(product)))+1)*step-22} {row+60}H{x+i*step+23}')
  remainder=current-product;row+=104
  if i<len(s)-1:
   body+=aligned(remainder,row)
   # The next dividend digit enters its own next decimal column.
   body+=text(s[i+1],x+(i+1)*step,row,34,anchor='middle')+path(f'M{x+(i+1)*step} {row-78}V{row-35}',width=2,arrow=True)
  else:body+=aligned(remainder,row)
 body+=text(f'Probe: {a//b} · {b} = {a}',430,y+160,24,color='#28614e')
 return body
byid['math-written']['figures'].append(write('math-written-division','Schriftlich dividieren',division(936,4,105)+division(12096,8,600),1230))
# All fractions, including the illustration and calculations, have a horizontal bar.
def fraction(n,d,x,y,size=29):
 return text(n,x,y-10,size,anchor='middle')+path(f'M{x-22} {y}H{x+22}',width=2)+text(d,x,y+33,size,anchor='middle')
def equation(parts,y):
 out='';x=65
 for part in parts:
  if isinstance(part,tuple):out+=fraction(*part,x,y);x+=78
  else:out+=text(part,x,y+10,30,anchor='middle');x+=60
 return out
body=text('Zähler: ausgewählte Teile',45,105,23)+text('Nenner: gleich große Teile des Ganzen',45,140,23)
body+='<circle cx="145" cy="245" r="65" fill="#d9e7df" stroke="#32627c" stroke-width="2"/><path d="M145 180A65 65 0 0 1 210 245H145Z" fill="#27745a"/>'+path('M80 245H210M145 180V310','#fff',3)+text('1 von 4 Teilen =',260,245,26)+fraction(1,4,520,240)
examples=[('Erweitern und kürzen',[(1,2),'=',(3,6),'·',(6,8),'=',(3,4)]),('Addieren',[(1,2),'+',(1,4),'=',(2,4),'+',(1,4),'=',(3,4)]),('Subtrahieren',[(3,4),'−',(1,4),'=',(2,4),'=',(1,2)]),('Multiplizieren',[(2,3),'·',(3,4),'=',(6,12),'=',(1,2)]),('Dividieren: mit dem Kehrwert malnehmen',[(1,2),':',(3,4),'=',(1,2),'·',(4,3),'=',(2,3)])]
for i,(label,parts)in enumerate(examples):y=380+i*155;body+=text(label,40,y,24,weight=700)+equation(parts,y+62)
byid['math-fractions']['figures']=[write('math-fractions','Brüche verstehen und rechnen',body,1200)]
# Clear, permanently printed labels, matching the explanations below each diagram.
body=text('Duftstoffe gelangen mit der Luft in die Nase.',35,100,24)
body+=path('M100 445V285Q100 205 180 205H365V440Z',fill='#e4edf0')+text('Nasenraum',155,390,26)
body+='<rect x="200" y="210" width="155" height="28" fill="#ceaa64"/>'+text('Riechschleimhaut',430,220,25)+path('M355 224H410')
body+=text('mit Riechzellen',430,250,22)+path('M250 210V145H725V275H590V285',width=4,arrow=True)+text('Nervenfasern',285,133,23)
body+=box(430,290,320,75)+text('Riechkolben',455,325,25,weight=700)+text('verarbeitet erste Signale',455,350,20)
body+=path('M590 365V415',arrow=True)+box(430,425,320,75)+text('Gehirn erkennt den Geruch',450,468,22)
body+=path('M45 465H140V285H260V243',color='#28614e',width=5,arrow=True)+text('Duftstoffe + Luft',35,520,23,color='#28614e')
body+=text('Riechzellen wandeln den Reiz in Nervensignale um.',35,580,24)+text('Die Pfeile zeigen den Weg von Duftstoffen und Signalen.',35,620,21)
byid['biology-nose']['figures']=[write('nose','Nase: So entsteht ein Geruch',body,700)]
byid['biology-nose']['figures'][0]['hotspots']=[{'id':'1','label':'Riechzellen','text':'Duftstoffe lösen sich im Schleim und binden an passende Rezeptoren der Riechzellen. Daraus entstehen Nervensignale.'},{'id':'2','label':'Riechkolben und Gehirn','text':'Nervenfasern leiten die Signale zum Riechkolben. Weitere Gehirnbereiche verarbeiten sie und erkennen Gerüche.'}]
body=text('Querschnitt durch die Haut',35,100,24)
body+='<rect x="50" y="190" width="365" height="55" fill="#e5c7ac"/><rect x="50" y="245" width="365" height="220" fill="#eccfc6"/><rect x="50" y="465" width="365" height="125" fill="#e8d690"/>'
for label,x,y,tx,ty in [('Oberhaut',415,215,470,205),('Lederhaut',415,335,470,325),('Unterhaut',415,530,470,520)]:body+=path(f'M{x} {y}H{tx-15}')+text(label,tx,ty,26,weight=700)
body+=path('M135 130V405',color='#66513d',width=10)+path('M120 195V405Q135 435 150 405V195',color='#66513d',width=3)+path('M135 150H230V130H260')+text('Haar',270,137,24)
body+=path('M290 195V380',color='#26788a',width=5)+path('M290 380C240 350 245 430 275 414C315 457 338 385 290 380',color='#26788a',width=5)+path('M315 407H450V425')+text('Schweißdrüse',470,440,24)
body+=path('M80 555V380L115 350M80 400L65 370M80 480H180L205 455',color='#835518',width=4)+path('M180 480H430V580H455')+text('Nerven',470,588,24)
body+=text('Schutz außen · Reize wahrnehmen · Wärme regeln',35,645,24)
byid['biology-skin']['figures']=[write('skin','Haut: Schichten und Aufgaben',body,720)]
byid['biology-skin']['figures'][0]['hotspots']=[{'id':str(i+1),'label':label,'text':explain}for i,(label,explain)in enumerate([('Oberhaut','Äußere Schutzbarriere. Sie begrenzt Wasserverlust und erneuert sich ständig.'),('Lederhaut','Elastisches Gewebe mit Blutgefäßen, Nerven und Drüsen.'),('Unterhaut','Fett und Bindegewebe polstern und isolieren.'),('Haar','Ein Haar wächst aus einer Haarwurzel in der Haut.'),('Schweißdrüse','Gibt Schweiß über einen Gang nach außen ab. Verdunstender Schweiß kühlt.'),('Nerven','Leiten unter anderem Informationen über Berührung, Wärme und Schmerz weiter.')])]
# Flow rather than an unlabelled anatomical drawing. Right heart appears on viewer left.
body=text('Pfeile zeigen den Blutfluss. Rechts/links aus Körpersicht.',35,100,21)
body+=box(235,135,330,80,'#e2e9df')+text('Lunge: Sauerstoff aufnehmen',400,180,22,anchor='middle',weight=700)
for x,label1,label2,c in [(80,'Rechter Vorhof','Rechte Herzkammer','#dae8f1'),(435,'Linker Vorhof','Linke Herzkammer','#f0ddd7')]:
 body+=box(x,300,285,75,c)+text(label1,x+142,344,24,anchor='middle',weight=700)+box(x,420,285,75,c)+text(label2,x+142,465,22,anchor='middle',weight=700)+path(f'M{x+142} 375V415',arrow=True)
body+=path('M220 495V535H40V175H230',color='#32627c',width=4,arrow=True)+text('Lungenarterie',55,245,21,color='#32627c')
body+=path('M565 175H720V265H577V295',color='#9f4e3d',width=4,arrow=True)+text('Lungenvenen',560,244,21,color='#9f4e3d')
body+=box(235,600,330,80,'#e2e9df')+text('Körper: Sauerstoff abgeben',400,645,22,anchor='middle',weight=700)
body+=path('M577 495V555H660V640H570',color='#9f4e3d',width=4,arrow=True)+text('Aorta',670,564,21,color='#9f4e3d')
body+=path('M235 640H180V560H390V280H222V295',color='#32627c',width=4,arrow=True)+text('Hohlvenen',235,550,21,color='#32627c')
body+=text('Blau: sauerstoffarm · Rot: sauerstoffreich',35,735,22)+text('Arterien führen vom Herzen weg; Venen zum Herzen hin.',35,775,22)+text('Herzklappen lassen das Blut in eine Richtung fließen.',35,815,22)
byid['biology-circulation']['figures']=[write('circulation','Herz: Lungen- und Körperkreislauf',body,880)]
byid['biology-circulation']['figures'][0]['hotspots']=[{'id':'1','label':'Lungenkreislauf','text':'Rechte Herzkammer → Lungenarterie → Lunge → Lungenvenen → linker Vorhof. In der Lunge gibt das Blut Kohlendioxid ab und nimmt Sauerstoff auf.'},{'id':'2','label':'Körperkreislauf','text':'Linke Herzkammer → Aorta → Körper → Hohlvenen → rechter Vorhof. Der Körper nimmt Sauerstoff aus dem Blut auf.'}]
# Political system: institution seating is schematic, no party colours or seat counts.
body=text('Zwei verschiedene Vertretungen wirken an Bundesgesetzen mit.',35,100,22)
for x,title in [(35,'Bundestag'),(420,'Bundesrat')]:
 body+=box(x,135,345,390,'#e4ece7')+text(title,x+20,175,29,weight=700)
 for ring in range(3):
  for j in range(9):
   angle=math.pi+j*math.pi/8;cx=x+172+math.cos(angle)*(70+ring*25);cy=300+math.sin(angle)*(70+ring*25)
   body+=f'<rect x="{cx-7:.1f}" y="{cy-5:.1f}" width="14" height="10" rx="2" fill="#536f75"/>'
 body+=text('Sitzordnung im Plenarsaal (schematisch)',x+15,330,16)
for x,lines in [(55,['Abgeordnete des Volkes','Wird von Wahlberechtigten gewählt.','Beschließt Gesetze und Haushalt.','Wählt den Bundeskanzler.','Kontrolliert die Bundesregierung.']),(440,['Mitglieder der Landesregierungen','Vertreten die 16 Bundesländer.','Beraten Bundesgesetze mit.','Je nach Gesetz: Zustimmung','oder Möglichkeit zum Einspruch.'])]:
 for i,t in enumerate(lines):body+=text(t,x,370+i*31,19,weight=700 if i==0 else 400)
body+=path('M205 530V575H370',arrow=True)+path('M590 530V575H430',arrow=True)+box(255,590,290,65)+text('Gesetzgebung des Bundes',400,630,22,anchor='middle',weight=700)
body+=box(65,705,670,100)+text('Bundesregierung',85,739,25,weight=700)+text('Leitet die Politik; Regierung und Verwaltung setzen Gesetze um.',85,778,21)
body+=path('M400 660V700',arrow=True)+text('Kontrolle durch den Bundestag',35,855,22)
byid['social-system']['figures']=[write('social-system','Bundestag und Bundesrat',body,915)]
body=text('Staatliche Macht hat verschiedene Aufgaben.',35,105,24)
for i,(title,subtitle,example)in enumerate([('Gesetzgebung','Parlamente','Ein Gesetz beraten und beschließen'),('Ausführung','Regierung und Verwaltung','Ein Amt wendet das Gesetz an'),('Rechtsprechung','Unabhängige Gerichte','Ein Gericht entscheidet einen Streit')]):
 y=150+i*170;body+=box(40,y,720,130,['#e0e8f0','#e0ece3','#eee4d5'][i])+text(title,65,y+38,28,weight=700)+text(subtitle,65,y+75,23)+text(example,65,y+108,22)
body+=text('Die Bereiche begrenzen und kontrollieren sich gegenseitig.',40,710,23)+text('Beispiel: Der Bundestag kontrolliert die Bundesregierung.',40,750,22)
byid['social-powers']['figures']=[write('social-powers','Gewaltenteilung: Macht verteilen',body,820)]
body=text('Eine Wahlentscheidung – zwei unterschiedliche Stimmen.',35,105,24)
for x,title,who,meaning in [(35,'Erststimme','Person im Wahlkreis','Wer soll den Wahlkreis vertreten?'),(425,'Zweitstimme','Landesliste einer Partei','Bestimmt die Sitzverteilung maßgeblich.')]:
 body+=box(x,150,340,280)+text(title,x+20,190,28,weight=700)+f'<circle cx="{x+55}" cy="245" r="20" fill="none" stroke="#32627c" stroke-width="3"/>'+path(f'M{x+44} 234L{x+66} 256M{x+66} 234L{x+44} 256')+text(who,x+20,315,23)+text(meaning,x+20,360,17)
body+=text('Parteisitz im Wahlkreis: meiste Erststimmen allein reichen',35,480,23)+text('nicht; zusätzlich ist Zweitstimmendeckung erforderlich.',35,516,23)
body+=path('M180 550V600H400',arrow=True)+path('M600 550V600H405',arrow=True)+box(215,625,370,80)+text('Bundestag',400,673,29,anchor='middle',weight=700)+text('Allgemein · unmittelbar · frei · gleich · geheim',35,755,24)
byid['social-elections']['figures']=[write('social-elections','Bundestagswahl: zwei Stimmen',body,820)]
# Targeted text changes only.
u=byid['math-units']['sections'][0];u['text']='Von km zu m: mal 1000. Von m zu dm, dm zu cm und cm zu mm jeweils mal 10. Zurück teilst du durch denselben Faktor.';u['formula']='1 km = 1000 m · 1 m = 10 dm = 100 cm = 1000 mm'
s=byid['german-sentence']['sections'][1];s['text']='Das Prädikat nennt das Geschehen: liest. Das Objekt ergänzt es: das Buch. Frage hier: Wen oder was liest sie?';s['formula']='Subjekt → Die Schülerin · Prädikat → liest · Objekt → das Buch'
# New schemata have original rights; don't retain external-illustration credits.
credits=json.loads((root/'src/reference/assetCredits.json').read_text())
for name in ['nose.svg','skin.svg','circulation.svg']:credits.pop(name,None)
(root/'src/reference/assetCredits.json').write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n')
(root/'src/reference/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
