/** Selection order does not change the learning task pool. */
export function sameSelection(a:readonly string[]|undefined,b:readonly string[]){return Boolean(a&&a.length===b.length&&a.every(id=>b.includes(id)));}
export function cardSelectionKey(subject:string,topics:readonly string[]){return JSON.stringify([subject,[...topics].sort()]);}
export function vocabularySelectionKey(config:{enabled:{german:boolean;everyday:boolean;work:boolean;sentences:boolean;grammar:boolean;spelling:boolean;proverbs:boolean}}){const e=config.enabled;return JSON.stringify([e.german,e.everyday||e.work,e.sentences,e.grammar,e.spelling,e.proverbs]);}
