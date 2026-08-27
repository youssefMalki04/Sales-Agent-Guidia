"use client";

import {
  Check,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { integrations } from "./settings-data";
import { Range } from "./settings-ui";
import { useSettings } from "./use-settings";

export default function SettingsPage() {
  const { rules, total, saved, updateRule, save, reset } = useSettings();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 sm:px-8 xl:px-14">
      <div className="soft-page-enter mx-auto max-w-[1180px] space-y-7">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Workspace configuration
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Sales settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Fine-tune lead scoring and review backend integration readiness.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={reset}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
            >
              <RotateCcw className="size-4" /> Reset
            </Button>
            <Button
              onClick={save}
              className="rounded-xl bg-[#5964d6] text-white shadow-[0_8px_18px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
            >
              {saved ? (
                <Check className="size-4" />
              ) : (
                <Save className="size-4" />
              )}
              {saved ? "Saved" : "Save rules"}
            </Button>
          </div>
        </header>
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                    <SlidersHorizontal className="size-4" />
                  </span>{" "}
                  Lead scoring
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Rules remain controlled by the application, not only by the
                  LLM.
                </p>
              </div>
              <Badge
                variant="outline"
                className="self-start rounded-full border-[#e1e4f8] bg-[#f1f2ff] px-3 text-[#5964d6]"
              >
                Maximum {total} points
              </Badge>
            </div>
            <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-[#fafafd] px-4">
              {rules.map((rule) => (
                <label
                  key={rule.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {rule.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={rule.points}
                      onChange={(event) =>
                        updateRule(rule.id, Number(event.target.value))
                      }
                      className="h-10 w-20 rounded-xl border-slate-200 bg-white text-right focus-visible:ring-[#939ae2]"
                    />
                    <span className="text-sm text-slate-500">pts</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Range label="Cold" value="0–39" tone="slate" />
              <Range label="Warm" value="40–69" tone="amber" />
              <Range label="Hot" value="70+" tone="red" />
            </div>
          </div>
          <aside className="space-y-5">
            <section className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
              <h2 className="flex items-center gap-2 font-semibold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                  <ShieldCheck className="size-4" />
                </span>{" "}
                Integrations
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Secrets are never stored in the browser. Configure them only in
                server environment variables.
              </p>
              <div className="mt-5 space-y-3">
                {integrations.map(([name, variable]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-slate-100 bg-[#fafafd] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-sm">{name}</b>
                      <Badge
                        variant="outline"
                        className="rounded-full border-[#e1e4f8] bg-white text-[#5964d6]"
                      >
                        Backend only
                      </Badge>
                    </div>
                    <code className="mt-2 block break-all text-xs text-slate-500">
                      {variable}
                    </code>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <b>CRM connections</b>
              <p className="mt-1">
                Configure and validate the required credentials before enabling
                CRM actions.
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
