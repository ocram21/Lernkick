import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import palette from '../src/design/palette.json';

function rgb(hex:string){return hex.slice(1).match(/../g)!.map(value=>parseInt(value,16));}
function linear(channel:number){const value=channel/255;return value<=.04045?value/12.92:((value+.055)/1.055)**2.4;}
function luminance(hex:string){return rgb(hex).map(linear).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);}
function contrast(a:string,b:string){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function oklchLightness(hex:string){
 const [r,g,b]=rgb(hex).map(linear);
 let l=.4122214708*r+.5363325363*g+.0514459929*b;
 let m=.2119034982*r+.6806995451*g+.1073969566*b;
 let s=.0883024619*r+.2817188376*g+.6299787005*b;
 l=Math.cbrt(l);m=Math.cbrt(m);s=Math.cbrt(s);
 return .2104542553*l+.793617785*m-.0040720468*s;
}

describe('Verbindliche Palette aus der Nutzervorlage',()=>{
 it('verwendet in der App nur die freigegebenen Grundfarben und daraus abgeleitete Licht-/Schattenwerte',()=>{
  // Explicit requests: white capital fields (20 October), black star on gray Game tile (24 October).
  const approved=new Set(['#fff','#237647','#000','#b0b2b8',...Object.values(palette.colors).map(color=>color.toLowerCase())]);
  for(const path of ['src/style.css','src/design/palette.css','public/icon.svg']){
   const text=readFileSync(new URL('../'+path,import.meta.url),'utf8');
   for(const match of text.matchAll(/#[0-9a-fA-F]{3,8}\b/g))expect(approved.has(match[0].toLowerCase()),`${path}: ${match[0]}`).toBe(true);
  }
 });
 it('hält die Palette vollständig als zentrale CSS-Variablen verfügbar',()=>{
  const css=readFileSync(new URL('../src/design/palette.css',import.meta.url),'utf8');
  for(const [name,value] of Object.entries(palette.colors))expect(css).toContain(`--calc-${name}:${value}`);
 });
 it('gleicht die fünf chromatischen Grundtöne in OKLCH an und hält dunkle Beschriftungen lesbar',()=>{
  const accents=['petrol','teal','red','orange','violet'].map(name=>palette.colors[name as keyof typeof palette.colors]);
  const lightness=accents.map(oklchLightness);
  expect(Math.max(...lightness)-Math.min(...lightness)).toBeLessThan(.002);
  for(const color of accents)expect(contrast(palette.colors.number,color)).toBeGreaterThanOrEqual(4.5);
 });
});
