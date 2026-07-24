"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Loader2,
  Check,
  Flame,
  AlertTriangle,
  Save,
  ImageIcon,
  Upload,
} from "lucide-react";
import { cn, formatPrice, getDiscountedPrice } from "@/lib/utils";
import { SEED_PRODUCTS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Form States
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(179);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

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
    setDiscountPercent(0);
    setStockQuantity(50);
    setSpiceLevel(3);
    setImageUrl("");
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
    setDiscountPercent(p.discount_percent || 0);
    setStockQuantity(p.stock_quantity ?? 50);
    setSpiceLevel(p.spice_level || 3);
    setImageUrl(p.image || p.image_url || "/images/makhna-spicy.png");
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
    const finalImage = imageUrl.trim() || "/images/makhna-spicy.png";

    try {
      const supabase = createClient();

      if (editingProduct) {
        // Edit existing product
        let { error } = await supabase
          .from("products")
          .update({
            name,
            description,
            price: Number(price),
            discount_percent: Number(discountPercent),
            stock_quantity: Number(stockQuantity),
            spice_level: Number(spiceLevel),
            image: finalImage,
            image_url: finalImage,
            is_available: isAvailable && Number(stockQuantity) > 0,
            is_bestseller: isBestseller,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id);

        if (error && error.message.includes("column")) {
          // Fallback update if extended columns aren't in DB yet
          const fallback = await supabase
            .from("products")
            .update({
              name,
              description,
              price: Number(price),
              is_available: isAvailable,
            })
            .eq("id", editingProduct.id);
          error = fallback.error;
        }

        if (error) {
          toast.error(`Update failed: ${error.message}`);
        } else {
          toast.success("Product updated successfully!");
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                    ...p,
                    name,
                    description,
                    price: Number(price),
                    discount_percent: Number(discountPercent),
                    stock_quantity: Number(stockQuantity),
                    spice_level: Number(spiceLevel),
                    image: finalImage,
                    image_url: finalImage,
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
        let { data, error } = await supabase
          .from("products")
          .insert({
            name,
            slug,
            description,
            price: Number(price),
            discount_percent: Number(discountPercent),
            stock_quantity: Number(stockQuantity),
            spice_level: Number(spiceLevel),
            image: finalImage,
            image_url: finalImage,
            is_available: isAvailable && Number(stockQuantity) > 0,
            is_bestseller: isBestseller,
            ingredients: ["Premium Makhana", "Special Spices", "Sea Salt"],
          })
          .select()
          .single();

        if (error && error.message.includes("column")) {
          // Fallback insert if extended schema columns aren't in DB yet
          const fallback = await supabase
            .from("products")
            .insert({
              name,
              slug,
              description,
              price: Number(price),
              is_available: isAvailable,
            })
            .select()
            .single();

          data = fallback.data;
          error = fallback.error;
          if (!error) {
            toast.info("Created with basic schema. Run SQL command to enable full image & stock tracking.");
          }
        }

        if (error) {
          toast.error(`Create failed: ${error.message}`);
        } else {
          toast.success("Product created successfully!");
          setProducts([data, ...products]);
          resetForm();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProductId);

      if (error) {
        toast.error(`Delete failed: ${error.message}`);
      } else {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p.id !== deletingProductId));
      }
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const isModalOpen = isAdding || Boolean(editingProduct);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products & Inventory</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Manage store products, image URLs, pricing, stock count & availability
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-accent/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Shadcn-style Custom Dialog Modal for Add/Edit Product */}
      <Dialog
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingProduct ? `Edit Product` : "Add New Product"}
        description="Enter product details, image URL, pricing, and inventory parameters."
        className="max-w-xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Peri Peri Makhana"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">
                Original Price (₹) *
              </label>
              <input
                type="number"
                placeholder="179"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">
                Discount Percent (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>
          </div>

          {/* Price Preview Box */}
          {discountPercent > 0 && (
            <div className="p-3 bg-success-light/40 border border-success/30 rounded-xl text-xs flex items-center justify-between">
              <span className="text-foreground-secondary font-medium">Customer Selling Price:</span>
              <div className="flex items-center gap-2">
                <span className="line-through text-foreground-muted">{formatPrice(price)}</span>
                <span className="font-bold text-success text-sm">{formatPrice(getDiscountedPrice(price, discountPercent))}</span>
                <span className="px-1.5 py-0.5 bg-success text-white text-[10px] font-bold rounded">{discountPercent}% OFF</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">
                Stock Quantity (Units) *
              </label>
              <input
                type="number"
                placeholder="50"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-secondary block mb-1">
                Spice Level (1 to 5)
              </label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              >
                <option value={1}>1 - Mild</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - Hot</option>
                <option value={4}>4 - Very Hot</option>
                <option value={5}>5 - Extreme</option>
              </select>
            </div>
          </div>

          {/* Product Image Placeholder & Upload Area */}
          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1.5">
              Product Image
            </label>
            {imageUrl ? (
              <div className="relative group border-2 border-dashed border-accent/40 bg-accent-light/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-border shrink-0 shadow-sm">
                    <Image
                      src={imageUrl}
                      alt="Product Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">Product Image Uploaded</p>
                    <p className="text-[11px] text-foreground-muted truncate">{imageUrl}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-light rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border hover:border-accent bg-background-secondary hover:bg-accent-light/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center mb-2 shadow-xs text-foreground-muted group-hover:text-accent">
                  {isUploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-accent" />
                  )}
                </div>
                <p className="text-xs font-bold text-foreground">
                  {isUploadingImage ? "Uploading Image..." : "Click or Drag to Upload Product Image"}
                </p>
                <p className="text-[10px] text-foreground-muted mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground-secondary block mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Crispy makhana tossed in fiery spices..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-background-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
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

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-background-secondary text-foreground-secondary text-xs font-medium rounded-xl hover:bg-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-accent/20"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Product
            </button>
          </div>
        </div>
      </Dialog>

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
            const imgSrc =
              product.image ||
              product.image_url ||
              (product.slug === "peri-peri-makhna" || product.id === "makhna-spicy"
                ? "/images/makhna-spicy.png"
                : "/images/makhna-honey.jpg");

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
                    src={imgSrc}
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
                      <h3 className="text-sm font-semibold truncate">
                        {product.name}
                      </h3>
                      <div className="text-right">
                        {product.discount_percent && product.discount_percent > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-accent">
                              {formatPrice(getDiscountedPrice(product.price, product.discount_percent))}
                            </span>
                            <span className="text-[10px] text-foreground-muted line-through">
                              {formatPrice(product.price)} ({product.discount_percent}% OFF)
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
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
                            <AlertTriangle className="w-2.5 h-2.5" /> Out of
                            Stock
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent-light transition-colors cursor-pointer"
                        title="Edit Product & Image"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProductId(product.id)}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={Boolean(deletingProductId)}
        onClose={() => setDeletingProductId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-danger-light border border-danger/20 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-danger shrink-0" />
            <p className="text-xs font-medium text-danger">
              Deleting this product will permanently remove it from your store inventory catalog.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeletingProductId(null)}
              className="px-4 py-2 bg-background-secondary text-foreground-secondary text-xs font-semibold rounded-xl hover:bg-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeleteProduct}
              className="px-5 py-2 bg-danger hover:bg-danger/90 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Delete Product
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
