import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import palette from '../src/design/palette.json';

describe('Verbindliche Palette aus der Nutzervorlage',()=>{
 it('verwendet in der App nur die freigegebenen Grundfarben und daraus abgeleitete Licht-/Schattenwerte',()=>{
  // Explicit request on 20 October: completed capital fields are white.
  const approved=new Set(['#fff','#237647',...Object.values(palette.colors).map(color=>color.toLowerCase())]);
  for(const path of ['src/style.css','src/design/palette.css','public/icon.svg']){
   const text=readFileSync(new URL('../'+path,import.meta.url),'utf8');
   for(const match of text.matchAll(/#[0-9a-fA-F]{3,8}\b/g))expect(approved.has(match[0].toLowerCase()),`${path}: ${match[0]}`).toBe(true);
  }
 });
 it('hält die Palette vollständig als zentrale CSS-Variablen verfügbar',()=>{
  const css=readFileSync(new URL('../src/design/palette.css',import.meta.url),'utf8');
  for(const [name,value] of Object.entries(palette.colors))expect(css).toContain(`--calc-${name}:${value}`);
 });
});
