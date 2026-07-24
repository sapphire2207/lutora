"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Calendar,
  IndianRupee,
  Shield,
} from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { CustomSelect } from "@/components/ui/custom-select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const STATUS_SELECT_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
].map((st) => ({
  value: st,
  label: ORDER_STATUS_LABELS[st] || st,
}));

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      const supabase = createClient();
      // Fetch order with order items & products
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product:products(*))")
        .eq("id", orderId)
        .single();

      if (error) {
        // Try searching by order_number if id lookup fails
        const { data: altOrder } = await supabase
          .from("orders")
          .select("*, order_items(*, product:products(*))")
          .eq("order_number", orderId)
          .single();

        if (altOrder) {
          setOrder(altOrder);
          if (altOrder.user_id) {
            const { data: prof } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", altOrder.user_id)
              .single();
            setUserProfile(prof || null);
          }
        }
      } else if (orderData) {
        setOrder(orderData);
        if (orderData.user_id) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", orderData.user_id)
            .single();
          setUserProfile(prof || null);
        }
      }
    } catch (err) {
      console.error("Admin order detail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const supabase = createClient();

      let { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id)
        .select();

      if ((!data || data.length === 0) && order.order_number) {
        const res = await supabase
          .from("orders")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("order_number", order.order_number)
          .select();
        data = res.data;
        error = res.error;
      }

      if (error) {
        console.error("Status update error:", error);
        toast.error(`Update failed: ${error.message}`);
      } else if (!data || data.length === 0) {
        toast.error("Database update blocked by RLS. Run SQL command in Supabase.");
      } else {
        toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus] || newStatus}!`);
        setOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      console.error("Status update exception:", err);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 md:p-8 text-center py-20 bg-white rounded-2xl border border-border">
        <Package className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-sm text-foreground-secondary mt-1">
          The requested order ID does not exist in the database.
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-accent text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const customerName = userProfile?.full_name || "Guest Customer";
  const customerEmail = userProfile?.email || "Not provided";
  const customerPhone = order.phone || userProfile?.phone || "Not set";
  const displayId = order.order_number || order.id;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-border hover:bg-background-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Order {displayId}
            </h1>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Placed on {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground-secondary hidden sm:inline">
            Update Status:
          </span>
          <CustomSelect
            options={STATUS_SELECT_OPTIONS}
            value={order.status}
            onChange={(val) => handleUpdateStatus(val)}
            className="w-44"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <UserIcon className="w-5 h-5 text-accent" />
              Customer Details
            </h2>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-light text-accent text-base font-bold flex items-center justify-center shrink-0">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{customerName}</p>
                <span className="px-2 py-0.5 bg-background-secondary text-foreground-secondary text-[10px] font-medium rounded-full">
                  {userProfile?.role || "Customer"}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-foreground-secondary pt-2">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-foreground-muted shrink-0" />
                <span className="truncate">{customerEmail}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-foreground-muted shrink-0" />
                <span>+91 {customerPhone}</span>
              </div>

              {userProfile?.created_at && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-foreground-muted shrink-0" />
                  <span>Joined {formatDateTime(userProfile.created_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="w-5 h-5 text-accent" />
              Delivery Address
            </h2>
            <p className="text-xs text-foreground leading-relaxed">
              {order.notes || "Standard Delivery Address"}
            </p>
          </div>
        </div>

        {/* Order Items & Breakdown Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border pb-4 mb-4">
              <Package className="w-5 h-5 text-accent" />
              Ordered Items
            </h2>

            {/* Items List */}
            <div className="space-y-4">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item: any) => {
                  const product = item.product || {};
                  const name = product.name || "Peri Peri Makhana";
                  const image =
                    product.image ||
                    product.image_url ||
                    (product.slug === "peri-peri-makhna"
                      ? "/images/makhna-spicy.png"
                      : "/images/makhna-honey.jpg");

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3 bg-background-secondary rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden border border-border shrink-0">
                          <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{name}</h4>
                          <p className="text-xs text-foreground-muted mt-0.5">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-foreground-muted">
                  No line items found for this order.
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mt-6 pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-foreground-secondary">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal || order.total * 0.95)}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>GST (5%)</span>
                <span className="font-medium">{formatPrice(order.tax || order.total * 0.05)}</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>Delivery Fee</span>
                <span className="font-medium text-success">
                  {order.delivery_fee === 0 ? "FREE" : formatPrice(order.delivery_fee || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-3 border-t border-border">
                <span>Total Amount Paid</span>
                <span className="text-lg text-accent">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
