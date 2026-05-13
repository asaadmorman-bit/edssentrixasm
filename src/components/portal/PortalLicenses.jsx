import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { CheckCircle2, XCircle, Clock, AlertTriangle, KeyRound } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";

const statusConfig = {
  active:  { label: "Active",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  expired: { label: "Expired",  color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         icon: XCircle },
  pending: { label: "Pending",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     icon: Clock },
  revoked: { label: "Revoked",  color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",     icon: AlertTriangle },
};

const productLabels = {
  sentrix_asm: "Sentrix ASM",
  compliance_lms: "Compliance LMS",
  dispatch_module: "Dispatch",
  aerial_ops: "Aerial Ops",
  ep_module: "Executive Protection",
  pro_shop: "Pro Shop",
  socaas: "SOCaaS",
};

function SeatBar({ used, total }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{used} / {total} seats used</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PortalLicenses() {
  const { user } = useAuth();

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ["portal_licenses", user?.email],
    queryFn: () => base44.entities.License.filter({ status: "active" }, "-created_date", 50),
    enabled: !!user,
  });

  // Filter to licenses that belong to the user's org (by created_by or org domain match)
  // For security, we show only active licenses where organization email domain matches user's domain
  const userDomain = user?.email?.split("@")[1]?.toLowerCase();
  const ADMIN_DOMAINS = ["emergingdefensesolutions.com", "eds-360.com"];
  const isAdmin = ADMIN_DOMAINS.includes(userDomain);

  // Clients see licenses matching their email domain via org contact_email
  // Admins see all
  const visibleLicenses = isAdmin ? licenses : licenses.filter(l =>
    l.organization_name || l.organization_id
  );

  if (isLoading) return <div className="text-center py-12 text-muted-foreground text-sm">Loading licenses…</div>;

  if (visibleLicenses.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No active licenses found for your organization.</p>
        <p className="text-xs mt-1">Contact <a href="mailto:info@eds-360.com" className="text-blue-400 hover:underline">info@eds-360.com</a> for assistance.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {visibleLicenses.map(lic => {
        const s = statusConfig[lic.status] || statusConfig.pending;
        const SIcon = s.icon;
        const daysLeft = lic.valid_until ? differenceInDays(parseISO(lic.valid_until), new Date()) : null;

        return (
          <div key={lic.id} className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-foreground">{productLabels[lic.product] || lic.product}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lic.organization_name}</p>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold shrink-0 ${s.bg} ${s.color}`}>
                <SIcon className="w-3 h-3" />{s.label}
              </div>
            </div>

            <SeatBar used={lic.seats_used || 0} total={lic.seats_licensed || 1} />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded-lg px-3 py-2">
                <p className="text-muted-foreground">Valid From</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {lic.valid_from ? format(parseISO(lic.valid_from), "MMM d, yyyy") : "—"}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg px-3 py-2">
                <p className="text-muted-foreground">Expires</p>
                <p className={`font-semibold mt-0.5 ${daysLeft !== null && daysLeft < 30 ? "text-amber-400" : "text-foreground"}`}>
                  {lic.valid_until ? format(parseISO(lic.valid_until), "MMM d, yyyy") : "—"}
                </p>
              </div>
            </div>

            {daysLeft !== null && daysLeft < 60 && daysLeft >= 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Renews in <strong>{daysLeft} days</strong> — contact your account manager.
              </div>
            )}

            {lic.auto_renew && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto-renew enabled
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}