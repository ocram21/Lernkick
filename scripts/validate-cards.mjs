import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,watch:null,hmr:false,ws:false},appType:'custom'});
try{
 const {standardCards}=await server.ssrLoadModule('/src/study/cards.ts'),{topicsFor,rubricNames,subjectNames}=await server.ssrLoadModule('/src/study/topics.ts');
 const normalize=s=>s.toLocaleLowerCase('de').normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim(),ids=new Set(),fronts=new Set(),similar=[];
 for(const c of standardCards){if(ids.has(c.id)||fronts.has(normalize(c.front)))throw Error('Doppelte ID/Frage: '+c.id);ids.add(c.id);fronts.add(normalize(c.front));if(!topicsFor(c.subject).includes(c.rubric)||!c.back.trim()||!(/[?？]/u.test(c.front)||/^(Erkläre|Beschreibe|Ordne|Verfolge|Vergleiche|Begründe|Nenne)\b/u.test(c.front)))throw Error('Keine aktive, richtig zugeordnete Karte: '+c.id);}
 for(const subject of Object.keys(subjectNames))for(const rubric of topicsFor(subject)){const rows=standardCards.filter(c=>c.subject===subject&&c.rubric===rubric);if(rows.length<30||rows.length>80)throw Error('Umfang außerhalb 30–80: '+rubric);console.log(`${subjectNames[subject]} | ${rubricNames[rubric]} | ${rows.length}`);for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const a=new Set(normalize(rows[i].front).split(' ')),b=new Set(normalize(rows[j].front).split(' ')),score=[...a].filter(w=>b.has(w)).length/new Set([...a,...b]).size;if(score>=.65)similar.push({a:rows[i].id,b:rows[j].id,score:Number(score.toFixed(2))});}}
 console.log(`${standardCards.length} Karten, 25 Unterrubriken; Struktur, aktive Aufgaben und exakte Dubletten geprüft.`);console.log('Ähnlichkeitshinweise ab Wortmengen-Jaccard 0,65 (fachlich einzeln prüfen): '+JSON.stringify(similar));
}finally{await server.close();}
