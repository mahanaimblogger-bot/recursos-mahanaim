import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Asistente de Recursos Bíblicos - Mahanaim",
  description: "Herramienta para generar y gestionar recursos bíblicos para el repositorio de Mahanaim.",
  keywords: ["Biblia", "recursos bíblicos", "Mahanaim", "estudio bíblico", "sermones"],
  authors: [{ name: "Mahanaim" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="antialiased"
        style={{
          backgroundColor: "#fdfbf7",
          color: "#3e2723",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
