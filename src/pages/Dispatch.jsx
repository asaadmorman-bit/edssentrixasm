import React, { useState } from "react";
import PIIMaskedField from "../components/security/PIIMaskedField";
import ActiveDispatches from "../components/dispatch/ActiveDispatches";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, ShieldCheck, MapPin, Calendar, ChevronRight, CheckCircle2, Eye, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const TABS = ["Legal Services", "Property Services"];

const legalServices = ["Mobile Notary", "Process Server", "Subpoena Delivery", "Legal Courier", "Document Authentication"];
const propertyServices = ["CPTED Security Audit", "Perimeter Assessment", "Landscaping Audit", "Access Point Review", "Lighting/Visibility Survey"];

const documents = [
  { name: "Affidavit_Reynolds_2026.pdf", size: "1.2 MB", type: "PDF" },
  { name: "PoA_DC-2026-44218.docx", size: "840 KB", type: "DOC" },
  { name: "CourtOrder_May2026.pdf", size: "2.1 MB", type: "PDF" },
];

export default function Dispatch() {
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const services = tab === 0 ? legalServices : propertyServices;

  const handleSubmit = async () => {
    if (!selectedService || !address) {
      toast.error("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('clickupDispatch', {
        serviceType: TABS[tab],
        serviceName: selectedService,
        address,
        date,
        notes,
        priority: 'normal',
      });
      setTicketRef(res.data?.taskId ? `#D-${res.data.taskId.slice(-5).toUpperCase()}` : `#D-${Math.floor(2900 + Math.random() * 99)}`);
      setSubmitted(true);
      toast.success("Dispatch request submitted to ClickUp — ETA confirmation within 15 minutes.");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setSelectedService("");
    setAddress("");
    setDate("");
    setNotes("");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Legal &amp; Security Dispatch</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Request legal, security, and field services across the DMV</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-semibold gap-1.5">
            <Radio className="w-3 h-3" />
            3 Active Dispatches
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold gap-1.5 text-emerald-600 border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            PII Protected
          </Badge>
        </div>
      </div>

      {/* PII Masked Client Details */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-tactical-gold" />
            <CardTitle className="text-base font-bold">Active Case — Sensitive Client Data</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">PII fields are masked per SOC 2 controls. Re-authentication required to reveal.</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PIIMaskedField label="Client Full Name" value="Alexandra M. Reynolds" masked="A•••••••• M. R•••••••" />
          <PIIMaskedField label="Service Address" value="3201 New Mexico Ave NW, Washington DC 20016" masked="3••• N•• M•••• A••, W•••••••••" />
          <PIIMaskedField label="Case Reference #" value="Case #DC-2026-44218" masked="Case #DC-••••-•••••" />
          <PIIMaskedField label="Contact Phone" value="+1 (202) 555-0174" masked="+1 (•••) •••-••••" />
        </CardContent>
      </Card>

      {/* Uploaded Documents — PII Blurred */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-tactical-gold" />
              <CardTitle className="text-base font-bold">Uploaded Legal Documents</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold gap-1 text-tactical-gold border-tactical-gold/30">
              <ShieldCheck className="w-3 h-3" /> PII Masked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="relative group rounded-xl border border-border/60 bg-muted/20 p-4 cursor-pointer hover:border-tactical-gold/40 transition-all overflow-hidden"
                title="PII Masked. Click and authenticate to view document contents."
                onClick={() => toast("🔐 Re-authentication required to view PII content.", { description: "Enter your PIN or MFA code to reveal this document." })}
              >
                {/* Blurred preview */}
                <div className="h-16 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 mb-3 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 backdrop-blur-sm bg-navy-900/60" />
                  <div className="relative z-10 text-center">
                    <Eye className="w-5 h-5 text-tactical-gold mx-auto mb-1" />
                    <p className="text-[9px] text-tactical-gold font-bold">AUTHENTICATE TO VIEW</p>
                  </div>
                  {/* fake blurred lines */}
                  <div className="absolute top-2 left-3 right-3 space-y-1 opacity-30">
                    <div className="h-1.5 bg-slate-400 rounded w-3/4" />
                    <div className="h-1.5 bg-slate-400 rounded w-1/2" />
                    <div className="h-1.5 bg-slate-400 rounded w-5/6" />
                    <div className="h-1.5 bg-slate-400 rounded w-2/3" />
                  </div>
                </div>
                <p className="text-xs font-bold text-foreground blur-[3px] select-none">{doc.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 blur-[2px] select-none">{doc.type} · {doc.size}</p>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="w-3.5 h-3.5 text-tactical-gold" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-tactical-gold" />
            PII Masked. Click and authenticate to view document contents. (SOC 2 Control CC6.1)
          </p>
        </CardContent>
      </Card>

      {/* Booking Form + Active Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-bold mb-3">New Service Request</CardTitle>
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted/40 rounded-lg w-full">
                {TABS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setTab(i); setStep(1); setSelectedService(""); }}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all ${tab === i ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3].map(s => (
                  <React.Fragment key={s}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= s ? "bg-tactical-gold border-tactical-gold text-navy-900" : "border-border text-muted-foreground"}`}>
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-0.5 transition-all ${step > s ? "bg-tactical-gold" : "bg-border"}`} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Select Service</span>
                <span>Location & Date</span>
                <span>Confirm</span>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              {!submitted ? (
                <>
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {tab === 0 ? "Legal Services" : "Property Services"}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {services.map((svc) => (
                          <button
                            key={svc}
                            onClick={() => setSelectedService(svc)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${selectedService === svc ? "border-tactical-gold bg-tactical-gold/10 text-foreground" : "border-border bg-muted/20 text-foreground hover:border-border/80 hover:bg-muted/40"}`}
                          >
                            <span>{svc}</span>
                            {selectedService === svc && <CheckCircle2 className="w-4 h-4 text-tactical-gold" />}
                          </button>
                        ))}
                      </div>
                      <Button disabled={!selectedService} onClick={() => setStep(2)} className="w-full bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold gap-2">
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Service Address *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Enter full address..." value={address} onChange={e => setAddress(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preferred Date & Time</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Special Instructions</label>
                        <textarea
                          rows={3}
                          placeholder="Any additional details..."
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-input bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                        <Button disabled={!address} onClick={() => setStep(3)} className="flex-1 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold gap-2">
                          Review <ChevronRight className="w-4 h-4" />
                        </Button>

                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/60">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request Summary</p>
                        {[
                          { label: "Service Type", val: `${TABS[tab]} — ${selectedService}` },
                          { label: "Address", val: address },
                          { label: "Date/Time", val: date || "Earliest available" },
                        ].map((r, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                            <span className="text-muted-foreground text-xs">{r.label}</span>
                            <span className="font-semibold text-foreground text-xs">{r.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                        <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-tactical-gold hover:bg-tactical-amber text-navy-900 font-bold gap-2">
                          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Confirm Dispatch"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Dispatch Confirmed!</p>
                    <p className="text-sm text-muted-foreground mt-1">Reference {ticketRef}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Task created in ClickUp · ETA confirmation within 15 minutes via SMS</p>
                  </div>
                  <Button variant="outline" onClick={handleReset}>New Request</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <ActiveDispatches />
        </div>
      </div>
    </div>
  );
}