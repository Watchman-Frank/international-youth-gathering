import { Heart, Globe, Video, BookOpen, Users, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import type { SiteContent } from "@/app/api/admin/content/route";
import { getRecord } from "@/lib/blobStore";

export const metadata: Metadata = {
  title: "Give / Support the Ministry",
  description: "Support IYG's mission to use media as a kingdom tool for young people around the world.",
};

const impacts = [
  { icon: Video, label: "$25 / month", desc: "Covers production costs for one month of daily devotional videos" },
  { icon: Globe, label: "$50 / month", desc: "Sponsors streaming for one global live event, reaching thousands online" },
  { icon: BookOpen, label: "$100 / month", desc: "Funds the creation of 3–5 free library resources for download" },
  { icon: Users, label: "$200 / month", desc: "Sponsors one young person's full God-Life Conference experience" },
];

export default async function GivePage() {
  const content = await getRecord<SiteContent>("content", "site").catch(() => null);
  const give = content?.give;

  const title = give?.heroTitle || "Partner With the Mission";
  const subtitle = give?.heroSubtitle || "IYG is a faith-funded ministry. Every donation — large or small — goes directly toward creating content, hosting events, and building resources that transform the lives of young people around the world.";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Hero */}
      <section className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F2B134] flex items-center justify-center mx-auto mb-5">
          <Heart size={28} className="text-[#1B2A4A]" fill="currentColor" aria-hidden />
        </div>
        <h1
          className="text-4xl font-bold text-[#1B2A4A] text-balance"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          {title}
        </h1>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      </section>

      {/* Impact */}
      <section aria-labelledby="impact-heading">
        <h2
          id="impact-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-6 text-center"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Your Giving in Action
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {impacts.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F3] flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-[#F2B134]" aria-hidden />
              </div>
              <div>
                <div className="font-bold text-[#1B2A4A] text-base" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>{label}</div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation section */}
      <section aria-labelledby="donate-heading" className="bg-[#1B2A4A] rounded-3xl p-10 text-center">
        <h2
          id="donate-heading"
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Make a Donation
        </h2>

        {give?.paypalLink || give?.cashappLink ? (
          <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-sm mx-auto">
            {give.paypalLink && (
              <a
                href={give.paypalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors"
              >
                <ExternalLink size={15} /> Give via PayPal
              </a>
            )}
            {give.cashappLink && (
              <a
                href={give.cashappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                <ExternalLink size={15} /> Give via Cash App
              </a>
            )}
          </div>
        ) : (
          <>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              We are setting up our online giving portal. In the meantime, please reach out directly to give or to discuss ministry partnership.
            </p>
            <div className="space-y-3 max-w-sm mx-auto">
              <a
                href="mailto:info@internationalyouthgathering.com?subject=Donation%20/%20Ministry%20Partnership"
                className="block w-full py-3.5 bg-[#F2B134] text-[#1B2A4A] font-bold text-sm rounded-xl hover:bg-[#D9960F] transition-colors"
              >
                Email Us to Give
              </a>
              <a
                href="tel:+16074442359"
                className="block w-full py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors"
              >
                Call: +1 607 444 2359
              </a>
            </div>
          </>
        )}

        {give?.additionalGiveText && (
          <p className="text-white/60 text-sm mt-6 max-w-md mx-auto leading-relaxed">{give.additionalGiveText}</p>
        )}
      </section>

      {/* Bank details (if set by admin) */}
      {give?.bankDetails && (
        <section aria-labelledby="bank-heading" className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2
            id="bank-heading"
            className="text-xl font-bold text-[#1B2A4A] mb-4"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Bank / Wire Transfer Details
          </h2>
          <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono bg-slate-50 rounded-xl p-4">
            {give.bankDetails}
          </pre>
        </section>
      )}

      {/* Scripture */}
      <section className="bg-[#FAF8F3] rounded-2xl p-8 text-center">
        <blockquote
          className="text-xl font-semibold text-[#1B2A4A] text-balance"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
        </blockquote>
        <cite className="text-sm text-[#F2B134] font-bold mt-3 block not-italic">2 Corinthians 9:7</cite>
      </section>
    </div>
  );
}
