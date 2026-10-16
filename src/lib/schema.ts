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
export const cardSchema = z.object({ id: z.string().min(1).max(100), front: z.string().trim().min(1).max(500), back: z.string().trim().min(1).max(1000), subject: subjectSchema });
export type Card = z.infer<typeof cardSchema>;
export const dataSchema = z.object({ version: z.literal(1), progress: z.record(z.string(), progressSchema), scores: z.record(subjectSchema, z.number().int().nonnegative()), cards: z.array(cardSchema).max(2000), settings: z.object({ reducedMotion: z.boolean() }) }).refine(d => new Set(d.cards.map(c => c.id)).size === d.cards.length, 'Karten-IDs müssen eindeutig sein');
export type UserData = z.infer<typeof dataSchema>;
export const emptyData = (): UserData => ({ version: 1, progress: {}, scores: { math: 0, german: 0, social: 0, biology: 0, geography: 0 }, cards: [], settings: { reducedMotion: false } });
