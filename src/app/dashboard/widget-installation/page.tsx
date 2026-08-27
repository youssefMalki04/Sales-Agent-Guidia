"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useWidgetInstallation } from "./use-widget-installation";
import {
  WidgetConfigurator,
  WidgetInstallationPanels,
} from "./widget-installation-panels";

export default function WidgetInstallationPage() {
  const {
    name,
    setName,
    welcome,
    setWelcome,
    color,
    setColor,
    position,
    setPosition,
    device,
    setDevice,
    copied,
    verified,
    setVerified,
    snippet,
    copySnippet,
  } = useWidgetInstallation();

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

        <WidgetConfigurator
          name={name}
          welcome={welcome}
          color={color}
          position={position}
          device={device}
          onNameChange={setName}
          onWelcomeChange={setWelcome}
          onColorChange={setColor}
          onPositionChange={setPosition}
          onDeviceChange={setDevice}
        />

        <WidgetInstallationPanels
          snippet={snippet}
          copied={copied}
          verified={verified}
          onCopy={copySnippet}
          onVerify={() => setVerified(true)}
        />
      </div>
    </main>
  );
}
