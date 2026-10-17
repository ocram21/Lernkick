import { openDB } from 'idb';
import { dataSchema, emptyData, type UserData } from './schema';
import { migrateData } from '../learning/migration';
const db = () => openDB('lernkick', 1, { upgrade(database) { database.createObjectStore('user'); } });
export async function loadData(): Promise<UserData> { const database=await db(); const value=await database.get('user','data'); if(value===undefined)return emptyData(); const migrated=migrateData(value); if(value.version===1)await database.put('user',migrated,'data'); return migrated; }
export async function saveData(data: UserData) { await (await db()).put('user', dataSchema.parse(data), 'data'); }
export function readBackup(text: string): UserData { if (text.length > 5_000_000) throw new Error('Die Datei ist zu groß (maximal 5 MB).'); return migrateData(JSON.parse(text)); }
