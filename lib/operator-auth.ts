import 'server-only';
import { cookies } from 'next/headers';
import { authClient,operatorConfigured } from './conversation-store';
export async function requireOperator(){if(!operatorConfigured())return false;const token=(await cookies()).get('traela_operator')?.value;if(!token)return false;const {data,error}=await authClient().auth.getUser(token);return !error&&data.user?.email?.toLowerCase()===process.env.TRAELA_OPERATOR_EMAIL?.toLowerCase();}
export function sameOrigin(request:Request){try{return new URL(request.headers.get('origin')||'').host===new URL(request.url).host;}catch{return false;}}
