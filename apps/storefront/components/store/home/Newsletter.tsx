// apps/storefront/components/store/home/Newsletter.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="py-16 bg-[var(--ag-gray-100)] dark:bg-neutral-900 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 select-none">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#1A1A1A] to-[#2E2E2E] dark:from-[#111] dark:to-[#1E1E1E] border border-white/5 p-8 sm:p-12 text-center text-white shadow-xl">
          {/* Accent Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[var(--ag-red)]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[var(--ag-yellow)]/10 blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-[var(--ag-yellow)] mb-6">
              <Mail size={22} className="stroke-[2.5]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight mb-3 text-white">
              Unlock 10% Off Your First Order
            </h2>
            <p className="text-sm text-white/75 font-semibold leading-relaxed mb-8">
              Subscribe to the KAPI PEN newsletter to receive secret discounts, product release updates, and stationery guides.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-[var(--radius-lg)] bg-white/5 border border-emerald-500/25"
                >
                  <CheckCircle size={32} className="text-emerald-400 stroke-[2.5]" />
                  <h3 className="text-base font-black text-white">You&apos;re on the list!</h3>
                  <p className="text-xs text-white/70 font-semibold">
                    We&apos;ve sent your 10% discount code to your email. Happy writing!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row items-center gap-3 w-full"
                >
                  <div className="relative w-full">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full px-5 py-4 rounded-[var(--radius-lg)] bg-white/10 hover:bg-white/12 focus:bg-white/15 outline-none border border-white/15 focus:border-[var(--ag-red)] text-sm font-semibold transition-all placeholder:text-white/45"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full sm:w-auto px-7 py-4 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] disabled:bg-[var(--ag-red)]/50 text-white font-black text-sm rounded-[var(--radius-lg)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0 select-none cursor-pointer"
                  >
                    {status === "loading" ? "Subscribing..." : "SUBSCRIBE"}
                    <ArrowRight size={14} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
