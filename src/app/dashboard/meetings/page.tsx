"use client";

import { Plus, RefreshCw, CalendarDays, AlertCircle, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import type { MeetingStatus } from "./meeting-data";


import { CreateMeeting } from "./create-meeting";
import { MeetingDetails } from "./meeting-panels";
import { MeetingWorkspace } from "./meeting-workspace";
import { useMeetings } from "./use-meetings";

export default function MeetingsPage() {
  const {
    meetings,
    loading, updating, refresh, owners, period, setPeriod, withoutReport, setWithoutReport, archive, setArchive, resetFilters,
    filteredMeetings,
    error,
    view,
    setView,
    selectedMonth,
    query,
    setQuery,
    status,
    setStatus,
    owner,
    setOwner,
    selectedMeeting,
    setSelectedId,
    creating,
    setCreating,
    monthLabel,
    confirmedCount,
    pendingCount,
    completionRate,
    showCurrentMonth,
    showPreviousMonth,
    showNextMonth,
    updateMeeting,
    createMeeting,
  } = useMeetings();

  const activeFilters = Number(period !== "all") + Number(withoutReport) + Number(archive !== "active") + Number(owner !== "all") + Number(status !== "all");
  const unavailable = Boolean(error);
  const selectClass = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700";
  const stats = [
    { label: "Ce mois-ci", value: meetings.length, icon: CalendarDays, tone: "bg-indigo-50 text-indigo-600" },
    { label: "Confirmés", value: confirmedCount, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
    { label: "En attente", value: pendingCount, icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    { label: "Taux de réalisation", value: `${completionRate}%`, icon: TrendingUp, tone: "bg-violet-50 text-violet-600" },
  ];
  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-4 py-6 text-slate-900 sm:px-8 xl:px-10">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100/60 bg-gradient-to-r from-indigo-50/70 via-white to-white p-4 sm:p-5">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"><CalendarDays aria-hidden="true" className="size-5" /></span>Rendez-vous</h1>
            <p className="mt-1 text-sm text-slate-500">Vos échanges, simplement organisés.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Actualiser les rendez-vous" title="Actualiser" disabled={loading || updating} onClick={() => void refresh()} className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></button>
            <button type="button" onClick={() => setCreating(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"><Plus className="size-4" />Nouveau rendez-vous</button>
          </div>
        </header>

        <section aria-label="Statistiques du mois, avant filtrage" className="grid grid-cols-2 gap-3 py-1 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon aria-hidden="true" className="size-4" /></span>
            <div><span className="block text-xl font-semibold tabular-nums leading-6 text-slate-900">{loading || unavailable ? "—" : value}</span>
            <span className="text-xs text-slate-500">{label}</span></div>
          </div>)}
        </section>

        {error && <div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-sm text-amber-900">
          <AlertCircle className="size-4 shrink-0" />
          <span className="flex-1">Impossible de charger les rendez-vous.</span>
          <button type="button" disabled={loading || updating} onClick={() => void refresh()} className="font-medium underline disabled:opacity-40">Réessayer</button>
          <details className="w-full text-xs"><summary className="cursor-pointer text-amber-800">Détails du problème</summary><p className="pt-2 leading-5">{error}</p></details>
        </div>}

        <MeetingWorkspace
          meetings={filteredMeetings}
          selectedMonth={selectedMonth}
          monthLabel={monthLabel}
          query={query}
          view={view}
          loading={loading}
          unavailable={unavailable}
          activeFilters={activeFilters}
          filters={<div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-medium text-slate-500">Période<select value={period} onChange={(event) => setPeriod(event.target.value)} className={selectClass}><option value="all">Tout le mois</option><option value="today">Aujourd’hui</option><option value="future">À venir</option><option value="past">Passés</option></select></label>
              <label className="text-xs font-medium text-slate-500">Responsable<select value={owner} onChange={(event) => setOwner(event.target.value)} className={selectClass}><option value="all">Tous les responsables</option>{[...new Set([...owners, ...meetings.map((meeting) => meeting.owner)])].map((name) => <option key={name}>{name}</option>)}</select></label>
              <label className="text-xs font-medium text-slate-500">Statut<select value={status} onChange={(event) => setStatus(event.target.value as "all" | MeetingStatus)} className={selectClass}><option value="all">Tous les statuts</option><option value="pending">En attente</option><option value="confirmed">Confirmé</option><option value="completed">Terminé</option><option value="cancelled">Annulé</option><option value="no_show">Absent</option></select></label>
              <label className="text-xs font-medium text-slate-500">Archives<select value={archive} onChange={(event) => setArchive(event.target.value)} className={selectClass}><option value="active">Non archivés</option><option value="archived">Archivés</option><option value="all">Tous</option></select></label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="size-4 accent-indigo-600" checked={withoutReport} onChange={(event) => setWithoutReport(event.target.checked)} />Terminés sans compte rendu</label>
              <button type="button" onClick={resetFilters} className="text-xs font-medium text-indigo-600 hover:underline">Réinitialiser les filtres et la recherche</button>
            </div>
          </div>}
          onToday={showCurrentMonth}
          onPreviousMonth={showPreviousMonth}
          onNextMonth={showNextMonth}
          onQueryChange={setQuery}
          onViewChange={setView}
          onSelectMeeting={setSelectedId}
        />
        <p className="text-xs leading-5 text-slate-400">Période : {monthLabel} · Fuseau de cet appareil : {Intl.DateTimeFormat().resolvedOptions().timeZone}. Statistiques avant filtrage ; taux hors annulations et absences.</p>
      </div>

      {selectedMeeting ? (
        <MeetingDetails
          error={error}
          key={selectedMeeting.id}
          meeting={selectedMeeting}
          onClose={() => setSelectedId(null)}
          onUpdate={(patch) => updateMeeting(selectedMeeting.id, patch)}
        />
      ) : null}
      {creating ? (
        <CreateMeeting
          onClose={() => setCreating(false)}
          onSubmit={createMeeting}
        />
      ) : null}
    </main>
  );
}
