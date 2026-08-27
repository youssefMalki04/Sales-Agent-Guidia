import type { Category, Integration } from "./integration-types";

export const integrationCatalog: Integration[] = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Store leads, conversations, meetings and application data.",
    category: "automation",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-emerald-500",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "Send qualified leads, contact properties and conversation summaries to HubSpot CRM.",
    category: "crm",
    status: "disconnected",
    lastSync: null,
    events: 0,
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
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-violet-600",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description:
      "Generate grounded answers, embeddings and lead qualification scores.",
    category: "automation",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-blue-500",
  },
  {
    id: "widget",
    name: "Website widget",
    description: "Track visitor sessions and run Leadia on your website.",
    category: "communication",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-[#5964d6]",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description:
      "Forward Leadia events to your own backend or automation platform.",
    category: "automation",
    status: "disconnected",
    lastSync: null,
    events: 0,
    color: "bg-[#171717]",
  },
];

export const categoryLabels: Record<Category, string> = {
  crm: "CRM",
  communication: "Communication",
  calendar: "Calendar",
  automation: "Automation",
};
