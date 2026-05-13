import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield, KeyRound, Server, GitBranch, FileText, Zap, BarChart2, ShieldCheck,
  CheckCircle2, AlertTriangle, Clock, Building2, ChevronRight, ArrowLeft,
  Bell, CalendarDays, Activity, Scissors, UserCheck, Play, RefreshCw,
  TrendingUp, AlertCircle, XCircle, Lock, Globe, Database
} from "lucide-react";

/* ─── Demo Scenarios ─────────────────────────────────────────────── */
const scenarios = [
  { id: "law_firm",         label: "Law Firm",           icon: FileText,   color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "property_mgmt",   label: "Property Mgmt",      icon: Building2,  color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
  { id: "medical_clinic",  label: "Medical Clinic",      icon: ShieldCheck,color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
  { id: "corporate",       label: "Corporate",           icon: Globe,      color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
];

/* ─── Per-Scenario Data ──────────────────────────────────────────── */
const demoData = {
  law_firm: {
    orgName: "Acme Law LLP",
    plan: "Professional",
    readiness: 91,
    stats: [
      { label: "Active Licenses", value: "4", color: "text-emerald-400", icon: KeyRound },
      { label: "Open Dispatches", value: "3", color: "text-blue-400",    icon: FileText },
      { label: "Compliance Score", value: "96%", color: "text-amber-400", icon: ShieldCheck },
      { label: "Infra Assets",    value: "12", color: "text-violet-400", icon: Server },
    ],
    licenses: [
      { name: "Sentrix ASM",     seats: "8/10", days: 91,  status: "active" },
      { name: "Compliance LMS",  seats: "8/8",  days: 12,  status: "warning" },
      { name: "Dispatch Module", seats: "3/5",  days: 180, status: "active" },
      { name: "EP Module",       seats: "1/2",  days: 44,  status: "active" },
    ],
    assets: [
      { name: "DC-FW-01",  type: "Firewall", provider: "Azure",   status: "healthy" },
      { name: "PROD-DB-01",type: "Database", provider: "AWS",     status: "warning" },
      { name: "VPN-GATE",  type: "VPN",      provider: "On Prem", status: "healthy" },
      { name: "MAIL-SRV",  type: "Server",   provider: "Azure",   status: "critical" },
    ],
    auditFeed: [
      { time: "10:42 AM", msg: "P. Moore viewed PII — Case #DC-2026-44218", dot: "bg-orange-400" },
      { time: "10:15 AM", msg: "Aikido Scan PASSED — 0 critical CVEs detected", dot: "bg-emerald-400" },
      { time: "09:58 AM", msg: "Mobile Notary Dispatched — Case #D-2894 en route", dot: "bg-blue-400" },
      { time: "09:31 AM", msg: "J. Williams — MFA login verified from DC office", dot: "bg-emerald-400" },
      { time: "08:45 AM", msg: "3× failed login from 45.33.91.2 — IP BLOCKED", dot: "bg-red-500" },
    ],
    insights: [
      "Compliance LMS license expires in 12 days — renew now to avoid disruption.",
      "MAIL-SRV shows critical status — last patched 47 days ago.",
      "Notary dispatches up 22% this month vs. last month.",
    ],
  },
  property_mgmt: {
    orgName: "Capitol Property Mgmt",
    plan: "Enterprise",
    readiness: 84,
    stats: [
      { label: "Active Licenses", value: "3",   color: "text-emerald-400", icon: KeyRound },
      { label: "CPTED Audits",    value: "7",   color: "text-emerald-400", icon: Scissors },
      { label: "Compliance Score","value": "88%", color: "text-amber-400", icon: ShieldCheck },
      { label: "Infra Assets",    value: "8",   color: "text-violet-400",  icon: Server },
    ],
    licenses: [
      { name: "Sentrix ASM",    seats: "15/20", days: 60,  status: "active" },
      { name: "Dispatch Module",seats: "5/5",   days: 8,   status: "warning" },
      { name: "Aerial Ops",     seats: "2/3",   days: 120, status: "active" },
    ],
    assets: [
      { name: "CAM-CLUSTER-01", type: "Server",   provider: "Azure",     status: "healthy" },
      { name: "ACCESS-CTRL-02", type: "Endpoint", provider: "On Prem",   status: "warning" },
      { name: "DRONE-BASE-01",  type: "Other",    provider: "On Prem",   status: "healthy" },
      { name: "NVR-STORAGE",    type: "Database", provider: "On Prem",   status: "critical" },
    ],
    auditFeed: [
      { time: "11:02 AM", msg: "CPTED Audit scheduled — 1400 K St NW, Washington DC", dot: "bg-emerald-400" },
      { time: "10:30 AM", msg: "Aerial drone deployed — Property inspection #P-0091", dot: "bg-violet-400" },
      { time: "09:55 AM", msg: "NVR-STORAGE disk at 94% capacity — alert triggered",  dot: "bg-red-500" },
      { time: "09:20 AM", msg: "Lease compliance report generated for Q2 2026",       dot: "bg-amber-400" },
      { time: "08:50 AM", msg: "T. Robinson updated access permissions — Suite 302",  dot: "bg-blue-400" },
    ],
    insights: [
      "Dispatch Module at seat capacity — consider upgrading to avoid bottlenecks.",
      "NVR-STORAGE critically low on disk — immediate action required.",
      "3 properties due for CPTED re-audit in the next 30 days.",
    ],
  },
  medical_clinic: {
    orgName: "MedCare DC Clinic",
    plan: "Professional",
    readiness: 78,
    stats: [
      { label: "Active Licenses", value: "3",   color: "text-emerald-400", icon: KeyRound },
      { label: "HIPAA Score",     value: "94%", color: "text-rose-400",    icon: ShieldCheck },
      { label: "Compliance Score","value": "79%", color: "text-amber-400", icon: Activity },
      { label: "Infra Assets",    value: "6",   color: "text-violet-400",  icon: Server },
    ],
    licenses: [
      { name: "Compliance LMS", seats: "12/15", days: 55,  status: "active" },
      { name: "Sentrix ASM",    seats: "5/5",   days: 20,  status: "warning" },
      { name: "SOCaaS",         seats: "2/2",   days: 180, status: "active" },
    ],
    assets: [
      { name: "EHR-SERVER-01",  type: "Server",    provider: "Azure",   status: "healthy" },
      { name: "PHI-DB-PROD",    type: "Database",  provider: "AWS",     status: "warning" },
      { name: "WIFI-AP-CLINIC", type: "Router",    provider: "On Prem", status: "healthy" },
      { name: "BACKUP-VAULT",   type: "Other",     provider: "Azure",   status: "healthy" },
    ],
    auditFeed: [
      { time: "11:15 AM", msg: "HIPAA training module completed — Dr. A. Patel (SOC-2)", dot: "bg-emerald-400" },
      { time: "10:44 AM", msg: "PHI-DB-PROD flagged — unencrypted field detected",       dot: "bg-red-500" },
      { time: "10:10 AM", msg: "SOCaaS threat intel update — 0 active IOCs in range",    dot: "bg-emerald-400" },
      { time: "09:38 AM", msg: "Sentrix ASM license at seat capacity — admin notified",  dot: "bg-amber-400" },
      { time: "08:55 AM", msg: "Q2 compliance report scheduled for board review",        dot: "bg-blue-400" },
    ],
    insights: [
      "PHI-DB-PROD has an unencrypted field — HIPAA violation risk, patch immediately.",
      "Sentrix ASM license is at seat capacity — upgrade or remove inactive users.",
      "Compliance LMS completion rate at 68% — send reminder to staff.",
    ],
  },
  corporate: {
    orgName: "SecureGov LLC",
    plan: "Enterprise",
    readiness: 95,
    stats: [
      { label: "Active Licenses", value: "6",   color: "text-emerald-400", icon: KeyRound },
      { label: "EP Details",      value: "2",   color: "text-amber-400",   icon: UserCheck },
      { label: "Compliance Score","value": "98%", color: "text-emerald-400",icon: ShieldCheck },
      { label: "Infra Assets",    value: "22",  color: "text-violet-400",  icon: Server },
    ],
    licenses: [
      { name: "Sentrix ASM",     seats: "40/50", days: 210, status: "active" },
      { name: "EP Module",       seats: "4/5",   days: 150, status: "active" },
      { name: "SOCaaS",          seats: "10/10", days: 45,  status: "warning" },
      { name: "Compliance LMS",  seats: "38/50", days: 210, status: "active" },
      { name: "Dispatch Module", seats: "6/10",  days: 210, status: "active" },
    ],
    assets: [
      { name: "CORP-FW-PROD",   type: "Firewall", provider: "Cloudflare", status: "healthy" },
      { name: "CORP-DB-01",     type: "Database", provider: "AWS",        status: "healthy" },
      { name: "VPN-CLUSTER",    type: "VPN",      provider: "Azure",      status: "healthy" },
      { name: "EDGE-ROUTER-01", type: "Router",   provider: "On Prem",    status: "warning" },
    ],
    auditFeed: [
      { time: "11:30 AM", msg: "EP Detail #E-0042 confirmed — Executive escort briefed",  dot: "bg-amber-400" },
      { time: "11:00 AM", msg: "SOCaaS alert: lateral movement detected — contained",     dot: "bg-red-500" },
      { time: "10:22 AM", msg: "Zero Trust policy audit — 100% endpoints compliant",      dot: "bg-emerald-400" },
      { time: "09:45 AM", msg: "CORP-FW-PROD updated — 3 new threat signatures pushed",   dot: "bg-blue-400" },
      { time: "09:10 AM", msg: "Insurance premium reduction report emailed to CFO",       dot: "bg-tactical-gold" },
    ],
    insights: [
      "SOCaaS license at seat capacity — review in 45 days.",
      "EDGE-ROUTER-01 last patched 31 days ago — schedule maintenance window.",
      "Zero Trust compliance at 100% — eligible for insurance premium reduction.",
    ],
  },
};

/* ─── Helpers ───────────────────────────────────────────────────── */
const statusColor = { healthy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", warning: "text-amber-400 bg-amber-500/10 border-amber-500/20", critical: "text-red-400 bg-red-500/10 border-red-500/20", active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
const statusIcon  = { healthy: CheckCircle2, warning: AlertTriangle, critical: AlertCircle, active: CheckCircle2 };

function ReadinessRing({ score }) {
  const r = 38, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "#34d399" : score >= 75 ? "#fbbf24" : "#f87171";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} stroke="rgba(148,163,184,0.1)" strokeWidth="8" fill="none" />
        <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-black" style={{ color }}>{score}</div>
        <div className="text-[9px] text-slate-500 font-bold uppercase">Score</div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function Demo() {
  const [active, setActive] = useState("law_firm");
  const [tab, setTab] = useState("overview");
  const [feedIndex, setFeedIndex] = useState(0);
  const data = demoData[active];

  // Simulate live feed ticking
  useEffect(() => {
    const t = setInterval(() => setFeedIndex(i => (i + 1) % data.auditFeed.length), 4000);
    return () => clearInterval(t);
  }, [active, data.auditFeed.length]);

  const tabs = ["overview", "licenses", "infrastructure", "audit & insights"];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Live Demo Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs hidden sm:block">Switch scenario:</span>
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setTab("overview"); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${active === s.id ? s.bg + " " + s.color : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}
              >
                <s.icon className="w-3 h-3" />
                <span className="hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
          <Link to="/app" className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all active:scale-95">
            Get Started <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Org Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${scenarios.find(s=>s.id===active)?.bg} ${scenarios.find(s=>s.id===active)?.color}`}>
                {scenarios.find(s=>s.id===active)?.label}
              </span>
              <span className="text-[10px] text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">{data.plan} Plan</span>
            </div>
            <h1 className="text-2xl font-black text-white">{data.orgName}</h1>
            <p className="text-sm text-slate-500 mt-0.5">EDS Sentrix ASM · Command Center Demo</p>
          </div>
          <div className="flex items-center gap-4">
            <ReadinessRing score={data.readiness} />
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Readiness Score</p>
              <p className="text-sm text-slate-300 mt-0.5">
                {data.readiness >= 90 ? "Excellent posture" : data.readiness >= 75 ? "Good — minor gaps" : "Needs attention"}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {["NIST 800-53","SOC-2","Zero Trust"].map(b => (
                  <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-slate-800">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-bold capitalize border-b-2 -mb-px transition-colors ${tab === t ? "border-amber-400 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.stats.map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{s.label}</p>
                  </div>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Live Feed Preview + Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Live Audit */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <h3 className="text-sm font-bold text-white">Live Audit Feed</h3>
                  <span className="text-[10px] text-slate-600 ml-auto font-mono">Simulated · Real-time</span>
                </div>
                <div className="space-y-1.5">
                  {data.auditFeed.map((e, i) => (
                    <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${i === feedIndex ? "bg-slate-800/80 scale-[1.01]" : "opacity-60"}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.dot}`} />
                      <span className="text-[10px] font-mono text-slate-500 shrink-0 w-16">{e.time}</span>
                      <span className="text-xs text-slate-300">{e.msg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">AI Compliance Insights</h3>
                </div>
                <div className="space-y-3">
                  {data.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Powered by EDS Compliance Agent</span>
                  <button onClick={() => setTab("audit & insights")} className="text-xs text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1">
                    Full Report <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LICENSES TAB ── */}
        {tab === "licenses" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              {[
                { label: "Total Licenses", value: data.licenses.length, color: "text-white" },
                { label: "Active", value: data.licenses.filter(l=>l.status==="active").length, color: "text-emerald-400" },
                { label: "Expiring < 30d", value: data.licenses.filter(l=>l.days<30).length, color: "text-amber-400" },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/30">
                    {["Module","Seats","Expires","Status","Action"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.licenses.map((lic, i) => {
                    const sc = lic.status === "warning" || lic.days < 30 ? "warning" : lic.status;
                    const SIcon = statusIcon[sc] || CheckCircle2;
                    return (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-white flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />{lic.name}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">{lic.seats}</td>
                        <td className={`px-4 py-3.5 font-bold text-sm ${lic.days < 30 ? "text-amber-400" : "text-emerald-400"}`}>
                          {lic.days}d left
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusColor[sc]}`}>
                            <SIcon className="w-3 h-3" />{sc.charAt(0).toUpperCase()+sc.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-lg transition-all">
                            <RefreshCw className="w-3 h-3" /> Renew
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── INFRASTRUCTURE TAB ── */}
        {tab === "infrastructure" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
              {[
                { label: "Total Assets", value: data.assets.length, color: "text-white" },
                { label: "Healthy",      value: data.assets.filter(a=>a.status==="healthy").length, color: "text-emerald-400" },
                { label: "Warning",      value: data.assets.filter(a=>a.status==="warning").length, color: "text-amber-400" },
                { label: "Critical",     value: data.assets.filter(a=>a.status==="critical").length, color: "text-red-400" },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {data.assets.filter(a=>a.status!=="healthy").length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-semibold">
                  {data.assets.filter(a=>a.status!=="healthy").length} asset(s) require attention
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.assets.map((asset, i) => {
                const SIcon = statusIcon[asset.status] || CheckCircle2;
                const sc = statusColor[asset.status] || statusColor.healthy;
                return (
                  <div key={i} className={`bg-slate-900 border rounded-xl p-4 ${asset.status === "critical" ? "border-red-500/30" : asset.status === "warning" ? "border-amber-500/30" : "border-slate-800"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                          <Database className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{asset.name}</p>
                          <p className="text-xs text-slate-500">{asset.type} · {asset.provider}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0 ${sc}`}>
                        <SIcon className="w-3 h-3" />{asset.status.charAt(0).toUpperCase()+asset.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── AUDIT & INSIGHTS TAB ── */}
        {tab === "audit & insights" && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h3 className="text-sm font-bold text-white">Full Audit Log</h3>
                <span className="ml-auto text-[10px] text-slate-600 font-mono">Simulated data</span>
              </div>
              <div className="space-y-1">
                {data.auditFeed.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/40 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.dot}`} />
                    <span className="text-[11px] font-mono text-slate-500 shrink-0 w-16">{e.time}</span>
                    <span className="text-xs text-slate-300">{e.msg}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">AI Compliance Insights</h3>
                <span className="ml-1 text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-bold">EDS Agent</span>
              </div>
              <div className="space-y-3">
                {data.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                    <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-black text-amber-400">{i+1}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Ready to deploy EDS Sentrix ASM for your organization?</p>
            <p className="text-slate-400 text-sm mt-1">Apply for beta access — first 3 dispatches free for DMV-area businesses.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/#waitlist" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all">
              Learn More
            </Link>
            <Link to="/app" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2">
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}