import React from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, ShieldCheck, Truck, Sparkles, ArrowRight, Play, ShoppingBag, Users } from "lucide-react";


export default function TraelaLandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090012] text-white">
      <section className="relative min-h-screen px-6 py-6 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,#ff005c_0%,transparent_30%),radial-gradient(circle_at_80%_15%,#8b00ff_0%,transparent_35%),linear-gradient(135deg,#ff004f_0%,#d900d8_45%,#4b00ff_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.22),transparent_18%)]" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-500 to-fuchsia-700 shadow-lg shadow-pink-700/30">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">Traela</span>
          </div>
          <div className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex">
            <a href="#how">Cómo funciona</a>
            <a href="#proof">Por qué ahora</a>
            <a href="#waitlist">Únete</a>
          </div>
          <Button className="rounded-full bg-white px-5 text-[#8b00ff] hover:bg-white/90">
            Probar ahora
          </Button>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pb-16 pt-20 md:grid-cols-[1.05fr_.95fr] md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              AI Shopping Assistant para LATAM.
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              Comprá cualquier producto online con ayuda de IA.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-white/78 md:mx-0 md:text-xl">
              Mandale a Traela cualquier link, foto o producto que quieras. Nuestra IA busca las mejores opciones, compara precios, evalúa tiempos de entrega, verifica vendedores y te recomienda la compra más conveniente para vos.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Button className="h-14 rounded-full bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-400 px-8 text-lg font-bold shadow-2xl shadow-pink-900/40 hover:scale-[1.02]">
                Ver cómo funciona <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-14 rounded-full border-white/25 bg-white/10 px-8 text-lg font-bold text-white backdrop-blur-xl hover:bg-white/20 hover:text-white">
                Probar Traela
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[3rem] bg-white/20 blur-3xl" />
            <Card className="relative overflow-hidden rounded-[2.5rem] border-white/15 bg-white/12 shadow-2xl backdrop-blur-2xl">
              <CardContent className="p-5 md:p-7">
                <div className="rounded-[2rem] bg-[#12001e]/70 p-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm font-bold text-white/50">Compra asistida por IA</p>
                      <p className="text-lg font-black">Nike Vomero Plus</p>
                    </div>
                    <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-200">Confirmado</div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="rounded-3xl bg-white p-4 text-[#170020]">
                      <div className="flex gap-4">
                        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-300">
                          <ShoppingBag className="h-12 w-12 text-zinc-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-500">La IA encontró la mejor compra</p>
                          <h3 className="mt-1 text-xl font-black">USD 115</h3>
                          <p className="mt-2 text-sm font-semibold text-zinc-600">Incluye recomendación optimizada según precio, envío y tiempo de entrega.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Info icon={<Search />} title="Analizamos" text="Miles de opciones online." />
                      <Info icon={<ShieldCheck />} title="Comparamos" text="Precio, tiempo y confianza." />
                      <Info icon={<MessageCircle />} title="Te guiamos" text="Todo desde una conversación." />
                      <Info icon={<Truck />} title="Traemos" text="Hasta tu puerta." />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="how" className="relative bg-[#090012] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-300">Cómo funciona</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">La forma más inteligente de comprar online en LATAM.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Step number="01" title="Decile a Traela qué querés" text="Un link, una foto, un screenshot o incluso una idea. Traela entiende lo que buscás." />
            <Step number="02" title="La IA analiza internet por vos" text="Buscamos la mejor combinación entre precio, envío, tiempo de entrega y confianza." />
            <Step number="03" title="Elegís y Traela resuelve" text="Confirmamos el pedido, coordinamos el envío y hacemos seguimiento hasta la entrega." />
          </div>
        </div>
      </section>

      <section id="proof" className="bg-white px-6 py-24 text-[#13001f] md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-fuchsia-600">Por qué Traela</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Comprar online todavía consume demasiado tiempo.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Proof icon={<Users />} title="Internet ya es el nuevo shopping" text="TikTok, Instagram y Pinterest generan intención. Pero comprar sigue siendo lento, manual y fragmentado." />
            <Proof icon={<ShoppingBag />} title="La mejor compra no siempre está en una sola tienda" text="Traela analiza múltiples opciones online y recomienda la más conveniente." />
            <Proof icon={<MessageCircle />} title="La conversación es la nueva interfaz" text="Comprar debería sentirse tan natural como hablar con alguien que sabe exactamente qué necesitás." />
            <Proof icon={<Sparkles />} title="El futuro del ecommerce es AI commerce" text="Cada pedido hace que Traela entienda mejor qué comprar, dónde comprarlo y cómo optimizar la experiencia." />
          </div>
        </div>
      </section>

      <section id="waitlist" className="relative overflow-hidden px-6 py-24 md:px-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-700 via-fuchsia-700 to-blue-700" />
        <div className="relative mx-auto max-w-4xl rounded-[2.5rem] border border-white/20 bg-white/12 p-8 text-center shadow-2xl backdrop-blur-2xl md:p-14">
          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">Shopping impulsado por IA.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/80">
            Encontrá mejores precios, mejores tiempos y decisiones más inteligentes sin perder horas buscando online.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full bg-white p-2 shadow-2xl md:flex-row">
            <input className="min-h-12 flex-1 rounded-full px-5 text-[#13001f] outline-none" placeholder="Tu WhatsApp o email" />
            <Button className="min-h-12 rounded-full bg-[#13001f] px-7 font-bold text-white hover:bg-[#250039]">Acceso anticipado</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 text-white">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">{React.cloneElement(icon, { className: "h-5 w-5" })}</div>
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm font-medium text-white/60">{text}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-white/[0.06] text-white shadow-2xl">
      <CardContent className="p-7">
        <p className="text-sm font-black text-fuchsia-300">{number}</p>
        <h3 className="mt-6 text-2xl font-black">{title}</h3>
        <p className="mt-4 leading-7 text-white/65">{text}</p>
      </CardContent>
    </Card>
  );
}

function Proof({ icon, title, text }) {
  return (
    <div className="rounded-[2rem] bg-zinc-50 p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-blue-600 text-white">{React.cloneElement(icon, { className: "h-5 w-5" })}</div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-zinc-600">{text}</p>
    </div>
  );
}
function Button({ children, className = "", variant, ...props }) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}