export type ReplayStatus = "ready" | "processing" | "failed";

export type VideoReplay = {
  id: string;
  title: string;
  status: ReplayStatus;
  duration: string;
  size: string;
  access: string;
  createdAt: string;
  videoUrl: string;
};

export type GeneratedPage = { id: string; title: string; key: string };

export type GeneratedFlow = {
  id: string;
  title: string;
  key: string;
  description: string;
  businessGoal: string;
  tags: string[];
  safetyMode: "guide" | "confirm" | "auto";
  active: boolean;
  entryPageId: string;
  steps: string[];
};

export type ReplayAiDraft = {
  replay: VideoReplay;
  page: GeneratedPage;
  flow: GeneratedFlow;
  notes: string[];
};
