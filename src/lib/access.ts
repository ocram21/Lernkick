export const PWA_UNLOCK_KEY='lernkick.pwa.pinUnlock.v1';
export function isInstalledPWA(){return (typeof window.matchMedia==='function'&&window.matchMedia('(display-mode: standalone)').matches)||(navigator as Navigator&{standalone?:boolean}).standalone===true;}
export function dailyPin(date=new Date()):string{
 let day:string,month:string,year:string;
 try{
  const parts=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',day:'2-digit',month:'2-digit',year:'numeric',calendar:'gregory',numberingSystem:'latn'}).formatToParts(date);
  day=parts.find(p=>p.type==='day')!.value;month=parts.find(p=>p.type==='month')!.value;year=parts.find(p=>p.type==='year')!.value;
 }catch{day=String(date.getDate());month=String(date.getMonth()+1);year=String(date.getFullYear());}
 return String(Math.floor(Math.sqrt(Number(day.padStart(2,'0')+month.padStart(2,'0')+year.padStart(4,'0'))))).padStart(4,'0');
}
export function hasPWAApproval(){if(!isInstalledPWA())return false;try{return localStorage.getItem(PWA_UNLOCK_KEY)==='granted';}catch{return false;}}
export function rememberPWAApproval(){if(!isInstalledPWA())return;try{localStorage.setItem(PWA_UNLOCK_KEY,'granted');}catch{/* A session can still be used if local storage is unavailable. */}}
