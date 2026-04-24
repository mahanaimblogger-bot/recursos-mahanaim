import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt es requerido" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Sos un asistente especializado en recursos bíblicos educativos. Respondés SIEMPRE con JSON válido puro. IMPORTANTE: en el contenido_html usá SIEMPRE comillas simples para atributos HTML (ej: style='color:red' NO style=\"color:red\"). Sin markdown, sin explicaciones. Solo el JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4000,
    });

    const text = completion.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en /api/generate:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
