import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AI-Native LMS // The Zero-Slop Systems & Computer Science Academy",
  description:
    "An AI-Native Computer Science Learning Platform combining Codecademy's instant in-browser feedback with Educative.io's rigorous text-first depth. 500 lessons, 22 real GitHub capstones, zero artificial urgency, 100% free.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
