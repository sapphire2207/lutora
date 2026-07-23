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
    default: "LUTORA — Peri Peri Makhna | Bold Flavors, Made to Crave",
    template: "%s | LUTORA",
  },
  description:
    "Experience the perfect blend of peri peri spice and makhna magic. Premium, healthy fox nut snacks delivered to your door in 30 minutes.",
  keywords: [
    "LUTORA",
    "Peri Peri Makhna",
    "fox nuts",
    "makhna",
    "healthy snacks",
    "peri peri",
    "order online",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "LUTORA",
    title: "LUTORA — Peri Peri Makhna",
    description:
      "Bold flavors, made to crave. Premium peri peri makhna delivered fresh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUTORA — Peri Peri Makhna",
    description:
      "Bold flavors, made to crave. Premium peri peri makhna delivered fresh.",
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
