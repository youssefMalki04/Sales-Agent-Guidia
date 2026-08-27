export type FlowMainTab = "generate" | "pages" | "actions" | "flows";
export type FlowSafetyMode = "guide" | "confirm" | "auto";
export type FlowDrawerMode = "view" | "create" | "edit" | null;

export type TourPage = {
  id: string;
  title: string;
  key: string;
};

export type FlowStep = {
  id: string;
  title: string;
  field?: string;
  required?: boolean;
  weight?: number;
};

export type FlowScoring = { coldMax: number; warmMax: number };

export type QualificationFlow = {
  id: string;
  key: string;
  title: string;
  description: string;
  businessGoal: string;
  tags: string[];
  safetyMode: FlowSafetyMode;
  active: boolean;
  entryPageIds: string[];
  steps: FlowStep[];
  scoring?: FlowScoring;
};

export type QualificationFlowForm = {
  key: string;
  title: string;
  description: string;
  businessGoal: string;
  tags: string;
  safetyMode: FlowSafetyMode;
  active: boolean;
  entryPageIds: string[];
  steps: FlowStep[];
  scoring: FlowScoring;
};
