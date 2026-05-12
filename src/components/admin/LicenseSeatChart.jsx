import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { KeyRound } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <p className="text-xs text-muted-foreground mt-2 border-t border-border/40 pt-2">
          Utilization: {Math.round((payload[1].value / payload[0].value) * 100)}%
        </p>
      )}
    </div>
  );
};

export default function LicenseSeatChart({ licenses = [], orgs = [] }) {
  // Aggregate seats licensed vs used per organization
  const data = orgs
    .map(org => {
      const orgLicenses = licenses.filter(l => l.organization_id === org.id && l.status === "active");
      const seatsLicensed = orgLicenses.reduce((s, l) => s + (l.seats_licensed || 0), 0);
      const seatsUsed = orgLicenses.reduce((s, l) => s + (l.seats_used || 0), 0);
      if (seatsLicensed === 0) return null;
      return {
        name: org.name.length > 16 ? org.name.slice(0, 15) + "…" : org.name,
        "Seats Licensed": seatsLicensed,
        "Seats Used": seatsUsed,
      };
    })
    .filter(Boolean);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60">
        <KeyRound className="w-4 h-4 text-tactical-gold" />
        <h3 className="font-bold text-foreground text-sm">License Seat Utilization by Organization</h3>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12, color: "hsl(var(--muted-foreground))" }}
            />
            <Bar dataKey="Seats Licensed" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Seats Used" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}