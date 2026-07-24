"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Star, IndianRupee, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgRating: 4.8,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const supabase = createClient();

        const [ordersRes, profilesRes, itemsRes, productsRes] = await Promise.all([
          supabase.from("orders").select("*").order("created_at", { ascending: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("order_items").select("*, product:products(name, rating)"),
          supabase.from("products").select("name, rating"),
        ]);

        const orders = ordersRes.data || [];
        const customersCount = profilesRes.count || 0;
        const items = itemsRes.data || [];
        const products = productsRes.data || [];

        // 1. Summary Calculation
        const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
        const totalOrders = orders.length;

        // Average rating
        let avgRating = 4.8;
        if (products.length > 0) {
          const sumRatings = products.reduce((acc, p) => acc + (Number(p.rating) || 4.8), 0);
          avgRating = Number((sumRatings / products.length).toFixed(1));
        }

        setSummary({
          totalRevenue,
          totalOrders,
          totalCustomers: customersCount,
          avgRating,
        });

        // 2. Monthly Revenue Calculation
        const monthsMap = new Map<string, { revenue: number; orders: number }>();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Pre-fill recent months
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = `${monthNames[d.getMonth()]}`;
          monthsMap.set(monthLabel, { revenue: 0, orders: 0 });
        }

        orders.forEach((o) => {
          if (o.created_at) {
            const date = new Date(o.created_at);
            const label = monthNames[date.getMonth()];
            if (monthsMap.has(label)) {
              const current = monthsMap.get(label)!;
              monthsMap.set(label, {
                revenue: current.revenue + (Number(o.total) || 0),
                orders: current.orders + 1,
              });
            }
          }
        });

        const formattedMonthly = Array.from(monthsMap.entries()).map(([month, data]) => ({
          month,
          revenue: data.revenue,
          orders: data.orders,
        }));
        setMonthlyData(formattedMonthly);

        // 3. Product Performance Calculation
        const productStats = new Map<string, { name: string; orders: number; revenue: number }>();

        items.forEach((item) => {
          const name = item.product?.name || "Peri Peri Makhana";
          const current = productStats.get(name) || { name, orders: 0, revenue: 0 };
          const itemRev = (Number(item.price) || 0) * (Number(item.quantity) || 1);
          productStats.set(name, {
            name,
            orders: current.orders + (Number(item.quantity) || 1),
            revenue: current.revenue + itemRev,
          });
        });

        // Fallback default product stats if no order items exist yet
        if (productStats.size === 0) {
          productStats.set("Peri Peri Makhana", { name: "Peri Peri Makhana", orders: totalOrders, revenue: totalRevenue });
        }

        const totalProductRev = Array.from(productStats.values()).reduce((a, b) => a + b.revenue, 0) || 1;
        const formattedProducts = Array.from(productStats.values()).map((p) => ({
          ...p,
          percentage: Math.round((p.revenue / totalProductRev) * 100),
        }));

        setProductPerformance(formattedProducts);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 100);

  if (isLoading) {
    return (
      <div className="p-8 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Analytics & Business Intelligence</h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Real-time performance overview powered by live database orders
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Revenue", value: formatPrice(summary.totalRevenue), icon: IndianRupee, color: "bg-success-light text-success" },
          { label: "Total Orders", value: summary.totalOrders.toString(), icon: ShoppingBag, color: "bg-accent-light text-accent" },
          { label: "Total Customers", value: summary.totalCustomers.toString(), icon: Users, color: "bg-info-light text-info" },
          { label: "Avg Rating", value: summary.avgRating.toString(), icon: Star, color: "bg-warning-light text-warning" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-5 shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-foreground-muted mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6 shadow-xs"
      >
        <h2 className="text-base font-semibold mb-6">Real-time Monthly Revenue</h2>
        <div className="h-56 flex items-end justify-between gap-3 px-2">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-medium text-foreground-muted">
                {formatPrice(d.revenue)}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                className="w-full bg-accent/20 hover:bg-accent/40 rounded-t-lg transition-colors cursor-pointer min-h-[4px]"
              />
              <span className="text-[10px] text-foreground-muted">{d.month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Popular Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6 shadow-xs"
      >
        <h2 className="text-base font-semibold mb-6">Product Sales Breakdown</h2>
        <div className="space-y-6">
          {productPerformance.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {p.orders} units sold · {formatPrice(p.revenue)} revenue
                  </p>
                </div>
                <span className="text-sm font-bold text-accent">{p.percentage}%</span>
              </div>
              <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.percentage}%` }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
