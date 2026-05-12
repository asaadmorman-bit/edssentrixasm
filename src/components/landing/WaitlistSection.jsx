import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Zap, Gift, Tag } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const perks = [
  { icon: Gift, text: "First 3 legal dispatches — free" },
  { icon: Tag, text: "Early-bird pricing locked in forever" },
  { icon: Zap, text: "Priority access before public launch" },
];

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email."); return; }
    setSubmitted(true);
    toast.success("You've secured your beta spot!");
    await base44.integrations.Core.SendEmail({
      to: "info@eds-360.com",
      subject: "New Waitlist Signup — EDS Sentrix ASM Beta",
      body: `A new beta waitlist submission was received.\n\nOrganization: ${org}\nEmail: ${email}`,
    });
  };

  return (
    <section id="waitlist" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(251,191,36,0.07),transparent)]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Limited Beta Spots Available</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
          Secure Your Spot<br />
          <span className="text-tactical-gold">
            in the EDS Sentrix ASM Beta.
          </span>
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          We're opening EDS Sentrix ASM to a select group of{" "}
          <span className="text-white font-medium">DMV property managers, law firms, and medical clinics.</span>{" "}
          Sign up today to get your first 3 legal dispatches or initial perimeter audit free.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                <perk.icon className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>{perk.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Company / Organization name"
                className="w-full h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Business email address"
                  className="flex-1 h-12 px-5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                />
                <button
                  type="submit"
                  className="sm:shrink-0 h-12 px-7 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2"
                >
                  Join the Waitlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-600 text-xs text-center pt-1">
                No credit card required · DMV area businesses only · Beta spots are limited
              </p>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg">You're on the list!</h3>
              <p className="text-slate-400 text-sm max-w-sm text-center">
                We'll reach out with your exclusive beta invite and early-bird pricing details within 24–48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}