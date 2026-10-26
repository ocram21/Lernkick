// Shared stable IDs for question rounds and the existing learning box.
import catalog from '../content/complexes/catalog.json' with {type:'json'};
export type ComplexSubject='biology'|'geography'|'social';
export const learningComplexes=catalog as readonly {subject:ComplexSubject;id:string;title:string}[];
export const isComplexSubject=(subject:string):subject is ComplexSubject=>['biology','geography','social'].includes(subject);
export const complexesFor=(subject:string)=>learningComplexes.filter(c=>c.subject===subject);
export function complexChoices(subject:string,selected?:readonly string[]):string[]{const ids=complexesFor(subject).map(c=>c.id);return selected===undefined?ids:ids.filter(id=>selected.includes(id));}
