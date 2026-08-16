"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Sparkles, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SkillForm, SkillPack, SkillSource } from "./skill-types";

import { initialForm, platformSkills } from "./skill-data";
import { CreateSkillWizard } from "./skill-wizard";
export function SkillsView() {
  const [filter, setFilter] = useState<"all" | SkillSource>("all");
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState<SkillPack[]>(platformSkills);
  const [selectedSkill, setSelectedSkill] = useState<SkillPack | null>(null);
  const [detailLanguage, setDetailLanguage] = useState("EN");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState<SkillForm>(initialForm);

  const filteredSkills = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSource = filter === "all" || skill.source === filter;
      const matchesQuery =
        !normalizedQuery ||
        skill.label.toLowerCase().includes(normalizedQuery) ||
        skill.key.toLowerCase().includes(normalizedQuery) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesSource && matchesQuery;
    });
  }, [filter, query, skills]);

  const platformCount = skills.filter(
    (skill) => skill.source === "platform",
  ).length;
  const customCount = skills.filter(
    (skill) => skill.source === "custom",
  ).length;

  function openDetails(skill: SkillPack) {
    setSelectedSkill(skill);
    setDetailLanguage(
      skill.languages.includes("EN") ? "EN" : skill.languages[0],
    );
  }

  function openWizard() {
    setForm(initialForm);
    setWizardStep(1);
    setWizardOpen(true);
  }

  function closeWizard() {
    setWizardOpen(false);
    setWizardStep(1);
    setForm(initialForm);
  }

  function createSkill() {
    const focusAreas = form.focusAreasText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const skill: SkillPack = {
      id: `custom-${Date.now()}`,
      key:
        form.key.trim() ||
        form.label
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      label: form.label.trim(),
      source: "custom",
      packType: form.packType,
      executionMode: form.executionMode,
      languages: ["FR", "EN"],
      tags: focusAreas.slice(0, 4),
      focusAreas,
      accent: "violet",
      translations: [
        {
          language: "FR",
          mission: form.mission.trim(),
          activation: form.activation.trim(),
          capabilities: form.capabilities.trim(),
        },
        {
          language: "EN",
          mission: form.mission.trim(),
          activation: form.activation.trim(),
          capabilities: form.capabilities.trim(),
        },
      ],
    };

    setSkills((current) => [current[0], skill, ...current.slice(1)]);
    closeWizard();
  }

  function deleteSkill(id: string) {
    setSkills((current) => current.filter((skill) => skill.id !== id));
  }

  const canContinue =
    wizardStep === 1
      ? form.label.trim().length > 1
      : wizardStep === 2
        ? form.mission.trim().length > 10
        : true;

  return (
    <>
      <section className="soft-panel-enter mt-6 overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
              <Sparkles className="size-3.5" /> Agent capabilities
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Skill library
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Combine reusable knowledge, behavior and execution packs for every
              agent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <SkillMetric value={platformCount} label="Platform" />
            <SkillMetric value={customCount} label="Custom" />
          </div>
        </div>
      </section>

      <section className="soft-panel-enter mt-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
        <SkillsToolbar
          platformCount={platformCount}
          customCount={customCount}
          query={query}
          filter={filter}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
          onCreate={openWizard}
        />

        {filteredSkills.length === 0 ? (
          <div className="mt-5 flex min-h-52 items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd] text-sm font-medium text-slate-500">
            No skill pack matches your search.
          </div>
        ) : (
          <div className="soft-stagger mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onDetails={() => openDetails(skill)}
                onDelete={() => deleteSkill(skill.id)}
              />
            ))}
          </div>
        )}
      </section>

      <SkillDetailsDialog
        skill={selectedSkill}
        language={detailLanguage}
        onLanguageChange={setDetailLanguage}
        onClose={() => setSelectedSkill(null)}
      />

      <CreateSkillWizard
        open={wizardOpen}
        step={wizardStep}
        form={form}
        canContinue={canContinue}
        onOpenChange={(open) => {
          if (!open) closeWizard();
        }}
        onFormChange={setForm}
        onBack={() => setWizardStep((current) => Math.max(1, current - 1))}
        onNext={() => setWizardStep((current) => Math.min(5, current + 1))}
        onCancel={closeWizard}
        onCreate={createSkill}
      />
    </>
  );
}

function SkillMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
      <p className="text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function SkillsToolbar({
  platformCount,
  customCount,
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onCreate,
}: {
  platformCount: number;
  customCount: number;
  query: string;
  filter: "all" | SkillSource;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: "all" | SkillSource) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#fafafd] px-4 py-4 ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-[#303038]">Skills</span>
          <span className="text-[#6f6f78]">◈ Platform {platformCount}</span>
          <span className="text-[#6f6f78]">•</span>
          <span className="text-[#6f6f78]">⬡ Custom {customCount}</span>
        </div>

        <div className="relative w-full lg:w-[230px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter..."
            className="h-10 rounded-xl border-slate-200 bg-white pl-9"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["all", "platform", "custom"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={cn(
                "h-9 rounded-xl px-3 text-xs font-semibold capitalize transition-all",
                filter === value
                  ? "border border-[#cfd3ed] bg-white text-[#5964d6] shadow-sm"
                  : "text-slate-500 hover:bg-white",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={onCreate}
        className="h-10 gap-2 rounded-xl bg-[#5964d6] px-4 text-white shadow-[0_9px_22px_rgba(89,100,214,.18)] hover:bg-[#4f5acb]"
      >
        <Plus className="size-4" />
        Create
      </Button>
    </div>
  );
}

function SkillCard({
  skill,
  onDetails,
  onDelete,
}: {
  skill: SkillPack;
  onDetails: () => void;
  onDelete: () => void;
}) {
  const accent = {
    red: {
      shell: "border-rose-200 bg-rose-50/50",
      badge: "bg-rose-600 text-white",
      soft: "border-rose-200 bg-rose-50 text-rose-800",
    },
    green: {
      shell: "border-emerald-200 bg-emerald-50/50",
      badge: "bg-emerald-600 text-white",
      soft: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    yellow: {
      shell: "border-amber-200 bg-amber-50/50",
      badge: "bg-amber-600 text-white",
      soft: "border-amber-200 bg-amber-50 text-amber-800",
    },
    cyan: {
      shell: "border-cyan-200 bg-cyan-50/50",
      badge: "bg-cyan-600 text-white",
      soft: "border-cyan-200 bg-cyan-50 text-cyan-800",
    },
    neutral: {
      shell: "border-[#e1e1e5] bg-[#fafafa]",
      badge: "bg-[#ececef] text-[#44444c]",
      soft: "border-[#dedee3] bg-white text-[#55555e]",
    },
    violet: {
      shell: "border-[#cfd3ed] bg-[#f5f6ff]",
      badge: "bg-[#5964d6] text-white",
      soft: "border-[#cfd3ed] bg-[#f1f2ff] text-[#5964d6]",
    },
  }[skill.accent];

  const translation =
    skill.translations.find((item) => item.language === "EN") ??
    skill.translations[0];

  return (
    <article
      className={cn(
        "soft-lift flex min-h-[292px] flex-col rounded-3xl border p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        accent.shell,
      )}
    >
      <div className="flex flex-1 flex-col rounded-2xl border border-white/80 bg-white/90 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-base font-semibold text-[#222228]">
            {skill.label}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
              accent.badge,
            )}
          >
            {skill.source}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={cn("uppercase", accent.soft)}>
            {skill.packType}
          </Badge>
          <Badge variant="outline" className={cn("uppercase", accent.soft)}>
            {skill.executionMode}
          </Badge>
          {skill.languages.slice(0, 3).map((language) => (
            <Badge key={language} variant="outline" className="bg-white">
              {language}
            </Badge>
          ))}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#4f4f58]">
          <span className="font-semibold">1. Mission and value </span>
          {translation.mission}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {skill.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={cn(
                "truncate rounded-md border px-3 py-2 text-xs font-semibold",
                accent.soft,
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant={skill.source === "custom" ? "default" : "outline"}
          onClick={onDetails}
          className={cn(
            "h-9 flex-1",
            skill.source === "custom"
              ? "rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              : "rounded-xl border-slate-200 bg-white text-[#5964d6] hover:bg-[#f5f6ff]",
          )}
        >
          {skill.source === "custom" ? "Edit" : "Details"}
        </Button>

        {skill.source === "custom" ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${skill.label}`}
            className="h-9 w-10 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function SkillDetailsDialog({
  skill,
  language,
  onLanguageChange,
  onClose,
}: {
  skill: SkillPack | null;
  language: string;
  onLanguageChange: (language: string) => void;
  onClose: () => void;
}) {
  if (!skill) return null;

  const translation =
    skill.translations.find((item) => item.language === language) ??
    skill.translations[0];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[78vh] max-w-[540px] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-[#ececef] bg-white px-6 py-5">
          <DialogTitle className="pr-8 text-xl">{skill.label}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {skill.languages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onLanguageChange(item)}
                className={cn(
                  "h-8 rounded-md border px-3 text-xs font-semibold",
                  language === item
                    ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6]"
                    : "border-[#dedee3] bg-white text-[#777780]",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <DetailBlock title="1. Mission and value">
            {translation.mission}
          </DetailBlock>
          <DetailBlock title="2. When to activate this skill">
            {translation.activation}
          </DetailBlock>
          <DetailBlock title="3. Expected capabilities">
            {translation.capabilities}
          </DetailBlock>

          <div className="rounded-lg border border-[#e3e3e7] bg-[#f8f8f9] p-4">
            <p className="text-sm font-semibold text-[#303038]">Focus areas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skill.focusAreas.map((item) => (
                <Badge key={item} variant="outline" className="bg-white">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailBlock({ title, children }: { title: string; children: string }) {
  return (
    <section className="rounded-lg border border-[#dedee3] bg-[#f6f6f7] p-4">
      <h3 className="text-sm font-semibold text-[#29292f]">{title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#55555f]">
        {children || "No content provided."}
      </p>
    </section>
  );
}
