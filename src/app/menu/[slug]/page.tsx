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
  Zap,
  Gift,
  UtensilsCrossed,
  MessageSquare,
  Send,
  Loader2,
  UserCheck,
  Truck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn, formatPrice, getDiscountedPrice } from "@/lib/utils";
import { SEED_PRODUCTS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useFavouritesStore } from "@/stores/favourites-store";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Product, Review } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const seedMatch = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  const [product, setProduct] = useState<any>(seedMatch || null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { isFavourite, toggleFavourite } = useFavouritesStore();
  const { user, profile } = useAuth();

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProductAndReviews() {
      try {
        const supabase = createClient();
        
        // Load live product data from database
        const { data: dbProduct } = await supabase
          .from("products")
          .select("*")
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .maybeSingle();

        const activeProd = dbProduct || seedMatch;
        if (dbProduct) {
          setProduct(dbProduct);
        }

        if (activeProd) {
          let targetId = activeProd.id;
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeProd.id);
          if (!isUuid && activeProd.slug) {
            const { data: foundDb } = await supabase
              .from("products")
              .select("id")
              .or(`slug.eq.${activeProd.slug},id.eq.${activeProd.id}`)
              .maybeSingle();
            if (foundDb?.id) targetId = foundDb.id;
          }

          const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .or(`product_id.eq.${targetId},product_id.eq.${activeProd.id},product_id.eq.${activeProd.slug}`)
            .order("created_at", { ascending: false });

          if (!error && data) {
            setReviews(data);
          }
        }
      } catch (err) {
        console.error("Error loading product detail & reviews:", err);
      } finally {
        setIsLoadingReviews(false);
      }
    }

    if (slug) {
      loadProductAndReviews();
    }
  }, [slug]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (!product) return;

    setIsSubmittingReview(true);
    try {
      const supabase = createClient();
      const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Verified Customer";

      let targetProductId = product.id;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id);
      if (!isUuid) {
        const { data: dbProduct } = await supabase
          .from("products")
          .select("id")
          .or(`slug.eq.${product.slug},id.eq.${product.id}`)
          .maybeSingle();

        if (dbProduct?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dbProduct.id)) {
          targetProductId = dbProduct.id;
        }
      }

      let { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: targetProductId,
          user_id: user.id,
          user_name: userName,
          rating: newRating,
          comment: newComment.trim(),
        })
        .select()
        .single();

      // Fallback if user_name column does not exist in user's Supabase reviews table
      if (error && (error.message?.includes("user_name") || error.code === "PGRST204")) {
        const res = await supabase
          .from("reviews")
          .insert({
            product_id: targetProductId,
            user_id: user.id,
            rating: newRating,
            comment: newComment.trim(),
          })
          .select()
          .single();
        
        data = res.data;
        error = res.error;
        if (data) {
          data.user_name = userName;
        }
      }

      if (error) {
        toast.error(`Failed to submit review: ${error.message}`);
      } else {
        toast.success("Thank you for your review!");
        setReviews((prev) => [data, ...prev]);
        setNewComment("");
        setNewRating(5);
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-background-secondary rounded-full flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-8 h-8 text-foreground-muted" />
          </div>
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
  const isFav = isFavourite(product.id);

  // Compute stats
  const totalReviewsCount = (product.review_count || 0) + reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  return (
    <div className="min-h-screen">
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
                className="object-contain p-4"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  toggleFavourite(product as unknown as Product);
                  toast(isFav ? "Removed from favourites" : "Added to favourites");
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer",
                  isFav
                    ? "bg-danger text-white"
                    : "bg-white text-foreground-secondary hover:text-danger"
                )}
                aria-label="Toggle favourite"
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFav ? "currentColor" : "none"}
                />
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
              Makhana
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
                      i < Math.floor(Number(avgRating))
                        ? "fill-amber-400 text-amber-400"
                        : "fill-border text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{avgRating}</span>
              <span className="text-sm text-foreground-muted">
                ({totalReviewsCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              {product.discount_percent && product.discount_percent > 0 ? (
                <>
                  <span className="text-3xl sm:text-4xl font-bold text-accent">
                    {formatPrice(getDiscountedPrice(product.price, product.discount_percent))}
                  </span>
                  <span className="text-lg text-foreground-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-bold text-white bg-accent px-2.5 py-1 rounded-full">
                    {product.discount_percent}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-foreground-muted mt-1">
              Inclusive of all taxes
            </p>

            {/* Description */}
            <p className="text-sm text-foreground-secondary mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {(product.ingredients || ["Premium Makhana", "Special Spices"]).map((ing: string) => (
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
                  onClick={() => {
                    const finalPrice = getDiscountedPrice(product.price, product.discount_percent);
                    addItem({ ...product, price: finalPrice } as unknown as Product, quantity);
                    toast.success(`${quantity}x ${product.name} added to cart!`);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart — {formatPrice(getDiscountedPrice(product.price, product.discount_percent) * quantity)}
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Cash on Delivery</p>
                  <p className="text-[10px] text-foreground-muted">
                    Within 3 days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
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

        {/* Customer Reviews Section */}
        <section className="mt-16 pt-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-accent" />
                Customer Reviews
              </h2>
              <p className="text-sm text-foreground-secondary mt-1">
                Real feedback from verified makhana lovers
              </p>
            </div>

            <div className="flex items-center gap-3 bg-background-secondary px-4 py-2 rounded-2xl border border-border">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold">{avgRating}</span>
              </div>
              <span className="text-xs text-foreground-muted">
                Based on {totalReviewsCount} reviews
              </span>
            </div>
          </div>

          {/* Add Review Form (Only for Logged-In Users) */}
          <div className="bg-white rounded-2xl border border-border p-6 mb-10 shadow-xs">
            {user ? (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-accent" />
                    Write a Review
                  </h3>
                  <span className="text-xs text-foreground-muted">
                    Posting as <span className="font-semibold text-foreground">{profile?.full_name || user.email}</span>
                  </span>
                </div>

                {/* Rating Selector */}
                <div>
                  <label className="text-xs font-medium text-foreground-secondary block mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={cn(
                            "w-6 h-6",
                            star <= newRating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-border text-border"
                          )}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-foreground ml-2">
                      {newRating} / 5
                    </span>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <textarea
                    rows={3}
                    placeholder="Share your taste experience, crunch quality, and flavor feedback..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-4 bg-background-secondary border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-foreground-secondary font-medium">
                  Have you tasted this product?
                </p>
                <p className="text-xs text-foreground-muted mt-1">
                  Please sign in to write a customer review
                </p>
                <Link
                  href={`/sign-in?redirect=/menu/${product.slug}`}
                  className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Sign In to Write Review
                </Link>
              </div>
            )}
          </div>

          {/* List of Reviews */}
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent mx-auto" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-background-secondary rounded-2xl p-8 text-center text-sm text-foreground-muted">
              No custom customer reviews submitted yet. Be the first to review this product above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 bg-white rounded-2xl border border-border shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center">
                          {(r.user_name || "C")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {r.user_name || "Verified Buyer"}
                          </p>
                          <p className="text-[10px] text-foreground-muted">
                            {new Date(r.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-border text-border"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-foreground-secondary leading-relaxed mt-3">
                      &quot;{r.comment}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
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
