import { Download, ExternalLink, Lock, FileText, BookOpen, Video, Headphones, BookMarked } from "lucide-react";
import type { Resource } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  guide: BookOpen,
  study: BookMarked,
  video: Video,
  audio: Headphones,
  ebook: BookOpen,
};

interface ResourceCardProps {
  resource: Resource;
  className?: string;
  isAuthenticated?: boolean;
  onDownload?: (id: string) => void;
}

export function ResourceCard({ resource, className, isAuthenticated = false, onDownload }: ResourceCardProps) {
  const TypeIcon = typeIcons[resource.type] ?? FileText;

  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all group", className)}>
      <div className="relative h-40 overflow-hidden">
        <img
          src={resource.thumbnailUrl}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#1B2A4A]/40" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={resource.isFree ? "success" : "gold"}>
            {resource.isFree ? "Free" : resource.price ?? "Paid"}
          </Badge>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase rounded-full px-2.5 py-0.5 bg-white/20 text-white backdrop-blur-sm">
            <TypeIcon size={10} aria-hidden />
            {resource.type}
          </span>
        </div>
        {!resource.isFree && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Lock size={18} className="text-white" aria-hidden />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <Badge variant="muted">{resource.topic}</Badge>
        <h3 className="font-bold text-[#1B2A4A] text-sm leading-snug mt-2 line-clamp-2" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
          {resource.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{resource.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          {resource.fileSize && (
            <span className="text-xs text-slate-400">{resource.fileSize}</span>
          )}
          {resource.downloads !== undefined && (
            <span className="text-xs text-slate-400">{resource.downloads.toLocaleString()} downloads</span>
          )}
        </div>
        <div className="mt-3">
          {resource.isFree ? (
            isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onDownload?.(resource.id)}
              >
                <Download size={14} aria-hidden />
                Download Free
              </Button>
            ) : (
              <a href="/sign-in">
                <Button variant="outline" size="sm" className="w-full">
                  <Lock size={14} aria-hidden />
                  Sign in to Download
                </Button>
              </a>
            )
          ) : (
            <a href={resource.externalUrl ?? "#"} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="sm" className="w-full">
                <ExternalLink size={14} aria-hidden />
                Get for {resource.price}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
