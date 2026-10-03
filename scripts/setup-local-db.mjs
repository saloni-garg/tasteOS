import './sites-env.mjs';
import { readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
if(!existsSync('dist/server/wrangler.json'))throw new Error('Run npm run build before npm run db:setup.');
for(const file of readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort()){
 const r=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state','--file','drizzle/'+file],{stdio:'inherit'});
 if(r.error)throw r.error;if(r.status!==0)process.exit(r.status||1);
}
