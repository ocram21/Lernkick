import metabolism from './bio-metabolism.json' with {type:'json'};
import senses from './bio-senses.json' with {type:'json'};
import cells from './bio-cells.json' with {type:'json'};
import ecology from './bio-ecology.json' with {type:'json'};
import disparities from './geo-disparities.json' with {type:'json'};
import americas from './geo-americas.json' with {type:'json'};
import usa from './geo-usa.json' with {type:'json'};
import eu from './geo-eu.json' with {type:'json'};
import germany from './geo-germany.json' with {type:'json'};
import family from './soc-family.json' with {type:'json'};
import leisure from './soc-leisure.json' with {type:'json'};
import media from './soc-media.json' with {type:'json'};
import state from './soc-state.json' with {type:'json'};
import elections from './soc-elections.json' with {type:'json'};
import {questionSchema} from '../../lib/schema';
import {learningComplexes} from '../../learning/complexes';
export const complexQuestions=[metabolism,senses,cells,ecology,disparities,americas,usa,eu,germany,family,leisure,media,state,elections].flat().map(q=>questionSchema.parse(q));
const ids=new Set<string>(),prompts=new Set<string>();
for(const q of complexQuestions){if(ids.has(q.id)||prompts.has(q.prompt))throw new Error('Doppelte Lernkomplex-Frage: '+q.id);ids.add(q.id);prompts.add(q.prompt);if(!learningComplexes.some(c=>c.id===q.complexId&&c.subject===q.subject))throw new Error('Falsche Lernkomplex-Zuordnung: '+q.id);}
for(const c of learningComplexes){const size=complexQuestions.filter(q=>q.complexId===c.id).length;if(size<50||size>100)throw new Error('Unvollständiger Fragenpool: '+c.id);}
