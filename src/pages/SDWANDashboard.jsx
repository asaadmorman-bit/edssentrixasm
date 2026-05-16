import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wifi, Activity, Server, Cloud, Shield, RefreshCw, AlertTriangle,
  CheckCircle2, XCircle, ArrowRight, Zap, Clock, ExternalLink,
  TrendingUp, TrendingDown, Radio, Lock
} from "lucide-react";

// ─── Static topology config ───────────────────────────────────────────────────
const SITES = [
  {
    id: "s1", label: "Site 1 — Primary Hub", sub: "BIZON B200 · Washington DC",
    device: "Cisco Meraki MX105", role: "primary",
    color: "border-blue-500/40 bg-blue-500/5", dot: "bg-blue-400",
    badge: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "s2", label: "Site 2 — Warm DR", sub: "Northern Virginia · Tier-III Colo",
    device: "Cisco Meraki MX68", role: "warm_dr",
    color: "border-amber-500/40 bg-amber-500/5", dot: "bg-amber-400",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "s3", label: "Site 3 — GCP Cloud", sub: "us-east4 · Multi-zone",
    device: "Meraki vMX · Cloud Run", role: "cloud",
    color: "border-emerald-500/40 bg-emerald-500/5", dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

const TUNNELS_BASE = [
  { id: "t1", from: "s1", to: "s2", label: "S1 ↔ S2", type: "MX105 → MX68",    baseLat: 4,  jitter: 2,  bandwidth: "1 Gbps",   encrypt: "AES-256-GCM" },
  { id: "t2", from: "s1", to: "s3", label: "S1 ↔ S3", type: "MX105 → vMX",     baseLat: 18, jitter: 5,  bandwidth: "2.5 Gbps",  encrypt: "AES-256-GCM" },
  { id: "t3", from: "s2", to: "s3", label: "S2 ↔ S3", type: "MX68 → vMX",      baseLat: 21, jitter: 4,  bandwidth: "1 Gbps",   encrypt: "AES-256-GCM" },
];

const FAILOVER_STEPS = [
  { step: "1", label: "Heartbeat Lost",    desc: "Site 1 heartbeat timeout — MX105 unreachable",            trigger: "< 500ms" },
  { step: "2", label: "SD-WAN Reroute",    desc: "Traffic auto-rerouted via Meraki Auto-VPN to Site 2",     trigger: "< 2s"    },
  { step: "3", label: "GCP Failover Init", desc: "Container failover instances warm-start in us-east4",     trigger: "< 30s"   },
  { step: "4", label: "Thyreos Alert",     desc: "SOAR fires automated incident + notifies EDS ops team",   trigger: "< 42s"   },
  { step: "5", label: "BCR Confirmed",     desc: "Business continuity restored — full GCP + Site 2 active", trigger: "< 90s"   },
];

// ─── Latency Sparkline ────────────────────────────────────────────────────────
function Sparkline({ history, color = "#34d399" }) {
  if (!history || history.length < 2) return null;
  const w = 80, h = 24;
  const min = Math.min(...history);
  const max = Math.max(...history) || 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * (h - 2) - 1;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Tunnel Card ─────────────────────────────────────────────────────────────
function TunnelCard({ tunnel, simulating, simFailedTunnel }) {
  const [latHistory, setLatHistory] = useState(() => Array.from({ length: 12 }, () => tunnel.baseLat + Math.random() * tunnel.jitter));
  const [currentLat, setCurrentLat] = useState(tunnel.baseLat);
  const [pkgLoss, setPkgLoss] = useState(0);

  const isFailed = simulating && simFailedTunnel === tunnel.id;
  const isDegraded = simulating && simFailedTunnel !== tunnel.id && tunnel.from === "s1";

  useEffect(() => {
    const iv = setInterval(() => {
      const lat = isFailed ? 0 : Math.round(tunnel.baseLat + (Math.random() - 0.3) * tunnel.jitter);
      setCurrentLat(lat);
      setPkgLoss(isFailed ? 100 : isDegraded ? Math.round(Math.random() * 8) : 0);
      setLatHistory(prev => [...prev.slice(-11), lat]);
    }, 1200);
    return () => clearInterval(iv);
  }, [isFailed, isDegraded, tunnel]);

  const status = isFailed ? "DOWN" : isDegraded ? "DEGRADED" : "ACTIVE";
  const statusStyle = {
    DOWN:     "text-red-400 bg-red-500/10 border-red-500/20",
    DEGRADED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    ACTIVE:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  }[status];
  const dotColor = { DOWN: "bg-red-400", DEGRADED: "bg-amber-400 animate-pulse", ACTIVE: "bg-emerald-400 animate-pulse" }[status];
  const sparkColor = { DOWN: "#f87171", DEGRADED: "#fbbf24", ACTIVE: "#34d399" }[status];
  const fromSite = SITES.find(s => s.id === tunnel.from);
  const toSite   = SITES.find(s => s.id === tunnel.to);

  return (
    <Card className={`border shadow-sm transition-all duration-500 ${isFailed ? "border-red-500/40 bg-red-500/5" : isDegraded ? "border-amber-500/40 bg-amber-500/5" : "border-border/60"}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
            <span className="text-sm font-bold text-foreground">{tunnel.label}</span>
          </div>
          <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded border ${statusStyle}`}>{status}</span>
        </div>

        <p className="text-[10px] text-muted-foreground font-mono mb-1">{tunnel.type}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-3">
          <span className="truncate">{fromSite?.label.split("—")[0].trim()}</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
          <span className="truncate">{toSite?.label.split("—")[0].trim()}</span>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16">Latency</span>
              <span className={`text-sm font-black ${isFailed ? "text-red-400" : "text-foreground"}`}>
                {isFailed ? "—" : `${currentLat}ms`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16">Pkt Loss</span>
              <span className={`text-sm font-black ${pkgLoss > 0 ? "text-red-400" : "text-emerald-400"}`}>{isFailed ? "100%" : `${pkgLoss}%`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16">BW</span>
              <span className="text-xs font-semibold text-muted-foreground">{tunnel.bandwidth}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Lock className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[9px] font-mono text-muted-foreground">{tunnel.encrypt}</span>
            </div>
          </div>
          <Sparkline history={latHistory} color={sparkColor} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Site Status Card ─────────────────────────────────────────────────────────
function SiteCard({ site, simulating, failedSite }) {
  const isFailed = simulating && failedSite === site.id;
  const status = isFailed ? "OFFLINE" : site.role === "warm_dr" && simulating ? "ACTIVE (FAILOVER)" : site.role === "primary" ? "LIVE" : site.role === "warm_dr" ? "SYNC" : "STANDBY";
  const statusStyle = isFailed
    ? "text-red-400 bg-red-500/10 border-red-500/20"
    : simulating && site.role === "warm_dr"
    ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    : `${site.badge}`;

  return (
    <Card className={`border shadow-sm transition-all duration-500 ${isFailed ? "border-red-500/40 bg-red-500/5" : site.color}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isFailed ? "bg-red-400" : site.dot} ${!isFailed && "animate-pulse"}`} />
          <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded border ${statusStyle}`}>{status}</span>
        </div>
        <p className="text-sm font-bold text-foreground leading-snug">{site.label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{site.sub}</p>
        <p className="text-[10px] font-mono text-muted-foreground/70 mt-1">{site.device}</p>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SDWANDashboard() {
  const [tick, setTick] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(-1);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const simRef = useRef(null);

  // Live tick every 1.5s
  useEffect(() => {
    const iv = setInterval(() => setTick(n => n + 1), 1500);
    return () => clearInterval(iv);
  }, []);

  const runSim = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep(0);
    let s = 0;
    simRef.current = setInterval(() => {
      s++;
      setSimStep(s);
      if (s >= FAILOVER_STEPS.length) {
        clearInterval(simRef.current);
        setTimeout(() => { setSimulating(false); setSimStep(-1); }, 3000);
      }
    }, 900);
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    setTick(n => n + 1);
  };

  // During simulation, Site 1 primary tunnel (t1 from s1→s2) is the "failed" one
  const simFailedTunnel = simulating ? "t1" : null;
  const simFailedSite   = simulating ? "s1" : null;

  const allActive = !simulating;
  const tunnelUpCount = simulating ? 2 : 3;
  const overallHealth = simulating ? "DEGRADED" : "OPERATIONAL";
  const healthStyle = simulating
    ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
    : "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Wifi className="w-6 h-6 text-cyan-400" />
            SD-WAN Health & Failover Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time HA status across all SD-WAN tunnels and enclave sites · Triple-Enclave topology
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
            <Clock className="w-3 h-3" />
            Updated {lastRefresh.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-muted border border-border/60 rounded-lg hover:bg-muted/80 transition-all">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* Global status bar */}
      <div className={`flex flex-wrap items-center gap-4 px-5 py-3.5 rounded-xl border ${healthStyle} transition-all duration-500`}>
        <div className="flex items-center gap-2">
          {simulating
            ? <AlertTriangle className="w-5 h-5 text-amber-400" />
            : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span className="font-black text-sm">{overallHealth}</span>
        </div>
        <div className="h-4 w-px bg-current opacity-20" />
        <span className="text-xs font-semibold">{tunnelUpCount}/3 Tunnels Active</span>
        <div className="h-4 w-px bg-current opacity-20" />
        <span className="text-xs font-semibold">{simulating ? "1 Site Unreachable" : "All Sites Reachable"}</span>
        <div className="h-4 w-px bg-current opacity-20" />
        <span className="text-xs font-semibold">AES-256-GCM · Zero Trust IAP</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] font-mono">LIVE TELEMETRY</span>
        </div>
      </div>

      {/* Sites grid */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Enclave Sites</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SITES.map(site => (
            <SiteCard key={site.id} site={site} simulating={simulating} failedSite={simFailedSite} />
          ))}
        </div>
      </div>

      {/* Tunnel cards */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">SD-WAN Tunnel Health</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TUNNELS_BASE.map(tunnel => (
            <TunnelCard key={tunnel.id} tunnel={tunnel} simulating={simulating} simFailedTunnel={simFailedTunnel} />
          ))}
        </div>
      </div>

      {/* Bottom — Failover sim + metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Failover Simulator */}
        <div className="lg:col-span-3">
          <Card className={`shadow-sm border-border/60 transition-colors duration-500 ${simulating ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  BCR Failover Simulator
                </CardTitle>
                <button
                  onClick={runSim}
                  disabled={simulating}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${simulating ? "animate-spin" : ""}`} />
                  {simulating ? "Simulating…" : "Run Failover Sim"}
                </button>
              </div>
              {simulating && (
                <p className="text-xs text-amber-400 font-semibold mt-1 animate-pulse">
                  ⚠ Site 1 PRIMARY DOWN — Failover in progress across SD-WAN fabric…
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {FAILOVER_STEPS.map((fs, i) => {
                const done    = simStep >= i + 1;
                const active  = simStep === i;
                const pending = simStep < i;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-400 ${
                    done    ? "bg-emerald-500/10 border-emerald-500/25" :
                    active  ? "bg-amber-500/10 border-amber-500/25 animate-pulse" :
                              "bg-muted/20 border-border/30 opacity-40"
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                      done   ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                      active ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                               "bg-muted border-border text-muted-foreground"
                    }`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : fs.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-foreground">{fs.label}</p>
                        <span className="text-[9px] font-mono text-muted-foreground border border-border/50 rounded px-1 py-0.5">{fs.trigger}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{fs.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* HA Metrics panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                HA Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "30-Day Uptime",       value: "99.97%",   icon: TrendingUp,   color: "text-emerald-400" },
                { label: "Avg Failover Time",    value: "< 90s",    icon: Clock,        color: "text-cyan-400" },
                { label: "SD-WAN Tunnels (Total)", value: "3 / 3",  icon: Wifi,         color: "text-blue-400" },
                { label: "Encrypted Sessions",   value: "AES-256",  icon: Lock,         color: "text-violet-400" },
                { label: "SOAR Auto-Response",   value: "ACTIVE",   icon: Zap,          color: "text-tactical-gold" },
                { label: "BCR RTO Target",       value: "90s",      icon: Shield,       color: "text-emerald-400" },
                { label: "BCR RPO Target",       value: "< 15min",  icon: Server,       color: "text-blue-400" },
                { label: "Zero Trust IAP",       value: "ENFORCED", icon: CheckCircle2, color: "text-teal-400" },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                    </div>
                    <span className={`text-xs font-black ${m.color}`}>{m.value}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <a
            href="https://thyreos.eds-360.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all"
          >
            <Radio className="w-4 h-4" />
            Open Thyreos C2 — Live SD-WAN Console
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}