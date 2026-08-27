"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { VisitorReplayEvent, VisitorReplaySession } from "./replay-types";

export type ReplayFilter = "all" | "active" | "completed";

export function useReplaySessions() {
  const [sessions, setSessions] = useState<VisitorReplaySession[]>([]);
  const [events, setEvents] = useState<VisitorReplayEvent[]>([]);
  const [filter, setFilter] = useState<ReplayFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<VisitorReplaySession | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<VisitorReplayEvent[]>(
    [],
  );
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/replay", { cache: "no-store" });
      const payload = (await response.json()) as {
        sessions?: VisitorReplaySession[];
        events?: VisitorReplayEvent[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load replay sessions.");
      }

      setSessions(payload.sessions || []);
      setEvents(payload.events || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load replay sessions.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const filteredSessions = useMemo(
    () =>
      filter === "all"
        ? sessions
        : sessions.filter((session) => session.status === filter),
    [filter, sessions],
  );

  const eventCounts = useMemo(
    () =>
      events.reduce<Record<string, number>>((counts, event) => {
        counts[event.session_id] = (counts[event.session_id] || 0) + 1;
        return counts;
      }, {}),
    [events],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const viewJourney = async (session: VisitorReplaySession) => {
    setSelectedSession(session);
    setSelectedEvents([]);
    setJourneyOpen(true);

    try {
      const response = await fetch(
        `/api/replay?sessionId=${encodeURIComponent(session.session_id)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as {
        events?: VisitorReplayEvent[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load the visitor journey.");
      }

      setSelectedEvents(payload.events || []);
    } catch (journeyError) {
      showToast(
        journeyError instanceof Error
          ? journeyError.message
          : "Unable to load the visitor journey.",
      );
    }
  };

  const removeSession = async (session: VisitorReplaySession) => {
    if (!window.confirm("Delete this replay session and all of its events?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/replay?sessionId=${encodeURIComponent(session.session_id)}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(
          payload.error || "Unable to delete the replay session.",
        );
      }

      if (selectedSession?.session_id === session.session_id) {
        setJourneyOpen(false);
        setSelectedSession(null);
        setSelectedEvents([]);
      }

      showToast("Replay session deleted.");
      await load(true);
    } catch (deleteError) {
      showToast(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the replay session.",
      );
    }
  };

  return {
    sessions,
    filteredSessions,
    eventCounts,
    filter,
    setFilter,
    loading,
    refreshing,
    error,
    refresh: () => load(true),
    selectedSession,
    selectedEvents,
    journeyOpen,
    setJourneyOpen,
    viewJourney,
    removeSession,
    toast,
  };
}
