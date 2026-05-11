import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Gift, Tag, Shield, Users } from "lucide-react";
import { toast } from "sonner";

const highlights = [
  { icon: Gift, text: "First 3 legal dispatches — free" },
  { icon: Tag, text: "Early-bird pricing locked forever" },
  { icon: Shield, text: "Priority beta access" },
];

export default function SentrixWaitlist() {
  const [form, setForm] = useState({ name: "", email: "", size: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) { toast.error("Please enter a valid email."); return; }
    if (!form.name.trim()) { toast.error("Please enter your name."); return; }
    setSubmitted(true);
    toast.success("Beta access requested! We'll be in touch within 24 hours.");
  };

  return (
    <section id="sentrix-waitlist" className="relative py-24 lg:py-32 overflow-hidden bg-navy-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(245,158,11,0.06),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tactical-gold/25 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-tactical-gold/10 border border-tactical-gold/25 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 bg-tactical-gold rounded-full animate-pulse" />
          <span className="text-tactical-gold text-[11px] font-bold uppercase tracking-widest">
            Limited Beta Spots Available
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5">
          Secure Your{" "}
          <span className="text-tactical-gold">Beta Access</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-8">
          We're opening Sentrix to a select group of{" "}
          <span className="text-white font-medium">DMV property managers, law firms, and medical clinics.</span>{" "}
          Sign up today to get your first 3 legal dispatches free.
        </p>

        {/* Perk pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800 border border-navy-700 text-slate-300 text-sm font-medium"
            >
              <h.icon className="w-3.5 h-3.5 text-tactical-gold" />
              {h.text}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 ring-1 ring-tactical-gold/10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full h-11 px-4 bg-navy-900/70 border border-navy-600 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-tactical-gold/40 focus:border-tactical-gold/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Work Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    className="w-full h-11 px-4 bg-navy-900/70 border border-navy-600 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-tactical-gold/40 focus:border-tactical-gold/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Company Size
                </label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-navy-900/70 border border-navy-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tactical-gold/40 focus:border-tactical-gold/40 transition-all appearance-none cursor-pointer text-white"
                >
                  <option value="" disabled className="bg-navy-900">Select company size...</option>
                  <option value="1-10" className="bg-navy-900">1–10 employees</option>
                  <option value="11-50" className="bg-navy-900">11–50 employees</option>
                  <option value="51-200" className="bg-navy-900">51–200 employees</option>
                  <option value="201-500" className="bg-navy-900">201–500 employees</option>
                  <option value="500+" className="bg-navy-900">500+ employees</option>
                </select>
              </div>

              <button
                type="submit"
                className="group w-full h-12 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-tactical-gold/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
              >
                Request Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-slate-600 text-xs text-center">
                No credit card required · DMV-area businesses only · Spots are limited
              </p>
            </form>
          ) : (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-tactical-gold/10 border border-tactical-gold/25 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-tactical-gold" />
              </div>
              <div>
                <h3 className="text-white font-black text-xl mb-2">Access Requested!</h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  The Sentrix team will review your application and reach out within 24–48 hours with your exclusive beta invite.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-tactical-gold font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {h.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured by Cloudflare</span>
          </div>
          <div className="w-1 h-1 bg-navy-700 rounded-full" />
          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>DMV businesses only</span>
          </div>
          <div className="w-1 h-1 bg-navy-700 rounded-full" />
          <div className="flex items-center gap-1.5 text-slate-600 text-xs">
            <Gift className="w-3.5 h-3.5" />
            <span>3 free dispatches</span>
          </div>
        </div>
      </div>
    </section>
  );
}