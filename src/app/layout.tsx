import type { Metadata } from "next";
import { Michroma, Outfit } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Laci POS | The Definitive Point of Sale Architecture",
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
      className={`scroll-smooth ${michroma.variable} ${outfit.variable}`}
    >
      <body className="font-body antialiased selection:bg-brand-lime selection:text-brand-black">
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
