import { Loader2, RefreshCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ConfigGroup, NumberField, Pagination } from "./memory-components";
import type { useMemory } from "./use-memory";

type MemoryConfigurationPanelProps = Pick<
  ReturnType<typeof useMemory>,
  | "config"
  | "maintenance"
  | "runMaintenance"
  | "saveConfiguration"
  | "saving"
  | "setConfig"
>;

export function MemoryConfigurationPanel({
  config,
  maintenance,
  runMaintenance,
  saveConfiguration,
  saving,
  setConfig,
}: MemoryConfigurationPanelProps) {
  return (
    <section className="soft-panel-enter mt-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Continuous learning configuration
          </h2>
          <p className="mt-2 text-sm text-[#7b7b85]">
            Define what the agent can learn on its own and what requires your
            approval.
          </p>
        </div>
        <Button
          disabled={maintenance}
          onClick={runMaintenance}
          className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          {maintenance ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Run maintenance
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(event) =>
              setConfig({ ...config, enabled: event.target.checked })
            }
          />
          Continuous learning enabled
        </label>
        <ConfigGroup
          title="Auto-inject (immediately available to the agent):"
          values={config.autoInject}
          onChange={(type, checked) =>
            setConfig({
              ...config,
              autoInject: { ...config.autoInject, [type]: checked },
            })
          }
        />
        <ConfigGroup
          title="Requires review before use:"
          values={config.reviewRequired}
          onChange={(type, checked) =>
            setConfig({
              ...config,
              reviewRequired: {
                ...config.reviewRequired,
                [type]: checked,
              },
            })
          }
        />
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Trace retention (days)"
            value={config.retentionDays}
            step={1}
            helper="Automatically archived after this period."
            onChange={(value) => setConfig({ ...config, retentionDays: value })}
          />
          <NumberField
            label="Active trace limit"
            value={config.activeTraceLimit}
            step={1}
            helper="Oldest traces are archived beyond this limit."
            onChange={(value) =>
              setConfig({ ...config, activeTraceLimit: value })
            }
          />
          <NumberField
            label="Minimum confidence threshold (retrieval)"
            value={config.minConfidence}
            step={0.1}
            onChange={(value) => setConfig({ ...config, minConfidence: value })}
          />
        </div>
        <Button
          disabled={saving}
          onClick={saveConfiguration}
          className="gap-2 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save configuration
        </Button>
      </div>

      <div className="mt-7 border-t border-[#ececef] pt-5">
        <h3 className="font-semibold">Maintenance history</h3>
        <p className="mt-2 text-xs text-[#8a8a93]">
          08/06/2026 11:55:28 · by manual · decay 0 · purge 19
        </p>
        <div className="mt-4">
          <Pagination
            page={1}
            totalPages={1}
            pageSize={10}
            onPageSizeChange={() => undefined}
            onPageChange={() => undefined}
          />
        </div>
      </div>
    </section>
  );
}
