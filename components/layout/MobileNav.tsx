"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, BookOpen, Mic2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/articles", label: "Articles", icon: Newspaper },
  { href: "/word-for-the-day", label: "Word", icon: BookOpen },
  { href: "/podcast", label: "Podcast", icon: Mic2 },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white border-t border-slate-200"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch" role="list">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] w-full transition-colors",
                  active ? "text-[#1B2A4A]" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {/* Active top indicator */}
                {active && (
                  <span
                    className="absolute top-0 inset-x-3 h-0.5 bg-[#F2B134] rounded-b-full"
                    aria-hidden
                  />
                )}
                <Icon
                  size={22}
                  aria-hidden
                  strokeWidth={active ? 2.5 : 1.75}
                />
                <span
                  className={cn(
                    "text-[10px] tracking-tight",
                    active ? "font-bold" : "font-medium"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
