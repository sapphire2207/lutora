import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LUTORA — Peri Peri Makhana | Bold Flavors, Made to Crave",
    template: "%s | LUTORA",
  },
  description:
    "Experience the perfect blend of peri peri spice and makhana magic. Premium, healthy fox nut snacks delivered to your door in 30 minutes.",
  keywords: [
    "Peri Peri Makhana",
    "Honey Makhana",
    "makhana",
    "healthy snacks",
    "fox nuts",
    "lotus seeds",
    "LUTORA",
    "snack delivery",
  ],
  authors: [{ name: "LUTORA" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "LUTORA",
    title: "LUTORA — Peri Peri Makhana",
    description:
      "Bold flavors, made to crave. Premium peri peri makhana delivered fresh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUTORA — Peri Peri Makhana",
    description:
      "Bold flavors, made to crave. Premium peri peri makhana delivered fresh.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 has-mobile-nav">{children}</main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
