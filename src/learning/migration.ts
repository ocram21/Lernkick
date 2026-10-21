import {mergeNBack} from './nback';
import { moduleIds,upgradeStrength } from './journey';
import { dataSchema, previousDataSchema, legacyDataSchema, emptyLearning, emptyStudy, type UserData } from '../lib/schema';
import { standardCards, standardVocabulary } from '../study/cards';
import { words } from '../activities/content';
import { questions } from '../content';
import { skillFor } from './tasks';
import { emptyCompetency } from './mastery';
export function migrateData(value: unknown): UserData {
    if (typeof value === 'object' && value !== null && 'version' in value) {
        if (value.version === 3||value.version===4)
            return migrateActivities(dataSchema.parse({...value,version:4}));
        if (value.version === 2)
            return migrateActivities(dataSchema.parse({ ...previousDataSchema.parse(value), version: 4, study: emptyStudy() }));
    }
    const legacy = legacyDataSchema.parse(value);
    const learning = emptyLearning();
    for (const question of questions) {
        const progress = legacy.progress[question.id], skillId = skillFor(question);
        if (!progress || !skillId)
            continue;
        const skill = learning.competencies[skillId] ?? emptyCompetency();
        skill.baseline.attempts += progress.attempts;
        skill.baseline.correct += progress.correct;
        learning.competencies[skillId] = skill;
    }
    return migrateActivities(dataSchema.parse({ ...legacy, version: 4, learning, study: emptyStudy() }));
}
/** Restoring an older backup replaces learning data, but never takes earned picture pieces away. */
export function prepareImport(current: UserData, incoming: UserData): UserData {
    // A confirmed import of another profile replaces it; never mix two learners.
    if (current.journey && incoming.journey && current.journey.profileId !== incoming.journey.profileId)
        return incoming;
    const journey = incoming.journey && current.journey ? { ...incoming.journey, profileId: current.journey.profileId,strengthModel:2 as const,strength:Math.max(current.journey.strength,incoming.journey.strength),activeLearningMs:Math.max(current.journey.activeLearningMs??0,incoming.journey.activeLearningMs??0), totalPoints: Math.max(current.journey.totalPoints, incoming.journey.totalPoints), modules: Object.fromEntries(moduleIds.map(id => { const a = current.journey!.modules[id], b = incoming.journey!.modules[id]; return [id, { ...(a.level > b.level || (a.level === b.level && a.progress > b.progress) ? a : b), completed: [...new Set([...a.completed, ...b.completed])], bossWins: [...new Set([...a.bossWins, ...b.bossWins])], bossAttempts: [...new Set([...a.bossAttempts, ...b.bossAttempts])] }]; })) as NonNullable<UserData['journey']>['modules'], events: { ...current.journey.events, ...incoming.journey.events }, tasks: { ...current.journey.tasks, ...incoming.journey.tasks } } : current.journey ? { ...current.journey, totalPoints: Math.max(current.journey.totalPoints, Object.values(incoming.scores).reduce((a, b) => a + b, 0)) } : incoming.journey;
    return { ...incoming, nback:mergeNBack(current.nback,incoming.nback), journey, learning: { ...incoming.learning, unlocks: { ...current.learning.unlocks, ...incoming.learning.unlocks } } };
}
/** One-time, lossless transition: edited defaults become personal copies. */
export function migrateActivities(data: UserData): UserData {
    if(data.journey)data={...data,journey:upgradeStrength(data.journey)};
    if (data.activities.migrated && !data.cards.some(card => standardCards.some(standard => standard.id === card.id)))
        return data;
    const cards = [...data.cards], reviews = { ...data.study.reviews };
    for (const card of standardCards) {
        const edited = data.activities.migrated ? undefined : data.study.defaultEdits[card.id], collision = cards.find(c => c.id === card.id);
        const copy = collision ?? edited;
        if (!copy)
            continue;
        let id = `recovered.${card.id}`, suffix = 2;
        while (cards.some(c => c.id === id && (c.front !== copy.front || c.back !== copy.back || c.subject !== copy.subject)))
            id = `recovered.${card.id}.${suffix++}`;
        if (!cards.some(c => c.id === id)) {
            cards.push({ ...copy, id });
            if (reviews[card.id])
                reviews[id] = { ...reviews[card.id] };
        }
        if (collision)
            cards.splice(cards.indexOf(collision), 1);
    }
    const results = { ...data.activities.vocabulary.words };
    for (const old of standardVocabulary) {
        const progress = data.progress[old.id], entry = words.find(w => w.word.toLocaleLowerCase('de') === old.word.toLocaleLowerCase('de'));
        if (entry && progress?.attempts && !results[entry.id])
            results[entry.id] = { attempts: progress.attempts, correct: progress.correct, lastCorrect: progress.correct === progress.attempts, at: progress.lastAward };
    }
    return dataSchema.parse({ ...data, cards, study: { ...data.study, reviews }, activities: { ...data.activities, migrated: true, vocabulary: { ...data.activities.vocabulary, words: results } } });
}
