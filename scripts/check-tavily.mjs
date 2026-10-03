import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const originalFetch=globalThis.fetch,key=process.env.TAVILY_API_KEY;
const source=readFileSync('lib/tavily.ts','utf8').replace("from 'zod'",`from '${pathToFileURL(process.cwd()+'/node_modules/zod/index.js').href}'`);
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {researchWithTavily}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const criteria=[{id:'budget',label:'Under budget',selected:true,weight:70,reason:'Explicit'}];
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
try{
 process.env.TAVILY_API_KEY='test-key';let calls=[];
 globalThis.fetch=async(url,options)=>{const body=JSON.parse(options.body);calls.push({url,body});return String(url).endsWith('/search')?json({results:[{title:'One',url:'https://example.com/one#section',content:'Evidence',score:.9},{title:'Two',url:'https://example.com/two',content:'Other evidence',score:.8}]}):json({results:[{url:'https://example.com/one',raw_content:'x'.repeat(5000)}],failed_results:[{url:'https://example.com/two'}]});};
 const result=await researchWithTavily('I need a camera under $500. '.repeat(30),criteria);
 assert.equal(result.sources.length,2,'duplicate sources merge');assert.equal(result.sources[0].content.length,3000,'extraction context bounded');assert.equal(result.warnings.length,1,'partial extraction failure surfaced');assert.equal(calls.filter(c=>c.url.endsWith('/search')).length,2);assert.ok(calls.every(c=>c.body.query.length<=399));assert.equal(calls.find(c=>c.url.endsWith('/extract')).body.urls.length,2);
 globalThis.fetch=async url=>String(url).endsWith('/search')?json({results:[{title:'One',url:'https://example.com/one',content:'Evidence'}]}):json({},503);
 const fallback=await researchWithTavily('Find a small travel camera',criteria);assert.equal(fallback.sources[0].snippet,'Evidence');assert.equal(fallback.sources[0].content,null);assert.ok(fallback.warnings.length);
 globalThis.fetch=async()=>json({},401);await assert.rejects(()=>researchWithTavily('Find a small travel camera',criteria),/authenticate/);
 globalThis.fetch=async()=>json({results:[]});await assert.rejects(()=>researchWithTavily('Find a small travel camera',criteria),/no sources/);
 delete process.env.TAVILY_API_KEY;await assert.rejects(()=>researchWithTavily('Find a small travel camera',criteria),/not configured/);
 console.log('Tavily checks passed: query bounds, deduplication, extraction limits, partial failures, authentication, empty results, missing key.');
}finally{globalThis.fetch=originalFetch;if(key===undefined)delete process.env.TAVILY_API_KEY;else process.env.TAVILY_API_KEY=key;}
