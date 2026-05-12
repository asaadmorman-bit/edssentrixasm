import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Building2, KeyRound, Server, GitBranch, TrendingUp, AlertTriangle } from "lucide-react";
import LicenseSeatChart from "./LicenseSeatChart";
import { differenceInDays, parseISO } from "date-fns";

export default function AdminDashboardOverview() {
  const { data: orgs = [] } = useQuery({ queryKey: ["orgs"], queryFn: () => base44.entities.Organization.list("-created_date", 100) });
  const { data: licenses = [] } = useQuery({ queryKey: ["licenses"], queryFn: () => base44.entities.License.list("-created_date", 200) });
  const { data: assets = [] } = useQuery({ queryKey: ["infra"], queryFn: () => base44.entities.InfraAsset.list("-created_date", 200) });
  const { data: projects = [] } = useQuery({ queryKey: ["sdlc"], queryFn: () => base44.entities.SDLCProject.list("-created_date", 100) });

  const totalMRR = orgs.reduce((s, o) => s + (o.monthly_revenue || 0), 0);
  const activeOrgs = orgs.filter(o => o.status === "active").length;
  const trialOrgs = orgs.filter(o => o.status === "trial").length;
  const activeLicenses = licenses.filter(l => l.status === "active").length;
  const expiringSoon = licenses.filter(l => l.valid_until && differenceInDays(parseISO(l.valid_until), new Date()) < 30 && l.status === "active").length;
  const infraIssues = assets.filter(a => a.status === "warning" || a.status === "critical").length;
  const activeProjects = projects.filter(p => p.status !== "completed").length;
  const blockedProjects = projects.filter(p => p.status === "blocked").length;

  const kpis = [
    { label: "Total MRR", value: `$${totalMRR.toLocaleString()}`, sub: `${activeOrgs} active orgs`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Organizations", value: orgs.length, sub: `${trialOrgs} in trial`, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Active Licenses", value: activeLicenses, sub: expiringSoon > 0 ? `⚠ ${expiringSoon} expiring soon` : "All in good standing", icon: KeyRound, color: expiringSoon > 0 ? "text-amber-400" : "text-tactical-gold", bg: "bg-tactical-gold/10 border-tactical-gold/20" },
    { label: "Infra Assets", value: assets.length, sub: infraIssues > 0 ? `⚠ ${infraIssues} need attention` : "All systems healthy", icon: Server, color: infraIssues > 0 ? "text-amber-400" : "text-emerald-400", bg: infraIssues > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20" },
    { label: "SDLC Projects", value: activeProjects, sub: blockedProjects > 0 ? `🚫 ${blockedProjects} blocked` : "All on track", icon: GitBranch, color: blockedProjects > 0 ? "text-red-400" : "text-violet-400", bg: blockedProjects > 0 ? "bg-red-500/10 border-red-500/20" : "bg-violet-500/10 border-violet-500/20" },
  ];

  // Upcoming expirations
  const upcoming = licenses
    .filter(l => l.valid_until && l.status === "active")
    .map(l => ({ ...l, daysLeft: differenceInDays(parseISO(l.valid_until), new Date()) }))
    .filter(l => l.daysLeft < 60)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const recentOrgs = [...orgs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`bg-card border rounded-xl p-4 ${k.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg border ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{k.label}</p>
            </div>
            <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <LicenseSeatChart licenses={licenses} orgs={orgs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming License Expirations */}
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-foreground text-sm">Expiring Licenses (Next 60 Days)</h3>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No licenses expiring soon.</p>
          ) : (
            <div className="divide-y divide-border/30">
              {upcoming.map(l => (
                <div key={l.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{l.organization_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{l.product?.replace(/_/g, " ")}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    l.daysLeft < 0 ? "text-red-400 bg-red-500/10 border-red-500/20" :
                    l.daysLeft < 14 ? "text-red-400 bg-red-500/10 border-red-500/20" :
                    "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}>
                    {l.daysLeft < 0 ? "Expired" : `${l.daysLeft}d`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Organizations */}
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-foreground text-sm">Recent Organizations</h3>
          </div>
          {recentOrgs.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No organizations yet.</p>
          ) : (
            <div className="divide-y divide-border/30">
              {recentOrgs.map(org => (
                <div key={org.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.domain || org.industry?.replace(/_/g, " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-sm">${(org.monthly_revenue || 0).toLocaleString()}/mo</p>
                    <p className={`text-[10px] font-semibold capitalize ${org.status === "active" ? "text-emerald-400" : org.status === "trial" ? "text-amber-400" : "text-slate-400"}`}>
                      {org.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}