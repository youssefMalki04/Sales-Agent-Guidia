"use client";

import { useMemo, useState } from "react";

import {
  initialConfig,
  initialTraces,
  type MemoryTab,
  type TraceStatus,
  type TraceType,
} from "./memory-data";

const MESSAGE_DURATION_MS = 2500;
const SAVE_DURATION_MS = 900;
const MAINTENANCE_DURATION_MS = 1200;

export function useMemory() {
  const [activeTab, setActiveTab] = useState<MemoryTab>("traces");
  const [traces, setTraces] = useState(initialTraces);
  const [statusFilter, setStatusFilter] = useState<"all" | TraceStatus>(
    "active",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | TraceType>("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredTraces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return traces.filter(
      (trace) =>
        (statusFilter === "all" || trace.status === statusFilter) &&
        (typeFilter === "all" || trace.type === typeFilter) &&
        (!normalizedQuery ||
          trace.content.toLowerCase().includes(normalizedQuery) ||
          trace.source.toLowerCase().includes(normalizedQuery)),
    );
  }, [query, statusFilter, traces, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTraces.length / pageSize));
  const visibleTraces = filteredTraces.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const activeTraceCount = traces.filter(
    (trace) => trace.status === "active",
  ).length;
  const promotedTraceCount = traces.filter(
    (trace) => trace.status === "promoted",
  ).length;

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), MESSAGE_DURATION_MS);
  }

  function changeQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function changeStatusFilter(value: "all" | TraceStatus) {
    setStatusFilter(value);
    setPage(1);
  }

  function changeTypeFilter(value: "all" | TraceType) {
    setTypeFilter(value);
    setPage(1);
  }

  function changePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function changeTraceStatus(id: string, status: TraceStatus) {
    setTraces((current) =>
      current.map((trace) => (trace.id === id ? { ...trace, status } : trace)),
    );
  }

  function saveConfiguration() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      flash("Configuration saved.");
    }, SAVE_DURATION_MS);
  }

  function runMaintenance() {
    setMaintenance(true);
    window.setTimeout(() => {
      setTraces((current) =>
        current.filter((trace) => trace.status !== "rejected"),
      );
      setMaintenance(false);
      flash("Maintenance completed.");
    }, MAINTENANCE_DURATION_MS);
  }

  return {
    activeTab,
    activeTraceCount,
    changePageSize,
    changeQuery,
    changeStatusFilter,
    changeTraceStatus,
    changeTypeFilter,
    config,
    filteredTraceCount: filteredTraces.length,
    maintenance,
    message,
    page,
    pageSize,
    promotedTraceCount,
    query,
    runMaintenance,
    saveConfiguration,
    saving,
    setActiveTab,
    setConfig,
    setPage,
    statusFilter,
    totalPages,
    totalTraceCount: traces.length,
    typeFilter,
    visibleTraces,
  };
}
