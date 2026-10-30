import { NextRequest, NextResponse } from "next/server";

const N8N_SEARCH_URL =
  "https://traela.app.n8n.cloud/webhook/search";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body.query !== "string" || body.query.length > 1500 || (body.image_url && (typeof body.image_url !== "string" || body.image_url.length > 2800000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(body.image_url)))) {
      return NextResponse.json({message: "Enviá una búsqueda o una imagen válida."}, {status:400});
    }
    const response = await fetch(N8N_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: body.query || "",
        image_url: body.image_url || "",
        session_id: body.session_id || crypto.randomUUID(),
        locale: body.locale || "es-PY",
        currency: body.currency || "PYG",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      await response.text();

      return NextResponse.json(
        {
          status: "error",
          message: "Traela search failed.",

        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Traela search API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to complete search.",
      },
      { status: 500 }
    );
  }
}
