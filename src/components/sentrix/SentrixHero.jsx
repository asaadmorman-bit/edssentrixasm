import React from "react";
import { ArrowRight, Play, Zap, Lock, Activity, TrendingUp } from "lucide-react";

const statItems = [
  { value: "3 min", label: "Avg. dispatch time" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "40+", label: "Compliance modules" },
];

const scoreRows = [
  { label: "Cyber", val: 82, color: "bg-blue-500" },
  { label: "Physical", val: 74, color: "bg-emerald-500" },
  { label: "Legal", val: 91, color: "bg-violet-500" },
];

export default function SentrixHero() {
  const scrollToWaitlist = () =>
    document.getElementById("sentrix-waitlist")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-8 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_40%,rgba(245,158,11,0.05),transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tactical-gold/30 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Copy */}
          <div>
            {/* Product badge */}
            <div className="inline-flex items-center gap-2 bg-tactical-gold/10 border border-tactical-gold/25 rounded-full px-4 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 bg-tactical-gold rounded-full animate-pulse" />
              <span className="text-tactical-gold text-xs font-bold uppercase tracking-widest">
                EDS Sentrix ASM · Attack Surface Management
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-black tracking-tight leading-[1.08] mb-6">
              <span className="text-white">Meet EDS Sentrix ASM.</span>
              <br />
              <span className="text-tactical-gold">Total Attack Surface</span>
              <br />
              <span className="text-white">Management.</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
              Cyber threats, workplace safety, and physical defense shouldn't require ten different vendors.
              EDS Sentrix ASM is the DMV's first unified platform built to manage your{" "}
              <span className="text-white font-medium">employee compliance, aerial surveillance, executive protection, and on-demand legal dispatch</span>{" "}
              in one secure dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={scrollToWaitlist}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-tactical-gold/20 active:scale-95"
              >
                Join the Beta Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-navy-800 border border-navy-700 hover:border-navy-600 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-200">
                <div className="w-6 h-6 bg-navy-700 group-hover:bg-navy-600 rounded-full flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 ml-0.5 fill-current" />
                </div>
                Watch the Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-navy-700/60">
              {statItems.map((s, i) => (
                <div key={i}>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-6 bg-tactical-gold/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative bg-navy-800 border border-navy-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 bg-navy-900/80 border-b border-navy-700/50">
                <div className="w-3 h-3 rounded-full bg-tactical-red/70" />
                <div className="w-3 h-3 rounded-full bg-tactical-gold/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="flex-1 mx-4 h-5 bg-navy-700/50 rounded-md flex items-center px-3">
                  <span className="text-[10px] text-slate-500">asm.emergingdefensesolutions.com/dashboard</span>
                </div>
                <Lock className="w-3 h-3 text-emerald-400" />
              </div>

              {/* Dashboard content */}
              <div className="flex h-72 sm:h-80">
                {/* Sidebar mock */}
                <div className="w-14 bg-navy-900 border-r border-navy-700/60 flex flex-col items-center pt-4 gap-3">
                  {[
                    { SideIcon: Activity, active: true },
                    { SideIcon: Lock, active: false },
                    { SideIcon: Zap, active: false },
                    { SideIcon: TrendingUp, active: false },
                  ].map(({ SideIcon, active }, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        active ? "bg-tactical-gold/20" : "bg-navy-800/60"
                      }`}
                    >
                      <SideIcon className={`w-4 h-4 ${active ? "text-tactical-gold" : "text-slate-600"}`} />
                    </div>
                  ))}
                </div>

                {/* Main panel */}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-navy-700 rounded w-32" />
                    <div className="h-3 bg-tactical-gold/30 rounded w-12" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white">84</span>
                    <span className="text-slate-500 text-sm mb-1">/100 Readiness Score</span>
                  </div>
                  <div className="space-y-2.5">
                    {scoreRows.map((b) => (
                      <div key={b.label} className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 w-12">{b.label}</span>
                        <div className="flex-1 h-1.5 bg-navy-700 rounded-full">
                          <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.val}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400 w-6 text-right">{b.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {["Training", "Dispatch", "Audits"].map((label, i) => (
                      <div key={label} className="bg-navy-700/50 rounded-lg p-2.5 border border-navy-600/40">
                        <div className={`h-1 w-8 rounded mb-2 ${["bg-tactical-gold", "bg-tactical-red", "bg-emerald-500"][i]}`} />
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="text-xs font-bold text-white mt-0.5">{["12/14", "3 Active", "2 Due"][i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-5 py-2.5 bg-navy-900/60 border-t border-navy-700/40 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-500">All systems operational · Last synced 2 min ago</span>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-tactical-gold text-navy-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-tactical-gold/25 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Real-time Monitoring
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}