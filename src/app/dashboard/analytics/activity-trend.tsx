"use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/analytics/trend";
const series = [
  { key: "conversations", label: "Conversations actives", color: "#6366f1" },
  { key: "leads", label: "Nouveaux prospects", color: "#0d9488" },
  { key: "meetings", label: "Rendez-vous créés", color: "#d97706" },
] as const;
const dateLabel = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
export function ActivityTrend({ points }: { points: TrendPoint[] }) {
  const active = points.some((point) => point.conversations || point.leads || point.meetings);
  return <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.025)] sm:p-6" aria-label="Évolution quotidienne">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">Votre activité au fil des jours</h2><p className="mt-1 text-xs text-slate-500">Conversations, prospects et rendez-vous · jours UTC</p></div><div className="flex flex-wrap gap-3">{series.map((item) => <span key={item.key} className="inline-flex items-center gap-1.5 text-xs text-slate-600"><span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span>)}</div></div>
    {!active && <p className="mt-4 text-sm text-slate-500">Aucune activité enregistrée sur cette période.</p>}
    <div className="mt-5 h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%"><LineChart data={points} margin={{ top: 8, right: 12, bottom: 4, left: -20 }} accessibilityLayer>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" tickFormatter={dateLabel} minTickGap={32} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip labelFormatter={(value) => dateLabel(String(value))} contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }} />
        {series.map((item) => <Line key={item.key} type="linear" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />)}
      </LineChart></ResponsiveContainer>
    </div>
    <details className="mt-3 text-xs text-slate-500"><summary className="cursor-pointer">Données journalières et méthode</summary><p className="my-3 leading-5">Une conversation est comptée une fois par jour, même si elle contient plusieurs messages. Elle peut donc apparaître plusieurs jours. Les jours aux extrémités de la période sont partiels. Les rendez-vous sont comptés à leur création, hors archives.</p><div className="max-h-64 overflow-auto"><table className="w-full min-w-[420px] text-left"><thead><tr><th scope="col" className="p-2">Jour UTC</th>{series.map((item) => <th scope="col" key={item.key} className="p-2">{item.label}</th>)}</tr></thead><tbody>{points.map((row) => <tr key={row.date} className="border-t border-slate-100"><th scope="row" className="p-2 font-normal">{row.date}</th>{series.map((item) => <td key={item.key} className="p-2">{row[item.key]}</td>)}</tr>)}</tbody></table></div></details>
  </section>;
}
