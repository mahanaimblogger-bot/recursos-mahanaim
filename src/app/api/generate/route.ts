import { NextResponse } from "next/server";

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
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    const text =
      data.choices?.[0]?.message?.content ||
      "No se recibió respuesta.";

    return NextResponse.json({
      success: true,
      text
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error al generar contenido"
    });
  }
}