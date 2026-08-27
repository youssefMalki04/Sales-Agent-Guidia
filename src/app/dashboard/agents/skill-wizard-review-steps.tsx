import { Badge } from "@/components/ui/badge";

import type { SkillForm } from "./skill-types";
import {
  ChoiceCard,
  SummaryRow,
  TranslationSummary,
} from "./skill-wizard-fields";
import {
  skillExecutionModeOptions,
  skillPackTypeOptions,
} from "./skill-wizard-options";

export function BehaviorStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
          Pack type
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {skillPackTypeOptions.map((item) => (
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
          {skillExecutionModeOptions.map((item) => (
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

export function ValidationStep({ form }: { form: SkillForm }) {
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
