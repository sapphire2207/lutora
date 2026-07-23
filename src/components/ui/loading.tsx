"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export function Loading({
  text = "Loading LUTORA...",
  className,
  size = "md",
  fullPage = false,
}: LoadingProps) {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-12 h-12 bg-accent/20 rounded-full blur-xl animate-pulse" />
        
        {/* Spinner */}
        <Loader2 className={cn("animate-spin text-accent relative z-10", iconSizes[size])} />
      </div>

      {text && (
        <p className="mt-3 text-xs font-semibold text-foreground-secondary tracking-wide uppercase">
          {text}
        </p>
      )}
    </motion.div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
