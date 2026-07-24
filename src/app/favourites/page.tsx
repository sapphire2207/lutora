"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  Star,
  ArrowRight,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { formatPrice, getSellingPrice } from "@/lib/utils";
import { useFavouritesStore } from "@/stores/favourites-store";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useEffect, useState } from "react";

export default function FavouritesPage() {
  const { favourites, removeFavourite } = useFavouritesStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-[60vh]" />;
  }

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (favourites.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="w-20 h-20 mx-auto bg-danger-light rounded-full flex items-center justify-center mb-5">
            <Heart className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold">No Favourites Yet</h1>
          <p className="text-sm text-foreground-secondary mt-2 max-w-xs mx-auto">
            Click the heart icon on any makhana product to save it here for quick access!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-background-secondary border-b border-border">
        <div className="container-app py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              My Favourites
              <Heart className="w-6 h-6 text-danger fill-danger" />
            </h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Your saved signature makhana flavors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Favourites Grid */}
      <section className="py-8 md:py-12">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {favourites.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="group bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <Link
                        href={`/menu/${product.slug || product.id}`}
                        className="relative w-full sm:w-52 h-52 sm:h-auto bg-background-secondary shrink-0 overflow-hidden"
                      >
                        <Image
                          src={
                            product.slug === "peri-peri-makhna" || product.id === "makhna-spicy"
                              ? "/images/makhna-spicy.png"
                              : "/images/makhna-honey.jpg"
                          }
                          alt={product.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 200px"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/menu/${product.slug || product.id}`}>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <button
                              onClick={() => {
                                removeFavourite(product.id);
                                toast.success(`${product.name} removed from favourites`);
                              }}
                              className="p-1.5 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors cursor-pointer shrink-0"
                              aria-label="Remove from favourites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-sm text-foreground-secondary mt-1.5 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center gap-2 mt-3">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold">
                              {product.rating || 4.8}
                            </span>
                            <span className="text-xs text-foreground-muted">
                              ({product.review_count || 150} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Price & Add to Cart */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light">
                          <div>
                            {product.discount_percent && product.discount_percent > 0 ? (
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-xl font-bold text-accent">
                                  {formatPrice(getSellingPrice(product))}
                                </span>
                                <span className="text-xs text-foreground-muted line-through">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-[10px] font-bold text-success bg-success-light px-1.5 py-0.5 rounded">
                                  {product.discount_percent}% OFF
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-foreground">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-md active:scale-95 cursor-pointer"
                          >
                            Add to Cart
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
