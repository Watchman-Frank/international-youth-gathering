"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-9 h-9 rounded-md bg-[#1B2A4A] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 2L11.5 7H16L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L2 7H6.5L9 2Z" fill="#F2B134" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-[#1B2A4A]">IYG Admin</div>
            <div className="text-[10px] text-slate-400 tracking-wide">International Youth Gathering</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1B2A4A]/5 mb-6 mx-auto">
            <Lock size={20} className="text-[#1B2A4A]" />
          </div>
          <h1 className="text-xl font-bold text-[#1B2A4A] text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Admin Access
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-[#1B2A4A] text-white text-sm font-bold rounded-lg hover:bg-[#2D4070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
