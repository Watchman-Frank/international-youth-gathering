"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Mail, Key } from "lucide-react";

type LoginMode = "superadmin" | "admin";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<LoginMode>("superadmin");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = mode === "superadmin" ? { password } : { email, code: code.toUpperCase() };

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const data = await res.json();
      setError(data.error ?? "Sign in failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/logo.png" alt="International Youth Gathering" className="h-20 w-20 rounded-full object-cover" />
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#1B2A4A]/5 mb-6 mx-auto">
            <Lock size={20} className="text-[#1B2A4A]" />
          </div>
          <h1 className="text-xl font-bold text-[#1B2A4A] text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Admin Access
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            {mode === "superadmin" ? "Enter your superadmin password." : "Enter your email and access code."}
          </p>

          {/* Mode toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => { setMode("superadmin"); setError(""); }}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                mode === "superadmin" ? "bg-[#1B2A4A] text-white" : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              Superadmin
            </button>
            <button
              type="button"
              onClick={() => { setMode("admin"); setError(""); }}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                mode === "admin" ? "bg-[#1B2A4A] text-white" : "text-slate-500 hover:text-[#1B2A4A]"
              }`}
            >
              Admin (Access Code)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "superadmin" ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Superadmin password"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Key size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))}
                    placeholder="Access code (e.g. ABC12345)"
                    required
                    maxLength={8}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
                  />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading || (mode === "superadmin" ? !password : !email || !code)}
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
