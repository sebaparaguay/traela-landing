"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SearchProduct = {
  id: string;
  title: string;
  source: string;
  source_url: string;
  source_price_usd: number | null;
  image_url: string | null;
  images?: string[];
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

  recommendation: {
    product_id: string;
    confidence: number;
    reason: string;
  };

  products_count: number;
  products: SearchProduct[];
};

export default function ProductPage() {
  const [product, setProduct] = useState<SearchProduct | null>(null);

  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [assistantMessage, setAssistantMessage] = useState("");
  const [alternatives, setAlternatives] = useState<SearchProduct[]>([]);

  const [sessionId, setSessionId] = useState("");

  const [comingSoonFeature, setComingSoonFeature] =
    useState<string | null>(null);

  useEffect(() => {
    const storedProduct = sessionStorage.getItem(
      "traela_selected_product"
    );

    if (storedProduct) {
      try {
        setProduct(JSON.parse(storedProduct));
      } catch {
        setProduct(null);
      }
    }

    const existingSession = localStorage.getItem("traela_session_id");

    if (existingSession) {
      setSessionId(existingSession);
    } else {
      const newSession = crypto.randomUUID();

      localStorage.setItem("traela_session_id", newSession);
      setSessionId(newSession);
    }
  }, []);

  async function submitFollowUp(value?: string) {
    const finalQuery = (value ?? query).trim();

    if (!finalQuery || loading) return;

    setLoading(true);
    setError("");
    setLastQuery(finalQuery);
    setQuery("");
    setAssistantMessage("");
    setAlternatives([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: finalQuery,
          session_id: sessionId || crypto.randomUUID(),
          locale: "es-PY",
          currency: "PYG",
        }),
      });

      const data: SearchResponse = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          "No pudimos completar esa búsqueda."
        );
      }

      const recommendedProduct =
        data.products.find((item) => item.recommended) ||
        data.products.find(
          (item) =>
            String(item.id) ===
            String(data.recommendation.product_id)
        ) ||
        data.products[0];

      if (!recommendedProduct) {
        throw new Error(
          "No encontramos una opción para mostrar."
        );
      }

      setProduct(recommendedProduct);

      sessionStorage.setItem(
        "traela_selected_product",
        JSON.stringify(recommendedProduct)
      );

      setAssistantMessage(
        data.recommendation.reason ||
          "Encontré una nueva opción para vos."
      );

      setAlternatives(
        data.products.filter(
          (item) => item.id !== recommendedProduct.id
        )
      );
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

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-[#111111]">
        <Header onComingSoon={setComingSoonFeature} />

        <section className="mx-auto max-w-[900px] px-6 py-24 text-center">
          <Image
            src="/traela-mark.png"
            alt="Traela"
            width={70}
            height={70}
            className="mx-auto"
          />

          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
            No encontramos este producto.
          </h1>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] px-6 py-3 font-semibold text-white"
          >
            Volver a buscar
          </Link>
        </section>

        {comingSoonFeature && (
          <ComingSoonModal
            feature={comingSoonFeature}
            onClose={() => setComingSoonFeature(null)}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <Header onComingSoon={setComingSoonFeature} />

      <section className="mx-auto max-w-[1280px] px-5 pb-24 pt-8 md:px-8">
        <div className="mb-7">
          <Link
            href="/"
            className="text-sm font-medium text-black/45 transition hover:text-black"
          >
            ← Volver a resultados
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <ProductGallery product={product} />

            {alternatives.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-semibold">
                  También encontré estas opciones
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {alternatives.slice(0, 4).map((item) => (
                    <AlternativeProduct
                      key={item.id}
                      product={item}
                      onSelect={() => {
                        setProduct(item);

                        sessionStorage.setItem(
                          "traela_selected_product",
                          JSON.stringify(item)
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <ProductSummary
              product={product}
              onComingSoon={setComingSoonFeature}
            />

            <div className="mt-6 rounded-[26px] border border-black/[0.07] bg-white p-6">
              <div className="flex gap-3">
                <TraelaAvatar />

                <div>
                  <div className="font-semibold">
                    Preguntale a Traela
                  </div>

                  <p className="mt-1 text-sm leading-6 text-black/45">
                    La conversación sigue acá.
                  </p>
                </div>
              </div>

              {lastQuery && (
                <div className="mt-6 flex justify-end">
                  <div className="max-w-[85%] rounded-[20px] rounded-br-[6px] bg-[#f0eaff] px-4 py-3 text-sm">
                    {lastQuery}
                  </div>
                </div>
              )}

              {!loading && assistantMessage && (
                <div className="mt-5 flex gap-3">
                  <TraelaAvatar />

                  <div className="max-w-[85%] rounded-[20px] bg-[#fafafa] px-4 py-3 text-sm leading-6">
                    {assistantMessage}
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-[18px] bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <textarea
                  value={query}
                  disabled={loading}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      submitFollowUp();
                    }
                  }}
                  placeholder="Preguntale a Traela..."
                  className="min-h-[90px] w-full resize-none rounded-[18px] border border-black/[0.08] bg-[#fafafa] p-4 outline-none"
                />

                <button
                  onClick={() => submitFollowUp()}
                  disabled={loading}
                  className="mt-3 w-full rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] py-3 font-semibold text-white"
                >
                  {loading ? "Buscando..." : "Enviar →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {comingSoonFeature && (
        <ComingSoonModal
          feature={comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
        />
      )}
    </main>
  );
}

function Header({
  onComingSoon,
}: {
  onComingSoon: (feature: string) => void;
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
            className="h-auto w-[145px] md:w-[165px]"
          />
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onComingSoon("Mis pedidos")}
            className="hidden text-black/55 sm:block"
          >
            Mis pedidos
          </button>

          <button
            onClick={() => onComingSoon("Tu cuenta Traela")}
            className="rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff2a72] to-[#d600ff] px-6 py-3 text-white"
          >
            Empezar
          </button>
        </div>
      </div>
    </header>
  );
}

function ProductGallery({
  product,
}: {
  product: SearchProduct;
}) {
  const galleryImages = useMemo(() => {
    const images = [
      ...(product.images || []),
      product.image_url || "",
    ];

    return Array.from(
      new Set(images.filter(Boolean))
    ).slice(0, 5);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(
    galleryImages[0] || ""
  );

  useEffect(() => {
    setSelectedImage(galleryImages[0] || "");
  }, [product.id, galleryImages]);

  return (
    <div>
      <div className="flex min-h-[540px] items-center justify-center rounded-[30px] bg-[#f7f7f4] p-10">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={product.title}
            className="max-h-[470px] w-full object-contain"
          />
        ) : (
          <div className="text-[150px]">🛍️</div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {galleryImages.map((image) => (
            <button
              key={image}
              onClick={() => setSelectedImage(image)}
              className="aspect-square overflow-hidden rounded-[18px] border border-black/[0.08] bg-[#f7f7f4]"
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-contain p-3"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductSummary({
  product,
  onComingSoon,
}: {
  product: SearchProduct;
  onComingSoon: (feature: string) => void;
}) {
  return (
    <div className="rounded-[28px] border border-black/[0.07] bg-white p-8">
      <div className="text-sm font-semibold text-[#7027ff]">
        {product.source || "Tienda"}
      </div>

      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em]">
        {product.title}
      </h1>

      <div className="mt-7 border-t border-black/[0.07] pt-6">
        <div className="text-sm text-black/40">
          Precio final para vos
        </div>

        <div className="mt-1 text-4xl font-semibold">
          {product.traela_price_pyg
            ? formatPYG(product.traela_price_pyg)
            : formatUSD(product.source_price_usd)}
        </div>
      </div>

      <button
        onClick={() => onComingSoon("Confirmar pedido")}
        className="mt-8 w-full rounded-full bg-gradient-to-r from-[#ff6a00] via-[#ff236e] to-[#c900ff] py-4 font-semibold text-white"
      >
        Confirmar pedido →
      </button>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => onComingSoon("Compartir productos")}
          className="rounded-full border border-black/10 py-3 text-sm font-medium"
        >
          Compartir
        </button>

        <button
          onClick={() => onComingSoon("Guardar productos")}
          className="rounded-full border border-black/10 py-3 text-sm font-medium"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function TraelaAvatar() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
      <Image
        src="/traela-mark.png"
        alt="Traela"
        width={40}
        height={40}
      />
    </div>
  );
}

function AlternativeProduct({
  product,
  onSelect,
}: {
  product: SearchProduct;
  onSelect: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-black/[0.07]">
      <div className="flex aspect-[1.2] items-center justify-center bg-[#f7f7f4]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-contain p-5"
          />
        ) : (
          <div className="text-[60px]">🛍️</div>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 font-semibold">
          {product.title}
        </h3>

        <button
          onClick={onSelect}
          className="mt-5 w-full rounded-full border border-black/10 py-2.5 text-sm font-medium"
        >
          Ver esta opción
        </button>
      </div>
    </article>
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
        <Image
          src="/traela-mark.png"
          alt="Traela"
          width={52}
          height={52}
        />

        <div className="mt-6 text-sm font-semibold text-[#8c2cff]">
          Próximamente
        </div>

        <h2 className="mt-2 text-3xl font-semibold">
          {feature}
        </h2>

        <p className="mt-4 leading-7 text-black/50">
          Estamos construyendo esta parte de Traela para la experiencia
          completa.
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

function formatPYG(value: number) {
  return `₲ ${Math.round(value).toLocaleString("es-PY")}`;
}

function formatUSD(value: number | null) {
  if (value === null || value === undefined) {
    return "A confirmar";
  }

  return `$${value.toFixed(2)}`;
}