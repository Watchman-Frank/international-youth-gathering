"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Image, LogOut, ExternalLink, Users, Ticket,
  FileCheck, BarChart2, BookOpen, Layout, UserPlus, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "Content", icon: Layout },
  { href: "/admin/submissions", label: "Submissions", icon: FileCheck },
  { href: "/admin/registrations", label: "Registrations", icon: Ticket },
  { href: "/admin/volunteers", label: "Volunteers", icon: UserPlus },
  { href: "/admin/library", label: "Library", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/media", label: "Media Library", icon: Image },
  { href: "/admin/contributors", label: "Contributors", icon: Users },
  { href: "/admin/team", label: "Admin Team", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1B2A4A] flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <img
            src="/logo.png"
            alt="International Youth Gathering"
            className="h-9 w-9 rounded-full object-cover"
          />
          <p className="text-[9px] text-white/40 mt-1.5 tracking-wide uppercase">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
          <ul className="space-y-0.5" role="list">
            {navItems.map(({ href, label, icon: Icon, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(href, exact)
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  )}
                >
                  <Icon size={16} aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ExternalLink size={15} aria-hidden />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
          >
            <LogOut size={15} aria-hidden />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
