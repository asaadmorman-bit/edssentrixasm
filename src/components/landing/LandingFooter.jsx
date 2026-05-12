import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-slate-800/60 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <span className="text-white font-bold text-sm">EDS Sentrix ASM</span>
              <span className="text-slate-600 text-xs ml-2">by Emerging Defense Solutions</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</Link>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">emergingdefensesolutions.com</a>
          </div>

          {/* Copyright */}
          <p className="text-slate-600 text-xs">
            © 2026 Emerging Defense Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}