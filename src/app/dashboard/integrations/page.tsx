"use client";

import {
  Blocks,
  Check,
  CheckCircle2,
  Clock3,
  Search,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";
import {
  categoryLabels,
  initialEvents,
  initialIntegrations,
  STORAGE_KEY,
} from "./integration-data";
import type {
  Category,
  Integration,
  IntegrationStatus,
} from "./integration-types";
import { ConfigPanel, Logo, StatusBadge } from "./integration-ui";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setIntegrations(JSON.parse(stored) as Integration[]);
      } catch {
        // Keep the demo state when storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      integrations.filter((integration) => {
        const term = query.trim().toLowerCase();
        return (
          (category === "all" || integration.category === category) &&
          (!term ||
            `${integration.name} ${integration.description}`
              .toLowerCase()
              .includes(term))
        );
      }),
    [category, integrations, query],
  );

  const selected =
    integrations.find((integration) => integration.id === selectedId) ?? null;
  const connected = integrations.filter(
    (integration) => integration.status === "connected",
  ).length;
  const totalEvents = integrations.reduce(
    (total, integration) => total + integration.events,
    0,
  );

  function persist(next: Integration[]) {
    setIntegrations(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateSelected(status: IntegrationStatus) {
    if (!selected) return;
    persist(
      integrations.map((integration) =>
        integration.id === selected.id
          ? {
              ...integration,
              status,
              lastSync:
                status === "connected" ? "Just now" : integration.lastSync,
            }
          : integration,
      ),
    );
    setEvents((current) => [
      {
        id: `event-${Date.now()}`,
        integration: selected.name,
        action:
          status === "connected"
            ? "Connection configured successfully"
            : "Integration disconnected",
        status: "success",
        time: "Just now",
      },
      ...current,
    ]);
  }

  function testConnection() {
    if (!selected) return;
    setTesting(true);
    setTested(false);
    window.setTimeout(() => {
      setTesting(false);
      setTested(true);
      updateSelected("connected");
    }, 900);
  }

  function openIntegration(id: string) {
    setSelectedId(id);
    setTested(false);
  }

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-slate-950 sm:px-8 xl:px-12">
      <div className="mx-auto max-w-[1400px] space-y-7">
        <PageIntro
          eyebrow="Connected ecosystem"
          title="Integration center"
          description="Connect your sales stack and automate actions after every qualified conversation."
          action={
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              {connected} services connected
            </div>
          }
        />

        <section className="soft-stagger grid gap-4 sm:grid-cols-3">
          <DashboardMetric
            icon={<Blocks className="size-5" />}
            label="Available integrations"
            value={integrations.length}
          />
          <DashboardMetric
            icon={<CheckCircle2 className="size-5" />}
            label="Active connections"
            value={connected}
            tone="success"
          />
          <DashboardMetric
            icon={<Zap className="size-5" />}
            label="Synced events"
            value={totalEvents}
          />
        </section>

        <section className="soft-panel-enter flex flex-col gap-3 rounded-2xl border border-[#e1e4f8] bg-white p-4 shadow-[0_12px_35px_rgba(89,100,214,0.07)] sm:flex-row sm:items-center sm:justify-between">
          <label className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search integrations…"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
            />
          </label>
          <div className="flex gap-1.5 overflow-x-auto">
            {(
              ["all", "crm", "communication", "calendar", "automation"] as const
            ).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`h-9 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition ${category === item ? "bg-[#5964d6] text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-[#f1f2ff] hover:text-[#5964d6]"}`}
              >
                {item === "all" ? "All" : categoryLabels[item]}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((integration) => (
            <article
              key={integration.id}
              className="soft-lift flex min-h-64 flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#d9ddfa] hover:shadow-[0_18px_45px_rgba(89,100,214,0.12)]"
            >
              <div className="flex items-start justify-between">
                <Logo integration={integration} />
                <StatusBadge status={integration.status} />
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight">
                {integration.name}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {integration.description}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last sync
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {integration.lastSync ?? "Never"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openIntegration(integration.id)}
                  className={`h-9 rounded-lg px-4 text-xs font-semibold transition ${integration.status === "connected" ? "border border-[#e1e4f8] bg-[#f1f2ff] text-[#5964d6] hover:bg-[#e9ebff]" : "bg-[#5964d6] text-white shadow-sm hover:bg-[#4f5acb]"}`}
                >
                  {integration.status === "connected" ? "Configure" : "Connect"}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold tracking-tight">
              Synchronization activity
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest events from connected services
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 px-6 py-4 transition hover:bg-slate-50/60"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${event.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                >
                  {event.status === "success" ? (
                    <Check className="size-4" />
                  ) : (
                    <X className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {event.action}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.integration}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                  <Clock3 className="size-3" />
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selected ? (
        <ConfigPanel
          integration={selected}
          testing={testing}
          tested={tested}
          onClose={() => setSelectedId(null)}
          onTest={testConnection}
          onConnect={() => updateSelected("connected")}
          onDisconnect={() => updateSelected("disconnected")}
        />
      ) : null}
    </main>
  );
}
