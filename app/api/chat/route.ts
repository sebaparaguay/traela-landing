import { NextRequest, NextResponse } from 'next/server';
import { storageConfigured,receive,publish,customerConversation } from '../../../lib/conversation-store';
import { approvedReply, operatingRules, type Turn } from '../../../lib/traela-knowledge';
export async function POST(request: NextRequest) {
 let stored:{id:string;auto_enabled:boolean;duplicate:boolean}|null=null;
 let key='';
 const finish=async(payload:{reply:string;handoff?:boolean;products?:unknown[]})=>{if(stored){if(payload.handoff)payload.reply=payload.reply.replace('Todavía no se envió una solicitud al equipo desde este chat.','La consulta quedó en la bandeja del equipo.').replace('El equipo confirma el precio final y la entrega por WhatsApp.','El equipo confirmará el precio final y la entrega por acá.').replace('Podés continuar por WhatsApp para que revisemos el estado.','El equipo revisará tu consulta y te responderá por acá.');const sent=await publish(stored.id,payload.reply,{products:payload.products||[],handoff:payload.handoff||false},payload.handoff||false);return NextResponse.json({...payload,pending:!sent,...await customerConversation(key)});}return NextResponse.json(payload);};
 try {
  const body=await request.json();
  const message=typeof body.message==='string'?body.message.trim():'';
  if(message.length>2000) return NextResponse.json({message:'El mensaje puede tener hasta 2.000 caracteres.'},{status:400});
  const image=typeof body.image_url==='string'?body.image_url:'';
  const audio=typeof body.audio_data==='string'?body.audio_data:'';
  if ((!message&&!image&&!audio)||image.length>2800000||audio.length>2800000||(image&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image))||(audio&&!/^data:audio\/[a-z0-9.+-]+(?:;codecs=[a-z0-9.,-]+)?;base64,[A-Za-z0-9+/=]+$/i.test(audio))) return NextResponse.json({message:'Enviá texto o un archivo válido de hasta 2 MB.'},{status:400});
  let history:Turn[]=Array.isArray(body.history)?body.history.slice(-12).filter((m:Turn)=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map((m:Turn)=>({role:m.role,text:m.text.slice(0,4000)})):[];
  if(storageConfigured()) { key=typeof body.session_id==='string'?body.session_id:'';stored=await receive(key,message||(image?'Imagen enviada':'Nota de voz'),typeof body.message_id==='string'?body.message_id:crypto.randomUUID(),{image:image||undefined,audio:audio||undefined});if(stored.duplicate||!stored.auto_enabled)return NextResponse.json({reply:'',pending:true,...await customerConversation(key)});const snapshot=await customerConversation(key);history=snapshot.messages.slice(0,-1).slice(-12).map((m:{role:string;text:string})=>({role:m.role==='operator'?'assistant':m.role,text:m.text})); }
  const custom=process.env.TRAELA_CHAT_WEBHOOK_URL;
  if(audio&&!message&&!custom&&stored)return await finish({reply:'Recibimos tu nota de voz. El equipo la revisará y te responderá por acá.',handoff:true});
  if(audio&&!message&&!custom) return NextResponse.json({message:'La transcripción de notas de voz todavía no está conectada. Escribí tu consulta o mandanos el audio por WhatsApp.'},{status:422});
  const approved=!image&&!audio?approvedReply(message,history):null;
  if(approved) return await finish(approved);
  const upstream=await fetch(custom||'https://traela.app.n8n.cloud/webhook/search',{
   method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(25000),
   body:JSON.stringify({message,query:message,image_url:image,audio_data:custom?audio:'',history,system_prompt:operatingRules,session_id:typeof body.session_id==='string'?body.session_id.slice(0,100):crypto.randomUUID(),locale:'es-PY',currency:'PYG'}),
  });
  if(!upstream.ok) throw new Error('Upstream unavailable');
  const data=await upstream.json();if(data.status==='error')throw new Error('Upstream error');
  if(custom){const reply=data.reply||data.output||data.message;if(typeof reply==='string'&&reply.trim())return await finish({reply,handoff:data.handoff===true});throw new Error('Invalid conversation response');}
  const products=Array.isArray(data.products)?data.products.slice(0,3):[];
  const previews=products.map((p:{id?:string;title?:string;image_url?:string})=>({id:typeof p.id==='string'?p.id:crypto.randomUUID(),title:typeof p.title==='string'?p.title:'Producto',image_url:typeof p.image_url==='string'&&/^https:\/\//i.test(p.image_url)?p.image_url:null}));
  const reply=products.length?'Encontré estas opciones. ¿Cuál te interesa? El equipo confirma el precio final y la entrega antes de comprar.':image?'No pude identificar una opción con esta imagen. ¿Podés agregar el nombre o la marca del producto?':'No encontré opciones para esa búsqueda. Probá con el nombre del producto, la marca o un link.';
  return await finish({reply,products:previews,handoff:products.length>0});
 }catch{if(stored){try{return await finish({reply:'No pude completar la búsqueda ahora. El equipo revisará tu consulta y te responderá por acá.',handoff:true});}catch{}}return NextResponse.json({message:'No pudimos responder ahora. Intentá de nuevo o continuá por WhatsApp.'},{status:502});}
}
