"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "navy" | "outline" | "success" | "muted";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-wide uppercase rounded-full",
        size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-xs px-3 py-1",
        variant === "default" && "bg-slate-100 text-slate-700",
        variant === "gold" && "bg-amber-100 text-amber-800",
        variant === "navy" && "bg-[#1B2A4A] text-white",
        variant === "outline" && "border border-slate-300 text-slate-600",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "muted" && "bg-slate-50 text-slate-500",
        className
      )}
    >
      {children}
    </span>
  );
}

const categoryColors: Record<string, string> = {
  "Faith & Life": "bg-violet-100 text-violet-800",
  Devotional: "bg-amber-100 text-amber-800",
  Ministry: "bg-blue-100 text-blue-800",
  "Youth Culture": "bg-pink-100 text-pink-800",
  Leadership: "bg-teal-100 text-teal-800",
  Prayer: "bg-purple-100 text-purple-800",
  Missions: "bg-orange-100 text-orange-800",
  Testimony: "bg-rose-100 text-rose-800",
};

export function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category] || "bg-slate-100 text-slate-700";
  return (
    <span className={cn("inline-flex items-center text-[10px] font-semibold tracking-wider uppercase rounded-full px-2.5 py-0.5", colorClass)}>
      {category}
    </span>
  );
}
