import 'server-only';
import webpush from 'web-push';
import { db } from './conversation-store';

// Only official browser push services; never send a server request to a client-selected host.
export function validPushEndpoint(endpoint:string){
 try{const u=new URL(endpoint);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&(
 u.hostname==='fcm.googleapis.com'||u.hostname==='updates.push.services.mozilla.com'||u.hostname.endsWith('.push.services.mozilla.com')||u.hostname==='web.push.apple.com'||u.hostname.endsWith('.push.apple.com')||u.hostname==='wns2-pn1p.notify.windows.com'||u.hostname.endsWith('.notify.windows.com'));}catch{return false;}
}
export async function pushKeys(){
 const client=db();
 let {data,error}=await client.from('traela_push_config').select('public_key,private_key').eq('id',1).maybeSingle();
 if(error)throw new Error('Push storage unavailable');
 if(!data){const keys=webpush.generateVAPIDKeys();const result=await client.from('traela_push_config').upsert({id:1,public_key:keys.publicKey,private_key:keys.privateKey},{onConflict:'id',ignoreDuplicates:true});if(result.error)throw new Error('Push setup failed');({data,error}=await client.from('traela_push_config').select('public_key,private_key').eq('id',1).single());}
 if(error||!data)throw new Error('Push keys unavailable');return data;
}
export async function notifyOperator(conversationId:string,kind:'message'|'attention'|'quote',endpoint?:string){
 const client=db();let query=client.from('traela_push_subscriptions').select('endpoint,keys').eq('operator_email',process.env.TRAELA_OPERATOR_EMAIL!.toLowerCase());if(endpoint)query=query.eq('endpoint',endpoint);
 const {data,error}=await query;if(error)throw new Error('Push subscriptions unavailable');if(!data?.length)return {sent:0,failed:0};
 const keys=await pushKeys();const payload=JSON.stringify({title:kind==='quote'?'Nueva solicitud de cotización':kind==='attention'?'Una conversación necesita tu atención':'Nuevo mensaje en Traela',body:'Abrí tu consola para revisar y responder.',url:`/operator?conversation=${conversationId}`,tag:`traela-${conversationId}`});
 let sent=0,failed=0;
 await Promise.all(data.map(async subscription=>{if(!validPushEndpoint(subscription.endpoint)){failed++;return;}try{await webpush.sendNotification(subscription,payload,{TTL:3600,urgency:'high',timeout:8000,vapidDetails:{subject:`mailto:${process.env.TRAELA_OPERATOR_EMAIL}`,publicKey:keys.public_key,privateKey:keys.private_key}});sent++;}catch(e){failed++;const status=(e as {statusCode?:number}).statusCode;if(status===404||status===410)await client.from('traela_push_subscriptions').delete().eq('endpoint',subscription.endpoint);}}));
 return {sent,failed};
}
