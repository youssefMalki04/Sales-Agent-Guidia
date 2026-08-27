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

export type VisitorReplaySession = {
  session_id: string;
  lead_id: string | null;
  landing_page: string | null;
  last_page: string | null;
  status: "active" | "completed";
  started_at: string;
  last_seen_at: string;
};

export type VisitorReplayEvent = {
  id?: string;
  session_id: string;
  event_type: string;
  page_path?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
};
