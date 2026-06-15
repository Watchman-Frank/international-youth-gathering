"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FacebookIcon } from "@/components/ui/SocialIcons";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1B2A4A] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 2L11.5 7H16L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L2 7H6.5L9 2Z" fill="#F2B134" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-[#1B2A4A]"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            {isSignUp ? "Join IYG" : "Welcome Back"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isSignUp
              ? "Create an account to access events, downloads, and community."
              : "Sign in to your IYG account."}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
          {/* Social login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FacebookIcon size={18} className="text-blue-600" />
            Continue with Facebook
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()} aria-label={isSignUp ? "Sign up form" : "Sign in form"}>
            {isSignUp && (
              <div>
                <label htmlFor="fullname" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Full Name</label>
                <input id="fullname" type="text" required placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Email Address</label>
              <input id="email" type="email" required placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
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
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#1B2A4A] hover:text-[#F2B134] font-semibold transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1B2A4A] text-white font-bold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-[#1B2A4A] hover:text-[#F2B134] transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          By continuing, you agree to IYG's terms of use and privacy policy.
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#1B2A4A] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
