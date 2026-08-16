"use client";

import {
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  ExternalLink,
  MessageCircle,
  Monitor,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { steps } from "./widget-data";
import type { Device, Position } from "./widget-types";
import { DeviceButton, Field } from "./widget-ui";

export default function WidgetInstallationPage() {
  const [name, setName] = useState("Leadia Sales Assistant");
  const [welcome, setWelcome] = useState(
    "Bonjour ! Comment puis-je vous aider aujourd’hui ?",
  );
  const [color, setColor] = useState("#5964d6");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [device, setDevice] = useState<Device>("desktop");
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const snippet = useMemo(
    () => `<script
  src="https://cdn.leadia.ai/widget.js"
  data-agent-id="agent_9b64f780"
  data-color="${color}"
  data-position="${position}"
  defer
></script>`,
    [color, position],
  );

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="soft-page-enter min-h-[calc(100vh-76px)] bg-white px-5 py-9 text-slate-950 sm:px-8 xl:px-14">
      <div className="mx-auto max-w-[1240px] space-y-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5964d6]">
              Website experience
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Widget installation
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Configure the visitor experience, preview it and copy the code to
              your website.
            </p>
          </div>
          <Link
            href="/demo/widget"
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e4f8] bg-white px-4 text-sm font-semibold text-[#5964d6] shadow-sm transition hover:bg-[#f1f2ff]"
          >
            Open demo site <ExternalLink className="size-4" />
          </Link>
        </header>

        <section className="soft-panel-enter grid overflow-hidden rounded-3xl border border-[#e1e4f8] bg-white shadow-[0_16px_50px_rgba(89,100,214,0.08)] lg:grid-cols-[420px_1fr]">
          <div className="space-y-5 border-b border-[#e1e4f8] p-6 lg:border-b-0 lg:border-r">
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="mt-1 text-sm text-slate-500">
                These settings update the preview instantly.
              </p>
            </div>

            <Field label="Assistant name">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
              />
            </Field>
            <Field label="Welcome message">
              <textarea
                value={welcome}
                onChange={(event) => setWelcome(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
              />
            </Field>
            <Field label="Brand color">
              <div className="flex gap-3">
                <input
                  aria-label="Brand color picker"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-11 w-14 rounded-xl border border-slate-200 bg-white p-1"
                />
                <input
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-mono text-sm uppercase outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
                />
              </div>
            </Field>
            <Field label="Widget position">
              <div className="grid grid-cols-2 gap-2">
                {(["bottom-left", "bottom-right"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPosition(value)}
                    className={`h-11 rounded-xl border text-sm font-semibold transition ${
                      position === value
                        ? "border-[#5964d6] bg-[#5964d6] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-500 hover:border-[#d9ddfa] hover:bg-[#f1f2ff] hover:text-[#5964d6]"
                    }`}
                  >
                    {value === "bottom-left" ? "Bottom left" : "Bottom right"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="bg-gradient-to-br from-[#f8f9ff] to-[#f1f2ff] p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Live preview</h2>
                <p className="mt-1 text-xs text-slate-500">Customer website</p>
              </div>
              <div className="flex rounded-xl border border-[#e1e4f8] bg-white p-1 shadow-sm">
                <DeviceButton
                  active={device === "desktop"}
                  label="Desktop"
                  onClick={() => setDevice("desktop")}
                  icon={<Monitor className="size-4" />}
                />
                <DeviceButton
                  active={device === "mobile"}
                  label="Mobile"
                  onClick={() => setDevice("mobile")}
                  icon={<Smartphone className="size-4" />}
                />
              </div>
            </div>

            <div
              className={`relative mx-auto min-h-[470px] overflow-hidden rounded-2xl border border-[#e1e4f8] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all ${
                device === "mobile" ? "max-w-[330px]" : "max-w-none"
              }`}
            >
              <div className="flex h-14 items-center gap-2 border-b px-5">
                <span className="size-3 rounded-full bg-[#ff6b67]" />
                <span className="size-3 rounded-full bg-[#f4bd4f]" />
                <span className="size-3 rounded-full bg-[#62c554]" />
                <div className="ml-3 h-7 flex-1 rounded-md bg-[#f1f1f3]" />
              </div>
              <div className="space-y-4 p-6">
                <div className="h-7 w-2/3 rounded bg-[#e9e9ed]" />
                <div className="h-3 w-full rounded bg-[#f0f0f2]" />
                <div className="h-3 w-4/5 rounded bg-[#f0f0f2]" />
                <div className="grid grid-cols-3 gap-3 pt-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-24 rounded-lg bg-[#f4f4f6]" />
                  ))}
                </div>
              </div>
              <div
                className={`absolute bottom-5 ${
                  position === "bottom-right" ? "right-5" : "left-5"
                }`}
              >
                <div className="mb-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div
                    className="flex items-center gap-3 px-4 py-3 text-white"
                    style={{ backgroundColor: color }}
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
                      <MessageCircle className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{name}</p>
                      <p className="text-[11px] text-white/75">Online</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-600">
                      {welcome}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Open widget preview"
                  className="ml-auto flex size-13 items-center justify-center rounded-full text-white shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  <MessageCircle className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <div className="soft-lift rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_12px_35px_rgba(89,100,214,0.07)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Code2 className="size-5" /> Installation code
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Paste this code once, just before the closing body tag.
                </p>
              </div>
              <button
                type="button"
                onClick={copySnippet}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f5acb]"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Clipboard className="size-4" />
                )}
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
            <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-indigo-100 shadow-inner">
              <code>{snippet}</code>
            </pre>
          </div>

          <div className="soft-lift rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_12px_35px_rgba(89,100,214,0.07)]">
            <h2 className="text-lg font-semibold">Setup checklist</h2>
            <div className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f1f2ff] text-xs font-bold text-[#5964d6]">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-slate-600">{step}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setVerified(true)}
              className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${verified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#e1e4f8] text-[#5964d6] hover:bg-[#f1f2ff]"}`}
            >
              <CheckCircle2
                className={`size-4 ${verified ? "text-emerald-600" : ""}`}
              />
              {verified ? "Widget detected" : "Verify installation"}
            </button>
            {verified ? (
              <p className="mt-3 text-center text-xs font-medium text-emerald-700">
                Frontend demo verification completed.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
