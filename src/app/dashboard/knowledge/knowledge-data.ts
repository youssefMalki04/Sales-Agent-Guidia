export type KnowledgeDocument = {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  language: string;
  created_at: string;
};

export type Scope = "Support" | "Demo" | "Training" | "Pre-sales";
export type SourceType = "all" | "note" | "file" | "url";
export type NoteMode = "scratch" | "template";

export type ClientKnowledgeDocument = KnowledgeDocument & {
  chunks: number;
  scope: Scope;
  active: boolean;
};

export type NoteForm = {
  mode: NoteMode;
  template: string;
  title: string;
  content: string;
  scope: Scope;
  category: string;
  tags: string;
  sourceUrl: string;
};

export type UrlForm = {
  startUrl: string;
  scope: Scope;
  category: string;
  tags: string;
  maxPages: number;
  maxDepth: number;
  includeSubdomains: boolean;
  sameRootPath: boolean;
};

export const categories = [
  "FAQ & common questions",
  "Troubleshooting & errors",
  "Pricing, plans & billing",
  "Account & subscription",
  "Product & features",
  "Integrations & API",
  "Security & compliance",
  "Escalation & human handoff",
  "Policies & legal",
  "Glossary & definitions",
  "Journeys & workflows",
  "Sales pitch",
];

export const templates = [
  {
    id: "pricing",
    label: "Pricing, packaging & commercial terms · Support",
    scope: "Support" as Scope,
    category: "Pricing, plans & billing",
    title: "Pricing, packaging & commercial terms",
    tags: "pricing, packaging, billing, faq",
    content: `## Pricing overview\n\n- Available plans:\n- Included features:\n- Usage limits:\n- Upgrade and downgrade rules:\n\n## Billing\n\n- Billing cycles:\n- Accepted payment methods:\n- Invoice availability:\n- Refund policy:\n\n## Guardrails\n\n- Never invent discounts or contractual commitments.\n- Escalate custom pricing requests to a human.`,
  },
  {
    id: "product-facts",
    label: "Product facts, agent capabilities & boundaries · Support",
    scope: "Support" as Scope,
    category: "Product & features",
    title: "Product facts, capabilities & boundaries",
    tags: "product, capabilities, limits, support",
    content: `## Product facts\n\n- Core capabilities:\n- Supported use cases:\n- Known limitations:\n\n## Agent boundaries\n\n- What the agent may explain:\n- What requires confirmation:\n- What requires human escalation:`,
  },
  {
    id: "onboarding",
    label: "User onboarding & guided flows · Training",
    scope: "Training" as Scope,
    category: "Journeys & workflows",
    title: "User onboarding & guided flows",
    tags: "onboarding, training, workflows, ui",
    content: `## Onboarding journey\n\n1. Account setup\n2. Workspace configuration\n3. First successful action\n4. Validation checklist\n\n## Common blockers\n\n- Missing permissions\n- Incomplete setup\n- Wrong workspace selection`,
  },
  {
    id: "sales",
    label: "Sales playbook & discovery · Demo",
    scope: "Demo" as Scope,
    category: "Sales pitch",
    title: "Sales playbook & discovery",
    tags: "vente, argumentaire, bénéfices, différenciation",
    content: `## Commercial motion\n\n### ICP & narrative\n- Ideal customer profile, segments to disqualify:\n- One-line value proposition plus three proof points:\n\n### Discovery\n- Qualification questions:\n- Buying signals / anti-signals:\n\n### Objections\n- Objection → aligned product answer + proof:\n- When to propose a demo:\n\n### Compliance\n- Never promise outside contract; route legal or custom terms to a human.`,
  },
];

export const initialNoteForm: NoteForm = {
  mode: "scratch",
  template: "",
  title: "",
  content: "",
  scope: "Support",
  category: "",
  tags: "",
  sourceUrl: "",
};

export const initialUrlForm: UrlForm = {
  startUrl: "",
  scope: "Support",
  category: "",
  tags: "",
  maxPages: 30,
  maxDepth: 2,
  includeSubdomains: false,
  sameRootPath: true,
};
