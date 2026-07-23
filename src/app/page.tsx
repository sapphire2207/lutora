"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Leaf,
  Clock,
  ChevronDown,
  Flame,
  Heart,
  Truck,
  Shield,
  Plus,
  Quote,
  Sparkles,
  Utensils,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import {
  SEED_PRODUCTS,
  TRUST_BADGES,
  TESTIMONIALS,
  FAQ_ITEMS,
  WHY_LUTORA,
  CATEGORIES,
} from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Icon map for Why LUTORA
const iconMap: Record<string, React.ElementType> = {
  Flame,
  Heart,
  Truck,
  Shield,
};

// Icon map for Trust Badges
const trustIconMap: Record<string, React.ElementType> = {
  Leaf,
  Clock,
  Star,
};

// Icon map for Categories
const categoryIconMap: Record<string, React.ElementType> = {
  Utensils,
  Flame,
  Sparkles,
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <PopularPicksSection />
      <WhyLutoraSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}

/* ===========================
   HERO SECTION
   =========================== */
function HeroSection() {
  return (
    <section className="relative bg-white">
      <div className="container-app">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 md:py-16 lg:py-20">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="order-2 lg:order-1"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light text-accent text-xs font-semibold rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Signature Flavors
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Bold Flavors.
              <br />
              <span className="text-gradient">Made to Crave.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg text-foreground-secondary max-w-lg leading-relaxed"
            >
              Experience the perfect blend of peri peri spice and makhna magic.
              Premium, healthy snacks delivered fresh to your door.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8"
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-foreground-secondary hover:text-foreground text-sm font-medium transition-colors"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-6 sm:gap-8 mt-10 pt-8 border-t border-border"
            >
              {TRUST_BADGES.map((badge) => {
                const Icon = trustIconMap[badge.icon];
                return (
                  <div key={badge.label} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-light text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {badge.label}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto lg:max-w-none">
              {/* Decorative circle */}
              <div className="absolute inset-4 rounded-full bg-accent-lighter/50" />

              <Image
                src="/images/hero-makhna.png"
                alt="LUTORA Peri Peri Makhna — Crispy spiced fox nuts in a premium bowl"
                fill
                className="object-contain relative z-10 drop-shadow-xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 right-4 md:right-0 z-20 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold">100%</p>
                  <p className="text-xs text-foreground-muted">
                    Natural
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   CATEGORIES SECTION
   =========================== */
function CategoriesSection() {
  return (
    <section className="py-12 md:py-16 bg-background-secondary">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-xl sm:text-2xl font-bold"
          >
            Explore Flavors
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex gap-3 overflow-x-auto no-scrollbar pb-2"
          >
            {CATEGORIES.map((cat) => {
              const Icon = categoryIconMap[cat.icon] || Utensils;
              return (
                <Link
                  key={cat.id}
                  href={`/menu?category=${cat.slug}`}
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-white rounded-2xl border border-border hover:border-accent hover:shadow-md transition-all shrink-0 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-accent-light text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===========================
   POPULAR PICKS SECTION
   =========================== */
function PopularPicksSection() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product: typeof SEED_PRODUCTS[number]) => {
    addItem(product as unknown as Product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                Signature Flavors
                <Flame className="w-5 h-5 text-accent" />
              </h2>
              <p className="text-sm text-foreground-secondary mt-1">
                Handcrafted Peri Peri Spicy & Organic Honey Makhna
              </p>
            </div>
            <Link
              href="/menu"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              View Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {SEED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </motion.div>

          <Link
            href="/menu"
            className="sm:hidden flex items-center justify-center gap-1 mt-6 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            View Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* Product Card */
function ProductCard({
  product,
  onAddToCart,
}: {
  product: typeof SEED_PRODUCTS[number];
  onAddToCart: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const CatIcon = cat ? categoryIconMap[cat.icon] || Utensils : Utensils;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-white rounded-2xl border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-background-secondary shrink-0">
          <Image
            src={product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 200px"
          />
          {product.is_bestseller && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Bestseller
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-foreground-secondary mt-1 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-xs text-foreground-muted">
                ({product.review_count})
              </span>
              <span className="text-foreground-muted mx-1">·</span>
              <span className="text-xs text-foreground-muted flex items-center gap-1">
                <CatIcon className="w-3 h-3 text-accent" />
                {cat?.name}
              </span>
            </div>
          </div>

          {/* Price & Add */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={onAddToCart}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-full transition-all hover:shadow-md active:scale-95"
            >
              Add
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===========================
   WHY LUTORA SECTION
   =========================== */
function WhyLutoraSection() {
  return (
    <section className="py-12 md:py-20 bg-background-secondary">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-xl sm:text-2xl font-bold"
          >
            Why LUTORA?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-foreground-secondary mt-2 max-w-md mx-auto"
          >
            We&apos;re not just another snack brand. Here&apos;s what sets us apart.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10"
          >
            {WHY_LUTORA.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <div
                  key={item.title}
                  className="group bg-white rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold mt-4">{item.title}</h3>
                  <p className="text-xs text-foreground-secondary mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===========================
   TESTIMONIALS SECTION
   =========================== */
function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold">
              What Our Customers Say
            </h2>
            <p className="text-sm text-foreground-secondary mt-2">
              Real reviews from real makhna lovers
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10"
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <Quote className="w-8 h-8 text-accent-lighter mb-3" />
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border-light">
                  <div className="w-9 h-9 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===========================
   FAQ SECTION
   =========================== */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-20 bg-background-secondary">
      <div className="container-app max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-foreground-secondary mt-2">
              Everything you need to know about LUTORA
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-background-secondary transition-colors"
                  aria-expanded={openIndex === index}
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-foreground-muted shrink-0 transition-transform",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-foreground-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===========================
   CTA BANNER
   =========================== */
function CtaBanner() {
  return (
    <section className="py-12 md:py-20">
      <div className="container-app">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative bg-foreground rounded-3xl overflow-hidden px-8 py-12 md:px-16 md:py-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Ready to Taste the
              <span className="text-accent"> Magic</span>?
            </h2>
            <p className="text-sm sm:text-base text-white/60 mt-3 max-w-md mx-auto">
              Order now and get your fresh makhna delivered in under 30 minutes.
              Free delivery on orders above ₹299.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-accent/30"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
