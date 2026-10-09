import {
  Bell,
  Blocks,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Building2,
  Camera,
  CalendarDays,
  Columns3,
  Code2,
  FileText,
  FileSpreadsheet,
  LayoutGrid,
  Link2,
  ListChecks,
  MessagesSquare,
  Route,
  Rocket,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  UsersRound,
  Video,
  SunMedium,
} from "lucide-react";

import type { NavItem, SalesAgentApp, SalesAgentForm } from "./types";

export const platformItems: NavItem[] = [
  { label: "Getting started", icon: Rocket, href: "/dashboard/onboarding" },
  { label: "Organization", icon: Building2, href: "/dashboard/organization" },
  { label: "Team", icon: UsersRound, href: "/dashboard/team" },
  { label: "Sales agents", icon: Bot, href: "/dashboard/agents" },
  { label: "Knowledge base", icon: BookOpen, href: "/dashboard/knowledge" },
  {
    label: "Qualification flows",
    icon: Route,
    href: "/dashboard/qualification-flows",
  },
  { label: "Replay sessions", icon: Video, href: "/dashboard/replay-sessions" },
  { label: "Branding", icon: Settings2, href: "/dashboard/branding" },
  { label: "Settings", icon: SlidersHorizontal, href: "/dashboard/settings" },
  { label: "Privacy & GDPR", icon: ShieldCheck, href: "/dashboard/privacy" },
];

export const dataItems: NavItem[] = [
  { label: "My Day", icon: SunMedium, href: "/dashboard/my-day" },
  { label: "Analytics", icon: LayoutGrid, href: "/dashboard/analytics" },
  { label: "Live inbox", icon: MessagesSquare, href: "/dashboard/inbox" },
  { label: "Conversations", icon: Camera, href: "/dashboard/conversations" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Leads", icon: BriefcaseBusiness, href: "/dashboard/leads" },
  { label: "Tasks", icon: ListChecks, href: "/dashboard/tasks" },
  { label: "Sales pipeline", icon: Columns3, href: "/dashboard/pipeline" },
  { label: "Meetings", icon: CalendarDays, href: "/dashboard/meetings" },
  { label: "Tickets", icon: Ticket, href: "/dashboard/tickets" },
  { label: "Docs", icon: FileText, href: "/dashboard/docs" },
  {
    label: "Import / Export",
    icon: FileSpreadsheet,
    href: "/dashboard/import-export",
  },
];

export const integrationItems: NavItem[] = [
  {
    label: "Integration center",
    icon: Blocks,
    href: "/dashboard/integrations",
  },
  {
    label: "Widget installation",
    icon: Code2,
    href: "/dashboard/widget-installation",
  },
  { label: "Webhooks", icon: Link2, href: "/dashboard/webhooks" },
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
