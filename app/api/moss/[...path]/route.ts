import {db,userId} from '@/lib/memory-store';
import {moss} from '@/lib/moss';
async function proxy(request:Request){try{const user=userId(request),path=new URL(request.url).pathname.split('/api/moss/')[1];const own=await db().prepare('SELECT index_name FROM moss_indexes WHERE user_id=?').bind(user).first<any>();if(!own)throw new Error('Prepare your taste memory first.');let body:any;
 if(path==='init'&&request.method==='POST'){body=await request.json();if(body.indexName!==own.index_name||body.modelId!=='custom'||body.dimension!==8||body.docCount>58||body.docCount<1)throw new Error('Invalid preference index.');}
 else if(path===own.index_name||path===own.index_name+'/url'){if(request.method!=='GET')throw new Error('Unsupported request.');}
 else if(/^[a-f0-9-]{36}\/(confirm|status)$/.test(path)){const job=path.split('/')[0];const row=await db().prepare('SELECT id FROM moss_jobs WHERE id=? AND user_id=? AND index_name=?').bind(job,user,own.index_name).first();if(!row)throw new Error('This memory job belongs to another account.');if(path.endsWith('/confirm')){if(request.method!=='POST')throw new Error('Unsupported request.');body=await request.json();}else if(request.method!=='GET')throw new Error('Unsupported request.');}
 else throw new Error('This index belongs to another account.');
 const r=await moss(path,body,request.method);const value:any=await r.json();if(path==='init'&&r.ok&&value.jobId)await db().prepare('INSERT INTO moss_jobs (id,user_id,index_name) VALUES (?,?,?)').bind(value.jobId,user,own.index_name).run();return Response.json(value,{status:r.status,headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:(e as Error).message},{status:400});}}
export const GET=proxy;export const POST=proxy;
