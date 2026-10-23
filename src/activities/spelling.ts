import tasks from '../content/spelling.json' with {type:'json'};
import {grammarTaskSchema} from './grammar';
export const spellingTasks=tasks.map(t=>grammarTaskSchema.parse(t));
export const spellingById=new Map(spellingTasks.map(t=>[t.id,t]));
