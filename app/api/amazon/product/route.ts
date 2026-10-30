import {NextRequest,NextResponse} from 'next/server';
export const dynamic='force-dynamic';
const https=(v:unknown)=>typeof v==='string'&&/^https:\/\//i.test(v)?v:null;
export async function GET(req:NextRequest){
 const asin=(req.nextUrl.searchParams.get('asin')||'').toUpperCase();
 if(!/^[A-Z0-9]{10}$/.test(asin))return NextResponse.json({error:'Identificador de producto inválido.'},{status:400});
 const key=process.env.SERPAPI_API_KEY;
 if(!key)return NextResponse.json({error:'Falta configurar SERPAPI_API_KEY en Vercel.'},{status:503});
 try{
 const u=new URL('https://serpapi.com/search.json');u.searchParams.set('engine','amazon_product');u.searchParams.set('amazon_domain','amazon.com');u.searchParams.set('asin',asin);u.searchParams.set('api_key',key);
 const response=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error('Product API unavailable');
 const d=await response.json();if(d.error)throw new Error('Product API error');
 const p=d.product_results||{};
 const images=[p.main_image,...(Array.isArray(p.images)?p.images.map((x:unknown)=>typeof x==='string'?x:(x as Record<string,unknown>)?.link||(x as Record<string,unknown>)?.image):[])].map(https).filter((x:string|null):x is string=>!!x);
 const unique=[...new Set(images)];
 const features=Array.isArray(p.feature_bullets)?p.feature_bullets.filter((x:unknown)=>typeof x==='string').slice(0,8):[];
 const videos=(Array.isArray(p.videos)?p.videos:[]).map((v:unknown)=>typeof v==='string'?v:(v as Record<string,unknown>)?.url||(v as Record<string,unknown>)?.link).map(https).filter((x:string|null):x is string=>!!x);
 return NextResponse.json({asin,title:p.title||null,brand:p.brand||null,images:unique,features,description:typeof p.description==='string'?p.description:null,
 price:typeof p.price==='string'?p.price:typeof p.price?.raw==='string'?p.price.raw:null,
 rating:typeof p.rating==='number'?p.rating:null,ratings:p.ratings_total||null,
 videos,details:typeof p.product_information==='object'&&p.product_information?p.product_information:{},
 source:'Amazon via SerpAPI',amazonUrl:'https://www.amazon.com/dp/'+asin});
 }catch{return NextResponse.json({error:'No pudimos cargar la información del producto.'},{status:502});}
}
