"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Shield,
  LogOut,
  Heart,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/providers/auth-provider";
import { useFavouritesStore } from "@/stores/favourites-store";

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const favouriteCount = useFavouritesStore((s) => s.favourites.length);
  const rawItemCount = useCartStore((state) => state.getItemCount());
  const itemCount = mounted ? rawItemCount : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass border-b border-border shadow-sm"
            : "bg-white"
        )}
        style={{ height: "var(--nav-height)" }}
      >
        <div className="container-app h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <span className="text-xl font-bold tracking-tight text-foreground">
              LUT
              <span className="text-accent">O</span>
              RA
            </span>
            <span className="hidden sm:block text-[10px] font-medium text-foreground-secondary tracking-widest uppercase ml-1.5 mt-0.5">
              Peri Peri Makhana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-accent"
                      : "text-foreground-secondary hover:text-foreground hover:bg-background-secondary"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Admin Badge link (if admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent text-xs font-semibold rounded-full border border-accent/20 hover:bg-accent hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            {/* Search - Desktop only */}
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-semibold text-white bg-accent rounded-full"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Favourites */}
            <Link
              href="/favourites"
              className="hidden md:flex relative items-center justify-center w-10 h-10 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
              aria-label="Favourites"
            >
              <Heart className="w-[18px] h-[18px]" />
              <AnimatePresence>
                {mounted && favouriteCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-semibold text-white bg-danger rounded-full"
                  >
                    {favouriteCount > 9 ? "9+" : favouriteCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profile / Auth actions */}
            {user ? (
              <div className="hidden md:block relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary hover:bg-border-light transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                    {(profile?.full_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate">
                    {profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-border-light">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {profile?.full_name || "Account"}
                        </p>
                        <p className="text-xs text-foreground-muted truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <ClipboardList className="w-4 h-4" />
                          Orders
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-border-light py-1">
                        <button
                          onClick={() => {
                            signOut();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden md:flex items-center px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-full transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground-secondary hover:text-foreground transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[var(--nav-height)] left-0 right-0 bg-white border-b border-border z-40 md:hidden"
            >
              <nav className="container-app py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "text-accent bg-accent-light"
                          : "text-foreground-secondary hover:text-foreground hover:bg-background-secondary"
                      )}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-accent bg-accent-light"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                )}

                <div className="mt-3 pt-3 border-t border-border">
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-danger bg-danger-light rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="flex items-center justify-center py-3 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: "var(--nav-height)" }} />
    </>
  );
}
