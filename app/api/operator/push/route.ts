import { NextResponse } from 'next/server';
import { db } from '../../../../lib/conversation-store';
import { requireOperator,sameOrigin } from '../../../../lib/operator-auth';
import { notifyOperator,pushKeys,validPushEndpoint } from '../../../../lib/push';
export const runtime='nodejs';
export async function GET(){
 if(!await requireOperator())return NextResponse.json({message:'Iniciá sesión.'},{status:401});
 try{const keys=await pushKeys();return NextResponse.json({publicKey:keys.public_key},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({message:'Las alertas todavía no están disponibles.'},{status:503});}
}
export async function POST(request:Request){
 if(!sameOrigin(request)||!await requireOperator())return NextResponse.json({message:'Acceso no permitido.'},{status:403});
 try{if(Number(request.headers.get('content-length')||0)>10000)throw new Error();const b=await request.json();const s=b.subscription;
 if(!s||typeof s.endpoint!=='string'||s.endpoint.length>2048||!validPushEndpoint(s.endpoint))throw new Error();
 const email=process.env.TRAELA_OPERATOR_EMAIL!.toLowerCase();
 if(b.action==='remove'){const {error}=await db().from('traela_push_subscriptions').delete().eq('endpoint',s.endpoint).eq('operator_email',email);if(error)throw error;return NextResponse.json({ok:true});}
 if(b.action==='test'){const result=await notifyOperator('test','message',s.endpoint);return NextResponse.json(result,{status:result.sent?200:502});}
 if(b.action!=='subscribe'||!s.keys||typeof s.keys.p256dh!=='string'||typeof s.keys.auth!=='string'||!/^[A-Za-z0-9_-]{80,100}$/.test(s.keys.p256dh)||!/^[A-Za-z0-9_-]{20,30}$/.test(s.keys.auth))throw new Error();
 const {error}=await db().from('traela_push_subscriptions').upsert({endpoint:s.endpoint,keys:{p256dh:s.keys.p256dh,auth:s.keys.auth},operator_email:email,updated_at:new Date().toISOString()},{onConflict:'endpoint'});if(error)throw error;return NextResponse.json({ok:true});
 }catch{return NextResponse.json({message:'No pudimos guardar las alertas. Intentá de nuevo.'},{status:400});}
}
