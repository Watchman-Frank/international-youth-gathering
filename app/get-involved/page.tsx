"use client";

import { useState } from "react";
import { Brush, Video, Megaphone, Heart, Users, CheckCircle2, ExternalLink } from "lucide-react";
import type { VolunteerRole } from "@/lib/types";

const roles: VolunteerRole[] = [
  {
    id: "graphic-design",
    title: "Graphic Designer",
    description: "Create compelling visuals for events, social media, articles, and sermon series. Your designs will be the first impression the world has of IYG.",
    skills: ["Adobe Creative Suite", "Canva", "Figma", "Brand consistency"],
    commitment: "5–10 hrs/month",
    icon: "design",
  },
  {
    id: "video-editor",
    title: "Video Editor",
    description: "Edit devotional videos, podcast episodes, event recaps, and promo content. Help shape the visual storytelling of IYG's media ministry.",
    skills: ["Premiere Pro", "DaVinci Resolve", "Color grading", "Motion graphics"],
    commitment: "10–15 hrs/month",
    icon: "video",
  },
  {
    id: "social-media",
    title: "Social Media Manager",
    description: "Grow and steward IYG's presence on Facebook and Instagram. Create content calendars, engage the community, and amplify the ministry's message.",
    skills: ["Content creation", "Community management", "Analytics", "Copywriting"],
    commitment: "8–12 hrs/month",
    icon: "social",
  },
  {
    id: "ministry-partner",
    title: "Ministry Partner",
    description: "Support IYG through prayer, financial giving, and connecting us with your network. Ministry partners are the backbone of everything we do.",
    skills: ["Intercession", "Networking", "Advocacy"],
    commitment: "Ongoing",
    icon: "heart",
  },
];

const iconMap: Record<string, React.ElementType> = {
  design: Brush,
  video: Video,
  social: Megaphone,
  heart: Heart,
};

export default function GetInvolvedPage() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedRole = roles.find((r) => r.id === activeRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* Hero */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <Users size={28} className="text-[#1B2A4A]" aria-hidden />
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#1B2A4A]"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Get Involved
          </h1>
        </div>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
          The mountain of influence is not climbed alone. IYG is built by ordinary people who have said yes to an extraordinary call. If you have a gift, we have a place for you.
        </p>
      </section>

      {/* Roles */}
      <section aria-labelledby="roles-heading">
        <h2
          id="roles-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-6"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Open Volunteer Roles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roles.map((role) => {
            const Icon = iconMap[role.icon];
            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1B2A4A] flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#F2B134]" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B2A4A] text-lg" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                      {role.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{role.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {role.skills.map((s) => (
                        <span key={s} className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-400">
                        Commitment: <span className="font-medium text-slate-600">{role.commitment}</span>
                      </span>
                      <button
                        onClick={() => setActiveRole(role.id)}
                        className="text-sm font-semibold text-[#F2B134] hover:text-[#D9960F] transition-colors"
                      >
                        Apply →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application form */}
      {activeRole && !submitted && (
        <section aria-labelledby="apply-heading" className="scroll-mt-20">
          <div className="max-w-xl">
            <h2
              id="apply-heading"
              className="text-2xl font-bold text-[#1B2A4A] mb-2"
              style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
            >
              Apply: {selectedRole?.title}
            </h2>
            <p className="text-slate-500 text-sm mb-6">Tell us a bit about yourself. We'll review your application and reach out within 5 business days.</p>
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Volunteer application form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="v-name" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Full Name *</label>
                  <input id="v-name" type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="v-email" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Email *</label>
                  <input id="v-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label htmlFor="v-role" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Role Applying For *</label>
                <select
                  id="v-role"
                  required
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent"
                >
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="v-portfolio" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Portfolio / Work Samples URL</label>
                <input id="v-portfolio" type="url" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" placeholder="https://yourwork.com" />
              </div>
              <div>
                <label htmlFor="v-message" className="block text-sm font-semibold text-[#1B2A4A] mb-1.5">Message *</label>
                <textarea id="v-message" required rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#F2B134] focus:border-transparent" placeholder="Tell us about yourself, your experience, and why you'd like to serve with IYG…" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-[#1B2A4A] text-white font-bold text-sm rounded-xl hover:bg-[#2D4070] transition-colors">
                Submit Application
              </button>
            </form>
          </div>
        </section>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 max-w-xl text-center">
          <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>Application Received!</h2>
          <p className="text-slate-500 text-sm mt-2">Thank you for your heart to serve. Our team will review your application and reach out within 5 business days.</p>
        </div>
      )}

      {/* Advertise */}
      <section aria-labelledby="advertise-heading" className="bg-[#FAF8F3] rounded-2xl p-8 sm:p-10">
        <div className="max-w-xl">
          <h2
            id="advertise-heading"
            className="text-2xl font-bold text-[#1B2A4A] mb-3"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Advertise With IYG
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Is your business or ministry looking to reach a young, faith-driven audience across the globe? IYG's media platform gives you direct access to engaged young believers. We work with Christian businesses, ministries, and mission organizations to promote products, services, and events that align with Kingdom values.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:info@internationalyouthgathering.com?subject=Advertising%20Inquiry"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2A4A] text-white font-semibold text-sm rounded-xl hover:bg-[#2D4070] transition-colors"
            >
              <ExternalLink size={15} />
              Email Us to Advertise
            </a>
            <a
              href="tel:+16074442359"
              className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 text-[#1B2A4A] font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors"
            >
              +1 607 444 2359
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
