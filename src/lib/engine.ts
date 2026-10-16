import type { Question, UserData } from './schema';
export function shuffle<T>(items: T[], random = Math.random): T[] { const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
export function nextQuestion(questions: Question[], data: UserData, used: string[], now = Date.now()): Question | undefined {
  const pool = shuffle(questions.filter(q => !used.includes(q.id)));
  const all = questions.map(q => data.progress[q.id]).filter(Boolean);
  const attempts = all.reduce((n, p) => n + p.attempts, 0);
  const success = all.reduce((n, p) => n + p.correct, 0);
  const target = attempts < 5 ? 1 : success / attempts > .8 ? 3 : success / attempts > .5 ? 2 : 1;
  return pool.sort((a,b) => {
    const weight = (q: Question) => { const p = data.progress[q.id]; return p && p.due <= now ? -10 + p.box : Math.abs(q.difficulty - target); };
    return weight(a) - weight(b);
  })[0];
}
const intervals = [0, 1, 3, 7, 14, 30];
export function recordAnswer(data: UserData, question: Question, correct: boolean, now = Date.now()): { data: UserData; points: number } {
  const old = data.progress[question.id] || { box: 0, due: 0, attempts: 0, correct: 0, lastAward: 0 };
  const box = correct ? Math.min(5, old.box + 1) : 0;
  const points = correct && (old.lastAward === 0 || now - old.lastAward >= 86_400_000) ? question.difficulty * 10 : 0;
  return { points, data: { ...data, progress: { ...data.progress, [question.id]: { box, due: now + (correct ? intervals[box] * 86_400_000 : 600_000), attempts: old.attempts + 1, correct: old.correct + Number(correct), lastAward: points ? now : old.lastAward } } } };
}
