import { useState, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, List, Search, SlidersHorizontal } from "lucide-react";
import type { Meeting } from "./meeting-data";
import { CalendarGrid, MeetingList, ViewButton } from "./meeting-calendar";

type MeetingWorkspaceProps = {
  meetings: Meeting[];
  selectedMonth: Date;
  monthLabel: string;
  query: string;
  view: "calendar" | "list";
  filters: ReactNode;
  activeFilters: number;
  loading: boolean;
  unavailable: boolean;
  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onQueryChange: (query: string) => void;
  onViewChange: (view: "calendar" | "list") => void;
  onSelectMeeting: (id: string) => void;
};

export function MeetingWorkspace({
  meetings, selectedMonth, monthLabel, query, view, filters, activeFilters, loading, unavailable,
  onToday, onPreviousMonth, onNextMonth, onQueryChange, onViewChange, onSelectMeeting,
}: MeetingWorkspaceProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <section aria-label="Agenda des rendez-vous" aria-busy={loading} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
        <h2 className="mr-auto text-base font-semibold capitalize text-slate-900">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Mois précédent" onClick={onPreviousMonth} className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-50"><ChevronLeft className="size-4" /></button>
          <button type="button" onClick={onToday} className="h-9 rounded-lg px-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Ce mois-ci</button>
          <button type="button" aria-label="Mois suivant" onClick={onNextMonth} className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-50"><ChevronRight className="size-4" /></button>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-1">
          <ViewButton active={view === "calendar"} label="Calendrier" onClick={() => onViewChange("calendar")}><CalendarDays className="size-4" /></ViewButton>
          <ViewButton active={view === "list"} label="Liste" onClick={() => onViewChange("list")}><List className="size-4" /></ViewButton>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 p-4">
        <label className="relative min-w-0 flex-[1_1_220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} aria-label="Rechercher un rendez-vous" placeholder="Rechercher un rendez-vous…" className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-indigo-500" />
        </label>
        <button type="button" aria-expanded={filtersOpen} aria-controls="meeting-filters" onClick={() => setFiltersOpen(!filtersOpen)} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm ${filtersOpen || activeFilters ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <SlidersHorizontal className="size-4" /> Filtres {activeFilters > 0 && <span className="rounded-full bg-indigo-100 px-1.5 text-xs">{activeFilters}</span>}
        </button>
      </div>
      <div id="meeting-filters" hidden={!filtersOpen} className="border-b border-slate-100 bg-slate-50/60 px-4 pb-4 pt-3">{filters}</div>
      {loading ? <div role="status" className="flex min-h-64 items-center justify-center text-sm text-slate-500">Chargement des rendez-vous…</div> :
        unavailable ? <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-slate-500">L’agenda sera affiché dès que les données seront disponibles.</div> :
        view === "calendar" ? <>
          <div className="md:hidden"><p className="px-4 py-2 text-xs text-slate-500">Agenda du mois</p><MeetingList meetings={meetings} onSelect={onSelectMeeting} /></div>
          <div className="hidden md:block"><CalendarGrid month={selectedMonth} meetings={meetings} onSelect={onSelectMeeting} /></div>
        </> : <MeetingList meetings={meetings} onSelect={onSelectMeeting} />}
    </section>
  );
}
