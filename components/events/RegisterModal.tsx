"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, CheckCircle, AlertCircle, User } from "lucide-react";
import Link from "next/link";

interface Props {
  event: { id: string; title: string };
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  "Ghana", "Nigeria", "Kenya", "South Africa", "Uganda", "Tanzania",
  "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Netherlands", "Italy", "Spain",
  "India", "Brazil", "Jamaica", "Trinidad and Tobago", "Other",
];

export function RegisterModal({ event, isOpen, onClose }: Props) {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", country: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name ?? "").split(" ");
      setForm((f) => ({
        ...f,
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" ") ?? "",
        email: session.user?.email ?? "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (!isOpen) { setDone(false); setError(""); }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: event.id, eventTitle: event.title }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-display)" }}>
              Register for Event
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[280px]">{event.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Not signed in */}
          {status !== "loading" && !session && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-[#1B2A4A]" />
              </div>
              <h3 className="font-bold text-[#1B2A4A] mb-1">Sign in to Register</h3>
              <p className="text-sm text-slate-500 mb-5">
                You need an IYG account to register for events and receive your confirmation ticket.
              </p>
              <Link
                href={`/sign-in?callbackUrl=/conference`}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#1B2A4A] text-white text-sm font-bold rounded-xl hover:bg-[#2D4070] transition-colors"
              >
                Sign In / Create Account
              </Link>
            </div>
          )}

          {/* Success */}
          {done && (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#1B2A4A] text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
                You&rsquo;re Registered, {form.firstName}!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">
                Thank you for registering for <strong>{event.title}</strong>.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your confirmation email and ticket/access will be sent to{" "}
                <strong>{form.email}</strong> soon. If you don&rsquo;t receive it within 24 hours,
                contact us at{" "}
                <a href="mailto:info@intlyouthgathering@gmail.com" className="text-[#1B2A4A] underline">
                  info@intlyouthgathering@gmail.com
                </a>
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Form */}
          {session && !done && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A] mb-1">First Name *</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A] mb-1">Last Name *</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A] mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A] mb-1">Country *</label>
                <select
                  required
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] bg-white"
                >
                  <option value="">Select your country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A] mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <span className="h-4 w-4 rounded-full border-2 border-[#1B2A4A]/30 border-t-[#1B2A4A] animate-spin" />}
                Confirm Registration
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                By registering you agree to receive event updates at your email address.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
