import { openDB } from 'idb';
import { dataSchema, emptyData, type UserData } from './schema';
const db = () => openDB('lernkick', 1, { upgrade(database) { database.createObjectStore('user'); } });
export async function loadData(): Promise<UserData> { const value = await (await db()).get('user', 'data'); return value === undefined ? emptyData() : dataSchema.parse(value); }
export async function saveData(data: UserData) { await (await db()).put('user', dataSchema.parse(data), 'data'); }
export function readBackup(text: string): UserData { if (text.length > 5_000_000) throw new Error('Die Datei ist zu groß (maximal 5 MB).'); return dataSchema.parse(JSON.parse(text)); }
