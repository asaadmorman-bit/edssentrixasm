import React from "react";
import { ShoppingBag, CheckCircle2, Shirt, Scale, Package, ArrowRight } from "lucide-react";

const perks = [
  {
    icon: Shirt,
    title: "5.11 Tactical Gear",
    desc: "Bulk-order uniforms, trauma kits, and tactical apparel at B2B pricing direct to your door.",
  },
  {
    icon: Scale,
    title: "Right to Bear Policies",
    desc: "Implement legal defense coverage for your entire security team from within your dashboard.",
  },
  {
    icon: Package,
    title: "Security Hardware",
    desc: "Body cameras, access control systems, and Cisco Meraki network upgrades — pre-vetted and ready.",
  },
];

const proofPoints = [
  "B2B bulk pricing on all orders",
  "One-click policy enrollment",
  "Integrated billing dashboard",
  "Dedicated account manager",
];

export default function SentrixProShop() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Slightly darker contrast vs the pillars section */}
      <div className="absolute inset-0 bg-navy-950" style={{ backgroundColor: "#050b14" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.04),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tactical-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tactical-gold/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-tactical-gold/10 border border-tactical-gold/20 rounded-full px-4 py-1.5 mb-6">
              <ShoppingBag className="w-3.5 h-3.5 text-tactical-gold" />
              <span className="text-tactical-gold text-[11px] font-bold uppercase tracking-widest">Partner Pro Shop</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
              Exclusive{" "}
              <span className="text-tactical-gold">Partner Perks</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              EDS Sentrix ASM users get direct dashboard access to bulk-order{" "}
              <span className="text-white font-medium">5.11 Tactical gear</span> for their security staff and
              implement{" "}
              <span className="text-white font-medium">Right to Bear legal defense policies</span> for their
              team — all managed from a single pane of glass.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {proofPoints.map((pt) => (
                <div key={pt} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-tactical-gold shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <button className="group inline-flex items-center gap-2 px-6 py-3.5 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-tactical-gold/20 active:scale-95">
              Browse the Pro Shop
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right — perk cards */}
          <div className="space-y-4">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 p-5 rounded-xl bg-navy-800/60 border border-navy-700 hover:border-tactical-gold/30 hover:bg-navy-800 hover:-translate-x-1 transition-all duration-300 cursor-default"
              >
                <div className="w-11 h-11 bg-tactical-gold/10 border border-tactical-gold/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-tactical-gold/15 transition-colors">
                  <perk.icon className="w-5 h-5 text-tactical-gold" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{perk.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}