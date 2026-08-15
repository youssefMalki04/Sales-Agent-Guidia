"use client";

import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  MoreHorizontal,
  Palette,
  PartyPopper,
  PlugZap,
  RefreshCcw,
  Rocket,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  description: string;
  href: string;
  action: string;
  icon: typeof Bot;
  estimate: string;
  phase: "build" | "test" | "launch";
};

const STORAGE_KEY = "leadia-onboarding-v1";

const steps: Step[] = [
  {
    id: "agent",
    title: "Create your AI sales agent",
    description: "Define its name, goal, language and sales personality.",
    href: "/dashboard/agents",
    action: "Open Agent Studio",
    icon: Bot,
    estimate: "3 min",
    phase: "build",
  },
  {
    id: "knowledge",
    title: "Add your knowledge base",
    description: "Upload product documents and useful commercial answers.",
    href: "/dashboard/knowledge",
    action: "Add knowledge",
    icon: Database,
    estimate: "5 min",
    phase: "build",
  },
  {
    id: "qualification",
    title: "Configure qualification rules",
    description:
      "Choose the information and scoring signals that identify a good lead.",
    href: "/dashboard/qualification-flows",
    action: "Configure flow",
    icon: BrainCircuit,
    estimate: "4 min",
    phase: "build",
  },
  {
    id: "branding",
    title: "Customize the widget",
    description:
      "Match the assistant colors, welcome message and position to your brand.",
    href: "/dashboard/branding",
    action: "Customize widget",
    icon: Palette,
    estimate: "3 min",
    phase: "build",
  },
  {
    id: "test",
    title: "Test the agent",
    description:
      "Run realistic visitor scenarios before exposing the agent to customers.",
    href: "/dashboard/agents",
    action: "Open Playground",
    icon: Sparkles,
    estimate: "5 min",
    phase: "test",
  },
  {
    id: "install",
    title: "Install the website widget",
    description:
      "Copy the generated snippet into a test page or customer website.",
    href: "/dashboard/widget-installation",
    action: "Install widget",
    icon: Code2,
    estimate: "2 min",
    phase: "test",
  },
  {
    id: "integration",
    title: "Connect your sales stack",
    description:
      "Send qualified leads to a CRM and alert the right sales channel.",
    href: "/dashboard/integrations",
    action: "Connect integration",
    icon: PlugZap,
    estimate: "5 min",
    phase: "launch",
  },
  {
    id: "team",
    title: "Invite your sales team",
    description:
      "Assign roles and decide how incoming opportunities are distributed.",
    href: "/dashboard/team",
    action: "Invite team",
    icon: UsersRound,
    estimate: "2 min",
    phase: "launch",
  },
  {
    id: "publish",
    title: "Publish and monitor",
    description: "Activate the agent and follow its conversion performance.",
    href: "/dashboard/analytics",
    action: "View performance",
    icon: Rocket,
    estimate: "1 min",
    phase: "launch",
  },
];

const phases = [
  {
    id: "build",
    label: "Build",
    detail: "Create the foundation",
    color: "bg-[#5964d6]",
  },
  {
    id: "test",
    label: "Test",
    detail: "Validate the experience",
    color: "bg-[#9b6bd6]",
  },
  {
    id: "launch",
    label: "Launch",
    detail: "Connect and go live",
    color: "bg-[#2aaa83]",
  },
] as const;

export default function OnboardingPage() {
  const [completed, setCompleted] = useState<string[]>(["agent"]);
  const [hidden, setHidden] = useState(false);
  const [openPhases, setOpenPhases] = useState<string[]>(
    phases.map((phase) => phase.id),
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as {
            completed?: string[];
            hidden?: boolean;
          };
          setCompleted(parsed.completed ?? ["agent"]);
          setHidden(parsed.hidden ?? false);
        }
      } catch {
        // Keep initial progress if local storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const progress = Math.round((completed.length / steps.length) * 100);
  const nextStep = useMemo(
    () => steps.find((step) => !completed.includes(step.id)),
    [completed],
  );

  function persist(nextCompleted: string[], nextHidden = hidden) {
    setCompleted(nextCompleted);
    setHidden(nextHidden);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completed: nextCompleted, hidden: nextHidden }),
    );
  }

  function toggle(id: string) {
    persist(
      completed.includes(id)
        ? completed.filter((item) => item !== id)
        : [...completed, id],
    );
  }

  function reset() {
    persist([], false);
  }

  function togglePhase(id: string) {
    setOpenPhases((current) =>
      current.includes(id)
        ? current.filter((phase) => phase !== id)
        : [...current, id],
    );
  }

  if (hidden) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-[#f6f7fb] px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-xl rounded-[24px] border border-[#e6e8f1] bg-white p-9 text-center shadow-[0_18px_55px_rgba(40,44,70,.07)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef0ff] to-[#f3edff] text-[#5964d6]">
            <Rocket className="size-6" />
          </span>
          <h1 className="mt-5 text-xl font-bold tracking-[-.02em] text-[#292d3b]">
            Getting started is hidden
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#7c8192]">
            Your progress is safe. Reopen the checklist whenever you want to
            continue.
          </p>
          <button
            type="button"
            onClick={() => persist(completed, false)}
            className="mt-6 h-11 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(89,100,214,.2)] hover:bg-[#4d58c7]"
          >
            Show checklist
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-4 py-7 text-[#292d3b] sm:px-8 sm:py-9 xl:px-10">
      <div className="mx-auto max-w-[1220px] space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#626cd1]">
              <Sparkles className="size-3" />
              Launch guide
            </div>
            <h1 className="mt-4 text-[32px] font-bold tracking-[-0.045em] text-[#282c3a] sm:text-[36px]">
              Let&apos;s build your AI sales flow
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777d8f]">
              A clear, guided path from your first agent to a qualified
              opportunity.
            </p>
          </div>
          <details className="group relative self-start lg:self-auto">
            <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#e2e4ec] bg-white text-[#717687] shadow-sm hover:bg-[#f8f8fb] [&::-webkit-details-marker]:hidden">
              <MoreHorizontal className="size-4" />
            </summary>
            <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-[#e3e5ed] bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={reset}
                className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#676c7d] hover:bg-[#f5f6fa]"
              >
                <RefreshCcw className="size-3.5" />
                Reset progress
              </button>
              <button
                type="button"
                onClick={() => persist(completed, true)}
                className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#676c7d] hover:bg-[#f5f6fa]"
              >
                <X className="size-3.5" />
                Hide checklist
              </button>
            </div>
          </details>
        </header>

        <section className="relative overflow-hidden rounded-[26px] border border-[#e0e3f6] bg-gradient-to-br from-[#f1f3ff] via-white to-[#f5efff] shadow-[0_20px_60px_rgba(62,69,120,.08)]">
          <div className="absolute -right-16 -top-20 size-56 rounded-full bg-[#dfe3ff]/60 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-[#eadfff]/50 blur-3xl" />
          <div className="relative grid gap-7 p-6 sm:p-7 lg:grid-cols-[1fr_210px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#5964d6] shadow-sm">
                <Rocket className="size-3.5" />
                Your launch journey
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-[-.025em] text-[#2d3141] sm:text-[28px]">
                {progress === 100
                  ? "Your workspace is ready"
                  : `${steps.length - completed.length} thoughtful steps to go`}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#73798c]">
                {progress === 100
                  ? "Everything essential is ready. Keep learning from conversations and improving conversion."
                  : "Set up each building block at your pace, test the experience, then confidently go live."}
              </p>
              {nextStep ? (
                <Link
                  href={nextStep.href}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(89,100,214,.22)] transition hover:-translate-y-0.5 hover:bg-[#4f5acb]"
                >
                  Continue setup
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
            <div className="flex items-center justify-center">
              <div
                className={`relative flex size-36 items-center justify-center rounded-full transition-transform duration-500 ${progress === 100 ? "scale-105" : "scale-100"}`}
                style={{
                  background: `conic-gradient(#5964d6 ${progress}%, #e3e5f1 ${progress}% 100%)`,
                }}
              >
                <div className="flex size-[118px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                  <span className="text-3xl font-bold tracking-[-.05em] text-[#34394c]">
                    {progress}%
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#a0a4b2]">
                    Completed
                  </span>
                  <span className="mt-2 text-xs font-semibold text-[#71778a]">
                    {completed.length} of {steps.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {progress === 100 ? (
          <section className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 sm:flex-row sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <PartyPopper className="size-5" />
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-emerald-900">
                Everything is ready for launch
              </h2>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your essential setup is complete. Review the visitor journey
                once, then publish with confidence.
              </p>
            </div>
            <Link
              href="/demo/widget"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white"
            >
              Open final demo
              <ArrowRight className="size-3.5" />
            </Link>
          </section>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1fr_330px]">
          <div className="overflow-hidden rounded-[22px] border border-[#e4e6ee] bg-white shadow-[0_12px_40px_rgba(44,48,75,.045)]">
            <div className="flex items-center justify-between border-b border-[#eceef4] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-bold tracking-[-.01em] text-[#323647]">
                  Launch checklist
                </h2>
                <p className="mt-1 text-xs text-[#858a9b]">
                  One calm step at a time.
                </p>
              </div>
              <span className="rounded-full bg-[#f2f3f8] px-3 py-1.5 text-[10px] font-bold text-[#757a8c]">
                {completed.length}/{steps.length} done
              </span>
            </div>
            <div className="space-y-1 p-2">
              {phases.map((phase) => {
                const phaseSteps = steps.filter(
                  (step) => step.phase === phase.id,
                );
                const phaseDone = phaseSteps.filter((step) =>
                  completed.includes(step.id),
                ).length;
                const isOpen = openPhases.includes(phase.id);
                return (
                  <section
                    key={phase.id}
                    className="overflow-hidden rounded-2xl border border-transparent hover:border-[#eceef4]"
                  >
                    <button
                      type="button"
                      onClick={() => togglePhase(phase.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#fafafe]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`size-2 rounded-full ${phase.color}`}
                        />
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-[.12em] text-[#555a6c]">
                            {phase.label}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-[#a0a4b2]">
                            {phase.detail}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-2 text-[10px] font-semibold text-[#9a9ead]">
                        {phaseDone}/{phaseSteps.length}
                        <ChevronDown
                          className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="divide-y divide-[#f0f1f5] border-t border-[#f1f2f6]">
                          {phaseSteps.map((step) => {
                            const index = steps.findIndex(
                              (item) => item.id === step.id,
                            );
                            const done = completed.includes(step.id);
                            const active = !done && nextStep?.id === step.id;
                            const Icon = step.icon;
                            return (
                              <article
                                key={step.id}
                                className={`group flex flex-col gap-4 px-4 transition sm:flex-row sm:items-center ${done ? "bg-[#fbfcfc] py-3" : active ? "bg-gradient-to-r from-[#f8f8ff] to-white py-4" : "bg-white py-4 hover:bg-[#fcfcfe]"}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggle(step.id)}
                                  aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${step.title}`}
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${done ? "scale-100 bg-emerald-500 text-white shadow-[0_5px_12px_rgba(16,185,129,.2)]" : active ? "border-2 border-[#737de0] bg-white text-[#737de0]" : "border-2 border-[#dfe1e9] bg-white text-transparent hover:border-[#a8add8]"}`}
                                >
                                  {done ? (
                                    <Check className="size-4" />
                                  ) : (
                                    <span className="size-2 rounded-full bg-current" />
                                  )}
                                </button>
                                <span
                                  className={`flex size-11 shrink-0 items-center justify-center rounded-[13px] ${done ? "bg-emerald-50 text-emerald-600" : active ? "bg-[#ebeefe] text-[#5964d6]" : "bg-[#f4f5f8] text-[#8c91a2]"}`}
                                >
                                  <Icon className="size-[18px]" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`text-[9px] font-bold uppercase tracking-[.12em] ${active ? "text-[#626dd4]" : "text-[#a0a4b2]"}`}
                                    >
                                      Step {index + 1}
                                    </span>
                                    <span className="text-[10px] text-[#aaadb9]">
                                      {step.estimate}
                                    </span>
                                    {active ? (
                                      <span className="rounded-full bg-[#eceeff] px-2 py-0.5 text-[9px] font-bold uppercase text-[#5d68cf]">
                                        Next
                                      </span>
                                    ) : null}
                                  </div>
                                  <h3
                                    className={`mt-1.5 text-sm font-semibold ${done ? "text-[#858a98]" : "text-[#3a3e4e]"}`}
                                  >
                                    {step.title}
                                  </h3>
                                  <p
                                    className={`mt-1 text-xs leading-5 text-[#858a9a] ${done ? "hidden" : "block"}`}
                                  >
                                    {step.description}
                                  </p>
                                </div>
                                <Link
                                  href={step.href}
                                  className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold transition ${active ? "bg-[#5964d6] text-white shadow-sm" : "border border-[#e2e4eb] bg-white text-[#666b7c] hover:border-[#cfd2e1] hover:bg-[#f8f8fb]"}`}
                                >
                                  {done
                                    ? "Review"
                                    : active
                                      ? "Continue"
                                      : step.action}
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className="relative overflow-hidden rounded-[22px] border border-[#e2e4f6] bg-gradient-to-br from-[#f2f3ff] to-[#f8f4ff] p-5">
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/70 blur-xl" />
              <div className="relative">
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-white text-[#6d5fd3] shadow-sm">
                  <Sparkles className="size-5" />
                </span>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#8378d5]">
                  Recommended next
                </p>
                {nextStep ? (
                  <div>
                    <h3 className="mt-2 text-base font-bold tracking-[-.015em] text-[#35394a]">
                      {nextStep.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[#74798b]">
                      {nextStep.description}
                    </p>
                    <Link
                      href={nextStep.href}
                      className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-[#555fc5] shadow-sm transition hover:-translate-y-0.5"
                    >
                      Start this step
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="py-7 text-center">
                    <CheckCircle2 className="mx-auto size-9 text-emerald-500" />
                    <p className="mt-3 text-sm font-semibold">
                      All steps completed
                    </p>
                  </div>
                )}
              </div>
            </section>
            <section className="rounded-[22px] border border-[#e7e8ef] bg-white p-5 shadow-[0_10px_30px_rgba(44,48,75,.04)]">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Rocket className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#3c4050]">
                    Before publishing
                  </h2>
                  <p className="mt-0.5 text-[10px] text-[#989ca9]">
                    Four final checks
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-[#73788a]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#a9adbb]" />
                  Test one successful qualification.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#a9adbb]" />
                  Test one unknown question.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#a9adbb]" />
                  Verify privacy and consent.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#a9adbb]" />
                  Check the widget on mobile.
                </li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
