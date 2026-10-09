"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PipelineLead, Stage, Temperature } from "./pipeline-types";
import { isOverdue } from "./pipeline-utils";
import { usePipelineFollowUps } from "./use-pipeline-follow-ups";

export function usePipeline() {
  const followUps = usePipelineFollowUps();
  const [withoutFollowUp, setWithoutFollowUp] = useState(false);
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [owner, setOwner] = useState("");
  const [temperature, setTemperature] = useState<"all" | Temperature>("all");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const pendingMoves = useRef(new Set<string>());
  const [movingIds, setMovingIds] = useState<string[]>([]);

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

  const owners = useMemo(() => [...new Set(leads.map((lead) => lead.owner).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [leads]);
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
        (!withoutFollowUp || (followUps.loaded && !followUps.error && !["won", "lost"].includes(lead.stage) && !followUps.tasks[lead.id])) &&
        (!overdueOnly || isOverdue(lead)) &&
        (!owner || lead.owner === owner) &&
        (temperature === "all" || lead.temperature === temperature)
      );
    });
  }, [leads, query, temperature, owner, overdueOnly, withoutFollowUp, followUps.tasks, followUps.loaded, followUps.error]);

  function addLead(lead: PipelineLead) {
    setLeads((current) => [lead, ...current]);
  }

  function updateLead(lead: PipelineLead) {
    setLeads((current) => current.map((item) => item.id === lead.id ? lead : item));
  }

  async function moveLead(id: string, stage: Stage) {
    const previousLead = leads.find((lead) => lead.id === id);
    if (!previousLead || previousLead.stage === stage || pendingMoves.current.has(id)) return;
    pendingMoves.current.add(id);
    setMovingIds([...pendingMoves.current]);
    setError("");
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, stage } : lead)),
    );

    try {
      const response = await fetch("/api/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stage }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("save-failed");
      const result = await response.json() as { lead?: PipelineLead };
      if (result.lead?.id !== id || result.lead.stage !== stage) throw new Error("invalid-response");
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, stage: result.lead!.stage } : lead));
    } catch {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, stage: previousLead.stage } : lead));
      setError(`Enregistrement non confirmé pour « ${previousLead.name} ». La carte a été replacée dans sa phase précédente. Vérifiez votre connexion, actualisez puis réessayez.`);
    } finally {
      pendingMoves.current.delete(id);
      setMovingIds([...pendingMoves.current]);
    }
  }

  return {
    leads,
    movingIds,
    filteredLeads,
    followUps,
    withoutFollowUp,
    setWithoutFollowUp,
    overdueOnly,
    setOverdueOnly,
    owner,
    owners,
    setOwner,
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
    updateLead,
    moveLead,
  };
}
