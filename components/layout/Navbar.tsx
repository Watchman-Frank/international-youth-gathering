"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ChevronDown, User, Bell, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/articles", label: "Articles" },
  { href: "/word-for-the-day", label: "Word for the Day" },
  {
    label: "Events",
    children: [
      { href: "/conference", label: "God-Life Conference" },
      { href: "/prayer-party", label: "Prayer & Prophetic Party" },
    ],
  },
  { href: "/podcast", label: "The Qavah Podcast" },
  { href: "/library", label: "Library" },
  {
    label: "More",
    children: [
      { href: "/get-involved", label: "Get Involved / Volunteer" },
      { href: "/about", label: "About IYG" },
      { href: "/give", label: "Give / Support" },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white border-b-2 transition-all duration-300",
        scrolled
          ? "border-[#0D6B30] shadow-[0_4px_20px_rgba(13,107,48,0.12)]"
          : "border-[#0D6B30]/60"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="International Youth Gathering — Home"
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="h-11 w-11 rounded-full object-cover flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_0_3px_#0D6B30,0_0_16px_rgba(13,107,48,0.35)] group-hover:scale-105"
            />
            <span
              className="text-[#083D1C] font-extrabold text-sm sm:text-base leading-tight hidden sm:block"
              style={{ fontFamily: "var(--font-display)" }}
            >
              International<br />Youth Gathering
            </span>
          </Link>

          {/* Desktop nav */}
          <div ref={dropdownRef}>
            <ul className="hidden lg:flex items-center gap-0.5" role="list">
              {navItems.map((item) =>
                item.children ? (
                  <li key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0D6B30] rounded-lg hover:bg-[#F0FAF3] transition-all duration-300 whitespace-nowrap"
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        className={cn("transition-transform duration-200", openDropdown === item.label && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-[#0D6B30]/15 shadow-lg shadow-green-900/10 py-1 z-50"
                        role="menu"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-all duration-200 border-l-2",
                              isActive(child.href)
                                ? "text-[#0D6B30] font-semibold border-[#C8831A] bg-[#F0FAF3]"
                                : "text-slate-600 hover:text-[#0D6B30] hover:bg-[#F0FAF3] hover:border-[#C8831A] border-transparent"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href!}
                      className={cn(
                        "relative block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap",
                        isActive(item.href!)
                          ? "text-[#0D6B30] font-semibold"
                          : "text-slate-500 hover:text-[#0D6B30] hover:bg-[#F0FAF3]"
                      )}
                    >
                      {item.label}
                      {isActive(item.href!) && (
                        <span className="absolute bottom-0.5 left-3 right-3 h-px bg-[#0D6B30]" aria-hidden />
                      )}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/search"
              aria-label="Search"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0D6B30] hover:bg-[#F0FAF3] transition-all duration-300"
            >
              <Search size={17} />
            </Link>
            <button
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0D6B30] hover:bg-[#F0FAF3] transition-all duration-300 relative"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8831A] rounded-full border border-white" aria-hidden />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" aria-hidden />
            <Link
              href="/give"
              className="px-4 py-2 text-sm font-bold text-white bg-[#C8831A] rounded-lg hover:bg-[#A56914] transition-all duration-300 active:scale-95"
            >
              Give
            </Link>
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-[#F0FAF3] transition-all duration-300"
                  aria-label="Account menu"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0D6B30] ring-offset-1"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-[#0D6B30] text-white text-xs font-bold flex items-center justify-center ring-2 ring-[#0D6B30] ring-offset-1">
                      {(session.user?.name ?? "U")[0].toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#083D1C] max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-[#0D6B30]/15 shadow-lg shadow-green-900/10 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-[#083D1C] truncate">{session.user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0D6B30] hover:bg-[#F0FAF3] transition-all duration-200"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={14} aria-hidden />
                      My Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut size={14} aria-hidden />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#0D6B30] rounded-lg hover:bg-[#0A5423] transition-all duration-300 active:scale-95"
              >
                <User size={14} aria-hidden />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: search + burger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/search"
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-[#F0FAF3] hover:text-[#0D6B30] transition-all duration-300"
            >
              <Search size={19} />
            </Link>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-[#F0FAF3] hover:text-[#0D6B30] transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={21} aria-hidden /> : <Menu size={21} aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-[#0D6B30]/20 pb-5 pt-3" aria-label="Mobile navigation">
            <ul className="space-y-0.5" role="list">
              {navItems.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-[#0D6B30]/60 uppercase tracking-widest">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-5 py-2.5 text-sm rounded-lg transition-all duration-200",
                          isActive(child.href)
                            ? "text-[#0D6B30] font-semibold bg-[#F0FAF3]"
                            : "text-slate-600 hover:text-[#0D6B30] hover:bg-[#F0FAF3]"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href!}
                      className={cn(
                        "block px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                        isActive(item.href!)
                          ? "text-[#0D6B30] font-semibold bg-[#F0FAF3]"
                          : "text-slate-600 hover:text-[#0D6B30] hover:bg-[#F0FAF3]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
            <div className="mt-4 pt-4 border-t border-[#0D6B30]/15 px-3 flex gap-2">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-[#083D1C] bg-[#F0FAF3] rounded-xl hover:bg-[#D8F0DF] transition-all duration-300"
                  >
                    <User size={15} aria-hidden />
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-[#0D6B30] rounded-xl hover:bg-[#0A5423] transition-all duration-300"
                  >
                    <LogOut size={15} aria-hidden />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-[#0D6B30] rounded-xl hover:bg-[#0A5423] transition-all duration-300"
                >
                  <User size={15} aria-hidden />
                  Sign In
                </Link>
              )}
              <Link
                href="/give"
                className="flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-[#C8831A] rounded-xl hover:bg-[#A56914] transition-all duration-300"
              >
                Give
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
