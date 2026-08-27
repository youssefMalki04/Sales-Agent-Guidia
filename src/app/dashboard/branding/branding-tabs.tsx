"use client";

/* eslint-disable @next/next/no-img-element -- Optional preview assets may hide on error. */

import { Star, Upload, X } from "lucide-react";

import { Input, Label, Select, Textarea } from "./branding-controls";
import type { Persona, Position, Settings, Shape } from "./branding-data";
import { cx, iconOptions, voices } from "./branding-data";

export function BrandTab({
  settings,
  update,
  open,
  setOpen,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const SelectedIcon =
    iconOptions.find(([id]) => id === settings.icon)?.[1] ?? Star;
  const positionClass = (
    {
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
      "right-rail": "right-0 top-1/2 -translate-y-1/2",
      "left-rail": "left-0 top-1/2 -translate-y-1/2",
    } as const
  )[settings.position];
  const rail = settings.position.includes("rail");
  return (
    <div className="grid min-h-[700px] lg:grid-cols-[1fr_1.03fr]">
      <div className="space-y-5 border-b border-zinc-200 p-6 lg:border-b-0 lg:border-r">
        <div>
          <Label>Widget title</Label>
          <Input
            value={settings.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Avatar persona</Label>
            <Select
              value={settings.persona}
              onChange={(v) => update("persona", v as Persona)}
            >
              <option value="female">Female (default)</option>
              <option value="male">Male</option>
              <option value="none">No avatar (audio animation)</option>
            </Select>
          </div>
          <div>
            <Label>Avatar voice</Label>
            <Select value={settings.voice} onChange={(v) => update("voice", v)}>
              {voices.map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label>Welcome message</Label>
          <Textarea
            rows={4}
            value={settings.welcome}
            onChange={(e) => update("welcome", e.target.value)}
          />
        </div>
        <div>
          <Label>Primary color</Label>
          <div className="flex gap-3">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => update("color", e.target.value)}
              className="h-11 w-14 rounded-md border border-zinc-200 p-1"
            />
            <Input
              value={settings.color}
              onChange={(e) => update("color", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Position</Label>
          <Select
            value={settings.position}
            onChange={(v) => update("position", v as Position)}
          >
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
            <option value="right-rail">Right rail</option>
            <option value="left-rail">Left rail</option>
          </Select>
        </div>
        <div>
          <Label>Panel shape</Label>
          <Select
            value={settings.shape}
            onChange={(v) => update("shape", v as Shape)}
          >
            <option value="rounded">Rounded corners</option>
            <option value="square">Square corners (classic)</option>
          </Select>
        </div>
        <div>
          <Label>Bubble icon</Label>
          <div className="grid grid-cols-7 gap-2">
            {iconOptions.map(([id, Icon]) => (
              <button
                type="button"
                key={id}
                onClick={() => update("icon", id)}
                className={cx(
                  "flex aspect-square items-center justify-center rounded-xl border transition",
                  settings.icon === id
                    ? "border-[#939ae2] bg-[#f1f2ff] text-[#5964d6] ring-1 ring-[#939ae2]"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative min-h-[700px] overflow-hidden bg-gradient-to-b from-[#f8faff] to-[#eef2ff]">
        <div className={cx("absolute z-10", positionClass)}>
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              style={{ borderColor: settings.color, color: settings.color }}
              className={cx(
                "flex items-center gap-3 border-2 bg-white px-5 py-4 text-sm font-semibold shadow-lg",
                rail
                  ? settings.position === "right-rail"
                    ? "rounded-l-2xl border-r-0"
                    : "rounded-r-2xl border-l-0"
                  : "rounded-full",
              )}
            >
              <SelectedIcon className="size-5" />
              {rail ? null : settings.title}
            </button>
          ) : (
            <div
              style={{ borderColor: settings.color }}
              className={cx(
                "w-[calc(100vw-48px)] max-w-[360px] overflow-hidden border bg-white shadow-2xl",
                settings.shape === "rounded" ? "rounded-2xl" : "rounded-none",
              )}
            >
              <div className="flex h-14 items-center justify-between border-b px-4">
                <div
                  style={{ color: settings.color }}
                  className="flex items-center gap-2 font-semibold"
                >
                  <SelectedIcon className="size-4" />
                  {settings.title}
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative flex h-[450px] items-center justify-center overflow-hidden bg-[#030617]">
                {settings.persona === "none" ? (
                  <div className="px-8 text-center">
                    <div
                      style={{ backgroundColor: settings.color }}
                      className="mx-auto flex size-20 items-center justify-center rounded-full text-white"
                    >
                      <SelectedIcon className="size-9" />
                    </div>
                    <p className="mt-6 text-lg font-semibold text-white">
                      {settings.welcome}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* A native image preserves the preview's graceful missing-asset fallback. */}
                    <img
                      src={
                        settings.persona === "male"
                          ? "/avatar-male.png"
                          : "/avatar-female.png"
                      }
                      alt="Avatar"
                      className="absolute inset-0 size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    <span className="absolute bottom-6 rounded-full bg-zinc-950/85 px-4 py-2 text-xs text-white">
                      {settings.welcome}
                    </span>
                  </>
                )}
              </div>
              <div className="flex h-12 items-center gap-2 border-t px-4 text-xs text-zinc-500">
                <Upload className="size-4" />
                Attach a document or image to send in the chat.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { EmbedTab } from "./branding-embed-tab";
export { FeaturesTab } from "./branding-features-tab";
export { MediaTab } from "./branding-media-tab";
