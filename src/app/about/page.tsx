"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Flame, Award, Users, Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const STATS = [
  { icon: Users, value: "10K+", label: "Happy Customers" },
  { icon: Flame, value: "2", label: "Signature Flavors" },
  { icon: Award, value: "4.8", label: "Average Rating" },
  { icon: Heart, value: "100%", label: "Natural Ingredients" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-background-secondary">
        <div className="container-app py-16 md:py-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 bg-accent-light text-accent text-xs font-semibold rounded-full mb-4"
            >
              Our Story
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto"
            >
              We Believe Snacking Should Be{" "}
              <span className="text-gradient">Bold & Healthy</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-foreground-secondary mt-4 max-w-lg mx-auto leading-relaxed"
            >
              LUTORA was born from a simple idea: combine the ancient superfood
              makhana with bold, modern flavors. No compromises on taste. No
              compromises on health.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 bg-white rounded-2xl border border-border"
                >
                  <Icon className="w-6 h-6 text-accent mx-auto mb-3" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-20 bg-background-secondary">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/images/hero-makhna-v2.png"
                  alt="LUTORA premium makhna"
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold">
                From a Kitchen Experiment to Your Favorite Snack
              </h2>
              <div className="space-y-4 mt-6 text-sm text-foreground-secondary leading-relaxed">
                <p>
                  It started with a question: why can&apos;t healthy snacks taste
                  amazing? Makhna — the humble fox nut — has been an Indian
                  superfood for centuries. Light, crunchy, and packed with
                  protein, it was the perfect canvas.
                </p>
                <p>
                  We spent months perfecting our peri peri blend — sourcing
                  African bird&apos;s eye chili, combining it with garlic, paprika,
                  and a secret mix of spices. The result? A snack that&apos;s
                  impossibly addictive and guilt-free.
                </p>
                <p>
                  Today, LUTORA serves thousands of customers who&apos;ve discovered
                  that bold flavors and healthy eating aren&apos;t mutually exclusive.
                  Every batch is made fresh, with 100% natural ingredients and
                  zero preservatives.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20">
        <div className="container-app text-center">
          <h2 className="text-2xl md:text-3xl font-bold">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: Leaf,
                title: "Natural Ingredients",
                desc: "No artificial flavors, no preservatives, no MSG. Just real food.",
              },
              {
                icon: Flame,
                title: "Bold Innovation",
                desc: "We push boundaries to create flavors you've never experienced before.",
              },
              {
                icon: Heart,
                title: "Health First",
                desc: "Low calorie, high protein, gluten-free. Snacking without the guilt.",
              },
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-2xl border border-border flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold mt-4">{value.title}</h3>
                  <p className="text-sm text-foreground-secondary mt-2">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
