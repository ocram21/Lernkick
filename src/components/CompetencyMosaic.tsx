import { useState } from 'react';
import { Check, LockKeyhole } from 'lucide-react';
import type { Subject, UserData } from '../lib/schema';
import { mosaicWorlds, segmentVisible } from '../learning/mosaics';
import { mathCompetencies } from '../learning/mathCompetencies';
import { confidence } from '../learning/mastery';
const labels:Record<Subject,string>={math:'Mathematik',german:'Deutsch',social:'Sozialkunde',biology:'Biologie',geography:'Geografie'};
const statuses={new:'Noch entdecken',practicing:'Du übst gerade',growing:'Fortschritt sichtbar',secure:'Über Zeit gefestigt'};
export function CompetencyMosaic({data}:{data:UserData}) {
  const [subject,setSubject]=useState<Subject>('math');const world=mosaicWorlds.find(w=>w.subject===subject)!;
  const count=world.segments.filter(s=>segmentVisible(data,s)).length;
  return <section className="mosaic-section" aria-labelledby="mosaic-heading"><h2 id="mosaic-heading">Dein Wimmelbild.</h2><p>Mit jedem Lernschritt wächst dein Bild. Was du freigelegt hast, bleibt dir erhalten.</p><div className="mosaic-subjects" role="group" aria-label="Fach für das Wimmelbild">{mosaicWorlds.map(w=><button key={w.id} aria-pressed={subject===w.subject} onClick={()=>setSubject(w.subject)}>{labels[w.subject]}</button>)}</div>
    <div className={`competency-mosaic mosaic-${subject}`} role="group" aria-label={`${world.title}: ${count} von ${world.segments.length} Teilen sichtbar`}>{world.segments.map(segment=>{const visible=segmentVisible(data,segment);return <div key={segment.id} className={`mosaic-piece ${visible?'revealed':''}`} role="img" aria-label={`${segment.title}: ${visible?'dauerhaft sichtbar':'kommt beim Üben dazu'}`}>{visible?<Check aria-hidden="true" size={30}/>:<LockKeyhole aria-hidden="true" size={18}/>}</div>;})}</div>
    <p className="mosaic-caption"><strong>{world.title}</strong> · {count} von {world.segments.length} Teilen sichtbar</p><p className="muted">Das ist ein erstes Mosaik als Platzhalter. Die Bildmotive kommen später.</p>
    {subject!=='math'&&<p>Hier wächst das Bild durch geübte Fragen. Den neuen Lernpfad gibt es zuerst in Mathematik.</p>}
    {subject==='math'&&<details className="competency-details"><summary>Meine Mathe-Schritte ansehen</summary><p>Dein Können kann sich verändern. Das Bild bleibt erhalten, auch wenn du etwas erneut übst.</p><ul>{mathCompetencies.map(skill=>{const state=data.learning.competencies[skill.id];const baseline=state?.baseline.attempts??0;return <li key={skill.id}><strong>{skill.title}</strong><span>{statuses[confidence(state)]}{baseline>0?` · ${baseline} frühere Antworten`:''}</span></li>;})}</ul></details>}
  </section>;
}
