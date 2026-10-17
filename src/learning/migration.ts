import { dataSchema, legacyDataSchema, emptyLearning, type UserData } from '../lib/schema';
import { questions } from '../content';
import { skillFor } from './tasks';
import { emptyCompetency } from './mastery';
export function migrateData(value: unknown): UserData {
  if(typeof value==='object'&&value!==null&&'version' in value&&value.version===2)return dataSchema.parse(value);
  const legacy=legacyDataSchema.parse(value);const learning=emptyLearning();
  for(const question of questions) {
    const progress=legacy.progress[question.id],skillId=skillFor(question);if(!progress||!skillId)continue;
    const skill=learning.competencies[skillId]??emptyCompetency();
    skill.baseline.attempts+=progress.attempts;skill.baseline.correct+=progress.correct;
    learning.competencies[skillId]=skill;
  }
  return dataSchema.parse({...legacy,version:2,learning});
}

/** Restoring an older backup replaces learning data, but never takes earned picture pieces away. */
export function prepareImport(current:UserData,incoming:UserData):UserData {
  return {...incoming,learning:{...incoming.learning,unlocks:{...current.learning.unlocks,...incoming.learning.unlocks}}};
}
