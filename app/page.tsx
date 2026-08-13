"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type SearchProduct = {
  id: string;
  title: string;
  source: string;
  source_url: string;
  source_price_usd: number | null;
  image_url: string | null;
  rating: number | null;
  reviews: number | null;
  delivery: string | null;
  recommended: boolean;
  traela_price_pyg: number | null;
  billable_weight_kg: number | null;
  pricing_status: string;
};

type SearchResponse = {
  status: string;

  input: {
    type: "text" | "url" | "image";
    query?: string;
    image_url?: string;
    identified_query?: string;
    identified_product?: string;
    identified_brand?: string;
    identified_category?: string;
    identified_color?: string;
    confidence?: number;
    original_url?: string;
    resolved_url?: string;
  };

  search: {
    query: string;
    intent_type?: string;
    brand?: string | null;
    product_name?: string | null;
    category?: string | null;
    constraints?: unknown;
    refinement?: unknown;
  };

  recommendation: {
    product_id: string;
    confidence: number;
    reason: string;
  };

  products_count: number;
  products: SearchProduct[];
};

type MagicBoxMode = "text" | "link" | "image";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sessionId, setSessionId] = useState("");

  const [magicBoxMode, setMagicBoxMode] =
    useState<MagicBoxMode>("text");

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const [comingSoonFeature, setComingSoonFeature] =
    useState<string | null>(null);

  const [videoOpen, setVideoOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const magicBoxSectionRef = useRef<HTMLDivElement | null>(null);
  const mainTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const existingSession = localStorage.getItem("traela_session_id");

    if (existingSession) {
      setSessionId(existingSession);
      return;
    }

    const newSession = crypto.randomUUID();

    localStorage.setItem("traela_session_id", newSession);
    setSessionId(newSession);
  }, []);

  function startShopping() {
    magicBoxSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      mainTextareaRef.current?.focus();
    }, 500);
  }

  async function submitSearch(value?: string) {
    const finalQuery = (value ?? query).trim();

    const isImageSearch =
      magicBoxMode === "image" && Boolean(selectedImage);

    if ((!finalQuery && !isImageSearch) || loading) {
      return;
    }

    setLoading(true);
    setError("");

    if (isImageSearch) {
      setLastQuery(
        selectedImageName
          ? `Imagen: ${selectedImageName}`
          : "Imagen enviada"
      );
    } else {
      setLastQuery(finalQuery);
    }

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: finalQuery,
          image_url: isImageSearch ? selectedImage : "",
          session_id: sessionId || crypto.randomUUID(),
          locale: "es-PY",
          currency: "PYG",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data?.message || "No pudimos completar la búsqueda."
        );
      }

      setResult(data);
      setQuery("");

      if (isImageSearch) {
        setSelectedImage("");
        setSelectedImageName("");
        setMagicBoxMode("text");
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error buscando productos."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelected(
    dataUrl: string,
    fileName: string
  ) {
    setSelectedImage(dataUrl);
    setSelectedImageName(fileName);
    setMagicBoxMode("image");
    setQuery("");
  }

  function removeSelectedImage() {
    setSelectedImage("");
    setSelectedImageName("");
    setMagicBoxMode("text");
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <Header
        onComingSoon={setComingSoonFeature}
        onStart={startShopping}
        onVideo={() => setVideoOpen(true)}
      />

      {!result && !loading ? (
        <LandingState
          query={query}
          setQuery={setQuery}
          onSubmit={submitSearch}
          mode={magicBoxMode}
          setMode={setMagicBoxMode}
          selectedImage={selectedImage}
          selectedImageName={selectedImageName}
          onImageSelected={handleImageSelected}
          onRemoveImage={removeSelectedImage}
          onComingSoon={setComingSoonFeature}
          onVideo={() => setVideoOpen(true)}
          magicBoxSectionRef={magicBoxSectionRef}
          mainTextareaRef={mainTextareaRef}
        />
      ) : (
        <ConversationState
          query={query}
          setQuery={setQuery}
          lastQuery={lastQuery}
          loading={loading}
          error={error}
          result={result}
          onSubmit={submitSearch}
          resultsRef={resultsRef}
          mode={magicBoxMode}
          setMode={setMagicBoxMode}
          selectedImage={selectedImage}
          selectedImageName={selectedImageName}
          onImageSelected={handleImageSelected}
          onRemoveImage={removeSelectedImage}
          onComingSoon={setComingSoonFeature}
        />
      )}

      {comingSoonFeature && (
        <ComingSoonModal
          feature={comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
        />
      )}

      {videoOpen && (
        <VideoModal onClose={() => setVideoOpen(false)} />
      )}
    </main>
  );
}

function Header({
  onComingSoon,
  onStart,
  onVideo,
}: {
  onComingSoon: (feature: string) => void;
  onStart: () => void;
  onVideo: () => void;
}) {
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-[92px] max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link href="/">
          <Image
            src="/traela-logo.png"
            alt="Traela"
            width={165}
            height={60}
            priority
            className="h-auto w-[145px] md:w-[165px]"
          />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={onVideo}
            className="hidden text-black/55 transition hover:text-black md:block"
          >
            Ver cómo funciona
          </button>

          <a
            href="/#como-funciona"
            className="hidden text-black/55 transition hover:text-black lg:block"
          >
            Cómo funciona
          </a>

          <button
            onClick={() => onComingSoon("Mis pedidos")}
            className="hidden text-black/55 transition hover:text-black sm:block"
          >
            Mis pedidos
          </button>

          <button
            onClick={onStart}
            className="rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff2a72] to-[#d600ff] px-6 py-3 text-white shadow-[0_10px_25px_rgba(223,0,160,0.18)] transition hover:scale-[1.02]"
          >
            Empezar
          </button>
        </nav>
      </div>
    </header>
  );
}

function LandingState({
  query,
  setQuery,
  onSubmit,
  mode,
  setMode,
  selectedImage,
  selectedImageName,
  onImageSelected,
  onRemoveImage,
  onComingSoon,
  onVideo,
  magicBoxSectionRef,
  mainTextareaRef,
}: {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (value?: string) => void;
  mode: MagicBoxMode;
  setMode: (mode: MagicBoxMode) => void;
  selectedImage: string;
  selectedImageName: string;
  onImageSelected: (dataUrl: string, fileName: string) => void;
  onRemoveImage: () => void;
  onComingSoon: (feature: string) => void;
  onVideo: () => void;
  magicBoxSectionRef: RefObject<HTMLDivElement | null>;
  mainTextareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[38px] bg-[radial-gradient(circle_at_16%_95%,rgba(255,191,0,0.95),transparent_28%),radial-gradient(circle_at_25%_20%,rgba(255,63,95,0.95),transparent_38%),radial-gradient(circle_at_65%_70%,rgba(232,0,221,0.85),transparent_44%),linear-gradient(120deg,#ff6a00_0%,#ff155f_35%,#db00e8_68%,#6412ff_100%)] px-7 py-14 text-white shadow-[0_30px_80px_rgba(127,37,255,0.16)] md:px-14 md:py-16 lg:px-16">
          <div className="pointer-events-none absolute -bottom-[220px] left-[-90px] h-[540px] w-[115%] rounded-[50%] border border-white/35" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Traela Concierge
                </div>

                <div className="inline-flex rounded-full border border-white/20 bg-black/10 px-3 py-2 text-xs font-semibold backdrop-blur">
                  Beta
                </div>
              </div>

              <h1 className="max-w-[560px] text-[48px] font-semibold leading-[0.98] tracking-[-0.05em] md:text-[64px]">
                Compra como hablás.
              </h1>

              <p className="mt-7 max-w-[560px] text-lg leading-8 text-white/90">
                Decinos qué querés, pegá un link o mostranos una imagen.
                Traela busca, compara y encuentra la mejor forma de comprarlo
                por vos.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={onVideo}
                  className="rounded-full border border-white/30 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  ▶ Ver cómo funciona
                </button>

                <a
                  href="#como-funciona"
                  className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Conocer Traela
                </a>
              </div>

              <div className="mt-8 grid max-w-[510px] grid-cols-3 gap-3">
                <HeroCapability icon="•••" label="Escribí lo que querés" />
                <HeroCapability icon="↗" label="Pegá un link" />
                <HeroCapability icon="▧" label="Subí una imagen" />
              </div>
            </div>

            <div ref={magicBoxSectionRef}>
              <MagicBox
                query={query}
                setQuery={setQuery}
                loading={false}
                onSubmit={onSubmit}
                hero
                mode={mode}
                setMode={setMode}
                selectedImage={selectedImage}
                selectedImageName={selectedImageName}
                onImageSelected={onImageSelected}
                onRemoveImage={onRemoveImage}
                textareaRef={mainTextareaRef}
              />

              <div className="mt-6">
                <div className="mb-3 text-sm text-white/75">
                  Probá con algo como:
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Nike Pegasus 41",
                    "Un regalo para mi mamá",
                    "Auriculares para viajar",
                    "Una campera negra",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setMode("text");
                        onSubmit(example);
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white hover:text-black"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-8">
        <div className="rounded-[34px] border border-black/[0.07] bg-white p-7 shadow-[0_12px_45px_rgba(0,0,0,0.04)] md:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <div className="text-sm font-semibold text-[#7027ff]">
                ✦ Así se ve una recomendación
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                Traela trabaja por vos.
              </h2>

              <p className="mt-4 max-w-md leading-7 text-black/50">
                Buscamos en distintas tiendas, comparamos opciones y te
                mostramos la mejor forma de comprarlo. Vos solo elegís.
              </p>
            </div>

            <MiniRecommendation onComingSoon={onComingSoon} />
          </div>
        </div>
      </section>
    </>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Decí qué querés",
      text: "Escribí lo que buscás, pegá un link o mostranos una imagen.",
    },
    {
      number: "02",
      title: "Traela busca por vos",
      text: "Comparamos productos, precios y opciones para encontrar la mejor alternativa.",
    },
    {
      number: "03",
      title: "Seguí hablando",
      text: "Pedí otro color, talle, precio o alternativa sin empezar de nuevo.",
    },
    {
      number: "04",
      title: "Elegí y comprá",
      text: "Cuando estés listo, Traela te ayuda a completar la compra.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 bg-[#faf9f7] py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="max-w-[720px]">
          <div className="text-sm font-semibold text-[#8b2cff]">
            Cómo funciona
          </div>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] md:text-5xl">
            Comprar debería sentirse así de fácil.
          </h2>

          <p className="mt-5 max-w-[620px] text-lg leading-8 text-black/45">
            Traela convierte lo que querés comprar en una conversación. Vos
            pedís. Traela hace el trabajo pesado.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <HowItWorksCard
              key={step.number}
              number={step.number}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
      <div className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#b925ff] px-3 text-sm font-semibold text-white">
        {number}
      </div>

      <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-black/45">
        {text}
      </p>
    </article>
  );
}

function ConversationState({
  query,
  setQuery,
  lastQuery,
  loading,
  error,
  result,
  onSubmit,
  resultsRef,
  mode,
  setMode,
  selectedImage,
  selectedImageName,
  onImageSelected,
  onRemoveImage,
  onComingSoon,
}: {
  query: string;
  setQuery: (value: string) => void;
  lastQuery: string;
  loading: boolean;
  error: string;
  result: SearchResponse | null;
  onSubmit: (value?: string) => void;
  resultsRef: RefObject<HTMLDivElement | null>;
  mode: MagicBoxMode;
  setMode: (mode: MagicBoxMode) => void;
  selectedImage: string;
  selectedImageName: string;
  onImageSelected: (dataUrl: string, fileName: string) => void;
  onRemoveImage: () => void;
  onComingSoon: (feature: string) => void;
}) {
  const recommendedProduct =
    result?.products.find((product) => product.recommended) ||
    result?.products.find(
      (product) =>
        String(product.id) ===
        String(result.recommendation.product_id)
    ) ||
    result?.products[0];

  const alternatives =
    result?.products.filter(
      (product) => product.id !== recommendedProduct?.id
    ) || [];

  return (
    <section
      ref={resultsRef}
      className="mx-auto max-w-[1160px] px-6 pb-20 pt-8 md:px-10"
    >
      <div className="mx-auto max-w-[960px]">
        {lastQuery && (
          <div className="flex justify-end">
            <div className="max-w-[660px] rounded-[26px] rounded-br-[7px] bg-[#f0eaff] px-6 py-4 text-[17px] leading-7">
              {lastQuery}
            </div>
          </div>
        )}

        {loading && <ThinkingState />}

        {error && (
          <div className="mt-8 flex gap-4">
            <TraelaAvatar />

            <div className="max-w-[720px]">
              <div className="font-semibold">Traela</div>

              <div className="mt-2 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
                {error}
              </div>
            </div>
          </div>
        )}

        {!loading && result && recommendedProduct && (
          <>
            <div className="mt-9 flex gap-4">
              <TraelaAvatar />

              <div className="max-w-[760px]">
                <div className="font-semibold">Traela</div>

                <p className="mt-1 text-[17px] leading-7">
                  Encontré varias opciones. Esta es la que elegiría por vos.
                </p>

                {result.recommendation.reason && (
                  <p className="mt-2 text-[15px] leading-6 text-black/45">
                    {result.recommendation.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <RecommendedProduct
                product={recommendedProduct}
                onComingSoon={onComingSoon}
              />
            </div>

            {alternatives.length > 0 && (
              <>
                <div className="mt-14">
                  <h2 className="text-2xl font-semibold tracking-[-0.035em]">
                    También encontré estas opciones
                  </h2>

                  <p className="mt-2 text-sm text-black/45">
                    Podés comparar antes de decidir.
                  </p>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {alternatives.map((product) => (
                    <AlternativeProduct
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="mt-14 flex gap-4">
              <TraelaAvatar />

              <div className="flex-1">
                <div className="font-semibold">
                  ¿Querés algo distinto?
                </div>

                <p className="mt-1 text-sm text-black/45">
                  Seguí hablando conmigo. Pedime algo como “más barato”,
                  “negro”, “talle 10” o “mejor valorado”.
                </p>

                <div className="mt-5">
                  <MagicBox
                    query={query}
                    setQuery={setQuery}
                    loading={loading}
                    onSubmit={onSubmit}
                    mode={mode}
                    setMode={setMode}
                    selectedImage={selectedImage}
                    selectedImageName={selectedImageName}
                    onImageSelected={onImageSelected}
                    onRemoveImage={onRemoveImage}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Más barato",
                    "Mejor valorado",
                    "Solo negro",
                    "Talle 10",
                    "Entrega más rápida",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setMode("text");
                        onSubmit(item);
                      }}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/50 transition hover:border-[#d400e5] hover:text-[#8d24ff]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ThinkingState() {
  return (
    <div className="mt-9 flex gap-4">
      <TraelaAvatar />

      <div className="max-w-[700px]">
        <div className="font-semibold">Traela</div>

        <div className="mt-2 rounded-[24px] border border-black/[0.06] bg-[#fafafa] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6a00]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff236e] [animation-delay:180ms]" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#9a22ff] [animation-delay:360ms]" />
            </div>

            <div className="font-medium">
              Traela está buscando por vos…
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-black/45">
            Comparando productos, vendedores, precios y disponibilidad.
          </p>
        </div>
      </div>
    </div>
  );
}

function TraelaAvatar() {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
      <Image
        src="/traela-mark.png"
        alt="Traela"
        width={44}
        height={44}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function MagicBox({
  query,
  setQuery,
  loading,
  onSubmit,
  hero = false,
  mode,
  setMode,
  selectedImage,
  selectedImageName,
  onImageSelected,
  onRemoveImage,
  textareaRef,
}: {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  onSubmit: (value?: string) => void;
  hero?: boolean;
  mode: MagicBoxMode;
  setMode: (mode: MagicBoxMode) => void;
  selectedImage: string;
  selectedImageName: string;
  onImageSelected: (dataUrl: string, fileName: string) => void;
  onRemoveImage: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageError, setImageError] = useState("");

  function activateTextMode() {
    setMode("text");
    setImageError("");
  }

  function activateLinkMode() {
    setMode("link");
    setImageError("");

    if (selectedImage) {
      onRemoveImage();
    }

    setQuery("");
  }

  function openImagePicker() {
    if (loading) return;

    setImageError("");
    fileInputRef.current?.click();
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Elegí un archivo de imagen.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError(
        "La imagen es demasiado grande. Probá con una de menos de 10 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await compressImage(file);

      setMode("image");
      onImageSelected(dataUrl, file.name);
    } catch (error) {
      console.error(error);

      setImageError(
        "No pudimos preparar esa imagen. Probá con otra."
      );
    }

    event.target.value = "";
  }

  const buttonText =
    loading
      ? "Buscando..."
      : mode === "link"
      ? "Buscar link →"
      : mode === "image"
      ? "Buscar imagen →"
      : "Buscar →";

  return (
    <div
      className={`rounded-[28px] bg-white p-3 text-left ${
        hero
          ? "shadow-[0_25px_70px_rgba(37,0,84,0.22)]"
          : "border border-black/10 shadow-[0_14px_45px_rgba(0,0,0,0.05)]"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="rounded-[21px] border border-black/[0.06] bg-[#fafafa] p-5">
        {mode === "link" && (
          <div className="mb-4 flex items-center justify-between rounded-[14px] border border-[#d8c5ff] bg-[#f5f0ff] px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#7027ff]">
              <span>↗</span>
              <span>Modo link</span>
            </div>

            <button
              type="button"
              onClick={activateTextMode}
              className="text-xs font-medium text-black/40 transition hover:text-black"
            >
              Volver a texto
            </button>
          </div>
        )}

        {mode === "image" && selectedImage && (
          <div className="mb-4 overflow-hidden rounded-[18px] border border-black/[0.08] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
              <div>
                <div className="text-sm font-semibold">
                  Imagen seleccionada
                </div>

                {selectedImageName && (
                  <div className="mt-0.5 max-w-[320px] truncate text-xs text-black/35">
                    {selectedImageName}
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={onRemoveImage}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-sm text-black/50 transition hover:bg-black hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="flex min-h-[180px] items-center justify-center bg-[#f7f7f5] p-4">
              <img
                src={selectedImage}
                alt="Imagen seleccionada"
                className="max-h-[220px] max-w-full rounded-[12px] object-contain"
              />
            </div>
          </div>
        )}

        {mode !== "image" && (
          <textarea
            ref={textareaRef}
            value={query}
            disabled={loading}
            onChange={(event) => setQuery(event.target.value)}
            onPaste={(event) => {
              const pasted = event.clipboardData.getData("text");

              if (/^https?:\/\/\S+$/i.test(pasted.trim())) {
                setMode("link");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder={
              loading
                ? "Traela está buscando..."
                : mode === "link"
                ? "Pegá el link del producto..."
                : "¿Qué querés comprar?"
            }
            className={`w-full resize-none bg-transparent text-black outline-none placeholder:text-black/25 ${
              hero
                ? "min-h-[120px] text-2xl leading-9"
                : "min-h-[60px] text-lg leading-7"
            }`}
          />
        )}

        {mode === "image" && selectedImage && (
          <div className="mt-4">
            <textarea
              value={query}
              disabled={loading}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Agregá algo si querés, por ejemplo: encontrame exactamente este producto..."
              className="min-h-[62px] w-full resize-none bg-transparent text-sm leading-6 text-black outline-none placeholder:text-black/25"
            />
          </div>
        )}

        {imageError && (
          <div className="mt-3 rounded-[12px] bg-red-50 px-3 py-2 text-xs text-red-600">
            {imageError}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              disabled={loading}
              type="button"
              onClick={openImagePicker}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xl shadow-sm transition ${
                mode === "image"
                  ? "bg-[#f0e8ff] text-[#7027ff]"
                  : "bg-white text-black/45 hover:text-[#d500d9]"
              }`}
            >
              ＋
            </button>

            <button
              disabled={loading}
              type="button"
              onClick={openImagePicker}
              className={`rounded-full px-4 py-2.5 text-sm shadow-sm transition ${
                mode === "image"
                  ? "bg-[#f0e8ff] font-semibold text-[#7027ff]"
                  : "bg-white text-black/50 hover:text-[#d500d9]"
              }`}
            >
              Imagen
            </button>

            <button
              disabled={loading}
              type="button"
              onClick={activateLinkMode}
              className={`rounded-full px-4 py-2.5 text-sm shadow-sm transition ${
                mode === "link"
                  ? "bg-[#f0e8ff] font-semibold text-[#7027ff]"
                  : "bg-white text-black/50 hover:text-[#d500d9]"
              }`}
            >
              Link
            </button>

            {(mode === "link" || mode === "image") && (
              <button
                disabled={loading}
                type="button"
                onClick={() => {
                  onRemoveImage();
                  activateTextMode();
                }}
                className="rounded-full bg-white px-4 py-2.5 text-sm text-black/40 shadow-sm transition hover:text-black"
              >
                Texto
              </button>
            )}
          </div>

          <button
            disabled={
              loading || (mode === "image" && !selectedImage)
            }
            onClick={() => onSubmit()}
            className="rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] px-6 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(209,0,209,0.18)] transition hover:scale-[1.02] disabled:opacity-60"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroCapability({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-white/10 p-3 backdrop-blur">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg">
        {icon}
      </div>

      <div className="text-sm font-medium leading-5">
        {label}
      </div>
    </div>
  );
}

function MiniRecommendation({
  onComingSoon,
}: {
  onComingSoon: (feature: string) => void;
}) {
  return (
    <div className="grid overflow-hidden rounded-[24px] border border-black/[0.07] bg-white md:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-[240px] items-center justify-center overflow-hidden bg-[#f6f6f4] p-6">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=90"
          alt="Zapatillas de running"
          className="h-full max-h-[230px] w-full object-contain"
        />
      </div>

      <div className="p-6">
        <div className="inline-flex rounded-full bg-[#f1eaff] px-3 py-1.5 text-xs font-semibold text-[#6c2cff]">
          ✦ Mejor opción
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
          Nike Running Shoes
        </h3>

        <p className="mt-1 text-sm text-black/45">
          Zapatillas de running para hombre
        </p>

        <div className="mt-6 grid grid-cols-2 gap-5">
          <div>
            <div className="text-xs text-black/35">
              Precio final
            </div>

            <div className="mt-1 text-xl font-semibold">
              ₲ 899.000
            </div>
          </div>

          <div>
            <div className="text-xs text-black/35">
              Confianza
            </div>

            <div className="mt-1 text-xl font-semibold text-[#15a64a]">
              94%
            </div>
          </div>
        </div>

        <button
          onClick={() => onComingSoon("Vista de producto demo")}
          className="mt-7 rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] px-5 py-3 text-sm font-semibold text-white"
        >
          Ver detalle →
        </button>
      </div>
    </div>
  );
}

function RecommendedProduct({
  product,
  onComingSoon,
}: {
  product: SearchProduct;
  onComingSoon: (feature: string) => void;
}) {
  const finalPrice = formatPYG(product.traela_price_pyg);

  return (
    <article className="overflow-hidden rounded-[30px] border border-black/[0.07] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
      <div className="grid md:grid-cols-[1.05fr_1fr]">
        <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden bg-[#f6f6f3]">
          <div className="absolute left-5 top-5 z-10 rounded-full bg-[#eff9f1] px-4 py-2 text-xs font-semibold text-[#159447]">
            ✦ Mejor opción
          </div>

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full max-h-[390px] w-full object-contain p-8"
            />
          ) : (
            <div className="text-[118px]">🛍️</div>
          )}
        </div>

        <div className="flex flex-col p-8 md:p-10">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7027ff]">
            {product.source || "Tienda"}
          </div>

          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
            {product.title}
          </h3>

          <div className="mt-8">
            <div className="text-sm text-black/40">
              {finalPrice
                ? "Precio final para vos"
                : "Precio del producto"}
            </div>

            <div className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
              {finalPrice ||
                formatUSD(product.source_price_usd) ||
                "Precio no disponible"}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-5 border-t border-black/[0.07] pt-6 text-sm">
            <div>
              <div className="text-black/35">
                Valoración
              </div>

              <div className="mt-1 font-medium">
                {product.rating
                  ? `★ ${product.rating}${
                      product.reviews
                        ? ` (${formatNumber(product.reviews)})`
                        : ""
                    }`
                  : "Sin valoración"}
              </div>
            </div>

            <div>
              <div className="text-black/35">
                Entrega
              </div>

              <div className="mt-1 font-medium">
                {product.delivery || "A confirmar"}
              </div>
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-9">
            <ProductLink
              product={product}
              className="flex-1 rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] py-3.5 text-center font-semibold text-white transition hover:scale-[1.01]"
            >
              Ver producto →
            </ProductLink>

            <button
              onClick={() => onComingSoon("Guardar productos")}
              className="rounded-full border border-black/10 px-5 py-3.5 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AlternativeProduct({
  product,
}: {
  product: SearchProduct;
}) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex aspect-[1.18] items-center justify-center overflow-hidden bg-[#f7f7f4]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-contain p-5"
          />
        ) : (
          <div className="text-[72px]">🛍️</div>
        )}
      </div>

      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.11em] text-black/30">
          {product.source || "Tienda"}
        </div>

        <h3 className="mt-2 line-clamp-2 font-semibold tracking-[-0.025em]">
          {product.title}
        </h3>

        <div className="mt-5 text-xl font-semibold">
          {formatUSD(product.source_price_usd) ||
            "Precio no disponible"}
        </div>

        <ProductLink
          product={product}
          className="mt-5 block w-full rounded-full border border-black/10 py-3 text-center text-sm font-medium transition hover:border-[#d500dc] hover:text-[#a026ff]"
        >
          Ver opción
        </ProductLink>
      </div>
    </article>
  );
}

function ProductLink({
  product,
  children,
  className,
}: {
  product: SearchProduct;
  children: ReactNode;
  className: string;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      onClick={() => {
        sessionStorage.setItem(
          "traela_selected_product",
          JSON.stringify(product)
        );
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

function VideoModal({
  onClose,
}: {
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1050px] overflow-hidden rounded-[28px] bg-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur transition hover:bg-white hover:text-black"
          aria-label="Cerrar video"
        >
          ×
        </button>

        <video
          src="/videos/traela-intro.mp4"
          controls
          autoPlay
          playsInline
          className="max-h-[85vh] w-full bg-black"
        >
          Tu navegador no soporta reproducción de video.
        </video>
      </div>
    </div>
  );
}

function ComingSoonModal({
  feature,
  onClose,
}: {
  feature: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded-[30px] bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-6">
          <Image
            src="/traela-mark.png"
            alt="Traela"
            width={52}
            height={52}
          />

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f5] text-black/50 hover:bg-black hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-6 text-sm font-semibold text-[#8c2cff]">
          Próximamente
        </div>

        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
          {feature}
        </h2>

        <p className="mt-4 leading-7 text-black/50">
          Estamos construyendo esta parte de Traela. La experiencia completa
          va a permitirte comprar, guardar, gestionar pedidos y seguir tus
          compras desde un solo lugar.
        </p>

        <button
          onClick={onClose}
          className="mt-7 w-full rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] py-3.5 font-semibold text-white"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

async function compressImage(file: File): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadBrowserImage(originalDataUrl);

  const MAX_DIMENSION = 1200;

  let width = image.width;
  let height = image.height;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(
      MAX_DIMENSION / width,
      MAX_DIMENSION / height
    );

    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create image canvas");
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.82);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read image"));
    };

    reader.onerror = () =>
      reject(new Error("Could not read image"));

    reader.readAsDataURL(file);
  });
}

function loadBrowserImage(
  src: string
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(new Error("Could not load image"));

    image.src = src;
  });
}

function formatPYG(value: number | null) {
  if (!value) return null;

  return `₲ ${Math.round(value).toLocaleString("es-PY")}`;
}

function formatUSD(value: number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return `$${value.toFixed(2)}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("es-PY");
}