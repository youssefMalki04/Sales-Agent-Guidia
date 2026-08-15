"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  SkillExecutionMode as ExecutionMode,
  SkillForm,
  SkillPack,
  SkillPackType,
  SkillSource,
} from "./skill-types";

const initialForm: SkillForm = {
  key: "",
  label: "",
  mission: "",
  activation: "",
  capabilities: "",
  packType: "custom",
  executionMode: "assist",
  focusAreasText: "",
};

const steps = [
  { title: "Identity", subtitle: "Key & label" },
  { title: "Description", subtitle: "Mission & behavior" },
  { title: "Behavior", subtitle: "Type & execution" },
  { title: "Focus", subtitle: "Business areas" },
  { title: "Validation", subtitle: "Summary" },
];

const platformSkills: SkillPack[] = [
  {
    id: "action-execution",
    key: "action-execution",
    label: "Action Execution",
    source: "platform",
    packType: "execution",
    executionMode: "guarded_act",
    languages: ["FR", "EN"],
    tags: ["native-actions", "automation", "confirmations"],
    focusAreas: ["native-actions", "automation", "confirmations"],
    accent: "red",
    translations: [
      {
        language: "EN",
        mission:
          "Govern the skill packs that let the agent move from recommendation to action: native actions, guarded automation, form filling, or active navigation.",
        activation:
          "Activate when the user explicitly requests an operation or when a permitted native tool can complete the requested action.",
        capabilities:
          "Choose the correct action, prepare parameters, explain the expected effect, request confirmation when needed, and report the final result.",
      },
      {
        language: "FR",
        mission:
          "Encadrer les compétences qui permettent à l’agent de passer de la recommandation à l’action : actions natives, automatisation contrôlée, formulaires ou navigation active.",
        activation:
          "Activer lorsque l’utilisateur demande explicitement une opération ou lorsqu’un outil natif autorisé peut exécuter l’action demandée.",
        capabilities:
          "Choisir la bonne action, préparer les paramètres, expliquer l’effet attendu, demander une confirmation si nécessaire et présenter le résultat.",
      },
    ],
  },
  {
    id: "human-handoff",
    key: "human-handoff",
    label: "Human Handoff",
    source: "platform",
    packType: "compliance",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["uncertainty", "sensitive-actions", "escalation"],
    focusAreas: ["uncertainty", "sensitive-actions", "escalation"],
    accent: "green",
    translations: [
      {
        language: "EN",
        mission:
          "Ensure the agent knows how to stop cleanly and transfer to a human when automation is no longer safe or sufficient.",
        activation:
          "Activate for sensitive requests, low confidence, repeated failure, explicit human requests, or policy limits.",
        capabilities:
          "Summarize context, preserve useful details, explain why escalation is needed, and hand off without inventing certainty.",
      },
      {
        language: "FR",
        mission:
          "S’assurer que l’agent sache s’arrêter proprement et transférer vers un humain lorsque l’automatisation n’est plus sûre ou suffisante.",
        activation:
          "Activer pour les demandes sensibles, une faible confiance, des échecs répétés, une demande humaine ou une limite de politique.",
        capabilities:
          "Résumer le contexte, préserver les informations utiles, expliquer pourquoi l’escalade est nécessaire et transférer sans inventer de certitude.",
      },
    ],
  },
  {
    id: "knowledge-rag",
    key: "knowledge-rag",
    label: "Knowledge RAG",
    source: "platform",
    packType: "knowledge",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["documents", "faq", "procedures", "product-truth"],
    focusAreas: ["documents", "faq", "procedures", "product-truth"],
    accent: "yellow",
    translations: [
      {
        language: "EN",
        mission:
          "Make the client and product corpus the agent’s primary source of truth and reduce hallucinations.",
        activation:
          "Activate when an answer depends on product documentation, internal procedures, FAQs, policies, or indexed content.",
        capabilities:
          "Retrieve relevant passages, prefer authoritative sources, distinguish facts from inference, and clearly signal missing evidence.",
      },
      {
        language: "FR",
        mission:
          "Faire du corpus client et produit la principale source de vérité de l’agent et réduire les hallucinations.",
        activation:
          "Activer lorsqu’une réponse dépend de la documentation produit, des procédures internes, des FAQ, des politiques ou du contenu indexé.",
        capabilities:
          "Récupérer les passages pertinents, préférer les sources fiables, distinguer les faits des déductions et signaler clairement les informations manquantes.",
      },
    ],
  },
  {
    id: "navigation-ui",
    key: "navigation-ui",
    label: "Navigation UI",
    source: "platform",
    packType: "training",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["pages", "selectors", "flows", "walkthroughs"],
    focusAreas: ["pages", "selectors", "flows", "walkthroughs"],
    accent: "cyan",
    translations: [
      {
        language: "EN",
        mission:
          "Specialize the agent in reading the interface and user journeys: pages, menus, components, selectors, and workflows.",
        activation:
          "Activate when the user needs guidance through screens, navigation, onboarding, or a multi-step interface flow.",
        capabilities:
          "Identify the correct page, explain the next interaction, preserve user context, and provide short step-by-step guidance.",
      },
      {
        language: "FR",
        mission:
          "Spécialiser l’agent dans la lecture de l’interface et des parcours utilisateur : pages, menus, composants, sélecteurs et workflows.",
        activation:
          "Activer lorsque l’utilisateur a besoin d’aide dans des écrans, la navigation, l’onboarding ou un parcours en plusieurs étapes.",
        capabilities:
          "Identifier la bonne page, expliquer la prochaine interaction, préserver le contexte utilisateur et fournir des étapes courtes.",
      },
    ],
  },
  {
    id: "sales-playbook",
    key: "sales-playbook",
    label: "Sales Playbook",
    source: "platform",
    packType: "domain",
    executionMode: "assist",
    languages: ["FR", "EN", "AR", "ES", "PT", "IT", "TR", "DE", "NL", "SV"],
    tags: ["discovery", "qualification", "offers", "conversion"],
    focusAreas: ["discovery", "qualification", "offers", "conversion"],
    accent: "neutral",
    translations: [
      {
        language: "EN",
        mission:
          "Turn the agent into an autonomous sales advisor for a hosted application: explain the product, qualify intent, and guide the next step.",
        activation:
          "Activate during commercial discovery, lead qualification, product comparison, objection handling, or conversion support.",
        capabilities:
          "Ask focused questions, identify need and urgency, explain value, handle objections, and recommend a concrete next action.",
      },
      {
        language: "FR",
        mission:
          "Transformer l’agent en conseiller commercial autonome : expliquer le produit, qualifier l’intention et guider la prochaine étape.",
        activation:
          "Activer pendant la découverte commerciale, la qualification, la comparaison, le traitement des objections ou l’aide à la conversion.",
        capabilities:
          "Poser des questions ciblées, identifier le besoin et l’urgence, expliquer la valeur, traiter les objections et proposer une prochaine action.",
      },
    ],
  },
  {
    id: "support-core",
    key: "support-core",
    label: "Support Core",
    source: "platform",
    packType: "domain",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["support", "troubleshooting", "customer-care"],
    focusAreas: ["support", "troubleshooting", "customer-care"],
    accent: "neutral",
    translations: [
      {
        language: "EN",
        mission:
          "Make product support a real agent discipline: understand the symptom quickly, frame the problem, and resolve it safely.",
        activation:
          "Activate when the user reports an error, a blocked workflow, an unexpected result, or a request for technical assistance.",
        capabilities:
          "Collect the relevant context, propose safe checks, avoid destructive steps, and escalate with a concise diagnostic summary.",
      },
      {
        language: "FR",
        mission:
          "Faire du support produit une vraie discipline d’agent : comprendre rapidement le symptôme, cadrer le problème et le résoudre en sécurité.",
        activation:
          "Activer lorsque l’utilisateur signale une erreur, un parcours bloqué, un résultat inattendu ou une demande d’assistance technique.",
        capabilities:
          "Collecter le contexte pertinent, proposer des vérifications sûres, éviter les étapes destructrices et escalader avec un diagnostic concis.",
      },
    ],
  },
];

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

function CreateSkillWizard({
  open,
  step,
  form,
  canContinue,
  onOpenChange,
  onFormChange,
  onBack,
  onNext,
  onCancel,
  onCreate,
}: {
  open: boolean;
  step: number;
  form: SkillForm;
  canContinue: boolean;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: SkillForm) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onCreate: () => void;
}) {
  const currentStep = steps[step - 1];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-[560px]">
        <SheetHeader className="border-b border-[#e4e4e8] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#62626c]">
                Assistant · Step {step}/5
              </p>
              <SheetTitle className="mt-2 text-xl">New skill pack</SheetTitle>
              <p className="mt-1 text-sm text-[#7b7b85]">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {steps.map((item, index) => {
              const itemStep = index + 1;
              const active = itemStep <= step;

              return (
                <div key={item.title}>
                  <div
                    className={cn(
                      "h-1 rounded-full",
                      active ? "bg-[#5964d6]" : "bg-[#ececef]",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-center text-[10px] font-semibold",
                      itemStep === step ? "text-[#24242a]" : "text-[#8e8e97]",
                    )}
                  >
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 ? (
            <IdentityStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 2 ? (
            <DescriptionStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 3 ? (
            <BehaviorStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 4 ? (
            <FocusStep form={form} onChange={onFormChange} />
          ) : null}
          {step === 5 ? <ValidationStep form={form} /> : null}
        </div>

        <SheetFooter className="border-t border-[#e4e4e8] bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <div className="flex gap-2">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : null}

            {step < 5 ? (
              <Button
                type="button"
                disabled={!canContinue}
                onClick={onNext}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!form.label.trim()}
                onClick={onCreate}
                className="rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
              >
                <Check className="size-4" />
                Create skill pack
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function IdentityStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Technical key (optional)">
        <Input
          value={form.key}
          onChange={(event) => onChange({ ...form, key: event.target.value })}
          placeholder="e.g. vertical-billing-ops"
          className="h-11 font-mono"
        />
        <p className="mt-2 text-xs leading-5 text-[#85858f]">
          Leave empty for auto-generation. Stable slug used by agent profiles
          and the API.
        </p>
      </Field>

      <Field label="Label *">
        <Input
          value={form.label}
          onChange={(event) => onChange({ ...form, label: event.target.value })}
          placeholder="Display name shown in the studio"
          className="h-11"
        />
      </Field>
    </div>
  );
}

function DescriptionStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="1. Mission and value *">
        <Textarea
          value={form.mission}
          onChange={(event) =>
            onChange({ ...form, mission: event.target.value })
          }
          placeholder="Explain the main purpose and value of this skill pack."
          className="min-h-32"
        />
      </Field>

      <Field label="2. When to activate this skill">
        <Textarea
          value={form.activation}
          onChange={(event) =>
            onChange({ ...form, activation: event.target.value })
          }
          placeholder="Describe the situations where the agent should activate this skill."
          className="min-h-32"
        />
      </Field>

      <Field label="3. Expected capabilities">
        <Textarea
          value={form.capabilities}
          onChange={(event) =>
            onChange({ ...form, capabilities: event.target.value })
          }
          placeholder="List the concrete behaviors and capabilities expected from the agent."
          className="min-h-32"
        />
      </Field>
    </div>
  );
}

function BehaviorStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  const types: Array<{
    value: SkillPackType;
    label: string;
    description: string;
  }> = [
    { value: "domain", label: "domain", description: "Business vertical" },
    {
      value: "knowledge",
      label: "knowledge",
      description: "RAG and documents",
    },
    {
      value: "execution",
      label: "execution",
      description: "Actions and tools",
    },
    { value: "compliance", label: "compliance", description: "Guardrails" },
    { value: "training", label: "training", description: "UI and adoption" },
    { value: "custom", label: "custom", description: "Client-specific" },
  ];

  const modes: Array<{
    value: ExecutionMode;
    label: string;
    description: string;
  }> = [
    {
      value: "assist",
      label: "assist",
      description: "Advise without implicit destructive effect",
    },
    {
      value: "act",
      label: "act",
      description: "Direct actions when policy and tools allow it",
    },
    {
      value: "guarded_act",
      label: "guarded_act",
      description: "Actions under explicit user confirmation",
    },
  ];

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
          Pack type
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {types.map((item) => (
            <ChoiceCard
              key={item.value}
              active={form.packType === item.value}
              label={item.label}
              description={item.description}
              onClick={() => onChange({ ...form, packType: item.value })}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#777780]">
          Execution mode
        </p>
        <div className="mt-3 space-y-3">
          {modes.map((item) => (
            <ChoiceCard
              key={item.value}
              active={form.executionMode === item.value}
              label={item.label}
              description={item.description}
              onClick={() => onChange({ ...form, executionMode: item.value })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function FocusStep({
  form,
  onChange,
}: {
  form: SkillForm;
  onChange: (form: SkillForm) => void;
}) {
  const tags = form.focusAreasText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <Field label="Focus areas">
        <Input
          value={form.focusAreasText}
          onChange={(event) =>
            onChange({ ...form, focusAreasText: event.target.value })
          }
          placeholder="billing, onboarding, public-api..."
          className="h-11 font-mono"
        />
        <p className="mt-2 text-xs text-[#85858f]">
          Comma-separated. Used for semantic routing and prompts.
        </p>
      </Field>

      <div>
        <p className="text-sm font-semibold text-[#34343b]">Preview</p>
        <div className="mt-2 min-h-14 rounded-md bg-[#f4f4f5] p-3">
          {tags.length === 0 ? (
            <p className="text-sm text-[#909099]">No focus areas yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ValidationStep({ form }: { form: SkillForm }) {
  const tags = form.focusAreasText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <SummaryRow label="Label" value={form.label || "-"} />
      <SummaryRow
        label="Key"
        value={
          form.key ||
          form.label
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") ||
          "-"
        }
      />
      <SummaryRow label="Pack type" value={form.packType} />
      <SummaryRow label="Execution mode" value={form.executionMode} />

      <div>
        <p className="text-sm font-semibold text-[#34343b]">Translations</p>
        <div className="mt-2 space-y-3">
          <TranslationSummary language="FR" form={form} />
          <TranslationSummary language="EN" form={form} />
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e1e5] bg-[#f6f6f7] p-4">
        <p className="text-sm font-semibold text-[#34343b]">Focus areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-white">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-[#8a8a93]">None</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TranslationSummary({
  language,
  form,
}: {
  language: string;
  form: SkillForm;
}) {
  return (
    <div className="rounded-lg border border-[#e1e1e5] bg-white p-4">
      <p className="text-sm font-semibold">{language}</p>
      <p className="mt-3 text-sm leading-6 text-[#5f5f68]">
        {form.mission || "Missing translation"}
      </p>
      {form.activation ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.activation}
        </p>
      ) : null}
      {form.capabilities ? (
        <p className="mt-2 text-sm leading-6 text-[#5f5f68]">
          {form.capabilities}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceCard({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition",
        active
          ? "border-[#939ae2] bg-[#f5f6ff] text-[#5964d6] shadow-[inset_0_0_0_1px_#939ae2]"
          : "border-[#dfdfe3] bg-white hover:bg-[#f8f8f9]",
      )}
    >
      <p className="font-mono text-sm font-semibold text-[#28282e]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[#777780]">{description}</p>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#34343b]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ececef] py-3 text-sm">
      <span className="text-[#7b7b85]">{label}</span>
      <span className="text-right font-mono font-semibold text-[#303038]">
        {value}
      </span>
    </div>
  );
}
