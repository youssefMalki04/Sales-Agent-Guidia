"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  Loader2,
  MessageSquare,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  Integration,
  ToolPolicy as Policy,
  ToolsSubTab,
} from "./tool-types";

const initialIntegrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    shortName: "Slack",
    iconText: "✣",
    iconClassName: "text-[#5a1d55]",
    configured: false,
    active: true,
    oauthLabel: "Slack · OAuth N/A",
    policy: "confirmation",
    tools: ["list channels", "list users", "open dm", "send message", "search"],
    confirmedTools: ["send message", "search"],
    credentialFields: [
      {
        key: "botToken",
        label: "Bot token",
        placeholder: "xoxb-...",
        type: "password",
      },
      {
        key: "workspace",
        label: "Workspace ID",
        placeholder: "T0123456789",
      },
    ],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    shortName: "Zendesk",
    iconText: "Z",
    iconClassName: "text-[#0f3837]",
    configured: false,
    active: true,
    oauthLabel: "Zendesk · OAuth N/A",
    policy: "confirmation",
    tools: [
      "assign ticket",
      "add ticket comment",
      "create ticket",
      "search tickets",
      "get ticket",
      "update ticket",
    ],
    confirmedTools: [
      "assign ticket",
      "add ticket comment",
      "create ticket",
      "update ticket",
    ],
    credentialFields: [
      {
        key: "subdomain",
        label: "Zendesk subdomain",
        placeholder: "your-company",
      },
      {
        key: "apiToken",
        label: "API token",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "jira",
    name: "Jira",
    shortName: "Atlassian",
    iconText: "●",
    iconClassName: "text-[#2167d5]",
    configured: false,
    active: true,
    oauthLabel: "Atlassian · OAuth N/A",
    policy: "confirmation",
    tools: [
      "create issue",
      "search issues",
      "get issue",
      "add comment",
      "update issue",
    ],
    confirmedTools: ["create issue", "add comment"],
    credentialFields: [
      {
        key: "siteUrl",
        label: "Atlassian site URL",
        placeholder: "https://your-company.atlassian.net",
      },
      {
        key: "apiToken",
        label: "API token",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    shortName: "Freshdesk",
    iconText: "S",
    iconClassName: "text-[#35bd70]",
    configured: false,
    active: true,
    oauthLabel: "Freshdesk · API key",
    policy: "confirmation",
    tools: [
      "create ticket",
      "get ticket",
      "search tickets",
      "update ticket status",
    ],
    confirmedTools: ["create ticket", "update ticket status"],
    credentialFields: [
      {
        key: "domain",
        label: "Freshdesk domain",
        placeholder: "https://your-company.freshdesk.com",
      },
      {
        key: "apiKey",
        label: "API key",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    shortName: "HubSpot",
    iconText: "h",
    iconClassName: "text-[#f47745]",
    configured: false,
    active: true,
    oauthLabel: "HubSpot · OAuth N/A",
    policy: "confirmation",
    tools: ["create lead", "create ticket", "search contact"],
    confirmedTools: ["create lead", "create ticket"],
    credentialFields: [
      {
        key: "portalId",
        label: "Portal ID",
        placeholder: "12345678",
      },
      {
        key: "accessToken",
        label: "Private app access token",
        placeholder: "pat-...",
        type: "password",
      },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    shortName: "Salesforce",
    iconText: "☁",
    iconClassName: "text-[#2ca7df]",
    configured: false,
    active: true,
    oauthLabel: "Salesforce · OAuth N/A",
    policy: "confirmation",
    tools: ["create lead", "create case", "search"],
    confirmedTools: ["create lead", "create case"],
    credentialFields: [
      {
        key: "instanceUrl",
        label: "Instance URL",
        placeholder: "https://yourorg.my.salesforce.com",
      },
      {
        key: "accessToken",
        label: "OAuth access token",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "google-calendar",
    name: "Google Calendar & Meet",
    shortName: "Google",
    iconText: "▦",
    iconClassName: "text-[#4385f5]",
    configured: false,
    active: true,
    oauthLabel: "Google · OAuth N/A",
    policy: "confirmation",
    tools: ["list events", "create event", "update event", "create meet"],
    confirmedTools: ["create event", "update event", "create meet"],
    credentialFields: [
      {
        key: "clientId",
        label: "OAuth client ID",
        placeholder: "client-id.apps.googleusercontent.com",
      },
      {
        key: "clientSecret",
        label: "OAuth client secret",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    shortName: "Google",
    iconText: "▤",
    iconClassName: "text-[#2e9f59]",
    configured: false,
    active: true,
    oauthLabel: "Google · OAuth N/A",
    policy: "confirmation",
    tools: ["read sheet", "append row", "update cells"],
    confirmedTools: ["append row", "update cells"],
    credentialFields: [
      {
        key: "clientId",
        label: "OAuth client ID",
        placeholder: "client-id.apps.googleusercontent.com",
      },
      {
        key: "clientSecret",
        label: "OAuth client secret",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
  {
    id: "calendly",
    name: "Calendly",
    shortName: "Calendly",
    iconText: "▶",
    iconClassName: "text-[#1267d6]",
    configured: false,
    active: true,
    oauthLabel: "Calendly · OAuth N/A",
    policy: "confirmation",
    tools: ["list event types", "create scheduling link", "cancel event"],
    confirmedTools: ["create scheduling link", "cancel event"],
    credentialFields: [
      {
        key: "accessToken",
        label: "Personal access token",
        placeholder: "••••••••••••",
        type: "password",
      },
    ],
  },
];

export function ToolsView() {
  const [subTab, setSubTab] = useState<ToolsSubTab>("integrations");
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedIntegration = useMemo(
    () =>
      integrations.find(
        (integration) => integration.id === selectedIntegrationId,
      ) ?? null,
    [integrations, selectedIntegrationId],
  );
  const connectedCount = integrations.filter(
    (integration) => integration.configured,
  ).length;
  const activeCount = integrations.filter(
    (integration) => integration.active,
  ).length;

  function updateIntegration(
    id: string,
    updater: (integration: Integration) => Integration,
  ) {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === id ? updater(integration) : integration,
      ),
    );
  }

  function openCredentials(integration: Integration) {
    const existingValues = integration.credentialFields.reduce<
      Record<string, string>
    >((values, field) => {
      values[field.key] = "";
      return values;
    }, {});

    setCredentials(existingValues);
    setSelectedIntegrationId(integration.id);
  }

  function saveCredentials() {
    if (!selectedIntegration) return;

    const missingRequiredValue = selectedIntegration.credentialFields.some(
      (field) => !credentials[field.key]?.trim(),
    );

    if (missingRequiredValue) return;

    updateIntegration(selectedIntegration.id, (integration) => ({
      ...integration,
      configured: true,
    }));

    setSelectedIntegrationId(null);
    setToast(`${selectedIntegration.name} connected`);
    window.setTimeout(() => setToast(null), 3000);
  }

  function testIntegration(id: string) {
    setTestingId(id);

    window.setTimeout(() => {
      setTestingId(null);
      const integration = integrations.find((item) => item.id === id);
      setToast(`${integration?.name ?? "Integration"} connection successful`);
      window.setTimeout(() => setToast(null), 3000);
    }, 1300);
  }

  return (
    <>
      <section className="soft-panel-enter mt-6 overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
              <Sparkles className="size-3.5" /> Connected workspace
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Agent tools
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Connect the services your agents need to complete customer tasks.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <ToolMetric value={connectedCount} label="Connected" />
            <ToolMetric value={activeCount} label="Active" />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-1.5">
        <ToolsSubTabs activeTab={subTab} onChange={setSubTab} />
      </section>

      {subTab === "integrations" ? (
        <section className="soft-stagger mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              isTesting={testingId === integration.id}
              onToggleActive={() =>
                updateIntegration(integration.id, (current) => ({
                  ...current,
                  active: !current.active,
                }))
              }
              onPolicyChange={(policy) =>
                updateIntegration(integration.id, (current) => ({
                  ...current,
                  policy,
                }))
              }
              onCredentials={() => openCredentials(integration)}
              onTest={() => testIntegration(integration.id)}
            />
          ))}
        </section>
      ) : (
        <ToolsPlaceholder tab={subTab} />
      )}

      <CredentialsDialog
        integration={selectedIntegration}
        values={credentials}
        onValueChange={(key, value) =>
          setCredentials((current) => ({ ...current, [key]: value }))
        }
        onClose={() => setSelectedIntegrationId(null)}
        onSave={saveCredentials}
      />

      {toast ? (
        <div className="fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          <CheckCircle2 className="size-5" />
          {toast}
        </div>
      ) : null}
    </>
  );
}

function ToolMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ToolsSubTabs({
  activeTab,
  onChange,
}: {
  activeTab: ToolsSubTab;
  onChange: (tab: ToolsSubTab) => void;
}) {
  const items = [
    {
      value: "integrations" as const,
      label: "Integrations",
      icon: Wrench,
    },
    {
      value: "audit-log" as const,
      label: "Audit log",
      icon: ClipboardList,
    },
    {
      value: "meetings" as const,
      label: "Meetings",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all sm:px-6",
              active
                ? "bg-white text-[#5964d6] shadow-[0_3px_12px_rgba(89,100,214,0.10)]"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
            )}
          >
            <Icon className="size-[18px]" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function IntegrationCard({
  integration,
  isTesting,
  onToggleActive,
  onPolicyChange,
  onCredentials,
  onTest,
}: {
  integration: Integration;
  isTesting: boolean;
  onToggleActive: () => void;
  onPolicyChange: (policy: Policy) => void;
  onCredentials: () => void;
  onTest: () => void;
}) {
  const hiddenToolsCount = Math.max(0, integration.tools.length - 4);

  return (
    <article className="soft-lift flex min-h-[560px] flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#e1e4f8] bg-[#f5f6ff] text-2xl font-bold">
            <span className={integration.iconClassName}>
              {integration.iconText}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {integration.name}
            </h2>

            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-sm font-medium",
                integration.configured ? "text-emerald-600" : "text-slate-400",
              )}
            >
              {integration.configured ? (
                <BadgeCheck className="size-4" />
              ) : (
                <Radio className="size-4" />
              )}
              {integration.configured ? "Connected" : "Not configured"}
            </div>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
          Confirmation required
        </span>
      </header>

      <div className="mt-4">
        <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 px-3">
          <span className="text-sm font-semibold text-[#3d3d45]">
            Integration active
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={integration.active}
            onClick={onToggleActive}
            className={cn(
              "relative h-6 w-11 rounded-full transition",
              integration.active ? "bg-[#5964d6]" : "bg-slate-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
                integration.active ? "left-[22px]" : "left-0.5",
              )}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-[#9999a2]">
          {integration.active ? "Disable" : "Enable"}
        </p>
      </div>

      <section className="mt-4 rounded-2xl bg-[#fafafd] p-4 ring-1 ring-slate-100">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#777780]">
            Tools
          </p>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold">
            {integration.tools.length}
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {integration.confirmedTools.length}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {integration.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm"
            >
              {tool}
              {integration.confirmedTools.includes(tool) ? (
                <span className="ml-1 text-amber-500">○</span>
              ) : null}
            </span>
          ))}
        </div>

        {hiddenToolsCount > 0 ? (
          <button
            type="button"
            className="mt-3 text-xs font-semibold text-[#55555e]"
          >
            Show {hiddenToolsCount} more
          </button>
        ) : null}
      </section>

      <PolicySelector value={integration.policy} onChange={onPolicyChange} />

      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            disabled
            className="truncate text-xs"
          >
            {integration.oauthLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCredentials}
            className="gap-2 rounded-xl border-[#dfe2eb] text-slate-700 hover:border-[#cfd3ed] hover:bg-[#f5f6ff]"
          >
            <Settings2 className="size-4" />
            Credentials
          </Button>
        </div>

        {integration.configured ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isTesting}
            onClick={onTest}
            className="mt-2 h-10 w-full gap-2 rounded-xl text-[#5964d6] hover:bg-[#f1f2ff] hover:text-[#4f5acb]"
          >
            {isTesting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <ClipboardList className="size-4" />
                Test
              </>
            )}
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="mt-3 h-11 w-full gap-2 rounded-xl border-[#cfd3ed] bg-[#f5f6ff] font-semibold text-[#5964d6] hover:bg-[#eef0ff] hover:text-[#4f5acb]"
        >
          <Sparkles className="size-4" />
          Agent skill & prompt
        </Button>
      </div>
    </article>
  );
}

function PolicySelector({
  value,
  onChange,
}: {
  value: Policy;
  onChange: (policy: Policy) => void;
}) {
  const options: Array<{
    value: Policy;
    label: string;
    icon: typeof ShieldCheck;
  }> = [
    { value: "allowed", label: "Allowed", icon: CheckCircle2 },
    {
      value: "confirmation",
      label: "Confirmation required",
      icon: ShieldCheck,
    },
    { value: "blocked", label: "Blocked", icon: MessageSquare },
  ];

  return (
    <section className="mt-4 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#777780]">
          Set policy
        </p>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
          {value === "confirmation"
            ? "Confirmation required"
            : value === "allowed"
              ? "Allowed"
              : "Blocked"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {options.map((option) => {
          const Icon = option.icon;
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-md border px-3 text-left text-sm font-semibold transition",
                active && option.value === "confirmation"
                  ? "border-amber-300 bg-amber-50 text-amber-700 shadow-[inset_0_0_0_1px_#f5c95d]"
                  : active
                    ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6]"
                    : "border-slate-200 bg-white hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border",
                  active
                    ? "border-[#5964d6] bg-[#5964d6]"
                    : "border-[#bfc0c6] bg-white",
                )}
              >
                {active ? (
                  <span className="size-1.5 rounded-full bg-white" />
                ) : null}
              </span>
              <Icon className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CredentialsDialog({
  integration,
  values,
  onValueChange,
  onClose,
  onSave,
}: {
  integration: Integration | null;
  values: Record<string, string>;
  onValueChange: (key: string, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!integration) return null;

  const canSave = integration.credentialFields.every((field) =>
    values[field.key]?.trim(),
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[470px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Configure: {integration.name}
          </DialogTitle>
          <p className="text-sm leading-6 text-[#777780]">
            {integration.tools.join(", ")}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {integration.credentialFields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-sm font-semibold text-[#3c3c44]">
                {field.label}
              </span>
              <Input
                type={field.type ?? "text"}
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  onValueChange(field.key, event.target.value)
                }
                placeholder={field.placeholder}
                className="mt-2 h-11"
              />
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
          >
            <KeyRound className="size-4" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToolsPlaceholder({
  tab,
}: {
  tab: Exclude<ToolsSubTab, "integrations">;
}) {
  return (
    <section className="soft-panel-enter mt-6 flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd]">
      <div className="text-center">
        <h2 className="text-xl font-semibold capitalize">
          {tab.replace("-", " ")}
        </h2>
        <p className="mt-2 text-sm text-[#7b7b85]">
          This module will be connected to the same tools configuration.
        </p>
      </div>
    </section>
  );
}
