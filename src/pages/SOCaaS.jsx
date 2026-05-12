import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Wifi, Monitor, Server, Globe, ZapOff, ShieldAlert, Radio, CheckCircle2, XCircle, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ThreatMap from "../components/socaas/ThreatMap";
import LiveAlertsFeed from "../components/socaas/LiveAlertsFeed";

const stats = [
  { label: "Threats Blocked (24h)", value: "1,247", delta: "+18%", icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Active Endpoints", value: "34", delta: "All Online", icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Open Incidents", value: "2", delta: "P1 · P3", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { label: "Uptime (30d)", value: "99.97%", delta: "SLA Met", icon: Activity, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
];

const endpointStatus = [
  { name: "Reception-PC", status: "clean", ip: "10.0.1.4", os: "Windows 11" },
  { name: "CFO-Laptop", status: "clean", ip: "10.0.1.9", os: "macOS 14" },
  { name: "Server-MAIN", status: "warning", ip: "10.0.1.1", os: "Ubuntu 22.04" },
  { name: "Conference-AV", status: "clean", ip: "10.0.1.15", os: "Android 14" },
  { name: "HR-Workstation", status: "isolated", ip: "10.0.1.22", os: "Windows 11" },
  { name: "Dev-MacBook", status: "clean", ip: "10.0.1.31", os: "macOS 14" },
];

export default function SOCaaS() {
  const [escalating, setEscalating] = useState(false);

  const handleEscalate = () => {
    setEscalating(true);
    toast.success("🚨 EDS Incident Response Team notified. ETA: < 4 minutes.", { duration: 5000 });
    setTimeout(() => setEscalating(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Monitoring Active</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">SOCaaS / MSSP Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">24/7 managed security operations — EDS Sentrix ASM threat intelligence layer</p>
        </div>
        <Button
          onClick={handleEscalate}
          disabled={escalating}
          className="bg-tactical-red hover:bg-red-700 text-white font-bold px-5 py-2.5 h-auto text-sm shadow-lg shadow-red-900/30 transition-all"
        >
          <ShieldAlert className="w-4 h-4 mr-2" />
          {escalating ? "Escalating…" : "Escalate to EDS Incident Response Team"}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className={`border ${s.bg} shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s.delta}</span>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Threat Map + Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ThreatMap />
        </div>
        <div className="lg:col-span-2">
          <LiveAlertsFeed />
        </div>
      </div>

      {/* Endpoint Status */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              Managed Endpoint Status
            </CardTitle>
            <span className="text-xs text-muted-foreground">{endpointStatus.filter(e => e.status === "clean").length}/{endpointStatus.length} Clean</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {endpointStatus.map((ep, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                ${ep.status === "clean" ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" :
                  ep.status === "warning" ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10" :
                  "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                  ${ep.status === "clean" ? "bg-emerald-500/10" : ep.status === "warning" ? "bg-amber-500/10" : "bg-red-500/10"}`}>
                  {ep.status === "clean" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                   ep.status === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                   <ZapOff className="w-4 h-4 text-red-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{ep.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{ep.ip} · {ep.os}</p>
                </div>
                <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0
                  ${ep.status === "clean" ? "bg-emerald-500/20 text-emerald-400" :
                    ep.status === "warning" ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"}`}>
                  {ep.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cloudflare / WAF Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Cloudflare WAF", status: "ACTIVE", icon: Globe, color: "text-emerald-400", sub: "2,841 requests filtered today" },
          { label: "VPN Tunnel", status: "CONNECTED", icon: Wifi, color: "text-blue-400", sub: "AES-256 · Zero Trust tunnel" },
          { label: "SIEM Ingestion", status: "LIVE", icon: Server, color: "text-violet-400", sub: "14,200 events/min ingested" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card shadow-sm">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded ${item.color} bg-current/10`} style={{ background: "transparent", border: "1px solid currentColor", opacity: 1 }}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}