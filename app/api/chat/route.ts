import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) {
      return NextResponse.json({ message: 'Escribí un mensaje de hasta 2.000 caracteres.' }, { status: 400 });
    }
    const history = Array.isArray(body.history) ? body.history.slice(-12).filter((m: {role?: string; text?: string}) => ['user', 'assistant'].includes(m.role || '') && typeof m.text === 'string').map((m: {role: string; text: string}) => ({role: m.role, text: m.text.slice(0, 4000)})) : [];
    const endpoint = process.env.TRAELA_CHAT_WEBHOOK_URL || 'https://traela.app.n8n.cloud/webhook/search';
    const upstream = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message.trim(), query: body.message.trim(), history, session_id: typeof body.session_id === 'string' ? body.session_id.slice(0, 100) : crypto.randomUUID(), locale: 'es-PY', currency: 'PYG' }),
      cache: 'no-store', signal: AbortSignal.timeout(25000),
    });
    if (!upstream.ok) throw new Error('Upstream unavailable');
    const data = await upstream.json();
    if (data.status === 'error') throw new Error('Upstream error');
    const directReply = data.reply || data.output || data.message;
    if (typeof directReply === 'string' && directReply.trim()) return NextResponse.json({ reply: directReply });
    const products = Array.isArray(data.products) ? data.products.slice(0, 3) : [];
    const reply = products.length ? 'Encontré estas opciones:\n\n' + products.map((p: {title?: string; traela_price_pyg?: number; pricing_status?: string; source_url?: string}, i: number) => `${i + 1}. ${p.title || 'Producto'}\n${typeof p.traela_price_pyg === 'number' && p.traela_price_pyg > 0 ? `Precio estimado: ₲${new Intl.NumberFormat('es-PY').format(p.traela_price_pyg)}` : 'Precio por confirmar'}`).join('\n\n') + '\n\nPara confirmar precio, disponibilidad y entrega, continuá con nosotros por WhatsApp.' : 'No encontré opciones para esa búsqueda. Probá con el nombre del producto, la marca o un link.';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ message: 'No pudimos responder ahora. Intentá de nuevo o continuá por WhatsApp.' }, { status: 502 });
  }
}
