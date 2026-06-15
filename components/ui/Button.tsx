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
          "focus-visible:outline-2 focus-visible:outline-[#F2B134] focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "min-h-[44px] min-w-[44px]",
          size === "sm" && "text-sm px-4 py-2 min-h-[36px]",
          size === "md" && "text-sm px-5 py-2.5",
          size === "lg" && "text-base px-7 py-3.5",
          variant === "primary" && "bg-[#1B2A4A] text-white hover:bg-[#2D4070] active:bg-[#111D33]",
          variant === "gold" && "bg-[#F2B134] text-[#1B2A4A] hover:bg-[#D9960F] active:bg-[#C08010]",
          variant === "secondary" && "bg-white text-[#1B2A4A] border border-slate-200 hover:bg-slate-50",
          variant === "ghost" && "text-[#1B2A4A] hover:bg-slate-100 active:bg-slate-200",
          variant === "outline" && "border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white",
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
