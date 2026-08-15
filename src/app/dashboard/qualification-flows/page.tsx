"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GitBranch,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  FlowDrawerMode as DrawerMode,
  FlowMainTab as MainTab,
  FlowSafetyMode as SafetyMode,
  QualificationFlow as Flow,
  QualificationFlowForm as FlowForm,
  TourPage,
} from "./flow-types";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const tourPages: TourPage[] = [
  { id: "page-1", title: "Source 1", key: "source-1" },
  { id: "page-2", title: "Source 2", key: "source-2" },
  {
    id: "page-3",
    title: "Management of Clients",
    key: "catalogue-clients",
  },
  {
    id: "page-4",
    title: "Catalogue Produits",
    key: "catalogue-products",
  },
  {
    id: "page-5",
    title: "Product Sheet",
    key: "product-product-edition",
  },
  {
    id: "page-6",
    title: "Creating a product",
    key: "watch",
  },
  {
    id: "page-7",
    title: "Dashboard Lynara",
    key: "lynara-dashboard",
  },
  {
    id: "page-8",
    title: "List of Inventories",
    key: "lynara-inventory-list",
  },
  {
    id: "page-9",
    title: "Catalogue Products",
    key: "lynara-product-catalog",
  },
  {
    id: "page-10",
    title: "Inventory seizure",
    key: "lynara-inventory-entry",
  },
  {
    id: "page-11",
    title: "Guidia - Console — 20/05/2026 22:42:20",
    key: "guidia-console-recording",
  },
  {
    id: "page-12",
    title: "Creation of Invoice",
    key: "lynara-invoice-creation",
  },
];

const initialFlows: Flow[] = [
  {
    id: "flow-1",
    key: "demo-source-1-manual-s",
    title: "Source 1",
    description: "Workflow generated from the first imported source.",
    businessGoal: "Guide the user through the interface shown in Source 1.",
    tags: ["generated-ai", "manual-source"],
    safetyMode: "guide",
    active: true,
    entryPageIds: ["page-1"],
    steps: [{ id: "step-1", title: "Source 1" }],
  },
  {
    id: "flow-2",
    key: "create-new-product",
    title: "Create a new product",
    description: "Create a new product from the product catalogue.",
    businessGoal: "A new product is successfully added to the catalogue.",
    tags: ["catalogue", "product", "creation"],
    safetyMode: "guide",
    active: true,
    entryPageIds: ["page-4"],
    steps: [
      { id: "step-1", title: "Open the product catalogue" },
      { id: "step-2", title: "Open the creation form" },
      { id: "step-3", title: "Complete and validate the product" },
    ],
  },
  {
    id: "flow-3",
    key: "perform-physical-inventory",
    title: "Performing a physical inventory",
    description: "Guide an operator through a physical inventory.",
    businessGoal: "All counted quantities are recorded correctly.",
    tags: ["inventory", "stock"],
    safetyMode: "confirm",
    active: true,
    entryPageIds: ["page-8", "page-10"],
    steps: [
      { id: "step-1", title: "Open inventories" },
      { id: "step-2", title: "Choose an inventory" },
      { id: "step-3", title: "Enter counted quantities" },
      { id: "step-4", title: "Confirm the inventory" },
    ],
  },
  {
    id: "flow-4",
    key: "flow-add-product",
    title: "Add an item to the sales catalog",
    description: "Add a sellable item to the active catalogue.",
    businessGoal: "The item becomes visible in the sales catalogue.",
    tags: ["catalogue", "sales"],
    safetyMode: "guide",
    active: true,
    entryPageIds: ["page-4"],
    steps: [
      { id: "step-1", title: "Open catalogue" },
      { id: "step-2", title: "Click Add product" },
      { id: "step-3", title: "Complete product information" },
      { id: "step-4", title: "Save product" },
    ],
  },
  {
    id: "flow-5",
    key: "search-and-edit",
    title: "Edit an existing article",
    description: "Find and update an existing catalogue article.",
    businessGoal: "The selected article is updated successfully.",
    tags: ["catalogue", "edit"],
    safetyMode: "confirm",
    active: true,
    entryPageIds: ["page-4", "page-5"],
    steps: [
      { id: "step-1", title: "Search article" },
      { id: "step-2", title: "Open article details" },
      { id: "step-3", title: "Save modifications" },
    ],
  },
  {
    id: "flow-6",
    key: "check-product-stock",
    title: "View the stock of an item",
    description: "View stock information for a selected item.",
    businessGoal: "The user understands the current available stock.",
    tags: ["inventory", "stock"],
    safetyMode: "guide",
    active: true,
    entryPageIds: ["page-9"],
    steps: [
      { id: "step-1", title: "Open catalogue" },
      { id: "step-2", title: "Select product" },
      { id: "step-3", title: "Read stock information" },
    ],
  },
  {
    id: "flow-7",
    key: "flow-inventory-update",
    title: "Register an arrival of goods",
    description: "Register incoming merchandise in inventory.",
    businessGoal: "Inventory stock is increased with traceability.",
    tags: ["inventory", "goods"],
    safetyMode: "confirm",
    active: true,
    entryPageIds: ["page-8"],
    steps: [
      { id: "step-1", title: "Open inventory" },
      { id: "step-2", title: "Choose product" },
      { id: "step-3", title: "Enter received quantity" },
      { id: "step-4", title: "Confirm reception" },
    ],
  },
  {
    id: "flow-8",
    key: "remove-product-obsolete",
    title: "Delete an item from the catalog",
    description: "Permanently remove a product that is no longer marketed.",
    businessGoal: "The product is permanently removed from the catalog.",
    tags: [
      "generated-ai",
      "demo-derived",
      "manual-source",
      "manual-source-1779023783669-0",
    ],
    safetyMode: "confirm",
    active: true,
    entryPageIds: ["page-4"],
    steps: [
      { id: "step-1", title: "Select item" },
      { id: "step-2", title: "Action of suppression" },
    ],
  },
  {
    id: "flow-9",
    key: "flow-create-invoice",
    title: "Issue a compliant electronic invoice",
    description: "Create and validate a compliant customer invoice.",
    businessGoal: "A valid invoice is created and ready to send.",
    tags: ["invoice", "billing"],
    safetyMode: "confirm",
    active: true,
    entryPageIds: ["page-12"],
    steps: [
      { id: "step-1", title: "Open invoice module" },
      { id: "step-2", title: "Choose customer" },
      { id: "step-3", title: "Add invoice lines" },
      { id: "step-4", title: "Validate invoice" },
    ],
  },
  {
    id: "flow-10",
    key: "demo-guidia-console-20-05-2026-22-42-20-recording",
    title: "Guidia - Console — 20/05/2026 22:42:20",
    description:
      "Replay workflow: Guidia - Console — 20/05/2026 22:42:20. Focus on each visible user action and transform them into guided course stages.",
    businessGoal:
      "Replay the recorded workflow and transform visible actions into guided course stages.",
    tags: [
      "generated-ai",
      "demo-derived",
      "demo-source-recording",
      "from-recording",
    ],
    safetyMode: "guide",
    active: true,
    entryPageIds: ["page-11"],
    steps: [
      {
        id: "step-1",
        title: "Guidia - Console — 20/05/2026 22:42:20",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              EMPTY FORM                                    */
/* -------------------------------------------------------------------------- */

function createEmptyForm(flowNumber: number): FlowForm {
  return {
    key: `flow-${flowNumber}`,
    title: "New flow",
    description: "",
    businessGoal: "",
    tags: "",
    safetyMode: "guide",
    active: true,
    entryPageIds: [],
    steps: [],
  };
}

/* -------------------------------------------------------------------------- */
/*                                PAGE                                        */
/* -------------------------------------------------------------------------- */

export default function ToursPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("flows");
  const [flows, setFlows] = useState<Flow[]>(() => {
    if (typeof window === "undefined") {
      return initialFlows;
    }

    try {
      const savedFlows = JSON.parse(
        localStorage.getItem("guidia-flows") ?? "[]",
      );

      return [...initialFlows, ...savedFlows];
    } catch {
      return initialFlows;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  const [form, setForm] = useState<FlowForm>(() =>
    createEmptyForm(initialFlows.length + 1),
  );

  const [pages, setPages] = useState<TourPage[]>(() => {
    if (typeof window === "undefined") {
      return tourPages;
    }

    try {
      const savedPages = JSON.parse(
        localStorage.getItem("guidia-pages") ?? "[]",
      );

      return [...tourPages, ...savedPages];
    } catch {
      return tourPages;
    }
  });

  const selectedFlow = flows.find((flow) => flow.id === selectedFlowId) ?? null;

  function persistFlows(nextFlows: Flow[]) {
    setFlows(nextFlows);

    if (typeof window !== "undefined") {
      localStorage.setItem("guidia-flows", JSON.stringify(nextFlows));
    }
  }

  // Reserved for page mutations added by the flow editor.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function persistPages(nextPages: TourPage[]) {
    setPages(nextPages);

    if (typeof window !== "undefined") {
      localStorage.setItem("guidia-pages", JSON.stringify(nextPages));
    }
  }

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
  const activeFlowsCount = flows.filter((flow) => flow.active).length;

  function openCreateDrawer() {
    setSelectedFlowId(null);
    setForm(createEmptyForm(flows.length + 1));
    setDrawerMode("create");
  }

  function openViewDrawer(flow: Flow) {
    setSelectedFlowId(flow.id);
    setDrawerMode("view");
  }

  function openEditDrawer(flow: Flow) {
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
    });
    setDrawerMode("edit");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedFlowId(null);
  }

  function saveFlow() {
    const title = form.title.trim();
    const key = form.key.trim();

    if (!title || !key) {
      return;
    }

    const normalizedFlow: Flow = {
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
    };

    if (drawerMode === "edit" && selectedFlow) {
      persistFlows(
        flows.map((flow) =>
          flow.id === selectedFlow.id ? normalizedFlow : flow,
        ),
      );
    } else {
      persistFlows([...flows, normalizedFlow]);
    }

    closeDrawer();
  }

  function deleteFlow(flowId: string) {
    persistFlows(flows.filter((flow) => flow.id !== flowId));

    if (selectedFlowId === flowId) {
      closeDrawer();
    }
  }

  function toggleEntryPage(pageId: string) {
    setForm((current) => ({
      ...current,
      entryPageIds: current.entryPageIds.includes(pageId)
        ? current.entryPageIds.filter((id) => id !== pageId)
        : [...current.entryPageIds, pageId],
    }));
  }

  function addStep() {
    setForm((current) => ({
      ...current,
      steps: [
        ...current.steps,
        {
          id: crypto.randomUUID(),
          title: `Step ${current.steps.length + 1}`,
        },
      ],
    }));
  }

  function updateStep(stepId: string, value: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.map((step) =>
        step.id === stepId ? { ...step, title: value } : step,
      ),
    }));
  }

  function removeStep(stepId: string) {
    setForm((current) => ({
      ...current,
      steps: current.steps.filter((step) => step.id !== stepId),
    }));
  }

  function exportFlows() {
    const content = JSON.stringify(flows, null, 2);
    const blob = new Blob([content], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "guidia-flows.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importFlows(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));

        if (Array.isArray(data)) {
          setFlows(data as Flow[]);
        }
      } catch {
        window.alert("Le fichier JSON est invalide.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-7 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px]">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Conversion workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Qualification flows
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Design clear journeys that help agents qualify intent and guide
              every lead to the right next step.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FlowMetric value={flows.length} label="Flows" />
            <FlowMetric value={activeFlowsCount} label="Active" />
            <FlowMetric value={pages.length} label="Pages" />
          </div>
        </header>
        <TourNavigation
          activeTab={activeTab}
          flowsCount={flows.length}
          pagesCount={pages.length}
          onChange={setActiveTab}
          onExport={exportFlows}
          onImport={importFlows}
        />

        {activeTab === "flows" ? (
          <FlowsSection
            flows={filteredFlows}
            totalFlows={flows.length}
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onCreate={openCreateDrawer}
            onView={openViewDrawer}
            onEdit={openEditDrawer}
            onDelete={deleteFlow}
          />
        ) : (
          <PlaceholderSection tab={activeTab} />
        )}
      </div>

      {drawerMode && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={closeDrawer}
            className="fixed inset-0 z-40 cursor-default bg-slate-950/45 backdrop-blur-[2px]"
          />

          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[690px] flex-col border-l border-slate-200 bg-white shadow-2xl">
            {drawerMode === "view" && selectedFlow ? (
              <FlowDetailsDrawer
                flow={selectedFlow}
                pages={pages}
                onClose={closeDrawer}
                onEdit={() => openEditDrawer(selectedFlow)}
              />
            ) : (
              <FlowEditorDrawer
                mode={drawerMode}
                form={form}
                pages={pages}
                onFormChange={setForm}
                onToggleEntryPage={toggleEntryPage}
                onAddStep={addStep}
                onUpdateStep={updateStep}
                onRemoveStep={removeStep}
                onClose={closeDrawer}
                onSave={saveFlow}
                onDelete={
                  drawerMode === "edit" && selectedFlow
                    ? () => deleteFlow(selectedFlow.id)
                    : undefined
                }
              />
            )}
          </aside>
        </>
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                           TOP NAVIGATION                                   */
/* -------------------------------------------------------------------------- */

function FlowMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-20 rounded-2xl border border-slate-100 bg-[#fafafd] px-3 py-3">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function TourNavigation({
  activeTab,
  flowsCount,
  pagesCount,
  onChange,
  onImport,
  onExport,
}: {
  activeTab: MainTab;
  flowsCount: number;
  pagesCount: number;
  onChange: (tab: MainTab) => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}) {
  const tabs: Array<{
    value: MainTab;
    label: string;
    count?: number;
    icon: typeof Sparkles;
  }> = [
    {
      value: "generate",
      label: "Generate with AI",
      icon: Sparkles,
    },
    {
      value: "pages",
      label: "Pages",
      count: pagesCount,
      icon: FileText,
    },
    {
      value: "actions",
      label: "Actions",
      count: 1,
      icon: Sparkles,
    },
    {
      value: "flows",
      label: "Flows",
      count: flowsCount,
      icon: GitBranch,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-1 sm:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onChange(tab.value)}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all",
                  active
                    ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
                )}
              >
                <Icon className="size-[18px]" />
                {tab.label}

                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "text-sm",
                      active ? "text-[#5964d6]" : "text-slate-400",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]">
            <Upload className="size-4" />
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={onImport}
              className="hidden"
            />
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="h-10 gap-2 rounded-xl border-slate-200 px-4 text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
          >
            <Download className="size-4" />
            Export JSON
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              FLOWS LIST                                    */
/* -------------------------------------------------------------------------- */

function FlowsSection({
  flows,
  totalFlows,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: {
  flows: Flow[];
  totalFlows: number;
  search: string;
  statusFilter: "all" | "active" | "inactive";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  onCreate: () => void;
  onView: (flow: Flow) => void;
  onEdit: (flow: Flow) => void;
  onDelete: (flowId: string) => void;
}) {
  return (
    <section className="soft-panel-enter mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <h1 className="min-w-[64px] text-lg font-semibold text-[#202026]">
          Flows
        </h1>

        <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-slate-100 bg-[#fafafd] p-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search flows..."
            className="h-10 rounded-xl border-slate-200 bg-white sm:max-w-[220px]"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value as "all" | "active" | "inactive",
              )
            }
            className="h-10 min-w-[200px] rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-xl border border-[#e1e4f8] bg-[#f1f2ff] px-3 text-sm font-semibold text-[#5964d6]">
            {flows.length}/{totalFlows}
          </span>

          <Button
            type="button"
            onClick={onCreate}
            className="h-10 gap-2 rounded-xl bg-[#5964d6] px-5 text-white hover:bg-[#4f5acb]"
          >
            <Plus className="size-4" />
            Add flow
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="bg-[#fafafd] text-left">
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" aria-label="Select all flows" />
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Key
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Steps
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[#777780]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {flows.map((flow) => (
                <tr
                  key={flow.id}
                  className="border-t border-slate-100 transition hover:bg-[#fafaff]"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${flow.title}`}
                    />
                  </td>

                  <td className="max-w-[290px] px-4 py-4">
                    <p className="truncate text-sm font-semibold text-[#303038]">
                      {flow.title}
                    </p>
                  </td>

                  <td className="max-w-[300px] px-4 py-4">
                    <p className="truncate font-mono text-xs text-[#777780]">
                      {flow.key}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-[#50505a]">
                    {flow.steps.length}
                  </td>

                  <td className="px-4 py-4">
                    {flow.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <Check className="size-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-sm text-[#a1a1aa]">—</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        label="View flow"
                        onClick={() => onView(flow)}
                      >
                        <Eye className="size-4" />
                      </IconButton>

                      <IconButton
                        label="Edit flow"
                        onClick={() => onEdit(flow)}
                      >
                        <Pencil className="size-4" />
                      </IconButton>

                      <IconButton
                        label="Delete flow"
                        danger
                        onClick={() => onDelete(flow.id)}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}

              {flows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-[#303038]">
                      No flows found
                    </p>
                    <p className="mt-2 text-sm text-[#85858e]">
                      Change the filters or create a new flow.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e8e8eb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#777780]">
            Showing 1–{flows.length} of {flows.length}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#777780]">Per page</span>

            <select className="h-9 rounded-full border border-[#dedee3] bg-white px-3 text-sm">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>

            <span className="inline-flex h-9 items-center rounded-full border border-[#dedee3] px-4 text-sm font-semibold">
              1 / 1
            </span>

            <Button
              type="button"
              variant="outline"
              disabled
              className="h-9 rounded-full"
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled
              className="h-9 rounded-full"
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             DETAILS DRAWER                                 */
/* -------------------------------------------------------------------------- */

function FlowDetailsDrawer({
  flow,
  pages,
  onClose,
  onEdit,
}: {
  flow: Flow;
  pages: TourPage[];
  onClose: () => void;
  onEdit: () => void;
}) {
  const entryPages = pages.filter((page) =>
    flow.entryPageIds.includes(page.id),
  );

  return (
    <>
      <DrawerHeader title={flow.title} subtitle="View" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <DetailField label="Key">
          <span className="font-mono text-sm">{flow.key}</span>
        </DetailField>

        <DetailField label="Description">{flow.description || "—"}</DetailField>

        <DetailField label="Business goal">
          {flow.businessGoal || "—"}
        </DetailField>

        <DetailField label="Tags">
          {flow.tags.length ? flow.tags.join(", ") : "—"}
        </DetailField>

        <DetailField label="Safety mode">
          <span className="capitalize">{flow.safetyMode}</span>
        </DetailField>

        <DetailField label="Flow active">
          {flow.active ? <Check className="size-4" /> : "No"}
        </DetailField>

        <DetailField label="Entry pages">
          {entryPages.length ? (
            <div className="space-y-1">
              {entryPages.map((page) => (
                <p key={page.id}>{page.title}</p>
              ))}
            </div>
          ) : (
            "—"
          )}
        </DetailField>

        <DetailField label="Flow steps" last>
          {flow.steps.length ? (
            <ol className="space-y-1">
              {flow.steps.map((step, index) => (
                <li key={step.id}>
                  {index + 1}. {step.title}
                </li>
              ))}
            </ol>
          ) : (
            "—"
          )}
        </DetailField>
      </div>

      <div className="flex items-center justify-between border-t border-[#e1e1e5] bg-[#fafafa] px-6 py-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>

        <Button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          Edit
        </Button>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              EDIT DRAWER                                   */
/* -------------------------------------------------------------------------- */

function FlowEditorDrawer({
  mode,
  form,
  pages,
  onFormChange,
  onToggleEntryPage,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onClose,
  onSave,
  onDelete,
}: {
  mode: DrawerMode;
  form: FlowForm;
  pages: TourPage[];
  onFormChange: React.Dispatch<React.SetStateAction<FlowForm>>;
  onToggleEntryPage: (pageId: string) => void;
  onAddStep: () => void;
  onUpdateStep: (stepId: string, value: string) => void;
  onRemoveStep: (stepId: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
}) {
  const isEditing = mode === "edit";
  const canSave = form.key.trim().length > 1 && form.title.trim().length > 1;

  return (
    <>
      <DrawerHeader
        title={isEditing ? form.title || "Edit flow" : "New flow"}
        subtitle="Edit"
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Key">
            <Input
              value={form.key}
              onChange={(event) =>
                onFormChange((current) => ({
                  ...current,
                  key: event.target.value,
                }))
              }
              placeholder="flow-11"
            />
          </FormField>

          <FormField label="Safety Mode">
            <select
              value={form.safetyMode}
              onChange={(event) =>
                onFormChange((current) => ({
                  ...current,
                  safetyMode: event.target.value as SafetyMode,
                }))
              }
              className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none"
            >
              <option value="guide">guide</option>
              <option value="confirm">confirm</option>
              <option value="auto">auto</option>
            </select>
          </FormField>
        </div>

        <FormField label="Title">
          <Input
            value={form.title}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="New flow"
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            value={form.description}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="min-h-24"
          />
        </FormField>

        <FormField label="Business goal">
          <Textarea
            value={form.businessGoal}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                businessGoal: event.target.value,
              }))
            }
            className="min-h-24"
          />
        </FormField>

        <FormField label="Tags">
          <Input
            value={form.tags}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                tags: event.target.value,
              }))
            }
            placeholder="generated-ai, catalogue, product"
          />
        </FormField>

        <FormField label="Entry pages">
          <div className="grid gap-2 sm:grid-cols-2">
            {pages.map((page) => {
              const checked = form.entryPageIds.includes(page.id);

              return (
                <label
                  key={page.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition",
                    checked
                      ? "border-[#a5a5ad] bg-[#f7f7f8]"
                      : "border-[#e1e1e5] bg-white hover:bg-[#fafafa]",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleEntryPage(page.id)}
                  />
                  <span className="truncate">{page.title}</span>
                </label>
              );
            })}
          </div>
        </FormField>

        <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#34343b]">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                active: event.target.checked,
              }))
            }
          />
          Flow active
        </label>

        <div className="mt-6 rounded-lg border border-[#e1e1e5] bg-[#f7f7f8] p-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-[#303038]">Flow steps</h3>

            <Button
              type="button"
              variant="outline"
              onClick={onAddStep}
              className="h-9 gap-2"
            >
              <Plus className="size-4" />
              Add step
            </Button>
          </div>

          {form.steps.length ? (
            <div className="mt-4 space-y-3">
              {form.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 rounded-md border border-[#dedee3] bg-white p-2"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#5964d6] text-xs font-semibold text-white">
                    {index + 1}
                  </span>

                  <Input
                    value={step.title}
                    onChange={(event) =>
                      onUpdateStep(step.id, event.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />

                  <button
                    type="button"
                    onClick={() => onRemoveStep(step.id)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-md text-[#c75959] hover:bg-[#fff0f0]"
                    aria-label="Remove step"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#85858e]">—</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#e1e1e5] bg-[#fafafa] px-6 py-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>

        <div className="flex items-center gap-3">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-[#d05c5c] hover:bg-[#fff0f0]"
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          )}

          <Button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            <Save className="size-4" />
            {isEditing ? "Save flow" : "Create flow"}
          </Button>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                             SMALL COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function DrawerHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#e1e1e5] px-6 py-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold text-[#202026]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#777780]">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex size-9 items-center justify-center rounded-md border border-[#dedee3] text-[#666670] hover:bg-[#f5f5f6]"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-sm font-semibold text-[#34343b]">
        {label}
      </span>
      {children}
    </label>
  );
}

function DetailField({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("py-4", !last && "border-b border-[#e5e5e8]")}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#85858e]">
        {label}
      </p>

      <div className="mt-2 text-sm leading-6 text-[#303038]">{children}</div>
    </div>
  );
}

function IconButton({
  label,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md transition",
        danger
          ? "text-[#ca5656] hover:bg-[#fff0f0]"
          : "text-[#44444c] hover:bg-[#efeff1]",
      )}
    >
      {children}
    </button>
  );
}

function PlaceholderSection({ tab }: { tab: MainTab }) {
  return (
    <section className="soft-panel-enter mt-6 flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd]">
      <p className="text-sm text-[#777780]">
        Interface « {tab} » à connecter ici.
      </p>
    </section>
  );
}
