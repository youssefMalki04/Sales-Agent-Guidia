"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

import type { Asset, Settings, Tab } from "./branding-data";
import {
  AGENTS_STORAGE_KEY,
  initial,
  makeToken,
  STORAGE_KEY,
} from "./branding-data";

type IntegrationAgent = {
  id: string;
  name: string;
  status: "draft" | "published" | "paused";
};

type AgentProfile = IntegrationAgent & {
  welcomeMessage: string;
  integrationStatus?: "not_configured" | "ready";
};

export function useBranding() {
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
  const [integrationAgent, setIntegrationAgent] =
    useState<IntegrationAgent | null>(null);

  useEffect(() => {
    const restoreSettings = window.setTimeout(() => {
      try {
        const agentId = new URLSearchParams(window.location.search).get(
          "agentId",
        );
        const profiles = JSON.parse(
          localStorage.getItem(AGENTS_STORAGE_KEY) ?? "[]",
        ) as AgentProfile[];
        const agent =
          profiles.find((profile) => profile.id === agentId) ?? null;

        setIntegrationAgent(
          agent
            ? { id: agent.id, name: agent.name, status: agent.status }
            : null,
        );
        if (agent?.integrationStatus === "ready") {
          setInstallationStatus("installed");
        }

        const storageKey = agent ? `${STORAGE_KEY}:${agent.id}` : STORAGE_KEY;
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          setSettings({ ...initial, ...JSON.parse(raw) });
        } else if (agent) {
          setSettings({
            ...initial,
            title: agent.name,
            welcome: agent.welcomeMessage,
          });
        }
      } catch {
        // Keep the defaults when local storage is unavailable or malformed.
      }
    }, 0);

    return () => window.clearTimeout(restoreSettings);
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    const storageKey = integrationAgent
      ? `${STORAGE_KEY}:${integrationAgent.id}`
      : STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const regenerateToken = () => {
    update("token", makeToken());
    update("tokenCreatedAt", new Date().toISOString());
  };

  const addPhrase = (kind: "signature" | "forbidden") => {
    const text = (
      kind === "signature" ? signatureInput : forbiddenInput
    ).trim();
    if (!text) return;

    if (kind === "signature") {
      update("signaturePhrases", [...settings.signaturePhrases, text]);
      setSignatureInput("");
      return;
    }

    update("forbiddenPhrases", [...settings.forbiddenPhrases, text]);
    setForbiddenInput("");
  };

  const handleFiles = (
    event: ChangeEvent<HTMLInputElement>,
    kind: Asset["kind"],
  ) => {
    const next = Array.from(event.target.files ?? []).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      kind,
      name: file.name,
    }));
    setAssets((current) => [...current, ...next]);
    event.target.value = "";
  };

  const snippet = useMemo(
    () =>
      `<script\n  src="https://cdn.guidia.ai/widget.js"\n  data-token="${settings.token}"\n  data-title="${settings.title}"\n  data-color="${settings.color}"\n  data-position="${settings.position}"\n  data-shape="${settings.shape}"\n  defer\n></script>`,
    [settings],
  );

  return {
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
  };
}
