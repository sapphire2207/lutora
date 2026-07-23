import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our delicious makhna flavors — Peri Peri Makhna and Honey Makhna. Fresh, bold, and made with love.",
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
