import React, { useState } from "react";
import ReadinessScore from "../components/dashboard/ReadinessScore";
import StatsRow from "../components/dashboard/StatsRow";
import TrustBanner from "../components/dashboard/TrustBanner";
import DemoVideoModal from "../components/dashboard/DemoVideoModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Bell, FileText, Scissors, Activity, ShieldCheck, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";

const auditFeed = [
  { time: "10:42 AM", msg: "P. Moore viewed PII — Case #DC-2026-44218", dot: "bg-orange-400" },
  { time: "10:15 AM", msg: "Aikido Security Scan — PASSED (0 critical CVEs)", dot: "bg-emerald-400" },
  { time: "09:58 AM", msg: "R. Singh dispatched Mobile Notary — Dispatch #D-2894", dot: "bg-blue-400" },
  { time: "09:31 AM", msg: "A. Williams — MFA Login verified", dot: "bg-emerald-400" },
  { time: "09:02 AM", msg: "J. Doe exported Compliance Report (SOC 2)", dot: "bg-tactical-gold" },
  { time: "08:45 AM", msg: "Failed login attempt (x3) from 45.33.91.2 — BLOCKED", dot: "bg-red-500" },
];

const quickDispatch = [
  { label: "Book Mobile\nNotary", icon: FileText, color: "bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/20", desc: "Legal" },
  { label: "Request\nCPTED Audit", icon: Scissors, color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20", desc: "Property" },
  { label: "Deploy\nDrone", icon: Activity, color: "bg-violet-500/10 border-violet-500/25 text-violet-400 hover:bg-violet-500/20", desc: "Aerial Ops" },
  { label: "Executive\nProtection", icon: ShieldCheck, color: "bg-tactical-gold/10 border-tactical-gold/25 text-tactical-gold hover:bg-tactical-gold/20", desc: "Security" },
];

export default function Dashboard() {
  const [dispatchClicked, setDispatchClicked] = useState(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleDispatch = (label) => {
    setDispatchClicked(label);
    toast.success(`${label.replace(/\n/g, " ")} — Request initiated. Routing to Dispatch Center.`);
    setTimeout(() => setDispatchClicked(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <DemoVideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, John. Here's your EDS Sentrix ASM operational overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400" />
            Watch Platform Demo
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>May 11, 2026</span>
          </div>
          <div className="relative w-9 h-9 bg-muted/50 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-tactical-red rounded-full flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Compliance Badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "NIST SP 800-53 Aligned", color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
          { label: "SOC-2 Type II Compliant", color: "bg-blue-500/10 border-blue-500/25 text-blue-400" },
          { label: "Generates Insurance Premium Reduction Reports", color: "bg-tactical-gold/10 border-tactical-gold/25 text-tactical-gold" },
          { label: "Zero Trust Architecture", color: "bg-violet-500/10 border-violet-500/25 text-violet-400" },
        ].map((b, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${b.color}`}>
            <CheckCircle2 className="w-3 h-3" />
            {b.label}
          </div>
        ))}
      </div>

      {/* Readiness Score */}
      <ReadinessScore />

      {/* Stats */}
      <StatsRow />

      {/* Quick Dispatch */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Quick Dispatch</CardTitle>
            <span className="text-xs text-muted-foreground">Click to initiate a service request</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickDispatch.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleDispatch(btn.label)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-150 active:scale-95 ${btn.color}`}
              >
                <btn.icon className="w-7 h-7" />
                <span className="text-xs font-bold text-center leading-tight whitespace-pre-line">{btn.label}</span>
                <span className="text-[10px] opacity-60">{btn.desc}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Audit Feed + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border/60 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Live Audit Feed
                </CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">Today · May 11, 2026</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {auditFeed.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${entry.dot}`} />
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0 w-16">{entry.time}</span>
                  <span className="text-xs text-foreground">{entry.msg}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Quarterly Compliance Review", date: "May 15, 2026", type: "Compliance" },
                { title: "First Aid Recertification", date: "May 22, 2026", type: "Training" },
                { title: "Network Security Audit", date: "Jun 1, 2026", type: "Cyber" },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-primary/5 rounded-lg flex flex-col items-center justify-center shrink-0 border border-border/60">
                    <span className="text-[9px] font-bold text-muted-foreground">{event.date.split(" ")[0].toUpperCase()}</span>
                    <span className="text-sm font-black text-foreground">{event.date.split(" ")[1].replace(/,/g, "")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <TrustBanner />
    </div>
  );
}