import type {Question} from '../lib/schema';
// Interpret evidence from the previous catalog without rewriting its question IDs or progress.
export function legacyComplex(question:Question):string|undefined{
 const key=question.competency;
 if(question.subject==='biology'){
  if(/sinn|nerven|reflex|auge|reiz|lernen|sucht|bewegung|muskeln/.test(key))return 'bio-senses';
  if(/zell|mikro|systemebenen|fortpflanzung|entwicklung|abwehr|blut$/.test(key))return 'bio-cells';
  if(/verdau|atmung|kreislauf|ernaehr|organe|stoffwechsel/.test(key))return 'bio-metabolism';
  return 'bio-ecology';
 }
 if(question.subject==='geography'){
  if(/europa/.test(key))return 'geo-eu';
  if(/deutschland|strukturwandel|standort|verkehr|transit|energie|raumplanung|stadtplanung|mobilitaet|kueste/.test(key))return 'geo-germany';
  if(/klima|wetter|vegetation|plattentektonik|vulkane|landschaft|kontinente/.test(key))return 'geo-americas';
  return 'geo-disparities';
 }
 if(question.subject==='social'){
  if(/medien|presse|datenschutz|privatsphaere|werbung|statistik|daten-auswerten/.test(key))return 'soc-media';
  if(/wahlen|parteien|koalition|opposition|beteiligung/.test(key))return 'soc-elections';
  if(/konflikt|diskriminierung|vorurteil|zivilcourage|solidaritaet|vielfalt|gleichberechtigung|regeln|inklusion|streitkultur/.test(key))return 'soc-family';
  return 'soc-state';
 }
}
