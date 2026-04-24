import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(request: Request) {
  try {
    const { prompt, max_tokens } = await request.json();

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
            "Sos un asistente especializado en recursos bíblicos educativos. Respondés SIEMPRE con JSON válido puro, sin markdown, sin explicaciones, sin comentarios. Solo el objeto JSON. REGLAS: 1) NO uses ```json ni ``` fences. 2) NO agregues texto antes ni después del JSON. 3) En contenido_html usá SIEMPRE comillas simples para atributos HTML (ej: style='color:red' NO style=\"color:red\"). 4) No dejes trailing commas. 5) Asegurate de cerrar todas las llaves y corchetes correctamente.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: max_tokens || 8000,
    });

    const text = completion.choices?.[0]?.message?.content || "";

    if (!text) {
      return NextResponse.json(
        { error: "La IA no devolvió contenido. Intentá de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en /api/generate:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
