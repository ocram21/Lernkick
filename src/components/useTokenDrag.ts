import {useEffect,useRef,useState,type PointerEvent}from'react';
/** Pointer capture works on mouse and touch; the target carries data-drop-target. */
export function useTokenDrag(onDrop:(source:string,target:string)=>void,paused=false){
 const start=useRef<{x:number;y:number;source:string}|null>(null),skipClick=useRef(false),point=useRef<{x:number;y:number}|null>(null);
 const [ghost,setGhost]=useState<{x:number;y:number;label:string}|null>(null),[hover,setHover]=useState<string|null>(null);
 const latest=useRef(onDrop);latest.current=onDrop;
 const targetAt=(x:number,y:number)=>document.elementFromPoint(x,y)?.closest('[data-drop-target]')?.getAttribute('data-drop-target')??null;
 useEffect(()=>{if(paused){start.current=null;point.current=null;setGhost(null);setHover(null);}},[paused]);
 useEffect(()=>{if(!ghost)return;let frame=0;const scroll=()=>{const p=point.current;if(p){const element=document.elementFromPoint(p.x,p.y)?.closest('[data-drag-scroll]');if(element){const r=element.getBoundingClientRect();if(p.y<r.top+40)element.scrollTop-=7;else if(p.y>r.bottom-40)element.scrollTop+=7;}setHover(targetAt(p.x,p.y));}frame=requestAnimationFrame(scroll);};frame=requestAnimationFrame(scroll);return()=>cancelAnimationFrame(frame);},[Boolean(ghost)]);
 function cancel(){start.current=null;point.current=null;setGhost(null);setHover(null);}
 function bind(source:string,label:string){return {onPointerDown:(event:PointerEvent<HTMLElement>)=>{if(paused||event.button!==0)return;start.current={x:event.clientX,y:event.clientY,source};point.current={x:event.clientX,y:event.clientY};event.currentTarget.setPointerCapture(event.pointerId);},onPointerMove:(event:PointerEvent<HTMLElement>)=>{if(!start.current||paused)return;point.current={x:event.clientX,y:event.clientY};if(Math.hypot(event.clientX-start.current.x,event.clientY-start.current.y)>6){setGhost({...point.current,label});setHover(targetAt(event.clientX,event.clientY));}},onPointerUp:(event:PointerEvent<HTMLElement>)=>{const before=start.current;if(before&&Math.hypot(event.clientX-before.x,event.clientY-before.y)>6){skipClick.current=true;const target=targetAt(event.clientX,event.clientY);if(target!==null)latest.current(before.source,target);setTimeout(()=>{skipClick.current=false;},0);}cancel();},onPointerCancel:cancel};}
 return{bind,ghost,hover,consumeClick:()=>skipClick.current,cancel};
}
