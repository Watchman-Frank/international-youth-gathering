"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Camera, Save, LogOut, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import type { UserProfile } from "@/app/api/profile/route";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ officialName: "", username: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ profile: p }: { profile: UserProfile | null }) => {
        if (p) {
          setProfile(p);
          setForm({ officialName: p.officialName, username: p.username, bio: p.bio });
          setAvatarUrl(p.avatarUrl ?? session.user?.image ?? null);
        } else {
          setAvatarUrl(session.user?.image ?? null);
          setForm({
            officialName: session.user?.name ?? "",
            username: "",
            bio: "",
          });
        }
      })
      .catch(() => {});
  }, [session]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error ?? "Upload failed");
        return;
      }
      const { url } = await res.json();
      setAvatarUrl(url);
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: url }),
      });
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatarUrl: avatarUrl ?? undefined }),
      });
      if (!res.ok) {
        const d = await res.json();
        setSaveError(d.error ?? "Save failed");
        setSaveStatus("error");
      } else {
        const { profile: p } = await res.json();
        setProfile(p);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveError("Network error. Please try again.");
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-[#1B2A4A] animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF8F3] border-2 border-[#1B2A4A]/10 flex items-center justify-center mb-6">
          <User size={32} className="text-[#1B2A4A]/40" />
        </div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>
          Sign In to View Your Profile
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-xs leading-relaxed">
          Create a free IYG account to manage your profile, register for events, and submit articles.
        </p>
        <Link
          href="/sign-in?callbackUrl=/profile"
          className="mt-6 px-6 py-3 bg-[#1B2A4A] text-white font-semibold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
        >
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  const displayName = form.officialName || session.user.name || "IYG Member";
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-display)" }}>
          My Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage how you appear on IYG — at events, on articles, and in the community.</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Profile Picture</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
                {initials}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <Loader2 size={20} className="text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1B2A4A] text-white text-sm font-semibold rounded-xl hover:bg-[#2D4070] transition-colors disabled:opacity-50"
            >
              <Camera size={15} />
              {uploadingAvatar ? "Uploading…" : "Upload Photo"}
            </button>
            <p className="text-xs text-slate-400 mt-1.5">JPG, PNG or WebP, max 5 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#1B2A4A] mb-1" style={{ fontFamily: "var(--font-display)" }}>Profile Details</h2>
        <p className="text-xs text-slate-400 mb-5">
          Your <strong>official name</strong> is used for event registration. Your <strong>username</strong> appears on published articles.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Read-only email */}
          <div>
            <label className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Email Address</label>
            <input
              readOnly
              value={session.user.email ?? ""}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-500 cursor-default"
            />
          </div>

          <div>
            <label htmlFor="officialName" className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">
              Official Name <span className="text-slate-400 font-normal">(used at events)</span>
            </label>
            <input
              id="officialName"
              type="text"
              value={form.officialName}
              onChange={(e) => setForm((f) => ({ ...f, officialName: e.target.value }))}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">
              Username <span className="text-slate-400 font-normal">(displayed on articles)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.replace(/[^a-zA-Z0-9_.]/g, "") }))}
                placeholder="yourhandle"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-xs font-semibold text-[#1B2A4A] mb-1.5">Bio</label>
            <textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell the IYG community a bit about yourself…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
            />
          </div>

          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={15} />
              {saveError}
            </div>
          )}

          {saveStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={15} />
              Profile saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-[#1B2A4A] mb-4" style={{ fontFamily: "var(--font-display)" }}>Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-slate-500">Signed in as</span>
            <span className="font-medium text-[#1B2A4A]">{session.user.email}</span>
          </div>
          {profile?.updatedAt && (
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-500">Last updated</span>
              <span className="text-slate-600">{new Date(profile.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-5 flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
