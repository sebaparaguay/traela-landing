'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import './product.css';

const catalog: Record<string,{brand:string;name:string;tagline:string;image:string;highlights:string[];bestFor:string;consider:string;specs:[string,string][]}> = {
 'nike-pegasus-41': {
 brand:'Nike',name:'Pegasus 41',tagline:'Tus kilómetros de todos los días, con otra energía.',
 image:'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9e83b3f7-c5e4-4fa5-b6c9-51e56bb7b77b/pegasus-41-road-running-shoes.png',
 highlights:['Amortiguación ReactX y unidades Air Zoom','Diseñadas para entrenamiento diario','Capellada de malla transpirable'],
 bestFor:'Personas que buscan una zapatilla versátil para correr o caminar todos los días.',
 consider:'Si buscás una zapatilla de competición muy liviana o una pisada extremadamente suave, compará otras opciones.',
 specs:[['Categoría','Running diario'],['Amortiguación','ReactX + Air Zoom'],['Uso','Asfalto y superficies urbanas'],['Marca','Nike']]
 }
};
function ProductView(){
 const params=useSearchParams();
 const slug=params.get('id')||'nike-pegasus-41';
 const item=catalog[slug];
 const [question,setQuestion]=useState('');
 const [imageFailed,setImageFailed]=useState(false);
 if(!item)return <main className="pdp-shell"><Link href="/chat">← Volver al chat</Link><h1>Producto no disponible</h1><p>Este producto todavía no tiene una ficha verificada.</p></main>;
 const prompt=(text:string)=>'/chat?message='+encodeURIComponent(text);
 return <main className="pdp">
 <header className="pdp-top"><Link href="/" className="pdp-logo">Traela<span>✳</span></Link><Link href="/chat" className="pdp-back">← Volver al chat</Link></header>
 <div className="pdp-shell">
 <nav className="pdp-crumb"><Link href="/chat">Descubrir</Link><span>/</span>{item.brand}<span>/</span>{item.name}</nav>
 <section className="pdp-hero">
 <div className="pdp-photo">{!imageFailed?<img src={item.image} alt={item.name} onError={()=>setImageFailed(true)}/>:<div className="pdp-photo-fallback">Imagen no disponible</div>}<span className="pdp-photo-note">Imagen de referencia · Confirmá color y variante antes de comprar</span></div>
 <div className="pdp-intro"><span className="pdp-eyebrow">{item.brand} / RUNNING</span><h1>{item.name}</h1><p className="pdp-tagline">{item.tagline}</p><p className="pdp-summary">Un clásico para el movimiento diario. Descubrí sus ventajas, limitaciones y si realmente encaja con lo que buscás.</p><div className="pdp-price"><span>Precio final en Paraguay</span><strong>A confirmar</strong><small>Te cotizamos en guaraníes, con envío global y gestión incluidos.</small></div><Link className="pdp-primary" href={prompt('Quiero cotizar las '+item.brand+' '+item.name+'. ¿Cuál es el precio final en guaraníes y la fecha estimada de entrega?')}>Consultar precio final <span>↗</span></Link><p className="pdp-fine">La compra se confirma únicamente después de recibir una cotización y disponibilidad verificadas.</p></div>
 </section>
 <section className="pdp-section"><div className="pdp-section-heading"><span>01 / LO ESENCIAL</span><h2>Lo que importa.<br/><em>Sin vueltas.</em></h2></div><div className="pdp-features">{item.highlights.map((h,i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3></article>)}</div></section>
 <section className="pdp-verdict"><div><span className="pdp-eyebrow">EL CRITERIO DE TRAELA</span><h2>¿Es para vos?</h2><p>No se trata de venderte cualquier producto. Se trata de encontrar el indicado.</p></div><div className="pdp-verdict-cards"><article><span>✓ IDEAL SI...</span><p>{item.bestFor}</p></article><article><span>↗ TENÉ EN CUENTA</span><p>{item.consider}</p></article></div></section>
 <section className="pdp-section pdp-spec-section"><div className="pdp-section-heading"><span>02 / DETALLES</span><h2>Todos los datos.<br/><em>Bien claros.</em></h2></div><div className="pdp-specs">{item.specs.map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div></section>
 <section className="pdp-ask"><span className="pdp-eyebrow">TRAELA ESTÁ PARA AYUDARTE</span><h2>Una pregunta puede<br/>cambiar tu elección.</h2><p>Compará alternativas, consultá por talles o pedí una recomendación personalizada.</p><form onSubmit={e=>{e.preventDefault();if(question.trim())window.location.href=prompt('Sobre '+item.brand+' '+item.name+': '+question.trim());}}><input aria-label="Preguntale a Traela" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="¿Es mejor que otra opción?"/><button type="submit" disabled={!question.trim()} aria-label="Enviar pregunta">↑</button></form><Link href={prompt('Compará las Nike Pegasus 41 con las Nike Vomero 18 para correr 5 km.')}>Ejemplo: Comparar con Vomero 18 ↗</Link></section>
 </div><footer className="pdp-footer"><Link href="/">Traela ✳</Link><span>Comprá como hablás.</span><Link href="/chat">Volver al chat ↗</Link></footer>
 </main>
}
export default function ProductPage(){return <Suspense fallback={<main className="pdp-shell">Cargando producto…</main>}><ProductView/></Suspense>}
