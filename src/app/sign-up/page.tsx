"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/validators";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully! Welcome to LUTORA.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) toast.error(error.message);
    } catch {
      toast.error("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold tracking-tight">
              LUT<span className="text-accent">O</span>RA
            </span>
          </Link>
          <h1 className="text-xl font-bold mt-6">Create an account</h1>
          <p className="text-sm text-foreground-secondary mt-1">
            Join LUTORA for the best makhna experience
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-border rounded-xl text-sm font-medium hover:bg-background-secondary transition-colors disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-foreground-muted">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="text-sm font-medium mb-1.5 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register("full_name")}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-danger mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                {...register("password")}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm_password" className="text-sm font-medium mb-1.5 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                id="confirm_password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                {...register("confirm_password")}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-danger mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-foreground-secondary mt-6">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-accent font-medium hover:text-accent-hover transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
