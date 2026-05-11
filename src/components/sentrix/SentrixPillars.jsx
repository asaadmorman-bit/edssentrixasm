import React from "react";
import { ShieldCheck, Gavel, MapPin, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tagColor: "text-blue-400",
    borderHover: "hover:border-blue-500/30",
    tag: "Training & LMS",
    title: "Continuous Compliance LMS",
    body: "Automated micro-courses for Cyber Awareness, CPR, and Active Shooter response. Keep your staff compliant and negotiate lower insurance premiums with downloadable certificates.",
    metrics: ["40+ Courses", "Certificate Download", "Insurance-ready"],
  },
  {
    icon: Gavel,
    iconBg: "bg-tactical-gold/10 border-tactical-gold/20",
    iconColor: "text-tactical-gold",
    tagColor: "text-tactical-gold",
    borderHover: "hover:border-tactical-gold/30",
    tag: "Legal Dispatch",
    title: "On-Demand Legal Dispatch",
    body: "Stop chasing vendors. Book vetted Mobile Notaries and Process Servers directly to your office with one click. Real-time dispatch tracking included.",
    metrics: ["< 3 min dispatch", "Vetted providers", "Real-time tracking"],
  },
  {
    icon: MapPin,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tagColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
    tag: "Physical Security",
    title: "Physical Security & CPTED",
    body: "Request line-of-sight landscaping and perimeter vulnerability audits to ensure your physical footprint matches your digital defense using CPTED methodologies.",
    metrics: ["CPTED Standards", "Perimeter Audits", "LOS Clearing"],
  },
];

export default function SentrixPillars() {
  return (
    <section className="relative py-24 lg:py-32 bg-navy-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(245,158,11,0.04),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-full px-4 py-1.5 mb-5">
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Core Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Three Pillars.{" "}
            <span className="text-tactical-gold">One Platform.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Sentrix unifies the three most neglected layers of SMB security into a single, auditable dashboard.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`group relative p-7 rounded-2xl bg-navy-800/60 border border-navy-700 ${p.borderHover} hover:bg-navy-800 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl border ${p.iconBg} flex items-center justify-center mb-6`}>
                <p.icon className={`w-6 h-6 ${p.iconColor}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${p.tagColor} mb-2 block`}>
                {p.tag}
              </span>
              <h3 className="text-white font-bold text-lg leading-snug mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{p.body}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {p.metrics.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-navy-900/60 border border-navy-700 text-slate-400"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className={`flex items-center gap-1.5 text-xs font-bold ${p.tagColor} group-hover:gap-2.5 transition-all`}>
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}