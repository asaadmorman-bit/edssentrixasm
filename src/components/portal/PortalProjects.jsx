import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { GitBranch, ExternalLink, Circle } from "lucide-react";
import { format, parseISO } from "date-fns";

const phaseConfig = {
  planning:     { label: "Planning",     color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20" },
  requirements: { label: "Requirements", color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  design:       { label: "Design",       color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20" },
  development:  { label: "Development",  color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  testing:      { label: "Testing",      color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
  deployment:   { label: "Deployment",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  maintenance:  { label: "Maintenance",  color: "text-teal-400",    bg: "bg-teal-500/10 border-teal-500/20" },
};

const statusConfig = {
  on_track: { label: "On Track", dot: "bg-emerald-400" },
  at_risk:  { label: "At Risk",  dot: "bg-amber-400" },
  blocked:  { label: "Blocked",  dot: "bg-red-400" },
  completed:{ label: "Completed",dot: "bg-blue-400" },
};

function ProgressBar({ pct }) {
  const color = pct >= 100 ? "bg-blue-500" : pct >= 66 ? "bg-emerald-500" : pct >= 33 ? "bg-amber-500" : "bg-slate-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progress</span><span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

export default function PortalProjects() {
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["portal_projects", user?.email],
    queryFn: () => base44.entities.SDLCProject.list("-updated_date", 50),
    enabled: !!user,
  });

  if (isLoading) return <div className="text-center py-12 text-muted-foreground text-sm">Loading projects…</div>;

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No active projects found for your organization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map(proj => {
        const phase = phaseConfig[proj.phase] || phaseConfig.planning;
        const status = statusConfig[proj.status] || statusConfig.on_track;
        const pct = proj.completion_pct || 0;

        return (
          <div key={proj.id} className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-foreground">{proj.project_name}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${phase.bg} ${phase.color}`}>
                    {phase.label}
                  </span>
                </div>
                {proj.organization_name && (
                  <p className="text-xs text-muted-foreground mt-0.5">{proj.organization_name}</p>
                )}
                {proj.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Circle className={`w-2 h-2 ${status.dot} fill-current`} />
                <span className="text-xs font-semibold text-muted-foreground">{status.label}</span>
              </div>
            </div>

            <ProgressBar pct={pct} />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {proj.assigned_to && (
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-semibold text-foreground mt-0.5 truncate">{proj.assigned_to}</p>
                </div>
              )}
              {proj.start_date && (
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-semibold text-foreground mt-0.5">{format(parseISO(proj.start_date), "MMM d, yyyy")}</p>
                </div>
              )}
              {proj.target_date && (
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-muted-foreground">Target Date</p>
                  <p className="font-semibold text-foreground mt-0.5">{format(parseISO(proj.target_date), "MMM d, yyyy")}</p>
                </div>
              )}
            </div>

            {proj.tech_stack && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Stack:</span> {proj.tech_stack}
              </p>
            )}

            {proj.repo_url && (
              <a href={proj.repo_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                <ExternalLink className="w-3 h-3" /> View Repository
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}