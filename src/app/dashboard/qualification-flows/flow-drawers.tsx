import type React from "react";
import { Check, Plus, Save, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  FlowDrawerMode as DrawerMode,
  FlowSafetyMode as SafetyMode,
  QualificationFlow as Flow,
  QualificationFlowForm as FlowForm,
  TourPage,
} from "./flow-types";

export function FlowDetailsDrawer({
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

export function FlowEditorDrawer({
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

export function IconButton({
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
