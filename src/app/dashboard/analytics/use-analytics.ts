"use client";

import {
  CalendarDays,
  Clock3,
  MessageSquareText,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { AnalyticsData, Period } from "./analytics-types";

const EMPTY_ANALYTICS: AnalyticsData = {
  agentData: [],
  metrics: {
    averageResponse: 0,
    conversations: 0,
    handoffRate: 0,
    meetings: 0,
    qualificationRate: 0,
    qualified: 0,
    wonRevenue: 0,
  },
  objections: [],
  questionData: [],
  sourceData: [],
  trendData: [],
};

export function useAnalytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData>(EMPTY_ANALYTICS);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/analytics?period=${period}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Analytics request failed");
        return response.json() as Promise<AnalyticsData>;
      })
      .then((result) => {
        setAnalytics(result);
        setError("");
      })
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }
        setError(
          "Unable to load analytics. Verify migrations 008 to 010 in Supabase.",
        );
      });
    return () => controller.abort();
  }, [period]);

  const metrics = useMemo(
    () => [
      {
        label: "Conversations",
        value: String(analytics.metrics.conversations),
        change: 0,
        icon: MessageSquareText,
        tone: "text-indigo-600 bg-indigo-50",
      },
      {
        label: "Qualification rate",
        value: `${Math.round(analytics.metrics.qualificationRate)}%`,
        change: 0,
        icon: TrendingUp,
        tone: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "Qualified leads",
        value: String(analytics.metrics.qualified),
        change: 0,
        icon: Users,
        tone: "text-violet-600 bg-violet-50",
      },
      {
        label: "Meetings booked",
        value: String(analytics.metrics.meetings),
        change: 0,
        icon: CalendarDays,
        tone: "text-cyan-600 bg-cyan-50",
      },
      {
        label: "Human handoff",
        value: `${analytics.metrics.handoffRate.toFixed(1)}%`,
        change: 0,
        icon: UserRoundCheck,
        tone: "text-amber-600 bg-amber-50",
      },
      {
        label: "Average response",
        value: `${analytics.metrics.averageResponse.toFixed(1)}s`,
        change: 0,
        icon: Clock3,
        tone: "text-sky-600 bg-sky-50",
      },
    ],
    [analytics],
  );

  return { analytics, error, metrics, period, setPeriod };
}
