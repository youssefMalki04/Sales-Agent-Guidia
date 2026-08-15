export type ToolsSubTab = "integrations" | "audit-log" | "meetings";
export type ToolPolicy = "allowed" | "confirmation" | "blocked";

export type Integration = {
  id: string;
  name: string;
  shortName: string;
  iconText: string;
  iconClassName: string;
  configured: boolean;
  active: boolean;
  oauthLabel: string;
  policy: ToolPolicy;
  tools: string[];
  confirmedTools: string[];
  credentialFields: Array<{
    key: string;
    label: string;
    placeholder: string;
    type?: "text" | "password";
  }>;
};
