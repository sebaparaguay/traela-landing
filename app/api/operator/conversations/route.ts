import { NextResponse } from 'next/server';
import { db,operatorConfigured } from '../../../../lib/conversation-store';
import { requireOperator } from '../../../../lib/operator-auth';
export async function GET(){if(!operatorConfigured())return NextResponse.json({configured:false},{status:503});if(!await requireOperator())return NextResponse.json({message:'Iniciá sesión.'},{status:401});const {data,error}=await db().from('traela_conversations').select('id,title,status,auto_enabled,quote_pyg,eta_start,eta_end,updated_at').order('updated_at',{ascending:false}).limit(200);return error?NextResponse.json({message:'No pudimos cargar la bandeja.'},{status:502}):NextResponse.json({conversations:data},{headers:{'Cache-Control':'no-store'}});}
