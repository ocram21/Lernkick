import {journeySchema} from '../learning/journey';
import {activitiesSchema,emptyActivities} from '../activities/schema';
import { z } from 'zod';
export const subjectSchema = z.enum(['math', 'german', 'social', 'biology', 'geography']);
export type Subject = z.infer<typeof subjectSchema>;
export const questionSchema = z.object({ id: z.string().min(1), subject: subjectSchema, topic: z.string().min(1), competency: z.string().min(1), difficulty: z.number().int().min(1).max(3), prompt: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(4), correct: z.number().int().min(0), explanation: z.string().min(1), curriculum: z.object({ sourceId: z.string().min(1), section: z.string().min(1), stage: z.enum(['foundation', 'grade9', 'extension']) }).optional() }).refine(q => q.correct < q.options.length && new Set(q.options).size === q.options.length, 'Antworten müssen eindeutig und die Lösung gültig sein');
export type Question = z.infer<typeof questionSchema>;
const sourceSchema = z.object({ id: z.string().min(1), title: z.string().min(1), url: z.url(), documentDate: z.iso.date(), accessedAt: z.iso.date() });
export const contentSchema = z.discriminatedUnion('version', [
  z.object({ version: z.literal(1), status: z.literal('demo'), questions: z.array(questionSchema) }),
  z.object({ version: z.literal(2), status: z.literal('practice'), revision: z.string().min(1), reviewStatus: z.literal('teacher-review-pending'), sources: z.array(sourceSchema).min(1), questions: z.array(questionSchema) })
]).superRefine((content, context) => {
  if (content.version !== 2) return;
  const sourceIds = new Set(content.sources.map(source => source.id));
  if (sourceIds.size !== content.sources.length) context.addIssue({ code: 'custom', message: 'Doppelte Quellen-ID' });
  content.questions.forEach((question, index) => {
    if (!question.curriculum || !sourceIds.has(question.curriculum.sourceId)) context.addIssue({ code: 'custom', path: ['questions', index, 'curriculum'], message: 'Lehrplanquelle fehlt oder ist unbekannt' });
  });
});
export const progressSchema = z.object({ box: z.number().int().min(0).max(5), due: z.number().nonnegative(), attempts: z.number().int().nonnegative(), correct: z.number().int().nonnegative(), lastAward: z.number().nonnegative() }).refine(p => p.correct <= p.attempts, 'Mehr richtige Antworten als Versuche');
export const cardSchema = z.object({ id: z.string().min(1).max(100), front: z.string().trim().min(1).max(500), back: z.string().trim().min(1).max(1000), subject: subjectSchema, createdAt:z.number().nonnegative().optional() });
export type Card = z.infer<typeof cardSchema>;
const commonData = {
  progress: z.record(z.string(), progressSchema), scores: z.record(subjectSchema, z.number().int().nonnegative()),
  cards: z.array(cardSchema).max(2075), settings: z.object({ reducedMotion: z.boolean(), theme:z.enum(['soft-dark','soft-light','classic-dark','retro-tech']).optional() })
};
const uniqueCards = (d: {cards: Card[]}) => new Set(d.cards.map(c=>c.id)).size === d.cards.length;
export const legacyDataSchema = z.object({version:z.literal(1),...commonData}).refine(uniqueCards,'Karten-IDs müssen eindeutig sein');
const observationSchema = z.object({ taskId:z.string(), signature:z.string(), at:z.number().nonnegative(), correct:z.boolean(), help:z.number().int().min(0).max(3), level:z.number().int().min(1).max(3) });
export const competencyStateSchema = z.object({ baseline:z.object({attempts:z.number().int().nonnegative(),correct:z.number().int().nonnegative()}).refine(b=>b.correct<=b.attempts), observations:z.array(observationSchema).max(12), helpRequests:z.number().int().nonnegative().default(0), attempts:z.number().int().nonnegative(), correct:z.number().int().nonnegative(), due:z.number().nonnegative(), level:z.number().int().min(1).max(3) }).refine(s=>s.correct<=s.attempts);
export const preferenceSchema = z.object({pace:z.enum(['easier','fit','challenge']),explanation:z.enum(['plain','alternate'])});
export const learningSchema = z.object({
  competencies:z.record(z.string(),competencyStateSchema), preferences:z.record(z.string(),preferenceSchema),
  unlocks:z.record(z.string(),z.object({at:z.number().nonnegative(),subject:subjectSchema,skillId:z.string(),milestone:z.enum(['growing','secure','practice80'])})),
  recovery:z.record(z.string(),z.object({skillId:z.string(),originalLevel:z.number().int().min(1).max(3),supportLeft:z.number().int().min(0).max(2),failures:z.number().int().nonnegative(),returnTo:z.object({skillId:z.string(),originalLevel:z.number().int().min(1).max(3)}).optional()})),
  awards:z.record(z.string(),z.number().nonnegative()),
  evidence:z.record(z.string(),z.object({window:z.array(z.object({signature:z.string(),correct:z.boolean(),at:z.number().nonnegative()})).max(5),seen:z.record(z.string(),z.number().nonnegative())})).default({})
});
export const vocabularyEntrySchema=z.object({id:z.string().min(1).max(100).regex(/^vocabulary\./),word:z.string().trim().min(1).max(100),meaning:z.string().trim().min(1).max(500),distractors:z.array(z.string().trim().min(1).max(500)).min(2).max(3)}).refine(entry=>new Set([entry.meaning,...entry.distractors].map(s=>s.toLocaleLowerCase('de'))).size===entry.distractors.length+1,'Antwortmöglichkeiten müssen verschieden sein');
export type VocabularyEntry=z.infer<typeof vocabularyEntrySchema>;
export const cardReviewSchema=z.object({box:z.number().int().min(0).max(5),due:z.number().nonnegative(),attempts:z.number().int().nonnegative(),known:z.number().int().nonnegative(),lastRated:z.number().nonnegative()}).refine(p=>p.known<=p.attempts);
export const studySchema=z.object({hiddenDefaults:z.array(z.string()).max(5000),defaultEdits:z.record(z.string(),cardSchema),reviews:z.record(z.string(),cardReviewSchema),vocabulary:z.array(vocabularyEntrySchema).max(1000),hiddenVocabulary:z.array(z.string()).max(5000),vocabularyEdits:z.record(z.string(),vocabularyEntrySchema)}).superRefine((study,ctx)=>{
  for(const entries of [study.defaultEdits,study.vocabularyEdits])for(const [id,entry] of Object.entries(entries))if(id!==entry.id)ctx.addIssue({code:'custom',message:'Bearbeitungs-ID stimmt nicht überein'});
  if(new Set(study.vocabulary.map(entry=>entry.id)).size!==study.vocabulary.length)ctx.addIssue({code:'custom',message:'Wortschatz-IDs müssen eindeutig sein'});
});
export const previousDataSchema=z.object({version:z.literal(2),...commonData,learning:learningSchema}).refine(uniqueCards,'Karten-IDs müssen eindeutig sein');
export const dataSchema=z.object({version:z.literal(3),journey:journeySchema.optional(),...commonData,learning:learningSchema,study:studySchema,activities:activitiesSchema.default(emptyActivities),reference:z.object({favorites:z.array(z.string().min(1)).max(200)}).default({favorites:[]})}).refine(uniqueCards,'Karten-IDs müssen eindeutig sein');
export type UserData = z.infer<typeof dataSchema>;
export type CompetencyState = z.infer<typeof competencyStateSchema>;
export type Observation = z.infer<typeof observationSchema>;
export const emptyLearning = (): UserData['learning'] => ({competencies:{},preferences:{},unlocks:{},recovery:{},awards:{},evidence:{}});
export const emptyStudy = (): UserData['study'] => ({hiddenDefaults:[],defaultEdits:{},reviews:{},vocabulary:[],hiddenVocabulary:[],vocabularyEdits:{}});
export const emptyData = (): UserData => ({version:3,progress:{},scores:{math:0,german:0,social:0,biology:0,geography:0},cards:[],settings:{reducedMotion:false,theme:'retro-tech'},learning:emptyLearning(),study:emptyStudy(),reference:{favorites:[]},activities:{...emptyActivities(),migrated:true}});
