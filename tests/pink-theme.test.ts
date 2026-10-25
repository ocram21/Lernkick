import {test,expect} from 'vitest';
import sharp from 'sharp';
import tokens from '../src/design/pink.json';
function rgb(hex:string){return hex.slice(1).match(/../g)!.map(v=>parseInt(v,16));}
function luminance(c:number[]){return c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function contrast(a:number[],b:number[]){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('Pink: Lesetexte auf Karten und Auswahl erfüllen WCAG AA',()=>{
 for(const [ink,bg] of [[tokens.ink,tokens.panel],[tokens.muted,tokens.panel],[tokens.ink,tokens.input],[tokens.muted,tokens.input],[tokens.white,tokens.accent]])expect(contrast(rgb(ink),rgb(bg))).toBeGreaterThanOrEqual(4.5);
});
test('Pink: helle Texte bleiben auch über dem hellsten Bildpunkt lesbar',async()=>{
 const {data,info}=await sharp('src/design/pink-waves.webp').removeAlpha().raw().toBuffer({resolveWithObject:true});const ground=rgb(tokens.ground);let brightest=0;
 for(let i=0;i<data.length;i+=info.channels)brightest=Math.max(brightest,luminance(ground.map((v,k)=>v*.52+data[i+k]*.48)));
 for(const ink of [tokens.text,tokens['text-muted']])expect((luminance(rgb(ink))+.05)/(brightest+.05)).toBeGreaterThanOrEqual(4.5);
});

test('Normaler Schieferhintergrund: helle Schrift bleibt über allen Bildpunkten lesbar',async()=>{
 const {data,info}=await sharp('src/design/slate-doodles.webp').removeAlpha().raw().toBuffer({resolveWithObject:true});const ground=rgb('#2b2d39');let brightest=0;
 for(let i=0;i<data.length;i+=info.channels)brightest=Math.max(brightest,luminance(ground.map((v,k)=>v*.6+data[i+k]*.4)));
 expect((luminance(rgb('#ecedf1'))+.05)/(brightest+.05)).toBeGreaterThanOrEqual(4.5);
});
