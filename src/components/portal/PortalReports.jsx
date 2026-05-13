import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { FileText, Download, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

// Last 6 months as selectable report periods
function getReportPeriods() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return {
      label: format(d, "MMMM yyyy"),
      value: format(d, "yyyy-MM"),
      start: format(startOfMonth(d), "yyyy-MM-dd"),
      end: format(endOfMonth(d), "yyyy-MM-dd"),
    };
  });
}

export default function PortalReports() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(null);
  const [reports, setReports] = useState({});

  const periods = getReportPeriods();

  const { data: licenses = [] } = useQuery({
    queryKey: ["portal_licenses_report", user?.email],
    queryFn: () => base44.entities.License.filter({ status: "active" }, "-created_date", 50),
    enabled: !!user,
  });

  const handleGenerate = async (period) => {
    setGenerating(period.value);
    try {
      const res = await base44.functions.invoke("generateComplianceReport", {
        period_label: period.label,
        period_start: period.start,
        period_end: period.end,
        user_email: user?.email,
        user_name: user?.full_name,
        licenses,
      });
      setReports(prev => ({ ...prev, [period.value]: res.data }));
    } catch (e) {
      setReports(prev => ({ ...prev, [period.value]: { error: e.message } }));
    }
    setGenerating(null);
  };

  const handleDownload = (period, report) => {
    const blob = new Blob([report.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EDS-Compliance-Report-${period.value}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Monthly Compliance Reports</span> are generated on-demand for your organization's active licenses and service activity. Select a period below to generate and download your report.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {periods.map(period => {
          const report = reports[period.value];
          const isGenerating = generating === period.value;

          return (
            <div key={period.value} className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-tactical-gold/10 border border-tactical-gold/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-tactical-gold" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{period.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Compliance Summary Report</p>
                </div>
              </div>

              {report?.error && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {report.error}
                </div>
              )}

              {report?.content && !report.error && (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Report ready
                </div>
              )}

              <div className="flex gap-2">
                {!report?.content ? (
                  <button
                    onClick={() => handleGenerate(period)}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold rounded-lg transition-all disabled:opacity-60"
                  >
                    {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : "Generate Report"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleGenerate(period)}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 border border-border text-muted-foreground text-xs font-semibold rounded-lg transition-all disabled:opacity-60"
                    >
                      {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Refresh"}
                    </button>
                    <button
                      onClick={() => handleDownload(period, report)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-tactical-gold hover:bg-tactical-amber text-navy-900 text-xs font-bold rounded-lg transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}