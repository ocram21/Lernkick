import math from './math.json';
import german from './german.json';
import { contentSchema } from '../lib/schema';
export const questions = [contentSchema.parse(math), contentSchema.parse(german)].flatMap(c => c.questions);
if (new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('Doppelte Fragen-ID');
