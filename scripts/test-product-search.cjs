const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,imports={}){const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:name=>name in imports?imports[name]:require(name),URL,URLSearchParams,AbortSignal,process,fetch:global.fetch,Response,performance},{filename:file});return module.exports;}
const p=load('lib/product-search.ts');
const raw={products:[
 {id:'wrong',title:"Nike Men's Pegasus 42",rating:5,reviews:10000},
 {id:'women',title:"Nike Women's Pegasus 41"},
 {id:'child',title:'Nike Pegasus 41 Kids'},
 {id:'case',title:'Nike Pegasus 41 replacement case'},
 {id:'exact',title:"Nike Men's Pegasus 41 Black",source:'Nike',image_url:'https://example.com/shoe.png',source_url:'https://example.com/product',rating:4.5,reviews:10},
 {id:'duplicate',title:"Nike Men's Pegasus 41 Black",source:'Nike'},
 {id:'blue',title:"Nike Men's Pegasus 41 Blue"},
]};
const rows=p.normalizeProducts(raw);
assert.equal(p.rankProducts(rows,'Nike Pegasus 41 hombre negro')[0].id,'exact');
assert.equal(p.rankProducts(rows,'Nike Pegasus 41 hombre negro').length,1);
assert.equal(p.rankProducts(rows,'Nike Pegasus 41 hombre hasta ₲800.000')[0].id,'exact');
assert.ok(p.rankProducts(rows,'Nike Pegasus 41 hombre talle 42').some(x=>x.id==='exact'));
assert.equal(p.rankProducts(p.normalizeProducts({products:[{id:'wrong',title:'Nike Pegasus Wave'}]}),'Nike Pegasus 41').length,0);
assert.equal(p.rankProducts(p.normalizeProducts({products:[{id:'real',title:'Nike Pegasus 41 Running Shoes'}]}),'Zapatillas para correr 5 km').length,1);
assert.equal(p.normalizeProducts({products:[{title:'Test',image_url:'javascript:alert(1)',source_url:'data:text/html,test',rating:99} ]})[0].image_url,null);
assert.equal(p.normalizeProducts({products:[{title:'Test',rating:99}]})[0].rating,null);
const newUsed=p.normalizeProducts({products:[{id:'used',title:'Dyson Airwrap Used',rating:5,reviews:5000},{id:'new',title:'Dyson Airwrap Complete'}]});
assert.equal(p.rankProducts(newUsed,'Dyson Airwrap')[0].id,'new');
assert.equal(p.rankProducts(newUsed,'Dyson Airwrap nuevo').length,1);
assert.equal(p.resolveSearchQuery('en negro',[{role:'user',text:'Nike Pegasus 41 hombre'}]),'Nike Pegasus 41 hombre en negro');
assert.equal(p.resolveSearchQuery('Hola',[]),'Hola');
assert.equal(new URL(p.productHref({id:'a&b',product_query:'Nike 41'}),'https://trae.la').searchParams.get('id'),'a&b');
let calls=0;global.fetch=async()=>{calls++;return new Response(JSON.stringify({products:[{id:'nike',title:'Nike Pegasus 41'}]}),{status:200,headers:{'Content-Type':'application/json'}});};
const cache=new Map();const fakeCache=(fn)=>async(...args)=>{const key=JSON.stringify(args);if(cache.has(key))return cache.get(key);const result=await fn(...args);cache.set(key,result);return result;};
const service=load('lib/search-service.ts',{'server-only':{},'next/cache':{unstable_cache:fakeCache},'./product-search':p});
(async()=>{delete process.env.SERPAPI_API_KEY;await service.searchProducts('Nike Pegasus 41');await service.searchProducts('  NIKE  Pegasus 41 ');assert.equal(calls,1,'equivalent public queries reuse one cached result');await service.searchProducts('shoe','data:image/jpeg;base64,AA==');await service.searchProducts('shoe','data:image/jpeg;base64,AA==');assert.equal(calls,3,'photo requests bypass the shared cache');await service.searchProducts('user@example.com');await service.searchProducts('user@example.com');assert.equal(calls,5,'contact-like requests bypass shared cache');console.log('PASS: exact models, gender, child/accessory exclusion, color, deduplication, budget/size parsing, reviews, used products, context, URL safety and cache isolation');})().catch(e=>{console.error(e);process.exitCode=1;});
