// apps/storefront/app/(store)/account/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginMockUser } from "@/components/store/auth/AuthGate";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // Indian Phone number regex: starts with 6-9 and has 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginMockUser(email);
      setLoading(false);
      router.push("/");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[var(--ag-gray-100)] flex items-center justify-center py-12 px-6">
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
            Create Account
          </h2>
          <p className="text-xs text-[var(--ag-gray-500)] font-semibold">
            Join Kapi Pen for premium stationery benefits
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
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
              <input
                id="reg-name"
                type="text"
                placeholder="Anuj Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone (Indian Validation) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-phone" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Mobile Number (India)
            </label>
            <div className="relative flex items-center">
              <Phone size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
              <input
                id="reg-phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-[var(--ag-gray-500)]" />
              <input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--ag-gray-200)] text-sm font-semibold focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] disabled:bg-[var(--ag-gray-500)] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs font-semibold text-[var(--ag-gray-500)] mt-6">
          Already have an account?{" "}
          <Link href="/account/login" className="text-[var(--ag-red)] hover:underline">
            Sign in →
          </Link>
        </p>
      </div>
    </main>
  );
}
