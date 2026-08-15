"use client";

import {
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  Copy,
  Eye,
  EyeOff,
  Link2,
  Plus,
  RefreshCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";

type Delivery = {
  id: number;
  event: string;
  status: "delivered" | "failed";
  code: number;
  time: string;
};
const availableEvents = [
  "lead.qualified",
  "conversation.completed",
  "meeting.booked",
  "ticket.created",
];
const initialDeliveries: Delivery[] = [
  {
    id: 1,
    event: "lead.qualified",
    status: "delivered",
    code: 200,
    time: "2 min ago",
  },
  {
    id: 2,
    event: "meeting.booked",
    status: "delivered",
    code: 200,
    time: "18 min ago",
  },
  {
    id: 3,
    event: "conversation.completed",
    status: "failed",
    code: 500,
    time: "1 hour ago",
  },
];

export default function WebhooksPage() {
  const [endpoint, setEndpoint] = useState(
    "https://api.example.com/webhooks/leadia",
  );
  const [enabled, setEnabled] = useState(true);
  const [events, setEvents] = useState(["lead.qualified", "meeting.booked"]);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [secretVisible, setSecretVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const secret = "whsec_ld_48xA7p9kT2mQ";
  const successRate = useMemo(
    () =>
      deliveries.length
        ? Math.round(
            (deliveries.filter((item) => item.status === "delivered").length /
              deliveries.length) *
              100,
          )
        : 0,
    [deliveries],
  );

  function toggleEvent(eventName: string) {
    setEvents((current) =>
      current.includes(eventName)
        ? current.filter((item) => item !== eventName)
        : [...current, eventName],
    );
    setSaved(false);
  }
  async function copySecret() {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  function testWebhook() {
    setTesting(true);
    window.setTimeout(() => {
      setDeliveries((current) => [
        {
          id: Date.now(),
          event: "test.ping",
          status: "delivered",
          code: 200,
          time: "Just now",
        },
        ...current,
      ]);
      setTesting(false);
    }, 900);
  }

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-9 text-slate-950 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[1240px] space-y-7">
        <PageIntro
          eyebrow="Developer tools"
          title="Webhooks"
          description="Send real-time sales events securely to your CRM, backend or automation workflows."
          action={
            <button
              type="button"
              onClick={testWebhook}
              disabled={testing || !endpoint}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f5acb] disabled:opacity-50"
            >
              <Send className={`size-4 ${testing ? "animate-pulse" : ""}`} />
              {testing ? "Sending test…" : "Send test event"}
            </button>
          }
        />

        <section className="soft-stagger grid gap-4 sm:grid-cols-3">
          <DashboardMetric
            label="Endpoint status"
            value={enabled ? "Active" : "Paused"}
            icon={<Link2 className="size-5" />}
            tone={enabled ? "success" : "brand"}
          />
          <DashboardMetric
            label="Subscribed events"
            value={String(events.length)}
            icon={<Code2 className="size-5" />}
          />
          <DashboardMetric
            label="Delivery success"
            value={`${successRate}%`}
            icon={<CheckCircle2 className="size-5" />}
            tone={successRate >= 90 ? "success" : "warning"}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <article className="soft-panel-enter rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_14px_40px_rgba(89,100,214,0.07)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Endpoint configuration
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose where Leadia should deliver events.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-[#5964d6]" : "bg-slate-300"}`}
                aria-label="Toggle endpoint"
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${enabled ? "left-6" : "left-1"}`}
                />
              </button>
            </div>
            <label className="mt-6 block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Endpoint URL
              </span>
              <input
                value={endpoint}
                onChange={(event) => {
                  setEndpoint(event.target.value);
                  setSaved(false);
                }}
                placeholder="https://api.yoursite.com/webhooks"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
              />
            </label>
            <div className="mt-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Signing secret
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-1.5 pl-3">
                <code className="min-w-0 flex-1 truncate text-xs text-slate-600">
                  {secretVisible ? secret : "••••••••••••••••••••••"}
                </code>
                <button
                  type="button"
                  onClick={() => setSecretVisible(!secretVisible)}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-[#5964d6]"
                >
                  {secretVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={copySecret}
                  className="flex size-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm hover:text-[#5964d6]"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Use this secret on your server to verify every request
                signature.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="h-11 flex-1 rounded-xl bg-[#5964d6] text-sm font-semibold text-white transition hover:bg-[#4f5acb]"
              >
                {saved ? "Changes saved" : "Save endpoint"}
              </button>
              <button
                type="button"
                onClick={() => setEndpoint("")}
                aria-label="Delete endpoint"
                className="flex size-11 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </article>

          <article className="soft-panel-enter rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_14px_40px_rgba(89,100,214,0.07)]">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Event subscriptions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the updates sent to this endpoint.
              </p>
            </div>
            <div className="mt-5 space-y-2.5">
              {availableEvents.map((eventName) => {
                const selected = events.includes(eventName);
                return (
                  <button
                    key={eventName}
                    type="button"
                    onClick={() => toggleEvent(eventName)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${selected ? "border-[#d9ddfa] bg-[#f8f9ff]" : "border-slate-200 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex size-8 items-center justify-center rounded-lg ${selected ? "bg-[#5964d6] text-white" : "bg-slate-100 text-slate-400"}`}
                      >
                        {selected ? (
                          <Check className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </span>
                      <code
                        className={`text-xs font-semibold ${selected ? "text-[#5964d6]" : "text-slate-600"}`}
                      >
                        {eventName}
                      </code>
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {selected ? "Enabled" : "Off"}
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold tracking-tight">
                Recent deliveries
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Requests sent to your endpoint
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeliveries(initialDeliveries)}
              className="flex size-9 items-center justify-center rounded-xl border border-[#e1e4f8] text-[#5964d6] hover:bg-[#f1f2ff]"
              aria-label="Refresh deliveries"
            >
              <RefreshCcw className="size-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 sm:grid-cols-[1fr_100px_80px_100px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${delivery.status === "delivered" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                  >
                    {delivery.status === "delivered" ? (
                      <Check className="size-4" />
                    ) : (
                      <X className="size-4" />
                    )}
                  </span>
                  <code className="truncate text-xs font-semibold text-slate-700">
                    {delivery.event}
                  </code>
                </div>
                <span
                  className={`hidden text-xs font-semibold capitalize sm:block ${delivery.status === "delivered" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {delivery.status}
                </span>
                <code className="hidden text-xs text-slate-500 sm:block">
                  HTTP {delivery.code}
                </code>
                <span className="flex items-center justify-end gap-1 text-xs text-slate-400">
                  <Clock3 className="size-3" />
                  {delivery.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
