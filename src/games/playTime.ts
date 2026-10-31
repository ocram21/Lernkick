import {z} from 'zod';
export const playTimeSchema=z.object({startedAt:z.number().nonnegative(),finishedAt:z.number().nonnegative().optional()});
export type PlayTime=z.infer<typeof playTimeSchema>;
/** Wall-clock duration from the first accepted action; no intervals or learning-time credit. */
export function advancePlayTime(time:PlayTime|undefined,won:boolean,now=Date.now()):PlayTime{const startedAt=time?.startedAt??now;return time?.finishedAt!==undefined?time:{startedAt,...(won?{finishedAt:Math.max(startedAt,now)}:{})};}
export function formatPlayTime(time:PlayTime|undefined){if(time?.finishedAt===undefined)return null;const seconds=Math.floor(Math.max(0,time.finishedAt-time.startedAt)/1000);return `Spielzeit: ${Math.floor(seconds/60)} Min. ${seconds%60} Sek.`;}
