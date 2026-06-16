"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-[#0D6B30] focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          "min-h-[44px] min-w-[44px]",
          size === "sm" && "text-sm px-4 py-2 min-h-[36px]",
          size === "md" && "text-sm px-5 py-2.5",
          size === "lg" && "text-base px-7 py-3.5",
          variant === "primary" && "bg-[#0D6B30] text-white hover:bg-[#0A5423] active:bg-[#083D1C]",
          variant === "gold" && "bg-[#C8831A] text-white hover:bg-[#A56914] active:bg-[#8B540F]",
          variant === "secondary" && "bg-white text-[#083D1C] border border-slate-200 hover:bg-[#F0FAF3] hover:border-[#0D6B30]/30",
          variant === "ghost" && "text-[#0D6B30] hover:bg-[#F0FAF3] active:bg-[#D8F0DF]",
          variant === "outline" && "border-2 border-[#0D6B30] text-[#0D6B30] hover:bg-[#0D6B30] hover:text-white",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
