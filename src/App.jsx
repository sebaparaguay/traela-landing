import "./App.css";
import { useState } from "react";

const WHATSAPP_LINK =
  "https://wa.me/595971255083?text=Hola%20Traela%2C%20quiero%20traer%20un%20producto";

export default function App() {
  const [search, setSearch] = useState("");
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto max-w-5xl px-6 pt-8 pb-24">
  <nav className="sticky top-4 z-50 flex items-center justify-between rounded-full border border-white/40 bg-white/70 px-5 py-4 shadow-lg backdrop-blur-xl">
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-fuchsia-500 text-white font-black shadow-lg">
        T
      </div>

      <span className="text-3xl font-black tracking-tight">
        Traela
      </span>
    </div>

    <a
      href={WHATSAPP_LINK}
      target="_blank"
      className="hidden rounded-full bg-gradient-to-r from-orange-500 to-fuchsia-500 px-7 py-4 text-sm font-black text-white shadow-xl transition hover:scale-[1.02] lg:inline-flex"
    >
      Decinos qué querés comprar →
    </a>
  </nav>

  <div className="grid items-center gap-20 pt-20 lg:grid-cols-[1.1fr_.9fr]">
    <div>
      <div className="mb-8 inline-flex rounded-full border border-fuchsia-100 bg-fuchsia-50 px-5 py-2 text-sm font-bold text-fuchsia-600">
        Fácil · rápido · sin vueltas
      </div>

      <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-slate-950 lg:text-8xl">
  La nueva forma de comprar{" "}
  <span className="bg-gradient-to-r from-orange-500 to-fuchsia-500 bg-clip-text text-transparent">
    del mundo.
  </span>
</h1>

      <p className="mt-10 max-w-2xl text-xl leading-9 text-slate-500">
  La forma de comprar online no cambió en años. Con Traela,
  simplemente decís qué querés y nosotros nos encargamos del resto.
</p>

      <div className="mt-12 max-w-3xl">
  <div className="group flex items-center gap-4 rounded-[2rem] border border-fuchsia-200 bg-white p-4 shadow-[0_20px_60px_rgba(255,0,128,0.12)]">
    <div className="text-3xl">🔍</div>

    <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const message = `Hola Traela, quiero traer: ${search}`;
      window.open(
        `https://wa.me/595971255083?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
  }}
  placeholder="¿Qué querés traer hoy?"
  className="w-full bg-transparent text-xl font-semibold text-slate-900 outline-none placeholder:text-slate-400"
/>

    <button
      onClick={() => {
  const message = `Hola Traela, quiero traer: ${search}`;
  window.open(
    `https://wa.me/595971255083?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}}
      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-fuchsia-500 text-2xl text-white shadow-lg transition-transform duration-300 hover:scale-105"
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
  "Pegá un link de Amazon",
].map((item) => (
  <button
    key={item}
    onClick={() => setSearch(item)}
    className="rounded-full border border-fuchsia-100 bg-white px-5 py-3 text-sm font-semibold text-fuchsia-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300 hover:shadow-md active:scale-95"
  >
    {item}
  </button>
))}
  </div>
</div>  
      <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["Precio final", "Sabés exactamente cuánto vas a pagar."],
          ["Atención real", "Hablás con personas, no bots."],
          ["Nos encargamos", "Compramos, enviamos y resolvemos."],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <h3 className="font-black text-slate-950">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="relative">
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
              <p className="text-sm font-bold text-slate-950">
                Ya tengo la mejor opción para vos.
              </p>

              <div className="mt-5 flex gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-slate-100 text-4xl">
                  🎧
                </div>

                <div>
                  <h3 className="font-black text-slate-950">
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

        <section className="mx-auto grid w-full max-w-[340px] gap-3 pb-16 md:max-w-none md:grid-cols-4 md:gap-5">
          {[
            ["Precio final garantizado", "Sabés cuánto vas a pagar desde el inicio. Sin costos ocultos."],
            ["Te ayudamos a elegir", "Comparamos opciones y te recomendamos la mejor."],
            ["Nos hacemos cargo", "Compramos, gestionamos el envío y resolvemos cualquier problema."],
            ["Atención real por WhatsApp", "Hablás con personas reales, no con bots."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </section>
              <section className="mx-auto w-full max-w-[340px] py-20 md:max-w-none">
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
                  Atención por WhatsApp
                </div>

                <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold">
                  Compramos por vos
                </div>
              </div>
            </div>
          </div>
        </section>

              <section className="mx-auto w-full max-w-[340px] py-20 md:max-w-none">
          <div className="text-center">
            <div className="mb-4 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              Así de fácil
            </div>

            <h2 className="text-4xl font-black lg:text-5xl">
              Comprar del exterior nunca fue tan simple.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Nos encargamos de todo para que vos solo te preocupes por elegir
              lo que querés.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-4">
            {[
              [
                "1",
                "Mandanos el link",
                "Puede ser de Amazon, Nike, TikTok, Instagram o cualquier tienda.",
              ],
              [
                "2",
                "Te pasamos el precio final",
                "Incluye producto, envío, gestión y entrega en Paraguay.",
              ],
              [
                "3",
                "Confirmás y pagás",
                "Solo compramos cuando aprobás el pedido.",
              ],
              [
                "4",
                "Lo recibís en tu casa",
                "Te mantenemos al tanto por WhatsApp.",
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

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

              <section className="mx-auto w-full max-w-[340px] py-20 md:max-w-none">
          <div className="mt-12 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-fuchsia-50 px-4 py-2 text-sm font-bold text-fuchsia-600">
                Productos populares
              </div>

              <h2 className="text-4xl font-black lg:text-5xl">
                Productos que la gente ya está trayendo.
              </h2>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              className="hidden rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white lg:inline-flex"
            >
              Consultar producto →
            </a>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["🎧", "AirPods Pro", "Tecnología"],
              ["🥤", "Stanley Cup", "Lifestyle"],,
              ["⌚", "Apple Watch", "Lifestyle"],
              ["🏋️", "Gym Accessories", "Fitness"],
            ].map(([emoji, title, category]) => (
              <div
                key={title}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid h-56 place-items-center bg-gradient-to-br from-orange-100 via-pink-100 to-fuchsia-100 text-7xl">
                  {emoji}
                </div>

                <div className="p-5">
                  <p className="text-sm font-semibold text-fuchsia-600">
                    {category}
                  </p>

                  <h3 className="mt-2 text-2xl font-black">{title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Consultá disponibilidad, precio final y fecha estimada de
                    entrega.
                  </p>

                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    className="mt-6 inline-flex text-sm font-black text-slate-950"
                  >
                    Consultar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

              <section className="mx-auto w-full max-w-[340px] py-20 md:max-w-none">
          <div className="mt-12 grid gap-3 lg:grid-cols-3 lg:gap-6">
            <div className="mb-4 inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              Clientes felices
            </div>

            <h2 className="text-4xl font-black lg:text-5xl">
              Lo que dicen nuestros clientes.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
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
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <p className="text-lg leading-8 text-slate-700">{quote}</p>

                <div className="mt-8">
                  <p className="font-black">{name}</p>
                  <p className="text-sm text-slate-500">Paraguay</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[340px] pb-20 md:max-w-none">
          <div className="overflow-hidden rounded-[3rem] bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 p-10 text-white lg:p-16">
            <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  Traela Concierge
                </div>

                <h2 className="text-4xl font-black leading-tight lg:text-5xl">
                  Encontraste algo que querés?
                </h2>

                <p className="mt-6 text-lg leading-8 text-white/90">
                  Mandanos el link y te respondemos con precio final, fecha
                  estimada y la mejor opción disponible.
                </p>
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                className="rounded-2xl bg-white px-8 py-5 text-lg font-black text-slate-950 shadow-2xl"
              >
                Pedir por WhatsApp →
              </a>
            </div>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-[340px] border-t border-slate-100 py-10 md:max-w-none">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-fuchsia-500 text-white font-black">
                  T
                </div>

                <span className="text-2xl font-black">Traela</span>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                Accedé a productos del mundo sin complicaciones.
              </p>
            </div>

            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <a href={WHATSAPP_LINK}>Cómo funciona</a>
              <a href={WHATSAPP_LINK}>Precios</a>
              <a href={WHATSAPP_LINK}>Preguntas</a>
              <a href={WHATSAPP_LINK}>WhatsApp</a>
            </div>
          </div>
        </footer>

    </main>
  );
}