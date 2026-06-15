import { Mic2 } from "lucide-react";
import { PodcastEpisodeCard } from "@/components/cards/PodcastEpisodeCard";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { podcastEpisodes } from "@/lib/data/podcast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Qavah Podcast",
  description: "Honest, grounded conversations for young believers who refuse to be conformed. New episodes every two weeks.",
};

export default function PodcastPage() {
  const [latest, ...rest] = podcastEpisodes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <section>
        <div className="bg-gradient-to-br from-[#1B2A4A] to-[#2D3A5E] rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F2B134] flex items-center justify-center">
                  <Mic2 size={24} className="text-[#1B2A4A]" aria-hidden />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F2B134] uppercase tracking-widest">IYG Original</div>
                  <h1
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
                  >
                    The Qavah Podcast
                  </h1>
                </div>
              </div>
              <p className="text-white/70 text-base leading-relaxed max-w-lg">
                Qavah — the Hebrew word for "wait" — is not passive. It's an active, expectant binding to God's promises. This is a podcast for young believers who are in the waiting, the building, the becoming. Honest conversations, grounded in scripture.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">2</div>
                  <div className="text-xs text-white/50">Seasons</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">12+</div>
                  <div className="text-xs text-white/50">Episodes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Biweekly</div>
                  <div className="text-xs text-white/50">New Episodes</div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <VideoPlayer
                youtubeId={latest.youtubeId}
                thumbnailUrl={latest.thumbnailUrl}
                title={latest.title}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest episode detail */}
      <section aria-labelledby="latest-heading">
        <div className="flex items-center gap-3 mb-4">
          <h2
            id="latest-heading"
            className="text-xl font-bold text-[#1B2A4A]"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Latest Episode
          </h2>
          <span className="text-xs font-bold text-[#F2B134] bg-amber-50 px-2.5 py-1 rounded-full">New</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-5">
            <img
              src={latest.thumbnailUrl}
              alt={latest.title}
              className="w-full sm:w-48 h-32 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Season {latest.season} · Episode {latest.episode}
              </div>
              <h3 className="text-xl font-bold text-[#1B2A4A] leading-snug" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                {latest.title}
              </h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{latest.description}</p>
              {latest.guests && latest.guests.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">With {latest.guests.join(", ")}</p>
              )}
            </div>
          </div>
          {latest.showNotes && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h4 className="text-sm font-bold text-[#1B2A4A] mb-2">Show Notes</h4>
              <pre className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed font-sans">{latest.showNotes}</pre>
            </div>
          )}
        </div>
      </section>

      {/* All episodes grid */}
      <section aria-labelledby="all-episodes-heading">
        <h2
          id="all-episodes-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-6"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          All Episodes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {podcastEpisodes.map((ep) => (
            <PodcastEpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      </section>
    </div>
  );
}
