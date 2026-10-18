import geography from './germany.json';
export const states=geography.states;
export const mapSource=geography.source;
export type CountryRound='states'|'capitals';
export function labelFor(id:string,round:CountryRound){const state=states.find(state=>state.id===id);return state?(round==='states'?state.name:state.capital):'';}
export function placeRegion(placed:string[],target:string,region:string){return target===region&&!placed.includes(region)?[...placed,region]:placed;}
