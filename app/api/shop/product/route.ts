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
 const features=Array.isArray(p.about_this_item)?p.about_this_item.filter((v:unknown)=>typeof v==="string").slice(0,8):[];
 return NextResponse.json({product:{title:typeof p.title==="string"?p.title:"Producto Amazon",image,images:images.length?images:image?[image]:[],price:typeof p.price==="string"?p.price:null,rating:typeof p.rating==="number"?p.rating:null,reviews:typeof p.reviews==="number"?p.reviews:null,description:typeof p.description==="string"?p.description:null,features,source:"Amazon",link:typeof p.link==="string"?p.link:null,asin}});
 }catch(e){console.error("amazon-product-error",e instanceof Error?e.message:"unknown");return NextResponse.json({message:"La información del producto no está disponible temporalmente."},{status:504})}
}