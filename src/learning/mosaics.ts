import type { Subject, UserData } from '../lib/schema';
import { progressTracks } from './progressRules';
export type MosaicSegment={id:string;title:string;milestones:string[]};
export type MosaicWorld={id:string;subject:Subject;title:string;description:string;segments:MosaicSegment[]};
const names:Record<Subject,string>={math:'Zahlenwerkstatt',german:'Wortatelier',social:'Treffpunkt',biology:'Lebensraum',geography:'Weltkarte'};
export const mosaicWorlds:MosaicWorld[]=Object.entries(progressTracks).map(([subject,tracks])=>({id:`placeholder.${subject}.v1`,subject:subject as Subject,title:names[subject as Subject],description:'Austauschbares Fortschrittsbild.',segments:tracks.map((track,index)=>({id:`piece-${index+1}`,title:`Bildteil ${index+1}`,milestones:[track.id,...track.legacy]}))}));
export const segmentVisible=(data:UserData,segment:MosaicSegment)=>segment.milestones.some(id=>Boolean(data.learning.unlocks[id]));
