import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
type Msg={role:"user"|"assistant";content:string};
export async function POST(req:NextRequest){
 const body=await req.json().catch(()=>null);
 const messages:Msg[]=Array.isArray(body?.messages)?body.messages.filter((m:Msg)=>["user","assistant"].includes(m?.role)&&typeof m.content==="string").slice(-12).map((m:Msg)=>({role:m.role,content:m.content.slice(0,3000)})):[];
 if(!messages.length)return NextResponse.json({error:"INVALID_MESSAGES"},{status:400});
 const key=process.env.AI_GATEWAY_API_KEY;
 const oidc=process.env.VERCEL_OIDC_TOKEN;
 if(!key&&!oidc)return NextResponse.json({error:"AI_NOT_CONFIGURED",message:"La inteligencia artificial todavía no está configurada."},{status:503});
 const model=process.env.AI_GATEWAY_MODEL;\n if(!model)return NextResponse.json({error:"MODEL_NOT_CONFIGURED",message:"Configurá AI_GATEWAY_MODEL con un identificador válido de Vercel AI Gateway."},{status:503});
 try{
 const res=await fetch("https://ai-gateway.vercel.sh/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+(key||oidc)},body:JSON.stringify({model,max_tokens:650,messages:[{role:"system",content:"Sos Traela, un comprador personal experto para clientes de Paraguay. Usá español paraguayo con voseo, claridad y calidez. Entendé primero el uso, presupuesto, restricciones y prioridades. Hacé como máximo dos preguntas relevantes por turno. Explicá ventajas y compromisos honestamente. Nunca inventes precios, disponibilidad, opiniones verificadas ni fechas de entrega. No afirmes que investigaste productos en vivo si no recibiste resultados de una herramienta. No ejecutes compras ni prometas cotizaciones finales. Sé conciso."},...messages]}),signal:AbortSignal.timeout(25000)});
 const json=await res.json();
 if(!res.ok)return NextResponse.json({error:"AI_UNAVAILABLE",message:"No se pudo consultar al asistente."},{status:502});
 const answer=json.choices?.[0]?.message?.content;
 if(typeof answer!=="string")throw Error("No content");
 return NextResponse.json({answer,model});
 }catch{return NextResponse.json({error:"AI_TIMEOUT",message:"El asistente no respondió. Intentá de nuevo."},{status:504})}
}