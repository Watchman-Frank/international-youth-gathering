import Link from "next/link";
import { Image, FileText, Video, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/admin/media",
    icon: Image,
    label: "Media Library",
    description: "Upload and manage images, videos, PDFs, and audio files. Copy links to use anywhere on the site.",
    cta: "Open Media Library",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    href: "/admin/media",
    icon: Video,
    label: "Upload Videos",
    description: "Upload MP4 and video files directly, or link your YouTube channel videos through the YouTube integration.",
    cta: "Upload Media",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    href: "/admin/media",
    icon: FileText,
    label: "Documents & PDFs",
    description: "Upload sermon notes, study guides, event programs, and other documents for your community.",
    cta: "Upload Files",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-2xl font-bold text-[#1B2A4A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome to IYG Admin
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your website content — upload media, images, videos, and documents.
        </p>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {cards.map(({ href, icon: Icon, label, description, cta, color }) => (
          <Link
            key={label}
            href={href}
            className="group block bg-white rounded-xl border border-slate-100 p-6 hover:border-slate-200 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${color}`}>
              <Icon size={18} />
            </div>
            <h2 className="font-bold text-[#1B2A4A] text-sm mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
              {label}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">{description}</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] group-hover:text-[#F2B134] transition-colors">
              {cta} <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-[#FAF8F3] rounded-xl border border-slate-100 p-6">
        <h3 className="font-bold text-[#1B2A4A] text-sm mb-3">How to use uploads on your site</h3>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1B2A4A] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">1</span>
            Go to <strong>Media Library</strong> and upload your file.
          </li>
          <li className="flex gap-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1B2A4A] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">2</span>
            Click <strong>Copy URL</strong> next to the uploaded file.
          </li>
          <li className="flex gap-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1B2A4A] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">3</span>
            Use that URL in your articles, event pages, or share it directly with your community.
          </li>
        </ol>
      </div>
    </div>
  );
}
