import Link from "next/link";
import {
  BookOpen,
  Mic2,
  Users,
  Heart,
  Info,
  Grid3X3,
  Library,
  Phone,
  Mail,
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const sections = [
  {
    title: "Content",
    items: [
      { href: "/word-for-the-day", label: "Word for the Day", icon: BookOpen, desc: "Daily devotional videos" },
      { href: "/podcast", label: "The Qavah Podcast", icon: Mic2, desc: "Bi-weekly conversations" },
      { href: "/library", label: "Library", icon: Library, desc: "Free & premium resources" },
    ],
  },
  {
    title: "Events",
    items: [
      { href: "/conference", label: "God-Life Conference", icon: Grid3X3, desc: "Annual flagship gathering" },
      { href: "/prayer-party", label: "Prayer & Prophetic Party", icon: Heart, desc: "Federal holiday gatherings" },
    ],
  },
  {
    title: "Ministry",
    items: [
      { href: "/get-involved", label: "Get Involved", icon: Users, desc: "Volunteer & advertise" },
      { href: "/about", label: "About IYG", icon: Info, desc: "Vision, mission & team" },
      { href: "/give", label: "Give / Support", icon: Heart, desc: "Partner with the mission" },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 space-y-8 lg:hidden">
      <h1 className="text-2xl font-bold text-[#0D6B30]" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
        More
      </h1>
      {sections.map(({ title, items }) => (
        <section key={title}>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {items.map(({ href, label, icon: Icon, desc }, i) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${i !== 0 ? "border-t border-slate-100" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0FAF3] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#0D6B30]" aria-hidden />
                </div>
                <div>
                  <div className="font-semibold text-[#0D6B30] text-sm">{label}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
                <span className="ml-auto text-slate-300">›</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Contact */}
      <section>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact</h2>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <a href="tel:+16074442359" className="flex items-center gap-4 p-4 hover:bg-slate-50">
            <div className="w-10 h-10 rounded-xl bg-[#F0FAF3] flex items-center justify-center">
              <Phone size={18} className="text-[#0D6B30]" aria-hidden />
            </div>
            <div>
              <div className="font-semibold text-[#0D6B30] text-sm">+1 607 444 2359</div>
              <div className="text-xs text-slate-400">Call or WhatsApp</div>
            </div>
          </a>
          <a href="mailto:info@internationalyouthgathering.com" className="flex items-center gap-4 p-4 border-t border-slate-100 hover:bg-slate-50">
            <div className="w-10 h-10 rounded-xl bg-[#F0FAF3] flex items-center justify-center">
              <Mail size={18} className="text-[#0D6B30]" aria-hidden />
            </div>
            <div>
              <div className="font-semibold text-[#0D6B30] text-sm">info@internationalyouthgathering.com</div>
              <div className="text-xs text-slate-400">Email us</div>
            </div>
          </a>
          <a href="https://facebook.com/international_youthgathering" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border-t border-slate-100 hover:bg-slate-50">
            <div className="w-10 h-10 rounded-xl bg-[#F0FAF3] flex items-center justify-center">
              <FacebookIcon size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-[#0D6B30] text-sm">@international_youthgathering</div>
              <div className="text-xs text-slate-400">Facebook</div>
            </div>
          </a>
          <a href="https://instagram.com/international_youthgathering" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border-t border-slate-100 hover:bg-slate-50">
            <div className="w-10 h-10 rounded-xl bg-[#F0FAF3] flex items-center justify-center">
              <InstagramIcon size={18} className="text-pink-500" />
            </div>
            <div>
              <div className="font-semibold text-[#0D6B30] text-sm">@international_youthgathering</div>
              <div className="text-xs text-slate-400">Instagram</div>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
