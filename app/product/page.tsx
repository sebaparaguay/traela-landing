'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Suspense,useEffect,useState} from 'react';
import {safeUrl,type Product} from '../../lib/product-search';
import {recalledProduct,rememberProduct} from '../../lib/product-session';
import './product.css';
function Photo({src,title}:{src:string;title:string}){
 const [failed,setFailed]=useState(false);
 return src&&!failed?<img src={src} alt={title} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<div className="detail-no-photo"><span aria-hidden="true">⌕</span>Imagen no disponible</div>;
}
function ProductView(){
 const params=useSearchParams(),id=params.get('id')||'',q=params.get('q')||'';
 const [product,setProduct]=useState<Product|null>(null),[error,setError]=useState(''),[image,setImage]=useState(0),[variant,setVariant]=useState(''),[question,setQuestion]=useState('');
 useEffect(()=>{
  let active=true;const controller=new AbortController();
  setProduct(null);setError('');setImage(0);setVariant('');setQuestion('');
  const snapshot=recalledProduct(id,q);
  if(snapshot){setProduct(snapshot);return()=>controller.abort();}
  if(!q){setError('Esta ficha no está guardada en este navegador. Abrí el producto desde una nueva búsqueda.');return()=>controller.abort();}
  async function restore(){try{
   const response=await fetch('/api/product?'+new URLSearchParams({id,q}),{signal:controller.signal});const data=await response.json();
   if(!response.ok)throw new Error(data.message||'No pudimos abrir el producto.');
   if(active){setProduct(data.product);rememberProduct(data.product);}
  }catch(e){if(active&&!controller.signal.aborted)setError(e instanceof Error?e.message:'No pudimos abrir el producto.');}}
  void restore();return()=>{active=false;controller.abort();};
 },[id,q]);
 const chat=(message:string)=>'/chat?q='+encodeURIComponent(message.slice(0,2000));
 return <div className="detail-app">
  <header className="detail-header"><Link href="/chat" className="detail-brand">Traela<span>.</span></Link><Link className="detail-help" href="/chat?q=Necesito ayuda para elegir un producto">Hablá con Traela ↗</Link></header>
  <main id="main" className="detail-main">
   <Link href="/chat" className="detail-back">← Volver a mis resultados</Link>
   {error?<section className="detail-state" role="alert"><h1>Volvamos a encontrarlo.</h1><p>{error}</p><Link href={chat(q)}>Buscar de nuevo ↗</Link></section>:!product?<section className="detail-state" role="status"><span className="detail-loader"/><h1>Preparando tu producto…</h1><p>Recuperamos la publicación y sus detalles.</p></section>:<>
    <section className="detail-hero">
     <div className="detail-gallery"><div className="detail-image"><span className="detail-found">ENCONTRADO PARA VOS</span><Photo key={product.id+'-'+image} src={safeUrl(product.images?.[image]||product.image_url)} title={product.title}/><span className="detail-image-note">Imagen de la publicación · Confirmá la variante antes de comprar</span></div>{product.images?.length>1&&<div className="detail-thumbnails" aria-label="Imágenes del producto">{product.images.map((src,i)=><button key={src} onClick={()=>setImage(i)} aria-label={'Ver imagen '+(i+1)} aria-pressed={image===i}><img src={safeUrl(src)} alt=""/></button>)}</div>}<div className="detail-assurances"><span>Envío global a Paraguay</span><span>Una sola cotización</span></div></div>
     <div className="detail-overview"><p className="detail-kicker">{product.source||'TU PRÓXIMO DESCUBRIMIENTO'}</p><h1>{product.title}</h1>{product.rating!==null&&<p className="detail-rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)} / 5 {product.reviews!==null&&<span>· {product.reviews.toLocaleString('es-PY')} valoraciones de la publicación</span>}</p>}<p className="detail-intro">Lo que buscabas, un paso más cerca. Traela confirma los detalles y coordina la compra hasta Paraguay.</p>
      <div className="detail-price"><span>Precio final en guaraníes</span><strong>Vamos a cotizarlo.</strong><p>Producto, envío global, gestión y entrega en un solo precio, revisado por el equipo.</p></div>
      <label htmlFor="variant">Tu talle, color o variante <span>Opcional</span></label><input id="variant" value={variant} maxLength={200} onChange={e=>setVariant(e.target.value)} placeholder="Ej.: talle 42, color negro"/>
      <Link className="detail-primary" href={chat('Quiero cotizar: '+product.title+(variant?'. Variante solicitada: '+variant:'')+(product.source_url?'. Publicación: '+product.source_url:'')+'. Confirmemos disponibilidad, precio final y entrega.')}>Comprar con Traela <span>↗</span></Link><p className="detail-fine">Primero recibís la cotización. Después decidís si comprar.</p>
     </div>
    </section>
    <nav className="detail-nav" aria-label="Información del producto"><a href="#eleccion">Tu elección</a><a href="#datos">Detalles</a><a href="#preguntas">Preguntale a Traela</a></nav>
    <section id="eleccion" className="detail-section"><div className="detail-heading"><p className="detail-kicker">UNA ELECCIÓN CON CRITERIO</p><h2>¿Por qué aparece en tu búsqueda?</h2><p>Priorizamos la coincidencia con lo que pediste. No es una evaluación independiente de calidad.</p></div><div className="detail-reasons">{product.match_reasons.map((r,i)=><article key={r}><span>0{i+1}</span><h3>{r}</h3></article>)}</div></section>
    {(product.description||product.highlights.length>0)&&<section className="detail-section detail-description"><h2>Lo que dice la publicación.</h2>{product.description&&<p>{product.description}</p>}{product.highlights.length>0&&<ul>{product.highlights.map(h=><li key={h}>{h}</li>)}</ul>}<small>Información del proveedor. La revisamos antes de confirmar la compra.</small></section>}
    <section id="datos" className="detail-section detail-specs"><div className="detail-heading"><h2>Todo claro.<br/>Antes de comprar.</h2><p>Sin dar por hecho lo que todavía falta confirmar.</p></div><dl><div><dt>Publicación</dt><dd>{product.title}</dd></div><div><dt>Fuente</dt><dd>{product.source||'A verificar'}</dd></div><div><dt>Condición indicada</dt><dd>{product.condition||'No especificada por la búsqueda'}</dd></div><div><dt>Variante y disponibilidad</dt><dd>A confirmar con el vendedor</dd></div><div><dt>Entrega en Paraguay</dt><dd>Ventana estimada al cotizar</dd></div><div><dt>Cambios y devoluciones</dt><dd>Condiciones a confirmar antes de pagar</dd></div>{product.source_url&&<div><dt>Referencia</dt><dd><a href={safeUrl(product.source_url)} target="_blank" rel="noopener noreferrer">Ver publicación original ↗</a></dd></div>}</dl></section>
    <section id="preguntas" className="detail-ask"><span className="detail-ask-icon" aria-hidden="true">✳</span><h2>Una pregunta puede cambiar tu elección.</h2><p>Compará alternativas o contanos para qué lo necesitás.</p><form onSubmit={e=>{e.preventDefault();if(question.trim())window.location.href=chat('Sobre '+product.title+': '+question.trim());}}><label className="detail-sr" htmlFor="question">Tu pregunta sobre este producto</label><input id="question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} placeholder="¿Qué debería tener en cuenta?"/><button disabled={!question.trim()} aria-label="Llevar pregunta al chat">↑</button></form><div className="detail-quick">{['Quiero comparar alternativas','Necesito confirmar el talle','¿Cuándo podría recibirlo?'].map(t=><Link key={t} href={chat('Sobre '+product.title+': '+t)}>{t} ↗</Link>)}</div></section>
   </>}
  </main><footer className="detail-footer"><span>Compra como hablás.</span><Link href="/chat">Seguir buscando ↗</Link><a href="/terminos.html">Términos</a></footer>
 </div>;
}
export default function ProductPage(){return <Suspense fallback={<main className="detail-state" role="status">Preparando producto…</main>}><ProductView/></Suspense>;}
