"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Meeting, MeetingStatus } from "./meeting-data";
import { isoDate, month, today, year } from "./meeting-data";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState("");
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date(year, month, 1));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | MeetingStatus>("all");
  const [owner, setOwner] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/meetings", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Meetings request failed");
        return response.json() as Promise<{ meetings: Meeting[] }>;
      })
      .then((result) => setMeetings(result.meetings))
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          "Unable to load meetings. Apply migration 008_meetings.sql in Supabase.",
        );
      });

    return () => controller.abort();
  }, []);

  const filteredMeetings = useMemo(
    () =>
      meetings.filter((meeting) => {
        const term = query.trim().toLowerCase();

        return (
          (status === "all" || meeting.status === status) &&
          (owner === "all" || meeting.owner === owner) &&
          (!term ||
            [
              meeting.prospect,
              meeting.company,
              meeting.title,
              meeting.email,
            ].some((value) => value.toLowerCase().includes(term)))
        );
      }),
    [meetings, owner, query, status],
  );

  const selectedMeeting =
    meetings.find((meeting) => meeting.id === selectedId) ?? null;
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(selectedMonth);
  const confirmedCount = meetings.filter(
    (meeting) => meeting.status === "confirmed",
  ).length;
  const pendingCount = meetings.filter(
    (meeting) => meeting.status === "pending",
  ).length;
  const completedCount = meetings.filter(
    (meeting) => meeting.status === "completed",
  ).length;
  const completionRate = meetings.length
    ? Math.round((completedCount / meetings.length) * 100)
    : 0;

  function showCurrentMonth() {
    setSelectedMonth(new Date(year, month, 1));
  }

  function showPreviousMonth() {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1),
    );
  }

  function showNextMonth() {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1),
    );
  }

  async function updateMeeting(id: string, patch: Partial<Meeting>) {
    setError("");
    const response = await fetch("/api/meetings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        date: patch.date,
        time: patch.time,
        duration: patch.duration,
        status: patch.status,
      }),
    });

    if (!response.ok) {
      setError("Unable to update this meeting.");
      return;
    }

    const result = (await response.json()) as { meeting: Meeting };
    setMeetings((current) =>
      current.map((meeting) => (meeting.id === id ? result.meeting : meeting)),
    );
  }

  async function createMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      title: String(data.get("title") || "Discovery call"),
      prospect: String(data.get("prospect") || "New prospect"),
      company: String(data.get("company") || "Company"),
      email: String(data.get("email") || ""),
      owner: String(data.get("owner") || "Yosra"),
      date: String(data.get("date") || isoDate(today.getDate())),
      time: String(data.get("time") || "10:00"),
      duration: Number(data.get("duration") || 30),
      status: "pending",
      source: "Manual",
      notes: String(data.get("notes") || ""),
    };

    setError("");
    const response = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Unable to create this meeting.");
      return;
    }

    const result = (await response.json()) as { meeting: Meeting };
    setMeetings((current) => [...current, result.meeting]);
    setCreating(false);
    setSelectedId(result.meeting.id);
  }

  return {
    meetings,
    filteredMeetings,
    error,
    view,
    setView,
    selectedMonth,
    query,
    setQuery,
    status,
    setStatus,
    owner,
    setOwner,
    selectedMeeting,
    setSelectedId,
    creating,
    setCreating,
    monthLabel,
    confirmedCount,
    pendingCount,
    completionRate,
    showCurrentMonth,
    showPreviousMonth,
    showNextMonth,
    updateMeeting,
    createMeeting,
  };
}
