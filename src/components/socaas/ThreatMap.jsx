import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const threatNodes = [
  { x: 22, y: 38, label: "Moscow, RU", type: "critical" },
  { x: 61, y: 33, label: "Beijing, CN", type: "critical" },
  { x: 15, y: 55, label: "São Paulo, BR", type: "warning" },
  { x: 72, y: 48, label: "Jakarta, ID", type: "warning" },
  { x: 48, y: 28, label: "Kyiv, UA", type: "info" },
  { x: 19, y: 34, label: "London, UK", type: "info" },
];

const targetNode = { x: 24, y: 36, label: "DMV Region, US" };

export default function ThreatMap() {
  return (
    <Card className="shadow-sm border-border/60 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          Global Threat Intelligence Map
          <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">LIVE</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-slate-950 rounded-b-xl overflow-hidden" style={{ height: "340px" }}>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* World map silhouette (simplified SVG path) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            <path fill="#94a3b8" d="M150,120 Q180,100 220,110 Q260,95 280,115 Q310,105 330,120 Q350,110 380,115 Q360,145 340,160 Q310,170 280,165 Q250,175 220,160 Q190,165 160,155 Z" />
            <path fill="#94a3b8" d="M420,80 Q460,70 500,85 Q540,75 570,90 Q600,80 630,95 Q660,85 690,100 Q720,90 750,105 Q780,100 800,120 Q820,140 810,170 Q790,185 760,180 Q730,190 700,175 Q670,185 640,170 Q610,180 580,165 Q550,175 520,160 Q490,170 460,155 Q430,165 400,145 Q385,125 420,80 Z" />
            <path fill="#94a3b8" d="M450,200 Q480,190 510,205 Q540,195 560,210 Q575,230 565,260 Q545,280 520,275 Q495,285 470,270 Q450,255 455,225 Z" />
            <path fill="#94a3b8" d="M200,230 Q230,215 265,225 Q295,215 320,235 Q340,255 330,285 Q310,305 280,300 Q250,310 225,295 Q200,280 205,255 Z" />
            <path fill="#94a3b8" d="M620,250 Q650,240 680,255 Q705,270 700,300 Q680,320 655,315 Q630,325 615,305 Q605,285 620,250 Z" />
          </svg>

          {/* Attack lines */}
          <svg className="absolute inset-0 w-full h-full">
            {threatNodes.map((node, i) => (
              <g key={i}>
                <line
                  x1={`${node.x}%`} y1={`${node.y}%`}
                  x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                  stroke={node.type === "critical" ? "#ef4444" : node.type === "warning" ? "#f59e0b" : "#64748b"}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-16" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                </line>
                <circle
                  cx={`${node.x}%`} cy={`${node.y}%`} r="4"
                  fill={node.type === "critical" ? "#ef4444" : node.type === "warning" ? "#f59e0b" : "#64748b"}
                  opacity="0.9"
                >
                  <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            ))}
            {/* Target (us) */}
            <circle cx={`${targetNode.x}%`} cy={`${targetNode.y}%`} r="8" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8">
              <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={`${targetNode.x}%`} cy={`${targetNode.y}%`} r="4" fill="#3b82f6" opacity="1" />
          </svg>

          {/* Labels */}
          {threatNodes.map((node, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -150%)" }}
            >
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap
                ${node.type === "critical" ? "bg-red-950 text-red-400 border border-red-500/30" :
                  node.type === "warning" ? "bg-amber-950 text-amber-400 border border-amber-500/30" :
                  "bg-slate-800 text-slate-400 border border-slate-600/30"}`}>
                {node.label}
              </span>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg p-2.5 border border-slate-700/50">
            {[
              { color: "bg-red-500", label: "Critical threat" },
              { color: "bg-amber-500", label: "Moderate threat" },
              { color: "bg-blue-500", label: "Our perimeter" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="text-[9px] text-slate-400 font-mono">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}