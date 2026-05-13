import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Server, Plus, Pencil, Trash2, AlertTriangle, CheckCircle2, XCircle, AlertCircle, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import InfraFormModal from "./InfraFormModal";

const statusConfig = {
  healthy:  { label: "Healthy",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  warning:  { label: "Warning",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",   icon: AlertTriangle },
  critical: { label: "Critical", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",       icon: AlertCircle },
  offline:  { label: "Offline",  color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",   icon: XCircle },
};

const providerBadge = {
  azure:       "text-blue-300 bg-blue-500/10 border-blue-500/20",
  aws:         "text-orange-300 bg-orange-500/10 border-orange-500/20",
  gcp:         "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
  cloudflare:  "text-amber-300 bg-amber-500/10 border-amber-500/20",
  on_premise:  "text-slate-300 bg-slate-500/10 border-slate-500/20",
  other:       "text-muted-foreground bg-muted/40 border-border",
};

export default function InfraManager() {
  const qc = useQueryClient();
  const [editAsset, setEditAsset] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["infra"],
    queryFn: () => base44.entities.InfraAsset.list("-created_date", 200),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.InfraAsset.delete(id),
    onSuccess: () => { qc.invalidateQueries(["infra"]); toast.success("Asset removed"); },
  });

  const healthy  = assets.filter(a => a.status === "healthy").length;
  const warning  = assets.filter(a => a.status === "warning").length;
  const critical = assets.filter(a => a.status === "critical").length;
  const offline  = assets.filter(a => a.status === "offline").length;
  const totalCost = assets.reduce((s, a) => s + (a.monthly_cost || 0), 0);
  const flaggedCount = warning + critical + offline;

  const filtered = assets.filter(a => {
    const matchStatus = statusFilter === "all" ? true
      : statusFilter === "flagged" ? ["warning","critical","offline"].includes(a.status)
      : a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || [a.asset_name, a.organization_name, a.ip_address, a.region, a.os, a.asset_type]
      .some(v => v?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assets",       value: assets.length,           color: "text-foreground" },
          { label: "Healthy",            value: healthy,                  color: "text-emerald-400" },
          { label: "Warning / Critical", value: `${warning} / ${critical}`, color: warning + critical > 0 ? "text-amber-400" : "text-emerald-400" },
          { label: "Monthly Infra Cost", value: `$${totalCost.toLocaleString()}`, color: "text-tactical-gold" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Flagged alert banner */}
      {flaggedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300 font-semibold">
            {flaggedCount} asset{flaggedCount > 1 ? "s" : ""} need{flaggedCount === 1 ? "s" : ""} attention —&nbsp;
            {critical > 0 && <span className="text-red-400">{critical} critical</span>}
            {critical > 0 && warning > 0 && ", "}
            {warning > 0 && <span className="text-amber-400">{warning} warning</span>}
            {(critical > 0 || warning > 0) && offline > 0 && ", "}
            {offline > 0 && <span className="text-slate-400">{offline} offline</span>}
          </p>
          <button
            onClick={() => setStatusFilter("flagged")}
            className="ml-auto text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-2 whitespace-nowrap"
          >
            View flagged →
          </button>
        </div>
      )}

      {/* Filter + Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-0.5 border-b border-border/60">
          {[
            { id: "all",      label: `All (${assets.length})` },
            { id: "flagged",  label: `Needs Attention (${flaggedCount})`, alert: flaggedCount > 0 },
            { id: "critical", label: `Critical (${critical})` },
            { id: "warning",  label: `Warning (${warning})` },
            { id: "offline",  label: `Offline (${offline})` },
            { id: "healthy",  label: `Healthy (${healthy})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                statusFilter === f.id
                  ? "border-tactical-gold text-tactical-gold"
                  : f.alert
                    ? "border-transparent text-red-400 hover:text-red-300"
                    : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="pl-8 pr-3 h-9 w-44 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold rounded-lg transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Server className="w-10 h-10 mx-auto mb-3 opacity-30" />
          {assets.length === 0 ? "No infrastructure assets tracked." : "No assets match the current filter."}
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  {["Asset","Type","Provider","Status","Organization","IP/Region","Last Patched","Monthly Cost","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map(asset => {
                  const s = statusConfig[asset.status] || statusConfig.healthy;
                  const SIcon = s.icon;
                  const isFlagged = ["warning","critical","offline"].includes(asset.status);
                  return (
                    <tr key={asset.id} className={`hover:bg-muted/20 transition-colors ${isFlagged ? "bg-red-500/[0.03] border-l-2 border-l-red-500/40" : ""}`}>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-foreground">{asset.asset_name}</p>
                        {asset.os && <p className="text-[10px] text-muted-foreground">{asset.os}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground capitalize text-xs">{asset.asset_type?.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${providerBadge[asset.provider] || providerBadge.other}`}>
                          {asset.provider?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.bg} ${s.color}`}>
                          <SIcon className="w-3 h-3" />{s.label}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{asset.organization_name || "—"}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-foreground font-mono">{asset.ip_address || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">{asset.region || ""}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">{asset.last_patched || "—"}</td>
                      <td className="px-4 py-3.5 text-foreground font-medium">${(asset.monthly_cost || 0).toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditAsset(asset)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if (confirm("Remove asset?")) deleteMut.mutate(asset.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showCreate || editAsset) && (
        <InfraFormModal
          asset={editAsset}
          onClose={() => { setShowCreate(false); setEditAsset(null); }}
          onSaved={() => { qc.invalidateQueries(["infra"]); setShowCreate(false); setEditAsset(null); }}
        />
      )}
    </div>
  );
}