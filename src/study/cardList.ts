import type { Card } from '../lib/schema';
import { isStandardCard } from './cards';
export type CardOrder='newest'|'oldest'|'alphabetical';
export function findCards(cards:Card[],query:string,order:CardOrder):Card[]{
  const needle=query.trim().toLocaleLowerCase('de');
  return cards.map((card,index)=>({card,index})).filter(({card})=>!needle||`${card.front} ${card.back}`.toLocaleLowerCase('de').includes(needle)).sort((a,b)=>{
    if(order==='alphabetical')return a.card.front.localeCompare(b.card.front,'de')||a.index-b.index;
    const age=(card:Card)=>card.createdAt??(isStandardCard(card.id)?0:1);
    const difference=age(a.card)-age(b.card)||a.index-b.index;
    return order==='oldest'?difference:-difference;
  }).map(({card})=>card);
}
