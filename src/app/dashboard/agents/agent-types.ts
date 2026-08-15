export type AgentTemplate = "support" | "sales";
export type AgentDetailTab = "overview" | "prompts" | "skills" | "blueprint" | "technical";
export type AgentBlueprintTab = "context" | "targets" | "rules";
export type AgentToolMode = "automatic" | "explicit";
export type AgentStatus = "draft" | "published" | "paused";
export type AgentIntegrationStatus = "not_configured" | "ready";

export type AgentTeamMember = {
  id: string;
  title: string;
  mission: string;
};

export type AgentProfile = {
  id: string;
  template: AgentTemplate;
  name: string;
  description: string;
  welcomeMessage: string;
  businessPrompt: string;
  businessContext: string;
  offers: string;
  targetUsers: string;
  expectedOutcomes: string;
  guardrails: string;
  escalationRules: string;
  uiNotes: string;
  executionPolicy: string;
  selectedSkills: string[];
  selectedTools: string[];
  toolMode: AgentToolMode;
  members: AgentTeamMember[];
  status: AgentStatus;
  integrationStatus: AgentIntegrationStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AgentForm = Omit<
  AgentProfile,
  "id" | "status" | "integrationStatus" | "isDefault" | "createdAt" | "updatedAt"
>;
