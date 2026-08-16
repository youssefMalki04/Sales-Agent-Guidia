"use client";

import {
  CalendarDays,
  Check,
  CheckCircle2,
  Cloud,
  Mail,
  MessageSquareText,
  RefreshCcw,
  Settings2,
  Unplug,
  Webhook,
  X,
} from "lucide-react";

import type { Integration, IntegrationStatus } from "./integration-types";

export function ConfigPanel({
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

export function Logo({ integration }: { integration: Integration }) {
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
export function StatusBadge({ status }: { status: IntegrationStatus }) {
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
