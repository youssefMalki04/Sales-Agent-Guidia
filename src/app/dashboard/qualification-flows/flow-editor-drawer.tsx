import type React from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DrawerHeader, FormField } from "./flow-drawer-components";
import type {
  FlowDrawerMode as DrawerMode,
  FlowSafetyMode as SafetyMode,
  QualificationFlowForm as FlowForm,
  TourPage,
} from "./flow-types";

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

        <div className="mt-5 grid gap-4 rounded-lg border border-[#e1e1e5] bg-[#f7f7f8] p-4 sm:grid-cols-2">
          <FormField label="Cold score maximum">
            <Input
              type="number"
              min={0}
              max={98}
              value={form.scoring.coldMax}
              onChange={(event) =>
                onFormChange((current) => ({
                  ...current,
                  scoring: {
                    ...current.scoring,
                    coldMax: Number(event.target.value),
                  },
                }))
              }
            />
          </FormField>
          <FormField label="Warm score maximum">
            <Input
              type="number"
              min={1}
              max={99}
              value={form.scoring.warmMax}
              onChange={(event) =>
                onFormChange((current) => ({
                  ...current,
                  scoring: {
                    ...current.scoring,
                    warmMax: Number(event.target.value),
                  },
                }))
              }
            />
          </FormField>
          <p className="text-xs text-[#777780] sm:col-span-2">
            Hot starts above the warm maximum. Recommended thresholds: cold
            0–34, warm 35–69, hot 70–100.
          </p>
        </div>

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
                  className="rounded-md border border-[#dedee3] bg-white p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#5964d6] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <Input
                      value={step.title}
                      onChange={(event) =>
                        onUpdateStep(step.id, event.target.value)
                      }
                      placeholder={`Question ${index + 1}`}
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
                  <div className="mt-3 grid gap-2 border-t pt-3 sm:grid-cols-[1fr_100px_auto]">
                    <select
                      value={step.field ?? "need"}
                      onChange={(event) =>
                        onFormChange((current) => ({
                          ...current,
                          steps: current.steps.map((item) =>
                            item.id === step.id
                              ? { ...item, field: event.target.value }
                              : item,
                          ),
                        }))
                      }
                      className="h-9 rounded-md border bg-white px-2 text-xs"
                    >
                      <option value="need">Need</option>
                      <option value="company">Company</option>
                      <option value="sector">Sector</option>
                      <option value="budget">Budget</option>
                      <option value="urgency">Urgency</option>
                      <option value="email">Email</option>
                      <option value="intent">Buying/demo intent</option>
                    </select>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={step.weight ?? 0}
                      onChange={(event) =>
                        onFormChange((current) => ({
                          ...current,
                          steps: current.steps.map((item) =>
                            item.id === step.id
                              ? { ...item, weight: Number(event.target.value) }
                              : item,
                          ),
                        }))
                      }
                      className="h-9 text-xs"
                    />
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={step.required ?? false}
                        onChange={(event) =>
                          onFormChange((current) => ({
                            ...current,
                            steps: current.steps.map((item) =>
                              item.id === step.id
                                ? { ...item, required: event.target.checked }
                                : item,
                            ),
                          }))
                        }
                      />{" "}
                      Required
                    </label>
                  </div>
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
