import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI-Native Software Engineer // Personal Learning OS",
  description:
    "An AI-Native Software Engineering platform with 14 modules, 700 verified lessons, in-browser WASM code execution, and autonomous agent curricula.",
};

/**
 * `maximumScale` is deliberately NOT set: locking it to 1 blocks pinch-zoom and
 * fails WCAG 1.4.4 (Resize Text). Zoom must stay available on low-end phones.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#010102] text-[#f7f8f8] font-sans antialiased selection:bg-[#5e6ad2]/30 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
