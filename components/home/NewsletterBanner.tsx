"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-gradient-to-br from-[#1B2A4A] to-[#2D4070] rounded-2xl p-8 sm:p-10 text-center">
      {submitted ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 size={40} className="text-[#F2B134]" aria-hidden />
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            You're in! Welcome to the IYG family.
          </h2>
          <p className="text-white/60 text-sm">Watch your inbox for your first devotional and ministry update.</p>
        </div>
      ) : (
        <>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F2B134]/20 mb-4">
            <Mail size={22} className="text-[#F2B134]" aria-hidden />
          </div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            Stay Connected to the Movement
          </h2>
          <p className="text-white/60 mt-2 text-sm max-w-md mx-auto leading-relaxed">
            Get daily devotionals, event updates, and ministry news delivered straight to your inbox. Join thousands of young believers worldwide.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-6 max-w-md mx-auto"
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="text-white/30 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </>
      )}
    </section>
  );
}
