import React from "react";
import { Cloud, Shield, Lock, Cpu, Shirt, Scale } from "lucide-react";

const partners = [
  { name: "Google Cloud", icon: Cloud },
  { name: "Cisco", icon: Cpu },
  { name: "Cloudflare", icon: Shield },
  { name: "Aikido Security", icon: Lock },
  { name: "5.11 Tactical", icon: Shirt },
  { name: "Right to Bear", icon: Scale },
];

export default function PartnersBanner() {
  return (
    <section className="relative py-10 border-y border-slate-800/60 bg-slate-900/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-600 text-xs font-semibold uppercase tracking-widest mb-8">
          Built On &amp; Partnered With Industry Titans
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2.5 text-slate-500 hover:text-slate-300 transition-colors group"
            >
              <div className="w-8 h-8 bg-slate-800 border border-slate-700/50 rounded-lg flex items-center justify-center group-hover:border-slate-600 transition-colors">
                <p.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}