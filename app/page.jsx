'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import './landing.css';

function Brand({small=false}) { return <span className={`landing-brand ${small ? 'small' : ''}`}><span className="brand-symbol"><Image src="/traela-logo-new.svg" alt="" width={64} height={64}/></span><span>Traela</span></span>; }
function Start({dark=false}) {return <Link className={`start-button ${dark ? 'dark' : ''}`} href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer"><span className="button-chat" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" fill="currentColor"/><path d="M7 11h7M7 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></span>Empezar a comprar<svg className="button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>;}
const questions = [
 ['¿Qué hace Traela?', 'Nos contás qué querés comprar. Buscamos opciones, confirmamos el precio final y coordinamos la compra y la entrega en Paraguay.'],
 ['¿Necesito tener un link?', 'No. Podés describir lo que buscás o pegar un link en el chat. Si querés enviarnos una foto, continuá con nosotros por WhatsApp.'],
 ['¿Cómo sé cuánto voy a pagar?', 'Antes de comprar confirmamos un único precio final en guaraníes, con el producto, el envío global, nuestra gestión y la entrega incluidos. Los precios del chat son estimados hasta esa confirmación.'],
 ['¿Cómo pago?', 'Por transferencia bancaria, después de confirmar el resumen de tu compra.'],
 ['¿Cuándo llega mi pedido?', 'Antes de confirmar te indicamos una ventana estimada de entrega según el producto y su origen. Te mantenemos al tanto durante el proceso.'],
];
function StepArt({number}){return <div className={"step-art step-art-"+number} aria-hidden="true"><svg viewBox="0 0 320 220" fill="none"><defs><linearGradient id={"grad"+number} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff7939"/><stop offset=".5" stopColor="#ff008b"/><stop offset="1" stopColor="#bd00e8"/></linearGradient></defs>{number==="01"?<><rect x="45" y="30" width="230" height="160" rx="25" fill="#2b0924" stroke="#a82c72" strokeWidth="3"/><rect x="65" y="50" width="130" height="18" rx="9" fill="#9e315f"/><rect x="65" y="83" width="170" height="53" rx="18" fill={"url(#grad"+number+")"}/><path d="M85 103h125m-125 16h88" stroke="white" strokeWidth="5" strokeLinecap="round"/><rect x="115" y="150" width="125" height="19" rx="9" fill="#703353"/><circle cx="258" cy="159" r="29" fill="#ffc400"/><path d="m245 159 10 10 19-23" stroke="#46112c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/></>:number==="02"?<><rect x="28" y="45" width="126" height="132" rx="20" fill="#2b0924" stroke="#a82c72" strokeWidth="3"/><rect x="166" y="45" width="126" height="132" rx="20" fill="#2b0924" stroke="#a82c72" strokeWidth="3"/><path d="M56 112q20-42 43-18l28 20 12 2-8 20H51z" fill={"url(#grad"+number+")"}/><path d="m75 101 14 10m-5-18 14 10" stroke="#ffd7e7" strokeWidth="4"/><rect x="180" y="80" width="98" height="55" rx="12" fill={"url(#grad"+number+")"}/><path d="M195 99h68m-68 15h43" stroke="white" strokeWidth="5" strokeLinecap="round"/><circle cx="160" cy="159" r="32" fill="#ffc400"/><path d="m146 159 10 10 22-24" stroke="#46112c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/></>:<><path d="m77 86 82-40 84 40-84 42z" fill={"url(#grad"+number+")"}/><path d="M77 86v74l82 41v-73z" fill="#df008c"/><path d="M243 86v74l-84 41v-73z" fill="#900078"/><path d="m116 67 85 41v28" stroke="#ffbadc" strokeWidth="7"/><circle cx="244" cy="54" r="32" fill="#ffc400"/><path d="m230 54 10 10 21-24" stroke="#46112c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/><path d="m40 63 15-14m-15 37H23m230 95 15 14" stroke="#ff9a3d" strokeWidth="5" strokeLinecap="round"/></>}</svg></div>}
export default function Landing() {
 const [muted,setMuted] = useState(true);
 const [navOpen,setNavOpen] = useState(false);
 const [heroMode,setHeroMode] = useState('chat');
 return <main className="persona-landing">
  <header className="site-nav"><div className="site-nav-inner"><a className="site-nav-brand" href="#inicio" aria-label="Traela — inicio" onClick={()=>setNavOpen(false)}><Image src="/traela-logo-new.svg" alt="" width={37} height={37}/><span>Traela</span></a><nav className={`site-nav-links ${navOpen?'is-open':''}`} aria-label="Navegación principal"><a href="#como-funciona" onClick={()=>setNavOpen(false)}>Cómo funciona</a><a href="#experiencia-real" onClick={()=>setNavOpen(false)}>Experiencia real</a><a href="#preguntas-frecuentes" onClick={()=>setNavOpen(false)}>Preguntas frecuentes</a><a className="site-nav-mobile-cta" href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer" onClick={()=>setNavOpen(false)}>Empezar a comprar ↗</a></nav><a className="site-nav-cta" href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer">Empezar a comprar <span aria-hidden="true">↗</span></a><button className="site-nav-toggle" type="button" aria-label={navOpen?'Cerrar menú':'Abrir menú'} aria-expanded={navOpen} onClick={()=>setNavOpen(!navOpen)}><span/><span/><span/></button></div></header>

  <section className="landing-hero" id="inicio" aria-labelledby="hero-title">
   <div className="hero-demo" aria-label="Tres maneras de comprar con Traela: mensaje, imagen o nota de voz">
    <div className="demo-glow glow-orange"/><div className="demo-glow glow-pink"/>
    <div className="shopping-preview" key={heroMode}>
      <div className="preview-heading"><span className="preview-avatar"><Image src="/traela-logo-new.svg" alt="" width={38} height={38}/></span><span className="preview-heading-copy"><strong>Tu Traela</strong><small>Tu comprador personal con IA</small></span><span className="preview-online"><span/> A tu lado</span></div>
      {heroMode==='chat'?<div className="preview-content"><span className="preview-overline">COMPRÁ CON UN MENSAJE</span><div className="preview-message preview-user">Busco unos auriculares inalámbricos para trabajar. Hasta ₲800.000.</div><div className="preview-message preview-assistant"><span className="preview-sparkle">✦</span><span>Perfecto. Te ayudo a encontrar una buena opción, comparar alternativas y confirmar el precio final en guaraníes.</span></div><div className="preview-action"><span className="preview-check">✓</span><span><strong>Una compra, sin vueltas.</strong><small>Te acompañamos hasta recibirla.</small></span></div></div>:heroMode==='image'?<div className="preview-content"><span className="preview-overline">COMPRÁ CON UNA FOTO O CAPTURA</span><div className="preview-message preview-user preview-media-message"><div className="preview-screenshot" aria-label="Captura ilustrativa de zapatillas"><div className="screenshot-toolbar"><span>⌁</span><span>CAPTURA DE PANTALLA</span><span>•••</span></div><div className="screenshot-product"><span aria-hidden="true">👟</span></div><div className="screenshot-lines"><i/><i/><i/></div></div><span>¿Me conseguís estas zapatillas?</span></div><div className="preview-message preview-assistant"><span className="preview-sparkle">✦</span><span>¡Claro! Busco el modelo, reviso opciones y te confirmo el precio final en guaraníes.</span></div><div className="preview-action"><span className="preview-check">✓</span><span><strong>Mostranos lo que viste.</strong><small>No necesitás saber el nombre.</small></span></div></div>:<div className="preview-content"><span className="preview-overline">COMPRÁ CON UNA NOTA DE VOZ</span><div className="preview-message preview-user preview-media-message"><div className="preview-voice-note"><span className="voice-play">▶</span><span className="voice-wave" aria-hidden="true">{[10,19,12,25,16,31,22,13,28,18,10,23,14,27,18,11,20,12].map((h,i)=><i key={i} style={{height:h}}/>)}</span><span className="voice-time">0:18</span></div><span className="voice-transcript">“Necesito un regalo para mi hermano. Le gusta la tecnología y tengo ₲500.000.”</span></div><div className="preview-message preview-assistant"><span className="preview-sparkle">✦</span><span>¡Entendido! Te ayudo a elegir un buen regalo dentro de tu presupuesto.</span></div><div className="preview-action"><span className="preview-check">✓</span><span><strong>Hablá como hablás.</strong><small>Traela entiende lo que buscás.</small></span></div></div>}
      <div className="preview-footer"><span>{heroMode==='image'?'Mandanos una foto o captura':heroMode==='voice'?'Contanos con tu voz':'¿Qué querés comprar hoy?'}</span><span className="preview-arrow">↗</span></div>
    </div>
    <span className="preview-floating-label">{heroMode==='chat'?'Pedí lo que quieras':heroMode==='image'?'De una captura a tu compra':'Tu voz, tu compra'} <span>✦</span></span>
    <div className="hero-mode-tabs" role="group" aria-label="Elegí cómo pedir"><button type="button" aria-pressed={heroMode==='chat'} className={heroMode==='chat'?'active':''} onClick={()=>setHeroMode('chat')}>✦ Mensaje</button><button type="button" aria-pressed={heroMode==='image'} className={heroMode==='image'?'active':''} onClick={()=>setHeroMode('image')}>▧ Imagen</button><button type="button" aria-pressed={heroMode==='voice'} className={heroMode==='voice'?'active':''} onClick={()=>setHeroMode('voice')}>◉ Voz</button></div>
   </div>
   <div className="hero-copy"><Brand/><h1 id="hero-title">Tu comprador personal<br className="desktop-break"/> con IA.</h1><p className="hero-description">Compra lo que quieras.<br/>Empezá con una conversación.</p><Start/><a className="quiet-link" href="#como-funciona">Conocé cómo funciona <span aria-hidden="true">↓</span></a></div>
   <a className="hero-scroll" href="#como-funciona" aria-label="Ver cómo funciona"><span/>Seguí descubriendo</a>
  </section>
  <section className="intro-section" id="como-funciona" aria-labelledby="intro-title"><p className="eyebrow">COMPRA COMO HABLÁS</p><h2 id="intro-title">Vos decís qué querés.<br/><span>Nosotros hacemos el resto.</span></h2><p className="section-description">De la primera pregunta a la puerta de tu casa.</p>
   <div className="intro-video"><video src="/videos/traela-intro.mp4" autoPlay muted={muted} loop playsInline controls preload="metadata" aria-label="Video introductorio de Traela"/><button onClick={()=>setMuted(!muted)} className="sound-button">{muted ? 'Activar sonido' : 'Silenciar'}</button></div>
   <div className="steps">{[['01','Contanos.','Describí lo que buscás o pegá un link. Empezamos por lo que necesitás.'],['02','Elegí tranquilo.','Te ayudamos a comparar y confirmamos el precio final en guaraníes.'],['03','Recibilo.','Coordinamos la compra y la entrega. Te acompañamos hasta que llegue.']].map(([n,t,d])=><article key={n}><StepArt number={n}/><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
  </section>
  <section className="clarity-section" aria-labelledby="clarity-title">
    <div className="clarity-intro">
      <p className="eyebrow">SIN VUELTAS. SIN SORPRESAS.</p>
      <h2 id="clarity-title">Comprar afuera.<br/><span>Sentirlo cerca.</span></h2>
      <p className="clarity-lede">Vos elegís lo que querés. Traela se ocupa de lo complicado, para que comprar sea la parte fácil.</p>
      <div className="clarity-benefits">
        <article><span className="clarity-icon" aria-hidden="true">₲</span><div><h3>Un precio. Todo claro.</h3><p>Te confirmamos el total en guaraníes antes de comprar. Sin sorpresas al final.</p></div></article>
        <article><span className="clarity-icon" aria-hidden="true">✦</span><div><h3>Menos buscar. Mejor elegir.</h3><p>Te ayudamos a encontrar y comparar opciones para decidir con confianza.</p></div></article>
        <article><span className="clarity-icon" aria-hidden="true">♡</span><div><h3>Estamos hasta que llegue.</h3><p>Coordinamos tu compra y la entrega. Si necesitás algo, seguimos por WhatsApp.</p></div></article>
      </div>
      <a className="clarity-link" href="https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20hacer%20una%20compra" target="_blank" rel="noopener noreferrer">Contanos qué querés comprar <span aria-hidden="true">↗</span></a>
    </div>
    <div className="clarity-showcase" aria-label="Ejemplo ilustrativo de un resumen de compra de Traela">
      <div className="clarity-orbit clarity-orbit-one"/><div className="clarity-orbit clarity-orbit-two"/>
      <div className="clarity-ticket">
        <div className="ticket-top"><span className="ticket-brand"><Image src="/traela-logo-new.svg" alt="" width={35} height={35}/> traela.</span><span className="ticket-example">EJEMPLO ILUSTRATIVO</span></div>
        <div className="ticket-main"><span className="ticket-kicker">RESUMEN DE COMPRA</span><h3>Todo lo que querés.<br/>Sin complicarte.</h3><div className="ticket-product"><span className="ticket-product-icon" aria-hidden="true">✦</span><span>Tu producto elegido<small>Buscamos, comparamos y coordinamos.</small></span><span className="ticket-tick" aria-hidden="true">✓</span></div>
        <div className="ticket-divider"/><div className="ticket-price"><span>Precio final confirmado<small>En guaraníes · Todo incluido</small></span><strong>₲ —</strong></div>
        <div className="ticket-status"><span className="ticket-status-dot"/> El precio se confirma antes de comprar</div></div>
        <div className="ticket-bottom"><span aria-hidden="true">↗</span> Del primer mensaje hasta tu puerta.</div>
      </div>
      <div className="clarity-floating"><span aria-hidden="true">✓</span> Así de simple.</div>
    </div>
  </section>
  <section className="discover-section" aria-labelledby="discover-title">
    <div className="discover-inner">
      <div className="discover-heading"><p className="eyebrow">¿QUÉ TENÉS EN MENTE?</p><h2 id="discover-title">Lo que quieras.<br/><span>En un mensaje.</span></h2><p>Desde algo que viste en internet hasta eso que no encontrás en Paraguay.</p></div>
      <div className="discover-grid">
        {[
          {name:"Esas zapatillas.",category:"Running y deporte",symbol:"👟",style:"running",message:"Hola Traela, quiero comprar unas zapatillas deportivas."},
          {name:"Esos auriculares.",category:"Tecnología",symbol:"🎧",style:"tech",message:"Hola Traela, quiero comprar unos auriculares."},
          {name:"Tu rutina favorita.",category:"Belleza y cuidado",symbol:"🧴",style:"beauty",message:"Hola Traela, quiero comprar productos de belleza y cuidado."},
          {name:"Ese regalo perfecto.",category:"Regalos y más",symbol:"🎁",style:"gifts",message:"Hola Traela, necesito ayuda para elegir y comprar un regalo."}
        ].map((item)=><a className="discover-card" key={item.style} href={`https://wa.me/595971255083?text=${encodeURIComponent(item.message)}`} target="_blank" rel="noopener noreferrer" aria-label={`Consultar por WhatsApp: ${item.category}`}>
          <div className={`discover-visual discover-${item.style}`}><span className="discover-object" aria-hidden="true">{item.symbol}</span><span className="discover-card-arrow" aria-hidden="true">↗</span></div>
          <div className="discover-card-copy"><h3>{item.name}</h3><p>{item.category}</p></div>
        </a>)}
      </div>
      <div className="discover-bottom"><p>¿No sabés exactamente cuál elegir? También te ayudamos con eso.</p><a href="https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20que%20me%20ayuden%20a%20encontrar%20un%20producto." target="_blank" rel="noopener noreferrer">Contanos qué buscás <span aria-hidden="true">↗</span></a></div>
      <p className="discover-note">Ejemplos de lo que podés pedir. Disponibilidad y precio sujetos a confirmación.</p>
    </div>
  </section>
  <section className="journey-section" aria-labelledby="journey-title">
    <div className="journey-inner">
      <div className="journey-heading"><p className="eyebrow">DE PRINCIPIO A FIN</p><h2 id="journey-title">No comprás solo.<br/><span>Comprás con Traela.</span></h2><p>Nos ocupamos de tu pedido y te acompañamos hasta que llegue a tus manos.</p></div>
      <div className="journey-panel">
        <div className="journey-panel-header"><div><span>ASÍ TE ACOMPAÑAMOS</span><h3>Tu compra, paso a paso.</h3></div><span className="journey-package" aria-hidden="true">✦</span></div>
        <ol className="journey-timeline">
          {[
            ["Confirmamos tu compra","Revisamos juntos el producto y el precio final."],
            ["Gestionamos tu pedido","Coordinamos la compra y el envío."],
            ["Te mantenemos al tanto","Te avisamos cómo avanza tu pedido."],
            ["Coordinamos la entrega","Seguimos con vos hasta que lo recibas."]
          ].map(([title,description],i)=><li key={title}><span className="journey-marker" aria-hidden="true">{i===3?"⌂":"✓"}</span><div><h4>{title}</h4><p>{description}</p></div></li>)}
        </ol>
        <div className="journey-help"><span className="journey-help-icon" aria-hidden="true">✉</span><div><strong>¿Tenés alguna pregunta?</strong><p>Seguimos disponibles por WhatsApp.</p></div></div>
      </div>
      <a className="journey-cta" href="https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20hacer%20una%20compra" target="_blank" rel="noopener noreferrer">Empezar mi compra <span aria-hidden="true">↗</span></a>
    </div>
  </section>
  <section id="experiencia-real" className="trust-section" aria-labelledby="trust-title"><div className="trust-inner"><p className="eyebrow">EXPERIENCIA REAL</p><h2 id="trust-title">Más de 100 pedidos.<br/><span>La nueva forma de comprar.</span></h2><p>Traela ya acompañó compras reales en Paraguay. Cada pedido nos ayuda a entender mejor lo que buscás.</p><div className="trust-stats"><article><strong>100+</strong><span>Pedidos gestionados</span></article><article><strong>30–40</strong><span>Clientes que confiaron en Traela</span></article><article><strong>De principio a fin</strong><span>Acompañamiento hasta la entrega</span></article></div><p className="trust-footnote">Cifras aproximadas del historial de Traela.</p><a className="trust-action" href="https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20hacer%20una%20compra" target="_blank" rel="noopener noreferrer">Empezar mi compra ↗</a></div></section>
  <section id="preguntas-frecuentes" className="faq-section" aria-labelledby="faq-title"><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2 id="faq-title">Todo claro.<br/>Desde el principio.</h2><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
  <section className="closing-section"><Brand/><h2>¿Qué querés<br/>comprar hoy?</h2><Start dark/><p>Precios en guaraníes. Pago vía transferencia bancaria.</p></section>
  <footer className="landing-footer"><div className="footer-box"><div className="footer-about"><Brand small/><h3>Compra como hablás.</h3><p>Tu agente personal de compras.<br/>Hecho para Paraguay.</p><Start dark/></div><div className="footer-links"><h4>Traela</h4><a href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer">Empezar a comprar</a><a href="#como-funciona">Cómo funciona</a><a href="https://wa.me/595971255083" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href="https://instagram.com/traela.app" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div className="footer-links"><h4>Información</h4><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Términos</a><a href="/eliminacion-datos.html">Eliminación de datos</a></div><p className="footer-copyright">© {new Date().getFullYear()} Traela. Todos los derechos reservados.</p></div><div className="footer-wordmark" aria-hidden="true">Traela</div></footer>
 </main>;
}
