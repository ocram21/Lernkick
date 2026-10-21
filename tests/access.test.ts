import {describe,it,expect,vi,afterEach} from 'vitest';
import {dailyPin,hasPWAApproval,rememberPWAApproval,PWA_UNLOCK_KEY} from '../src/lib/access';
afterEach(()=>vi.unstubAllGlobals());
describe('Tagesberechnung und Anzeige-Modus',()=>{
 it('verwendet das Berliner Datum an Monatsgrenzen und bei Zeitumstellungen',()=>{
  for(const [instant,digits] of [['2026-10-19T22:30:00Z','20102026'],['2026-01-31T23:30:00Z','01022026'],['2026-12-31T23:30:00Z','01012027'],['2026-03-28T23:30:00Z','29032026'],['2026-10-24T22:30:00Z','25102026']]){
   const value=dailyPin(new Date(instant));expect(value===String(Math.floor(Math.sqrt(Number(digits)))).padStart(4,'0')).toBe(true);expect(/^\d{4}$/.test(value)).toBe(true);
  }
 });
 it('formatiert Monatsanfänge, Monatsenden und frühe Jahre zuverlässig',()=>{
  for(const instant of ['2026-01-01T12:00:00Z','2026-02-28T12:00:00Z','2028-02-29T12:00:00Z','2026-12-31T12:00:00Z','0001-01-01T12:00:00Z'])expect(/^\d{4}$/.test(dailyPin(new Date(instant)))).toBe(true);
 });
 it('ignoriert eine gemeinsame Freigabe im normalen Browser vollständig',()=>{
  const get=vi.fn(()=> 'granted'),set=vi.fn();vi.stubGlobal('window',{matchMedia:()=>({matches:false})});vi.stubGlobal('navigator',{});vi.stubGlobal('localStorage',{getItem:get,setItem:set});expect(hasPWAApproval()).toBe(false);rememberPWAApproval();expect(get).not.toHaveBeenCalled();expect(set).not.toHaveBeenCalled();
 });
 it('speichert nur die PWA-Freigabe und erkennt iOS standalone',()=>{
  const values=new Map<string,string>(),set=vi.fn((k,v)=>values.set(k,v));vi.stubGlobal('window',{matchMedia:()=>({matches:false})});vi.stubGlobal('navigator',{standalone:true});vi.stubGlobal('localStorage',{getItem:(key:string)=>values.get(key),setItem:set});expect(hasPWAApproval()).toBe(false);rememberPWAApproval();expect(set).toHaveBeenCalledWith(PWA_UNLOCK_KEY,'granted');expect(hasPWAApproval()).toBe(true);
 });
 it('behandelt nicht verfügbaren lokalen Speicher ohne Freigabe und ohne Datenlöschung',()=>{
  vi.stubGlobal('window',{matchMedia:()=>({matches:true})});vi.stubGlobal('navigator',{});vi.stubGlobal('localStorage',{getItem:()=>{throw new Error('unavailable');},setItem:()=>{throw new Error('unavailable');}});expect(hasPWAApproval()).toBe(false);expect(()=>rememberPWAApproval()).not.toThrow();
 });
});
