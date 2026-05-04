import { NextResponse } from "next/server";

// Cabeceras CORS unificadas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Función para retornar siempre con CORS
function apiResponse(body: Record<string, unknown>, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "Genera contenido bíblico profundo.";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No se recibió respuesta.";

    return apiResponse({ success: true, text });
  } catch (error) {
    return apiResponse({ success: false, error: "Error al generar contenido" }, 500);
  }
}

// Manejo de preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}
