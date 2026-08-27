"use client";

import { X } from "lucide-react";
import { Button, Input, Label, Select, Textarea } from "./branding-controls";
import type { Settings } from "./branding-data";
import { cx } from "./branding-data";

export function FeaturesTab({
  settings,
  update,
  signatureInput,
  setSignatureInput,
  forbiddenInput,
  setForbiddenInput,
  addPhrase,
}: {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  signatureInput: string;
  setSignatureInput: (v: string) => void;
  forbiddenInput: string;
  setForbiddenInput: (v: string) => void;
  addPhrase: (k: "signature" | "forbidden") => void;
}) {
  return (
    <div className="space-y-5 bg-[#fafafd] p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <Label>Deployment mode</Label>
        <div className="max-w-xl">
          <Select
            value={settings.deployment}
            onChange={(v) => update("deployment", v as Settings["deployment"])}
          >
            <option value="embedded">
              Embedded in app (support + autonomy)
            </option>
            <option value="marketing">
              Marketing website (lead-gen + external demos)
            </option>
          </Select>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Arrival behavior</h2>
        <p className="mt-1 text-sm text-zinc-500">
          How the widget presents itself to the visitor the FIRST time they land
          on the site.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <Label>Default display</Label>
            <Select
              value={settings.display}
              onChange={(v) => update("display", v as Settings["display"])}
            >
              <option value="closed">Closed bubble (click to open)</option>
              <option value="open">Side panel - open immediately</option>
            </Select>
          </div>
          <div>
            <Label>Conversation start</Label>
            <Select
              value={settings.conversationStart}
              onChange={(v) =>
                update("conversationStart", v as Settings["conversationStart"])
              }
            >
              <option value="visitor">
                Visitor clicks to start (recommended for B2B)
              </option>
              <option value="arrival">
                Agent speaks on arrival (showcase / lead-gen)
              </option>
            </Select>
          </div>
          <div>
            <Label>Agent starting language</Label>
            <Select
              value={settings.language}
              onChange={(v) => update("language", v)}
            >
              {[
                "English",
                "Français",
                "Español",
                "Deutsch",
                "Italiano",
                "Português",
                "Nederlands",
                "Svenska",
                "Türkçe",
                "العربية",
              ].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <Label>Agent personality</Label>
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <Label>Tone</Label>
            <Select value={settings.tone} onChange={(v) => update("tone", v)}>
              <option value="default">Default (warm, natural)</option>
              <option value="warm">
                Warm: Natural, like a helpful colleague
              </option>
              <option value="casual">
                Casual: Informal, everyday language
              </option>
              <option value="professional">
                Professional: Formal, measured
              </option>
              <option value="energetic">
                Energetic: Engaged, shows interest
              </option>
              <option value="attentive">
                Attentive: Recognizes emotions, unblocks
              </option>
            </Select>
          </div>
          <div>
            <Label>Humor</Label>
            <Select value={settings.humor} onChange={(v) => update("humor", v)}>
              <option value="light">Default (light)</option>
              <option value="0">0: None</option>
              <option value="1">1: Light</option>
              <option value="2">2: Bold</option>
              <option value="3">3: Playful</option>
            </Select>
          </div>
          <div>
            <Label>Address form</Label>
            <Select
              value={settings.address}
              onChange={(v) => update("address", v)}
            >
              <option value="automatic">Default (automatic)</option>
              <option value="follow">Automatic (follows the user)</option>
              <option value="tu">Always informal (tu)</option>
              <option value="vous">Always formal (vous)</option>
            </Select>
          </div>
        </div>
        <div className="mt-5">
          <Label>Free persona description</Label>
          <Textarea
            rows={4}
            maxLength={500}
            value={settings.personaDescription}
            onChange={(e) => update("personaDescription", e.target.value)}
            placeholder="E.g. You're Léa, a sales advisor at Acme..."
          />
          <p className="mt-1 text-xs text-zinc-400">
            {settings.personaDescription.length} / 500 characters
          </p>
        </div>
        <Phrase
          label="Signature phrases (used naturally)"
          value={signatureInput}
          setValue={setSignatureInput}
          add={() => addPhrase("signature")}
          phrases={settings.signaturePhrases}
          remove={(i) =>
            update(
              "signaturePhrases",
              settings.signaturePhrases.filter((_, x) => x !== i),
            )
          }
        />
        <Phrase
          label="Forbidden phrases (never said, even rephrased)"
          value={forbiddenInput}
          setValue={setForbiddenInput}
          add={() => addPhrase("forbidden")}
          phrases={settings.forbiddenPhrases}
          remove={(i) =>
            update(
              "forbiddenPhrases",
              settings.forbiddenPhrases.filter((_, x) => x !== i),
            )
          }
          red
        />
      </section>
    </div>
  );
}

function Phrase({
  label,
  value,
  setValue,
  add,
  phrases,
  remove,
  red = false,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  add: () => void;
  phrases: string[];
  remove: (i: number) => void;
  red?: boolean;
}) {
  return (
    <div className="mt-5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={
            red
              ? 'E.g. "As an AI assistant..."'
              : 'E.g. "Got it, I’ll note that for you"'
          }
        />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {phrases.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className={cx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
              red ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700",
            )}
          >
            {p}
            <button onClick={() => remove(i)}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
