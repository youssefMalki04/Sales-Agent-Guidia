"use client";

import {
  Blocks,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  Mail,
  MessageSquareText,
  RefreshCcw,
  Search,
  Settings2,
  Unplug,
  Webhook,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";

type Category = "crm" | "communication" | "calendar" | "automation";
type IntegrationStatus = "connected" | "disconnected" | "error";
type Integration = {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: IntegrationStatus;
  lastSync: string | null;
  events: number;
  color: string;
};

type SyncEvent = {
  id: string;
  integration: string;
  action: string;
  status: "success" | "failed";
  time: string;
};

const STORAGE_KEY = "leadia-integrations-v1";

const initialIntegrations: Integration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "Send qualified leads, contact properties and conversation summaries to HubSpot CRM.",
    category: "crm",
    status: "connected",
    lastSync: "5 minutes ago",
    events: 148,
    color: "bg-orange-500",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description:
      "Create and update Salesforce leads when visitors reach your qualification threshold.",
    category: "crm",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-sky-500",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Notify sales channels about hot leads, handoffs and booked meetings.",
    category: "communication",
    status: "connected",
    lastSync: "12 minutes ago",
    events: 82,
    color: "bg-violet-600",
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Send follow-up emails and notify account owners after important conversations.",
    category: "communication",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-red-500",
  },
  {
    id: "calendly",
    name: "Calendly",
    description:
      "Offer available slots in the AI conversation and synchronize booked demonstrations.",
    category: "calendar",
    status: "connected",
    lastSync: "31 minutes ago",
    events: 36,
    color: "bg-blue-600",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description:
      "Forward Leadia events to your own backend or automation platform.",
    category: "automation",
    status: "error",
    lastSync: "1 hour ago",
    events: 214,
    color: "bg-[#171717]",
  },
];

const initialEvents: SyncEvent[] = [
  {
    id: "event-1",
    integration: "HubSpot",
    action: "Lead Amira Ben Salah synchronized",
    status: "success",
    time: "5 min ago",
  },
  {
    id: "event-2",
    integration: "Slack",
    action: "Hot lead notification delivered",
    status: "success",
    time: "12 min ago",
  },
  {
    id: "event-3",
    integration: "Calendly",
    action: "Meeting with Sara Trabelsi imported",
    status: "success",
    time: "31 min ago",
  },
  {
    id: "event-4",
    integration: "Webhooks",
    action: "Endpoint returned HTTP 500",
    status: "failed",
    time: "1 hour ago",
  },
];

const categoryLabels: Record<Category, string> = {
  crm: "CRM",
  communication: "Communication",
  calendar: "Calendar",
  automation: "Automation",
};

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

function ConfigPanel({
  integration,
  testing,
  tested,
  onClose,
  onTest,
  onConnect,
  onDisconnect,
}: {
  integration: Integration;
  testing: boolean;
  tested: boolean;
  onClose: () => void;
  onTest: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/25 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <aside className="soft-panel-enter h-full w-full max-w-lg overflow-y-auto border-l border-[#e1e4f8] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Logo integration={integration} />
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {integration.name}
              </h2>
              <div className="mt-2">
                <StatusBadge status={integration.status} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration"
            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#d9ddfa] hover:bg-[#f1f2ff] hover:text-[#5964d6]"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-6 text-sm leading-6 text-slate-500">
          {integration.description}
        </p>
        <section className="mt-7 rounded-2xl border border-[#e1e4f8] bg-[#fafaff] p-5">
          <h3 className="text-sm font-semibold">Connection settings</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Frontend demonstration only. Authentication credentials must be
            configured securely on the backend.
          </p>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace or account
            </span>
            <input
              defaultValue={
                integration.status === "connected"
                  ? `Leadia · ${integration.name}`
                  : ""
              }
              placeholder={`Select your ${integration.name} account`}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#5964d6] focus:ring-4 focus:ring-[#5964d6]/10"
            />
          </label>
          <label className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5">
            <span>
              <b className="block text-sm">Sync qualified leads</b>
              <span className="mt-1 block text-xs text-slate-500">
                Triggered when the score reaches 70.
              </span>
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="size-4 accent-[#5964d6]"
            />
          </label>
          <label className="mt-2 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5">
            <span>
              <b className="block text-sm">Include conversation summary</b>
              <span className="mt-1 block text-xs text-slate-500">
                Add context for the sales team.
              </span>
            </span>
            <input
              type="checkbox"
              defaultChecked
              className="size-4 accent-[#5964d6]"
            />
          </label>
        </section>
        {tested ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-4" />
            Connection test successful.
          </div>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onTest}
            disabled={testing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e4f8] bg-white text-sm font-semibold text-[#5964d6] transition hover:bg-[#f1f2ff] disabled:opacity-50"
          >
            <RefreshCcw className={`size-4 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Testing…" : "Test connection"}
          </button>
          {integration.status === "connected" ? (
            <button
              type="button"
              onClick={onDisconnect}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              <Unplug className="size-4" />
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnect}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5964d6] text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f5acb]"
            >
              <Check className="size-4" />
              Connect
            </button>
          )}
        </div>
        {integration.id === "webhooks" ? (
          <a
            href="/dashboard/webhooks"
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e4f8] text-sm font-semibold text-[#5964d6] transition hover:bg-[#f1f2ff]"
          >
            <Settings2 className="size-4" />
            Open advanced webhook settings
          </a>
        ) : null}
      </aside>
    </div>
  );
}

function Logo({ integration }: { integration: Integration }) {
  const Icon =
    integration.id === "calendly"
      ? CalendarDays
      : integration.id === "gmail"
        ? Mail
        : integration.id === "slack"
          ? MessageSquareText
          : integration.id === "webhooks"
            ? Webhook
            : Cloud;
  return (
    <span
      className={`flex size-11 items-center justify-center rounded-2xl text-white shadow-sm ${integration.color}`}
    >
      <Icon className="size-5" />
    </span>
  );
}
function StatusBadge({ status }: { status: IntegrationStatus }) {
  const styles = {
    connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
    disconnected: "border-[#dedee4] bg-[#f5f5f7] text-[#74747d]",
    error: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${styles[status]}`}
    >
      {status === "disconnected" ? "Not connected" : status}
    </span>
  );
}
