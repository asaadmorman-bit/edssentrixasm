import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, RefreshCw, Users, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const inputCls = "w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-tactical-gold/30";

export default function BulkLicenseModal({ selectedLicenses, onClose, onSaved }) {
  const [action, setAction] = useState("seats"); // "seats" | "renew" | "status" | "auto_renew"
  const [seats, setSeats] = useState("");
  const [status, setStatus] = useState("active");
  const [autoRenew, setAutoRenew] = useState("true");
  const [months, setMonths] = useState(12);
  const [saving, setSaving] = useState(false);

  const count = selectedLicenses.length;

  const handleApply = async () => {
    setSaving(true);
    try {
      await Promise.all(selectedLicenses.map(lic => {
        let patch = {};

        if (action === "seats") {
          if (!seats || isNaN(Number(seats))) { toast.error("Enter a valid seat count"); setSaving(false); return; }
          patch = { seats_licensed: Number(seats) };
        } else if (action === "renew") {
          const from = new Date();
          const until = new Date(from);
          until.setMonth(until.getMonth() + Number(months));
          patch = {
            status: "active",
            valid_from: from.toISOString().split("T")[0],
            valid_until: until.toISOString().split("T")[0],
          };
        } else if (action === "status") {
          patch = { status };
        } else if (action === "auto_renew") {
          patch = { auto_renew: autoRenew === "true" };
        }

        return base44.entities.License.update(lic.id, patch);
      }));

      toast.success(`${count} license${count > 1 ? "s" : ""} updated successfully.`);
      onSaved();
    } catch (e) {
      toast.error("Bulk update failed: " + e.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div>
            <h2 className="font-bold text-foreground text-base">Bulk Update Licenses</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{count} license{count > 1 ? "s" : ""} selected</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        {/* Selected preview */}
        <div className="px-6 pt-4">
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto mb-4">
            {selectedLicenses.map(l => (
              <span key={l.id} className="text-[10px] font-semibold px-2 py-1 bg-muted/60 border border-border rounded-full text-foreground">
                {l.organization_name || "—"} · {l.product?.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {/* Action selector */}
        <div className="px-6 pb-2">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Action</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "seats",      label: "Update Seat Count",   icon: Users },
              { id: "renew",      label: "Renew Subscription",  icon: RefreshCw },
              { id: "status",     label: "Change Status",       icon: CheckCircle2 },
              { id: "auto_renew", label: "Set Auto-Renew",      icon: RefreshCw },
            ].map(a => (
              <button
                key={a.id}
                onClick={() => setAction(a.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  action === a.id
                    ? "bg-tactical-gold/10 border-tactical-gold/40 text-tactical-gold"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <a.icon className="w-3.5 h-3.5 shrink-0" />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action-specific inputs */}
        <div className="px-6 py-4">
          {action === "seats" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">New Seat Count</label>
              <input type="number" min={1} value={seats} onChange={e => setSeats(e.target.value)} placeholder="e.g. 10" className={inputCls} />
              <p className="text-[10px] text-muted-foreground mt-1">Will be applied to all {count} selected licenses.</p>
            </div>
          )}
          {action === "renew" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Renew for (months)</label>
              <select value={months} onChange={e => setMonths(Number(e.target.value))} className={inputCls}>
                {[1, 3, 6, 12, 24].map(m => <option key={m} value={m}>{m} month{m > 1 ? "s" : ""}</option>)}
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">Sets status to Active and extends valid_until from today.</p>
            </div>
          )}
          {action === "status" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">New Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
                {["active","expired","pending","revoked"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
          {action === "auto_renew" && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Auto-Renew</label>
              <select value={autoRenew} onChange={e => setAutoRenew(e.target.value)} className={inputCls}>
                <option value="true">Enable Auto-Renew</option>
                <option value="false">Disable Auto-Renew</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={handleApply} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-sm font-bold transition-all active:scale-95 disabled:opacity-50">
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying…</> : `Apply to ${count} License${count > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}