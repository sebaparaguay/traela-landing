import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
export async function GET(req:NextRequest){
 const key=process.env.SERPAPI_API_KEY;
 if(!key)return NextResponse.json({error:"SERPAPI_NOT_CONFIGURED",message:"Configurá SERPAPI_API_KEY en Vercel para activar búsquedas reales."},{status:503});
 const query=(req.nextUrl.searchParams.get("q")||"").trim().slice(0,180);
 const source=req.nextUrl.searchParams.get("source")==="google"?"google_shopping":"amazon";
 if(query.length<2)return NextResponse.json({error:"INVALID_QUERY"},{status:400});
 try{
 const params=new URLSearchParams({engine:source,api_key:key});
 if(source==="amazon"){params.set("k",query);params.set("amazon_domain","amazon.com")}else{params.set("q",query);params.set("gl","us");params.set("hl","en")}
 const response=await fetch("https://serpapi.com/search.json?"+params,{cache:"no-store",signal:AbortSignal.timeout(18000)});
 const data=await response.json();
 if(!response.ok||data.error)return NextResponse.json({error:"SEARCH_FAILED",message:typeof data.error==="string"?data.error.slice(0,250):"El proveedor rechazó la búsqueda.",providerStatus:response.status},{status:502});
 const raw=source==="amazon"?(data.organic_results||[]):(data.shopping_results||[]);
 const products=raw.slice(0,12).map((p:Record<string,unknown>)=>({id:String(p.asin||p.product_id||p.position||""),title:String(p.title||""),image:typeof p.thumbnail==="string"?p.thumbnail:typeof p.image==="string"?p.image:null,price:typeof p.price==="string"?p.price:null,rating:typeof p.rating==="number"?p.rating:null,link:typeof p.link==="string"&&p.link.startsWith("https://")?p.link:null,source:source==="amazon"?"Amazon":"Google Shopping"})).filter((p:{title:string})=>p.title);
 return NextResponse.json({query,source,products,live:true},{headers:{"Cache-Control":"private, max-age=60"}});
 }catch(e){console.error("shop-search-failure",e instanceof Error?e.message:"unknown");return NextResponse.json({error:"SEARCH_UNAVAILABLE",message:"No se pudo contactar a SerpAPI. Revisá los registros de Vercel."},{status:504})}
}