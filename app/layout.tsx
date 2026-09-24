import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI-Native LMS // Zero-Slop Systems Engineering Curriculum",
  description:
    "An AI-Native computer science learning platform with 14 modules, 700 verified lessons, project-based curriculum, and resilient low-bandwidth learning workflows.",
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
    <html lang="en" className="dark">
      <body className="bg-[#010102] text-[#f7f8f8] antialiased selection:bg-[#5e6ad2]/30 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
