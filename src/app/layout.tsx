import type { Metadata } from "next";
import { Antonio, Outfit, Inter } from "next/font/google";
import { StickyBg } from "@/components/ui/sticky-bg";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ori-craftlabs.com"),
  title: {
    default: "ORI Craft Labs | Poczuj rytm. Żyj kulturą.",
    template: "%s | ORI Craft Labs",
  },
  description: "Wellness, kultura i jedzenie w Poznaniu. Doświadczenia, które łączą ciało, ludzi i codzienność.",
  alternates: {
    canonical: "/",
    languages: {
      "pl-PL": "/pl",
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    type: "website",
    url: "https://ori-craftlabs.com",
    siteName: "ORI Craft Labs",
    title: "ORI Craft Labs | Poczuj rytm. Żyj kulturą.",
    description: "Wellness, kultura i jedzenie w Poznaniu.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "ORI Craft Labs" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${antonio.variable} ${outfit.variable} ${inter.variable} antialiased font-body`}
      >
        <StickyBg />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
