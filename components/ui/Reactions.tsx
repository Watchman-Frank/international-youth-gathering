"use client";

import { useState } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  likes: number;
  hearts: number;
  className?: string;
}

export function Reactions({ likes: initLikes, hearts: initHearts, className }: ReactionsProps) {
  const [likes, setLikes] = useState(initLikes);
  const [hearts, setHearts] = useState(initHearts);
  const [likedByMe, setLikedByMe] = useState(false);
  const [heartedByMe, setHeartedByMe] = useState(false);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={() => { setLikedByMe(!likedByMe); setLikes(l => likedByMe ? l - 1 : l + 1); }}
        aria-label={`Like — ${likes} likes`}
        aria-pressed={likedByMe}
        className={cn(
          "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all",
          likedByMe
            ? "bg-blue-50 border-blue-200 text-blue-600"
            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
        )}
      >
        <ThumbsUp size={14} className={likedByMe ? "fill-blue-500" : ""} aria-hidden />
        <span>{likes}</span>
      </button>
      <button
        onClick={() => { setHeartedByMe(!heartedByMe); setHearts(h => heartedByMe ? h - 1 : h + 1); }}
        aria-label={`Heart — ${hearts} hearts`}
        aria-pressed={heartedByMe}
        className={cn(
          "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all",
          heartedByMe
            ? "bg-rose-50 border-rose-200 text-rose-600"
            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
        )}
      >
        <Heart size={14} className={heartedByMe ? "fill-rose-500" : ""} aria-hidden />
        <span>{hearts}</span>
      </button>
    </div>
  );
}
