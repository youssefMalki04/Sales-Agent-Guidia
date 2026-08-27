"use client";

import { useState } from "react";
import { Check, Clipboard, Globe2, Loader2, RefreshCcw } from "lucide-react";
import { Button, Input, Label } from "./branding-controls";
import type { Settings } from "./branding-data";
import { AGENTS_STORAGE_KEY, cx } from "./branding-data";

export function EmbedTab({
  settings,
  update,
  snippet,
  copied,
  setCopied,
  installationStatus,
  setInstallationStatus,
  integrationAgent,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  snippet: string;
  copied: boolean;
  setCopied: (v: boolean) => void;
  installationStatus: "idle" | "checking" | "installed";
  setInstallationStatus: (v: "idle" | "checking" | "installed") => void;
  integrationAgent: {
    id: string;
    name: string;
    status: "draft" | "published" | "paused";
  } | null;
}) {
  const [renderedAt] = useState(() => Date.now());
  const remaining = Math.max(
    0,
    Math.ceil(
      (new Date(settings.tokenCreatedAt).getTime() +
        90 * 86400000 -
        renderedAt) /
        86400000,
    ),
  );
  const checklist = [
    ["Widget customized", Boolean(settings.title && settings.color)],
    ["Authorized domain added", Boolean(settings.allowedDomain.trim())],
    ["Embed code copied", copied],
    ["Installation verified", installationStatus === "installed"],
  ] as const;
  const verify = () => {
    if (!settings.allowedDomain.trim() || installationStatus === "checking")
      return;
    setInstallationStatus("checking");
    window.setTimeout(() => {
      setInstallationStatus("installed");
      if (integrationAgent) {
        try {
          const profiles = JSON.parse(
            localStorage.getItem(AGENTS_STORAGE_KEY) ?? "[]",
          ) as Array<Record<string, unknown> & { id: string }>;
          localStorage.setItem(
            AGENTS_STORAGE_KEY,
            JSON.stringify(
              profiles.map((profile) =>
                profile.id === integrationAgent.id
                  ? {
                      ...profile,
                      integrationStatus: "ready",
                      updatedAt: new Date().toLocaleString("fr-FR"),
                    }
                  : profile,
              ),
            ),
          );
        } catch {
          // Keep the widget verification usable even if demo agent data is malformed.
        }
      }
    }, 1200);
  };
  return (
    <div className="min-h-[650px] space-y-4 bg-[#fafafa] p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="rounded-lg border bg-white p-4">
            <Label>Authorized website domain</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={settings.allowedDomain}
                  onChange={(event) => {
                    update("allowedDomain", event.target.value);
                    setInstallationStatus("idle");
                  }}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
              <Button onClick={verify}>
                {installationStatus === "checking" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : installationStatus === "installed" ? (
                  <Check className="size-4" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                {installationStatus === "checking"
                  ? "Checking…"
                  : installationStatus === "installed"
                    ? "Installed"
                    : "Verify"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Verify that the widget is available on the configured domain.
            </p>
          </section>
          <section className="rounded-lg border bg-zinc-50 p-4 text-sm">
            <p>
              <b>Token validity (data-token)</b>
              <span className="ml-2 text-zinc-500">90 days (2160 h)</span>
            </p>
            <p className="mt-2">
              <b>Time remaining</b>
              <span className="ml-2 text-zinc-500">{remaining} days left</span>
            </p>
          </section>
          <details className="rounded-lg border bg-white">
            <summary className="cursor-pointer px-4 py-4 font-semibold">
              Best practices - token & integration
            </summary>
            <div className="border-t px-4 py-4 text-sm text-zinc-600">
              Keep this token private and regenerate it after a leak.
            </div>
          </details>
          <section className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Works with every framework</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              HTML: paste as-is. Next.js: use next/script in app/layout.tsx.
              React: paste in public/index.html. Vue/Nuxt: add it with
              useHead().
            </p>
          </section>
        </div>
        <section className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Installation checklist</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Complete these steps to launch the widget.
          </p>
          <div className="mt-5 space-y-3">
            {checklist.map(([label, done]) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={cx(
                    "flex size-6 items-center justify-center rounded-full border",
                    done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "text-zinc-400",
                  )}
                >
                  {done && <Check className="size-3.5" />}
                </span>
                <span className={done ? "font-semibold" : "text-zinc-500"}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Button
        onClick={async () => {
          await navigator.clipboard.writeText(snippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? (
          <Check className="size-4" />
        ) : (
          <Clipboard className="size-4" />
        )}
        {copied ? "Copied" : "Copy snippet"}
      </Button>
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#07101f]">
        <div className="border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">
          Client snippet
        </div>
        <pre className="overflow-x-auto p-5 text-sm leading-6 text-slate-200">
          <code>{snippet}</code>
        </pre>
      </section>
    </div>
  );
}
