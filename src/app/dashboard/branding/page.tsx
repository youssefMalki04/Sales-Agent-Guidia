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
import Link from "next/link";

import { cx } from "./branding-data";
import { Button, TabButton } from "./branding-controls";
import { BrandTab, EmbedTab, FeaturesTab, MediaTab } from "./branding-tabs";
import { useBranding } from "./use-branding";

export default function BrandingPage() {
  const {
    tab,
    setTab,
    settings,
    update,
    saved,
    save,
    regenerateToken,
    previewOpen,
    setPreviewOpen,
    signatureInput,
    setSignatureInput,
    forbiddenInput,
    setForbiddenInput,
    addPhrase,
    assets,
    setAssets,
    externalLink,
    setExternalLink,
    handleFiles,
    snippet,
    copied,
    setCopied,
    installationStatus,
    setInstallationStatus,
    integrationAgent,
  } = useBranding();

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
            <Button onClick={regenerateToken}>
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
