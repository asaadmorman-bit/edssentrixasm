import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Building2, KeyRound, GitBranch, FileText } from "lucide-react";
import PortalLicenses from "../components/portal/PortalLicenses";
import PortalProjects from "../components/portal/PortalProjects";
import PortalReports from "../components/portal/PortalReports";

const tabs = [
  { id: "licenses",  label: "My Licenses",        icon: KeyRound },
  { id: "projects",  label: "Project Status",      icon: GitBranch },
  { id: "reports",   label: "Compliance Reports",  icon: FileText },
];

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("licenses");
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Client Portal</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your licenses, project updates, and compliance reports
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-bold text-blue-400">
          <Building2 className="w-4 h-4" />
          {user?.full_name || user?.email || "Client View"}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 overflow-x-auto border-b border-border/60 scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 ${
              activeTab === t.id
                ? "border-tactical-gold text-tactical-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "licenses" && <PortalLicenses />}
      {activeTab === "projects" && <PortalProjects />}
      {activeTab === "reports"  && <PortalReports />}
    </div>
  );
}