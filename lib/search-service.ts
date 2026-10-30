import 'server-only';
import {unstable_cache} from 'next/cache';
import {normalizeProducts,rankProducts,providerQuery,type Product} from './product-search';
export type SearchResult={products:Product[];candidate_count:number;provider:'n8n'|'serpapi';searched_at:string};
const N8N='https://traela.app.n8n.cloud/webhook/search';
// No customer session, chat history, media or quotation data enters the shared text cache.
async function retrieve(query:string,image=''):Promise<SearchResult>{
 const direct=Boolean(process.env.SERPAPI_API_KEY)&&!image;
 let response:Response;
 if(direct){
  const url=new URL('https://serpapi.com/search.json');
  url.search=new URLSearchParams({engine:'google_shopping',q:providerQuery(query),gl:'us',hl:'en',api_key:process.env.SERPAPI_API_KEY!}).toString();
  response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});
 }else{
  response=await fetch(N8N,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,image_url:image,locale:'es-PY',currency:'PYG'}),cache:'no-store',signal:AbortSignal.timeout(28000)});
 }
 if(!response.ok)throw new Error('Search provider unavailable');
 const data=await response.json();
 if(data.error||data.status==='error')throw new Error('Search provider failed');
 const candidates=normalizeProducts(data);
 return {products:rankProducts(candidates,query),candidate_count:candidates.length,provider:direct?'serpapi':'n8n',searched_at:new Date().toISOString()};
}
const cachedSearch=unstable_cache(async(query:string,direct:boolean)=>{void direct;return retrieve(query);},['traela-products-v2'],{revalidate:600,tags:['traela-products']});
export async function searchProducts(query:string,image=''){
 const normalized=query.trim().replace(/\s+/g,' ').slice(0,250);
 // Product searches only. Images, links and contact-like strings are never persistently cached.
 const publicQuery=!image&&!/@|https?:|\+?\d[\d\s()-]{8,}/i.test(normalized);
 return publicQuery?cachedSearch(normalized.toLowerCase(),Boolean(process.env.SERPAPI_API_KEY)):retrieve(normalized,image);
}
