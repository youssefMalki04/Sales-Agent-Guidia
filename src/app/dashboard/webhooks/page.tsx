"use client";

import { CheckCircle2, Code2, Link2, Send } from "lucide-react";
import { DashboardMetric, PageIntro } from "@/components/leadia/dashboard-ui";
import { useWebhooks } from "./use-webhooks";
import { WebhookDeliveriesPanel } from "./webhook-deliveries-panel";
import { WebhookEndpointPanel } from "./webhook-endpoint-panel";
import { WebhookEventsPanel } from "./webhook-events-panel";

export default function WebhooksPage() {
  const {
    endpoint,
    url,
    setUrl,
    enabled,
    setEnabled,
    events,
    deliveries,
    secretVisible,
    setSecretVisible,
    copied,
    busy,
    error,
    toast,
    successRate,
    loadWebhooks,
    toggleEvent,
    saveEndpoint,
    testWebhook,
    retryDelivery,
    removeEndpoint,
    copySecret,
  } = useWebhooks();

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-9 text-slate-950 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[1240px] space-y-7">
        <PageIntro
          eyebrow="Developer tools"
          title="Webhooks"
          description="Send signed sales events to your CRM, backend or automation workflows."
          action={
            <button
              type="button"
              onClick={testWebhook}
              disabled={busy === "test" || !endpoint}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Send className="size-4" />
              {busy === "test" ? "Sending…" : "Send test event"}
            </button>
          }
        />
        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            {error}
          </div>
        ) : null}
        <section className="grid gap-4 sm:grid-cols-3">
          <DashboardMetric
            label="Endpoint status"
            value={enabled && endpoint ? "Active" : "Paused"}
            icon={<Link2 className="size-5" />}
            tone={enabled && endpoint ? "success" : "brand"}
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
          <WebhookEndpointPanel
            endpoint={endpoint}
            url={url}
            enabled={enabled}
            secretVisible={secretVisible}
            copied={copied}
            busy={busy}
            setUrl={setUrl}
            setEnabled={setEnabled}
            setSecretVisible={setSecretVisible}
            saveEndpoint={saveEndpoint}
            removeEndpoint={removeEndpoint}
            copySecret={copySecret}
          />
          <WebhookEventsPanel events={events} toggleEvent={toggleEvent} />
        </section>
        <WebhookDeliveriesPanel
          deliveries={deliveries}
          busy={busy}
          loadWebhooks={loadWebhooks}
          retryDelivery={retryDelivery}
        />
      </div>
      {toast ? (
        <div className="fixed left-1/2 top-6 z-[100] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
