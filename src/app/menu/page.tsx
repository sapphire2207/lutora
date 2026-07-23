"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Plus,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { SEED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import type { Product } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categoryIconMap: Record<string, React.ElementType> = {
  Utensils,
  Flame,
  Sparkles,
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = useMemo(() => {
    let products = [...SEED_PRODUCTS];

    // Filter by search
    if (searchQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        products.sort((a, b) => b.review_count - a.review_count);
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (product: typeof SEED_PRODUCTS[number]) => {
    addItem(product as unknown as Product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-background-secondary border-b border-border">
        <div className="container-app py-8 md:py-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-2xl sm:text-3xl font-bold">Our Flavors</h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Handcrafted Peri Peri Spicy & Organic Honey Makhna
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search makhna flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-border rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-[var(--nav-height)] z-30 bg-white border-b border-border">
        <div className="container-app">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIconMap[cat.icon] || Utensils;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all",
                    isSelected
                      ? "bg-foreground text-white"
                      : "bg-background-secondary text-foreground-secondary hover:bg-border-light"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container-app">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-background-secondary rounded-full flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-8 h-8 text-foreground-muted" />
              </div>
              <p className="text-lg font-semibold">No items found</p>
              <p className="text-sm text-foreground-secondary mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProducts.map((product, index) => {
                const cat = CATEGORIES.find((c) => c.slug === product.category);
                const CatIcon = cat ? categoryIconMap[cat.icon] || Utensils : Utensils;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="group bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <Link
                          href={`/menu/${product.slug}`}
                          className="relative w-full sm:w-52 h-52 sm:h-auto bg-background-secondary shrink-0 overflow-hidden"
                        >
                          <Image
                            src={product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 200px"
                          />
                          {product.is_bestseller && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                              Bestseller
                            </span>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <Link href={`/menu/${product.slug}`}>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-foreground-secondary mt-1.5 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold">
                                  {product.rating}
                                </span>
                                <span className="text-xs text-foreground-muted">
                                  ({product.review_count})
                                </span>
                              </div>
                              <span className="text-foreground-muted">·</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-foreground-muted">Spice:</span>
                                <div className="flex items-center">
                                  {Array.from({ length: product.spice_level }).map((_, i) => (
                                    <Flame key={i} className="w-3.5 h-3.5 text-accent fill-accent/20" />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Ingredients Preview */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {product.ingredients.slice(0, 3).map((ing) => (
                                <span
                                  key={ing}
                                  className="px-2 py-0.5 bg-background-secondary text-foreground-muted text-[10px] rounded-full"
                                >
                                  {ing}
                                </span>
                              ))}
                              {product.ingredients.length > 3 && (
                                <span className="px-2 py-0.5 bg-background-secondary text-foreground-muted text-[10px] rounded-full">
                                  +{product.ingredients.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Add */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light">
                            <span className="text-xl font-bold text-foreground">
                              {formatPrice(product.price)}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-md active:scale-95"
                            >
                              Add
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
