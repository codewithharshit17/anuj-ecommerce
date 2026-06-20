/**
 * Admin Forgot Password Page — `/admin/forgot-password`
 *
 * Sends a Supabase password reset email.
 * Two states: form → success (after submission).
 */
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  adminResetPassword,
  type AdminResetPasswordState,
} from "@/lib/actions/auth/admin-reset-password";
import {
  Mail,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

const initialState: AdminResetPasswordState = {};

function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    adminResetPassword,
    initialState
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-200/50 overflow-hidden">
        {/* Accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-red-700 via-red-500 to-orange-500" />

        <div className="p-8 space-y-6">
          {state.success ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center gap-5 py-6 text-center">
              <div className="size-14 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="size-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Check your inbox
                </h2>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed max-w-xs mx-auto">
                  If this email belongs to an admin account, a password reset
                  link has been sent.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              {/* Header */}
              <div className="flex flex-col items-center gap-4">
                <div className="size-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                  <KeyRound className="size-5 text-zinc-500" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
                    Reset your password
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Enter your admin email to receive a reset link
                  </p>
                </div>
              </div>

              {/* Error */}
              {state.error && (
                <div className="flex items-start gap-2.5 text-sm font-medium text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-200">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Form */}
              <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                    <input
                      id="reset-email"
                      name="email"
                      type="email"
                      placeholder="admin@kapipen.com"
                      required
                      disabled={isPending}
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] text-zinc-400 mt-5 font-mono">
        KAPI PEN · Admin
      </p>
    </div>
  );
}

export default function AdminForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/4 -left-48 size-[500px] rounded-full bg-red-200/30 blur-3xl pointer-events-none" />

      <div className="relative w-full">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
