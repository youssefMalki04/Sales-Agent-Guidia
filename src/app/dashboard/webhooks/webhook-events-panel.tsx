import { Check, Plus } from "lucide-react";
import { availableWebhookEvents } from "./webhook-types";

type WebhookEventsPanelProps = {
  events: string[];
  toggleEvent: (name: string) => void;
};

export function WebhookEventsPanel({
  events,
  toggleEvent,
}: WebhookEventsPanelProps) {
  return (
    <article className="rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_14px_40px_rgba(89,100,214,.07)]">
      <h2 className="text-lg font-semibold">Event subscriptions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Select updates sent to this endpoint.
      </p>
      <div className="mt-5 space-y-2.5">
        {availableWebhookEvents.map((name) => {
          const selected = events.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleEvent(name)}
              className={`flex w-full items-center justify-between rounded-xl border p-3.5 ${selected ? "border-[#d9ddfa] bg-[#f8f9ff]" : "border-slate-200"}`}
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
                <code className="text-xs font-semibold">{name}</code>
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {selected ? "Enabled" : "Off"}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
