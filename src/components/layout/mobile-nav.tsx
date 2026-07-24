"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Package,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useFavouritesStore } from "@/stores/favourites-store";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/menu", icon: Package },
  { label: "Favourites", href: "/favourites", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const rawItemCount = useCartStore((state) => state.getItemCount());
  const itemCount = mounted ? rawItemCount : 0;

  useEffect(() => {
    setMounted(true);
  }, []);
  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password");

  if (isAdminPage || isAuthPage) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border safe-bottom"
      style={{ height: "var(--mobile-nav-height)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 w-full h-full text-[10px] font-medium transition-colors",
                isActive ? "text-accent" : "text-foreground-muted"
              )}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />

                {/* Cart Badge */}
                {tab.href === "/cart" && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-accent rounded-full"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </div>
              <span className="mt-0.5">{tab.label}</span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-8 h-0.5 bg-accent rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
