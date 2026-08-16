export type SourceType = "video" | "image" | "html";
export type InputMode = "link" | "upload" | "paste";

export type TourSource = {
  id: string;
  title: string;
  description: string;
  type: SourceType;
  inputMode: InputMode;
  url: string;
  fileName: string;
  rawHtml: string;
};

export type ReplayStorage = {
  id: string;
  title: string;
  videoUrl: string;
};

export type GeneratedPage = {
  id: string;
  title: string;
  key: string;
};

export type GeneratedFlow = {
  id: string;
  title: string;
  key: string;
  description: string;
  businessGoal: string;
  safetyMode: "guide" | "confirm" | "auto";
  active: boolean;
  steps: string[];
};

export type AiDraft = {
  pages: GeneratedPage[];
  actions: [];
  flows: GeneratedFlow[];
  notes: string[];
};
