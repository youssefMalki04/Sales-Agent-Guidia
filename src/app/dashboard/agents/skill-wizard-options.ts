import type { SkillExecutionMode, SkillPackType } from "./skill-types";

export const skillPackTypeOptions: Array<{
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

export const skillExecutionModeOptions: Array<{
  value: SkillExecutionMode;
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
