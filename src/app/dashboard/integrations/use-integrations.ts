"use client";

import { useEffect, useMemo, useState } from "react";
import { integrationCatalog } from "./integration-data";
import type { Category, Integration, SyncEvent } from "./integration-types";

type TestResult = { ok: boolean; message: string };

export function useIntegrations() {
  const [integrations, setIntegrations] = useState(integrationCatalog);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadIntegrations() {
    setLoading(true);
    try {
      const response = await fetch("/api/integrations", { cache: "no-store" });
      const payload = (await response.json()) as {
        services?: Integration[];
        activity?: SyncEvent[];
        error?: string;
      };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to load integrations");
      setIntegrations(
        integrationCatalog.map((item) => ({
          ...item,
          ...(payload.services?.find((service) => service.id === item.id) ??
            {}),
        })),
      );
      setEvents(payload.activity ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadIntegrations(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredIntegrations = useMemo(
    () =>
      integrations.filter((integration) => {
        const term = query.trim().toLowerCase();
        return (
          (category === "all" || integration.category === category) &&
          (!term ||
            `${integration.name} ${integration.description}`
              .toLowerCase()
              .includes(term))
        );
      }),
    [category, integrations, query],
  );

  const selectedIntegration =
    integrations.find((integration) => integration.id === selectedId) ?? null;
  const connectedCount = integrations.filter(
    (integration) => integration.status === "connected",
  ).length;
  const totalEvents = integrations.reduce(
    (total, integration) => total + integration.events,
    0,
  );

  async function testConnection() {
    if (!selectedIntegration) return;
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedIntegration.id }),
      });
      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };
      setTestResult({
        ok: response.ok,
        message: payload.message ?? payload.error ?? "Connection test failed",
      });
      if (response.ok) await loadIntegrations();
    } catch (error) {
      setTestResult({
        ok: false,
        message:
          error instanceof Error ? error.message : "Connection test failed",
      });
    } finally {
      setTesting(false);
    }
  }

  function openIntegration(id: string) {
    setSelectedId(id);
    setTestResult(null);
  }

  return {
    integrations,
    events,
    query,
    setQuery,
    category,
    setCategory,
    selectedIntegration,
    setSelectedId,
    testing,
    testResult,
    loading,
    filteredIntegrations,
    connectedCount,
    totalEvents,
    testConnection,
    openIntegration,
  };
}
