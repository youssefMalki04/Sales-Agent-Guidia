export type Category = "crm" | "communication" | "calendar" | "automation";
export type IntegrationStatus = "connected" | "disconnected" | "error";
export type Integration = {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: IntegrationStatus;
  lastSync: string | null;
  events: number;
  color: string;
  detail?: string;
  actionHref?: string;
};

export type SyncEvent = {
  id: string;
  integration: string;
  action: string;
  status: "success" | "failed";
  time: string;
};
