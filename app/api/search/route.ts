import {NextRequest,NextResponse} from 'next/server';
import {searchProducts} from '../../../lib/search-service';
export const maxDuration=40;
export async function POST(request:NextRequest){
 const start=performance.now();
 try{
  const body=await request.json(),query=typeof body.query==='string'?body.query.trim():'',image=typeof body.image_url==='string'?body.image_url:'';
  if((!query&&!image)||query.length>250||image.length>2800000||(image&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)))return NextResponse.json({message:'Usá una búsqueda de hasta 250 caracteres o una imagen válida.'},{status:400});
  const result=await searchProducts(query,image);
  return NextResponse.json({...result,products_count:result.products.length},{headers:{'Cache-Control':'no-store','Server-Timing':`search;dur=${Math.round(performance.now()-start)}`}});
 }catch{return NextResponse.json({message:'La búsqueda tardó demasiado o no está disponible. Probá de nuevo.'},{status:502});}
}
