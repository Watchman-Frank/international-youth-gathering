import { Target, Lightbulb, Users, Quote } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About IYG",
  description: "Learn about the vision, mission, and values behind International Youth Gathering — a media ministry for the nations.",
};

const values = [
  {
    name: "Prayer",
    desc: "Everything IYG does begins and ends in the prayer room. We believe that intercession is not preparation for ministry — it IS ministry. We prioritize presence over platform.",
    ref: "1 Timothy 2:1",
  },
  {
    name: "Dedication",
    desc: "We are committed to the call at any cost. Dedication means showing up even when the crowd doesn't, serving even when there's no applause, and staying the course when it's inconvenient.",
    ref: "Luke 9:62",
  },
  {
    name: "Discipline",
    desc: "Gifts will open doors; discipline keeps you in the room. IYG cultivates sustainable rhythms of study, rest, exercise, and service — because the long game matters more than the highlight reel.",
    ref: "2 Timothy 1:7",
  },
  {
    name: "Spiritual Intelligence",
    desc: "We believe young people are called to discern the times, understand the systems of this age, and respond with the wisdom of heaven. Spiritual intelligence is the ability to see what God sees and respond accordingly.",
    ref: "1 Chronicles 12:32",
  },
];

const leadership = [
  {
    name: "Pastor Emmanuel Asante",
    role: "Founder & Lead Pastor",
    bio: "Pastor Emmanuel planted IYG with a burden to see young people rise into their apostolic calling. With over a decade of ministry experience, he leads the vision with humility and apostolic clarity.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Abena Mensah",
    role: "Prayer Director",
    bio: "Abena carries a deep burden for intercession and has led IYG's prayer ministry since the beginning. She oversees the Prayer & Prophetic Party gatherings and trains intercessors across the network.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Kwame Osei",
    role: "Content & Media Director",
    bio: "Kwame leads IYG's media operations — from the Qavah Podcast to social media strategy. He is passionate about using storytelling as a tool for kingdom transformation.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
];

const testimonies = [
  {
    name: "Josephine A., Ghana",
    quote: "God-Life Conference changed the trajectory of my life. I came as a student with no clear direction. I left as a missionary with a mandate.",
  },
  {
    name: "Marcus T., United States",
    quote: "The Qavah Podcast has been my companion during the hardest season of my life. There is something rare about a ministry that preaches depth over hype.",
  },
  {
    name: "Amara N., Nigeria",
    quote: "I found my tribe through IYG. Young, on fire, dedicated to excellence. I don't know who I'd be without this community.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Mission & Vision */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-[#1B2A4A] leading-tight text-balance"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            A Ministry Built for This Generation
          </h1>
          <div className="mt-6 space-y-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target size={18} className="text-[#F2B134]" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-[#1B2A4A] text-base">Our Vision</h2>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  To be a system of wholistic development and transformation — keeping and maintaining the Apostolic Mandate.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F2B134] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb size={18} className="text-[#1B2A4A]" aria-hidden />
              </div>
              <div>
                <h2 className="font-bold text-[#1B2A4A] text-base">Our Mission</h2>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                  To use "The Mountain of Influence" (Media) as a kingdom tool to connect young people around the world.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=500&fit=crop"
            alt="IYG community gathering"
            className="w-full rounded-3xl object-cover h-80"
          />
          <div className="absolute -bottom-4 -left-4 bg-[#F2B134] rounded-2xl px-6 py-4 shadow-lg">
            <div className="text-2xl font-bold text-[#1B2A4A]">4+</div>
            <div className="text-xs text-[#1B2A4A]/70 font-medium">Years of Ministry</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-[#1B2A4A] rounded-2xl px-6 py-4 shadow-lg">
            <div className="text-2xl font-bold text-white">10k+</div>
            <div className="text-xs text-white/60 font-medium">Lives Touched</div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section aria-labelledby="values-heading">
        <h2
          id="values-heading"
          className="text-2xl font-bold text-[#1B2A4A] mb-8"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div key={v.name} className="bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F2B134] flex items-center justify-center text-[#1B2A4A] font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4A]" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                  {v.name}
                </h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              <p className="text-xs text-[#F2B134] font-semibold mt-3 italic">{v.ref}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="leadership-heading">
        <div className="flex items-center gap-2 mb-8">
          <Users size={22} className="text-[#1B2A4A]" aria-hidden />
          <h2
            id="leadership-heading"
            className="text-2xl font-bold text-[#1B2A4A]"
            style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
          >
            Our Team
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {leadership.map((person) => (
            <div key={person.name} className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-md transition-all">
              <img
                src={person.image}
                alt={person.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#FAF8F3]"
              />
              <h3 className="font-bold text-[#1B2A4A] text-base mt-4" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
                {person.name}
              </h3>
              <p className="text-xs font-semibold text-[#F2B134] mt-0.5">{person.role}</p>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">{person.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonies */}
      <section aria-labelledby="testimonies-heading" className="bg-[#1B2A4A] rounded-3xl p-10 sm:p-14">
        <h2
          id="testimonies-heading"
          className="text-2xl font-bold text-white mb-8 text-center"
          style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}
        >
          Impact Stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonies.map((t) => (
            <div key={t.name} className="bg-white/10 rounded-2xl p-6">
              <Quote size={20} className="text-[#F2B134] mb-3" aria-hidden />
              <p className="text-white/80 text-sm leading-relaxed italic">{t.quote}</p>
              <p className="text-[#F2B134] text-xs font-bold mt-4">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#FAF8F3] rounded-2xl p-8 sm:p-10 text-center">
        <h2 className="text-xl font-bold text-[#1B2A4A] mb-2" style={{ fontFamily: "var(--font-fraunces, Georgia, serif)" }}>
          Get in Touch
        </h2>
        <p className="text-slate-500 text-sm mb-5">Questions, partnerships, speaking requests, or just want to connect?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:info@internationalyouthgathering.com" className="px-5 py-3 bg-[#1B2A4A] text-white font-semibold text-sm rounded-xl hover:bg-[#2D4070] transition-colors">
            info@internationalyouthgathering.com
          </a>
          <a href="tel:+16074442359" className="px-5 py-3 border border-slate-200 text-[#1B2A4A] font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors">
            +1 607 444 2359
          </a>
        </div>
      </section>
    </div>
  );
}
