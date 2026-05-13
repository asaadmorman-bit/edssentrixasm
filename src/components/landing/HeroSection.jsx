import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle2, MapPin, ShieldCheck, UserCheck, Plane, Scale, Monitor } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const modules = [
  { icon: ShieldCheck, label: "Compliance LMS", color: "text-blue-400" },
  { icon: UserCheck, label: "Executive Protection", color: "text-tactical-gold" },
  { icon: Plane, label: "Aerial Operations", color: "text-violet-400" },
  { icon: Scale, label: "Legal Dispatch", color: "text-emerald-400" },
];

export default function HeroSection({ onScrollToWaitlist }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email."); return; }
    setSubmitted(true);
    toast.success("Beta access requested! We'll be in touch within 24 hours.");
    await base44.integrations.Core.SendEmail({
      to: "info@eds-360.com",
      subject: "New Beta Access Request — EDS Sentrix ASM",
      body: `A new beta access request was submitted from the hero section.\n\nEmail: ${email}`,
    });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-navy-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.08),transparent)]" />
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(rgba(148,163,184,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.5) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://media.base44.com/images/public/6a01a7f0046386899eee80d5/483e87ca1_1778520471105.png"
            alt="EDS Sentrix ASM"
            className="h-32 w-auto object-contain"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-tactical-gold/10 border border-tactical-gold/25 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 bg-tactical-gold rounded-full animate-pulse" />
            <span className="text-tactical-gold text-xs font-bold tracking-widest uppercase">Now Accepting Beta Applications — DMV Area</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6">
            <span className="text-white">Total Attack Surface</span>
            <br />
            <span className="text-tactical-gold">Management.</span>
            <br />
            <span className="text-slate-300 font-light text-3xl sm:text-4xl lg:text-5xl">One Secure Dashboard.</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">
            Cyber threats, workplace safety, and physical defense shouldn't require ten different vendors.
            EDS Sentrix ASM is the DMV's first{" "}
            <span className="text-white font-medium">unified command platform</span>{" "}
            for compliance, executive protection, aerial ops, and legal dispatch.
          </p>

          <div className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mb-8">
            <MapPin className="w-3.5 h-3.5" />
            <span>Serving Washington DC · Maryland · Virginia</span>
          </div>

          {/* Module pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {modules.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800/60 border border-navy-700 rounded-full text-xs font-semibold">
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-slate-300">{m.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-xl mx-auto mb-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email..."
                  className="flex-1 h-13 px-5 py-3.5 bg-navy-800/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-tactical-gold/40 focus:border-tactical-gold/40 transition-all"
                />
                <button
                  type="submit"
                  className="sm:shrink-0 px-6 py-3.5 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-tactical-gold/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  Request Beta Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Access requested! We'll reach out within 24 hours.</span>
              </div>
            )}
          </div>

          <p className="text-slate-600 text-xs mb-14">
            No credit card required · DMV area businesses only · Limited beta spots
          </p>

          {/* Interactive Demo CTA */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-tactical-gold/5 blur-2xl rounded-3xl" />
            <div className="relative bg-navy-800/60 border border-navy-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Browser chrome */}
              <div className="top-0 left-0 right-0 h-10 bg-navy-900/90 border-b border-navy-700/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-tactical-red/70" />
                <div className="w-3 h-3 rounded-full bg-tactical-gold/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="flex-1 mx-4 h-5 bg-navy-700/50 rounded-md flex items-center px-3">
                  <span className="text-[10px] text-slate-500">asm.emergingdefensesolutions.com/demo</span>
                </div>
              </div>
              {/* Mini dashboard preview */}
              <div className="p-5 grid grid-cols-4 gap-3">
                {[
                  { label: "Readiness", value: "91", color: "text-emerald-400" },
                  { label: "Licenses", value: "4", color: "text-blue-400" },
                  { label: "Compliance", value: "96%", color: "text-amber-400" },
                  { label: "Alerts", value: "2", color: "text-red-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-navy-900/80 border border-navy-700/40 rounded-lg p-3 text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-t from-navy-900/60">
                <div className="text-left">
                  <p className="text-white font-bold text-sm">Interactive Platform Demo</p>
                  <p className="text-slate-400 text-xs mt-0.5">Explore live scenarios: Law Firm · Property Mgmt · Medical Clinic · Corporate</p>
                </div>
                <Link
                  to="/demo"
                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-tactical-gold/30 active:scale-95"
                >
                  <Monitor className="w-4 h-4" />
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}