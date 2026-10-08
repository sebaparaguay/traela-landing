'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; text: string };
const welcome: Message = { role: 'assistant', text: 'Hola, soy Traela. ¿Qué querés comprar? Contame qué buscás o pegá un link.' };
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const session = useRef('');
  const bottom = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
    try {
      session.current = localStorage.getItem('traela_chat_session') || crypto.randomUUID();
      localStorage.setItem('traela_chat_session', session.current);
      const saved = JSON.parse(localStorage.getItem('traela_chat_messages') || 'null');
      if (Array.isArray(saved) && saved.length && saved.every(m => ['user', 'assistant'].includes(m.role) && typeof m.text === 'string')) setMessages(saved.slice(-100));
    } catch { session.current = crypto.randomUUID(); }
    setInput(new URLSearchParams(window.location.search).get('q')?.slice(0, 2000) || '');
    ready.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
    if (ready.current && messages.length > 1) try { localStorage.setItem('traela_chat_messages', JSON.stringify(messages.slice(-100))); } catch {}
  }, [messages, busy]);
  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: 'user', text }];
    setMessages(next); setInput(''); setBusy(true); setError('');
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, session_id: session.current, history: messages.slice(-12) }) });
      const data = await response.json();
      if (!response.ok || typeof data.reply !== 'string') throw new Error(data.message || 'No pudimos responder. Intentá de nuevo.');
      setMessages([...next, { role: 'assistant', text: data.reply }]);
    } catch (e) { setError(e instanceof Error ? e.message : 'No pudimos responder.'); setInput(text); }
    finally { setBusy(false); }
  }
  const whatsapp = `https://wa.me/595971255083?text=${encodeURIComponent('Hola Traela, quiero continuar esta consulta:\n' + messages.filter(m => m.role === 'user').slice(-3).map(m => m.text).join('\n'))}`;
  return <main className="mx-auto flex h-[100dvh] max-w-3xl flex-col bg-white">
    <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
      <Link href="/" aria-label="Volver a Traela"><img src="/traela-logo.png" alt="Traela" className="h-12 w-auto" /></Link>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-full bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700">Hablar con nosotros</a>
    </header>
    <section aria-label="Conversación" role="log" aria-live="polite" className="flex-1 overflow-y-auto px-5 py-6">
      <p className="mb-8 text-center text-xs text-slate-500">Tu agente personal de compras</p>
      {messages.map((message, i) => <div key={i} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-3xl px-5 py-3 text-[15px] leading-6 ${message.role === 'user' ? 'rounded-br-lg bg-gradient-to-r from-orange-500 to-fuchsia-600 text-white' : 'rounded-bl-lg bg-slate-100 text-slate-800'}`}>{message.text}</p></div>)}
      {busy && <p role="status" className="text-sm text-slate-500">Traela está buscando…</p>}
      <div ref={bottom} />
    </section>
    <footer className="shrink-0 border-t border-slate-100 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={e => { e.preventDefault(); void send(); }} className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2">
        <textarea aria-label="Tu mensaje" placeholder="Decí qué querés comprar…" value={input} maxLength={2000} rows={2} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); } }} className="max-h-40 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-base outline-none" />
        <button aria-label="Enviar mensaje" disabled={busy || !input.trim()} className="rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-600 px-5 py-3 font-semibold text-white disabled:opacity-40">Enviar</button>
      </form>
      <p className="mt-2 text-center text-[11px] text-slate-400">Confirmamos precio y entrega antes de comprar.</p>
    </footer>
  </main>;
}
