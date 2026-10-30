import {NextRequest,NextResponse} from 'next/server';
export const dynamic='force-dynamic';
const validAsin=(s:string)=>/^[A-Z0-9]{10}$/.test(s);
export async function GET(req:NextRequest){
 const q=(req.nextUrl.searchParams.get('q')||'').trim().slice(0,160);
 if(q.length<2)return NextResponse.json({error:'Escribí al menos dos caracteres.'},{status:400});
 const key=process.env.SERPAPI_API_KEY;
 if(!key)return NextResponse.json({error:'La búsqueda de Amazon todavía no está configurada. Agregá SERPAPI_API_KEY en Vercel.'},{status:503});
 try{
 const u=new URL('https://serpapi.com/search.json');u.searchParams.set('engine','amazon');u.searchParams.set('amazon_domain','amazon.com');u.searchParams.set('k',q);u.searchParams.set('api_key',key);
 const response=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(18000)});
 if(!response.ok)throw new Error('Amazon search unavailable');
 const data=await response.json();
 if(data.error)throw new Error('Amazon search error');
 const results=(Array.isArray(data.organic_results)?data.organic_results:[]).filter((p:Record<string,unknown>)=>validAsin(String(p.asin||''))).slice(0,24).map((p:Record<string,unknown>)=>({
 asin:String(p.asin),title:String(p.title||'Producto'),image:typeof p.thumbnail==='string'?p.thumbnail:null,
 price:typeof p.price==='string'?p.price:typeof (p.price as Record<string,unknown>)?.raw==='string'?(p.price as Record<string,unknown>).raw:null,
 rating:typeof p.rating==='number'?p.rating:null,ratings:typeof p.ratings_total==='number'?p.ratings_total:null,
 brand:typeof p.brand==='string'?p.brand:null
 }));
 return NextResponse.json({query:q,products:results});
 }catch{return NextResponse.json({error:'No pudimos consultar Amazon ahora. Intentá nuevamente.'},{status:502});}
}
