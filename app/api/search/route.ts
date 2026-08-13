import { NextRequest, NextResponse } from "next/server";

const N8N_SEARCH_URL =
  "https://traela.app.n8n.cloud/webhook/search";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          status: "error",
          message: "Traela search failed.",
          details: errorText,
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