"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
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
