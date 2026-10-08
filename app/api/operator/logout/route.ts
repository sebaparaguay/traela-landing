import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sameOrigin } from '../../../../lib/operator-auth';
export async function POST(request:Request){if(!sameOrigin(request))return NextResponse.json({},{status:403});(await cookies()).delete('traela_operator');return NextResponse.json({ok:true});}
