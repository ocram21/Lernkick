import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
type Point={x:number;y:number};
export function ZoomSurface({children,ratio,label}:{children:ReactNode;ratio:number;label:string}){
 const ref=useRef<HTMLDivElement>(null),pointers=useRef(new Map<number,Point>()),gesture=useRef<{distance:number;mid:Point;zoom:number;pan:Point}|null>(null),drag=useRef<{point:Point;pan:Point}|null>(null);
 const [size,setSize]=useState({width:400,height:400}),[zoom,setZoom]=useState(1),[pan,setPan]=useState<Point>({x:0,y:0});
 useEffect(()=>{const observer=new ResizeObserver(entries=>{const r=entries[0].contentRect;setSize({width:r.width,height:r.height});});observer.observe(ref.current!);return()=>observer.disconnect();},[]);
 const width=Math.min(size.width,size.height*ratio),height=width/ratio;
 function bounded(point:Point,z=zoom){const x=Math.max(0,(width*z-size.width)/2),y=Math.max(0,(height*z-size.height)/2);return {x:Math.max(-x,Math.min(x,point.x)),y:Math.max(-y,Math.min(y,point.y))};}
 function change(z:number,point=pan){const value=Math.max(1,Math.min(5,z));setZoom(value);setPan(bounded(point,value));}
 function end(id:number){pointers.current.delete(id);gesture.current=null;drag.current=null;}
 return <div className="zoom-surface"><div className="zoom-controls" role="group" aria-label="Grafik vergrößern"><button className="icon-button" aria-label="Verkleinern" disabled={zoom<=1} onClick={()=>change(zoom/1.5)}><Minus size={18}/></button><span>{Math.round(zoom*100)} %</span><button className="icon-button" aria-label="Vergrößern" disabled={zoom>=5} onClick={()=>change(zoom*1.5)}><Plus size={18}/></button><button className="text-button" onClick={()=>change(1,{x:0,y:0})}><RotateCcw size={16}/>Zurücksetzen</button></div>
 <div className="zoom-viewport" ref={ref} data-zoom={zoom.toFixed(2)} role="group" aria-label={label} tabIndex={0}
 onDoubleClick={e=>{if(!(e.target as HTMLElement).closest('button'))change(zoom>1?1:2,{x:0,y:0});}}
 onKeyDown={event=>{if(event.target!==event.currentTarget)return;const directions:Record<string,Point>={ArrowLeft:{x:40,y:0},ArrowRight:{x:-40,y:0},ArrowUp:{x:0,y:40},ArrowDown:{x:0,y:-40}};if(directions[event.key]){event.preventDefault();const d=directions[event.key];setPan(bounded({x:pan.x+d.x,y:pan.y+d.y}));}else if(event.key==='+'){event.preventDefault();change(zoom*1.5);}else if(event.key==='-'){event.preventDefault();change(zoom/1.5);}}}
 onPointerDown={event=>{if((event.target as HTMLElement).closest('button'))return;const point={x:event.clientX,y:event.clientY};pointers.current.set(event.pointerId,point);if(pointers.current.size===2){const [a,b]=[...pointers.current.values()];gesture.current={distance:Math.hypot(a.x-b.x,a.y-b.y),mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},zoom,pan};for(const id of pointers.current.keys())event.currentTarget.setPointerCapture(id);}else if(zoom>1){drag.current={point,pan};event.currentTarget.setPointerCapture(event.pointerId);}}}
 onPointerMove={event=>{if(!pointers.current.has(event.pointerId))return;pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});const g=gesture.current;if(pointers.current.size===2&&g){const [a,b]=[...pointers.current.values()],z=Math.max(1,Math.min(5,g.zoom*Math.hypot(a.x-b.x,a.y-b.y)/(g.distance||1))),r=ref.current!.getBoundingClientRect(),mid={x:(a.x+b.x)/2-r.left-r.width/2,y:(a.y+b.y)/2-r.top-r.height/2},old={x:g.mid.x-r.left-r.width/2,y:g.mid.y-r.top-r.height/2};change(z,{x:mid.x-(old.x-g.pan.x)*z/g.zoom,y:mid.y-(old.y-g.pan.y)*z/g.zoom});}else if(drag.current){const d=drag.current;setPan(bounded({x:d.pan.x+event.clientX-d.point.x,y:d.pan.y+event.clientY-d.point.y}));}}}
 onPointerUp={event=>end(event.pointerId)} onPointerCancel={event=>end(event.pointerId)}>
 <div className="zoom-center" style={{width,height}}><div className="zoom-content" style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>{children}</div></div>
 </div><p className="zoom-hint">Mit zwei Fingern zoomen. Vergrößerten Ausschnitt verschieben.</p></div>;
}
