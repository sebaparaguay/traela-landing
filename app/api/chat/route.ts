import { NextRequest, NextResponse } from 'next/server';
import { approvedReply, operatingRules, type Turn } from '../../../lib/traela-knowledge';
export async function POST(request: NextRequest) {
 try {
  const body=await request.json();
  const message=typeof body.message==='string'?body.message.trim():'';
  if(message.length>2000) return NextResponse.json({message:'El mensaje puede tener hasta 2.000 caracteres.'},{status:400});
  const image=typeof body.image_url==='string'?body.image_url:'';
  const audio=typeof body.audio_data==='string'?body.audio_data:'';
  if ((!message&&!image&&!audio)||image.length>2800000||audio.length>2800000||(image&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image))||(audio&&!/^data:audio\/[a-z0-9.+-]+(?:;codecs=[a-z0-9.,-]+)?;base64,[A-Za-z0-9+/=]+$/i.test(audio))) return NextResponse.json({message:'Enviá texto o un archivo válido de hasta 2 MB.'},{status:400});
  const history:Turn[]=Array.isArray(body.history)?body.history.slice(-12).filter((m:Turn)=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map((m:Turn)=>({role:m.role,text:m.text.slice(0,4000)})):[];
  const custom=process.env.TRAELA_CHAT_WEBHOOK_URL;
  if(audio&&!custom) return NextResponse.json({message:'La transcripción de notas de voz todavía no está conectada. Escribí tu consulta o mandanos el audio por WhatsApp.'},{status:422});
  const approved=!image&&!audio?approvedReply(message,history):null;
  if(approved) return NextResponse.json(approved);
  const upstream=await fetch(custom||'https://traela.app.n8n.cloud/webhook/search',{
   method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(25000),
   body:JSON.stringify({message,query:message,image_url:image,audio_data:audio,history,system_prompt:operatingRules,session_id:typeof body.session_id==='string'?body.session_id.slice(0,100):crypto.randomUUID(),locale:'es-PY',currency:'PYG'}),
  });
  if(!upstream.ok) throw new Error('Upstream unavailable');
  const data=await upstream.json();if(data.status==='error')throw new Error('Upstream error');
  if(custom){const reply=data.reply||data.output||data.message;if(typeof reply==='string'&&reply.trim())return NextResponse.json({reply,handoff:data.handoff===true});throw new Error('Invalid conversation response');}
  const products=Array.isArray(data.products)?data.products.slice(0,3):[];
  const reply=products.length?'Encontré estas opciones:\n\n'+products.map((p:{title?:string},i:number)=>`${i+1}. ${p.title||'Producto'}`).join('\n\n')+'\n\n¿Cuál te interesa? Para confirmar el precio final y la entrega, continuá con el equipo por WhatsApp.':image?'No pude identificar una opción con esta imagen. ¿Podés agregar el nombre o la marca del producto?':'No encontré opciones para esa búsqueda. Probá con el nombre del producto, la marca o un link.';
  return NextResponse.json({reply,handoff:products.length>0});
 }catch{return NextResponse.json({message:'No pudimos responder ahora. Intentá de nuevo o continuá por WhatsApp.'},{status:502});}
}
