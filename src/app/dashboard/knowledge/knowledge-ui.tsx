import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { Scope } from "./knowledge-data";

export function KnowledgeMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fafafd] px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[#5964d6]" />
        <p className="text-xl font-semibold text-slate-950">{value}</p>
      </div>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

export function KnowledgeActionButton({ description, disabled, icon: Icon, label, onClick }: { description: string; disabled?: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="soft-lift flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_6px_22px_rgba(15,23,42,0.04)] transition hover:border-[#cfd3ed] hover:bg-[#fafaff] disabled:opacity-50">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]"><Icon className="size-5" /></span>
      <span><strong className="block text-sm text-slate-900">{label}</strong><small className="mt-1 block text-xs text-slate-500">{description}</small></span>
    </button>
  );
}

export function KnowledgeFilterField({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8a93]">{label}</span>{children}</label>;
}

export function KnowledgeScopeBadge({ scope }: { scope: Scope }) {
  const style = {
    Support: "border-cyan-200 bg-cyan-50 text-cyan-700",
    Demo: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Training: "border-[#cfd3ed] bg-[#f5f6ff] text-[#5964d6]",
    "Pre-sales": "border-amber-200 bg-amber-50 text-amber-700",
  }[scope];
  return <Badge variant="outline" className={cn("rounded-full", style)}>{scope}</Badge>;
}
