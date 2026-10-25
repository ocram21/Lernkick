import {z} from 'zod';
import type {UserData} from '../lib/schema';
import {puzzleSchema,puzzleSolved} from './slidingPuzzle';
const snapshotSchema=z.object({profileId:z.string().min(1),puzzle:puzzleSchema});
/** Older clients keep boards and score events, but do not know the new round/code fields. */
export function recoverArcade(data:UserData,value:unknown):UserData{
 const saved=snapshotSchema.safeParse(value);if(!saved.success||!data.journey||saved.data.profileId!==data.journey.profileId)return data;
 const old=saved.data.puzzle,rounds={...old.rounds};
 for(const level of [1,2])if(old.boards[level]&&data.puzzle.boards[level]&&puzzleSolved(old.boards[level])&&!puzzleSolved(data.puzzle.boards[level]))rounds[level]={id:crypto.randomUUID()};
 return {...data,puzzle:{...data.puzzle,rounds,code:old.code,game:old.game}};
}
