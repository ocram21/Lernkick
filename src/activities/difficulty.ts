import type {UserData} from '../lib/schema';
import {practiceQueue,wordById,sentenceById} from './content';
import {grammarById} from './grammar';
import {shuffle} from '../lib/engine';
import {proverbById} from './proverbs';
import {gameTerms} from '../games/engine';
export function prepareVocabularyMode(data:UserData):UserData{
 const level=data.settings.difficulty,config=data.activities.vocabulary,session=config.session;
 if(!session||session.index>=session.ids.length)return config.level===level?data:{...data,activities:{...data.activities,vocabulary:{...config,level}}};
 if((session.globalDifficulty??config.level)===level&&config.level===level)return data;
 const id=session.ids[session.index],graded=session.answer!==null||session.first?.[id]!==undefined||Boolean(session.history?.some(item=>item.id===id));
 const keep=session.ids.slice(0,session.index+Number(graded)),exclude=[...new Set([...keep,...Object.keys(session.first??{})])],pool=practiceQueue({...config,level,enabled:{everyday:session.ids.some(id=>wordById.has(id)),work:false,sentences:session.ids.some(id=>sentenceById.has(id)),grammar:session.ids.some(id=>grammarById.has(id)),proverbs:session.ids.some(id=>proverbById.has(id))}},exclude),ids=[...keep,...pool.slice(0,session.ids.length-keep.length)];
 const orders={...session.optionOrders};for(const next of ids)if(proverbById.has(next)&&!orders[next])orders[next]=shuffle([0,1,2]);
 return {...data,activities:{...data.activities,vocabulary:{...config,level,session:{...session,globalDifficulty:level,ids,optionOrders:orders,...(!graded?{answer:null,solved:false,draft:[]}:{} )}}}};
}
export function prepareHangmanMode(data:UserData):UserData{
 const level=data.settings.difficulty,config=data.activities.hangman;if(config.level===level)return data;
 const session=config.session&&!config.session.recorded?{termId:shuffle(gameTerms(data,level))[0].id,guessed:[],hinted:false,revealed:false,recorded:false}:config.session;
 return {...data,activities:{...data.activities,hangman:{...config,level,session}}};
}
