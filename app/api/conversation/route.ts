import { NextRequest,NextResponse } from 'next/server';
import { customerConversation,storageConfigured } from '../../../lib/conversation-store';
export async function GET(request:NextRequest){if(!storageConfigured())return NextResponse.json({enabled:false,messages:[]});try{const key=request.headers.get('x-conversation-key')||'';const data=await customerConversation(key);return NextResponse.json({enabled:true,...data},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({message:'No pudimos cargar la conversación.'},{status:400});}}
