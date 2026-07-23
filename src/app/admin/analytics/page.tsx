"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Star, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const MONTHLY_DATA = [
  { month: "Jan", revenue: 12500, orders: 65 },
  { month: "Feb", revenue: 18900, orders: 89 },
  { month: "Mar", revenue: 22300, orders: 112 },
  { month: "Apr", revenue: 19800, orders: 98 },
  { month: "May", revenue: 28400, orders: 142 },
  { month: "Jun", revenue: 32100, orders: 167 },
  { month: "Jul", revenue: 35800, orders: 185 },
];

const POPULAR_PRODUCTS = [
  { name: "Peri Peri Makhna", orders: 1245, revenue: 222855, percentage: 62 },
  { name: "Honey Makhna", orders: 890, revenue: 177110, percentage: 38 },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

  return (
    <div className="p-6 md:p-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-foreground-secondary mt-1">Business performance overview</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Revenue", value: formatPrice(169800), icon: IndianRupee, color: "bg-success-light text-success" },
          { label: "Total Orders", value: "858", icon: ShoppingBag, color: "bg-accent-light text-accent" },
          { label: "Total Customers", value: "324", icon: Users, color: "bg-info-light text-info" },
          { label: "Avg Rating", value: "4.8", icon: Star, color: "bg-warning-light text-warning" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-5">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6">
        <h2 className="text-base font-semibold mb-6">Monthly Revenue</h2>
        <div className="h-56 flex items-end justify-between gap-3 px-2">
          {MONTHLY_DATA.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-medium text-foreground-muted">{formatPrice(d.revenue)}</span>
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-border p-6 mt-6">
        <h2 className="text-base font-semibold mb-6">Product Performance</h2>
        <div className="space-y-6">
          {POPULAR_PRODUCTS.map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-foreground-muted">{p.orders} orders · {formatPrice(p.revenue)} revenue</p>
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
