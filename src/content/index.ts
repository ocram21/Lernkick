import math from './math.json';
import german from './german.json';
import social from './social.json';
import biology from './biology.json';
import geography from './geography.json';
import { contentSchema } from '../lib/schema';
export const contentPacks = [math, german, social, biology, geography].map(pack => contentSchema.parse(pack));
export const questions = contentPacks.flatMap(pack => pack.questions);
if (new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('Doppelte Fragen-ID');
