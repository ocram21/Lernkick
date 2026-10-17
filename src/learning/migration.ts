import { dataSchema, previousDataSchema, legacyDataSchema, emptyLearning, emptyStudy, type UserData } from '../lib/schema';
import { questions } from '../content';
import { skillFor } from './tasks';
import { emptyCompetency } from './mastery';
export function migrateData(value: unknown): UserData {
  if(typeof value==='object'&&value!==null&&'version' in value){
    if(value.version===3)return dataSchema.parse(value);
    if(value.version===2)return dataSchema.parse({...previousDataSchema.parse(value),version:3,study:emptyStudy()});
  }
  const legacy=legacyDataSchema.parse(value);const learning=emptyLearning();
  for(const question of questions) {
    const progress=legacy.progress[question.id],skillId=skillFor(question);if(!progress||!skillId)continue;
    const skill=learning.competencies[skillId]??emptyCompetency();
    skill.baseline.attempts+=progress.attempts;skill.baseline.correct+=progress.correct;
    learning.competencies[skillId]=skill;
  }
  return dataSchema.parse({...legacy,version:3,learning,study:emptyStudy()});
}

/** Restoring an older backup replaces learning data, but never takes earned picture pieces away. */
export function prepareImport(current:UserData,incoming:UserData):UserData {
  return {...incoming,learning:{...incoming.learning,unlocks:{...current.learning.unlocks,...incoming.learning.unlocks}}};
}
