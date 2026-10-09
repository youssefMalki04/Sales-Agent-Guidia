"use client";

import Link from "next/link";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PreviewContactForm, type Contact } from "./preview-contact-form";
import { ArrowUpRight, Building2, CalendarClock, UserRound } from "lucide-react";
import type { LeadRow } from "@/app/dashboard/leads/leads-types";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LeadsNextAction } from "./leads-next-action";
import { LeadEmailAction } from "./lead-email-action";
import { LeadPreviewNote } from "./lead-preview-note";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type PreviewItem = { lead: LeadRow; name: string; status: string };
const PreviewList = createContext<PreviewItem[]>([]);
export function LeadPreviewList({ items, children }: { items: PreviewItem[]; children: ReactNode }) {
  return <PreviewList.Provider value={items}>{children}</PreviewList.Provider>;
}

export function LeadPreview(props: PreviewItem) {
  const items = useContext(PreviewList);
  const [selectedId, setSelectedId] = useState(props.lead.id);
  const dirty = useRef(false);
  const index = items.findIndex((item) => item.lead.id === selectedId);
  const selected = items[index] ?? props;
  function move(offset: number) {
    const next = items[index + offset];
    if (!next) return;
    if (dirty.current && !window.confirm("Changer de prospect ? Les textes non enregistrés dans cet aperçu seront perdus.")) return;
    dirty.current = false;
    setSelectedId(next.lead.id);
  }
  return <Sheet onOpenChange={(open) => { if (open) { setSelectedId(props.lead.id); dirty.current = false; } }}>
    <SheetTrigger asChild>
      <button type="button" title={`Aperçu de ${props.name}`} className="block max-w-full truncate rounded-sm text-left font-medium text-[#2b2b31] hover:text-[#5964d6] hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500">{props.name}</button>
    </SheetTrigger>
    <SheetContent className="gap-0 bg-white data-[side=right]:w-full data-[side=right]:sm:max-w-[440px]" onChangeCapture={() => { dirty.current = true; }}>
      <nav aria-label="Navigation entre les prospects de cette page" className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 py-3 pl-5 pr-14 text-xs">
        <button type="button" disabled={index <= 0} onClick={() => move(-1)} className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent">← Précédent</button>
        <span aria-live="polite" className="text-slate-500">{index < 0 ? 1 : index + 1} / {items.length || 1}</span>
        <button type="button" disabled={index < 0 || index >= items.length - 1} onClick={() => move(1)} className="rounded-lg px-2 py-2 font-medium text-indigo-600 hover:bg-indigo-50 disabled:text-slate-300 disabled:hover:bg-transparent">Suivant →</button>
      </nav>
      <LeadPreviewBody key={selected.lead.id} {...selected} />
    </SheetContent>
  </Sheet>;
}

function LeadPreviewBody({ lead: originalLead, name: originalName, status }: PreviewItem) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const lead = { ...originalLead, ...contact };
  const name = contact?.name || originalName;
  const score = typeof lead.conversion_score === "number" && Number.isFinite(lead.conversion_score)
    ? Math.min(100, Math.max(0, lead.conversion_score)) : null;

  return (
    <>
        <SheetHeader className="shrink-0 border-b border-slate-100 p-6 pr-12">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><UserRound className="size-5" aria-hidden="true" /></div>
          <SheetTitle className="break-words text-xl font-semibold text-slate-900">{name}</SheetTitle>
          <SheetDescription>Aperçu du prospect</SheetDescription>
        </SheetHeader>
          <div className="mx-5 mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl bg-indigo-50/60 px-4 py-3">
            <span className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-medium text-indigo-700">{status}</span>
            <span className="text-sm text-slate-600">Score <strong className="ml-1 text-slate-900">{score === null ? "Non évalué" : `${score}/100`}</strong></span>
          </div>
        <Tabs defaultValue="contact" className="min-h-0 flex-1 gap-0">
          <TabsList aria-label="Rubriques du prospect" className="mx-5 my-4 grid w-auto shrink-0 grid-cols-3 bg-slate-100 group-data-horizontal/tabs:h-10">
            <TabsTrigger value="contact" className="text-xs data-active:text-indigo-600">Coordonnées</TabsTrigger>
            <TabsTrigger value="follow-up" className="text-xs data-active:text-indigo-600">Suivi</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs data-active:text-indigo-600">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="contact" forceMount className="min-h-0 overflow-y-auto px-5 pb-5 data-[state=inactive]:hidden">
          <section aria-label="Coordonnées">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><Building2 className="size-4 text-indigo-500" aria-hidden="true" />Coordonnées</h3>
            {editing ? <PreviewContactForm leadId={lead.id} contact={lead} onCancel={() => setEditing(false)} onSaved={(next) => { setContact(next); setEditing(false); setSaved(true); router.refresh(); }} /> : <>
            <dl className="space-y-3 text-sm">
              <Detail label="Entreprise" value={lead.company} />
              <Detail label="E-mail" value={lead.email} />
              <Detail label="Pays" value={lead.country} />
              <Detail label="Secteur" value={lead.sector} />
            </dl>
            <button type="button" onClick={() => { setEditing(true); setSaved(false); }} className="mt-3 rounded-lg border border-indigo-100 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50">Modifier les coordonnées</button>
            </>}
            {saved ? <p role="status" className="mt-2 text-xs text-emerald-700">Coordonnées enregistrées.</p> : null}
            <div className="mt-4">
              <LeadEmailAction
                key={`${lead.email}-${lead.name}-${lead.company}`}
                triggerLabel="Envoyer un e-mail"
                leadId={lead.id}
                name={name}
                email={lead.email?.trim() || undefined}
                company={lead.company ?? undefined}
                need={lead.need ?? undefined}
              />
              {!lead.email?.trim() ? <p className="mt-2 text-xs text-slate-500">Renseignez une adresse e-mail dans la fiche du prospect pour lui écrire.</p> : null}
            </div>
          </section>
          </TabsContent>
          <TabsContent value="follow-up" forceMount className="min-h-0 space-y-5 overflow-y-auto px-5 pb-5 data-[state=inactive]:hidden">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><CalendarClock className="size-4 text-indigo-500" aria-hidden="true" />Prochaine relance</h3>
            <LeadsNextAction leadId={lead.id} name={name} editable />
          </section>
          <section className="border-t border-slate-100 pt-5">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Besoin identifié</h3>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{lead.need?.trim() || "Aucun besoin renseigné."}</p>
          </section>
          {lead.summary?.trim() ? <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Résumé commercial</h3>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{lead.summary}</p>
          </section> : null}
          </TabsContent>
          <TabsContent value="notes" forceMount className="min-h-0 overflow-y-auto px-5 pb-5 data-[state=inactive]:hidden">
            <LeadPreviewNote key={lead.id} leadId={lead.id} />
          </TabsContent>
        </Tabs>
        <SheetFooter className="shrink-0 border-t border-slate-100 bg-white p-5">
          <Link href={`/dashboard/leads/${encodeURIComponent(lead.id)}`} className="flex items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-4 py-3 font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Ouvrir la fiche complète <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </SheetFooter>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-3"><dt className="text-slate-500">{label}</dt><dd className="break-words text-slate-800">{value?.trim() || "Non renseigné"}</dd></div>;
}
