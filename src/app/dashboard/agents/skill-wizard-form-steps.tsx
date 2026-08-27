import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { SkillForm } from "./skill-types";
import { Field } from "./skill-wizard-fields";

export function IdentityStep({
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

export function DescriptionStep({
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

export function FocusStep({
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
