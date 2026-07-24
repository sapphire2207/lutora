"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { ItemAddedModal } from "@/components/ui/item-added-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <ItemAddedModal />
        <Toaster
          position="bottom-right"
          className="bottom-[80px] md:bottom-4 right-4"
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              borderRadius: "var(--radius-lg)",
              fontFamily: "var(--font-sans)",
            },
          }}
          richColors
          closeButton
        />
      </AuthProvider>
    </QueryProvider>
  );
}
