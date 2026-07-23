"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Loader2,
  Check,
  X,
  Flame,
  AlertTriangle,
  Save,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { SEED_PRODUCTS, CATEGORIES } from "@/lib/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(179);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        setProducts(SEED_PRODUCTS as unknown as any[]);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(SEED_PRODUCTS as unknown as any[]);
      }
    } catch {
      setProducts(SEED_PRODUCTS as unknown as any[]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(179);
    setStockQuantity(50);
    setSpiceLevel(3);
    setIsAvailable(true);
    setIsBestseller(false);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleStartEdit = (p: any) => {
    setEditingProduct(p);
    setName(p.name || "");
    setDescription(p.description || "");
    setPrice(p.price || 179);
    setStockQuantity(p.stock_quantity ?? 50);
    setSpiceLevel(p.spice_level || 3);
    setIsAvailable(p.is_available ?? true);
    setIsBestseller(p.is_bestseller ?? false);
    setIsAdding(false);
  };

  const handleSaveProduct = async () => {
    if (!name || !description || price <= 0) {
      toast.error("Please fill in all required product fields");
      return;
    }

    setIsSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const supabase = createClient();

      if (editingProduct) {
        // Edit existing product
        const { error } = await supabase
          .from("products")
          .update({
            name,
            description,
            price: Number(price),
            stock_quantity: Number(stockQuantity),
            spice_level: Number(spiceLevel),
            is_available: isAvailable && Number(stockQuantity) > 0,
            is_bestseller: isBestseller,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id);

        if (error) {
          toast.error(`Update failed: ${error.message}`);
        } else {
          toast.success("Product updated!");
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                    ...p,
                    name,
                    description,
                    price: Number(price),
                    stock_quantity: Number(stockQuantity),
                    spice_level: Number(spiceLevel),
                    is_available: isAvailable && Number(stockQuantity) > 0,
                    is_bestseller: isBestseller,
                  }
                : p
            )
          );
          resetForm();
        }
      } else {
        // Add new product
        const { data, error } = await supabase
          .from("products")
          .insert({
            name,
            slug,
            description,
            price: Number(price),
            stock_quantity: Number(stockQuantity),
            spice_level: Number(spiceLevel),
            is_available: isAvailable && Number(stockQuantity) > 0,
            is_bestseller: isBestseller,
            ingredients: ["Premium Makhna", "Special Spices", "Sea Salt"],
          })
          .select()
          .single();

        if (error) {
          toast.error(`Create failed: ${error.message}`);
        } else {
          toast.success("Product created!");
          setProducts([data, ...products]);
          resetForm();
        }
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        toast.error(`Delete failed: ${error.message}`);
      } else {
        toast.success("Product deleted");
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products & Inventory</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage your store products, pricing, stock count & availability
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-accent/20"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Add / Edit Form Drawer/Card */}
      <AnimatePresence>
        {(isAdding || editingProduct) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 bg-white rounded-2xl border border-accent/40 shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-accent">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 text-foreground-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peri Peri Makhna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="179"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Stock Quantity (Units) *
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  placeholder="Crispy fox nuts tossed in fiery spices..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground-secondary block mb-1">
                  Spice Level (1 to 5)
                </label>
                <select
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                >
                  <option value={1}>1 - Mild</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - Hot</option>
                  <option value={4}>4 - Very Hot</option>
                  <option value={5}>5 - Extreme</option>
                </select>
              </div>

              <div className="flex items-center gap-6 pt-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-accent rounded"
                  />
                  In Stock & Available
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 text-accent rounded"
                  />
                  Bestseller Badge
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-background-secondary text-foreground-secondary text-xs font-medium rounded-xl hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-6 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Product
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-sm mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search product inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-border mt-6">
          <Package className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-base font-semibold">No products found</h3>
          <p className="text-xs text-foreground-secondary mt-1">
            Click &quot;Add New Product&quot; above to create products in Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filtered.map((product, i) => {
            const stock = product.stock_quantity ?? 50;
            const inStock = product.is_available && stock > 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border p-4 flex gap-4 shadow-sm"
              >
                <div className="relative w-20 h-20 bg-background-secondary rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={product.slug === "peri-peri-makhna" || product.id === "makhna-spicy" ? "/images/makhna-spicy.png" : "/images/makhna-honey.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {product.is_bestseller && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent text-white text-[8px] font-bold uppercase rounded">
                      Best
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <p className="text-xs text-foreground-secondary mt-0.5 line-clamp-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-light">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1",
                          inStock
                            ? "bg-success-light text-success"
                            : "bg-danger-light text-danger"
                        )}
                      >
                        {inStock ? (
                          <>
                            <Check className="w-2.5 h-2.5" /> In Stock ({stock})
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-2.5 h-2.5" /> Out of Stock
                          </>
                        )}
                      </span>

                      <span className="text-[10px] text-foreground-muted flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-accent" />
                        {product.spice_level}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors"
                        title="Edit Product & Stock"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger-light transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
