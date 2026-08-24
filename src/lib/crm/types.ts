export type CrmExportTarget = "hubspot" | "salesforce" | "slack" | "webhook";

export type LeadExportPayload = {
  id?: string;
  sessionId?: string;
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  sector?: string;
  need?: string;
  budget?: string;
  urgency?: string;
  leadTemperature?: "cold" | "warm" | "hot";
  conversionScore?: number;
  objections?: string[];
  summary?: string;
  suggestedNextAction?: string;
};

export type CrmExportResult = {
  target: CrmExportTarget;
  status: "sent" | "skipped" | "failed";
  message: string;
  response?: unknown;
};
