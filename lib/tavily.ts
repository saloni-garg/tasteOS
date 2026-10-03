import {z} from 'zod';
import type {Criterion} from './decision';
const API='https://api.tavily.com';
const sourceSchema=z.object({title:z.string().default('Source'),url:z.string().url(),content:z.string().nullish(),score:z.number().optional()});
export type ResearchSource={title:string;url:string;snippet:string;content:string|null};
export type ResearchContext={provider:'tavily';sources:ResearchSource[];warnings:string[]};

async function request(endpoint:'search'|'extract',body:Record<string,unknown>){
 const key=process.env.TAVILY_API_KEY;
 if(!key)throw new Error('Tavily is not configured for live research.');
 for(let attempt=0;attempt<2;attempt++){
  const r=await fetch(`${API}/${endpoint}`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(endpoint==='extract'?30000:20000)});
  if(!r.ok){
   if(attempt===0&&(r.status===429||r.status>=500)){await new Promise(resolve=>setTimeout(resolve,500));continue;}
   throw new Error(r.status===401||r.status===403?'Tavily could not authenticate the server.':r.status===432||r.status===402?'Tavily needs account credits.':r.status===429?'Tavily is busy. Please retry in a moment.':'Tavily could not complete this research request.');
  }
  return await r.json() as unknown;
 }
 throw new Error('Tavily could not complete this research request.');
}
export async function researchWithTavily(query:string,criteria:Criterion[]):Promise<ResearchContext>{
 const active=criteria.filter(c=>c.selected&&c.weight>0).sort((a,b)=>b.weight-a.weight);
 const primary=query.replace(/\s+/g,' ').trim().slice(0,399);
 const focused=`${primary.slice(0,250)} ${active.slice(0,3).map(c=>c.label).join(' ')} pricing details`.slice(0,399);
 const queries=Array.from(new Set([primary,focused]));
 const replies=await Promise.allSettled(queries.map(q=>request('search',{query:q,search_depth:'advanced',max_results:7,chunks_per_source:3,include_answer:false,include_raw_content:false})));
 const warnings:string[]=[];const found=new Map<string,z.infer<typeof sourceSchema>>();
 for(const reply of replies){
  if(reply.status==='rejected'){warnings.push((reply.reason as Error).message);continue;}
  const response=z.object({results:z.array(sourceSchema)}).parse(reply.value);
  for(const source of response.results){const u=new URL(source.url);if(!['https:','http:'].includes(u.protocol))continue;u.hash='';const url=u.href;const prev=found.get(url);if(!prev||(source.score??0)>(prev.score??0))found.set(url,{...source,url});}
 }
 if(!found.size)throw new Error(warnings[0]||'Tavily found no sources. Try a more specific request.');
 const selected=Array.from(found.values()).sort((a,b)=>(b.score??0)-(a.score??0)).slice(0,10);
 // Extraction is best-effort: search snippets still constitute useful evidence.
 let extracted=new Map<string,string>();
 try{
  const raw=await request('extract',{urls:selected.slice(0,6).map(s=>s.url),query:`${primary.slice(0,180)} ${active.map(c=>c.label).join(' ')}`.slice(0,399),chunks_per_source:5,extract_depth:'advanced',format:'text',timeout:20});
  const result=z.object({results:z.array(z.object({url:z.string(),raw_content:z.string().nullish()})),failed_results:z.array(z.object({url:z.string()})).optional()}).parse(raw);
  extracted=new Map(result.results.filter(s=>s.raw_content).map(s=>[s.url,s.raw_content!.slice(0,3000)]));
  if(result.failed_results?.length)warnings.push('Some pages could not be extracted; their search snippets are used instead.');
 }catch{warnings.push('Page extraction was unavailable; rankings use Tavily search snippets.');}
 return {provider:'tavily',sources:selected.map(s=>({title:s.title,url:s.url,snippet:(s.content||'').slice(0,1800),content:extracted.get(s.url)||null})),warnings:Array.from(new Set(warnings))};
}
