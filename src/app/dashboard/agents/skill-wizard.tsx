import type React from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { steps } from "./skill-data";
import type {
  SkillExecutionMode as ExecutionMode,
  SkillForm,
  SkillPackType,
} from "./skill-types";

export function CreateSkillWizard({
  open,
  step,
  form,
  canContinue,
  onOpenChange,
  onFormChange,
  onBack,
  onNext,
  onCancel,
  onCreate,
}: {
  open: boolean;
  step: number;
  form: SkillForm;
  canContinue: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: SkillForm) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onCreate: () => void;
}) {
  const currentStep = steps[step - 1];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[560px]">
        <SheetHeader className="border-b border-[#e4e4e8] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#62626c]">
                Assistant · Step {step}/5
              </p>
              <SheetTitle className="mt-2 text-xl">New skill pack</SheetTitle>
              <p className="mt-1 text-sm text-[#7b7b85]">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {steps.map((item, index) => {
              const itemStep = index + 1;
              const active = itemStep <= step;

              return (
                <div key={item.title}>
                  <div
                    className={cn(
                      "h-1 rounded-full",
                      active ? "bg-[#5964d6]" : "bg-[#ececef]",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-center text-[10px] font-semibold",
                      itemStep === step ? "text-[#24242a]" : "text-[#8e8e97]",
                    )}
                  >
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 ? (
            <IdentityStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 2 ? (
            <DescriptionStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 3 ? (
            <BehaviorStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 4 ? (
            <FocusStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 5 ? <ValidationStep form={form} /> : null}
        </div>

        <SheetFooter className="border-t border-[#e4e4e8] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <div className="flex gap-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : null}

            {step < 5 ? (
              <Button
                type="button"
                disabled={!canContinue}
                onClick={onNext}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!form.label.trim()}
                onClick={onCreate}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                <Check className="size-4" />
                Create skill pack
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function IdentityStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Technical key (optional)">
        <Input
          value={form.key}
          onChange={(event) => onChange({ ...form, key: event.target.value })}
          placeholder="e.g. vertical-billing-ops"
          className="h-11 font-mono"
        />
        <p className="mt-2 text-xs leading-5 text-[#85858f]">
          Leave empty for auto-generation. Stable slug used by agent profiles
          and the API.
        </p>
      </Field>

      <Field label="Label *">
        <Input
          value={form.label}
          onChange={(event) => onChange({ ...form, label: event.target.value })}
          placeholder="Display name shown in the studio"
          className="h-11"
        />
      </Field>
    </div>
  );
}

function DescriptionStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="1. Mission and value *">
        <Textarea
          value={form.mission}
          onChange={(event) =>
            onChange({ ...form, mission: event.target.value })
          }
          placeholder="Explain the main purpose and value of this skill pack."
          className="min-h-32"
        />
      </Field>

      <Field label="2. When to activate this skill">
        <Textarea
          value={form.activation}
          onChange={(event) =>
            onChange({ ...form, activation: event.target.value })
          }
          placeholder="Describe the situations where the agent should activate this skill."
          className="min-h-32"
        />
      </Field>

      <Field label="3. Expected capabilities">
        <Textarea
          value={form.capabilities}
          onChange={(event) =>
            onChange({ ...form, capabilities: event.target.value })
          }
          placeholder="List the concrete behaviors and capabilities expected from the agent."
          className="min-h-32"
        />
      </Field>
    </div>
  );
}

function BehaviorStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  const types: Array<{
    value: SkillPackType;
    label: string;
    description: string;
  }> = [
    { value: "domain", label: "domain", description: "Business vertical" },
    {
      value: "knowledge",
      label: "knowledge",
      description: "RAG and documents",
    },
    {
      value: "execution",
      label: "execution",
      description: "Actions and tools",
    },
    { value: "compliance", label: "compliance", description: "Guardrails" },
    { value: "training", label: "training", description: "UI and adoption" },
    { value: "custom", label: "custom", description: "Client-specific" },
  ];

  const modes: Array<{
    value: ExecutionMode;
    label: string;
    description: string;
  }> = [
    {
      value: "assist",
      label: "assist",
      description: "Advise without implicit destructive effect",
    },
    {
      value: "act",
      label: "act",
      description: "Direct actions when policy and tools allow it",
    },
    {
      value: "guarded_act",
      label: "guarded_act",
      description: "Actions under explicit user confirmation",
    },
  ];

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
          Pack type
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {types.map((item) => (
            <ChoiceCard
              key={item.value}
              active={form.packType === item.value}
              label={item.label}
              description={item.description}
              onClick={() => onChange({ ...form, packType: item.value })}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
          Execution mode
        </p>
        <div className="mt-3 space-y-3">
          {modes.map((item) => (
            <ChoiceCard
              key={item.value}
              active={form.executionMode === item.value}
              label={item.label}
              description={item.description}
              onClick={() => onChange({ ...form, executionMode: item.value })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function FocusStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  const tags = form.focusAreasText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <Field label="Focus areas">
        <Input
          value={form.focusAreasText}
          onChange={(event) =>
            onChange({ ...form, focusAreasText: event.target.value })
          }
          placeholder="billing, onboarding, public-api..."
          className="h-11 font-mono"
        />
        <p className="mt-2 text-xs text-[#85858f]">
          Comma-separated. Used for semantic routing and prompts.
        </p>
      </Field>

      <div>
        <p className="text-sm font-semibold text-[#34343b]">Preview</p>
        <div className="mt-2 min-h-14 rounded-md bg-[#f4f4f5] p-3">
          {tags.length === 0 ? (
            <p className="text-sm text-[#909099]">No focus areas yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ValidationStep({ form }: { form: SkillForm }) {
  const tags = form.focusAreasText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <SummaryRow label="Label" value={form.label || "-"} />
      <SummaryRow
        label="Key"
        value={
          form.key ||
          form.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          "-"
        }
      />
      <SummaryRow label="Pack type" value={form.packType} />
      <SummaryRow label="Execution mode" value={form.executionMode} />

      <div>
        <p className="text-sm font-semibold text-[#34343b]">Translations</p>
        <div className="mt-2 space-y-3">
          <TranslationSummary language="FR" form={form} />
          <TranslationSummary language="EN" form={form} />
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e1e5] bg-[#f6f6f7] p-4">
        <p className="text-sm font-semibold text-[#34343b]">Focus areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-white">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-[#8a8a93]">None</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TranslationSummary({
  language,
  form,
}: {
  language: string;
  form: SkillForm;
}) {
  return (
    <div className="rounded-lg border border-[#e1e1e5] bg-white p-4">
      <p className="text-sm font-semibold">{language}</p>
      <p className="mt-3 text-sm leading-6 text-[#5f5f68]">
        {form.mission || "Missing translation"}
      </p>
      {form.activation ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.activation}
        </p>
      ) : null}
      {form.capabilities ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.capabilities}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceCard({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dfdfe3] bg-white hover:bg-[#f8f8f9]",
      )}
    >
      <p className="font-mono text-sm font-semibold text-[#28282e]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[#777780]">{description}</p>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ececef] py-3 text-sm">
      <span className="text-[#7b7b85]">{label}</span>
      <span className="text-right font-mono font-semibold text-[#303038]">
        {value}
      </span>
    </div>
  );
}
