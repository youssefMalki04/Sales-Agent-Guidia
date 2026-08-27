import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { agentSkills as skills } from "./agent-presets";
import type { AgentProfile } from "./agent-types";

export function Overview({ profile }: { profile: AgentProfile }) {
  const checklist = [
    ["Profile configured", Boolean(profile.name && profile.description)],
    ["Knowledge skills selected", profile.selectedSkills.length > 0],
    ["Tools configured", profile.selectedTools.length > 0],
    ["Agent published", profile.status === "published"],
  ] as const;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Description
        </p>
        <p className="mt-3 text-sm">{profile.description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info
            label="Persona"
            value={profile.template === "support" ? "assistant" : "advisor"}
          />
          <Info
            label="Tone"
            value={
              profile.template === "support" ? "operational" : "consultative"
            }
          />
        </div>
      </section>
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Integration checklist</h2>
        <p className="mt-1 text-sm text-[#777780]">
          Complete these steps before website integration.
        </p>
        <div className="mt-5 space-y-3">
          {checklist.map(([label, done]) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "text-[#9999a2]",
                )}
              >
                {done && <Check className="size-3.5" />}
              </span>
              <span className={done ? "font-semibold" : "text-[#777780]"}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export function Prompts({ profile }: { profile: AgentProfile }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Exported identity</h2>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Display name
        </p>
        <p className="mt-2 text-sm">{profile.name}</p>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Welcome message
        </p>
        <p className="mt-2 text-sm leading-6">{profile.welcomeMessage}</p>
      </section>
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Business system prompt</h2>
        <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-[#101014] p-5 text-xs leading-6 text-white">
          {profile.businessPrompt}
        </pre>
      </section>
    </div>
  );
}
export function ProfileSkills({ profile }: { profile: AgentProfile }) {
  return (
    <section className="rounded-lg border bg-white p-7">
      <h2 className="text-lg font-semibold">Skill packs</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {skills
          .filter(([id]) => profile.selectedSkills.includes(id))
          .map(([id, name, meta]) => (
            <article
              key={id}
              className="rounded-lg border border-[#8f8f98] bg-[#fafafa] p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="mt-1 text-xs text-[#777780]">{meta}</p>
                </div>
                <Badge>ACTIVE</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#55555f]">
                This skill pack is active for {profile.name}. It contributes its
                mission, activation rules and guardrails to the final agent
                prompt.
              </p>
            </article>
          ))}
      </div>
    </section>
  );
}
export function Blueprint({ profile }: { profile: AgentProfile }) {
  const items = [
    ["Business context", profile.businessContext],
    ["Offers & services", profile.offers],
    ["End users", profile.targetUsers],
    ["Expected outcomes", profile.expectedOutcomes],
    ["Guardrails", profile.guardrails],
    ["Escalation rules", profile.escalationRules],
    ["UI & workflow notes", profile.uiNotes],
    ["Execution policy", profile.executionPolicy],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map(([title, value]) => (
        <section key={title} className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#55555f]">{value}</p>
        </section>
      ))}
    </div>
  );
}
export function Technical({ profile }: { profile: AgentProfile }) {
  const rows = [
    ["Profile ID", profile.id],
    ["Application (catalog)", "f80cfbdd-f364-49c6-9fb8-176d411576c3"],
    ["Source template", `${profile.template}-agent`],
    ["Created", profile.createdAt],
    ["Updated", profile.updatedAt],
    ["Default", profile.isDefault ? "yes" : "no"],
  ];
  return (
    <section className="rounded-lg border bg-white p-7">
      <h2 className="text-lg font-semibold">Identifiers & metadata</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <Info key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f1f1f3] p-4">
      <p className="text-xs font-bold uppercase text-[#777780]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
