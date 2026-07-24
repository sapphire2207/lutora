import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Browse our delicious makhana flavors — Peri Peri Makhana and Honey Makhana. Fresh, bold, and made with love.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
