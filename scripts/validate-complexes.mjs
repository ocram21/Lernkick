import {readFileSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const catalog=read('src/content/complexes/catalog.json'),cards=read('src/content/complexCards.json'),ids=new Set(),prompts=new Set();let total=0;
for(const c of catalog){const rows=read(`src/content/complexes/${c.id}.json`),levels=[1,2,3].map(n=>rows.filter(q=>q.difficulty===n).length);if(rows.length<50||rows.length>100||levels.some(n=>n<10))throw Error('Unvollständiger Pool '+c.id);
 for(const q of rows){if(ids.has(q.id)||prompts.has(q.prompt.trim().toLocaleLowerCase('de')))throw Error('Doppelte Frage '+q.id);ids.add(q.id);prompts.add(q.prompt.trim().toLocaleLowerCase('de'));if(q.subject!==c.subject||q.complexId!==c.id||q.topic!==c.id||!q.prompt||!q.explanation||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.options.length||q.options.length<2||q.options.length>4||new Set(q.options).size!==q.options.length||q.options.some(o=>!o.trim()))throw Error('Ungültige Frage '+q.id);}
 const count=cards.filter(card=>card.subject===c.subject&&card.rubric===c.id).length;if(count<1)throw Error('Keine Lernkarten '+c.id);total+=rows.length;console.log(`${c.subject} | ${c.title} | ${rows.length} Fragen (${levels.join('/')} leicht/mittel/schwer) | ${count} neue Karten`);
}
if(catalog.length!==14||new Set(catalog.map(c=>c.id)).size!==14||new Set(cards.map(c=>c.id)).size!==cards.length)throw Error('Ungültiger Katalog');
console.log(`Gesamt: ${total} Fragen, ${cards.length} neue Lernkarten. Strukturprüfung bestanden. Fachpädagogische Freigabe bleibt separat.`);
