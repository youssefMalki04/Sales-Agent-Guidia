"use client";

import {
  CalendarDays,
  CheckCircle2,
  Cloud,
  Mail,
  MessageSquareText,
  RefreshCcw,
  Settings2,
  Webhook,
  X,
} from "lucide-react";

import type { Integration, IntegrationStatus } from "./integration-types";

export function ConfigPanel({
  integration,
  testing,
  testResult,
  onClose,
  onTest,
}: {
  integration: Integration;
  testing: boolean;
  testResult: { ok: boolean; message: string } | null;
  onClose: () => void;
  onTest: () => void;
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
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {integration.detail ?? "Configuration status unavailable."}
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Secrets remain server-side in <code>.env.local</code> and are never
            exposed here.
          </p>
        </section>
        {testResult ? (
          <div
            className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${testResult.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
          >
            <CheckCircle2 className="size-4" />
            {testResult.message}
          </div>
        ) : null}
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={onTest}
            disabled={testing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e4f8] bg-white text-sm font-semibold text-[#5964d6] transition hover:bg-[#f1f2ff] disabled:opacity-50"
          >
            <RefreshCcw className={`size-4 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Testing…" : "Test connection"}
          </button>
        </div>
        {integration.actionHref ? (
          <a
            href={integration.actionHref}
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e4f8] text-sm font-semibold text-[#5964d6] transition hover:bg-[#f1f2ff]"
          >
            <Settings2 className="size-4" />
            Open configuration
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
