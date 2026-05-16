import React from "react";
import { ShieldCheck, UserCheck, Plane, Scale, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: ShieldCheck,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    tag: "Module 1 — Compliance LMS",
    title: "Continuous Compliance Training",
    body: "Automated micro-courses for Cyber Awareness, Active Shooter Response, and CPR/First Aid. Auto-generate certificates to negotiate lower insurance premiums.",
    cta: "Explore Training",
    href: "/app/training",
  },
  {
    icon: UserCheck,
    color: "from-tactical-gold/10 to-tactical-gold/5",
    border: "border-tactical-gold/20",
    iconBg: "bg-tactical-gold/10 border-tactical-gold/20",
    iconColor: "text-tactical-gold",
    tag: "Module 2 — Executive Protection",
    title: "Elite Executive Protection",
    body: "Deploy licensed, highly trained EP agents — armed or unarmed — directly to your executives or high-risk assets. Discrete, professional, mission-ready.",
    cta: "Book EP Agents",
    href: "/app/dispatch",
  },
  {
    icon: Plane,
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    tag: "Module 3 — Aerial Operations",
    title: "Drone & Aerial Operations",
    body: "On-demand drone services for perimeter surveillance, Search & Rescue (SAR), and 4K aerial mapping. Dispatch a drone team to your site in hours.",
    cta: "Request Aerial Ops",
    href: "/app/dispatch",
  },
  {
    icon: Scale,
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    tag: "Module 4 — Legal & Site Security",
    title: "Legal Dispatch & Site Hardening",
    body: "Instantly book vetted Mobile Notaries, Process Servers, or CPTED-compliant landscaping to harden your physical footprint. Real-time tracking included.",
    cta: "Dispatch Now",
    href: "/app/dispatch",
  },
  {
    icon: ShoppingBag,
    color: "from-tactical-red/10 to-tactical-red/5",
    border: "border-tactical-red/20",
    iconBg: "bg-tactical-red/10 border-tactical-red/20",
    iconColor: "text-tactical-red",
    tag: "Partner Pro Shop",
    title: "B2B Partner Pro Shop",
    body: "Bulk-order 5.11 Tactical gear for your security team, enroll in Right to Bear legal defense policies, and request Cisco Meraki or GCP upgrades — all in-dashboard.",
    cta: "Browse Pro Shop",
    href: "/app/shop",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 mb-5">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Platform Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
            The DMV's First<br />
            <span className="text-tactical-gold">
              Unified Attack Surface Platform
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Five integrated modules. One dashboard. Total coverage across your digital, physical, legal, and operational attack surface.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.href}
              className={`relative group p-6 rounded-2xl bg-gradient-to-b ${f.color} border ${f.border} hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 cursor-pointer block`}
            >
              <div className={`w-11 h-11 rounded-xl border ${f.iconBg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${f.iconColor} mb-2 block`}>
                {f.tag}
              </span>
              <h3 className="text-white font-bold text-base leading-snug mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{f.body}</p>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${f.iconColor} group-hover:gap-2.5 transition-all`}>
                <span>{f.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}