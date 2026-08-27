"use client";

import {
  CheckCircle2,
  Clock3,
  Code2,
  FileJson2,
  RefreshCcw,
  Send,
  XCircle,
} from "lucide-react";
import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";
import { useCrmPayloads } from "./use-crm-payloads";

export default function CrmPayloadsPage() {
  const {
    payloads,
    metrics,
    target,
    setTarget,
    status,
    setStatus,
    selected,
    setSelected,
    loading,
    retrying,
    notice,
    online,
    loadPayloads,
    retryPayload,
  } = useCrmPayloads();
  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-9 text-slate-950 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[1240px] space-y-7">
        <PageIntro
          eyebrow="Developer data"
          title="CRM payloads"
          description="Inspect structured data delivered to HubSpot, Salesforce, Slack and custom webhooks."
        />
        <section className="soft-stagger grid gap-4 sm:grid-cols-3">
          <DashboardMetric
            label="Payloads today"
            value={metrics.today}
            icon={<FileJson2 className="size-5" />}
          />
          <DashboardMetric
            label="Delivered"
            value={`${metrics.successRate}%`}
            icon={<CheckCircle2 className="size-5" />}
            tone="success"
          />
          <DashboardMetric
            label="Failed exports"
            value={metrics.failed}
            icon={<Clock3 className="size-5" />}
          />
        </section>
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">Recent exports</h2>
              <p className="mt-1 text-xs text-slate-500">
                Payload metadata and CRM responses
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold"
              >
                <option value="all">All targets</option>
                <option value="hubspot">HubSpot</option>
                <option value="salesforce">Salesforce</option>
                <option value="slack">Slack</option>
                <option value="webhook">Webhook</option>
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold"
              >
                <option value="all">All statuses</option>
                <option value="sent">Delivered</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
              <button
                type="button"
                onClick={() => void loadPayloads()}
                className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-[#5964d6]"
              >
                <RefreshCcw
                  className={`size-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${online ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
              >
                <span
                  className={`size-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`}
                />
                Export service {online ? "online" : "error"}
              </span>
            </div>
          </div>
          {notice ? (
            <div
              className={`mx-6 mt-4 rounded-xl border p-3 text-sm font-semibold ${notice.includes("successfully") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}
            >
              {notice}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Payload</th>
                  <th className="px-4 py-3.5">Lead</th>
                  <th className="px-4 py-3.5">Target</th>
                  <th className="px-4 py-3.5">Event</th>
                  <th className="px-4 py-3.5">Response</th>
                  <th className="px-6 py-3.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payloads.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="cursor-pointer text-sm transition hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-mono text-xs font-semibold text-[#5964d6]">
                        <Code2 className="size-4" />
                        {item.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {item.leads?.name ??
                        item.leads?.email ??
                        String(
                          item.payload?.name ??
                            item.payload?.email ??
                            "Unknown lead",
                        )}
                    </td>
                    <td className="px-4 py-4 capitalize text-slate-500">
                      {item.type}
                    </td>
                    <td className="px-4 py-4">
                      <code className="rounded-lg bg-[#f1f2ff] px-2 py-1 text-[11px] text-[#5964d6]">
                        lead.qualified
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.status === "sent" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {item.status === "sent" ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                        {item.status === "sent"
                          ? "Delivered"
                          : item.status === "failed"
                            ? "Failed"
                            : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!payloads.length ? (
            <p className="px-6 py-12 text-center text-sm text-slate-500">
              {loading
                ? "Loading payload history…"
                : "No CRM exports found. Export a lead to create the first payload."}
            </p>
          ) : null}
          <div className="flex items-center gap-2 border-t border-slate-100 bg-[#fafaff] px-6 py-4 text-xs text-slate-500">
            <Send className="size-4 text-[#5964d6]" />
            Sensitive credentials remain server-side and are never included in
            this view.
          </div>
        </section>
      </div>
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/25 backdrop-blur-sm"
          onMouseDown={(event) =>
            event.currentTarget === event.target && setSelected(null)
          }
        >
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-[#e1e4f8] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5964d6]">
                  {selected.type}
                </p>
                <h2 className="mt-2 text-xl font-semibold">Payload details</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="size-9 rounded-xl border border-slate-200"
              >
                ×
              </button>
            </div>
            <h3 className="mt-7 text-sm font-semibold">Request payload</h3>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-200">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>
            <h3 className="mt-6 text-sm font-semibold">CRM response</h3>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
              {JSON.stringify(selected.response, null, 2)}
            </pre>
            {selected.status === "failed" ? (
              <button
                type="button"
                disabled={retrying === selected.id}
                onClick={() => void retryPayload(selected.id)}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white disabled:opacity-50"
              >
                <RefreshCcw
                  className={`size-4 ${retrying ? "animate-spin" : ""}`}
                />
                {retrying ? "Retrying…" : "Retry export"}
              </button>
            ) : null}
          </aside>
        </div>
      ) : null}
    </main>
  );
}
