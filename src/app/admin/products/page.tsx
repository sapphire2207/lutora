"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Search, Plus, Edit2, Trash2, MoreVertical } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { SEED_PRODUCTS } from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const products = SEED_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage your menu items
          </p>
        </div>
        <button
          onClick={() => toast.info("Product creation coming soon!")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-border p-4 flex gap-4"
          >
            <div className="relative w-20 h-20 bg-background-secondary rounded-xl overflow-hidden shrink-0">
              <Image
                src={product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="text-xs text-foreground-secondary mt-0.5 line-clamp-1">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-semibold rounded-full",
                      product.is_available
                        ? "bg-success-light text-success"
                        : "bg-danger-light text-danger"
                    )}
                  >
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toast.info("Edit coming soon!")}
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toast.info("Delete coming soon!")}
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger-light transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
