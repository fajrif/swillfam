import type { Metadata } from "next";
import { Syne, Archivo, Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

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
  title: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
  description:
    "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${syne.variable} ${archivo.variable} ${inter.variable}`}
    >
      <body className="font-inter antialiased selection:bg-sf-accent selection:text-white">
        <NextTopLoader
          color="#c6387f"
          height={3}
          showSpinner={false}
          shadow={false}
          zIndex={1600}
        />
        <Script
          src="https://unpkg.com/@phosphor-icons/web"
          strategy="beforeInteractive"
        />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
