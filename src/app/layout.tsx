import type { Metadata } from "next";
import { Syne, Archivo, Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteUrl } from "@/lib/site-url";
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

const GTM_ID = "GTM-PV6L35RN";

/**
 * Only `metadataBase` and the fallback title/description live here; the icons
 * come from the `favicon.ico` / `icon.png` / `apple-icon.png` files beside this
 * one, and the manifest from `manifest.ts`.
 *
 * Next merges metadata shallowly, so any page that defines `openGraph` would
 * replace a root-level `openGraph` wholesale rather than extending it. Putting
 * share tags here would therefore make them silently disappear on exactly the
 * pages that set their own — so every route composes a complete set through
 * `buildMetadata()` instead, and this layout only supplies what is genuinely
 * global. `metadataBase` is the one field pages never override: it turns the
 * relative `canonical`, `og:url` and `og:image` paths they emit into absolute
 * URLs.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  // No `icons` key: `src/app/favicon.ico`, `icon.png` and `apple-icon.png` are
  // file conventions, so Next emits the <link> tags — with the right `sizes`,
  // `type` and a content hash — from the files themselves. Declaring them here
  // as well would be a second list to keep in step.
  // A last-resort title/description for any route that ships no metadata of
  // its own (the admin section). Every public route overrides both.
  title: "SwillFam — Jakarta Lifestyle & Nightlife Venues",
  description:
    "SwillFam runs Jakarta's lifestyle and nightlife venues — restaurants, cafés, cocktail bars and clubs across SCBD, Senopati and Ashta District 8.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${archivo.variable} ${inter.variable}`}
    >
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="font-inter antialiased selection:bg-sf-accent selection:text-white">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
