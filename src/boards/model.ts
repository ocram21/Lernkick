import {z} from 'zod';
import catalog from './catalog.json';
export const boardSchema=z.object({id:z.string().min(1),title:z.string().min(1),subject:z.string().min(1),image:z.string().min(1),width:z.number().positive(),height:z.number().positive(),entries:z.array(z.object({number:z.number().int().positive(),term:z.string().trim().min(1)})).min(2),status:z.literal('draft'),approvedForTeaching:z.literal(false),hints:z.array(z.string()),instructions:z.string(),source:z.string(),sha256:z.string()}).superRefine((b,c)=>{
 if(b.entries.some((e,i)=>i>0&&e.number<=b.entries[i-1].number))c.addIssue({code:'custom',message:`${b.id}: Nummern sind nicht eindeutig aufsteigend.`});
});
export const boards=z.array(boardSchema).refine(list=>new Set(list.map(b=>b.id)).size===list.length,'Doppelte Tafel-ID').parse(catalog);
export type Board=typeof boards[number];
export function reorderTerms(order:number[],source:number,boundary:number){
 if(!Number.isInteger(source)||!Number.isInteger(boundary)||source<0||source>=order.length||boundary<0||boundary>order.length)return order;
 const next=[...order],item=next.splice(source,1)[0];next.splice(boundary-(source<boundary?1:0),0,item);return next;
}
export function shuffledTerms(length:number,random=Math.random){const order=Array.from({length},(_,i)=>i);for(let i=length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}if(order.every((n,i)=>n===i))order.push(order.shift()!);return order;}
export function checkBoard(board:Board,order:number[]){return board.entries.map((_,i)=>order[i]===i);}
export function validOrder(board:Board,order:number[]){return order.length===board.entries.length&&new Set(order).size===order.length&&order.every(i=>Number.isInteger(i)&&i>=0&&i<order.length);}
