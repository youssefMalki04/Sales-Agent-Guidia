"use client";

import {
  ArrowLeft,
  Bot,
  Check,
  Code2,
  FileImage,
  Palette,
  RefreshCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { Asset, Settings, Tab } from "./branding-data";
import {
  AGENTS_STORAGE_KEY,
  STORAGE_KEY,
  cx,
  initial,
  makeToken,
} from "./branding-data";
import { Button, TabButton } from "./branding-controls";
import { BrandTab, EmbedTab, FeaturesTab, MediaTab } from "./branding-tabs";

export default function BrandingPage() {
  const [tab, setTab] = useState<Tab>("brand");
  const [settings, setSettings] = useState<Settings>(initial);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [signatureInput, setSignatureInput] = useState("");
  const [forbiddenInput, setForbiddenInput] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [externalLink, setExternalLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [installationStatus, setInstallationStatus] = useState<
    "idle" | "checking" | "installed"
  >("idle");
  const [integrationAgent, setIntegrationAgent] = useState<{
    id: string;
    name: string;
    status: "draft" | "published" | "paused";
  } | null>(null);

  useEffect(() => {
    const restoreSettings = window.setTimeout(() => {
      try {
        const agentId = new URLSearchParams(window.location.search).get(
          "agentId",
        );
        const profiles = JSON.parse(
          localStorage.getItem(AGENTS_STORAGE_KEY) ?? "[]",
        ) as Array<{
          id: string;
          name: string;
          welcomeMessage: string;
          status: "draft" | "published" | "paused";
          integrationStatus?: "not_configured" | "ready";
        }>;
        const agent =
          profiles.find((profile) => profile.id === agentId) ?? null;
        setIntegrationAgent(
          agent
            ? { id: agent.id, name: agent.name, status: agent.status }
            : null,
        );
        if (agent?.integrationStatus === "ready")
          setInstallationStatus("installed");
        const storageKey = agent ? `${STORAGE_KEY}:${agent.id}` : STORAGE_KEY;
        const raw = localStorage.getItem(storageKey);
        if (raw) setSettings({ ...initial, ...JSON.parse(raw) });
        else if (agent)
          setSettings({
            ...initial,
            title: agent.name,
            welcome: agent.welcomeMessage,
          });
      } catch {
        // Ignore malformed or unavailable local storage and keep the defaults.
      }
    }, 0);

    return () => window.clearTimeout(restoreSettings);
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };
  const save = () => {
    const storageKey = integrationAgent
      ? `${STORAGE_KEY}:${integrationAgent.id}`
      : STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const addPhrase = (kind: "signature" | "forbidden") => {
    const text = (
      kind === "signature" ? signatureInput : forbiddenInput
    ).trim();
    if (!text) return;
    if (kind === "signature") {
      update("signaturePhrases", [...settings.signaturePhrases, text]);
      setSignatureInput("");
    } else {
      update("forbiddenPhrases", [...settings.forbiddenPhrases, text]);
      setForbiddenInput("");
    }
  };
  const handleFiles = (
    e: ChangeEvent<HTMLInputElement>,
    kind: Asset["kind"],
  ) => {
    const next = Array.from(e.target.files ?? []).map((f) => ({
      id: `${f.name}-${f.lastModified}`,
      kind,
      name: f.name,
    }));
    setAssets((a) => [...a, ...next]);
    e.target.value = "";
  };
  const snippet = useMemo(
    () =>
      `<script\n  src="https://cdn.guidia.ai/widget.js"\n  data-token="${settings.token}"\n  data-title="${settings.title}"\n  data-color="${settings.color}"\n  data-position="${settings.position}"\n  data-shape="${settings.shape}"\n  defer\n></script>`,
    [settings],
  );

  return (
    <main className="min-h-screen bg-white px-4 py-7 text-zinc-950 sm:px-6 lg:px-10">
      <div className="soft-page-enter mx-auto max-w-[1220px]">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Palette className="size-3.5" /> Customer experience
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Branding studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Shape how your agent looks, sounds and feels across every customer
              touchpoint.
            </p>
          </div>
          <Link
            href="/dashboard/agents"
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-[#f5f6ff] hover:text-[#5964d6]"
          >
            <ArrowLeft className="size-4" /> Back to Agent Studio
          </Link>
        </div>
      </div>
      <div className="mx-auto mb-4 mt-6 flex max-w-[1220px] items-center justify-between">
        {integrationAgent && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Configuring</span>
            <b>{integrationAgent.name}</b>
            <span
              className={cx(
                "rounded-full border px-2.5 py-1 text-xs font-bold uppercase",
                integrationAgent.status === "published"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700",
              )}
            >
              {integrationAgent.status}
            </span>
          </div>
        )}
      </div>
      {integrationAgent && integrationAgent.status !== "published" && (
        <div className="mx-auto mb-4 max-w-[1220px] rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This Agent is not published. Publish it again before copying or
          verifying the integration.
        </div>
      )}
      <section className="soft-panel-enter mx-auto max-w-[1220px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
        <header className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3 font-semibold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
              <Bot className="size-5" />
            </span>
            {settings.title || "Super assistant"}
          </div>
          <nav className="flex flex-wrap justify-center gap-1 rounded-2xl bg-slate-50/80 p-1.5">
            <TabButton
              active={tab === "brand"}
              onClick={() => setTab("brand")}
              icon={Palette}
            >
              Brand
            </TabButton>
            <TabButton
              active={tab === "features"}
              onClick={() => setTab("features")}
              icon={Sparkles}
            >
              Features
            </TabButton>
            <TabButton
              active={tab === "media"}
              onClick={() => setTab("media")}
              icon={FileImage}
            >
              Media kit
            </TabButton>
            <TabButton
              active={tab === "embed"}
              onClick={() => setTab("embed")}
              icon={Code2}
            >
              Embed
            </TabButton>
          </nav>
          <div className="flex gap-2">
            <Button dark onClick={save}>
              {saved ? (
                <Check className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              onClick={() => {
                update("token", makeToken());
                update("tokenCreatedAt", new Date().toISOString());
              }}
            >
              <RefreshCcw className="size-4" />
              Regenerate token
            </Button>
          </div>
        </header>

        {tab === "brand" && (
          <BrandTab
            settings={settings}
            update={update}
            open={previewOpen}
            setOpen={setPreviewOpen}
          />
        )}
        {tab === "features" && (
          <FeaturesTab
            settings={settings}
            update={update}
            signatureInput={signatureInput}
            setSignatureInput={setSignatureInput}
            forbiddenInput={forbiddenInput}
            setForbiddenInput={setForbiddenInput}
            addPhrase={addPhrase}
          />
        )}
        {tab === "media" && (
          <MediaTab
            assets={assets}
            setAssets={setAssets}
            externalLink={externalLink}
            setExternalLink={setExternalLink}
            handleFiles={handleFiles}
          />
        )}
        {tab === "embed" && (
          <EmbedTab
            settings={settings}
            update={update}
            snippet={snippet}
            copied={copied}
            setCopied={setCopied}
            installationStatus={installationStatus}
            setInstallationStatus={setInstallationStatus}
            integrationAgent={integrationAgent}
          />
        )}
      </section>
    </main>
  );
}
