"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Package,
  Loader2,
} from "lucide-react";
import { cn, formatPrice, formatDateTime } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();

        // 1. Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*, profile:profiles(*), order_items(*, product:products(*))")
          .order("created_at", { ascending: false });

        if (ordersError) {
          console.error("Dashboard orders fetch error:", ordersError.message);
        }

        const orders = ordersData || [];
        setRecentOrders(orders.slice(0, 5));

        const revenueSum = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
        const pendingCount = orders.filter((o) => o.status === "pending").length;

        // 2. Fetch Profiles count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        setStats({
          todayOrders: orders.length,
          todayRevenue: revenueSum,
          activeUsers: usersCount || 0,
          pendingOrders: pendingCount,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statsCards = [
    {
      label: "Total Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingBag,
      color: "bg-accent-light text-accent",
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.todayRevenue),
      icon: IndianRupee,
      color: "bg-success-light text-success",
    },
    {
      label: "Total Users",
      value: stats.activeUsers.toString(),
      icon: Users,
      color: "bg-info-light text-info",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "bg-warning-light text-warning",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Welcome back! Real-time business overview.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.color
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <TrendingUp className="w-3 h-3" />
                  Live
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-foreground-muted mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border mt-6"
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs text-accent font-medium flex items-center gap-0.5 hover:text-accent-hover transition-colors"
          >
            View All
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 px-4 border-t border-border">
            <Package className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
            <p className="text-sm font-semibold">No orders yet</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              Customer orders placed on the store will display here.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3 border-t border-border">
              {recentOrders.map((order) => {
                const displayId = order.order_number || order.id.slice(0, 8);
                const customerName = order.profile?.full_name || `Phone: ${order.phone}`;
                return (
                  <div
                    key={order.id}
                    className="p-4 bg-background-secondary rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-foreground-muted" />
                        <span className="text-xs font-semibold">{displayId}</span>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize",
                          ORDER_STATUS_COLORS[order.status] || "bg-background-secondary"
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-foreground-secondary">
                      <span>{customerName}</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border-t border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs text-foreground-muted">
                    <th className="text-left font-medium px-6 py-3">Order</th>
                    <th className="text-left font-medium px-6 py-3">Customer</th>
                    <th className="text-left font-medium px-6 py-3">Items</th>
                    <th className="text-left font-medium px-6 py-3">Total</th>
                    <th className="text-left font-medium px-6 py-3">Status</th>
                    <th className="text-left font-medium px-6 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const displayId = order.order_number || order.id.slice(0, 8);
                    const customerName = order.profile?.full_name || `Phone: ${order.phone}`;
                    const itemsText =
                      order.order_items && order.order_items.length > 0
                        ? order.order_items
                            .map((i: any) => `${i.product?.name || "Makhna"} ×${i.quantity}`)
                            .join(", ")
                        : "1x Order";

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border last:border-b-0 hover:bg-background-secondary/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-semibold">
                          {displayId}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground-secondary">
                          {customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground-secondary">
                          {itemsText}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize",
                              ORDER_STATUS_COLORS[order.status] || "bg-background-secondary"
                            )}
                          >
                            {ORDER_STATUS_LABELS[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-foreground-muted">
                          {formatDateTime(order.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
