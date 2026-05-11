import React from "react";
import { Cloud, Cpu, Shield, Lock, Shirt, Scale } from "lucide-react";

const partners = [
  { name: "Microsoft", icon: Cloud },
  { name: "Cisco", icon: Cpu },
  { name: "Cloudflare", icon: Shield },
  { name: "Aikido Security", icon: Lock },
  { name: "5.11 Tactical", icon: Shirt },
  { name: "Right to Bear", icon: Scale },
];

export default function SentrixTrustBar() {
  return (
    <section className="relative py-12 border-y border-navy-700/60">
      <div className="absolute inset-0 bg-navy-800/40" />
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-slate-600 text-[11px] font-bold uppercase tracking-widest mb-8">
          Enterprise infrastructure. Scaled for your business.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {partners.map((p) => (
            <div
              key={p.name}
              className="group flex items-center gap-2.5 text-slate-500 hover:text-slate-200 transition-all duration-300"
            >
              <div className="w-8 h-8 bg-navy-800 border border-navy-700 rounded-lg flex items-center justify-center group-hover:border-tactical-gold/30 group-hover:bg-tactical-gold/5 transition-all">
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