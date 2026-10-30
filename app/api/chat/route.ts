import { after, NextRequest, NextResponse } from 'next/server';
import { storageConfigured,receive,publish,customerConversation } from '../../../lib/conversation-store';
import { approvedReply, operatingRules, type Turn } from '../../../lib/traela-knowledge';
import { notifyOperator } from '../../../lib/push';
import {searchProducts} from '../../../lib/search-service';
import {resolveSearchQuery} from '../../../lib/product-search';
export const maxDuration=40;
export async function POST(request: NextRequest) {
 const started=performance.now();
 let stored:{id:string;auto_enabled:boolean;duplicate:boolean}|null=null;
 let key='';let notificationKind:'message'|'attention'|'quote'='message';
 const finish=async(payload:{reply:string;handoff?:boolean;products?:unknown[]})=>{if(stored){if(payload.handoff)payload.reply=payload.reply.replace('Todavía no se envió una solicitud al equipo desde este chat.','La consulta quedó en la bandeja del equipo.').replace('El equipo confirma el precio final y la entrega por WhatsApp.','El equipo confirmará el precio final y la entrega por acá.').replace('Podés continuar por WhatsApp para que revisemos el estado.','El equipo revisará tu consulta y te responderá por acá.');if(payload.handoff&&notificationKind!=='quote')notificationKind='attention';const sent=await publish(stored.id,payload.reply,{products:payload.products||[],handoff:payload.handoff||false},payload.handoff||false);return NextResponse.json({...payload,pending:!sent,...await customerConversation(key)},{headers:{'Server-Timing':`app;dur=${Math.round(performance.now()-started)}`}});}return NextResponse.json(payload,{headers:{'Server-Timing':`app;dur=${Math.round(performance.now()-started)}`}});};
 try {
  const body=await request.json();
  const message=typeof body.message==='string'?body.message.trim():'';
  if(message.length>2000) return NextResponse.json({message:'El mensaje puede tener hasta 2.000 caracteres.'},{status:400});
  const image=typeof body.image_url==='string'?body.image_url:'';
  const audio=typeof body.audio_data==='string'?body.audio_data:'';
  if ((!message&&!image&&!audio)||image.length>2800000||audio.length>2800000||(image&&!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image))||(audio&&!/^data:audio\/[a-z0-9.+-]+(?:;codecs=[a-z0-9.,-]+)?;base64,[A-Za-z0-9+/=]+$/i.test(audio))) return NextResponse.json({message:'Enviá texto o un archivo válido de hasta 2 MB.'},{status:400});
  let history:Turn[]=Array.isArray(body.history)?body.history.slice(-12).filter((m:Turn)=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').map((m:Turn)=>({role:m.role,text:m.text.slice(0,4000)})):[];
  if(storageConfigured()) { key=typeof body.session_id==='string'?body.session_id:'';stored=await receive(key,message||(image?'Imagen enviada':'Nota de voz'),typeof body.message_id==='string'?body.message_id:crypto.randomUUID(),{image:image||undefined,audio:audio||undefined});if(!stored.duplicate){const conversationId=stored.id;notificationKind=/cotiz|presupuesto|precio confirmado|quiero continuar con esta compra/i.test(message)?'quote':!stored.auto_enabled?'attention':'message';after(async()=>{try{const result=await notifyOperator(conversationId,notificationKind);if(result.failed)console.error('Operator push delivery incomplete');}catch{console.error('Operator push delivery failed');}});}if(stored.duplicate||!stored.auto_enabled)return NextResponse.json({reply:'',pending:true,...await customerConversation(key)});const snapshot=await customerConversation(key);history=snapshot.messages.slice(0,-1).slice(-12).map((m:{role:string;text:string})=>({role:m.role==='operator'?'assistant':m.role,text:m.text})); }
  const custom=process.env.TRAELA_CHAT_WEBHOOK_URL;
  if(audio&&!message&&!custom&&stored)return await finish({reply:'Recibimos tu nota de voz. El equipo la revisará y te responderá por acá.',handoff:true});
  if(audio&&!message&&!custom) return NextResponse.json({message:'La transcripción de notas de voz todavía no está conectada. Escribí tu consulta o mandanos el audio por WhatsApp.'},{status:422});
  const searchQuery=resolveSearchQuery(message,history);
  const approved=!image&&!audio&&searchQuery===message?approvedReply(message,history):null;
  if(approved) return await finish(approved);
  if(custom){
   const upstream=await fetch(custom,{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',signal:AbortSignal.timeout(28000),body:JSON.stringify({message,query:message,image_url:image,audio_data:audio,history,system_prompt:operatingRules,session_id:typeof body.session_id==='string'?body.session_id.slice(0,100):crypto.randomUUID(),locale:'es-PY',currency:'PYG'})});
   if(!upstream.ok)throw new Error('Conversation provider unavailable');
   const data=await upstream.json();const reply=data.reply||data.output||data.message;
   if(typeof reply!=='string'||!reply.trim())throw new Error('Invalid conversation response');
   return await finish({reply,handoff:data.handoff===true});
  }
  const result=await searchProducts(searchQuery,image);
  const products=result.products.slice(0,5);
  const reply=products.length?'Encontré estas opciones ordenadas por coincidencia con tu búsqueda. Abrí una para ver sus detalles. El equipo confirma el precio final antes de comprar.':image?'No pude identificar una opción con esta imagen. ¿Podés agregar el nombre o la marca?':result.candidate_count?'Los resultados disponibles no coinciden con el modelo o la variante que pediste. Probá ajustar la búsqueda o pasanos un link.':'No encontré opciones. Probá con el nombre del producto, la marca o un link.';
  return await finish({reply,products,handoff:false});
 }catch{if(stored){try{return await finish({reply:'No pude completar la búsqueda ahora. El equipo revisará tu consulta y te responderá por acá.',handoff:true});}catch{}}return NextResponse.json({message:'No pudimos responder ahora. Intentá de nuevo o continuá por WhatsApp.'},{status:502});}
}
