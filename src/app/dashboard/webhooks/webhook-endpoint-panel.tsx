import { Check, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import type { WebhookEndpoint } from "./webhook-types";

type WebhookEndpointPanelProps = {
  endpoint: WebhookEndpoint | null;
  url: string;
  enabled: boolean;
  secretVisible: boolean;
  copied: boolean;
  busy: string | null;
  setUrl: (url: string) => void;
  setEnabled: (enabled: boolean) => void;
  setSecretVisible: (visible: boolean) => void;
  saveEndpoint: () => void;
  removeEndpoint: () => void;
  copySecret: () => void;
};

export function WebhookEndpointPanel({
  endpoint,
  url,
  enabled,
  secretVisible,
  copied,
  busy,
  setUrl,
  setEnabled,
  setSecretVisible,
  saveEndpoint,
  removeEndpoint,
  copySecret,
}: WebhookEndpointPanelProps) {
  return (
    <article className="rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_14px_40px_rgba(89,100,214,.07)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Endpoint configuration</h2>
          <p className="mt-1 text-sm text-slate-500">
            Choose where Leadia delivers events.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative h-7 w-12 rounded-full ${enabled ? "bg-[#5964d6]" : "bg-slate-300"}`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`}
          />
        </button>
      </div>
      <label className="mt-6 block">
        <span className="mb-2 block text-xs font-bold uppercase text-slate-500">
          Endpoint URL
        </span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://api.yoursite.com/webhooks"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#5964d6]"
        />
      </label>
      <div className="mt-5">
        <span className="mb-2 block text-xs font-bold uppercase text-slate-500">
          Signing secret
        </span>
        <div className="flex items-center gap-2 rounded-xl border bg-slate-50 p-1.5 pl-3">
          <code className="min-w-0 flex-1 truncate text-xs">
            {endpoint
              ? secretVisible
                ? endpoint.secret
                : "••••••••••••••••••••••"
              : "Generated when saved"}
          </code>
          <button
            onClick={() => setSecretVisible(!secretVisible)}
            className="flex size-8 items-center justify-center"
          >
            {secretVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
          <button
            onClick={copySecret}
            disabled={!endpoint}
            className="flex size-8 items-center justify-center"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Verify the `X-Leadia-Signature` header with HMAC-SHA256.
        </p>
      </div>
      <div className="mt-6 flex gap-2">
        <button
          onClick={saveEndpoint}
          disabled={!url || busy === "save"}
          className="h-11 flex-1 rounded-xl bg-[#5964d6] text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy === "save" ? "Saving…" : "Save endpoint"}
        </button>
        <button
          onClick={removeEndpoint}
          disabled={!endpoint}
          className="flex size-11 items-center justify-center rounded-xl border border-red-200 text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}
