import{describe,it,expect,vi,afterEach}from'vitest';
import{readFileSync,existsSync}from'node:fs';
import{createContext,runInContext}from'node:vm';
const html=readFileSync(new URL('../public/games/dual-n-back/index.html',import.meta.url),'utf8');
function game(){
 const nodes=new Map<string,any>();function node(){return{className:'',textContent:'',innerHTML:'',disabled:false,style:{},children:[],classList:{toggle(){},remove(){}},append(...children:any[]){this.children.push(...children);},replaceChildren(){this.children=[];},addEventListener(){},querySelector(){return node();}};}
 const context:any={console,Date,Intl,Math,Object,Array,Number,Set,Promise,performance:{now:()=>Date.now()},setTimeout,clearTimeout,location:{origin:'https://test.local'},parent:{postMessage(){}},Audio:class{preload='';currentTime=0;pause(){}play(){return Promise.resolve();}},document:{hidden:false,body:node(),getElementById(id:string){if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},querySelectorAll(selector:string){return selector==='.cell'?Array.from({length:9},node):[];},createElement:node,addEventListener(){}}};context.window=context;context.addEventListener=()=>{};createContext(context);runInContext(html.match(/<script>([\s\S]*?)<\/script>/)![1],context);return(code:string)=>runInContext(code,context);
}
afterEach(()=>vi.useRealTimers());
describe('Original-Dual-N-Back mit LernKick-Rückweg',()=>{
 it('enthält alle neun lokalen Sprachaufnahmen und keine fremden Laufzeitressourcen',()=>{const samples=[...html.matchAll(/data:audio\/wav;base64,([A-Za-z0-9+/=]+)/g)];expect(samples).toHaveLength(9);for(const sample of samples)expect(Buffer.from(sample[1],'base64').subarray(0,4).toString()).toBe('RIFF');expect(html).not.toMatch(/(?:src|href)=["']https?:/);expect(existsSync(new URL('../public/boards',import.meta.url))).toBe(false);});
 it('hat für alle vier Stufen 24 echte bewertete Reize mit kontrollierten Audio-/Positionsmatches und korrekter Auswertung',()=>{const run=game();for(let n=1;n<=4;n++)for(let round=0;round<30;round++){
  const sequence=run(`generateSequence(${n})`);expect(sequence).toHaveLength(24+n);expect(sequence.filter((t:any)=>t.scored)).toHaveLength(24);
  for(let i=n;i<sequence.length;i++){expect(sequence[i].audioMatch).toBe(sequence[i].letter===sequence[i-n].letter);expect(sequence[i].positionMatch).toBe(sequence[i].position===sequence[i-n].position);}
  expect(sequence.filter((t:any)=>t.audioMatch).length).toBeGreaterThanOrEqual(5);expect(sequence.filter((t:any)=>t.positionMatch).length).toBeGreaterThanOrEqual(5);
  expect(run(`(()=>{const sequence=generateSequence(${n});for(const t of sequence){t.answers.audio=t.audioMatch;t.answers.position=t.positionMatch;}return evaluateRound({sequence});})()`).errors).toBe(0);
  const incorrect=run(`(()=>{const sequence=generateSequence(${n});for(const t of sequence){t.answers.audio=!t.audioMatch;t.answers.position=!t.positionMatch;}return evaluateRound({sequence});})()`);expect(incorrect.errors).toBe(48);expect(incorrect.passed).toBe(false);
 }});
 it('friert eine laufende Runde in der Pause ein und nimmt genau dort wieder auf',async()=>{vi.useFakeTimers();const run=game();run('playRound(1)');await vi.advanceTimersByTimeAsync(3000);expect(run('state.currentRound.index')).toBe(1);run('pauseGame(true)');await vi.advanceTimersByTimeAsync(10000);expect(run('state.currentRound.index')).toBe(1);run("registerAnswer('audio')");expect(run('state.currentRound.sequence[1].answers.audio')).toBe(false);run('pauseGame(false)');await vi.advanceTimersByTimeAsync(3000);expect(run('state.currentRound.index')).toBe(2);run('pauseGame(true)');});
});
