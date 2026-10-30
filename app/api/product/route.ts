import {NextRequest,NextResponse} from 'next/server';
import {searchProducts} from '../../../lib/search-service';
export const maxDuration=40;
export async function GET(request:NextRequest){
 const started=performance.now();
 const q=request.nextUrl.searchParams.get('q')||'',id=request.nextUrl.searchParams.get('id')||'';
 if(!q||q.length>250||!id||id.length>180)return NextResponse.json({message:'Abrí un producto desde los resultados.'},{status:400});
 try{const result=await searchProducts(q);const product=result.products.find(p=>p.id===id);return product?NextResponse.json({product,searched_at:result.searched_at},{headers:{'Cache-Control':'no-store','Server-Timing':`product;dur=${Math.round(performance.now()-started)}`}}):NextResponse.json({message:'Esta publicación ya no aparece en la búsqueda. Volvé a buscar para ver opciones actuales.'},{status:404,headers:{'Cache-Control':'no-store','Server-Timing':`product;dur=${Math.round(performance.now()-started)}`}});}
 catch{return NextResponse.json({message:'No pudimos recuperar el producto. Volvé a buscar.'},{status:502});}
}
