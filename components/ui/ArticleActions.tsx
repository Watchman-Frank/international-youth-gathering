"use client";

import { useState } from "react";
import { BookmarkPlus, Bookmark, Printer } from "lucide-react";

export function ArticleActions({ articleId }: { articleId: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSaved(!saved)}
        aria-label={saved ? "Remove from saved" : "Save article"}
        aria-pressed={saved}
        title={saved ? "Saved" : "Save article"}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#1B2A4A] hover:border-slate-300 transition-colors"
      >
        {saved ? (
          <Bookmark size={16} className="fill-[#F2B134] text-[#F2B134]" />
        ) : (
          <BookmarkPlus size={16} />
        )}
      </button>
      <button
        aria-label="Print article"
        title="Print article"
        onClick={() => window.print()}
        className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#1B2A4A] hover:border-slate-300 transition-colors"
      >
        <Printer size={16} />
      </button>
    </div>
  );
}
