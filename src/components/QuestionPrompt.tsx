export function QuestionPrompt({text,highlight=false}:{text:string;highlight?:boolean}) {
 if(!highlight)return <>{text}</>;
 return <>{text.split(/(„[^“]+“|»[^«]+«|"[^"]+")/g).map((part,i)=>/^[„»"]/.test(part)?<span className="quoted-example" key={i}>{part}</span>:part)}</>;
}
