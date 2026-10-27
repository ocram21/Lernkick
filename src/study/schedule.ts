import {learningDay} from '../learning/journey';
import type {Card,UserData} from '../lib/schema';
export const cardIntervals=[0,1,2,3,5,7] as const;
const dayMs=86_400_000;
const berlinClock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
// Convert a calendar-day ordinal to Berlin midnight, including offset changes.
export function cardDayStart(day:number){let stamp=day*dayMs;for(let i=0;i<3;i++){const parts=berlinClock.formatToParts(stamp),part=(key:string)=>Number(parts.find(p=>p.type===key)!.value);const local=Date.UTC(part('year'),part('month')-1,part('day'),part('hour'),part('minute'),part('second'));stamp=day*dayMs-(local-stamp);}return stamp;}
type Review=UserData['study']['reviews'][string];
export function cardDue(review:Review|undefined,now:number){if(!review)return true;return review.box===0?review.due<=now:learningDay(review.due)<=learningDay(now);}
export function cardSchedule(data:UserData,cards:Card[],now=Date.now()){
 const today=learningDay(now),reviews=cards.map(c=>data.study.reviews[c.id]);
 const due=reviews.filter(r=>cardDue(r,now)).length;
 const completedToday=reviews.some(r=>r&&r.attempts>0&&learningDay(r.lastRated)===today);
 const effective=(r:Review)=>r.box===0?r.due:cardDayStart(learningDay(r.due));
 const future=reviews.filter((r):r is Review=>Boolean(r)&&!cardDue(r,now));
 const next=future.length?Math.min(...future.map(effective)):null;
 const nextCount=next===null?0:future.filter(r=>effective(r)===next).length;
 return {due,completedToday,next,nextCount};
}
export function nextCardDate(due:number,now:number){const date=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric'}).format(due);return learningDay(due)===learningDay(now)?`${date} um ${new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'}).format(due)} Uhr`:date;}

// Old reviews already contain total attempts and successes; no new mastery model is needed.
export function compareCardDifficulty(a:Review,b:Review){const missesA=a.attempts-a.known,missesB=b.attempts-b.known;return missesB/Math.max(1,b.attempts)-missesA/Math.max(1,a.attempts)||missesB-missesA;}
