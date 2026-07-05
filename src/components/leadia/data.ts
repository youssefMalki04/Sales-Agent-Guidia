import {
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Building2,
  Camera,
  FileText,
  LayoutGrid,
  Link2,
  Route,
  Settings2,
  Video,
} from "lucide-react";

import type { NavItem, SalesAgentApp, SalesAgentForm } from "./types";

export const platformItems: NavItem[] = [
  { label: "Workspace", icon: Building2, active: true },
  { label: "Sales agents", icon: Bot },
  { label: "Knowledge base", icon: BookOpen },
  { label: "Qualification flows", icon: Route },
  { label: "Replay sessions", icon: Video },
  { label: "Branding", icon: Settings2 },
];

export const dataItems: NavItem[] = [
  { label: "Analytics", icon: LayoutGrid },
  { label: "Conversations", icon: Camera },
  { label: "Notifications", icon: Bell },
  { label: "Leads", icon: BriefcaseBusiness },
  { label: "CRM payloads", icon: FileText },
];

export const integrationItems: NavItem[] = [
  { label: "Webhooks", icon: Link2 },
];

export const emptyAgentForm: SalesAgentForm = {
  name: "Leadia Sales Agent",
  slug: "leadia-sales-agent",
  description: "",
  baseUrl: "https://leadia.ai",
  allowedDomains: "*.leadia.ai",
};

export const defaultAgent: SalesAgentApp = {
  id: "agent_9b64f780",
  ...emptyAgentForm,
  active: true,
  created: "6/30/2026",
  token: "eyJhbGci...leadia_sales_token",
};
