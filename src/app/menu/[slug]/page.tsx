"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { SEED_PRODUCTS, SPICE_LEVELS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = SEED_PRODUCTS.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p className="text-sm text-foreground-secondary mt-2">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const otherProducts = SEED_PRODUCTS.filter((p) => p.id !== product.id);
  const spiceInfo = SPICE_LEVELS.find((s) => s.level === product.spice_level);

  const handleAddToCart = () => {
    addItem(product as unknown as Product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-background-secondary border-b border-border">
        <div className="container-app py-3">
          <nav className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/menu"
              className="hover:text-foreground transition-colors"
            >
              Menu
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative aspect-square bg-background-secondary rounded-3xl overflow-hidden">
              <Image
                src={product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.is_bestseller && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* Action Buttons (Mobile: Bottom | Desktop: Top Right) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsFavorited(!isFavorited);
                  toast(isFavorited ? "Removed from favorites" : "Added to favorites");
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md",
                  isFavorited
                    ? "bg-danger text-white"
                    : "bg-white text-foreground-secondary hover:text-danger"
                )}
                aria-label="Toggle favorite"
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorited ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="w-10 h-10 rounded-full bg-white text-foreground-secondary hover:text-foreground flex items-center justify-center transition-colors shadow-md"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Category */}
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Makhna
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-border text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-sm text-foreground-muted">
                ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold mt-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              Inclusive of all taxes
            </p>

            {/* Description */}
            <p className="text-sm text-foreground-secondary mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Spice Level */}
            <div className="mt-6 p-4 bg-background-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">Spice Level</span>
              </div>
              <div className="flex items-center gap-2">
                {SPICE_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-colors",
                      level.level <= product.spice_level
                        ? product.spice_level <= 2
                          ? "bg-amber-400"
                          : product.spice_level <= 3
                          ? "bg-orange-500"
                          : "bg-red-500"
                        : "bg-border"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-foreground-muted mt-2">
                {spiceInfo?.emoji} {spiceInfo?.label}
              </p>
            </div>

            {/* Ingredients */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1.5 bg-background-secondary text-foreground-secondary text-xs rounded-full border border-border-light"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-0 border border-border rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-foreground-secondary hover:bg-background-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-foreground-secondary hover:bg-background-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart — {formatPrice(product.price * quantity)}
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-xl">
                <span className="text-lg">🚀</span>
                <div>
                  <p className="text-xs font-semibold">Fast Delivery</p>
                  <p className="text-[10px] text-foreground-muted">
                    Within 30 minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-xl">
                <span className="text-lg">🎁</span>
                <div>
                  <p className="text-xs font-semibold">Free Delivery</p>
                  <p className="text-[10px] text-foreground-muted">
                    On orders ₹299+
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {otherProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/menu/${p.slug}`}
                  className="group flex gap-4 p-4 bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-md transition-all"
                >
                  <div className="relative w-24 h-24 bg-background-secondary rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={p.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-foreground-secondary mt-1 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-sm">
                        {formatPrice(p.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
