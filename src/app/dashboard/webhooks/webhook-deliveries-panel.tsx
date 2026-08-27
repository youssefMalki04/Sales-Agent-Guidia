import { Check, Clock3, Loader2, RefreshCcw, RotateCcw, X } from "lucide-react";
import type { WebhookDelivery } from "./webhook-types";

type WebhookDeliveriesPanelProps = {
  deliveries: WebhookDelivery[];
  busy: string | null;
  loadWebhooks: () => Promise<void>;
  retryDelivery: (id: string) => void;
};

export function WebhookDeliveriesPanel({
  deliveries,
  busy,
  loadWebhooks,
  retryDelivery,
}: WebhookDeliveriesPanelProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h2 className="font-semibold">Recent deliveries</h2>
          <p className="mt-1 text-xs text-slate-500">
            HTTP response, duration and attempts
          </p>
        </div>
        <button
          onClick={() => loadWebhooks().catch(() => undefined)}
          className="flex size-9 items-center justify-center rounded-xl border text-[#5964d6]"
        >
          <RefreshCcw className="size-4" />
        </button>
      </div>
      <div className="divide-y">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-6 py-4 sm:grid-cols-[1fr_100px_80px_80px_80px]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${delivery.status === "delivered" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                {delivery.status === "delivered" ? (
                  <Check className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
              </span>
              <div className="min-w-0">
                <code className="block truncate text-xs font-semibold">
                  {delivery.event_type}
                </code>
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {delivery.response_body || "No response body"}
                </p>
              </div>
            </div>
            <span className="hidden text-xs capitalize sm:block">
              {delivery.status}
            </span>
            <code className="hidden text-xs sm:block">
              HTTP {delivery.response_code ?? "—"}
            </code>
            <span className="hidden text-xs text-slate-500 sm:block">
              {delivery.duration_ms ?? 0}ms
            </span>
            <button
              onClick={() => retryDelivery(delivery.id)}
              disabled={busy === delivery.id}
              className="flex items-center justify-end gap-1 text-xs text-[#5964d6]"
            >
              <RotateCcw
                className={`size-3.5 ${busy === delivery.id ? "animate-spin" : ""}`}
              />{" "}
              Retry
            </button>
          </div>
        ))}
        {busy === "load" ? (
          <div className="py-12">
            <Loader2 className="mx-auto size-6 animate-spin" />
          </div>
        ) : null}
        {!deliveries.length && busy !== "load" ? (
          <div className="py-12 text-center text-sm text-slate-500">
            <Clock3 className="mx-auto mb-2 size-5" />
            No deliveries yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
