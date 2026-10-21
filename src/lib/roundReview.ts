import {z} from 'zod';
export const reviewEntrySchema=z.object({id:z.string(),title:z.string(),prompt:z.string(),ownAnswer:z.string(),correctAnswer:z.string(),explanation:z.string(),correct:z.boolean()});
export type ReviewEntry=z.infer<typeof reviewEntrySchema>;
export const addReview=(history:ReviewEntry[],entry:ReviewEntry)=>[...history,entry].slice(-40);
