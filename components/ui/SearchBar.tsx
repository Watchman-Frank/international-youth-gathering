"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  placeholder = "Search…",
  onSearch,
  value,
  onChange,
  className,
  size = "md",
}: SearchBarProps) {
  const [internal, setInternal] = useState("");
  const query = value ?? internal;

  const handleChange = (v: string) => {
    if (onChange) onChange(v);
    else setInternal(v);
    onSearch?.(v);
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search
        className="absolute left-3 text-slate-400 pointer-events-none"
        size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-[#C8831A] focus:border-transparent transition-all",
          size === "sm" && "pl-8 pr-8 py-1.5 text-sm",
          size === "md" && "pl-10 pr-10 py-2.5 text-sm",
          size === "lg" && "pl-12 pr-12 py-3.5 text-base"
        )}
        aria-label={placeholder}
      />
      {query && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={size === "sm" ? 12 : 14} />
        </button>
      )}
    </div>
  );
}
