// apps/storefront/app/(store)/account/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginMockUser } from "@/components/store/auth/AuthGate";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginMockUser(email);
      setLoading(false);
      router.push(redirectUrl);
    }, 800);
  };

  return (
    <div className="w-full max-w-[420px] bg-white border border-[var(--ag-gray-200)] rounded-2xl p-8 shadow-xl select-none mx-auto">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-white font-extrabold text-lg shadow-md"
          style={{ background: "linear-gradient(135deg, var(--ag-red), var(--ag-yellow))" }}
        >
          K
        </div>
        <h2 className="font-display font-black text-xl text-[var(--ag-dark)] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-[var(--ag-gray-500)] font-semibold">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Inline errors */}
      {error && (
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--ag-red)] bg-[var(--ag-red)]/10 p-3 rounded-lg mb-4 border border-[var(--ag-red)]/20 animate-fadeInUp">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Password
            </label>
            <Link
              href="/account/login"
              className="text-xs font-bold text-[var(--ag-red)] hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 rounded-md text-[var(--ag-gray-500)] hover:bg-[var(--ag-gray-100)]"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] disabled:bg-[var(--ag-gray-500)] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>

        {/* Google OAuth Option */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-[var(--ag-gray-200)]" />
            <span className="text-[10px] font-bold text-[var(--ag-gray-500)] uppercase">Or continue with</span>
            <hr className="flex-1 border-[var(--ag-gray-200)]" />
          </div>

          <button
            type="button"
            onClick={() => {
              loginMockUser("google-member@gmail.com");
              router.push(redirectUrl);
            }}
            className="w-full py-2.5 rounded-xl border border-[var(--ag-gray-200)] hover:bg-[var(--ag-gray-100)] font-semibold text-xs text-[var(--ag-dark)] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>

      {/* Footer link */}
      <p className="text-center text-xs font-semibold text-[var(--ag-gray-500)] mt-6">
        New customer?{" "}
        <Link href="/account/register" className="text-[var(--ag-red)] hover:underline">
          Create account →
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--ag-gray-100)] flex items-center justify-center py-12 px-6">
      <Suspense fallback={
        <div className="w-10 h-10 border-4 border-[var(--ag-red)] border-t-transparent rounded-full animate-spin" />
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
