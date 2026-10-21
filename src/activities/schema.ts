import {reviewEntrySchema} from '../lib/roundReview';
import {z}from'zod';
export const levelSchema=z.enum(['normal','hard']);
export const resultSchema=z.object({attempts:z.number().int().nonnegative(),correct:z.number().int().nonnegative(),lastCorrect:z.boolean(),at:z.number().nonnegative()}).refine(r=>r.correct<=r.attempts);
const results=z.record(z.string(),resultSchema);
const stateIds=z.array(z.string().regex(/^(0[1-9]|1[0-6])$/)).max(16).refine(ids=>new Set(ids).size===ids.length);
export const quizSessionSchema=z.object({runId:z.string().optional(),first:z.record(z.string(),z.boolean()).optional(),order:stateIds.refine(ids=>ids.length===16),round:z.enum(['states','capitals']),placed:stateIds});
const hangmanSession=z.object({termId:z.string(),guessed:z.array(z.string()).max(40),hinted:z.boolean(),revealed:z.boolean(),recorded:z.boolean()});
export const vocabularySessionSchema=z.object({runId:z.string().optional(),first:z.record(z.string(),z.boolean()).optional(),ids:z.array(z.string()).max(10),index:z.number().int().min(0).max(10),answer:z.number().int().min(0).max(3).nullable(),draft:z.array(z.number().int().nonnegative()).max(80),solved:z.boolean(),history:z.array(reviewEntrySchema).max(40).optional()});
export const adaptiveSchema=z.object({tier:z.number().int().min(0).max(2),successes:z.number().int().min(0).max(3),errors:z.number().int().min(0).max(1),lastTask:z.string().nullable()});
export const emptyAdaptive=()=>({tier:0,successes:0,errors:0,lastTask:null});
export const activitiesSchema=z.object({
 migrated:z.boolean().default(false),
 germany:z.object({session:quizSessionSchema.nullable(),states:results,capitals:results,completed:z.number().int().nonnegative()}),
 hangman:z.object({level:levelSchema,session:hangmanSession.nullable(),results:results}),
 vocabulary:z.object({adaptive:adaptiveSchema.default(emptyAdaptive),enabled:z.object({everyday:z.boolean(),work:z.boolean(),sentences:z.boolean(),grammar:z.boolean().default(false)}),level:levelSchema,session:vocabularySessionSchema.nullable(),words:results,sentences:results,grammar:results.default({}),recent:z.array(z.string()).max(60).default([])})
});
export type Activities=z.infer<typeof activitiesSchema>;
export type ActivityResult=z.infer<typeof resultSchema>;
export type Difficulty=z.infer<typeof levelSchema>;
export const emptyActivities=():Activities=>({migrated:false,germany:{session:null,states:{},capitals:{},completed:0},hangman:{level:'normal',session:null,results:{}},vocabulary:{adaptive:emptyAdaptive(),enabled:{everyday:true,work:false,sentences:false,grammar:false},level:'normal',session:null,words:{},sentences:{},grammar:{},recent:[]}});
export function addResult(previous:ActivityResult|undefined,correct:boolean,now=Date.now()):ActivityResult{return{attempts:(previous?.attempts??0)+1,correct:(previous?.correct??0)+Number(correct),lastCorrect:correct,at:now};}
