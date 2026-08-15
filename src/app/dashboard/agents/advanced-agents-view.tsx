"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Boxes,
  CalendarClock,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  FileText,
  Headphones,
  LayoutGrid,
  MessageSquareText,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCcw,
  Rocket,
  Settings,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  agentSkills as skills,
  salesAgentForm as salesForm,
  supportAgentForm as supportForm,
} from "./agent-presets";
import { AgentWizard } from "./agent-wizard";
import { AgentPlayground } from "./agent-playground";
import type {
  AgentBlueprintTab as BlueprintTab,
  AgentDetailTab as DetailTab,
  AgentForm,
  AgentProfile,
  AgentTemplate as Template,
} from "./agent-types";
import { useAgentProfiles } from "./use-agent-profiles";

export function AdvancedAgentsView() {
  const { profiles, setProfiles, resetProfiles } = useAgentProfiles();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [blueprintTab, setBlueprintTab] = useState<BlueprintTab>("context");
  const [form, setForm] = useState<AgentForm>(supportForm);
  const [selected, setSelected] = useState<AgentProfile | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [quickView, setQuickView] = useState<AgentProfile | null>(null);
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testProfile, setTestProfile] = useState<AgentProfile | null>(null);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function openWizard(template: Template = "support") {
    setForm(template === "support" ? supportForm : salesForm);
    setStep(1);
    setBlueprintTab("context");
    setEditingId(null);
    setWizardOpen(true);
  }

  function createAgent() {
    const now = new Date().toLocaleString("fr-FR");
    if (editingId) {
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === editingId
            ? { ...profile, ...form, updatedAt: now }
            : profile,
        ),
      );
      showNotice(`Profile “${form.name}” updated.`);
      setEditingId(null);
      setWizardOpen(false);
      return;
    }
    const profile: AgentProfile = {
      ...form,
      id: crypto.randomUUID(),
      status: "draft",
      integrationStatus: "not_configured",
      isDefault: profiles.length === 0,
      createdAt: now,
      updatedAt: now,
    };
    setProfiles((current) => [...current, profile]);
    showNotice(`Profile “${profile.name}” created.`);
    setWizardOpen(false);
  }

  if (selected) {
    return (
      <ProfileDetails
        profile={selected}
        tab={detailTab}
        onTabChange={setDetailTab}
        onBack={() => {
          setSelected(null);
          setDetailTab("overview");
        }}
      />
    );
  }

  return (
    <>
      <section className="soft-panel-enter mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f5f6ff] via-white to-[#f1f2ff]/70 px-6 py-7 sm:px-8">
          <div className="absolute -right-10 -top-16 size-52 rounded-full bg-[#dfe2ff]/40 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#626cd1]">
                <Sparkles className="size-3.5" /> Your AI team
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Sales agents
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create specialized agents, then test and publish them when they
                are ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profiles.length > 0 && (
                <Button
                  variant="outline"
                  className="rounded-xl border-white bg-white/80 text-slate-600 shadow-sm hover:bg-white"
                  onClick={() => {
                    if (window.confirm("Reset all frontend demo agents?")) {
                      resetProfiles();
                      showNotice("Demo agents reset.");
                    }
                  }}
                >
                  <RefreshCcw className="size-4" /> Reset demo
                </Button>
              )}
              <Button
                onClick={() => openWizard()}
                className="rounded-xl bg-[#5964d6] px-5 text-white shadow-[0_9px_22px_rgba(89,100,214,.22)] hover:bg-[#4f5acb]"
              >
                <Plus className="size-4" /> Create agent
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">
              Your agents
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Manage their status, setup and website integration.
            </p>
          </div>
          {profiles.length > 0 && (
            <Badge
              variant="outline"
              className="rounded-full border-[#e1e4f8] bg-[#f1f2ff] px-3 text-[#626cd1]"
            >
              {profiles.length} {profiles.length === 1 ? "agent" : "agents"}
            </Badge>
          )}
        </div>

        {profiles.length === 0 ? (
          <div className="mt-4 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-[#dfe2eb] bg-[#fafafd] px-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-[#5964d6] shadow-sm">
              <Users className="size-6" />
            </span>
            <p className="mt-4 font-semibold text-slate-900">
              Create your first sales agent
            </p>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Choose a template, add your business context and test the
              conversation before publishing.
            </p>
            <Button
              onClick={() => openWizard()}
              className="mt-5 rounded-xl bg-[#5964d6] text-white hover:bg-[#4f5acb]"
            >
              <Plus className="size-4" /> Create agent
            </Button>
          </div>
        ) : (
          <div className="soft-stagger mt-5 grid gap-5 lg:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={() => setSelected(profile)}
                onQuickView={() => setQuickView(profile)}
                onEdit={() => {
                  setForm(profile);
                  setEditingId(profile.id);
                  setStep(2);
                  setWizardOpen(true);
                }}
                onClone={() => {
                  const now = new Date().toLocaleString("fr-FR");
                  setProfiles((current) => [
                    ...current,
                    {
                      ...profile,
                      id: crypto.randomUUID(),
                      name: `${profile.name} copy`,
                      status: "draft",
                      integrationStatus: "not_configured",
                      isDefault: false,
                      createdAt: now,
                      updatedAt: now,
                    },
                  ]);
                }}
                onDefault={() =>
                  setProfiles((current) =>
                    current.map((item) => ({
                      ...item,
                      isDefault: item.id === profile.id,
                    })),
                  )
                }
                onDelete={() => {
                  if (window.confirm(`Delete “${profile.name}”?`)) {
                    setProfiles((current) =>
                      current.filter((item) => item.id !== profile.id),
                    );
                    showNotice(`Profile “${profile.name}” deleted.`);
                  }
                }}
                onStatusChange={() => {
                  const status =
                    profile.status === "published" ? "paused" : "published";
                  setProfiles((current) =>
                    current.map((item) =>
                      item.id === profile.id
                        ? {
                            ...item,
                            status,
                            updatedAt: new Date().toLocaleString("fr-FR"),
                          }
                        : item,
                    ),
                  );
                  showNotice(`Profile “${profile.name}” ${status}.`);
                }}
                onTest={() => setTestProfile(profile)}
              />
            ))}
          </div>
        )}

        {notice && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {notice}
          </div>
        )}
      </section>

      <AgentWizard
        open={wizardOpen}
        step={step}
        form={form}
        blueprintTab={blueprintTab}
        onOpenChange={setWizardOpen}
        onStepChange={setStep}
        onBlueprintTabChange={setBlueprintTab}
        onFormChange={setForm}
        onCreate={createAgent}
      />

      <QuickView
        profile={quickView}
        onClose={() => setQuickView(null)}
        onOpen={() => {
          if (quickView) setSelected(quickView);
          setQuickView(null);
        }}
      />
      <AgentPlayground
        key={testProfile?.id}
        profile={testProfile}
        onClose={() => setTestProfile(null)}
      />
    </>
  );
}

function ProfileCard({
  profile,
  onView,
  onQuickView,
  onEdit,
  onClone,
  onDefault,
  onDelete,
  onStatusChange,
  onTest,
}: {
  profile: AgentProfile;
  onView: () => void;
  onQuickView: () => void;
  onEdit: () => void;
  onClone: () => void;
  onDefault: () => void;
  onDelete: () => void;
  onStatusChange: () => void;
  onTest: () => void;
}) {
  return (
    <article className="soft-lift group overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8eaff] to-[#f1f2ff] text-[#5964d6] ring-1 ring-[#e1e4f8]">
            <Bot className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {profile.template === "support" ? "Support" : "Sales"} ·{" "}
              {profile.members.length} participant ·{" "}
              {profile.selectedSkills.length} skills
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.integrationStatus === "ready" && (
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <Check className="mr-1 size-3" /> READY
            </Badge>
          )}
          <StatusBadge status={profile.status} />
          {profile.isDefault && (
            <Badge className="rounded-full bg-[#f1f2ff] text-[#5964d6] hover:bg-[#f1f2ff]">
              DEFAULT
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {profile.description}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {profile.selectedSkills.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Skills</p>
        </div>
        <div className="border-x border-slate-200">
          <p className="text-lg font-semibold text-slate-900">
            {profile.selectedTools.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Tools</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {profile.members.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Members</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Button
          size="sm"
          onClick={onTest}
          className="rounded-lg bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          <Play className="size-4" /> Test agent
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="rounded-lg"
        >
          <Pencil className="size-4" /> Edit
        </Button>
        <Button size="sm" variant="outline" onClick={onQuickView}>
          <Eye className="size-4" /> View details
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={profile.isDefault}
          onClick={onDefault}
        >
          Set as default
        </Button>
        <Button size="sm" variant="outline" onClick={onClone}>
          <Copy className="size-4" /> Clone
        </Button>
        <Button size="sm" variant="outline" onClick={onStatusChange}>
          {profile.status === "published" ? (
            <Pause className="size-4" />
          ) : (
            <Rocket className="size-4" />
          )}
          {profile.status === "published" ? "Pause" : "Publish"}
        </Button>
        {profile.status === "published" ? (
          <Button size="sm" variant="outline" asChild>
            <Link
              href={`/dashboard/branding?agentId=${encodeURIComponent(profile.id)}`}
            >
              <Code2 className="size-4" /> Integrate
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled
            title="Publish the agent before integration"
          >
            <Code2 className="size-4" /> Integrate
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          className="border-rose-200 bg-rose-50 text-rose-600"
        >
          <Trash2 className="size-4" /> Delete
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onView}
          className="ml-auto text-[#5964d6] hover:bg-[#f1f2ff] hover:text-[#4f5acb]"
        >
          Open profile <ChevronRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}

function ProfileDetails({
  profile,
  tab,
  onTabChange,
  onBack,
}: {
  profile: AgentProfile;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onBack: () => void;
}) {
  const detailTabs: Array<[DetailTab, string, typeof LayoutGrid]> = [
    ["overview", "Overview", LayoutGrid],
    ["prompts", "Prompts & identity", MessageSquareText],
    ["skills", "Skills & Live panel", Boxes],
    ["blueprint", "Business blueprint", FileText],
    ["technical", "Technical", Settings],
  ];
  return (
    <section className="mt-7">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[#666670]"
      >
        <ArrowLeft className="size-4" /> Agent Studio profiles
      </button>
      <div className="mt-6 flex justify-between border-b pb-7">
        <div>
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <p className="mt-2 text-sm text-[#7b7b85]">
            Lynara ERP · {profile.template === "support" ? "Support" : "Sales"}
          </p>
        </div>
        <div className="flex gap-2">
          {profile.isDefault && <Badge>DEFAULT PROFILE</Badge>}
          <Badge variant="outline">
            {profile.selectedSkills.length} skills
          </Badge>
          <Badge variant="outline">{profile.members.length} participant</Badge>
        </div>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Headphones}
          label="Business domain"
          value={profile.template === "support" ? "Support" : "Sales"}
        />
        <StatCard
          icon={Boxes}
          label="Active skill packs"
          value={String(profile.selectedSkills.length)}
        />
        <StatCard
          icon={CalendarClock}
          label="Updated"
          value={profile.updatedAt}
        />
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {detailTabs.map(([value, label, Icon]) => (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold",
              tab === value ? "bg-[#f1f1f3]" : "text-[#6f6f78]",
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === "overview" && <Overview profile={profile} />}
        {tab === "prompts" && <Prompts profile={profile} />}
        {tab === "skills" && <ProfileSkills profile={profile} />}
        {tab === "blueprint" && <Blueprint profile={profile} />}
        {tab === "technical" && <Technical profile={profile} />}
      </div>
      <Button variant="outline" onClick={onBack} className="mt-7">
        <ArrowLeft className="size-4" /> Back to studio
      </Button>
    </section>
  );
}

function Overview({ profile }: { profile: AgentProfile }) {
  const checklist = [
    ["Profile configured", Boolean(profile.name && profile.description)],
    ["Knowledge skills selected", profile.selectedSkills.length > 0],
    ["Tools configured", profile.selectedTools.length > 0],
    ["Agent published", profile.status === "published"],
  ] as const;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Description
        </p>
        <p className="mt-3 text-sm">{profile.description}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info
            label="Persona"
            value={profile.template === "support" ? "assistant" : "advisor"}
          />
          <Info
            label="Tone"
            value={
              profile.template === "support" ? "operational" : "consultative"
            }
          />
        </div>
      </section>
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Integration checklist</h2>
        <p className="mt-1 text-sm text-[#777780]">
          Complete these steps before website integration.
        </p>
        <div className="mt-5 space-y-3">
          {checklist.map(([label, done]) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  done
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "text-[#9999a2]",
                )}
              >
                {done && <Check className="size-3.5" />}
              </span>
              <span className={done ? "font-semibold" : "text-[#777780]"}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function Prompts({ profile }: { profile: AgentProfile }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Exported identity</h2>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Display name
        </p>
        <p className="mt-2 text-sm">{profile.name}</p>
        <p className="mt-6 text-xs font-bold uppercase text-[#777780]">
          Welcome message
        </p>
        <p className="mt-2 text-sm leading-6">{profile.welcomeMessage}</p>
      </section>
      <section className="rounded-lg border bg-white p-7">
        <h2 className="text-lg font-semibold">Business system prompt</h2>
        <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-[#101014] p-5 text-xs leading-6 text-white">
          {profile.businessPrompt}
        </pre>
      </section>
    </div>
  );
}
function ProfileSkills({ profile }: { profile: AgentProfile }) {
  return (
    <section className="rounded-lg border bg-white p-7">
      <h2 className="text-lg font-semibold">Skill packs</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {skills
          .filter(([id]) => profile.selectedSkills.includes(id))
          .map(([id, name, meta]) => (
            <article
              key={id}
              className="rounded-lg border border-[#8f8f98] bg-[#fafafa] p-4"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="mt-1 text-xs text-[#777780]">{meta}</p>
                </div>
                <Badge>ACTIVE</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#55555f]">
                This skill pack is active for {profile.name}. It contributes its
                mission, activation rules and guardrails to the final agent
                prompt.
              </p>
            </article>
          ))}
      </div>
    </section>
  );
}
function Blueprint({ profile }: { profile: AgentProfile }) {
  const items = [
    ["Business context", profile.businessContext],
    ["Offers & services", profile.offers],
    ["End users", profile.targetUsers],
    ["Expected outcomes", profile.expectedOutcomes],
    ["Guardrails", profile.guardrails],
    ["Escalation rules", profile.escalationRules],
    ["UI & workflow notes", profile.uiNotes],
    ["Execution policy", profile.executionPolicy],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map(([title, value]) => (
        <section key={title} className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#55555f]">{value}</p>
        </section>
      ))}
    </div>
  );
}
function Technical({ profile }: { profile: AgentProfile }) {
  const rows = [
    ["Profile ID", profile.id],
    ["Application (catalog)", "f80cfbdd-f364-49c6-9fb8-176d411576c3"],
    ["Source template", `${profile.template}-agent`],
    ["Created", profile.createdAt],
    ["Updated", profile.updatedAt],
    ["Default", profile.isDefault ? "yes" : "no"],
  ];
  return (
    <section className="rounded-lg border bg-white p-7">
      <h2 className="text-lg font-semibold">Identifiers & metadata</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <Info key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function QuickView({
  profile,
  onClose,
  onOpen,
}: {
  profile: AgentProfile | null;
  onClose: () => void;
  onOpen: () => void;
}) {
  if (!profile) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{profile.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Domain" value={profile.template} />
          <Info label="Skills" value={String(profile.selectedSkills.length)} />
          <Info label="Participants" value={String(profile.members.length)} />
        </div>
        <p className="mt-4 text-sm leading-6 text-[#686872]">
          {profile.description}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onOpen}>Open full record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Headphones;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-5">
      <div className="flex size-11 items-center justify-center rounded-md bg-[#f1f1f3]">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-[#777780]">{label}</p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f1f1f3] p-4">
      <p className="text-xs font-bold uppercase text-[#777780]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
function StatusBadge({ status }: { status: AgentProfile["status"] }) {
  const styles = {
    draft: "border-amber-200 bg-amber-50 text-amber-700",
    published: "border-emerald-200 bg-emerald-50 text-emerald-700",
    paused: "border-slate-200 bg-slate-50 text-slate-600",
  }[status];
  return (
    <Badge variant="outline" className={cn("rounded-full", styles)}>
      {status.toUpperCase()}
    </Badge>
  );
}
