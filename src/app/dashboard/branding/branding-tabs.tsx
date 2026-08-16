"use client";

/* eslint-disable @next/next/no-img-element -- Optional preview assets may hide on error. */

import type React from "react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Check,
  Clipboard,
  FileImage,
  FileText,
  Globe2,
  Link2,
  Loader2,
  RefreshCcw,
  Star,
  Upload,
  Video,
  X,
} from "lucide-react";

import { Button, Input, Label, Select, Textarea } from "./branding-controls";
import type {
  Asset,
  Persona,
  Position,
  Settings,
  Shape,
} from "./branding-data";
import { AGENTS_STORAGE_KEY, cx, iconOptions, voices } from "./branding-data";

export function BrandTab({
  settings,
  update,
  open,
  setOpen,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const SelectedIcon =
    iconOptions.find(([id]) => id === settings.icon)?.[1] ?? Star;
  const positionClass = (
    {
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
      "right-rail": "right-0 top-1/2 -translate-y-1/2",
      "left-rail": "left-0 top-1/2 -translate-y-1/2",
    } as const
  )[settings.position];
  const rail = settings.position.includes("rail");
  return (
    <div className="grid min-h-[700px] lg:grid-cols-[1fr_1.03fr]">
      <div className="space-y-5 border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
        <div>
          <Label>Widget title</Label>
          <Input
            value={settings.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Avatar persona</Label>
            <Select
              value={settings.persona}
              onChange={(v) => update("persona", v as Persona)}
            >
              <option value="female">Female (default)</option>
              <option value="male">Male</option>
              <option value="none">No avatar (audio animation)</option>
            </Select>
          </div>
          <div>
            <Label>Avatar voice</Label>
            <Select value={settings.voice} onChange={(v) => update("voice", v)}>
              {voices.map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>Welcome message</Label>
          <Textarea
            rows={4}
            value={settings.welcome}
            onChange={(e) => update("welcome", e.target.value)}
          />
        </div>
        <div>
          <Label>Primary color</Label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-11 w-14 rounded-md border border-zinc-200 p-1"
            />
            <Input
              value={settings.color}
              onChange={(e) => update("color", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Position</Label>
          <Select
            value={settings.position}
            onChange={(v) => update("position", v as Position)}
          >
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
            <option value="right-rail">Right rail</option>
            <option value="left-rail">Left rail</option>
          </Select>
        </div>
        <div>
          <Label>Panel shape</Label>
          <Select
            value={settings.shape}
            onChange={(v) => update("shape", v as Shape)}
          >
            <option value="rounded">Rounded corners</option>
            <option value="square">Square corners (classic)</option>
          </Select>
        </div>
        <div>
          <Label>Bubble icon</Label>
          <div className="grid grid-cols-7 gap-2">
            {iconOptions.map(([id, Icon]) => (
              <button
                type="button"
                key={id}
                onClick={() => update("icon", id)}
                className={cx(
                  "flex aspect-square items-center justify-center rounded-xl border transition",
                  settings.icon === id
                    ? "border-[#939ae2] bg-[#f1f2ff] text-[#5964d6] ring-1 ring-[#939ae2]"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative min-h-[700px] overflow-hidden bg-gradient-to-b from-[#f8faff] to-[#eef2ff]">
        <div className={cx("absolute z-10", positionClass)}>
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              style={{ borderColor: settings.color, color: settings.color }}
              className={cx(
                "flex items-center gap-3 border-2 bg-white px-5 py-4 text-sm font-semibold shadow-lg",
                rail
                  ? settings.position === "right-rail"
                    ? "rounded-l-2xl border-r-0"
                    : "rounded-r-2xl border-l-0"
                  : "rounded-full",
              )}
            >
              <SelectedIcon className="size-5" />
              {rail ? null : settings.title}
            </button>
          ) : (
            <div
              style={{ borderColor: settings.color }}
              className={cx(
                "w-[calc(100vw-48px)] max-w-[360px] overflow-hidden border bg-white shadow-2xl",
                settings.shape === "rounded" ? "rounded-2xl" : "rounded-none",
              )}
            >
              <div className="flex h-14 items-center justify-between border-b px-4">
                <div
                  style={{ color: settings.color }}
                  className="flex items-center gap-2 font-semibold"
                >
                  <SelectedIcon className="size-4" />
                  {settings.title}
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative flex h-[450px] items-center justify-center overflow-hidden bg-[#030617]">
                {settings.persona === "none" ? (
                  <div className="px-8 text-center">
                    <div
                      style={{ backgroundColor: settings.color }}
                      className="mx-auto flex size-20 items-center justify-center rounded-full text-white"
                    >
                      <SelectedIcon className="size-9" />
                    </div>
                    <p className="mt-6 text-lg font-semibold text-white">
                      {settings.welcome}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* A native image preserves the preview's graceful missing-asset fallback. */}
                    <img
                      src={
                        settings.persona === "male"
                          ? "/avatar-male.png"
                          : "/avatar-female.png"
                      }
                      alt="Avatar"
                      className="absolute inset-0 size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    <span className="absolute bottom-6 rounded-full bg-zinc-950/85 px-4 py-2 text-xs text-white">
                      {settings.welcome}
                    </span>
                  </>
                )}
              </div>
              <div className="flex h-12 items-center gap-2 border-t px-4 text-xs text-zinc-500">
                <Upload className="size-4" />
                Attach a document or image to send in the chat.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturesTab({
  settings,
  update,
  signatureInput,
  setSignatureInput,
  forbiddenInput,
  setForbiddenInput,
  addPhrase,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  signatureInput: string;
  setSignatureInput: (v: string) => void;
  forbiddenInput: string;
  setForbiddenInput: (v: string) => void;
  addPhrase: (k: "signature" | "forbidden") => void;
}) {
  return (
    <div className="space-y-5 bg-[#fafafd] p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <Label>Deployment mode</Label>
        <div className="max-w-xl">
          <Select
            value={settings.deployment}
            onChange={(v) => update("deployment", v as Settings["deployment"])}
          >
            <option value="embedded">
              Embedded in app (support + autonomy)
            </option>
            <option value="marketing">
              Marketing website (lead-gen + external demos)
            </option>
          </Select>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Arrival behavior</h2>
        <p className="mt-1 text-sm text-zinc-500">
          How the widget presents itself to the visitor the FIRST time they land
          on the site.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <Label>Default display</Label>
            <Select
              value={settings.display}
              onChange={(v) => update("display", v as Settings["display"])}
            >
              <option value="closed">Closed bubble (click to open)</option>
              <option value="open">Side panel - open immediately</option>
            </Select>
          </div>
          <div>
            <Label>Conversation start</Label>
            <Select
              value={settings.conversationStart}
              onChange={(v) =>
                update("conversationStart", v as Settings["conversationStart"])
              }
            >
              <option value="visitor">
                Visitor clicks to start (recommended for B2B)
              </option>
              <option value="arrival">
                Agent speaks on arrival (showcase / lead-gen)
              </option>
            </Select>
          </div>
          <div>
            <Label>Agent starting language</Label>
            <Select
              value={settings.language}
              onChange={(v) => update("language", v)}
            >
              {[
                "English",
                "Français",
                "Español",
                "Deutsch",
                "Italiano",
                "Português",
                "Nederlands",
                "Svenska",
                "Türkçe",
                "العربية",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <Label>Agent personality</Label>
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <Label>Tone</Label>
            <Select value={settings.tone} onChange={(v) => update("tone", v)}>
              <option value="default">Default (warm, natural)</option>
              <option value="warm">
                Warm: Natural, like a helpful colleague
              </option>
              <option value="casual">
                Casual: Informal, everyday language
              </option>
              <option value="professional">
                Professional: Formal, measured
              </option>
              <option value="energetic">
                Energetic: Engaged, shows interest
              </option>
              <option value="attentive">
                Attentive: Recognizes emotions, unblocks
              </option>
            </Select>
          </div>
          <div>
            <Label>Humor</Label>
            <Select value={settings.humor} onChange={(v) => update("humor", v)}>
              <option value="light">Default (light)</option>
              <option value="0">0: None</option>
              <option value="1">1: Light</option>
              <option value="2">2: Bold</option>
              <option value="3">3: Playful</option>
            </Select>
          </div>
          <div>
            <Label>Address form</Label>
            <Select
              value={settings.address}
              onChange={(v) => update("address", v)}
            >
              <option value="automatic">Default (automatic)</option>
              <option value="follow">Automatic (follows the user)</option>
              <option value="tu">Always informal (tu)</option>
              <option value="vous">Always formal (vous)</option>
            </Select>
          </div>
        </div>
        <div className="mt-5">
          <Label>Free persona description</Label>
          <Textarea
            rows={4}
            maxLength={500}
            value={settings.personaDescription}
            onChange={(e) => update("personaDescription", e.target.value)}
            placeholder="E.g. You're Léa, a sales advisor at Acme..."
          />
          <p className="mt-1 text-xs text-zinc-400">
            {settings.personaDescription.length} / 500 characters
          </p>
        </div>
        <Phrase
          label="Signature phrases (used naturally)"
          value={signatureInput}
          setValue={setSignatureInput}
          add={() => addPhrase("signature")}
          phrases={settings.signaturePhrases}
          remove={(i) =>
            update(
              "signaturePhrases",
              settings.signaturePhrases.filter((_, x) => x !== i),
            )
          }
        />
        <Phrase
          label="Forbidden phrases (never said, even rephrased)"
          value={forbiddenInput}
          setValue={setForbiddenInput}
          add={() => addPhrase("forbidden")}
          phrases={settings.forbiddenPhrases}
          remove={(i) =>
            update(
              "forbiddenPhrases",
              settings.forbiddenPhrases.filter((_, x) => x !== i),
            )
          }
          red
        />
      </section>
    </div>
  );
}

function Phrase({
  label,
  value,
  setValue,
  add,
  phrases,
  remove,
  red = false,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  add: () => void;
  phrases: string[];
  remove: (i: number) => void;
  red?: boolean;
}) {
  return (
    <div className="mt-5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={
            red
              ? 'E.g. "As an AI assistant..."'
              : 'E.g. "Got it, I’ll note that for you"'
          }
        />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {phrases.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className={cx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              red ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700",
            )}
          >
            {p}
            <button onClick={() => remove(i)}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MediaTab({
  assets,
  setAssets,
  externalLink,
  setExternalLink,
  handleFiles,
}: {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  externalLink: string;
  setExternalLink: (v: string) => void;
  handleFiles: (e: ChangeEvent<HTMLInputElement>, kind: Asset["kind"]) => void;
}) {
  const cards = [
    ["pdf", FileText, "Upload PDF", ".pdf"],
    ["video", Video, "Upload video", "video/*"],
    ["image", FileImage, "Upload image", "image/*"],
  ] as const;
  return (
    <div className="min-h-[650px] bg-[#fafafd] p-6">
      <p className="mb-5 text-sm text-zinc-500">
        Upload PDFs, videos, images and links your AI agent can show visitors
        during a sales conversation.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([kind, Icon, title, accept]) => (
          <label
            key={kind}
            className="soft-lift cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <input
              type="file"
              accept={accept}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e, kind)}
            />
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
              <Icon className="size-5" />
            </span>
            <span className="mt-4 block font-semibold">{title}</span>
            <span className="mt-1 block text-xs text-zinc-500">{accept}</span>
          </label>
        ))}
        <div className="soft-lift rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#5964d6] text-white">
            <Link2 className="size-5" />
          </span>
          <h3 className="mt-4 font-semibold">Add link or external demo</h3>
          <div className="mt-4 flex gap-2">
            <Input
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
            />
            <Button
              onClick={() => {
                const v = externalLink.trim();
                if (!v) return;
                setAssets((a) => [
                  ...a,
                  { id: `${v}-${Date.now()}`, kind: "link", name: v },
                ]);
                setExternalLink("");
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      {assets.length ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg border bg-white p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.name}</p>
                <p className="text-xs uppercase text-zinc-400">{a.kind}</p>
              </div>
              <button
                onClick={() => setAssets((x) => x.filter((y) => y.id !== a.id))}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-sm text-zinc-500">
          No assets yet. Start by uploading a brochure PDF or pasting a YouTube
          link.
        </div>
      )}
    </div>
  );
}

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
              Frontend simulation: backend verification will be connected later.
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
