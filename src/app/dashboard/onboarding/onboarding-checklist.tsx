import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { phases, steps } from "./onboarding-data";
import type { Step } from "./onboarding-types";

type OnboardingChecklistProps = {
  completed: string[];
  openPhases: string[];
  nextStep?: Step;
  onToggleStep: (id: string) => void;
  onTogglePhase: (id: string) => void;
};

export function OnboardingChecklist({
  completed,
  openPhases,
  nextStep,
  onToggleStep,
  onTogglePhase,
}: OnboardingChecklistProps) {
  return (
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
            const phaseSteps = steps.filter((step) => step.phase === phase.id);
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
                  onClick={() => onTogglePhase(phase.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#fafafe]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`size-2 rounded-full ${phase.color}`} />
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
                              onClick={() => onToggleStep(step.id)}
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

      <OnboardingSidebar nextStep={nextStep} />
    </section>
  );
}

function OnboardingSidebar({ nextStep }: { nextStep?: Step }) {
  return (
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
              <p className="mt-3 text-sm font-semibold">All steps completed</p>
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
          {[
            "Test one successful qualification.",
            "Test one unknown question.",
            "Verify privacy and consent.",
            "Check the widget on mobile.",
          ].map((label) => (
            <li key={label} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#a9adbb]" />
              {label}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
