import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #F9F6F3 0%, #FDF8F3 100%)" }}
    >
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A2340 0%, #2D3A5F 100%)" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #E8442A, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #F5A623, transparent)",
            transform: "translate(-30%, 30%)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-lg"
            style={{ background: "linear-gradient(135deg, #E8442A, #F5A623)" }}
          >
            K
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight">
              KAPI <span style={{ color: "#E8442A" }}>PEN</span>
            </span>
            <p
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "rgba(245,240,235,0.4)" }}
            >
              Premium Stationery
            </p>
          </div>
        </div>

        {/* Middle content */}
        <div className="relative z-10">
          <h2
            className="text-3xl font-black text-white mb-4 leading-tight"
          >
            Your favourite stationery,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #E8442A, #F5A623)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              just a click away.
            </span>
          </h2>
          <p style={{ color: "rgba(245,240,235,0.6)" }} className="text-sm leading-relaxed">
            Sign in to access your orders, wishlist, exclusive member discounts, and faster checkout.
          </p>

          {/* Benefit list */}
          <ul className="mt-8 space-y-3">
            {[
              "Track your orders in real-time",
              "Save items to your wishlist",
              "Exclusive member-only deals",
              "Faster checkout every time",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm"
                style={{ color: "rgba(245,240,235,0.75)" }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(232,68,42,0.3)", color: "#FF8A75" }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <p className="text-xs relative z-10" style={{ color: "rgba(245,240,235,0.3)" }}>
          © {new Date().getFullYear()} KAPI PEN. Made with ❤️ in India.
        </p>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #E8442A, #F5A623)" }}
            >
              K
            </div>
            <span className="text-xl font-black tracking-tight" style={{ color: "var(--brand-navy)" }}>
              KAPI <span style={{ color: "#E8442A" }}>PEN</span>
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-black mb-2 tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            Welcome back! 👋
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
            Sign in to your account to continue.{" "}
            <Link
              href="/"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--brand-coral)" }}
            >
              New here? Sign up →
            </Link>
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label
                className="text-xs font-bold uppercase tracking-widest mb-2 block"
                style={{ color: "var(--muted-foreground)" }}
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm outline-none transition-all focus:border-[var(--brand-coral)] focus:shadow-[0_0_0_3px_rgba(232,68,42,0.1)]"
                  style={{
                    borderColor: "#EAE4DD",
                    color: "var(--brand-navy)",
                    background: "white",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/"
                  className="text-xs font-medium transition-colors hover:underline"
                  style={{ color: "var(--brand-coral)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 text-sm outline-none transition-all focus:border-[var(--brand-coral)] focus:shadow-[0_0_0_3px_rgba(232,68,42,0.1)]"
                  style={{
                    borderColor: "#EAE4DD",
                    color: "var(--brand-navy)",
                    background: "white",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5"
                  aria-label="Toggle password visibility"
                >
                  <Eye size={15} style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded accent-[var(--brand-coral)] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm cursor-pointer"
                style={{ color: "var(--muted-foreground)" }}
              >
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #E8442A, #C7321A)",
                boxShadow: "0 4px 20px rgba(232,68,42,0.35)",
              }}
            >
              Sign In
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: "#EAE4DD" }} />
              <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                or continue with
              </span>
              <div className="flex-1 h-px" style={{ background: "#EAE4DD" }} />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: "#EAE4DD",
                color: "var(--brand-navy)",
                background: "white",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
            By signing in, you agree to our{" "}
            <Link href="/" className="underline hover:text-[var(--brand-coral)] transition-colors">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/" className="underline hover:text-[var(--brand-coral)] transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}