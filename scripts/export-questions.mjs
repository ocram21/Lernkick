import fs from 'node:fs';
const subjects = [['math','Mathematik'],['german','Deutsch'],['social','Sozialkunde'],['biology','Biologie'],['geography','Geografie']];
const lines = ['# LernKick – Fragenkatalog mit Lösungen', '', 'Stand: 17.10.2026 · 500 selbst erstellte Übungsfragen · 100 pro Fach.', '', 'Keine amtlichen Prüfungsfragen. Fachliche und pädagogische Freigabe durch Lehrkräfte steht aus. Anforderungen und Grenzen: [Recherche Sachsen-Anhalt](ANFORDERUNGEN-SACHSEN-ANHALT.md).', '', 'Die Antwortreihenfolge wird in der App zusätzlich gemischt. Die hier genannten Buchstaben beziehen sich nur auf diesen Katalog.', ''];
for (const [subject, name] of subjects) {
  const content = JSON.parse(fs.readFileSync(new URL(`../src/content/${subject}.json`, import.meta.url), 'utf8'));
  lines.push(`## ${name}`, '', ...content.sources.map(source => `Lehrplan: [${source.title}](${source.url}), Dokumentstand ${source.documentDate}, abgerufen ${source.accessedAt}.`), '');
  for (const q of content.questions) {
    lines.push(`### ${q.id} · ${q.prompt}`, '', `Thema: ${q.topic} · Schwierigkeit ${q.difficulty} · Lehrplan ${q.curriculum.section} · ${q.curriculum.stage}`, '', ...q.options.map((option, i) => `- **${String.fromCharCode(65+i)}:** ${option}${i === q.correct ? ' **(richtig)**' : ''}`), '', `**Erklärung:** ${q.explanation}`, '');
  }
}
fs.writeFileSync(new URL('../docs/FRAGENKATALOG.md', import.meta.url), lines.join('\n'));
console.log('Fragenkatalog mit 500 Aufgaben und Lösungen exportiert.');
