import{describe,expect,it}from'vitest';
import{dataSchema,emptyData}from'../src/lib/schema';
import{states,labelFor,placeRegion}from'../src/maps/quiz';
describe('Archivierte Favoriten in vorhandenen Sicherungen',()=>{
 it('liest ältere v3-Daten ohne Favoriten und bewahrt bestehende Lernstände',()=>{const old=emptyData();old.scores.math=70;old.cards=[{id:'own',front:'Frage',back:'Antwort',subject:'math'}];const {reference:_,...legacy}=old;const parsed=dataSchema.parse(legacy);expect(parsed.reference.favorites).toEqual([]);expect(parsed.scores).toEqual(old.scores);expect(parsed.cards).toEqual(old.cards.map(card=>({rubric:'general',...card})));parsed.reference.favorites=['biology-digestion','math-plane'];expect(dataSchema.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed);});
});
describe('Deutschlandkarte',()=>{
 it('enthält 16 echte Landesumrisse und korrekte Hauptstädte',()=>{expect(states).toHaveLength(16);expect(new Set(states.map(s=>s.id)).size).toBe(16);for(const s of states){expect(s.path.length).toBeGreaterThan(150);expect(s.bounds[2]).toBeGreaterThan(s.bounds[0]);}expect(labelFor('15','capitals')).toBe('Magdeburg');expect(labelFor('13','capitals')).toBe('Schwerin');expect(labelFor('05','capitals')).toBe('Düsseldorf');});
 it('erlaubt beliebig viele Fehlversuche und genau eine Platzierung pro Land in beiden Runden',()=>{for(const round of ['states','capitals']as const){let placed:string[]=[];for(const s of states){for(let i=0;i<30;i++)expect(placeRegion(placed,s.id,s.id==='01'?'02':'01')).toBe(placed);placed=placeRegion(placed,s.id,s.id);expect(placed).toContain(s.id);expect(placeRegion(placed,s.id,s.id)).toBe(placed);expect(labelFor(s.id,round)).not.toBe('');}expect(placed).toHaveLength(16);}});
});
