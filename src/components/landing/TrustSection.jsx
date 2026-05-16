import React from "react";
import { CloudLightning, ScanLine, Server, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: CloudLightning,
    title: "Cloudflare Zero Trust",
    body: "Every request is authenticated and encrypted. No implicit trust — every user and device is continuously verified at the network edge.",
  },
  {
    icon: ScanLine,
    title: "Aikido Security Scanning",
    body: "Continuous SAST, DAST, and dependency vulnerability scanning keeps our codebase clean and your data protected 24/7.",
  },
  {
    icon: Server,
    title: "Google Cloud (GCP) Hosting",
    body: "Enterprise-grade cloud infrastructure on GCP with 99.9% uptime SLA, geo-redundant backups, and SOC 2 compliance built in.",
  },
];

const badges = ["SOC 2 Aligned", "99.9% Uptime SLA", "AES-256 Encryption", "HIPAA Ready", "Zero Trust Network"];

export default function TrustSection() {
  return (
    <section id="trust" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dark contrast background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(251,191,36,0.04),transparent)]" />
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
            Military-Grade<br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              Infrastructure.
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Your data is secured behind Cloudflare's Zero Trust network and continuously scanned by
            Aikido Security. Hosted on Google Cloud (GCP) for 99.9% uptime.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 hover:bg-slate-900 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500/15 transition-colors">
                <p.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Compliance badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:border-slate-600 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}