import fs from 'node:fs';
import init,{ManageClient,IndexManager} from '@moss-dev/moss-wasm';
process.loadEnvFile('.env.local');
await init({module_or_path:fs.readFileSync('node_modules/@moss-dev/moss-wasm/moss_wasm_bg.wasm')});globalThis.window=globalThis;
const original=globalThis.fetch;globalThis.fetch=async(r,o)=>{console.log('Moss endpoint',typeof r==='string'?new URL(r).pathname:new URL(r.url).pathname,r.method||o?.method||'GET');if(typeof r!=='string'&&new URL(r.url).pathname.includes('/auth/'))console.log('Auth schema',Object.keys(JSON.parse(await r.clone().text())),[...r.headers].map(([k])=>k));const response=await original(r,o);if(!response.ok)console.log('status',response.status,(await response.clone().text()).slice(0,180));return response;};
const index='findwise-integration-check';const m=new ManageClient(process.env.MOSS_PROJECT_ID,process.env.MOSS_PROJECT_KEY);
try{const info=await m.getIndex(index);console.log('Existing probe index',info.name||info.indexName);}catch{const r=await m.createIndex(index,[{id:'minimal',text:'Minimal design, durable everyday choices',embedding:[1,.8,.7,.7,.3,.4,0,0]},{id:'calm',text:'Quiet hotels with thoughtful rooms',embedding:[.5,.7,.3,.3,1,.1,0,0]}],'custom');console.log('Created probe',r);}
const im=new IndexManager(process.env.MOSS_PROJECT_ID,process.env.MOSS_PROJECT_KEY);await im.loadIndex(index);const r=await im.query(index,'a quiet hotel',new Float32Array([.4,.6,.3,.3,1,.1,0,0]),2,.5,undefined,undefined);console.log('Results',r.docs?.map(d=>({id:d.id,text:d.text,score:d.score})),r.timeTakenMs);
