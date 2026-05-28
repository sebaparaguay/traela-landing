import "./App.css";
import { useState } from "react";
import logo from "./assets/traela-logo.png";

const WHATSAPP_LINK =
  "https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20traer%20un%20producto";

export default function App() {
  const [search, setSearch] = useState("");

const sendToWhatsApp = () => {
  const text = search.trim() || "Quiero traer un AirPods Pro 3";
  const message = `Hola Traela, quiero traer: ${text}`;

  window.open(
    `https://wa.me/595971255083?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-24">
  <nav className="sticky top-4 z-50 flex items-center justify-between rounded-full border border-white/60 bg-white/80 px-8 py-5 shadow-xl backdrop-blur-xl">
    <div className="flex items-center gap-3">
      <img
  src={logo}
  alt="Traela"
  className="h-16 w-auto scale-[3] origin-left"
/>

      
    </div>

    <button
      onClick={sendToWhatsApp}
      className="hidden rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 px-7 py-4 text-sm font-black text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:scale-[1.02] lg:inline-flex"
    >
      Decinos qué querés comprar →
    </button>
  </nav>

  <div className="grid items-center gap-16 pt-20 lg:grid-cols-[1.05fr_.95fr]">
    <div>
      <div className="mb-8 inline-flex rounded-full border border-fuchsia-100 bg-fuchsia-50 px-5 py-2 text-sm font-bold text-fuchsia-600">
        Fácil · rápido · sin vueltas
      </div>

      <h1 className="max-w-7xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950 lg:text-[5.5rem]">
  Decí lo que querés.{" "}
  <span className="bg-gradient-to-r from-orange-500 to-fuchsia-500 bg-clip-text text-transparent">
    Nosotros lo hacemos real.
  </span>
</h1>
<p className="mt-6 max-w-xl text-lg leading-7 text-slate-600">
  Una nueva forma de comprar: conversacional, inteligente y hecha para vos.
  Nuestra IA encuentra mejores opciones, compara precios y te lo entrega en Paraguay.

</p>
      <div className="mt-6 max-w-4xl">
        <div className="group flex items-center gap-4 rounded-[2rem] border border-fuchsia-100 bg-white p-4 shadow-[0_24px_80px_rgba(217,70,239,0.14)] transition-all duration-300 hover:shadow-[0_32px_90px_rgba(217,70,239,0.20)]">
          <div className="text-3xl">🔍</div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendToWhatsApp();
              }
            }}
            placeholder="¿Qué querés traer hoy?"
            className="w-full bg-transparent text-xl font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />

          <button
            onClick={sendToWhatsApp}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-fuchsia-500 text-2xl text-white shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            →
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {[
            "AirPods Pro 3",
            "Un champion para correr < $150",
            "Stanley Quencher 40oz",
            "iPhone 15 Pro Max",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setSearch(item)}
              className="rounded-full border border-fuchsia-100 bg-white px-5 py-3 text-sm font-semibold text-fuchsia-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300 hover:shadow-md active:scale-95 hover:-translate-y-1 transition-all duration-300"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">

  <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-2xl">
      💬
    </div>

    <h3 className="text-xl font-bold text-slate-950">
      Conversacional
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      Contanos lo que buscás como hablarías con un amigo.
    </p>
  </div>

  <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-2xl">
      🤖
    </div>

    <h3 className="text-xl font-bold text-slate-950">
      Inteligente
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      Nuestra IA busca, compara y encuentra la mejor opción.
    </p>
  </div>

  <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/60">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl">
      📦
    </div>

    <h3 className="text-xl font-bold text-slate-950">
      Hecho real
    </h3>

    <p className="mt-2 text-sm leading-6 text-slate-500">
      Nos encargamos de todo y lo entregamos en tu casa.
    </p>
  </div>

</div>
      </div>

      <p className="mt-10 max-w-2xl text-xl leading-9 text-white/70">
        Una nueva forma de comprar: conversacional, inteligente y hecha para vos.
      </p>
    </div>

    <div className="relative hidden lg:block">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-fuchsia-300 opacity-80 blur-3xl" />

      <div className="relative mx-auto max-w-sm rounded-[3.5rem] border-[10px] border-slate-950 bg-white p-4 shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
        <div className="overflow-hidden rounded-[2.8rem] bg-[#efe7dc]">
          <div className="flex items-center gap-3 border-b border-black/5 bg-white/70 px-6 py-5 backdrop-blur">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-fuchsia-500 text-sm font-black text-white">
              T
            </div>

            <div>
              <p className="font-black text-slate-950">
                Traela
              </p>
              <p className="text-xs text-green-600">
                En línea
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="ml-auto w-fit rounded-3xl bg-green-100 px-5 py-4 text-sm font-medium text-slate-800 shadow-sm">
              Quiero traer estos AirPods Pro
            </div>

            <div className="rounded-[2rem] bg-white p-5 shadow-xl">
              <p className="text-sm font-bold text-white">
                Ya tengo la mejor opción para vos.
              </p>

              <div className="mt-5 flex gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-slate-100 text-4xl">
                  🎧
                </div>

                <div>
                  <h3 className="font-black text-white">
                    AirPods Pro
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>Precio final: G. 701.500</p>
                    <p>Llega en 5 a 10 días hábiles</p>
                    <p>Incluye envío y entrega</p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-700">
                ¿Te los pedimos?
              </p>
            </div>

            <div className="ml-auto w-fit rounded-3xl bg-green-100 px-5 py-4 text-sm font-medium text-slate-800 shadow-sm">
              Sí, traelo 🙌
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
        
              <section className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-fuchsia-950 p-10 text-white lg:p-16">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-fuchsia-200">
                La diferencia Traela
              </div>

              <h2 className="text-4xl font-black leading-tight lg:text-5xl">
                No más calcular kilos, casillas ni costos ocultos.
              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Con Traela no tenés que adivinar cuánto cuesta traer algo.
                Mandanos el producto que querés y te respondemos con un precio
                final claro, entrega estimada y la mejor opción disponible.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold">
                  Precio final garantizado
                </div>

                <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold">
                  Atención conversacional
                </div>

                <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold">
                  Compramos por vos
                </div>
              </div>
            </div>
          </div>
        </section>

              <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              Así de fácil
            </div>

            <h2 className="text-4xl font-black lg:text-5xl">
              De decirlo a tenerlo.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Nos encargamos de todo para que vos solo te preocupes por elegir
              lo que querés.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            {[
  [
    "1",
    "Decís qué querés",
    "Contanos el producto, el uso o la ocasión. No necesitás saber exactamente cuál comprar.",
  ],
  [
    "2",
    "Traela encuentra opciones",
    "Comparamos alternativas y elegimos la mejor opción para vos.",
  ],
  [
    "3",
    "Ves el precio final",
    "Te mostramos costo, entrega estimada y todo incluido desde el inicio.",
  ],
  [
    "4",
    "Lo recibís en tu casa",
    "Nos encargamos de comprar, enviar y entregar en Paraguay.",
  ],
].map(([number, title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-fuchsia-500 text-xl font-black text-white">
                  {number}
                </div>

                <h3 className="text-xl font-black">{title}</h3>

                <p className="mt-4 text-sm leading-7 text-slate-700">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

              <section className="mx-auto max-w-7xl px-6 py-24">
  <div className="max-w-3xl">
    <div className="mb-6 inline-flex rounded-full bg-fuchsia-50 px-5 py-2 text-sm font-bold text-fuchsia-600">
      Primeros pedidos entregados
    </div>

    <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950">
      Productos que la gente ya está trayendo.
    </h2>

    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
      Desde AirPods Pro hasta Stanley Cups y Apple Watch. Ya estamos ayudando
      a personas en Paraguay a comprar mejor, con precio final claro y entrega
      a domicilio.
    </p>
  </div>

  <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
    {[
      ["🎧", "Tecnología", "AirPods Pro", "Entregado en Asunción • 8 días"],
      ["🥤", "Lifestyle", "Stanley Cup", "Entregado en Luque • 9 días"],
      ["⌚", "Lifestyle", "Apple Watch", "Entregado en Asunción • 10 días"],
      ["🏋️", "Fitness", "Gym Accessories", "Entregado en San Lorenzo • 7 días"],
    ].map(([emoji, category, title, detail]) => (
      <div
        key={title}
        className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="grid h-48 place-items-center bg-gradient-to-br from-orange-50 via-pink-50 to-fuchsia-50 text-5xl">
          {emoji}
        </div>

        <div className="p-6">
          <p className="text-sm font-bold text-fuchsia-600">{category}</p>
          <h3 className="mt-3 text-2xl font-black text-slate-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
        </div>
      </div>
    ))}
  </div>
</section>

              <section className="mx-auto max-w-7xl px-6 py-24">
         <div className="mx-auto max-w-3xl text-center">
  <div className="mb-6 inline-flex rounded-full bg-orange-50 px-5 py-2 text-sm font-bold text-orange-600">
    Primeros pedidos entregados
  </div>

  <h2 className="text-4xl font-black leading-tight tracking-tight text-slate-950 lg:text-5xl">
    Lo que dicen nuestros clientes.
  </h2>
</div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              [
                "“Le mandé el link y en minutos ya tenía el precio final. Mucho más fácil que calcular todo yo.”",
                "María B.",
              ],
              [
                "“La mejor parte fue saber exactamente cuánto iba a pagar desde el inicio.”",
                "Diego R.",
              ],
              [
                "“Sentí que alguien realmente me ayudó durante todo el proceso.”",
                "Ana P.",
              ],
            ].map(([quote, name]) => (
              <div
                key={name}
                className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm"
              >
                <p className="text-lg leading-8 text-slate-700">{quote}</p>

                <div className="mt-8">
                  <p className="font-black">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-2">
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 p-10 text-white lg:p-16">
            <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
                  Traela Concierge
                </div>

                <h2 className="text-4xl font-black leading-tight lg:text-5xl">
                  ¿Qué querés comprar hoy?
                </h2>

                <p className="mt-6 text-lg leading-8 text-white/90">
                  Comprá como hablás. Decinos qué querés, nuestro asistente encuentra la mejor opción, te muestra el precio final y nosotros nos encargamos del resto.
                </p>
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                className="rounded-2xl bg-white px-8 py-5 text-lg font-black text-slate-950 shadow-2xl"
              >
                Decinos qué querés comprar →
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-24 border-t border-slate-200">
  <div className="mx-auto max-w-7xl px-6 py-12">

    <img
      src={logo}
      alt="Traela"
      className="h-20 w-auto"
    />

    <p className="mt-4 max-w-md text-slate-500">
      Una nueva forma de comprar online en Paraguay.
      Comprá como hablás.
    </p>

    <div className="mt-6 flex gap-6">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        className="text-slate-600 hover:text-slate-900"
      >
        WhatsApp
      </a>

      <a
        href="https://instagram.com/traela.app"
        target="_blank"
        className="text-slate-600 hover:text-slate-900"
      >
        Instagram
      </a>
    </div>

    <p className="mt-10 text-sm text-slate-400">
      © 2026 Traela. Todos los derechos reservados.
    </p>

  </div>
</footer>

    </main>
  );
}