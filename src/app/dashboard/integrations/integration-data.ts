import type { Category, Integration, SyncEvent } from "./integration-types";

export const STORAGE_KEY = "leadia-integrations-v1";

export const initialIntegrations: Integration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "Send qualified leads, contact properties and conversation summaries to HubSpot CRM.",
    category: "crm",
    status: "connected",
    lastSync: "5 minutes ago",
    events: 148,
    color: "bg-orange-500",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description:
      "Create and update Salesforce leads when visitors reach your qualification threshold.",
    category: "crm",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-sky-500",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Notify sales channels about hot leads, handoffs and booked meetings.",
    category: "communication",
    status: "connected",
    lastSync: "12 minutes ago",
    events: 82,
    color: "bg-violet-600",
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Send follow-up emails and notify account owners after important conversations.",
    category: "communication",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-red-500",
  },
  {
    id: "calendly",
    name: "Calendly",
    description:
      "Offer available slots in the AI conversation and synchronize booked demonstrations.",
    category: "calendar",
    status: "connected",
    lastSync: "31 minutes ago",
    events: 36,
    color: "bg-blue-600",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description:
      "Forward Leadia events to your own backend or automation platform.",
    category: "automation",
    status: "error",
    lastSync: "1 hour ago",
    events: 214,
    color: "bg-[#171717]",
  },
];

export const initialEvents: SyncEvent[] = [
  {
    id: "event-1",
    integration: "HubSpot",
    action: "Lead Amira Ben Salah synchronized",
    status: "success",
    time: "5 min ago",
  },
  {
    id: "event-2",
    integration: "Slack",
    action: "Hot lead notification delivered",
    status: "success",
    time: "12 min ago",
  },
  {
    id: "event-3",
    integration: "Calendly",
    action: "Meeting with Sara Trabelsi imported",
    status: "success",
    time: "31 min ago",
  },
  {
    id: "event-4",
    integration: "Webhooks",
    action: "Endpoint returned HTTP 500",
    status: "failed",
    time: "1 hour ago",
  },
];

export const categoryLabels: Record<Category, string> = {
  crm: "CRM",
  communication: "Communication",
  calendar: "Calendar",
  automation: "Automation",
};
