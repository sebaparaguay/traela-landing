'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import './shop.css';
export default function Home(){
 const [query,setQuery]=useState('');const router=useRouter();
 return <main className="shop-home"><header className="shop-nav"><Link className="shop-wordmark" href="/">traela<span>✳</span></Link><Link href="/chat">Hablar con Traela ↗</Link></header><section className="shop-center"><div className="shop-kicker">TU NUEVA FORMA DE COMPRAR</div><h1>¿Qué estás<br/><em>buscando?</em></h1><p>Todo lo que querés, en un solo lugar. Encontralo, conocelo y compralo con Traela.</p><form className="shop-searchbox" onSubmit={e=>{e.preventDefault();if(query.trim().length>=2)router.push('/search?q='+encodeURIComponent(query.trim()));}}><span aria-hidden="true">⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscá cualquier producto..." aria-label="Buscar productos"/><button type="submit" disabled={query.trim().length<2}>Buscar ↗</button></form><div className="shop-examples"><span>Probá buscando</span>{['Nike Pegasus 41','Sony WH-1000XM6','Dyson Airwrap'].map(x=><button key={x} onClick={()=>router.push('/search?q='+encodeURIComponent(x))}>{x} ↗</button>)}</div></section><footer className="shop-home-footer"><span>Comprá como hablás.</span><span>Paraguay · Envío global</span></footer></main>
