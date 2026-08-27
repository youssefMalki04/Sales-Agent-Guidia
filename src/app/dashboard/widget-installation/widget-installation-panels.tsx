import { Check, CheckCircle2, Clipboard, Code2 } from "lucide-react";

import { steps } from "./widget-data";
import { WidgetPreview } from "./widget-preview";
import type { Device, Position } from "./widget-types";
import { Field } from "./widget-ui";

type WidgetConfiguratorProps = {
  name: string;
  welcome: string;
  color: string;
  position: Position;
  device: Device;
  onNameChange: (value: string) => void;
  onWelcomeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onPositionChange: (value: Position) => void;
  onDeviceChange: (value: Device) => void;
};

export function WidgetConfigurator({
  name,
  welcome,
  color,
  position,
  device,
  onNameChange,
  onWelcomeChange,
  onColorChange,
  onPositionChange,
  onDeviceChange,
}: WidgetConfiguratorProps) {
  return (
    <section className="soft-panel-enter grid overflow-hidden rounded-3xl border border-[#e1e4f8] bg-white shadow-[0_16px_50px_rgba(89,100,214,0.08)] lg:grid-cols-[420px_1fr]">
      <div className="space-y-5 border-b border-[#e1e4f8] p-6 lg:border-b-0 lg:border-r">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-slate-500">
            These settings update the preview instantly.
          </p>
        </div>

        <Field label="Assistant name">
          <input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
          />
        </Field>
        <Field label="Welcome message">
          <textarea
            value={welcome}
            onChange={(event) => onWelcomeChange(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-sm outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
          />
        </Field>
        <Field label="Brand color">
          <div className="flex gap-3">
            <input
              aria-label="Brand color picker"
              type="color"
              value={color}
              onChange={(event) => onColorChange(event.target.value)}
              className="h-11 w-14 rounded-xl border border-slate-200 bg-white p-1"
            />
            <input
              value={color}
              onChange={(event) => onColorChange(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 font-mono text-sm uppercase outline-none transition focus:border-[#5964d6] focus:bg-white focus:ring-4 focus:ring-[#5964d6]/10"
            />
          </div>
        </Field>
        <Field label="Widget position">
          <div className="grid grid-cols-2 gap-2">
            {(["bottom-left", "bottom-right"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onPositionChange(value)}
                className={`h-11 rounded-xl border text-sm font-semibold transition ${
                  position === value
                    ? "border-[#5964d6] bg-[#5964d6] text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-500 hover:border-[#d9ddfa] hover:bg-[#f1f2ff] hover:text-[#5964d6]"
                }`}
              >
                {value === "bottom-left" ? "Bottom left" : "Bottom right"}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <WidgetPreview
        name={name}
        welcome={welcome}
        color={color}
        position={position}
        device={device}
        onDeviceChange={onDeviceChange}
      />
    </section>
  );
}

type WidgetInstallationPanelsProps = {
  snippet: string;
  copied: boolean;
  verified: boolean;
  onCopy: () => void;
  onVerify: () => void;
};

export function WidgetInstallationPanels({
  snippet,
  copied,
  verified,
  onCopy,
  onVerify,
}: WidgetInstallationPanelsProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <div className="soft-lift rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_12px_35px_rgba(89,100,214,0.07)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Code2 className="size-5" /> Installation code
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Paste this code once, just before the closing body tag.
            </p>
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f5acb]"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Clipboard className="size-4" />
            )}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-indigo-100 shadow-inner">
          <code>{snippet}</code>
        </pre>
      </div>

      <div className="soft-lift rounded-3xl border border-[#e1e4f8] bg-white p-6 shadow-[0_12px_35px_rgba(89,100,214,0.07)]">
        <h2 className="text-lg font-semibold">Setup checklist</h2>
        <div className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f1f2ff] text-xs font-bold text-[#5964d6]">
                {index + 1}
              </span>
              <span className="pt-0.5 text-slate-600">{step}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onVerify}
          className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${verified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#e1e4f8] text-[#5964d6] hover:bg-[#f1f2ff]"}`}
        >
          <CheckCircle2
            className={`size-4 ${verified ? "text-emerald-600" : ""}`}
          />
          {verified ? "Widget detected" : "Verify installation"}
        </button>
        {verified ? (
          <p className="mt-3 text-center text-xs font-medium text-emerald-700">
            Frontend demo verification completed.
          </p>
        ) : null}
      </div>
    </section>
  );
}
