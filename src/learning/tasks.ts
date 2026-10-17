import assignments from './mathAssignments.json';
import { mathById } from './mathCompetencies';
import type { Question } from '../lib/schema';
import type { LearningTask } from './types';
export const mathAssignments: Record<string,{skillId:string;status:string;note:string}> = assignments;
export function skillFor(question: Question) { return question.subject==='math'?mathAssignments[question.id]?.skillId:`${question.subject}.${question.competency}`; }
export function asTask(question: Question): LearningTask {
  const skillId=skillFor(question)??'math.unassigned';const skill=mathById.get(skillId);
  const arithmetic=question.prompt.match(/^Wie viel ist (\d+) ([+−×÷]) (\d+)\?$/);
  const operation:Record<string,string>={'+':'add','−':'subtract','×':'multiply','÷':'divide'};
  const signature=arithmetic?`${operation[arithmetic[2]]}:${arithmetic[1]}:${arithmetic[3]}`:question.id;
  return {...question,skillId,signature,help:{hint:skill?.hint??'Lies die Frage noch einmal. Was wird gesucht? Schließe Antworten aus, die nicht zur Frage passen.',example:skill?.example??'Lies zuerst die Frage, suche dann einen passenden Beleg oder eine Regel und vergleiche damit die Antworten.',alternate:skill?.alternate??'Formuliere die Frage mit eigenen Worten. Prüfe jede Antwort einzeln. Die Lösungserklärung kann dir den Zusammenhang zeigen.'}};
}
