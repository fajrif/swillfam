import type { Metadata } from "next";
import { Michroma, Outfit, Syne, Archivo, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// SwillFam public site type system (Figma "SwillFam - Home"):
// Syne = display/headings/nav, Archivo = button + label, Inter = body (Acumin substitute) + legal.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Swillfam | The Definitive Point of Sale Architecture",
  description:
    "The highest-performance operational terminal built for scale. Zero-latency register, atomic inventory, offline resilience and macro-level analytics for cafes, minimarkets and boutiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${michroma.variable} ${outfit.variable} ${syne.variable} ${archivo.variable} ${inter.variable}`}
    >
      <body className="font-body antialiased selection:bg-sf-accent selection:text-white">
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
