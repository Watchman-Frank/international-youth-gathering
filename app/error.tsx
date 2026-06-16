"use client";

import { useEffect } from "react";
import { RefreshCw, Home, Mail } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("IYG App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display)" }}>
        Something Went Wrong
      </h1>
      <p className="text-slate-500 mt-3 text-base max-w-md leading-relaxed">
        An unexpected error occurred. Our team has been notified. Please try refreshing the page or return to the homepage.
      </p>

      {error.digest && (
        <p className="text-xs text-slate-300 mt-2 font-mono">Error ID: {error.digest}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0D6B30] text-white font-semibold text-sm rounded-xl hover:bg-[#0A5423] transition-colors"
        >
          <RefreshCw size={16} aria-hidden />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-[#0D6B30] font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Home size={16} aria-hidden />
          Back to Home
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-2 text-sm text-slate-400">
        <Mail size={14} aria-hidden />
        <span>
          Persistent issues?{" "}
          <a
            href="mailto:info@internationalyouthgathering.com"
            className="text-[#0D6B30] hover:text-[#C8831A] transition-colors font-medium"
          >
            Contact us
          </a>
        </span>
      </div>
    </div>
  );
}
