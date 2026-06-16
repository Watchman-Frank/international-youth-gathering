"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ChevronDown, User, Bell } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        "sticky top-0 z-50 bg-white border-b transition-all duration-200",
        scrolled ? "border-slate-200 shadow-sm" : "border-slate-100"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
            aria-label="International Youth Gathering — Home"
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="h-11 w-11 rounded-full object-cover flex-shrink-0"
            />
            <span
              className="text-[#1B2A4A] font-extrabold text-sm sm:text-base leading-tight hidden sm:block"
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
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1B2A4A] rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
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
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-slate-100 shadow-lg py-1 z-50"
                        role="menu"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              isActive(child.href)
                                ? "text-[#1B2A4A] font-semibold"
                                : "text-slate-600 hover:text-[#1B2A4A] hover:bg-slate-50"
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
                        "relative block px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                        isActive(item.href!)
                          ? "text-[#1B2A4A] font-semibold"
                          : "text-slate-500 hover:text-[#1B2A4A] hover:bg-slate-50/80"
                      )}
                    >
                      {item.label}
                      {isActive(item.href!) && (
                        <span className="absolute bottom-0.5 left-3 right-3 h-px bg-[#F2B134]" aria-hidden />
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
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#1B2A4A] hover:bg-slate-100 transition-colors"
            >
              <Search size={17} />
            </Link>
            <button
              aria-label="Notifications (1 unread)"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#1B2A4A] hover:bg-slate-100 transition-colors relative"
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F2B134] rounded-full border border-white" aria-hidden />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" aria-hidden />
            <Link
              href="/give"
              className="px-4 py-2 text-sm font-bold text-[#1B2A4A] bg-[#F2B134] rounded-lg hover:bg-[#D9960F] transition-colors"
            >
              Give
            </Link>
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1B2A4A] rounded-lg hover:bg-[#2D4070] transition-colors"
            >
              <User size={14} aria-hidden />
              Sign In
            </Link>
          </div>

          {/* Mobile: search + burger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/search"
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Search size={19} />
            </Link>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
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
          <div id="mobile-menu" className="lg:hidden border-t border-slate-100 pb-5 pt-3" aria-label="Mobile navigation">
            <ul className="space-y-0.5" role="list">
              {navItems.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-5 py-2.5 text-sm rounded-lg transition-colors",
                          isActive(child.href)
                            ? "text-[#1B2A4A] font-semibold"
                            : "text-slate-600 hover:text-[#1B2A4A] hover:bg-slate-50"
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
                        "block px-3 py-2.5 text-sm rounded-lg transition-colors",
                        isActive(item.href!)
                          ? "text-[#1B2A4A] font-semibold"
                          : "text-slate-600 hover:text-[#1B2A4A] hover:bg-slate-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-100 px-3 flex gap-2">
              <Link
                href="/sign-in"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-[#1B2A4A] rounded-xl hover:bg-[#2D4070] transition-colors"
              >
                <User size={15} aria-hidden />
                Sign In
              </Link>
              <Link
                href="/give"
                className="flex items-center justify-center px-5 py-2.5 text-sm font-bold text-[#1B2A4A] bg-[#F2B134] rounded-xl hover:bg-[#D9960F] transition-colors"
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
