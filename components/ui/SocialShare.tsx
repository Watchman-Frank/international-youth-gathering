"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { FacebookIcon, XTwitterIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export function SocialShare({ url, title = "Check this out", className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shares = [
    {
      label: "Share on Facebook",
      href: `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
      color: "hover:text-blue-600",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XTwitterIcon,
      color: "hover:text-sky-500",
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsAppIcon,
      color: "hover:text-green-600",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-slate-500 font-medium mr-1">Share</span>
      {shares.map(({ label, href, icon: Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors",
            color
          )}
        >
          <Icon size={16} aria-hidden />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:text-[#1B2A4A] transition-colors"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
      </button>
    </div>
  );
}
