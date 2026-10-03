import { readFileSync, appendFileSync } from 'node:fs';
const key=process.env.ZOOWORK_API_KEY,base=process.env.ZOOWORK_BASE_URL||'https://clawapi.ecap.gsmo.ai/service/v1';
if(!key)throw new Error('Set ZOOWORK_API_KEY first.');
const text=readFileSync('lib/zoowork.ts','utf8');const persona=text.split('export const persona=`')[1].split('`;')[0];
const r=await fetch(base+'/agents',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({resource:{name:'findwise-decision-engine',onboarding:false,model:{primary:'litellm/claude-sonnet-4-6'},persona:{docs:[{name:'AGENTS.md',content:persona}]}}})});
const data=await r.json();if(!r.ok)throw new Error(JSON.stringify(data));appendFileSync('.env.local','ZOOWORK_AGENT_ID='+data.agent_id+'\n');console.log(JSON.stringify({agent_id:data.agent_id}));
