"""Natural Earth 1:50m countries + existing rivers, projected without axis stretching.
Inputs: /tmp/lernkick-americas-50m.json, /tmp/lernkick-rivers.json.
Country data: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
Projection: spherical Lambert azimuthal equal-area, centre 95°W/15°N.
Mountain ranges are deliberately schematic, labelled bands, not measured relief.
"""
import json,math,pathlib,html
root=pathlib.Path(__file__).resolve().parents[1]
features=json.load(open('/tmp/lernkick-americas-50m.json'))['features']
rivers=json.load(open('/tmp/lernkick-rivers.json'))['features']
def raw(lon,lat):
 l=math.radians(lon+95);p=math.radians(lat);p0=math.radians(15)
 k=math.sqrt(2/(1+math.sin(p0)*math.sin(p)+math.cos(p0)*math.cos(p)*math.cos(l)))
 return k*math.cos(p)*math.sin(l),k*(math.cos(p0)*math.sin(p)-math.sin(p0)*math.cos(p)*math.cos(l))
# One common scale for both axes; preserve the projection's intended proportions.
scale=315
def project(lon,lat):
 x,y=raw(lon,lat);return 400+x*scale,590-y*scale
esc=lambda x:html.escape(str(x))
def text(t,lon,lat,size=21,color='#193f4a'):
 x,y=project(lon,lat);return f'<text x="{x:.1f}" y="{y:.1f}" font-family="Arial,sans-serif" font-size="{size}" text-anchor="middle" fill="{color}" stroke="#f7f7ee" stroke-width="3" paint-order="stroke">{esc(t)}</text>'
def line(coords,color,width=2):
 return '<path d="M'+'L'.join('%.1f,%.1f'%project(*p)for p in coords)+f'" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>'
body='<rect x="25" y="100" width="750" height="990" rx="10" fill="#e1edf2"/>'
body+='<defs><clipPath id="map"><rect x="25" y="100" width="750" height="990"/></clipPath></defs><g clip-path="url(#map)">'
for f in features:
 if f['properties']['CONTINENT'] not in ['North America','South America'] and f['properties']['ADMIN']!='Greenland':continue
 polys=f['geometry']['coordinates']if f['geometry']['type']=='MultiPolygon'else[f['geometry']['coordinates']]
 paths=[]
 for poly in polys:
  for ring in poly:
   # Drop tiny subpixel edges, retain the more detailed coastline and islands.
   points=[]
   for p in ring:
    xy=project(*p)
    if not points or math.dist(xy,points[-1])>.65:points.append(xy)
   if len(points)>2:paths.append('M'+'L'.join(f'{x:.1f},{y:.1f}'for x,y in points)+'Z')
 body+='<path d="'+''.join(paths)+'" fill="#dbe6cc" stroke="#71886c" stroke-width=".8"/>'
# Equator and actual river paths.
body+=line([(lon,0)for lon in range(-170,-19,2)],'#91a6b0',1)
for f in rivers:
 if f['properties'].get('name')not in ['Amazonas','Amazon','Mississippi','Parana','Paraná','Orinoco']:continue
 lines=f['geometry']['coordinates']if f['geometry']['type']=='MultiLineString'else[f['geometry']['coordinates']]
 for coords in lines:body+=line(coords,'#287296',2.5)
body+=line([(-123,56),(-117,48),(-111,41),(-106,35)],'#987545',8)
body+=line([(-73,10),(-75,3),(-78,-3),(-76,-10),(-71,-18),(-69,-28),(-71,-38),(-73,-49),(-70,-54)],'#987545',9)
for label,lon,lat,size,c in [('Kanada',-107,57,25,'#193f4a'),('USA',-100,39,25,'#193f4a'),('Mexiko',-103,23,21,'#193f4a'),('Grönland',-42,72,21,'#193f4a'),('Mittelamerika',-96,8,19,'#193f4a'),('Karibik',-66,22,19,'#193f4a'),('Brasilien',-51,-13,25,'#193f4a'),('Peru',-77,-10,19,'#193f4a'),('Chile',-79,-32,19,'#193f4a'),('Argentinien',-59,-38,21,'#193f4a'),('Rocky Mountains',-137,42,19,'#714e25'),('Anden',-87,-20,25,'#714e25'),('Amazonas',-59,-3,20,'#1f638a'),('Mississippi',-88,33,17,'#1f638a'),('Pazifik',-139,-7,25,'#1f638a'),('Atlantik',-35,30,25,'#1f638a'),('Äquator',-120,1.5,17,'#476b80')]:body+=text(label,lon,lat,size,c)
# Connect off-coast mountain labels to the actual highlighted bands.
body+=line([(-86,-19),(-72,-19)],'#714e25',1.5)+line([(-130,43),(-114,43)],'#714e25',1.5)
body+='</g>'
svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1240" viewBox="0 0 800 1240"><title>Nord- und Südamerika mit Anden</title><desc>Flächentreue Lambert-Projektion. Ländergrenzen, große Flüsse und schematisch markierte Gebirge.</desc><rect width="800" height="1240" fill="#f7f7f0"/><text x="35" y="55" font-family="Arial,sans-serif" font-size="32" fill="#193f4a">Nord- und Südamerika</text>'+body+'<g font-family="Arial,sans-serif" font-size="19" fill="#193f4a"><text x="35" y="1130">Braun: Gebirge (schematisch) · Blau: Flüsse</text><text x="35" y="1163">Flächentreue Projektion · Norden im Kartenmittelpunkt oben</text><text x="35" y="1205">Natural Earth 1:50m · Public Domain · LernKick</text></g></svg>'
(root/'public/boards/geography-americas.svg').write_text(svg)
boards=json.loads((root/'src/reference/catalog.json').read_text())
for b in boards:
 if b['id']=='geography-americas':b['figures'][0]['ratio']=800/1240
(root/'src/reference/catalog.json').write_text(json.dumps(boards,ensure_ascii=False,indent=2)+'\n')
