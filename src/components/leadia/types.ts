import type { LucideIcon } from "lucide-react";

export type WorkspaceTab = "workspaces" | "sales-agents";

export type WorkspaceView = "workspace" | "agent-detail";

export type SalesAgentApp = {
  id: string;
  name: string;
  slug: string;
  description: string;
  baseUrl: string;
  allowedDomains: string;
  active: boolean;
  created: string;
  token: string;
};

export type SalesAgentForm = {
  name: string;
  slug: string;
  description: string;
  baseUrl: string;
  allowedDomains: string;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};
