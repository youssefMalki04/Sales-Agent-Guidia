import type { ScoringRule } from "./settings-types";

export const STORAGE_KEY = "guidia-scoring-rules-v1";
export const defaults: ScoringRule[] = [
  { id: "email", label: "Professional email detected", points: 10 },
  { id: "name", label: "Name detected", points: 5 },
  { id: "company", label: "Company detected", points: 10 },
  { id: "sector", label: "Sector identified", points: 10 },
  { id: "need", label: "Clear business need", points: 20 },
  { id: "budget", label: "Budget identified", points: 15 },
  { id: "urgency", label: "High urgency", points: 15 },
  { id: "crm", label: "CRM or integration mentioned", points: 5 },
  { id: "demo", label: "Demo, pricing or call request", points: 15 },
  { id: "objection", label: "Objection handled positively", points: 5 },
];

export const integrations = [
  ["Slack", "SLACK_WEBHOOK_URL"],
  ["HubSpot", "HUBSPOT_ACCESS_TOKEN"],
  ["Salesforce", "SALESFORCE_CLIENT_ID"],
  ["Generic webhook", "GENERIC_WEBHOOK_URL"],
] as const;
