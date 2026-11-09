import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
export async function GET(req:NextRequest){
 const asin=(req.nextUrl.searchParams.get("asin")||"").trim().toUpperCase();
 if(!/^[A-Z0-9]{10}$/.test(asin))return NextResponse.json({message:"Identificador de producto inválido."},{status:400});
 const key=process.env.SERPAPI_API_KEY;
 if(!key)return NextResponse.json({message:"SerpAPI no está configurado."},{status:503});
 try{
 const qs=new URLSearchParams({engine:"amazon_product",asin,amazon_domain:"amazon.com",api_key:key});
 const response=await fetch("https://serpapi.com/search.json?"+qs,{signal:AbortSignal.timeout(18000),cache:"no-store"});
 const json=await response.json();
 if(!response.ok||json.error)return NextResponse.json({message:typeof json.error==="string"?json.error.slice(0,220):"No pudimos cargar el producto."},{status:502});
 const p=json.product_results||{};
 const image=typeof p.main_image==="string"?p.main_image:typeof p.thumbnail==="string"?p.thumbnail:null;
 const images=(Array.isArray(p.images)?p.images:[]).map((v:unknown)=>typeof v==="string"?v:typeof v==="object"&&v!==null&&"link" in v?(v as {link:unknown}).link:null).filter((v:unknown):v is string=>typeof v==="string"&&v.startsWith("https://")).slice(0,8);
 const mediaCandidates=[...(Array.isArray(p.images)?p.images:[]),...(Array.isArray(p.videos)?p.videos:[])].map((v:unknown)=>{if(typeof v==="string")return {url:v,type:"image",width:0,height:0};if(!v||typeof v!=="object")return null;const o=v as Record<string,unknown>;const url=[o.link,o.url,o.image,o.thumbnail].find(x=>typeof x==="string"&&x.startsWith("https://"));return typeof url==="string"?{url,type:typeof o.type==="string"&&o.type.toLowerCase().includes("video")?"video":"image",width:typeof o.width==="number"?o.width:0,height:typeof o.height==="number"?o.height:0}:null}).filter((v):v is {url:string;type:string;width:number;height:number}=>!!v&&v.url.startsWith("https://"));\n const rankedMedia=[...new Map(mediaCandidates.map(v=>[v.url,v])).values()].map(v=>({...v,score:(v.width&&v.height?Math.min(v.width*v.height/2000000,1)*40:10)+(v.type==="image"?30:20)+(v.url.includes("images-na.ssl-images-amazon.com")?5:0)})).sort((a,b)=>b.score-a.score).slice(0,12);\n const features=Array.isArray(p.about_this_item)?p.about_this_item.filter((v:unknown)=>typeof v==="string").slice(0,8):[];
 return NextResponse.json({product:{title:typeof p.title==="string"?p.title:"Producto Amazon",image,images:rankedMedia.filter(v=>v.type==="image").map(v=>v.url).length?rankedMedia.filter(v=>v.type==="image").map(v=>v.url):images.length?images:image?[image]:[],media:rankedMedia,price:typeof p.price==="string"?p.price:null,rating:typeof p.rating==="number"?p.rating:null,reviews:typeof p.reviews==="number"?p.reviews:null,description:typeof p.description==="string"?p.description:null,features,source:"Amazon",link:typeof p.link==="string"?p.link:null,asin}});
 }catch(e){console.error("amazon-product-error",e instanceof Error?e.message:"unknown");return NextResponse.json({message:"La información del producto no está disponible temporalmente."},{status:504})}
}