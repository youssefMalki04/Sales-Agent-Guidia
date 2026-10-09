"use client";
import { useEffect, useState } from "react";
import type { Period } from "./analytics-types";
import type { summarizeLeads } from "@/lib/analytics/summary";
import type { TrendPoint } from "@/lib/analytics/trend";
export type AnalyticsSummary = ReturnType<typeof summarizeLeads> & { meetings: number; overdue: number; from: string; to: string; trend: TrendPoint[] };
export function useAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  function refresh() { setLoading(true); setError(""); setRevision((value) => value + 1); }
  function changePeriod(value: Period) { setLoading(true); setError(""); setAnalytics(null); setPeriod(value); setRevision((old) => old + 1); }
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/analytics?period=${period}`, { signal: controller.signal, cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Statistiques indisponibles.");
      if (!controller.signal.aborted) { setAnalytics(data); setError(""); }
    }).catch(() => {
      if (!controller.signal.aborted) { setAnalytics(null); setError("Impossible de charger les statistiques. Réessayez."); }
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [period, revision]);
  return { analytics, error, loading, period, setPeriod: changePeriod, refresh };
}
