"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

import { createEmptyForm, tourPages } from "./flow-data";
import type {
  FlowDrawerMode,
  FlowMainTab,
  QualificationFlow,
  QualificationFlowForm,
  TourPage,
} from "./flow-types";

function loadPages(): TourPage[] {
  if (typeof window === "undefined") return tourPages;

  try {
    const savedPages = JSON.parse(localStorage.getItem("guidia-pages") ?? "[]");
    return [...tourPages, ...savedPages];
  } catch {
    return tourPages;
  }
}

export function useQualificationFlows() {
  const [activeTab, setActiveTab] = useState<FlowMainTab>("flows");
  const [flows, setFlows] = useState<QualificationFlow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [drawerMode, setDrawerMode] = useState<FlowDrawerMode>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [form, setForm] = useState<QualificationFlowForm>(() =>
    createEmptyForm(1),
  );
  const [pages] = useState<TourPage[]>(loadPages);

  const selectedFlow = flows.find((flow) => flow.id === selectedFlowId) ?? null;

  const loadFlows = useCallback(async () => {
    const response = await fetch("/api/qualification-flows", {
      cache: "no-store",
    });
    const payload = (await response.json()) as {
      flows?: QualificationFlow[];
      error?: string;
      migrationRequired?: boolean;
    };

    if (!response.ok) {
      throw new Error(
        payload.migrationRequired
          ? "Run supabase/migrations/013_qualification_flows.sql in Supabase SQL Editor."
          : (payload.error ?? "Unable to load flows"),
      );
    }

    setFlows(payload.flows ?? []);
    setLoadError(null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFlows().catch((error) =>
      setLoadError(
        error instanceof Error ? error.message : "Unable to load flows",
      ),
    );
  }, [loadFlows]);

  const filteredFlows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return flows.filter((flow) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        flow.title.toLowerCase().includes(normalizedSearch) ||
        flow.key.toLowerCase().includes(normalizedSearch) ||
        flow.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && flow.active) ||
        (statusFilter === "inactive" && !flow.active);

      return matchesSearch && matchesStatus;
    });
  }, [flows, search, statusFilter]);

  const activeFlowsCount = useMemo(
    () => flows.filter((flow) => flow.active).length,
    [flows],
  );

  const openCreateDrawer = () => {
    setSelectedFlowId(null);
    setForm(createEmptyForm(flows.length + 1));
    setDrawerMode("create");
  };

  const openViewDrawer = (flow: QualificationFlow) => {
    setSelectedFlowId(flow.id);
    setDrawerMode("view");
  };

  const openEditDrawer = (flow: QualificationFlow) => {
    setSelectedFlowId(flow.id);
    setForm({
      key: flow.key,
      title: flow.title,
      description: flow.description,
      businessGoal: flow.businessGoal,
      tags: flow.tags.join(", "),
      safetyMode: flow.safetyMode,
      active: flow.active,
      entryPageIds: flow.entryPageIds,
      steps: flow.steps,
      scoring: flow.scoring ?? { coldMax: 34, warmMax: 69 },
    });
    setDrawerMode("edit");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setSelectedFlowId(null);
  };

  const saveFlow = async () => {
    const title = form.title.trim();
    const key = form.key.trim();
    if (!title || !key) return;

    const normalizedFlow: QualificationFlow = {
      id:
        drawerMode === "edit" && selectedFlow
          ? selectedFlow.id
          : crypto.randomUUID(),
      key,
      title,
      description: form.description.trim(),
      businessGoal: form.businessGoal.trim(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      safetyMode: form.safetyMode,
      active: form.active,
      entryPageIds: form.entryPageIds,
      steps: form.steps,
      scoring: form.scoring,
    };
    const response = await fetch("/api/qualification-flows", {
      method: drawerMode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedFlow),
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      window.alert(payload.error ?? "Unable to save flow");
      return;
    }

    await loadFlows();
    closeDrawer();
  };

  const deleteFlow = async (flowId: string) => {
    if (!window.confirm("Delete this qualification flow?")) return;

    const response = await fetch(`/api/qualification-flows?id=${flowId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      window.alert("Unable to delete flow");
      return;
    }

    await loadFlows();
    if (selectedFlowId === flowId) closeDrawer();
  };

  const toggleEntryPage = (pageId: string) => {
    setForm((current) => ({
      ...current,
      entryPageIds: current.entryPageIds.includes(pageId)
        ? current.entryPageIds.filter((id) => id !== pageId)
        : [...current.entryPageIds, pageId],
    }));
  };

  const addStep = () => {
    setForm((current) => ({
      ...current,
      steps: [
        ...current.steps,
        {
          id: crypto.randomUUID(),
          title: `Step ${current.steps.length + 1}`,
          field: "need",
          required: false,
          weight: 0,
        },
      ],
    }));
  };

  const updateStep = (stepId: string, value: string) => {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.id === stepId ? { ...step, title: value } : step,
      ),
    }));
  };

  const removeStep = (stepId: string) => {
    setForm((current) => ({
      ...current,
      steps: current.steps.filter((step) => step.id !== stepId),
    }));
  };

  const exportFlows = () => {
    const blob = new Blob([JSON.stringify(flows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "guidia-flows.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFlows = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) setFlows(data as QualificationFlow[]);
      } catch {
        window.alert("Le fichier JSON est invalide.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return {
    activeTab,
    setActiveTab,
    flows,
    filteredFlows,
    activeFlowsCount,
    loadError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    drawerMode,
    selectedFlow,
    form,
    setForm,
    pages,
    openCreateDrawer,
    openViewDrawer,
    openEditDrawer,
    closeDrawer,
    saveFlow,
    deleteFlow,
    toggleEntryPage,
    addStep,
    updateStep,
    removeStep,
    exportFlows,
    importFlows,
  };
}
