"use client";

import { CircleAlert, Download, Sparkles } from "lucide-react";
import { AnalyticsCharts } from "./analytics-charts";
import { unresolved } from "./analytics-data";
import type { Period } from "./analytics-types";
import { Card, Change, Recommendation } from "./analytics-ui";
import { useAnalytics } from "./use-analytics";

export default function AnalyticsPage() {
  const { analytics, error, metrics, period, setPeriod } = useAnalytics();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-white px-5 py-8 text-[#171717] sm:px-8 xl:px-12">
      <div className="soft-page-enter mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-xs font-semibold text-[#626cd1]">
              <Sparkles className="size-3.5" /> Intelligence
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              AI performance
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Understand conversion, visitor intent and opportunities to improve
              your agents.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-xl border border-slate-100 bg-slate-50/70 p-1">
              {(["7d", "30d", "90d"] as Period[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`h-8 rounded-lg px-3 text-xs font-semibold transition-all ${period === item ? "bg-white text-[#5964d6] shadow-[0_2px_8px_rgba(89,100,214,.12)]" : "text-slate-500"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-[#f5f6ff] hover:text-[#5964d6]"
            >
              <Download className="size-4" />
              Export
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {metrics.map(({ label, value, change, icon: Icon, tone }) => (
            <article
              key={label}
              className="soft-lift rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.04)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-9 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon className="size-4" />
                </span>
                <Change value={change} />
              </div>
              <p className="mt-5 text-2xl font-semibold text-slate-950">
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </article>
          ))}
        </section>

        <AnalyticsCharts analytics={analytics} />

        <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <Card
            title="Unresolved questions"
            subtitle="Add these answers to the knowledge base"
          >
            <div className="mt-5 divide-y divide-[#ececf0]">
              {unresolved.map((item) => (
                <div
                  key={item.question}
                  className="flex items-start gap-3 py-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <CircleAlert className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-5">
                      {item.question}
                    </p>
                    <p className="mt-1 text-xs text-[#85858e]">
                      {item.category} · Asked {item.occurrences} times
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#5964d6] hover:bg-[#f5f6ff]"
                  >
                    Add answer
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="AI recommendations"
            subtitle="Highest-impact improvements"
          >
            <div className="mt-5 space-y-3">
              <Recommendation
                title="Improve the security knowledge"
                text="12 visitors asked about regional hosting without receiving a complete answer."
                impact="High impact"
              />
              <Recommendation
                title="Refine pricing objection handling"
                text="Price remains the most common commercial objection across qualified sessions."
                impact="Conversion"
              />
              <Recommendation
                title="Shorten the welcome flow"
                text="Visitors who reach qualification do so 18% faster with one fewer introduction question."
                impact="Experience"
              />
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
