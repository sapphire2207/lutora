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
  AlertTriangle,
  Package,
  Heart,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn, formatPrice } from "@/lib/utils";
import { SEED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useFavouritesStore } from "@/stores/favourites-store";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { CustomSelect } from "@/components/ui/custom-select";
import { Loading } from "@/components/ui/loading";
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

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setProductsList(SEED_PRODUCTS as unknown as any[]);
        } else {
          setProductsList(data);
        }
      } catch {
        setProductsList(SEED_PRODUCTS as unknown as any[]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...productsList];

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
      products = products.filter((p) => p.category === selectedCategory || p.category_id === selectedCategory);
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
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        products.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    }

    return products;
  }, [productsList, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (product: any) => {
    const stock = product.stock_quantity ?? 50;
    if (!product.is_available || stock <= 0) {
      toast.error(`${product.name} is currently out of stock`);
      return;
    }
    addItem(product as Product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-background-secondary border-b border-border">
        <div className="container-app py-8 md:py-12">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              Our Products
              <Package className="w-6 h-6 text-accent" />
            </h1>
            <p className="text-sm text-foreground-secondary mt-1">
              Handcrafted Peri Peri Spicy & Organic Honey Makhana
            </p>
          </motion.div>

          {/* Search & Custom Select Filters */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>

            {/* Custom Sort Select */}
            <CustomSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              icon={<SlidersHorizontal className="w-4 h-4 text-foreground-muted" />}
              className="w-full sm:w-52"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="sticky top-[var(--nav-height)] z-30 bg-white border-b border-border">
        <div className="container-app">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
            {CATEGORIES.filter((c) => c.slug === "all").map((cat) => {
              const Icon = categoryIconMap[cat.icon] || Utensils;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all cursor-pointer",
                    isSelected
                      ? "bg-foreground text-white shadow-sm"
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
          {isLoading ? (
            <Loading fullPage text="Fetching Live Products..." />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-background-secondary rounded-full flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-8 h-8 text-foreground-muted" />
              </div>
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm text-foreground-secondary mt-1">
                Try adjusting your search or category filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProducts.map((product, index) => {
                const cat = CATEGORIES.find((c) => c.slug === product.category || c.id === product.category_id);
                const CatIcon = cat ? categoryIconMap[cat.icon] || Utensils : Utensils;
                const stock = product.stock_quantity ?? 50;
                const inStock = product.is_available && stock > 0;
                const ingredients = product.ingredients || ["Premium Makhana", "Special Spices"];

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 200px"
                          />
                          {!inStock && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="px-3 py-1 bg-danger text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                              </span>
                            </div>
                          )}
                          {/* Heart Icon */}
                          {inStock && (
                            <HeartButton product={product} />
                          )}
                        </Link>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <Link href={`/menu/${product.slug || product.id}`}>
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
                                  {product.rating || 4.8}
                                </span>
                                <span className="text-xs text-foreground-muted">
                                  ({product.review_count || 150})
                                </span>
                              </div>
                            </div>

                            {/* Ingredients Preview */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {ingredients.slice(0, 3).map((ing: string) => (
                                <span
                                  key={ing}
                                  className="px-2 py-0.5 bg-background-secondary text-foreground-muted text-[10px] rounded-full"
                                >
                                  {ing}
                                </span>
                              ))}
                              {ingredients.length > 3 && (
                                <span className="px-2 py-0.5 bg-background-secondary text-foreground-muted text-[10px] rounded-full">
                                  +{ingredients.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price & Add */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light">
                            <div>
                              <span className="text-xl font-bold text-foreground block">
                                {formatPrice(product.price)}
                              </span>
                              {!inStock ? (
                                <span className="text-[10px] font-semibold text-danger">
                                  Out of Stock
                                </span>
                              ) : (
                                <span className="text-[10px] text-success font-medium">
                                  In Stock ({stock} available)
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!inStock}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full transition-all active:scale-95",
                                inStock
                                  ? "bg-accent hover:bg-accent-hover text-white hover:shadow-md cursor-pointer"
                                  : "bg-border text-foreground-muted cursor-not-allowed"
                              )}
                            >
                              {inStock ? (
                                <>
                                  Add <Plus className="w-4 h-4" />
                                </>
                              ) : (
                                "Sold Out"
                              )}
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

function HeartButton({ product }: { product: any }) {
  const { isFavourite, toggleFavourite } = useFavouritesStore();
  const isFav = isFavourite(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite(product as Product);
        toast(isFav ? "Removed from favourites" : "Added to favourites");
      }}
      className={cn(
        "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer",
        isFav
          ? "bg-danger text-white"
          : "bg-white/90 text-foreground-secondary hover:text-danger"
      )}
      aria-label="Toggle favourite"
    >
      <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
    </button>
  );
}

