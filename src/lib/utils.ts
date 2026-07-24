import { clsx, type ClassValue } from "clsx";

// Utility to merge class names (Tailwind v4 compatible)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency in INR
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate effective selling price for a product
export function getSellingPrice(product: { price: number; discount_percent?: number }): number {
  if (!product) return 0;
  if (!product.discount_percent || product.discount_percent <= 0) {
    return product.price;
  }
  return Math.round(product.price * (1 - product.discount_percent / 100));
}

// Calculate discounted price
export function getDiscountedPrice(price: number, discountPercent: number = 0): number {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Generate order ID
export function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "LUT-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Spice level label
export function getSpiceLabel(level: number): string {
  const labels = ["Mild", "Medium", "Hot", "Very Hot", "Extreme"];
  return labels[Math.min(level - 1, labels.length - 1)] || "Mild";
}

// Delay utility (for optimistic UI demos)
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
