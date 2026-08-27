import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MessageSquare,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Integration, ToolPolicy as Policy } from "./tool-types";

export function IntegrationCard({
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
