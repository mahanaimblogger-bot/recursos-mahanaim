"use client";

import { useState, useRef, useCallback } from "react";

// ── Datos bíblicos ──
const LIBROS_SLUGS: Record<string, string> = {
  "Génesis": "genesis", "Éxodo": "exodo", "Levítico": "levitico",
  "Números": "numeros", "Deuteronomio": "deuteronomio", "Josué": "josue",
  "Jueces": "jueces", "Rut": "rut", "1 Samuel": "1-samuel", "2 Samuel": "2-samuel",
  "1 Reyes": "1-reyes", "2 Reyes": "2-reyes", "1 Crónicas": "1-cronicas",
  "2 Crónicas": "2-cronicas", "Esdras": "esdras", "Nehemías": "nehemias",
  "Ester": "ester", "Job": "job", "Salmos": "salmos", "Proverbios": "proverbios",
  "Eclesiastés": "eclesiastes", "Cantares": "cantares", "Isaías": "isaias",
  "Jeremías": "jeremias", "Lamentaciones": "lamentaciones", "Ezequiel": "ezequiel",
  "Daniel": "daniel", "Oseas": "oseas", "Joel": "joel", "Amós": "amos",
  "Abdías": "abdias", "Jonás": "jonas", "Miqueas": "miqueas", "Nahúm": "nahum",
  "Habacuc": "habacuc", "Sofonías": "sofonias", "Hageo": "hageo",
  "Zacarías": "zacarias", "Malaquías": "malaquias", "Mateo": "mateo",
  "Marcos": "marcos", "Lucas": "lucas", "Juan": "juan", "Hechos": "hechos",
  "Romanos": "romanos", "1 Corintios": "1-corintios", "2 Corintios": "2-corintios",
  "Gálatas": "galatas", "Efesios": "efesios", "Filipenses": "filipenses",
  "Colosenses": "colosenses", "1 Tesalonicenses": "1-tesalonicenses",
  "2 Tesalonicenses": "2-tesalonicenses", "1 Timoteo": "1-timoteo",
  "2 Timoteo": "2-timoteo", "Tito": "tito", "Filemón": "filemon",
  "Hebreos": "hebreos", "Santiago": "santiago", "1 Pedro": "1-pedro",
  "2 Pedro": "2-pedro", "1 Juan": "1-juan", "2 Juan": "2-juan",
  "3 Juan": "3-juan", "Judas": "judas", "Apocalipsis": "apocalipsis"
};

const LIBROS_CAPITULOS: Record<string, number> = {
  "Génesis": 50, "Éxodo": 40, "Levítico": 27, "Números": 36, "Deuteronomio": 34,
  "Josué": 24, "Jueces": 21, "Rut": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Reyes": 22, "2 Reyes": 25, "1 Crónicas": 29, "2 Crónicas": 36,
  "Esdras": 10, "Nehemías": 13, "Ester": 10, "Job": 42, "Salmos": 150,
  "Proverbios": 31, "Eclesiastés": 12, "Cantares": 8, "Isaías": 66,
  "Jeremías": 52, "Lamentaciones": 5, "Ezequiel": 48, "Daniel": 12,
  "Oseas": 14, "Joel": 3, "Amós": 9, "Abdías": 1, "Jonás": 4,
  "Miqueas": 7, "Nahúm": 3, "Habacuc": 3, "Sofonías": 3, "Hageo": 2,
  "Zacarías": 14, "Malaquías": 4, "Mateo": 28, "Marcos": 16, "Lucas": 24,
  "Juan": 21, "Hechos": 28, "Romanos": 16, "1 Corintios": 16, "2 Corintios": 13,
  "Gálatas": 6, "Efesios": 6, "Filipenses": 4, "Colosenses": 4,
  "1 Tesalonicenses": 5, "2 Tesalonicenses": 3, "1 Timoteo": 6, "2 Timoteo": 4,
  "Tito": 3, "Filemón": 1, "Hebreos": 13, "Santiago": 5, "1 Pedro": 5,
  "2 Pedro": 3, "1 Juan": 5, "2 Juan": 1, "3 Juan": 1, "Judas": 1, "Apocalipsis": 22
};

// Períodos bíblicos para la línea de tiempo general del libro
const PERIODOS_BIBLICOS: Record<string, { nombre: string; color: string; inicio: number; fin: number }> = {
  genesis: { nombre: "Creación y Patriarcas", color: "#8B4513", inicio: 0, fin: 20 },
  exodo: { nombre: "Éxodo y Peregrinación", color: "#D2691E", inicio: 20, fin: 40 },
  levitico: { nombre: "Ley y Santidad", color: "#B8860B", inicio: 20, fin: 40 },
  numeros: { nombre: "Peregrinación por el Desierto", color: "#CD853F", inicio: 20, fin: 40 },
  deuteronomio: { nombre: "Renovación del Pacto", color: "#DAA520", inicio: 20, fin: 40 },
  josue: { nombre: "Conquista de Canaán", color: "#2E8B57", inicio: 40, fin: 50 },
  jueces: { nombre: "Época de los Jueces", color: "#3CB371", inicio: 50, fin: 65 },
  rut: { nombre: "Rut y la Fidelidad", color: "#66CDAA", inicio: 55, fin: 65 },
  "1-samuel": { nombre: "Nacimiento de la Monarquía", color: "#4682B4", inicio: 65, fin: 75 },
  "2-samuel": { nombre: "Reinado de David", color: "#5F9EA0", inicio: 75, fin: 80 },
  "1-reyes": { nombre: "Esplendor y División", color: "#6495ED", inicio: 80, fin: 90 },
  "2-reyes": { nombre: "Exilio de Israel y Judá", color: "#7B68EE", inicio: 90, fin: 100 },
  "1-cronicas": { nombre: "Genealogía y David", color: "#5F9EA0", inicio: 75, fin: 80 },
  "2-cronicas": { nombre: "Historia del Templo", color: "#6495ED", inicio: 80, fin: 100 },
  esdras: { nombre: "Retorno del Exilio", color: "#9370DB", inicio: 100, fin: 105 },
  nehemias: { nombre: "Reconstrucción de Jerusalén", color: "#8A2BE2", inicio: 100, fin: 105 },
  ester: { nombre: "La Reina en Susa", color: "#DDA0DD", inicio: 100, fin: 105 },
  job: { nombre: "El Sufrimiento Justo", color: "#BC8F8F", inicio: 20, fin: 60 },
  salmos: { nombre: "Alabanza y Oración", color: "#FFD700", inicio: 40, fin: 100 },
  proverbios: { nombre: "Sabiduría de Dios", color: "#F0E68C", inicio: 70, fin: 100 },
  ecleciastes: { nombre: "Vanidad y Propósito", color: "#D2B48C", inicio: 70, fin: 100 },
  cantares: { nombre: "Amor Divino", color: "#FF69B4", inicio: 70, fin: 100 },
  isaias: { nombre: "Profecía Mesiánica", color: "#4169E1", inicio: 90, fin: 100 },
  jeremias: { nombre: "Lamentación y Esperanza", color: "#6A5ACD", inicio: 90, fin: 100 },
  lamentaciones: { nombre: "Lamento por Jerusalén", color: "#7B68EE", inicio: 95, fin: 100 },
  ezequiel: { nombre: "Visión de Restauración", color: "#483D8B", inicio: 95, fin: 105 },
  daniel: { nombre: "Profecía y Fidelidad", color: "#191970", inicio: 90, fin: 105 },
  oseas: { nombre: "Amor Inagotable", color: "#DB7093", inicio: 90, fin: 100 },
  joel: { nombre: "El Día del Señor", color: "#C71585", inicio: 85, fin: 100 },
  amos: { nombre: "Justicia Social", color: "#B22222", inicio: 85, fin: 95 },
  abdias: { nombre: "Juicio sobre Edom", color: "#A0522D", inicio: 90, fin: 100 },
  jonas: { nombre: "Misericordia Universal", color: "#20B2AA", inicio: 85, fin: 95 },
  miqueas: { nombre: "Justicia y Humildad", color: "#5F9EA0", inicio: 85, fin: 100 },
  nahum: { nombre: "Caída de Nínive", color: "#8B0000", inicio: 85, fin: 100 },
  habacuc: { nombre: "Fe en la Crisis", color: "#556B2F", inicio: 90, fin: 100 },
  sofonias: { nombre: "El Día de Ira", color: "#696969", inicio: 90, fin: 100 },
  hageo: { nombre: "Reconstruir el Templo", color: "#B8860B", inicio: 100, fin: 105 },
  zacarias: { nombre: "Visión del Futuro", color: "#DAA520", inicio: 100, fin: 105 },
  malaquias: { nombre: "Última Advertencia", color: "#8B4513", inicio: 100, fin: 105 },
  mateo: { nombre: "El Rey Mesías", color: "#1E90FF", inicio: 5, fin: 8 },
  marcos: { nombre: "El Siervo Fiel", color: "#00CED1", inicio: 5, fin: 8 },
  lucas: { nombre: "El Salvador Universal", color: "#32CD32", inicio: 5, fin: 8 },
  juan: { nombre: "La Palabra Viva", color: "#FFD700", inicio: 5, fin: 8 },
  hechos: { nombre: "La Iglesia Naciente", color: "#FF8C00", inicio: 8, fin: 15 },
  romanos: { nombre: "Justicia por Fe", color: "#4169E1", inicio: 15, fin: 20 },
  "1-corintios": { nombre: "Iglesia y Santidad", color: "#6495ED", inicio: 15, fin: 20 },
  "2-corintios": { nombre: "Ministerio y Sufrimiento", color: "#7B68EE", inicio: 15, fin: 20 },
  galatas: { nombre: "Libertad en Cristo", color: "#9370DB", inicio: 15, fin: 20 },
  efesios: { nombre: "Iglesia y Gracia", color: "#8A2BE2", inicio: 15, fin: 20 },
  filipenses: { nombre: "Gozo en Cristo", color: "#DA70D6", inicio: 15, fin: 20 },
  colosenses: { nombre: "Supremacía de Cristo", color: "#BA55D3", inicio: 15, fin: 20 },
  "1-tesalonicenses": { nombre: "Esperanza del Regreso", color: "#DDA0DD", inicio: 15, fin: 20 },
  "2-tesalonicenses": { nombre: "Estabilidad en Cristo", color: "#EE82EE", inicio: 15, fin: 20 },
  "1-timoteo": { nombre: "Liderazgo Pastoral", color: "#FF6347", inicio: 15, fin: 20 },
  "2-timoteo": { nombre: "Fidelidad Final", color: "#FF4500", inicio: 20, fin: 25 },
  tito: { nombre: "Orden en la Iglesia", color: "#FF7F50", inicio: 15, fin: 20 },
  filemon: { nombre: "Reconciliación", color: "#F4A460", inicio: 15, fin: 20 },
  hebreos: { nombre: "Superioridad de Cristo", color: "#CD5C5C", inicio: 15, fin: 20 },
  santiago: { nombre: "Fe Viva", color: "#A0522D", inicio: 15, fin: 25 },
  "1-pedro": { nombre: "Esperanza en el Sufrimiento", color: "#BC8F8F", inicio: 15, fin: 25 },
  "2-pedro": { nombre: "Crecimiento y Vigilancia", color: "#D2691E", inicio: 20, fin: 25 },
  "1-juan": { nombre: "Amor y Luz", color: "#FFD700", inicio: 15, fin: 25 },
  "2-juan": { nombre: "Verdad y Amor", color: "#FFA500", inicio: 20, fin: 25 },
  "3-juan": { nombre: "Hospitalidad", color: "#FF8C00", inicio: 20, fin: 25 },
  judas: { nombre: "Contender por la Fe", color: "#B22222", inicio: 20, fin: 25 },
  apocalipsis: { nombre: "La Victoria Final", color: "#C0C0C0", inicio: 25, fin: 30 },
};

const TIPOS = [
  { id: "estudio", icon: "📖", label: "Estudio Bíblico", gen: false },
  { id: "sermon", icon: "🛐", label: "Sermón / Prédica", gen: false },
  { id: "video", icon: "🎬", label: "Video (YouTube)", gen: false },
  { id: "audio", icon: "🎧", label: "Audio / Podcast", gen: false },
  { id: "imagen", icon: "🖼️", label: "Imagen / Ilustración", gen: false },
  { id: "diapositiva", icon: "📊", label: "Diapositivas", gen: false },
  { id: "pdf", icon: "📄", label: "PDF / Documento", gen: false },
  { id: "mapa", icon: "🗺️", label: "Mapa Interactivo", gen: false },
  { id: "enlace", icon: "🔗", label: "Recurso Externo", gen: false },
  { id: "cronologia", icon: "⏳", label: "Línea de Tiempo", gen: true },
  { id: "personaje", icon: "👤", label: "Ficha de Personaje", gen: true },
  { id: "glosario", icon: "📚", label: "Glosario de Términos", gen: true },
  { id: "himno", icon: "🎵", label: "Himno / Alabanza", gen: false },
  { id: "quiz", icon: "🧩", label: "Cuestionario", gen: true },
  { id: "devocional", icon: "✍️", label: "Devocional", gen: true },
  { id: "hoja", icon: "🖨️", label: "Hoja de Trabajo", gen: true },
  { id: "testimonio", icon: "🎙️", label: "Testimonio", gen: false },
  { id: "exegesis", icon: "🔬", label: "Comentario Exegético", gen: false },
  { id: "plan", icon: "🧭", label: "Plan de Lectura", gen: true },
];

// ── Paleta ──
const C = {
  bg: "#0f0e0c",
  surface: "#1a1814",
  card: "#221f1a",
  border: "#3a3228",
  gold: "#c9a227",
  goldLight: "#e8c96d",
  goldDim: "#7a5f10",
  text: "#e8e0d0",
  muted: "#8a7d6a",
  accent: "#bf360c",
  green: "#2d6a4f",
  purple: "#5e3a7a",
};

// ── Tipos ──
interface CtxData {
  libro: string;
  slug: string;
  cap: string;
  modo: string;
  tipo?: string;
}

interface StepResult {
  json: Record<string, unknown>;
  ctx: CtxData;
}

// ── Componentes auxiliares ──
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: C.muted, marginBottom: 5, display: "block", letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      style={{ background: "transparent", color: copied ? C.green : C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "Georgia, serif" }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
    >
      {copied ? "✅ Copiado" : "📋 Copiar"}
    </button>
  );
}

function PathBox({ children }: { children: React.ReactNode }) {
  return <code style={{ background: "#061008", border: "1px solid #1a4a28", borderRadius: 5, padding: "3px 8px", fontFamily: "monospace", fontSize: 12, color: "#7dda9a" }}>{children}</code>;
}

function InstrStep({ n, children }: { n: string | number; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.green, color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div style={{ fontSize: 13, color: "#c8e6d8", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ── Línea de tiempo visual dual ──
function TimelineDual({ libro, slug, cap }: { libro: string; slug: string; cap: string }) {
  const totalCaps = LIBROS_CAPITULOS[libro] || 1;
  const capNum = parseInt(cap) || 1;
  const capPercent = Math.min((capNum / totalCaps) * 100, 100);
  const periodo = PERIODOS_BIBLICOS[slug];

  const esAT = Object.keys(LIBROS_SLUGS).indexOf(libro) < 39;
  const totalLibrosAT = 39;

  // Posición del libro en su testamento
  const libroIndex = Object.keys(LIBROS_SLUGS).indexOf(libro);
  const testamentoTotal = esAT ? totalLibrosAT : Object.keys(LIBROS_SLUGS).length - totalLibrosAT;
  const testamentoIndex = esAT ? libroIndex : libroIndex - totalLibrosAT;
  const libroPercent = ((testamentoIndex + 0.5) / testamentoTotal) * 100;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
      {/* Línea del capítulo dentro del libro */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.gold, marginBottom: 8, fontWeight: "bold", letterSpacing: 1 }}>
          📍 POSICIÓN DEL CAPÍTULO DENTRO DEL LIBRO
        </div>
        <div style={{ background: C.surface, borderRadius: 8, padding: "12px 16px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 6 }}>
            <span>Cap. 1</span>
            <span style={{ color: C.goldLight, fontWeight: "bold" }}>{libro} — Cap. {cap} de {totalCaps}</span>
            <span>Cap. {totalCaps}</span>
          </div>
          {/* Barra de progreso */}
          <div style={{ position: "relative", height: 32, background: "#0a0908", borderRadius: 6, overflow: "hidden" }}>
            {/* Marcas de capítulos */}
            {Array.from({ length: Math.min(totalCaps, 30) }, (_, i) => {
              const pct = ((i + 1) / totalCaps) * 100;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${pct}%`,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: pct === capPercent ? "transparent" : "rgba(201,162,39,0.15)",
                  }}
                />
              );
            })}
            {/* Rango del capítulo seleccionado */}
            <div
              style={{
                position: "absolute",
                left: `${Math.max(0, capPercent - (100 / totalCaps) / 2)}%`,
                width: `${100 / totalCaps}%`,
                top: 0,
                bottom: 0,
                background: `linear-gradient(180deg, ${C.gold}44, ${C.goldDim}88)`,
                borderRadius: 3,
                border: `2px solid ${C.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 12px ${C.gold}66`,
              }}
            >
              <span style={{ fontSize: 10, color: C.goldLight, fontWeight: "bold" }}>{cap}</span>
            </div>
          </div>
          {/* Indicador numérico */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <span style={{ background: C.goldDim, color: C.goldLight, fontSize: 11, padding: "2px 10px", borderRadius: 10, border: `1px solid ${C.gold}` }}>
              Capítulo {cap} / {totalCaps} — {capPercent.toFixed(1)}% del libro
            </span>
          </div>
        </div>
      </div>

      {/* Línea del libro dentro del testamento / línea general */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.gold, marginBottom: 8, fontWeight: "bold", letterSpacing: 1 }}>
          📖 POSICIÓN DEL LIBRO EN LA BIBLIA ({esAT ? "ANTIGUO TESTAMENTO" : "NUEVO TESTAMENTO"})
        </div>
        <div style={{ background: C.surface, borderRadius: 8, padding: "12px 16px", position: "relative" }}>
          <div style={{ position: "relative", height: 40, background: "#0a0908", borderRadius: 6, overflow: "hidden" }}>
            {/* Marcar cada libro */}
            {Object.keys(LIBROS_SLUGS).map((l, i) => {
              const isThisTestament = esAT ? i < totalLibrosAT : i >= totalLibrosAT;
              if (!isThisTestament) return null;
              const idx = esAT ? i : i - totalLibrosAT;
              const total = esAT ? totalLibrosAT : Object.keys(LIBROS_SLUGS).length - totalLibrosAT;
              const pct = ((idx + 0.5) / total) * 100;
              const isCurrentBook = l === libro;
              const bookSlug = LIBROS_SLUGS[l];
              const p = PERIODOS_BIBLICOS[bookSlug];
              return (
                <div
                  key={l}
                  style={{
                    position: "absolute",
                    left: `${pct}%`,
                    top: isCurrentBook ? 4 : 12,
                    width: isCurrentBook ? 4 : 2,
                    height: isCurrentBook ? 32 : 16,
                    background: isCurrentBook ? C.gold : (p?.color || C.border),
                    borderRadius: 2,
                    transform: "translateX(-50%)",
                    transition: "all 0.3s",
                    boxShadow: isCurrentBook ? `0 0 8px ${C.gold}88` : "none",
                    zIndex: isCurrentBook ? 2 : 1,
                  }}
                  title={l}
                />
              );
            })}
            {/* Etiqueta del libro actual */}
            <div
              style={{
                position: "absolute",
                left: `${libroPercent}%`,
                top: 0,
                transform: "translateX(-50%)",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{
                background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`,
                color: C.goldLight,
                fontSize: 9,
                padding: "1px 6px",
                borderRadius: 4,
                border: `1px solid ${C.gold}`,
                whiteSpace: "nowrap",
                fontWeight: "bold",
              }}>
                {libro}
              </span>
            </div>
          </div>
          {/* Labels de testamento */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: C.muted }}>{esAT ? "Génesis" : "Mateo"}</span>
            <span style={{ background: C.goldDim, color: C.goldLight, fontSize: 11, padding: "2px 10px", borderRadius: 10, border: `1px solid ${C.gold}` }}>
              Libro #{testamentoIndex + 1} de {testamentoTotal} del {esAT ? "AT" : "NT"}
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>{esAT ? "Malaquías" : "Apocalipsis"}</span>
          </div>
        </div>
      </div>

      {/* Info del período bíblico */}
      {periodo && (
        <div style={{ background: "#0d1a12", border: `1px solid ${C.green}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: periodo.color, flexShrink: 0 }} />
          <div>
            <span style={{ color: "#5dd49a", fontSize: 12, fontWeight: "bold" }}>Período: </span>
            <span style={{ color: "#c8e6d8", fontSize: 12 }}>{periodo.nombre}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 1: Libro + Capítulo ──
function StepBookChapter({ onNext }: { onNext: (data: CtxData) => void }) {
  const [libro, setLibro] = useState("");
  const [cap, setCap] = useState("");
  const [modo, setModo] = useState("nuevo");

  return (
    <div>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, marginBottom: 14, fontFamily: "Georgia, serif" }}>Paso 1 — Libro y Capítulo</p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 14 }}>
        <Field label="¿Este capítulo ya existe en el repositorio?">
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {(["nuevo", "existente"] as const).map(m => (
              <button
                key={m}
                style={{
                  background: modo === m ? `linear-gradient(135deg, ${C.goldDim}, #5a3d08)` : "transparent",
                  color: modo === m ? C.goldLight : C.muted,
                  border: `1px solid ${modo === m ? C.gold : C.border}`,
                  borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold", flex: 1, textAlign: "center",
                }}
                onClick={() => setModo(m)}
              >
                {m === "nuevo" ? "🆕 Capítulo nuevo" : "📂 Ya existe"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Libro bíblico *">
          <select
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 14, boxSizing: "border-box" }}
            value={libro} onChange={e => setLibro(e.target.value)}
          >
            <option value="">— Seleccioná un libro —</option>
            {Object.keys(LIBROS_SLUGS).map(l => <option key={l} value={l}>{l} ({LIBROS_CAPITULOS[l] || "?"} cap.)</option>)}
          </select>
        </Field>
        <Field label="Número de capítulo *">
          <input
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 14, boxSizing: "border-box" }}
            type="number" min={1} max={libro ? LIBROS_CAPITULOS[libro] : undefined}
            placeholder={libro ? `Ej: 1 - ${LIBROS_CAPITULOS[libro]}` : "Ej: 16"}
            value={cap} onChange={e => setCap(e.target.value)}
          />
        </Field>
        {libro && cap && <TimelineDual libro={libro} slug={LIBROS_SLUGS[libro]} cap={cap} />}
        {modo === "nuevo" && libro && cap && (
          <div style={{ background: "#1a1000", border: `1px solid ${C.goldDim}`, borderRadius: 8, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#d4b060" }}>
            ⚠️ <strong>Capítulo nuevo:</strong> Al final deberás actualizar también <PathBox>data/{LIBROS_SLUGS[libro]}/capitulos.json</PathBox> e <PathBox>data/index.json</PathBox> para que aparezca en la web.
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <button
          style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }}
          disabled={!libro || !cap}
          onClick={() => onNext({ libro, slug: LIBROS_SLUGS[libro], cap, modo })}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

// ── STEP 2: Tipo de recurso ──
function StepTipo({ ctx, onNext, onBack }: { ctx: CtxData; onNext: (d: CtxData) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, marginBottom: 14, fontFamily: "Georgia, serif" }}>Paso 2 — Tipo de recurso</p>
      <div style={{ background: "#1a1000", border: `1px solid ${C.goldDim}`, borderRadius: 8, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#d4b060" }}>
        📌 <strong>{ctx.libro} — Capítulo {ctx.cap}</strong> &nbsp;|&nbsp; Archivo destino: <PathBox>data/{ctx.slug}/cap-{ctx.cap}.json</PathBox>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 14 }}>
        <div style={{ background: "#0d2a1a", border: `1px solid ${C.green}`, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#7dd4a0", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          ✨ Los recursos marcados con <strong style={{ color: "#5dd49a" }}>AUTO</strong> son generados automáticamente con IA — solo indicás los datos básicos.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {TIPOS.map(t => (
            <button
              key={t.id}
              style={{
                background: selected === t.id ? `linear-gradient(135deg, ${C.goldDim}, #5a3d08)` : C.card,
                border: `2px solid ${selected === t.id ? C.gold : C.border}`,
                borderRadius: 8, padding: "12px 10px", cursor: "pointer", textAlign: "center", transition: "all .2s",
                color: selected === t.id ? C.goldLight : C.text,
              }}
              onClick={() => setSelected(t.id)}
            >
              <span style={{ fontSize: 22, display: "block", marginBottom: 4 }}>{t.icon}</span>
              <span style={{ fontSize: 12, lineHeight: 1.3 }}>{t.label}</span>
              <br />
              <span style={{ display: "inline-block", fontSize: 9, padding: "1px 6px", borderRadius: 10, marginTop: 4, background: t.gen ? C.green : C.surface, color: t.gen ? "#a8e6c8" : C.muted, border: `1px solid ${t.gen ? "#2d6a4f" : C.border}` }}>
                {t.gen ? "✨ AUTO" : "📝 Manual"}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <button style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif" }} onClick={onBack}>← Volver</button>
        <button
          style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }}
          disabled={!selected}
          onClick={() => selected && onNext({ ...ctx, tipo: selected })}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}

// ── STEP 3: Formulario según tipo ──
function StepForm({ ctx, onResult, onBack }: { ctx: CtxData; onResult: (r: StepResult) => void; onBack: () => void }) {
  const tipo = ctx.tipo || "";
  const tipoInfo = TIPOS.find(t => t.id === tipo);
  const isAuto = tipoInfo?.gen;

  // Estados comunes
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [notas, setNotas] = useState("");
  const [predicador, setPredicador] = useState("");
  const [fecha, setFecha] = useState("");
  const [serie, setSerie] = useState("");
  const [autor, setAutor] = useState("");
  const [duracion, setDuracion] = useState("");
  const [numHimno, setNumHimno] = useState("");
  const [compositor, setCompositor] = useState("");
  const [letraHtml, setLetraHtml] = useState("");
  const [recursoTipo, setRecursoTipo] = useState("audio");
  const [tema, setTema] = useState("");
  const [personajes, setPersonajes] = useState("");
  const [numDias, setNumDias] = useState("7");
  const [numPreguntas, setNumPreguntas] = useState("5");
  const [extraInfo, setExtraInfo] = useState("");
  const [iteracion, setIteracion] = useState(0);

  // Generación IA
  const [generando, setGenerando] = useState(false);
  const [generado, setGenerado] = useState<Record<string, unknown> | null>(null);
  const [errorGen, setErrorGen] = useState<string | null>(null);

  const generarConIA = useCallback(async (extra = "") => {
    setGenerando(true);
    setGenerado(null);
    setErrorGen(null);

    let prompt = "";

    if (tipo === "cronologia") {
      prompt = `Generá una línea de tiempo bíblica COMPLETA en JSON para ${ctx.libro} capítulo ${ctx.cap}.
Tema: ${tema || "eventos del capítulo y su contexto"}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON (sin markdown) con esta estructura EXACTA:
{
  "tipo": "cronologia",
  "titulo": "Línea de tiempo: ${ctx.libro} ${ctx.cap}",
  "linea_capitulo": {
    "titulo": "Eventos del Capítulo ${ctx.cap}",
    "eventos": [
      {"posicion": 1, "titulo": "Nombre del evento", "descripcion": "Descripción breve del evento", "versiculos": "1-3"},
      {"posicion": 2, "titulo": "Otro evento", "descripcion": "Descripción", "versiculos": "4-7"}
    ]
  },
  "linea_libro": {
    "titulo": "Panorama de ${ctx.libro}",
    "capitulo_marcado": ${ctx.cap},
    "total_capitulos": ${LIBROS_CAPITULOS[ctx.libro] || 1},
    "eventos": [
      {"capitulo_inicio": 1, "capitulo_fin": 5, "titulo": "Sección del libro", "descripcion": "Resumen de esta sección"},
      {"capitulo_inicio": 6, "capitulo_fin": 10, "titulo": "Otra sección", "descripcion": "Resumen"}
    ]
  },
  "contenido_html": "[HTML completo con ambas líneas de tiempo visuales. La línea del capítulo debe ser vertical con puntos dorados. La línea del libro debe ser HORIZONTAL con una barra que marca dónde está el capítulo ${ctx.cap}. Usá clases CSS: contenedor-blog, titulo-entrada, cita-versiculo, caja-linguistica, apendice-nota]"
}`;
    } else if (tipo === "quiz") {
      prompt = `Generá un cuestionario bíblico en JSON para ${ctx.libro} capítulo ${ctx.cap}.
Título: "${titulo || `¿Cuánto entendiste de ${ctx.libro} ${ctx.cap}?`}"
Tema/contexto: ${tema || "el capítulo completo"}
Cantidad de preguntas: ${numPreguntas}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON con esta estructura exacta (sin markdown ni explicaciones):
{
  "tipo": "quiz",
  "titulo": "...",
  "preguntas": [
    {
      "pregunta": "texto de la pregunta",
      "opciones": [
        {"texto": "opción A", "correcta": false},
        {"texto": "opción B", "correcta": true},
        {"texto": "opción C", "correcta": false},
        {"texto": "opción D", "correcta": false}
      ]
    }
  ]
}`;
    } else if (tipo === "personaje") {
      prompt = `Generá una ficha de personaje bíblico en HTML para ${ctx.libro} capítulo ${ctx.cap}.
Personaje(s): ${personajes || titulo}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON con esta estructura (sin markdown):
{
  "tipo": "personaje",
  "titulo": "Ficha de Personaje: [nombre]",
  "contenido_html": "[HTML completo con datos biográficos, hitos espirituales, análisis lingüístico del nombre, relevancia teológica. Usá clases CSS disponibles: caja-linguistica, caja-profetica, caja-simbolismo, apendice-nota]"
}`;
    } else if (tipo === "glosario") {
      prompt = `Generá un glosario de términos bíblicos en HTML para ${ctx.libro} capítulo ${ctx.cap}.
Tema: ${tema || "términos clave del capítulo"}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON (sin markdown):
{
  "tipo": "glosario",
  "titulo": "Glosario de términos: ${ctx.libro} ${ctx.cap}",
  "contenido_html": "[HTML con al menos 5 términos. Cada uno con nombre en hebreo/griego si aplica, transliteración, significado y contexto bíblico. Usá clase apendice-nota para cada término]"
}`;
    } else if (tipo === "devocional") {
      prompt = `Generá un devocional completo para ${ctx.libro} capítulo ${ctx.cap}.
Título: "${titulo || `Devocional de ${ctx.libro} ${ctx.cap}`}"
Tema principal: ${tema || "el mensaje central del capítulo"}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON (sin markdown):
{
  "tipo": "devocional",
  "titulo": "...",
  "fecha": "...",
  "versiculo_ref": "...",
  "versiculo_texto": "...",
  "contenido_html": "[3-4 párrafos de reflexión profunda, práctica y edificante]",
  "aplicacion_html": "[Una aplicación personal concreta y específica]"
}`;
    } else if (tipo === "hoja") {
      prompt = `Generá una hoja de trabajo/estudio para ${ctx.libro} capítulo ${ctx.cap}.
Título: "${titulo || `Hoja de trabajo: ${ctx.libro} ${ctx.cap}`}"
Tema: ${tema || "el capítulo completo"}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON (sin markdown):
{
  "tipo": "hoja",
  "titulo": "...",
  "recurso_url": "",
  "contenido_html": "[HTML con preview de actividades: preguntas de comprensión, de reflexión personal, actividad de búsqueda bíblica, conexión con NT si aplica. Usá ol con li]"
}`;
    } else if (tipo === "plan") {
      prompt = `Generá un plan de lectura bíblica relacionado con ${ctx.libro} capítulo ${ctx.cap}.
Título: "${titulo || `Plan de lectura: ${ctx.libro} ${ctx.cap}`}"
Cantidad de días: ${numDias}
Tema: ${tema || "el contexto del capítulo"}
${extra ? `Instrucciones adicionales: ${extra}` : ""}

Devolvé SOLO un objeto JSON (sin markdown):
{
  "tipo": "plan",
  "titulo": "...",
  "dias": [
    {"titulo": "...", "pasaje": "...", "nota": "pregunta o reflexión del día"}
  ]
}`;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      const text = data.text || "";

      // Parseo robusto
      let clean = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
      let parsed: Record<string, unknown> | null = null;

      try { const m = clean.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); } catch (_) { /* */ }
      if (!parsed) {
        try {
          const m2 = clean.match(/\{[\s\S]*\}/);
          if (m2) parsed = JSON.parse(m2[0]);
        } catch (_) { /* */ }
      }
      if (!parsed) throw new Error("No se pudo parsear la respuesta de IA. Intentá de nuevo.");

      setGenerado(parsed);
      setIteracion(i => i + 1);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setErrorGen(msg);
    }
    setGenerando(false);
  }, [tipo, ctx, tema, personajes, titulo, numPreguntas, numDias, extraInfo]);

  function buildManualJson() {
    const base = { tipo, titulo: titulo || tipoInfo?.label };
    if (tipo === "sermon") return { ...base, predicador, fecha, serie, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "video") return { ...base, recurso_url: url };
    if (tipo === "audio") return { ...base, autor, fecha, duracion, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "imagen") return { ...base, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "diapositiva") return { ...base, recurso_url: url };
    if (tipo === "pdf") return { ...base, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "mapa") return { ...base, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "enlace") return { ...base, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "himno") return { ...base, numero_himno: numHimno, compositor, fecha, recurso_url: url || undefined, contenido_html: letraHtml || undefined };
    if (tipo === "testimonio") return { ...base, autor, fecha, recurso_tipo: recursoTipo, recurso_url: url, contenido_html: notas || undefined };
    if (tipo === "estudio") return { ...base, archivo_html: `/estudios/${ctx.slug}/cap-${ctx.cap}-estudio.html` };
    if (tipo === "exegesis") return { ...base, archivo_html: `/estudios/${ctx.slug}/cap-${ctx.cap}-exegesis.html` };
    return base;
  }

  const finalJson = isAuto ? generado : buildManualJson();
  const jsonStr = finalJson ? JSON.stringify(finalJson, null, 2) : null;

  const inputStyle: React.CSSProperties = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 14, boxSizing: "border-box" };
  const textareaStyle: React.CSSProperties = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "10px 12px", fontSize: 13, fontFamily: "Georgia, serif", outline: "none", marginBottom: 14, resize: "vertical", minHeight: 90, boxSizing: "border-box" };
  const selectStyle: React.CSSProperties = { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 14, boxSizing: "border-box" };

  return (
    <div>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, marginBottom: 14, fontFamily: "Georgia, serif" }}>Paso 3 — Datos del recurso</p>
      <div style={{ background: "#1a1000", border: `1px solid ${C.goldDim}`, borderRadius: 8, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#d4b060" }}>
        {tipoInfo?.icon} <strong>{tipoInfo?.label}</strong> para {ctx.libro} cap. {ctx.cap}
        {isAuto && <span style={{ marginLeft: 10, color: "#5dd49a" }}>✨ Generación automática disponible</span>}
      </div>

      {/* Vista previa de la línea de tiempo para cronología */}
      {tipo === "cronologia" && (
        <TimelineDual libro={ctx.libro} slug={ctx.slug} cap={ctx.cap} />
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 14 }}>
        {/* Campos comunes */}
        {["estudio", "exegesis", "cronologia", "personaje", "glosario", "quiz", "devocional", "hoja", "plan"].includes(tipo) && (
          <Field label="Título del recurso">
            <input style={inputStyle} placeholder={`Ej: Estudio de ${ctx.libro} ${ctx.cap}`} value={titulo} onChange={e => setTitulo(e.target.value)} />
          </Field>
        )}
        {isAuto && tipo !== "cronologia" && (
          <Field label={tipo === "personaje" ? "Personaje(s) a incluir *" : "Tema o enfoque principal *"}>
            {tipo === "personaje" ? (
              <input style={inputStyle} placeholder="Ej: Agar la Egipcia" value={personajes} onChange={e => setPersonajes(e.target.value)} />
            ) : (
              <input style={inputStyle} placeholder={`Ej: tema central de ${ctx.libro} ${ctx.cap}`} value={tema} onChange={e => setTema(e.target.value)} />
            )}
          </Field>
        )}
        {/* Para cronología siempre pedir tema */}
        {tipo === "cronologia" && (
          <Field label="Tema o enfoque principal *">
            <input style={inputStyle} placeholder={`Ej: Los eventos clave y su contexto histórico`} value={tema} onChange={e => setTema(e.target.value)} />
          </Field>
        )}
        {tipo === "quiz" && (
          <Field label="Cantidad de preguntas">
            <select style={selectStyle} value={numPreguntas} onChange={e => setNumPreguntas(e.target.value)}>
              {[3, 4, 5, 6, 7, 8, 10].map(n => <option key={n} value={n}>{n} preguntas</option>)}
            </select>
          </Field>
        )}
        {tipo === "plan" && (
          <Field label="Cantidad de días">
            <select style={selectStyle} value={numDias} onChange={e => setNumDias(e.target.value)}>
              {[3, 5, 7, 10, 14, 21, 30].map(n => <option key={n} value={n}>{n} días</option>)}
            </select>
          </Field>
        )}

        {/* Campos manuales por tipo */}
        {["sermon", "audio", "video", "imagen", "diapositiva", "pdf", "mapa", "enlace", "himno", "testimonio"].includes(tipo) && (
          <Field label="Título *">
            <input style={inputStyle} placeholder="Título del recurso" value={titulo} onChange={e => setTitulo(e.target.value)} />
          </Field>
        )}
        {tipo === "sermon" && <>
          <Field label="Predicador"><input style={inputStyle} placeholder="Ej: Pastor Juan Pérez" value={predicador} onChange={e => setPredicador(e.target.value)} /></Field>
          <Field label="Fecha"><input style={inputStyle} placeholder="Ej: 15/04/2025" value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
          <Field label="Serie (opcional)"><input style={inputStyle} placeholder="Ej: Patriarcas de la Fe" value={serie} onChange={e => setSerie(e.target.value)} /></Field>
          <Field label="URL del audio (mp3)"><input style={inputStyle} placeholder="https://tu-servidor.com/audio/archivo.mp3" value={url} onChange={e => setUrl(e.target.value)} /></Field>
          <Field label="Notas del sermón (HTML opcional)"><textarea style={textareaStyle} placeholder="&lt;p&gt;Notas opcionales...&lt;/p&gt;" value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}
        {tipo === "video" && (
          <Field label="ID de YouTube *">
            <input style={inputStyle} placeholder="Ej: dQw4w9WgXcQ (solo el ID, no la URL completa)" value={url} onChange={e => setUrl(e.target.value)} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: -10, marginBottom: 10 }}>💡 La URL https://youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong> → pegá solo la parte en negrita</div>
          </Field>
        )}
        {tipo === "audio" && <>
          <Field label="Autor / Predicador"><input style={inputStyle} placeholder="Ej: Hna. María González" value={autor} onChange={e => setAutor(e.target.value)} /></Field>
          <Field label="Fecha"><input style={inputStyle} placeholder="Ej: 20/04/2025" value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
          <Field label="Duración"><input style={inputStyle} placeholder="Ej: 18 min" value={duracion} onChange={e => setDuracion(e.target.value)} /></Field>
          <Field label="URL del audio (mp3) *"><input style={inputStyle} placeholder="https://tu-servidor.com/audio/archivo.mp3" value={url} onChange={e => setUrl(e.target.value)} /></Field>
          <Field label="Transcripción / descripción (HTML opcional)"><textarea style={textareaStyle} placeholder="&lt;p&gt;Transcripción opcional...&lt;/p&gt;" value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}
        {(tipo === "imagen" || tipo === "pdf") && <>
          <Field label="URL del archivo *"><input style={inputStyle} placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} /></Field>
          <Field label="Descripción / pie (opcional)"><textarea style={textareaStyle} placeholder="Descripción breve..." value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}
        {(tipo === "diapositiva" || tipo === "mapa") && <>
          <Field label="URL de embed *">
            <input style={inputStyle} placeholder="URL de embed (no la URL normal)" value={url} onChange={e => setUrl(e.target.value)} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: -10, marginBottom: 10 }}>
              {tipo === "diapositiva" ? "💡 Google Slides: Archivo → Publicar en la web → Insertar → copiá el src del iframe" : "💡 Google Maps: Compartir → Insertar mapa → copiá el src del iframe"}
            </div>
          </Field>
          <Field label="Descripción adicional (opcional)"><textarea style={textareaStyle} placeholder="&lt;p&gt;Contexto o descripción...&lt;/p&gt;" value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}
        {tipo === "enlace" && <>
          <Field label="URL externa *"><input style={inputStyle} placeholder="https://sitio-externo.com/recurso" value={url} onChange={e => setUrl(e.target.value)} /></Field>
          <Field label="Descripción del sitio"><textarea style={textareaStyle} placeholder="Breve descripción de qué encontrará el usuario..." value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}
        {tipo === "himno" && <>
          <Field label="Número de himno"><input style={inputStyle} placeholder="Ej: 142" value={numHimno} onChange={e => setNumHimno(e.target.value)} /></Field>
          <Field label="Compositor (opcional)"><input style={inputStyle} placeholder="Ej: Fanny Crosby" value={compositor} onChange={e => setCompositor(e.target.value)} /></Field>
          <Field label="Fecha / Época (opcional)"><input style={inputStyle} placeholder="Ej: s. XIX" value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
          <Field label="URL del audio (opcional)"><input style={inputStyle} placeholder="https://tu-servidor.com/audio/himno.mp3" value={url} onChange={e => setUrl(e.target.value)} /></Field>
          <Field label="Letra en HTML (opcional)"><textarea style={{ ...textareaStyle, minHeight: 130 }} placeholder={"&lt;p style='text-align:center'&gt;&lt;strong&gt;Estrofa 1&lt;/strong&gt;&lt;/p&gt;"} value={letraHtml} onChange={e => setLetraHtml(e.target.value)} /></Field>
        </>}
        {tipo === "testimonio" && <>
          <Field label="Nombre del testimoniante"><input style={inputStyle} placeholder="Ej: Ana Rodríguez" value={autor} onChange={e => setAutor(e.target.value)} /></Field>
          <Field label="Fecha / Evento"><input style={inputStyle} placeholder="Ej: Reunión de mujeres — Junio 2025" value={fecha} onChange={e => setFecha(e.target.value)} /></Field>
          <Field label="Tipo de media">
            <select style={selectStyle} value={recursoTipo} onChange={e => setRecursoTipo(e.target.value)}>
              <option value="audio">🎧 Audio (mp3)</option>
              <option value="video">🎬 Video (YouTube ID)</option>
            </select>
          </Field>
          <Field label={recursoTipo === "audio" ? "URL del audio *" : "ID de YouTube *"}>
            <input style={inputStyle} placeholder={recursoTipo === "audio" ? "https://servidor.com/audio.mp3" : "ID de YouTube"} value={url} onChange={e => setUrl(e.target.value)} />
          </Field>
          <Field label="Descripción breve (HTML opcional)"><textarea style={textareaStyle} placeholder="&lt;p&gt;Descripción del testimonio...&lt;/p&gt;" value={notas} onChange={e => setNotas(e.target.value)} /></Field>
        </>}

        {/* ── Generación IA ── */}
        {isAuto && (
          <>
            {generado && !errorGen && (
              <div style={{ marginTop: 14 }}>
                <div style={{ background: "#0d2a1a", border: `1px solid ${C.green}`, borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#7dd4a0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  ✅ Iteración {iteracion} generada — revisá el resultado abajo
                </div>
                <Field label="¿Querés agregar algo más o modificar algo?">
                  <textarea
                    style={textareaStyle}
                    placeholder={
                      tipo === "cronologia"
                        ? "Ej: Agregá más eventos históricos / Incluí las fechas aproximadas / Ampliá la sección del NT..."
                        : tipo === "personaje"
                        ? "Ej: Agregá más análisis lingüístico del nombre / Incluí más referencias del NT..."
                        : tipo === "quiz"
                        ? "Ej: Hacé las preguntas más difíciles / Agregá 2 preguntas sobre el contexto histórico..."
                        : "Ej: Ampliá la reflexión / Agregá un punto sobre la aplicación en la iglesia..."
                    }
                    value={extraInfo}
                    onChange={e => setExtraInfo(e.target.value)}
                  />
                </Field>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  <button style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif" }} onClick={() => { generarConIA(extraInfo); setExtraInfo(""); }}>
                    🔄 Regenerar con cambios
                  </button>
                  <button
                    style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }}
                    onClick={() => onResult({ json: generado, ctx })}
                  >
                    ✅ Usar este resultado →
                  </button>
                </div>
              </div>
            )}
            {errorGen && (
              <div style={{ background: "#1a0a0a", border: "1px solid #e74c3c", borderRadius: 8, padding: "12px 16px", marginTop: 10 }}>
                <div style={{ color: "#e74c3c", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>⚠️ No se pudo generar</div>
                <div style={{ color: "#d4a0a0", fontSize: 12, marginBottom: 10 }}>{errorGen}</div>
                <button style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 12 }} onClick={() => { setErrorGen(null); setGenerado(null); }}>🔄 Reintentar</button>
              </div>
            )}
            {!generado && !errorGen && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button
                  style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }}
                  disabled={generando || (!tema && !personajes && tipo !== "cronologia")}
                  onClick={() => generarConIA()}
                >
                  {generando ? "⏳ Generando con IA..." : `✨ Generar ${tipoInfo?.label}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <button style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif" }} onClick={onBack}>← Volver</button>
        {!isAuto && (
          <button
            style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }}
            disabled={!titulo && !["video"].includes(tipo)}
            onClick={() => finalJson && onResult({ json: finalJson, ctx })}
          >
            ✅ Generar instrucciones →
          </button>
        )}
      </div>

      {/* Preview del JSON si ya se generó */}
      {jsonStr && generado && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ color: C.gold, fontWeight: "bold", fontSize: 14 }}>{tipoInfo?.icon} JSON generado</span>
            <CopyBtn text={jsonStr} />
          </div>
          <div style={{ background: "#0a0908", border: `1px solid ${C.goldDim}`, borderRadius: 8, padding: 18, fontSize: 12, fontFamily: "monospace", color: "#d4f1b0", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 300, overflowY: "auto" }}>
            {jsonStr}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 4: Resultado + Instrucciones ──
function StepResult({ result, onAddMore, onRestart }: { result: StepResult; onAddMore: () => void; onRestart: () => void }) {
  const { json, ctx } = result;
  const jsonStr = JSON.stringify(json, null, 2);
  const slug = ctx.slug;
  const cap = ctx.cap;
  const tipo = ctx.tipo || "";
  const tipoInfo = TIPOS.find(t => t.id === tipo);
  const needsHtml = tipo === "estudio" || tipo === "exegesis";

  return (
    <div>
      <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: C.gold, marginBottom: 14, fontFamily: "Georgia, serif" }}>Paso 4 — Resultado final</p>

      {/* Vista previa de línea de tiempo para cronología */}
      {tipo === "cronologia" && (
        <TimelineDual libro={ctx.libro} slug={ctx.slug} cap={ctx.cap} />
      )}

      {/* JSON */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ color: C.gold, fontWeight: "bold", fontSize: 14 }}>{tipoInfo?.icon} JSON generado — {tipoInfo?.label}</span>
          <CopyBtn text={jsonStr} />
        </div>
        <div style={{ background: "#0a0908", border: `1px solid ${C.goldDim}`, borderRadius: 8, padding: 18, fontSize: 12, fontFamily: "monospace", color: "#d4f1b0", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 380, overflowY: "auto" }}>{jsonStr}</div>
      </div>

      {/* Instrucciones */}
      <div style={{ background: "#0d1a12", border: `1px solid ${C.green}`, borderRadius: 8, padding: 18, marginTop: 14 }}>
        <div style={{ color: "#5dd49a", fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>📋 Instrucciones paso a paso</div>

        {needsHtml ? (
          <>
            <InstrStep n={1}>Creá el archivo HTML en: <PathBox>estudios/{slug}/cap-{cap}-{tipo}.html</PathBox></InstrStep>
            <InstrStep n={2}>El archivo debe contener <strong>solo el contenido HTML interno</strong> (sin {"<html>"}, {"<head>"} ni {"<body>"}). Empezá directamente con las clases del sistema.</InstrStep>
            <InstrStep n={3}>Abrí o creá el archivo: <PathBox>data/{slug}/cap-{cap}.json</PathBox></InstrStep>
            <InstrStep n={4}>Dentro del array <code style={{ color: C.goldLight }}>"recursos": [...]</code>, pegá el JSON de arriba como un nuevo elemento.</InstrStep>
            <InstrStep n={5}>Guardá ambos archivos y hacé <strong>commit + push</strong> al repositorio.</InstrStep>
          </>
        ) : (
          <>
            <InstrStep n={1}>Abrí el archivo: <PathBox>data/{slug}/cap-{cap}.json</PathBox></InstrStep>
            <InstrStep n={2}>Dentro del array <code style={{ color: C.goldLight }}>"recursos": [...]</code>, pegá el JSON de arriba como un elemento nuevo. Verificá que las comas entre objetos sean correctas.</InstrStep>
            {tipo === "video" && <InstrStep n={3}>⚠️ Recordá que el campo <code style={{ color: C.goldLight }}>"recurso_url"</code> debe tener <strong>solo el ID de YouTube</strong>.</InstrStep>}
            {(tipo === "diapositiva" || tipo === "mapa") && <InstrStep n={3}>⚠️ Verificá que la URL sea la URL de <strong>embed</strong>.</InstrStep>}
            {tipo === "cronologia" && (
              <InstrStep n={3}>
                ⏳ La línea de tiempo generada incluye:
                <br />• <strong>linea_capitulo</strong>: eventos específicos del capítulo {cap}
                <br />• <strong>linea_libro</strong>: panorama de todo el libro con el capítulo {cap} marcado
                <br />• <strong>contenido_html</strong>: HTML visual con ambas líneas integradas
              </InstrStep>
            )}
            <InstrStep n={4}>Guardá el archivo y hacé <strong>commit + push</strong> al repositorio.</InstrStep>
          </>
        )}

        {ctx.modo === "nuevo" && (
          <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <div style={{ color: C.gold, fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>⚠️ CAPÍTULO NUEVO — Pasos adicionales requeridos:</div>
            <InstrStep n="A">Agregá este capítulo al array en <PathBox>data/{slug}/capitulos.json</PathBox></InstrStep>
            <InstrStep n="B">Si el libro no aparece en <PathBox>data/index.json</PathBox>, agregalo también.</InstrStep>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginTop: 14 }}>
        <div style={{ color: C.gold, fontWeight: "bold", marginBottom: 10, fontSize: 13 }}>✅ Checklist de archivos</div>
        {needsHtml && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13 }}>
            <span>🆕</span><PathBox>estudios/{slug}/cap-{cap}-{tipo}.html</PathBox><span style={{ color: C.muted }}>← crear / editar</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13 }}>
          <span>✏️</span><PathBox>data/{slug}/cap-{cap}.json</PathBox><span style={{ color: C.muted }}>← agregar recurso</span>
        </div>
        {ctx.modo === "nuevo" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13 }}>
              <span>✏️</span><PathBox>data/{slug}/capitulos.json</PathBox><span style={{ color: C.muted }}>← agregar capítulo</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span>✏️</span><PathBox>data/index.json</PathBox><span style={{ color: C.muted }}>← verificar libro</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        <button style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif" }} onClick={onAddMore}>
          ➕ Agregar otro recurso a {ctx.libro} {ctx.cap}
        </button>
        <button style={{ background: `linear-gradient(135deg, ${C.goldDim}, #7a5210)`, color: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 7, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontFamily: "Georgia, serif", fontWeight: "bold" }} onClick={onRestart}>
          🔄 Nuevo libro / capítulo
        </button>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ──
export default function App() {
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<CtxData | null>(null);
  const [result, setResult] = useState<StepResult | null>(null);

  const steps = ["Libro & Cap.", "Tipo", "Datos", "Resultado"];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Georgia', serif", color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.surface}, #2a2018)`, borderBottom: `1px solid ${C.border}`, padding: "18px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 32 }}>📜</span>
        <div>
          <h1 style={{ fontSize: 20, color: C.gold, fontWeight: "bold", margin: 0, letterSpacing: 1 }}>Asistente de Recursos Bíblicos</h1>
          <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Mahanaim — Centro de Recursos Bíblicos</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "24px 28px", maxWidth: 860, margin: "0 auto", width: "100%" }}>
        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, alignItems: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold",
                background: step > i + 1 ? C.gold : step === i + 1 ? C.goldDim : C.surface,
                color: step >= i + 1 ? "#111" : C.muted,
                border: `2px solid ${step > i + 1 ? C.gold : step === i + 1 ? C.goldLight : C.border}`,
                transition: "all .3s",
              }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: C.border, borderRadius: 2 }} />}
            </div>
          ))}
        </div>

        {step === 1 && <StepBookChapter onNext={(data) => { setCtx(data); setStep(2); }} />}
        {step === 2 && ctx && <StepTipo ctx={ctx} onNext={(data) => { setCtx(data); setStep(3); }} onBack={() => setStep(1)} />}
        {step === 3 && ctx && <StepForm ctx={ctx} onResult={(r) => { setResult(r); setStep(4); }} onBack={() => setStep(2)} />}
        {step === 4 && result && ctx && <StepResult result={result} onAddMore={() => { setStep(2); }} onRestart={() => { setCtx(null); setResult(null); setStep(1); }} />}
      </div>
    </div>
  );
}
