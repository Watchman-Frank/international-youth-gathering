"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { FacebookIcon } from "@/components/ui/SocialIcons";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") ?? "/";
  // Guard against looping back to sign-in
  const callbackUrl = rawCallback.startsWith("/sign-in") ? "/" : rawCallback;
  const urlError = searchParams.get("error");

  const [isSignUp, setIsSignUp]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState<string | null>(null);
  const [error, setError]               = useState(
    urlError === "OAuthAccountNotLinked"
      ? "This email is already linked to a different sign-in method."
      : ""
  );
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (error) setError("");
  }

  async function handleSocial(provider: "google" | "facebook") {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isSignUp && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading("credentials");

    // ── SIGN-UP: create the account first, then sign in ──
    if (isSignUp) {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim(),
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not create your account. Please try again.");
        setLoading(null);
        return;
      }
    }

    // ── SIGN-IN (or post-signup sign-in) ──
    const result = await signIn("credentials", {
      email:    form.email.trim(),
      password: form.password,
      redirect: false,
    });

    if (result?.error || !result?.ok) {
      if (isSignUp) {
        setError("Account created! But sign-in failed — please try signing in manually.");
      } else {
        setError("Incorrect email or password. Please try again.");
      }
      setLoading(null);
      return;
    }

    // Full page reload so the JWT cookie is read by all components
    window.location.href = isSignUp ? "/profile" : callbackUrl;
  }

  function switchMode() {
    setIsSignUp((v) => !v);
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            className="h-16 w-16 rounded-full object-cover mx-auto mb-4"
          />
          <h1
            className="text-2xl font-bold text-[#0D6B30]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isSignUp ? "Join IYG" : "Welcome Back"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isSignUp
              ? "Create an account to access events, downloads, and community."
              : "Sign in to your IYG account."}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" aria-hidden />
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocial("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {loading === "google"
              ? <span className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" aria-hidden />
              : <GoogleIcon size={18} />}
            Continue with Google
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleSocial("facebook")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {loading === "facebook"
              ? <span className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" aria-hidden />
              : <FacebookIcon size={18} className="text-blue-600" />}
            Continue with Facebook
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form className="space-y-4" onSubmit={handleCredentials} noValidate>
            {isSignUp && (
              <div>
                <label htmlFor="fullname" className="block text-sm font-semibold text-[#0D6B30] mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  disabled={!!loading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent disabled:opacity-60"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0D6B30] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete={isSignUp ? "email" : "username"}
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                disabled={!!loading}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent disabled:opacity-60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0D6B30]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-xs text-[#C8831A] hover:underline"
                    onClick={() => setError("Password reset is not yet available. Please contact support.")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  disabled={!!loading}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && form.password.length > 0 && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${form.password.length >= 8 ? "text-green-600" : "text-slate-400"}`}>
                  {form.password.length >= 8
                    ? <><CheckCircle size={11} /> Password meets minimum length</>
                    : `${8 - form.password.length} more character${8 - form.password.length !== 1 ? "s" : ""} needed`}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!!loading}
              className="w-full py-3.5 bg-[#0D6B30] text-white font-bold text-sm rounded-xl hover:bg-[#0A5423] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading === "credentials" && (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden />
              )}
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[#0D6B30] hover:text-[#C8831A] transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          By continuing, you agree to IYG&apos;s terms of use and privacy policy.
        </p>
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#0D6B30] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-[#0D6B30] animate-spin" aria-hidden />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
