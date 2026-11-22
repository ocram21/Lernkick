import {fractionParts} from '../content/tafelwerk/visuals';
import type { ReactNode } from 'react';

export function QuestionPrompt({text,highlight=false,math=false}:{text:string;highlight?:boolean;math?:boolean}) {
 const renderPart=(part:string,key:string):ReactNode=>{
  if(!math)return part;
  return part.split(/(\b\d+\s*[\/⁄]\s*\d+(?!\d)|[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g).map((piece,index)=>{
   const match=piece.match(/^(\d+)\s*[\/⁄]\s*(\d+)$/);
   const parts=match?[match[1],match[2]]:fractionParts(piece);
   return parts?<span className="math-fraction" role="math" aria-label={`${parts[0]} geteilt durch ${parts[1]}`} key={`${key}-${index}`}><span>{parts[0]}</span><span>{parts[1]}</span></span>:piece;
  });
 };
 if(!highlight)return <>{renderPart(text,'text')}</>;
 return <>{text.split(/(„[^“]+“|»[^«]+«|"[^"]+")/g).map((part,i)=>/^[„»"]/.test(part)?<span className="quoted-example" key={i}>{renderPart(part,`quote-${i}`)}</span>:renderPart(part,`text-${i}`))}</>;
}
