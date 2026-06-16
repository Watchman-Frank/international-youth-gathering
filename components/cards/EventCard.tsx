import Link from "next/link";
import { Calendar, MapPin, Globe, Video, Ticket } from "lucide-react";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  variant?: "strip" | "featured" | "card";
  className?: string;
}

export function EventCard({ event, variant = "card", className }: EventCardProps) {
  const isConference = event.type === "conference";
  const isPrayerParty = event.type === "prayer-party";

  if (variant === "strip") {
    return (
      <div className={cn("flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all", className)}>
        <div className="flex-shrink-0 text-center w-14">
          <div className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {new Date(event.date).getDate()}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            {new Date(event.date).toLocaleString("en-US", { month: "short" })}
          </div>
        </div>
        <div className="w-px h-10 bg-slate-200" aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isConference && <Badge variant="gold" size="sm">Conference</Badge>}
            {isPrayerParty && <Badge variant="navy" size="sm">Prayer</Badge>}
          </div>
          <h3 className="font-semibold text-[#0D6B30] text-sm line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            {event.location && (
              <span className="flex items-center gap-1"><MapPin size={11} aria-hidden />{event.location.split(",")[0]}</span>
            )}
            {event.isOnline && <span className="flex items-center gap-1"><Globe size={11} aria-hidden />Online</span>}
          </div>
        </div>
        {event.isUpcoming && event.joinLink && (
          <a
            href={event.joinLink}
            className="flex-shrink-0 text-xs font-semibold text-[#C8831A] hover:text-[#A56914] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join →
          </a>
        )}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className={cn("bg-[#0D6B30] rounded-2xl overflow-hidden text-white", className)}>
        {event.flyer && (
          <div className="relative h-48 overflow-hidden">
            <img src={event.flyer} alt={event.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D6B30]/20 to-[#0D6B30]" />
          </div>
        )}
        <div className="p-6">
          {isConference && <Badge variant="gold">God-Life Conference</Badge>}
          {isPrayerParty && <Badge className="bg-white/10 text-white border-white/20 border">Prayer & Prophetic</Badge>}
          <h2 className="text-2xl font-bold mt-3 leading-tight text-balance" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
            {event.title}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Calendar size={14} aria-hidden />{formatShortDate(event.date)}</span>
            {event.location && <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden />{event.location}</span>}
            {event.isOnline && <span className="flex items-center gap-1.5"><Globe size={14} aria-hidden />Streaming Online</span>}
          </div>
          <p className="text-sm text-white/60 mt-3 line-clamp-3 leading-relaxed">{event.shortDescription}</p>
          <div className="flex gap-3 mt-5">
            {event.requiresTicket ? (
              <Link href={`/conference#register`}>
                <Button variant="gold" size="md" className="gap-2">
                  <Ticket size={16} aria-hidden />
                  Register Now
                </Button>
              </Link>
            ) : event.watchLiveLink ? (
              <a href={event.watchLiveLink} target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="md" className="gap-2">
                  <Video size={16} aria-hidden />
                  Watch Live
                </Button>
              </a>
            ) : null}
            <Link href={`/conference`}>
              <Button variant="ghost" size="md" className="text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all", className)}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {isConference && <Badge variant="gold">Conference</Badge>}
            {isPrayerParty && <Badge variant="navy">Prayer Party</Badge>}
            <h3 className="font-bold text-[#0D6B30] text-base mt-2 leading-snug" style={{ fontFamily: "var(--font-display, Georgia, serif)" }}>
              {event.title}
            </h3>
          </div>
          <div className="text-center flex-shrink-0 bg-[#F0FAF3] rounded-lg px-3 py-2">
            <div className="text-xl font-bold text-[#0D6B30]">{new Date(event.date).getDate()}</div>
            <div className="text-xs text-slate-500 uppercase">{new Date(event.date).toLocaleString("en-US", { month: "short" })}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-500">
          {event.location && <span className="flex items-center gap-1.5"><MapPin size={13} aria-hidden />{event.location}</span>}
          {event.isOnline && <span className="flex items-center gap-1.5"><Globe size={13} aria-hidden />Online</span>}
        </div>
        <p className="text-sm text-slate-600 mt-3 line-clamp-2">{event.shortDescription}</p>
        {event.isUpcoming && (
          <div className="flex gap-2 mt-4">
            {event.requiresTicket && (
              <Link href="/conference#register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            )}
            {event.joinLink && (
              <a href={event.joinLink} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">Join Online</Button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
