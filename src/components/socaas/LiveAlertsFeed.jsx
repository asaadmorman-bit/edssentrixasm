import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, XCircle, Info, Radio } from "lucide-react";

const INITIAL_ALERTS = [
  { id: 1, time: "10:58 AM", severity: "critical", msg: "Brute-force attempt blocked — 89.34.221.4 (RU) → SSH Port 22", device: "Server-MAIN" },
  { id: 2, time: "10:51 AM", severity: "blocked", msg: "Unauthorized login attempt blocked via Cloudflare WAF", device: "Web Gateway" },
  { id: 3, time: "10:44 AM", severity: "warning", msg: "Endpoint malware signature detected — quarantined", device: "HR-Workstation" },
  { id: 4, time: "10:38 AM", severity: "blocked", msg: "DNS exfiltration attempt blocked — Cloudflare 1.1.1.1 resolver", device: "Reception-PC" },
  { id: 5, time: "10:22 AM", severity: "info", msg: "Aikido Security Scan completed — 0 critical CVEs found", device: "CI Pipeline" },
  { id: 6, time: "10:15 AM", severity: "info", msg: "MFA authentication verified — user: j.doe@eds.com", device: "CFO-Laptop" },
  { id: 7, time: "09:58 AM", severity: "warning", msg: "Unusual outbound traffic spike detected — 4.2 GB/hr", device: "Server-MAIN" },
  { id: 8, time: "09:44 AM", severity: "blocked", msg: "SQLi injection attempt blocked in web form parameter", device: "Web App Firewall" },
  { id: 9, time: "09:31 AM", severity: "info", msg: "Certificate renewed — sentrix.eds.com — expires 2027-05-12", device: "Cloudflare SSL" },
  { id: 10, time: "09:02 AM", severity: "info", msg: "Vulnerability scan completed — 2 medium findings patched", device: "Dev-MacBook" },
];

const NEW_ALERTS = [
  { severity: "critical", msg: "Port scan detected from 185.220.101.0/24 (TOR exit node)", device: "Firewall" },
  { severity: "blocked", msg: "XSS payload blocked in contact form submission", device: "Web App Firewall" },
  { severity: "warning", msg: "Failed API authentication — 12 attempts in 60s", device: "API Gateway" },
  { severity: "info", msg: "Patch deployed successfully — kernel 6.8.9 → 6.8.11", device: "Server-MAIN" },
];

const severityConfig = {
  critical: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500", label: "CRITICAL" },
  blocked: { icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500", label: "BLOCKED" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/15", dot: "bg-amber-500", label: "WARN" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/5 border-blue-500/15", dot: "bg-blue-400", label: "INFO" },
};

export default function LiveAlertsFeed() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [counter, setCounter] = useState(11);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const template = NEW_ALERTS[Math.floor(Math.random() * NEW_ALERTS.length)];
      const newAlert = { ...template, id: counter + 1, time: timeStr };
      setAlerts(prev => [newAlert, ...prev.slice(0, 14)]);
      setCounter(c => c + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <Card className="shadow-sm border-border/60 h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          Live Alerts Feed
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">{alerts.length} events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 max-h-[340px]">
        <div className="space-y-0 divide-y divide-border/30">
          {alerts.map((alert) => {
            const cfg = severityConfig[alert.severity];
            const Icon = cfg.icon;
            return (
              <div key={alert.id} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${cfg.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border ${cfg.color} ${cfg.bg}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground ml-auto shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-foreground leading-snug">{alert.msg}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{alert.device}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}