"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CrmPayload, CrmPayloadMetrics } from "./crm-payload-types";

const initialMetrics: CrmPayloadMetrics = {
  today: 0,
  delivered: 0,
  failed: 0,
  successRate: 0,
};

export function useCrmPayloads() {
  const [payloads, setPayloads] = useState<CrmPayload[]>([]);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [target, setTarget] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<CrmPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadPayloads = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch(
        `/api/crm/payloads?target=${target}&status=${status}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as {
        payloads?: CrmPayload[];
        metrics?: CrmPayloadMetrics;
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error ?? "Unable to load CRM payloads");
      setPayloads(data.payloads ?? []);
      setMetrics(data.metrics ?? initialMetrics);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to load CRM payloads",
      );
    } finally {
      setLoading(false);
    }
  }, [status, target]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPayloads(), 0);
    return () => window.clearTimeout(timer);
  }, [loadPayloads]);

  async function retryPayload(id: string) {
    setRetrying(id);
    setNotice("");
    try {
      const response = await fetch("/api/crm/payloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as {
        result?: { message?: string };
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.result?.message ?? data.error ?? "Retry failed");
      setNotice("Payload delivered successfully.");
      setSelected(null);
      await loadPayloads();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Retry failed");
    } finally {
      setRetrying(null);
    }
  }

  const online = useMemo(
    () => !notice || payloads.length > 0,
    [notice, payloads.length],
  );

  return {
    payloads,
    metrics,
    target,
    setTarget,
    status,
    setStatus,
    selected,
    setSelected,
    loading,
    retrying,
    notice,
    online,
    loadPayloads,
    retryPayload,
  };
}
