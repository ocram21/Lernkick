import {interruptBosses} from '../learning/statistics';
import {recoverNBack} from '../learning/nback';
import { openDB } from 'idb';
import { dataSchema, emptyData, type UserData } from './schema';
import { journeySchema, newJourney,upgradeStrength } from '../learning/journey';
import { migrateData } from '../learning/migration';
function snapshot(value: unknown): string | undefined { return JSON.stringify(value, (_key, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item); }
let expectedSnapshot: string | undefined;
let loaded = false;
const db = () => openDB('lernkick', 1, { upgrade(database) { database.createObjectStore('user'); } });
export async function loadData(): Promise<UserData> {
    const database = await db(), tx = database.transaction('user', 'readwrite'), value = await tx.store.get('data');
    if (value === undefined) {
        const next = { ...emptyData(), journey: newJourney(emptyData().scores) };
        await tx.store.put(next, 'data');
        await tx.store.put(next.journey, 'journey.current');
        await tx.done;
        expectedSnapshot = snapshot(next);
        loaded = true;
        return next;
    }
    if(value.version!==7&&await tx.store.get('backup.before-v7')===undefined)await tx.store.put(value,'backup.before-v7');
    const migrated = migrateData(value), sidecar = await tx.store.get('journey.current');
    const recovered = upgradeStrength(migrated.journey ?? (sidecar === undefined ? newJourney(migrated.scores) : journeySchema.parse(sidecar)));
    let savedNBack:unknown;try{savedNBack=JSON.parse(localStorage.getItem('lernkick.nback.round.v1')??'null');}catch{/* Keep the canonical progress if the old session is unavailable. */}
    const next = { ...migrated,nback:recoverNBack(migrated.nback,savedNBack), journey: { ...recovered, statistics:interruptBosses(recovered.statistics), totalPoints: Math.max(recovered.totalPoints, Object.values(migrated.scores).reduce((a, b) => a + b, 0)) } };
    dataSchema.parse(next);
    if (snapshot(value) !== snapshot(next)) {
        if (await tx.store.get('backup.before-journey') === undefined)
            await tx.store.put(value, 'backup.before-journey');
        await tx.store.put(next, 'data');
    }
    await tx.store.put(next.journey, 'journey.current');
    await tx.done;
    expectedSnapshot = snapshot(next);
    loaded = true;
    return next;
}
export async function saveData(data: UserData) {
    const next = dataSchema.parse(data), database = await db(), tx = database.transaction('user', 'readwrite'), current = await tx.store.get('data');
    if (loaded && snapshot(current) !== expectedSnapshot) {
        tx.abort();
        await tx.done.catch(() => { });
        throw new Error('Der Lernstand wurde in einem anderen Fenster geändert. Bitte sichere deine Daten und lade neu.');
    }
    await tx.store.put(next, 'data');
    if(next.journey) await tx.store.put(next.journey, 'journey.current');
    await tx.done;
    expectedSnapshot = snapshot(next);
    loaded = true;
}
export async function backupBeforeImport() { const database = await db(), tx = database.transaction('user', 'readwrite'); const value = await tx.store.get('data'); if (value !== undefined)
    await tx.store.put(value, `backup.import.${Date.now()}`); await tx.done; }
export function readBackup(text: string): UserData { if (text.length > 5000000)
    throw new Error('Die Datei ist zu groß (maximal 5 MB).'); return migrateData(JSON.parse(text)); }
