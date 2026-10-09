"use client";
import Link from "next/link";
import { BarChart3, Users, MessageSquareText, CheckCircle2, Trophy, RefreshCw, Printer } from "lucide-react";
import { useAnalytics } from "./use-analytics";
import type { Period } from "./analytics-types";
import { ActivityTrend } from "./activity-trend";

export default function AnalyticsPage() {
  const { analytics: data, error, loading, period, setPeriod, refresh } = useAnalytics();
  const metrics = [
    { label: "Conversations actives", value: data?.conversations, icon: MessageSquareText, tone: "bg-indigo-50 text-indigo-600", accent: "bg-indigo-400" },
    { label: "Nouveaux prospects", value: data?.leads, icon: Users, tone: "bg-sky-50 text-sky-600", accent: "bg-sky-400" },
    { label: "Prospects à fort potentiel", value: data?.qualified, icon: CheckCircle2, tone: "bg-violet-50 text-violet-600", accent: "bg-violet-400" },
    { label: "Prospects gagnés", value: data?.won, icon: Trophy, tone: "bg-emerald-50 text-emerald-600", accent: "bg-emerald-400" },
  ];
  return <main className="min-h-screen bg-white px-4 py-6 text-slate-900 sm:px-8 xl:px-10">
    <div className="mx-auto max-w-[1400px] space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100/60 bg-gradient-to-r from-indigo-50/70 via-white to-white p-4 sm:p-5">
        <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">Leadia · Vue d’ensemble</p><h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100"><BarChart3 aria-hidden="true" className="size-5" /></span>Analyse commerciale</h1><p className="mt-2 text-sm text-slate-500">Vos résultats en un coup d’œil.</p></div>
        <div className="flex flex-wrap items-center gap-2 print:hidden [&_button]:min-h-10 [&_button]:transition-colors [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-indigo-500">
          <button type="button" onClick={() => window.print()} disabled={!data || loading || Boolean(error)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50 disabled:opacity-40 print:hidden"><Printer className="size-4" />Imprimer / PDF</button>
          <div aria-label="Période" className="flex rounded-xl border border-slate-200 bg-white p-1">{(["7d", "30d", "90d"] as Period[]).map((item) => <button key={item} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)} className={`rounded-lg px-3 py-2 text-xs font-medium ${period === item ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>{item.slice(0, -1)} jours</button>)}</div>
          <button type="button" aria-label="Actualiser les statistiques" disabled={loading} onClick={refresh} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50 disabled:opacity-40"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></button>
        </div>
      </header>
      {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} <button type="button" onClick={refresh} className="underline">Réessayer</button></p>}
      {loading && <p role="status" className="text-sm text-slate-500">Chargement des indicateurs…</p>}
      <section aria-label="Indicateurs" className="grid grid-cols-2 gap-3 sm:grid-cols-4">{metrics.map(({ label, value, icon: Icon, tone, accent }) => <article key={label} className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.025)] sm:p-5"><div aria-hidden="true" className={`absolute inset-x-0 top-0 h-0.5 ${accent}`} /><div className="flex items-center justify-between gap-2"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon aria-hidden="true" className="size-4" /></span><p className="text-3xl font-semibold tabular-nums tracking-tight">{loading || error ? "—" : value ?? "—"}</p></div><h2 className="mt-3 min-h-10 text-sm font-medium leading-5 text-slate-600">{label}</h2></article>)}</section>
      {data && !loading && !error && <>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{new Date(data.from).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })} — {new Date(data.to).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>Données réelles · période sélectionnée</span>
        </div>
        {!data.leads && !data.conversations && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Aucune activité sur cette période. Essayez 90 jours.</p>}

        <ActivityTrend points={data.trend ?? []} />
        <section className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-indigo-50/40 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">D’où viennent vos prospects ?</h2><p className="mt-1 text-xs text-slate-500">Répartition des {data.leads} nouveaux prospects</p></div></div>
            <div className="mt-7 space-y-6">{data.sources.map((source, index) => {
              const percentage = data.leads ? source.total / data.leads * 100 : 0;
              const colors = ["bg-gradient-to-r from-violet-400 to-fuchsia-400", "bg-gradient-to-r from-indigo-500 to-blue-400", "bg-slate-300"];
              return <div key={source.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="text-slate-600">{source.name}</span><span className="shrink-0 tabular-nums font-semibold">{source.total} <span className="ml-2 text-xs font-normal text-slate-500">{percentage.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} %</span></span></div>
                <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${colors[index]}`} style={{ width: `${percentage}%` }} /></div>
              </div>;
            })}</div>
            <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">Origine déduite des conversations liées.</p>
          </article>

          <div className="grid content-start gap-4">
            <article className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white shadow-sm">
              <h2 className="text-sm font-medium text-indigo-100">Conversion des conversations</h2>
              <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-white">{data.conversionRate === null ? "—" : `${data.conversionRate.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`}</p>
              <p className="mt-2 text-xs leading-5 text-indigo-100">{data.converted} sur {data.conversations} conversations actives liées à un nouveau prospect.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-medium">Relances en retard</h2><span className={`text-2xl font-semibold ${data.overdue ? "text-amber-600" : "text-slate-900"}`}>{data.overdue}</span></div>
              <p className="mt-1 text-xs text-slate-500">Aujourd’hui · toutes périodes</p>
              <Link href="/dashboard/tasks" className="mt-3 inline-flex items-center min-h-10 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Voir les tâches →</Link>
            </article>
          </div>
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><h2 className="text-sm font-semibold">Qualité des prospects par origine</h2><span className="text-xs text-slate-500">{data.meetings} rendez-vous créé(s) · hors archives</span></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm"><thead className="border-y border-slate-100 bg-slate-50/70 text-xs text-slate-500"><tr>{["Origine", "Prospects", "Fort potentiel", "Gagnés"].map((label) => <th scope="col" key={label} className="px-5 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{data.sources.map((source) => <tr key={source.name} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"><th scope="row" className="px-5 py-3 font-medium text-slate-700">{source.name}</th><td className="px-5 py-3 tabular-nums">{source.total}</td><td className="px-5 py-3 tabular-nums">{source.qualified}</td><td className="px-5 py-3 tabular-nums">{source.won}</td></tr>)}</tbody></table></div>
        </section>
        <details className="text-xs text-slate-500 open:rounded-xl open:bg-slate-50 open:p-4">
          <summary className="cursor-pointer font-medium">Comment sont calculés ces indicateurs ?</summary>
          <div className="mt-3 space-y-2 leading-5">
            <p>Période exacte : du {new Date(data.from).toLocaleString("fr-FR")} au {new Date(data.to).toLocaleString("fr-FR")}. Les prospects sont ceux créés dans cette période ; scores et statuts correspondent à leur état actuel.</p>
            <p>Fort potentiel : score ≥ 70 ou température « hot ». Une conversation active contient au moins un message visiteur pendant la période. Le taux de conversion ne mesure pas les visiteurs anonymes du site.</p>
            <p>L’origine est déduite du lien de conversation, pas d’une attribution publicitaire. Les relances en retard incluent toutes les tâches ouvertes, quelle que soit la période choisie.</p>
          </div>
        </details>
      </>}
    </div>
  </main>;
}
