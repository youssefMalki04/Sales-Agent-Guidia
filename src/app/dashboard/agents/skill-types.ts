export type SkillSource = "platform" | "custom";
export type SkillPackType = "domain" | "knowledge" | "execution" | "compliance" | "training" | "custom";
export type SkillExecutionMode = "assist" | "act" | "guarded_act";

export type SkillTranslation = {
  language: string;
  mission: string;
  activation: string;
  capabilities: string;
};

export type SkillPack = {
  id: string;
  key: string;
  label: string;
  source: SkillSource;
  packType: SkillPackType;
  executionMode: SkillExecutionMode;
  languages: string[];
  tags: string[];
  focusAreas: string[];
  translations: SkillTranslation[];
  accent: "red" | "green" | "yellow" | "cyan" | "neutral" | "violet";
};

export type SkillForm = {
  key: string;
  label: string;
  mission: string;
  activation: string;
  capabilities: string;
  packType: SkillPackType;
  executionMode: SkillExecutionMode;
  focusAreasText: string;
};
