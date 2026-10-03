import {indexConfig} from '@/lib/moss';
import {userId} from '@/lib/memory-store';
export async function POST(request:Request){try{return Response.json(await indexConfig(userId(request)));}catch(e){return Response.json({error:(e as Error).message},{status:503});}}
