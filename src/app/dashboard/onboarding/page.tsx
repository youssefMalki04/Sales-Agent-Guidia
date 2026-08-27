"use client";

import {
  ArrowRight,
  MoreHorizontal,
  PartyPopper,
  RefreshCcw,
  Rocket,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { phases, steps, STORAGE_KEY } from "./onboarding-data";
import { OnboardingChecklist } from "./onboarding-checklist";

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

        <OnboardingChecklist
          completed={completed}
          openPhases={openPhases}
          nextStep={nextStep}
          onToggleStep={toggle}
          onTogglePhase={togglePhase}
        />
      </div>
    </main>
  );
}
