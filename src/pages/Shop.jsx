import React, { useState } from "react";
import ProductCard from "../components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShoppingBag, Shield, Activity, ChevronRight, CheckCircle2, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const products = [
  {
    id: 1, title: "5.11 Tactical Polo — Black", category: "Tactical Apparel",
    price: "$42.99", unit: "/ea", description: "Professional-grade polo for security teams. Moisture-wicking fabric with pen pockets.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    badge: "Best Seller", rating: 5, reviews: 234, bulkOrder: true,
  },
  {
    id: 2, title: "5.11 Tactical Trauma Kit", category: "Tactical Gear",
    price: "$89.99", unit: "/kit", description: "TCCC-compliant trauma kit with tourniquet, chest seal, and hemostatic gauze.",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&h=400&fit=crop",
    badge: "Essential", rating: 5, reviews: 112, bulkOrder: true,
  },
  {
    id: 3, title: "Cisco Meraki Network Upgrade", category: "Cyber / Tech",
    price: "$4,999", unit: "/site", description: "Enterprise-grade network security with cloud-managed access points, switches, and firewall.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    badge: "Premium", rating: 4, reviews: 47, bulkOrder: false,
  },
  {
    id: 4, title: "Microsoft 365 Secure Migration", category: "Cyber / Tech",
    price: "$2,499", unit: "/org", description: "Full migration to Microsoft 365 with MFA setup, data loss prevention, and compliance policies.",
    image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=600&h=400&fit=crop",
    badge: "Top Rated", rating: 5, reviews: 89, bulkOrder: false,
  },
  {
    id: 5, title: "Security Body Camera System", category: "Tactical Gear",
    price: "$299.99", unit: "/unit", description: "HD body camera with 12-hour battery, night vision, and cloud evidence management.",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=400&fit=crop",
    rating: 4, reviews: 67, bulkOrder: true,
  },
  {
    id: 6, title: "Access Control Starter Kit", category: "Physical Security",
    price: "$1,299", unit: "/door", description: "Keycard access with audit trail, mobile unlock, and visitor management system.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",
    rating: 4, reviews: 34, bulkOrder: false,
  },
];

const categories = ["All", "Tactical Apparel", "Tactical Gear", "Cyber / Tech", "Physical Security"];

const OPS_SERVICES = [
  {
    id: "ep_armed", label: "Executive Protection — Armed", icon: Shield,
    color: "border-tactical-gold/30 bg-tactical-gold/5 hover:bg-tactical-gold/10",
    badge: "Premium", badgeColor: "text-tactical-gold border-tactical-gold/30",
    desc: "Licensed armed protection agents with law enforcement background. Ideal for high-profile principals, legal proceedings, and asset transport.",
    price: "From $185/hr",
  },
  {
    id: "ep_unarmed", label: "Executive Protection — Unarmed", icon: Users,
    color: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
    badge: "Standard", badgeColor: "text-blue-400 border-blue-500/30",
    desc: "Professional unarmed protection for corporate events, VIP travel escorts, and workplace safety assessments.",
    price: "From $95/hr",
  },
  {
    id: "drone", label: "Aerial Drone Surveillance", icon: Activity,
    color: "border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10",
    badge: "Aerial Ops", badgeColor: "text-violet-400 border-violet-500/30",
    desc: "FAA-certified operators. Live thermal/HD surveillance, perimeter mapping, and incident response support.",
    price: "From $750/mission",
  },
];

const RTB_PERKS = [
  { label: "5.11 Tactical Gear", detail: "Bulk B2B pricing — 10+ units get 18% off", icon: "🪖" },
  { label: "Right to Bear Legal Defense", detail: "Corporate legal defense coverage for armed security staff", icon: "⚖️" },
  { label: "Preferred Insurance Rates", detail: "EDS partner carriers — up to 22% premium reduction", icon: "🛡️" },
  { label: "Priority Dispatch SLA", detail: "Dedicated account manager + sub-15 min response SLA", icon: "⚡" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedOps, setSelectedOps] = useState(null);
  const [opsSubmitted, setOpsSubmitted] = useState(false);
  const [opsLoading, setOpsLoading] = useState(false);
  const [opsTicketRef, setOpsTicketRef] = useState("");
  const [opsForm, setOpsForm] = useState({ name: "", date: "", location: "", notes: "" });

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpsSubmit = async () => {
    if (!selectedOps || !opsForm.name) { toast.error("Please complete required fields."); return; }
    setOpsLoading(true);
    try {
      const res = await base44.functions.invoke('clickupDispatch', {
        serviceType: 'Tactical Ops',
        serviceName: selectedOps.label,
        address: opsForm.location,
        date: opsForm.date,
        notes: `Requestor: ${opsForm.name}\n${opsForm.notes}`,
        priority: 'high',
        requestorName: opsForm.name,
      });
      setOpsTicketRef(res.data?.taskId ? `#OPS-${res.data.taskId.slice(-5).toUpperCase()}` : `#OPS-${Math.floor(100 + Math.random() * 899)}`);
      setOpsSubmitted(true);
      toast.success(`${selectedOps.label} request sent to ClickUp — high priority. Our team will contact you within 2 hours.`);
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setOpsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tactical Ops & Pro Shop</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Premium operations booking, B2B gear, and partner perks</p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold gap-1.5 w-fit">
          <ShoppingBag className="w-3 h-3" />
          {products.length} Products
        </Badge>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 p-1 bg-muted/40 rounded-xl w-full max-w-md">
        {[
          { id: "shop", label: "Partner Pro Shop" },
          { id: "ops", label: "Tactical Ops Booking" },
          { id: "perks", label: "Partner Perks" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Shop Tab */}
      {activeTab === "shop" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-10" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)} className="text-xs font-medium">
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Ops Booking Tab */}
      {activeTab === "ops" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Service</p>
            {OPS_SERVICES.map(svc => (
              <button
                key={svc.id}
                onClick={() => setSelectedOps(svc)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${svc.color} ${selectedOps?.id === svc.id ? "ring-2 ring-tactical-gold" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
                    <svc.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-foreground">{svc.label}</p>
                      <Badge variant="outline" className={`text-[10px] font-bold ${svc.badgeColor} shrink-0`}>{svc.badge}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{svc.desc}</p>
                    <p className="text-xs font-bold text-tactical-gold mt-2">{svc.price}</p>
                  </div>
                  {selectedOps?.id === svc.id && <CheckCircle2 className="w-4 h-4 text-tactical-gold shrink-0" />}
                </div>
              </button>
            ))}
          </div>

          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Request Details</CardTitle>
              {selectedOps && <p className="text-xs text-muted-foreground">Selected: <span className="text-foreground font-semibold">{selectedOps.label}</span></p>}
            </CardHeader>
            <CardContent>
              {!opsSubmitted ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Principal / Company Name *</label>
                    <Input placeholder="Your name or company" value={opsForm.name} onChange={e => setOpsForm({ ...opsForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Operation Date & Time</label>
                    <Input type="datetime-local" value={opsForm.date} onChange={e => setOpsForm({ ...opsForm, date: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Location / Area of Operations</label>
                    <Input placeholder="City, venue, or address" value={opsForm.location} onChange={e => setOpsForm({ ...opsForm, location: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mission Notes</label>
                    <textarea rows={3} placeholder="Threat context, special requirements..." value={opsForm.notes} onChange={e => setOpsForm({ ...opsForm, notes: e.target.value })} className="w-full px-3 py-2 text-sm border border-input bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  </div>
                  <Button onClick={handleOpsSubmit} disabled={!selectedOps || opsLoading} className="w-full bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold gap-2">
                    {opsLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Ops Request <ChevronRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Ops Request Received</p>
                    <p className="text-sm text-muted-foreground mt-1">Mission Ref: {opsTicketRef}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Task created in ClickUp · Our team will contact you within 2 hours.</p>
                  </div>
                  <Button variant="outline" onClick={() => { setOpsSubmitted(false); setSelectedOps(null); setOpsForm({ name: "", date: "", location: "", notes: "" }); }}>New Request</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Partner Perks Tab */}
      {activeTab === "perks" && (
        <div className="space-y-4">
          <div className="bg-tactical-gold/5 border border-tactical-gold/20 rounded-xl p-5">
            <p className="font-bold text-tactical-gold text-sm mb-1">EDS Sentrix Partner Perks Program</p>
            <p className="text-xs text-muted-foreground">Exclusive B2B benefits for Sentrix ASM subscribers. All perks are negotiated at the enterprise level — no individual purchasing required.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RTB_PERKS.map((perk, i) => (
              <div key={i} className="bg-card border border-border/60 rounded-xl p-5 hover:border-tactical-gold/30 transition-all cursor-pointer group" onClick={() => toast.success(`${perk.label} — Our partner account manager will reach out within 24 hours.`)}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{perk.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">{perk.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{perk.detail}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-tactical-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Request access</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            All partner agreements are backed by EDS Sentrix enterprise SLAs. Pricing locked for 12-month terms.
          </div>
        </div>
      )}
    </div>
  );
}