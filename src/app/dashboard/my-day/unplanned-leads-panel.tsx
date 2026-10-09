"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { LeadFollowUpAction } from "@/components/leadia/lead-follow-up-action";
import { Button } from "@/components/ui/button";
import { pipelineStageLabel } from "@/lib/leads/pipeline-stage-history";

export type UnplannedLead = {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  score: number;
  stage: string;
};

export function UnplannedLeadsPanel({ leads, total, loading, onCreated }: {
  leads: UnplannedLead[];
  total: number;
  loading: boolean;
  onCreated: () => void;
}) {
  const [selectedLead, setSelectedLead] = useState<UnplannedLead | null>(null);

  return (
    <section aria-busy={loading} className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CalendarClock className="size-4 text-[#5964d6]" /> Without follow-up
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{total}</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">Open prospects with no pending reminder · highest scores first.</p>
        </div>
        {total > leads.length ? <p className="text-xs text-slate-500">Showing {leads.length} of {total}</p> : null}
      </div>
      <div className="mt-3 divide-y divide-slate-100">
        {leads.map((lead) => (
          <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0 flex-1 basis-48">
              <Link href={`/dashboard/leads/${lead.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:text-[#5964d6] hover:underline">
                {lead.name || lead.email || "Unnamed lead"}
              </Link>
              <p className="mt-1 truncate text-xs text-slate-500">{lead.company || "Company not provided"} · {pipelineStageLabel(lead.stage)} · {lead.score}/100</p>
            </div>
            <Button variant="outline" size="sm" disabled={loading} onClick={() => setSelectedLead(lead)} aria-label={`Plan follow-up for ${lead.name || lead.email || "this lead"}`} className="h-8 shrink-0 rounded-lg border-slate-200 text-xs font-medium text-slate-600 shadow-none">
              <CalendarClock className="size-3.5" /> Plan follow-up
            </Button>
          </div>
        ))}
        {!leads.length ? <p className="py-3 text-sm text-slate-500">All open prospects have a pending reminder, or there are no open prospects.</p> : null}
      </div>
      <Link href="/dashboard/pipeline" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#5964d6] hover:underline">Open sales pipeline <ArrowRight className="size-3" /></Link>
      {selectedLead ? <LeadFollowUpAction
        key={selectedLead.id}
        leadId={selectedLead.id}
        leadName={selectedLead.name || selectedLead.email || "this lead"}
        open
        onOpenChange={(open) => { if (!open) setSelectedLead(null); }}
        onCreated={onCreated}
      /> : null}
    </section>
  );
}
