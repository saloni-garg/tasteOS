import {z} from 'zod';
import {getTaste,saveProfile,addMemories,removeMemory,userId} from '@/lib/memory-store';
import {zoo,config,tokenFor,readToken} from '@/lib/zoowork';
import {starterProfile,tasteSchema} from '@/lib/taste';
const memory=z.object({kind:z.enum(['brand','decision','note']),label:z.string().trim().min(1).max(250),disposition:z.enum(['like','dislike','chosen']),context:z.string().max(5000).default('')});
export async function GET(request:Request){try{return Response.json({...await getTaste(userId(request)),providers:{moss:!!process.env.MOSS_PROJECT_KEY,band:!!process.env.BAND_AGENTS}});}catch(e){return Response.json({error:(e as Error).message},{status:503});}}
export async function POST(request:Request){try{const user=userId(request),input:any=await request.json();
 if(input.action==='add')await addMemories(user,z.array(memory).min(1).max(20).parse(input.memories));
 else if(input.action==='update')await saveProfile(user,tasteSchema.parse(input.profile));
 else if(input.action==='remove'){await removeMemory(user,z.string().uuid().parse(input.id));const state=await getTaste(user);await saveProfile(user,{summary:'A signal was forgotten. Learn your taste again to refresh the tentative traits.',traits:state.profile.traits.filter(t=>t.reason==='Explicitly adjusted by you.')});}
 else if(input.action==='starter'){await addMemories(user,['Apple','Muji','Patagonia','Aesop','Uniqlo'].map(label=>({kind:'brand',label,disposition:'like',context:'Example likes added by you for the demo.'})));await saveProfile(user,starterProfile());}
 else if(input.action==='infer'){const state=await getTaste(user);if(!state.memories.length)throw new Error('Add a brand or a decision first.');await zoo('/agents/'+config().agent+'/start',{});const session=await zoo('/agents/'+config().agent+'/sessions',{});await zoo(`/agents/${config().agent}/sessions/${session.session_id}/events`,{events:[{type:'user.message',content:JSON.stringify({phase:'taste',observations:state.memories,previous_profile:state.profile})}]});return Response.json({token:await tokenFor(session.session_id,Date.now(),undefined,user)});}
 else if(input.action==='commit'){const token=await readToken(input.token);if(token.owner!==user)throw new Error('This preference session belongs to another account.');await saveProfile(user,tasteSchema.parse(input.profile));}
 else throw new Error('Unknown memory action.');return Response.json({...await getTaste(user),providers:{moss:!!process.env.MOSS_PROJECT_KEY,band:!!process.env.BAND_AGENTS}});
 }catch(e){return Response.json({error:e instanceof z.ZodError?'Please check the preference details.':(e as Error).message},{status:400});}}
