import {z} from 'zod';
import {codeRoundSchema} from './codebreaker';
export const solvedBoard=()=>Array.from({length:16},(_,i)=>(i+1)%16);
export const puzzleBoardSchema=z.array(z.number().int().min(0).max(15)).length(16).refine(board=>new Set(board).size===16);
export const puzzleSchema=z.object({level:z.union([z.literal(1),z.literal(2)]),boards:z.record(z.string(),puzzleBoardSchema.refine(puzzleSolvable,'Das Puzzle muss lösbar sein')),game:z.enum(['numbers','picture','codebreaker']).optional(),rounds:z.record(z.string(),z.object({id:z.string().min(1)})).default({}),code:codeRoundSchema.nullable().default(null)});
export const emptyPuzzle=()=>({level:1 as const,boards:{},rounds:{},code:null});
export function adjacent(a:number,b:number){return Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&a<16&&b>=0&&b<16&&Math.abs(Math.floor(a/4)-Math.floor(b/4))+Math.abs(a%4-b%4)===1;}
export function movePuzzle(board:readonly number[],position:number){const empty=board.indexOf(0);if(!adjacent(empty,position))return board;const next=[...board];[next[position],next[empty]]=[next[empty],next[position]];return next;}
export function puzzleSolved(board:readonly number[]){return board.length===16&&board.every((n,i)=>n===(i+1)%16);}
export function puzzleSolvable(board:readonly number[]){if(!puzzleBoardSchema.safeParse(board).success)return false;let inversions=0;for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)if(board[i]&&board[j]&&board[i]>board[j])inversions++;return (inversions+4-Math.floor(board.indexOf(0)/4))%2===1;}
export function shuffledPuzzle(random:()=>number=Math.random){let board:readonly number[]=solvedBoard(),previous=-1;for(let i=0;i<160;i++){const empty=board.indexOf(0),choices=board.map((_,i)=>i).filter(i=>i!==previous&&adjacent(i,empty));const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw new Error('Ungültige Zufallsquelle');board=movePuzzle(board,choices[Math.floor(r*choices.length)]);previous=empty;}if(puzzleSolved(board))board=movePuzzle(board,14);return [...board];}
