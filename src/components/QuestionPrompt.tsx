import type { ReactNode } from 'react';

export function QuestionPrompt({text,highlight=false,math=false}:{text:string;highlight?:boolean;math?:boolean}) {
 const renderPart=(part:string,key:string):ReactNode=>{
  if(!math)return part;
  return part.split(/(\b\d+\s*\/\s*\d+\b)/g).map((piece,index)=>{
   const match=piece.match(/^(\d+)\s*\/\s*(\d+)$/);
   return match?<span className="math-fraction" role="math" aria-label={`${match[1]} geteilt durch ${match[2]}`} key={`${key}-${index}`}><span>{match[1]}</span><span>{match[2]}</span></span>:piece;
  });
 };
 if(!highlight)return <>{renderPart(text,'text')}</>;
 return <>{text.split(/(„[^“]+“|»[^«]+«|"[^"]+")/g).map((part,i)=>/^[„»"]/.test(part)?<span className="quoted-example" key={i}>{renderPart(part,`quote-${i}`)}</span>:renderPart(part,`text-${i}`))}</>;
}
