import {
  CheckCircle2,
  Clock3,
  Code2,
  FileJson2,
  Send,
  XCircle,
} from "lucide-react";

import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";

const payloads = [
  {
    id: "PAY-1048",
    lead: "Amira Ben Salah",
    target: "HubSpot",
    event: "lead.qualified",
    status: "Delivered",
    code: 200,
    time: "5 min ago",
  },
  {
    id: "PAY-1047",
    lead: "Sami Gharbi",
    target: "Slack",
    event: "meeting.booked",
    status: "Delivered",
    code: 200,
    time: "22 min ago",
  },
  {
    id: "PAY-1046",
    lead: "Noura Trabelsi",
    target: "Salesforce",
    event: "lead.updated",
    status: "Failed",
    code: 401,
    time: "1 hour ago",
  },
  {
    id: "PAY-1045",
    lead: "Karim Mansour",
    target: "Webhook",
    event: "conversation.completed",
    status: "Delivered",
    code: 202,
    time: "2 hours ago",
  },
];

export default function CrmPayloadsPage() {
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
            value="148"
            icon={<FileJson2 className="size-5" />}
          />
          <DashboardMetric
            label="Delivered"
            value="96.8%"
            icon={<CheckCircle2 className="size-5" />}
            tone="success"
          />
          <DashboardMetric
            label="Average response"
            value="284 ms"
            icon={<Clock3 className="size-5" />}
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">Recent exports</h2>
              <p className="mt-1 text-xs text-slate-500">
                Payload metadata and CRM responses
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              Export service online
            </span>
          </div>
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
                {payloads.map((payload) => (
                  <tr
                    key={payload.id}
                    className="text-sm transition hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-mono text-xs font-semibold text-[#5964d6]">
                        <Code2 className="size-4" />
                        {payload.id}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {payload.lead}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {payload.target}
                    </td>
                    <td className="px-4 py-4">
                      <code className="rounded-lg bg-[#f1f2ff] px-2 py-1 text-[11px] text-[#5964d6]">
                        {payload.event}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${payload.status === "Delivered" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {payload.status === "Delivered" ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                        {payload.status} · {payload.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">
                      {payload.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 bg-[#fafaff] px-6 py-4 text-xs text-slate-500">
            <Send className="size-4 text-[#5964d6]" />
            Sensitive credentials remain server-side and are never included in
            this view.
          </div>
        </section>
      </div>
    </main>
  );
}
