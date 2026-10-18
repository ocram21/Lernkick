import { useState } from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import type { Subject, UserData } from '../lib/schema';
import { mosaicWorlds, segmentVisible } from '../learning/mosaics';
const subjects:Record<Subject,{title:string;short:string}>={math:{title:'Mathematik',short:'MA'},german:{title:'Deutsch',short:'D'},social:{title:'Sozialkunde',short:'SK'},biology:{title:'Biologie',short:'Bio'},geography:{title:'Geografie',short:'Geo'}};
export function CompetencyMosaic({data,selectedSubject,hideNavigation=false}:{data:UserData;selectedSubject?:Subject;hideNavigation?:boolean}) {
  const [localSubject,setSubject]=useState<Subject>('math');const subject=selectedSubject??localSubject;const world=mosaicWorlds.find(w=>w.subject===subject)!;
  const count=world.segments.filter(s=>segmentVisible(data,s)).length;
  return <section className="mosaic-section" aria-label="Fortschrittsbilder">
    {!hideNavigation&&<div className="mosaic-subjects" role="group" aria-label="Fach für den Fortschritt">{mosaicWorlds.map(w=><button key={w.id} aria-label={`${subjects[w.subject].title} (${subjects[w.subject].short})`} aria-pressed={subject===w.subject} onClick={()=>setSubject(w.subject)}>{subjects[w.subject].short}</button>)}</div>}
    <div className="progress-art"><div className={`competency-mosaic mosaic-${subject}`} role="group" aria-label={`${world.title}: ${count} von ${world.segments.length} Teilen sichtbar`}>{world.segments.map(segment=>{const visible=segmentVisible(data,segment);return <div key={segment.id} className={`mosaic-piece ${visible?'revealed':''}`} role="img" aria-label={`${segment.title}: ${visible?'dauerhaft sichtbar':'kommt beim Üben dazu'}`}>{visible?<Check aria-hidden="true" size={30}/>:<LockKeyhole aria-hidden="true" size={18}/>}</div>;})}</div></div>
  </section>;
}
