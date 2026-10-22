import {questions} from '../content';
import {standardCards} from '../study/cards';
import {words,sentences} from '../activities/content';
import {grammarTasks} from '../activities/grammar';
import {proverbTasks} from '../activities/proverbs';
export const contentCounts={questions:questions.length,cards:standardCards.length,words:words.filter(w=>!w.archived).length,sentences:sentences.filter(s=>!s.archived).length,grammar:grammarTasks.filter(t=>!t.archived).length,proverbs:proverbTasks.length};
