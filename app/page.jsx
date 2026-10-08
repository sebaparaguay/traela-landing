'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import './landing.css';

function Brand({small=false}) { return <span className={`landing-brand ${small ? 'small' : ''}`}><span className="brand-symbol"><Image src="/favicon.png" alt="" width={64} height={64}/></span><span>Traela</span></span>; }
function Start({dark=false}) {return <Link className={`start-button ${dark ? 'dark' : ''}`} href="/chat"><span className="button-chat" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" fill="currentColor"/><path d="M7 11h7M7 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></span>Empezar a comprar<svg className="button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>;}
const questions = [
 ['¿Qué hace Traela?', 'Nos contás qué querés comprar. Buscamos opciones, confirmamos el precio final y coordinamos la compra y la entrega en Paraguay.'],
 ['¿Necesito tener un link?', 'No. Podés describir lo que buscás o pegar un link en el chat. Si querés enviarnos una foto, continuá con nosotros por WhatsApp.'],
 ['¿Cómo sé cuánto voy a pagar?', 'Antes de comprar confirmamos un único precio final en guaraníes, con el producto, el envío global, nuestra gestión y la entrega incluidos. Los precios del chat son estimados hasta esa confirmación.'],
 ['¿Cómo pago?', 'Por transferencia bancaria, después de confirmar el resumen de tu compra.'],
 ['¿Cuándo llega mi pedido?', 'Antes de confirmar te indicamos una ventana estimada de entrega según el producto y su origen. Te mantenemos al tanto durante el proceso.'],
];
export default function Landing() {
 const [muted,setMuted] = useState(true);
 return <main className="persona-landing">
  <section className="landing-hero" id="inicio" aria-labelledby="hero-title">
   <div className="hero-demo" aria-label="Ejemplo ilustrativo de una conversación con Traela">
    <div className="demo-glow glow-orange"/><div className="demo-glow glow-pink"/>
    <div className="phone">
     <div className="phone-top"><span>9:41</span><span className="phone-island"/><span aria-hidden="true">▮▮▮ ▰</span></div>
     <div className="phone-header"><span aria-hidden="true">‹</span><div><Brand small/><p>Tu agente de compras</p></div><span aria-hidden="true">···</span></div>
     <div className="demo-messages"><p className="demo-day">Ejemplo de conversación</p><div className="demo-bubble incoming bubble-one">Hola, soy Traela.<br/>¿Qué querés comprar?</div><div className="demo-bubble outgoing bubble-two">Busco unos auriculares para trabajar.</div><div className="demo-bubble incoming bubble-three">Dale. ¿Preferís inalámbricos? ¿Tenés un presupuesto en mente?</div><div className="demo-bubble outgoing bubble-four">Sí, inalámbricos. Hasta ₲800.000.</div><div className="demo-bubble incoming bubble-five">Perfecto. Busquemos una buena opción para vos.</div></div>
     <div className="demo-composer"><span aria-hidden="true">+</span><span>Decí qué querés…</span><span className="demo-send" aria-hidden="true">↑</span></div><div className="phone-bottom"/>
    </div>
   </div>
   <div className="hero-copy"><Brand/><h1 id="hero-title">Tu agente personal<br className="desktop-break"/> de compras.</h1><p className="hero-description">Compra lo que quieras.<br/>Empezá con una conversación.</p><Start/><a className="quiet-link" href="#como-funciona">Conocé cómo funciona <span aria-hidden="true">↓</span></a></div>
   <a className="hero-scroll" href="#como-funciona" aria-label="Ver cómo funciona"><span/>Seguí descubriendo</a>
  </section>
  <section className="intro-section" id="como-funciona" aria-labelledby="intro-title"><p className="eyebrow">COMPRA COMO HABLÁS</p><h2 id="intro-title">Vos decís qué querés.<br/><span>Nosotros hacemos el resto.</span></h2><p className="section-description">De la primera pregunta a la puerta de tu casa.</p>
   <div className="intro-video"><video src="/videos/traela-intro.mp4" autoPlay muted={muted} loop playsInline controls preload="metadata" aria-label="Video introductorio de Traela"/><button onClick={()=>setMuted(!muted)} className="sound-button">{muted ? 'Activar sonido' : 'Silenciar'}</button></div>
   <div className="steps">{[['01','Contanos.','Describí lo que buscás o pegá un link. Empezamos por lo que necesitás.'],['02','Elegí tranquilo.','Te ayudamos a comparar y confirmamos el precio final en guaraníes.'],['03','Recibilo.','Coordinamos la compra y la entrega. Te acompañamos hasta que llegue.']].map(([n,t,d])=><article key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
  </section>
  <section className="clarity-section" aria-labelledby="clarity-title"><div><p className="eyebrow">SIN VUELTAS</p><h2 id="clarity-title">Comprar debería<br/>ser así de simple.</h2></div><div className="clarity-items">{[['Un solo precio.','En guaraníes y con todo incluido. Lo confirmamos antes de comprar.'],['Una conversación.','Desde encontrar lo que querés hasta coordinar tu entrega.'],['Alguien de tu lado.','Si necesitás ayuda, podés seguir hablando con nosotros por WhatsApp.']].map(([t,d])=><article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className="faq-section" aria-labelledby="faq-title"><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2 id="faq-title">Todo claro.<br/>Desde el principio.</h2><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
  <section className="closing-section"><Brand/><h2>¿Qué querés<br/>comprar hoy?</h2><Start dark/><p>Precios en guaraníes. Pago vía transferencia bancaria.</p></section>
  <footer className="landing-footer"><div className="footer-box"><div className="footer-about"><Brand small/><h3>Compra como hablás.</h3><p>Tu agente personal de compras.<br/>Hecho para Paraguay.</p><Start dark/></div><div className="footer-links"><h4>Traela</h4><Link href="/chat">Empezar a comprar</Link><a href="#como-funciona">Cómo funciona</a><a href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href="https://instagram.com/traela.app" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div className="footer-links"><h4>Información</h4><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Términos</a><a href="/eliminacion-datos.html">Eliminación de datos</a></div><p className="footer-copyright">© {new Date().getFullYear()} Traela. Todos los derechos reservados.</p></div><div className="footer-wordmark" aria-hidden="true">Traela</div></footer>
 </main>;
}
