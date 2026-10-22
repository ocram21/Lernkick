import type {Question,Subject} from '../lib/schema';
import type {Difficulty} from '../activities/schema';
export function subjectPool(questions:Question[],subject:Subject,level:Difficulty){return questions.filter(q=>q.subject===subject&&(subject==='math'||subject==='german'?(subject==='math'||q.id.startsWith('german.advanced.')===(level==='hard')):level==='hard'?q.difficulty===3:q.difficulty<3));}
