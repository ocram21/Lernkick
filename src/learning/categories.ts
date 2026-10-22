export const mathCategories=[{id:'mixed',label:'Gemischt'},{id:'arithmetic',label:'Grundrechenarten'},{id:'times',label:'Kleines Einmaleins'},{id:'equation',label:'Gleichungen'},{id:'negative',label:'Negative Zahlen'},{id:'fraction',label:'Brüche'},{id:'percent',label:'Prozentrechnung'},{id:'estimate',label:'Überschlag'},{id:'ratio',label:'Dreisatz'},{id:'geometry',label:'Geometrie'},{id:'units',label:'Einheiten umrechnen'}];
export function inMathCategory(skill:string,category='mixed') {
 if(category==='ratio')return skill==='math.ratio.proportion';
 if(category==='geometry')return skill.startsWith('math.geometry.');
 if(category==='units')return skill==='math.measure.convert';
 if(category==='times')return skill==='math.multiply.facts';
 if(category==='equation')return skill==='math.equation.linear';
 const group=/^math\.(add|subtract|multiply|divide)\./.test(skill)?'arithmetic':skill==='math.number.negative'?'negative':skill.includes('fraction')?'fraction':skill.includes('percent')?'percent':skill==='math.number.place'?'estimate':'other';
 return category==='mixed'||category===group;
}
