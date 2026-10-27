import type {Card,UserData} from '../lib/schema';
export const cardDay=86_400_000;
// Stages 0/1 both use a short wait; stage 5 is the final 30-day checkpoint.
export const cardIntervals=[600_000,600_000,cardDay,3*cardDay,7*cardDay,30*cardDay] as const;
type Review=UserData['study']['reviews'][string];
export function cardMastered(review:Review|undefined){return Boolean(review?.masteredAt!==undefined&&review.box===5&&review.stageFiveAt!==undefined&&review.masteredAt>=review.stageFiveAt+30*cardDay);}
export function cardDeadline(review:Review){return review.box===5?Math.max(review.due,(review.stageFiveAt??review.lastRated)+30*cardDay):review.due;}
export function cardDue(review:Review|undefined,now:number){return !review||!cardMastered(review)&&cardDeadline(review)<=now;}
export function cardSchedule(data:UserData,cards:Card[],now=Date.now()){
 const reviews=cards.map(c=>data.study.reviews[c.id]),mastered=reviews.filter(cardMastered).length;
 return {due:reviews.filter(r=>cardDue(r,now)).length,mastered,total:cards.length,complete:cards.length>0&&mastered===cards.length};
}
export function compareCardDifficulty(a:Review,b:Review){const missesA=a.attempts-a.known,missesB=b.attempts-b.known;return missesB/Math.max(1,b.attempts)-missesA/Math.max(1,a.attempts)||missesB-missesA;}
