"use client";

import { useEffect, useMemo, useState } from "react";
import type { PipelineLead, Stage, Temperature } from "./pipeline-types";

export function usePipeline() {
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [temperature, setTemperature] = useState<"all" | Temperature>("all");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/pipeline", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Pipeline request failed");
        return response.json() as Promise<{ leads: PipelineLead[] }>;
      })
      .then((result) => setLeads(result.leads))
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          "Unable to load pipeline. Apply migration 009_lead_pipeline.sql in Supabase.",
        );
      });

    return () => controller.abort();
  }, []);

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesText =
        !normalizedQuery ||
        [lead.name, lead.company, lead.email, lead.owner].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return (
        matchesText &&
        (temperature === "all" || lead.temperature === temperature)
      );
    });
  }, [leads, query, temperature]);

  function addLead(lead: PipelineLead) {
    setLeads((current) => [lead, ...current]);
  }

  async function moveLead(id: string, stage: Stage) {
    const previousLeads = leads;
    setError("");
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)),
    );

    const response = await fetch("/api/pipeline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage }),
    });

    if (!response.ok) {
      setLeads(previousLeads);
      setError("Unable to move this opportunity.");
    }
  }

  return {
    leads,
    filteredLeads,
    error,
    setError,
    query,
    setQuery,
    temperature,
    setTemperature,
    draggingId,
    setDraggingId,
    overStage,
    setOverStage,
    createOpen,
    setCreateOpen,
    addLead,
    moveLead,
  };
}
