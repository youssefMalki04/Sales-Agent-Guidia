"use client";

import { useEffect, useMemo, useState } from "react";
import type { WebhookDelivery, WebhookEndpoint } from "./webhook-types";

type WebhooksResponse = {
  endpoint?: WebhookEndpoint | null;
  deliveries?: WebhookDelivery[];
  error?: string;
  migrationRequired?: boolean;
};

export function useWebhooks() {
  const [endpoint, setEndpoint] = useState<WebhookEndpoint | null>(null);
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [events, setEvents] = useState<string[]>([
    "lead.qualified",
    "meeting.booked",
  ]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [secretVisible, setSecretVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<"load" | "save" | "test" | string | null>(
    "load",
  );
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function loadWebhooks() {
    setError(null);
    const response = await fetch("/api/webhooks", { cache: "no-store" });
    const payload = (await response.json()) as WebhooksResponse;

    if (!response.ok) {
      throw new Error(
        payload.migrationRequired
          ? "Run supabase/migrations/015_webhooks.sql in Supabase SQL Editor."
          : (payload.error ?? "Unable to load webhooks"),
      );
    }

    setEndpoint(payload.endpoint ?? null);
    setDeliveries(payload.deliveries ?? []);
    if (payload.endpoint) {
      setUrl(payload.endpoint.url);
      setEnabled(payload.endpoint.enabled);
      setEvents(payload.endpoint.events);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadWebhooks()
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load webhooks",
        ),
      )
      .finally(() => setBusy(null));
  }, []);

  const successRate = useMemo(() => {
    const completed = deliveries.filter(
      (delivery) => delivery.status !== "pending",
    );
    if (!completed.length) return 0;
    const delivered = completed.filter(
      (delivery) => delivery.status === "delivered",
    );
    return Math.round((delivered.length / completed.length) * 100);
  }, [deliveries]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function toggleEvent(name: string) {
    setEvents((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  async function saveEndpoint() {
    if (!url.trim()) return;
    setBusy("save");
    try {
      const response = await fetch("/api/webhooks", {
        method: endpoint ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: endpoint?.id, url, enabled, events }),
      });
      const payload = (await response.json()) as {
        endpoint?: WebhookEndpoint;
        error?: string;
      };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to save endpoint");
      setEndpoint(payload.endpoint ?? null);
      await loadWebhooks();
      showToast("Webhook endpoint saved.");
    } catch (reason) {
      showToast(
        reason instanceof Error ? reason.message : "Unable to save endpoint",
      );
    } finally {
      setBusy(null);
    }
  }

  async function testWebhook() {
    if (!endpoint) return showToast("Save the endpoint first.");
    setBusy("test");
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", endpointId: endpoint.id }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Test failed");
      await loadWebhooks();
      showToast("Test event sent.");
    } catch (reason) {
      showToast(reason instanceof Error ? reason.message : "Test failed");
    } finally {
      setBusy(null);
    }
  }

  async function retryDelivery(id: string) {
    setBusy(id);
    const response = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retry", deliveryId: id }),
    });
    if (!response.ok) showToast("Retry failed");
    else {
      await loadWebhooks();
      showToast("Delivery retried.");
    }
    setBusy(null);
  }

  async function removeEndpoint() {
    if (
      !endpoint ||
      !window.confirm("Delete this webhook and its delivery history?")
    )
      return;
    const response = await fetch(`/api/webhooks?id=${endpoint.id}`, {
      method: "DELETE",
    });
    if (!response.ok) return showToast("Deletion failed");
    setEndpoint(null);
    setUrl("");
    setDeliveries([]);
    showToast("Webhook deleted.");
  }

  async function copySecret() {
    if (!endpoint) return;
    await navigator.clipboard.writeText(endpoint.secret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return {
    endpoint,
    url,
    setUrl,
    enabled,
    setEnabled,
    events,
    deliveries,
    secretVisible,
    setSecretVisible,
    copied,
    busy,
    error,
    toast,
    successRate,
    loadWebhooks,
    toggleEvent,
    saveEndpoint,
    testWebhook,
    retryDelivery,
    removeEndpoint,
    copySecret,
  };
}
