"""Build bundled educational SVG maps from local Natural Earth source downloads.
Source URLs and licences are documented in docs/LERNTAFELN-QUELLEN.md.
Input files: /tmp/lernkick-world.json, /tmp/lernkick-rivers.json.
The runtime app never requests external map services.
"""
import json,pathlib,math,html,collections
world=json.load(open('/tmp/lernkick-world.json'))['features']
# Natural Earth follows de-facto control. For this school map Crimea is assigned
# to Ukraine, consistent with UN General Assembly resolution 68/262.
russia=next(f for f in world if f['properties']['ADMIN']=='Russia')
ukraine=next(f for f in world if f['properties']['ADMIN']=='Ukraine')
crimea=[];other=[]
for poly in russia['geometry']['coordinates']:
 xs=[p[0]for p in poly[0]];ys=[p[1]for p in poly[0]]
 if min(xs)>32 and max(xs)<37 and min(ys)>44 and max(ys)<47:crimea.append(poly)
 else:other.append(poly)
russia['geometry']['coordinates']=other
if ukraine['geometry']['type']=='Polygon':ukraine['geometry']={'type':'MultiPolygon','coordinates':[ukraine['geometry']['coordinates']]+crimea}
else:ukraine['geometry']['coordinates']+=crimea
assert len(crimea)==1
esc=lambda t:html.escape(str(t))
def text(t,x,y,size=22,color='#173c4c',anchor='middle'):
 return f'<text x="{x:.1f}" y="{y:.1f}" font-family="Arial,sans-serif" font-size="{size}" fill="{color}" text-anchor="{anchor}" stroke="#f5f7ef" stroke-width="3" paint-order="stroke">{esc(t)}</text>'
def polygons(feature):return feature['geometry']['coordinates']if feature['geometry']['type']=='MultiPolygon'else[feature['geometry']['coordinates']]
def build(id,title,bounds,labels,legend):
 minx,miny,maxx,maxy=bounds;width,height=800,1010 if id=='geography-europe'else 750
 scale=min(740/(maxx-minx),520/(maxy-miny));ox=(width-(maxx-minx)*scale)/2;oy=130+(520-(maxy-miny)*scale)/2
 def project(p):return [ox+(p[0]-minx)*scale,oy+(maxy-p[1])*scale]
 shapes=[]
 for f in world:
  paths=[]
  for poly in polygons(f):
   xs=[p[0]for p in poly[0]];ys=[p[1]for p in poly[0]]
   if max(xs)<minx or min(xs)>maxx or max(ys)<miny or min(ys)>maxy:continue
   for ring in poly:
    points=[project(p)for p in ring];paths.append('M'+'L'.join(f'{x:.1f},{y:.1f}'for x,y in points)+'Z')
  if paths:shapes.append('<path d="'+''.join(paths)+'" fill="#d8e8cf" stroke="#738674" stroke-width=".7"/>')
 body=f'<defs><clipPath id="map"><rect x="30" y="125" width="740" height="525"/></clipPath></defs><rect x="30" y="125" width="740" height="525" fill="#e3f0f4"/>'+f'<g clip-path="url(#map)">{"".join(shapes)}</g>'
 codes=['IS','IE','GB','PT','ES','FR','DE','PL','IT','AT','CH','NO','SE','FI','DK','UA','BY','RO','GR','TR','RU','NL','BE','LU','CZ']
 for index,(label,lon,lat) in enumerate(labels):
  x,y=project([lon,lat])
  if id=='geography-europe'and label in ['Niederlande','Belgien','Luxemburg']:
   lx,ly=project({'Niederlande':[5.3,54],'Belgien':[-3,51.3],'Luxemburg':[-1,49.5]}[label]);body+=f'<path d="M{x},{y}L{lx},{ly}" stroke="#173c4c" stroke-width="1"/>';x,y=lx,ly
  body+=text(codes[index]if id=='geography-europe'and index<len(codes)else label,x,y,20 if id=='geography-europe'else 23)
 if id=='geography-europe':
  for index,(label,_,_)in enumerate(labels[:len(codes)]):body+=text(codes[index]+': '+label,45+(index%3)*255,690+(index//3)*30,16,anchor='start')
  body+=text('Ausgewählte Länder · Nachbarn Deutschlands vollständig beschriftet',400,965,15)

 body+=text('N',748,160,20)+f'<path d="M748 200V168L742 180M748 168L754 180" stroke="#173c4c" fill="none" stroke-width="2"/>'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 {height}" width="800" height="{height}"><title>{esc(title)}</title><rect width="800" height="{height}" fill="#f7f7f0"/>'+text(title,400,55,34)+body+(text(legend,400,690,18)if id!='geography-europe'else'')+text('Natural Earth · Public Domain · vereinfacht, nicht maßstabsgetreu',400,height-20,15)+'</svg>'
 pathlib.Path('public/boards/'+id+'.svg').write_text(svg)
 return {'title':title,'src':id+'.svg','ratio':800/height,'hotspots':[]}
worldlabels=[('Nordamerika',-105,45),('Südamerika',-58,-16),('Europa',15,53),('Asien',96,43),('Afrika',20,1),('Australien',135,-32),('Ozeanien',161,-10),('Antarktika',0,-77),('Atlantik',-32,6),('Pazifik',-141,-9),('Indischer Ozean',70,-35),('Arktischer Ozean',-18,81),('Südlicher Ozean',30,-59)]
europe=[('Island',-18,65),('Irland',-8,53),('Vereinigtes Königreich',-3,58),('Portugal',-9,38),('Spanien',-4,40),('Frankreich',2,46),('Deutschland',10,51),('Polen',20,52),('Italien',13,42),('Österreich',14,47),('Schweiz',8,46),('Norwegen',8,62),('Schweden',16,64),('Finnland',26,65),('Dänemark',10,56),('Ukraine',31,49),('Belarus',28,54),('Rumänien',25,46),('Griechenland',23,39),('Türkei',34,39),('Russland',41,59),('Niederlande',5.3,52.3),('Belgien',4.6,50.7),('Luxemburg',6.1,49.7),('Tschechien',15.5,49.9),('Nordsee',3,55),('Ostsee',19,57),('Mittelmeer',14,36),('Atlantik',-14,47)]
americas=[('Kanada',-104,56),('USA',-102,39),('Mexiko',-103,23),('Mittelamerika',-86,13),('Karibik',-69,19),('Brasilien',-51,-11),('Peru',-76,-11),('Chile',-76,-31),('Argentinien',-62,-37),('Rocky Mountains',-118,45),('Anden',-76,-22),('Amazonas',-59,-3),('Pazifik',-126,-6),('Atlantik',-28,18)]
figs={
 'geography-world':build('geography-world','Kontinente und Ozeane',[-180,-85,180,85],worldlabels,'Äquator: 0° Breite · Lage stark vereinfacht'),
 'geography-europe':build('geography-europe','Europa: Länder und Orientierung',[-25,33,50,72],europe,'Kleine Nachbarländer: NL · BE · LU · CZ; siehe Textansicht'),
 'geography-americas':build('geography-americas','Nord- und Südamerika',[-170,-58,-20,78],americas,'Norden oben · Atlantik im Osten · Pazifik im Westen')}
# Germany: exact BKG state shapes for the outline, schematic landscape labels,
# and Natural Earth river geometries clipped to Germany's outline.
states=json.load(open('src/maps/germany.json'))['states']
outline=''.join(s['path']for s in states)
paths=[]
rivers=json.load(open('/tmp/lernkick-rivers.json'))['features']
names={'Rhine':'Rhein','Elbe':'Elbe','Danube':'Donau','Donau':'Donau','Oder':'Oder'}
for f in rivers:
 if f['properties'].get('name')not in names:continue
 lines=f['geometry']['coordinates']if f['geometry']['type']=='MultiLineString'else[f['geometry']['coordinates']]
 for coords in lines:
  points=[((p[0]-5.5)*48,(55.3-p[1])*75)for p in coords]
  paths.append('<path d="M'+'L'.join(f'{x:.1f},{y:.1f}'for x,y in points)+'" stroke="#1c6da0" stroke-width="4" fill="none"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" width="800" height="900"><title>Deutschland: Landschaften und Flüsse</title><rect width="800" height="900" fill="#f7f7f0"/>'+text('Deutschland: Landschaften und Flüsse',400,50,31)+'<g transform="translate(85 85)"><defs><clipPath id="germany"><path d="'+outline+'"/></clipPath></defs><path d="'+outline+'" fill="#d9e8c9" stroke="#57714d" stroke-width="2"/><g clip-path="url(#germany)">'+''.join(paths)+'</g>'+text('Norddeutsches Tiefland',265,180,22)+text('Mittelgebirge',225,355,25)+text('Alpenvorland',285,535,22)+text('Alpen',270,590,22)+text('Rhein',100,375,22,'#1c6da0')+text('Elbe',350,260,22,'#1c6da0')+text('Oder',435,245,22,'#1c6da0')+text('Donau',315,510,22,'#1c6da0')+'</g>'+text('Landschaften schematisch · Flüsse blau',400,775,21)+text('© BKG 2026 dl-de/by-2-0 · Natural Earth Public Domain',400,825,17)+'</svg>'
pathlib.Path('public/boards/geography-germany.svg').write_text(svg)
figs['geography-germany']={'title':'Landschaften und Flüsse','src':'geography-germany.svg','ratio':800/900,'hotspots':[]}
boards=json.load(open('src/reference/catalog.json'))
for b in boards:
 if b['id']in figs:b['figures']=[figs[b['id']]]
pathlib.Path('src/reference/catalog.json').write_text(json.dumps(boards,ensure_ascii=False,indent=2)+'\n')
print('Vier Kartentafeln gebaut.')
