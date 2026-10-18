"""Build the SVG state dataset from a local BKG VG250 WFS download.
See docs/LERNTAFELN-QUELLEN.md for source, licence and reproduction.
"""
import json,math,pathlib
raw=json.load(open('/tmp/lernkick-germany.json'))
def distance(p,a,b):
 x,y=p;ax,ay=a;bx,by=b;t=max(0,min(1,((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2 or 1)));return (x-ax-t*(bx-ax))**2+(y-ay-t*(by-ay))**2
def simplify(points,tolerance=.004):
 if len(points)<=2:return points
 a,b=points[0],points[-1];ds=[distance(p,a,b)for p in points];i=max(range(len(ds)),key=ds.__getitem__)
 if ds[i]>tolerance*tolerance:return simplify(points[:i+1],tolerance)[:-1]+simplify(points[i:],tolerance)
 return [a,b]
def project(p):return [round((p[0]-5.5)*48,1),round((55.3-p[1])*75,1)]
capitals={'01':'Kiel','02':'Hamburg','03':'Hannover','04':'Bremen','05':'Düsseldorf','06':'Wiesbaden','07':'Mainz','08':'Stuttgart','09':'München','10':'Saarbrücken','11':'Berlin','12':'Potsdam','13':'Schwerin','14':'Dresden','15':'Magdeburg','16':'Erfurt'}
centers={'01':[9.9,54.2],'02':[10,53.55],'03':[9.4,52.7],'04':[8.8,53.1],'05':[7.5,51.6],'06':[9,50.8],'07':[7.2,50],'08':[9,48.5],'09':[11.6,48.9],'10':[6.9,49.4],'11':[13.4,52.5],'12':[13.9,52.4],'13':[12.5,53.7],'14':[13.4,51.05],'15':[11.6,52],'16':[11,50.85]}
out=[]
for feature in raw['features']:
 p=feature['properties']
 if p['gf']!=4:continue
 rings=[];allpoints=[]
 for polygon in feature['geometry']['coordinates']:
  for ring in polygon:
   pts=[project(v)for v in simplify(ring)]
   if len(pts)<4:continue
   rings.append('M'+'L'.join(f'{x},{y}'for x,y in pts)+'Z');allpoints+=pts
 ars=p['ars'];xs=[v[0]for v in allpoints];ys=[v[1]for v in allpoints]
 out.append({'id':ars,'name':p['gen'],'capital':capitals[ars],'path':''.join(rings),'label':project(centers[ars]),'bounds':[min(xs),min(ys),max(xs),max(ys)]})
assert len(out)==16
pathlib.Path('src/maps/germany.json').write_text(json.dumps({'viewBox':'0 0 620 660','source':'© BKG 2026, dl-de/by-2-0; VG250, vereinfacht für Lernzwecke','sourceUrl':'https://gdz.bkg.bund.de/index.php/default/wfs-verwaltungsgebiete-1-250-000-stand-01-01-wfs-vg250.html','states':out},ensure_ascii=False,separators=(',',':')))
print('16 Bundesländer:',len(json.dumps(out)),'Zeichen')
