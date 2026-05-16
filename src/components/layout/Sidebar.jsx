import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Radio, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  Settings,
  GitBranch,
  MonitorCheck,
  Building2,
  Network,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Command Center", icon: LayoutDashboard, path: "/app" },
  { label: "Client Portal", icon: Building2, path: "/app/portal" },
  { label: "SOCaaS / MSSP Monitor", icon: MonitorCheck, path: "/app/socaas" },
  { label: "Infrastructure & Ops", icon: Network, path: "/app/infrastructure" },
  { label: "SD-WAN Health & HA", icon: Wifi, path: "/app/sdwan" },
  { label: "Dispatch Center", icon: Radio, path: "/app/dispatch" },
  { label: "Compliance LMS", icon: GraduationCap, path: "/app/training" },
  { label: "Tactical Ops & Gear", icon: ShoppingBag, path: "/app/shop" },
];

const navBottom = [
  { label: "Security & Audit Logs", icon: ShieldAlert, path: "/app/audit" },
  { label: "DevSecOps & CI/CD", icon: GitBranch, path: "/app/devsecops" },
  { label: "Admin Dashboard", icon: LayoutDashboard, path: "/app/admin" },
  { label: "Admin Settings", icon: Settings, path: "/app/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-navy-900 border-b border-navy-700 flex items-center px-4">
        <button onClick={() => setMobileOpen(true)} className="text-white p-2 -ml-2">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center ml-3">
          <img
            src="https://media.base44.com/images/public/6a01a7f0046386899eee80d5/483e87ca1_1778520471105.png"
            alt="EDS Sentrix ASM"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="w-72 h-full bg-navy-900 p-0" onClick={e => e.stopPropagation()}>
            <SidebarContent collapsed={false} location={location} onClose={() => setMobileOpen(false)} showClose />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-navy-900 border-r border-navy-700 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        <SidebarContent collapsed={collapsed} location={location} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-navy-700 border border-navy-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-navy-600 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </>
  );
}

function SidebarContent({ collapsed, location, onClose, showClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-20 flex items-center px-4 border-b border-navy-700/50 shrink-0">
        <div className="flex items-center min-w-0">
          {collapsed ? (
            <img
              src="https://media.base44.com/images/public/6a01a7f0046386899eee80d5/483e87ca1_1778520471105.png"
              alt="EDS"
              className="h-9 w-9 object-contain"
            />
          ) : (
            <img
              src="https://media.base44.com/images/public/6a01a7f0046386899eee80d5/483e87ca1_1778520471105.png"
              alt="EDS Sentrix ASM"
              className="h-14 w-auto object-contain"
            />
          )}
        </div>
        {showClose && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-tactical-gold/10 text-tactical-gold"
                  : "text-slate-400 hover:text-white hover:bg-navy-800"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-tactical-gold rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-tactical-gold")} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary nav */}
      <div className="px-3 pb-3 space-y-1.5 border-t border-navy-700/40 pt-3">
        {navBottom.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-tactical-gold/10 text-tactical-gold"
                  : "text-slate-500 hover:text-white hover:bg-navy-800"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-tactical-gold rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-tactical-gold")} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-navy-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-sm font-semibold text-white">
              JD
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">John Doe</p>
              <p className="text-slate-500 text-xs truncate">Admin · EDS DMV</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}