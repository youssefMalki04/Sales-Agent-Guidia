"use client";

import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  MessageSquareText,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { ChatWidget } from "./chat-widget";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

const metrics = [
  { label: "Qualified leads", value: "48", change: "+12%", icon: Target },
  {
    label: "Conversations",
    value: "326",
    change: "+8%",
    icon: MessageSquareText,
  },
  { label: "Meetings booked", value: "21", change: "+16%", icon: CalendarDays },
  {
    label: "Pipeline value",
    value: "$42.8k",
    change: "+9%",
    icon: CircleDollarSign,
  },
];

const activity = [
  {
    title: "New qualified lead",
    detail: "Amira Ben Salah · Score 92",
    time: "4 min",
    color: "bg-emerald-500",
  },
  {
    title: "Meeting booked",
    detail: "Demo with Atlas Solutions",
    time: "18 min",
    color: "bg-[#5964d6]",
  },
  {
    title: "Conversation completed",
    detail: "Lead summary generated",
    time: "32 min",
    color: "bg-violet-500",
  },
  {
    title: "Lead moved to proposal",
    detail: "Nexa Digital · $8,400",
    time: "1 h",
    color: "bg-amber-500",
  },
];

const shortcuts = [
  {
    label: "Open live inbox",
    detail: "3 conversations waiting",
    href: "/dashboard/inbox",
    icon: MessageSquareText,
  },
  {
    label: "Review new leads",
    detail: "8 leads need attention",
    href: "/dashboard/leads",
    icon: UsersRound,
  },
  {
    label: "Configure sales agent",
    detail: "Improve agent performance",
    href: "/dashboard/agents",
    icon: Bot,
  },
];

export function HomeOverview() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[296px_1fr]">
        <Sidebar />
        <section className="min-w-0">
          <Topbar title="Home" agentName="Leadia Sales Agent" />
          <div className="soft-page-enter px-5 py-9 sm:px-8 xl:px-14">
            <div className="mx-auto max-w-[1308px] space-y-7">
              <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="inline-flex rounded-full border border-[#e1e4f8] bg-[#f1f2ff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5964d6]">
                    Sales command center
                  </p>
                  <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    Good morning, Yosra
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Here is what your AI sales team accomplished and what needs
                    your attention today.
                  </p>
                </div>
                <Link
                  href="/dashboard/analytics"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5964d6] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4f5acb]"
                >
                  View analytics <ArrowUpRight className="size-4" />
                </Link>
              </header>

              <section className="soft-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, value, change, icon: Icon }) => (
                  <article
                    key={label}
                    className="soft-lift rounded-2xl border border-[#e1e4f8] bg-white p-5 shadow-[0_10px_30px_rgba(89,100,214,0.06)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                        <Icon className="size-5" />
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                        {change}
                      </span>
                    </div>
                    <p className="mt-5 text-2xl font-semibold tracking-tight">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </article>
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
                <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 className="font-semibold tracking-tight">
                        Recent activity
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Live updates across your sales workflow
                      </p>
                    </div>
                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                      <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      Live
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {activity.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50/60"
                      >
                        <span
                          className={`size-2.5 shrink-0 rounded-full ${item.color}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {item.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.detail}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-[#e1e4f8] bg-gradient-to-br from-[#f8f9ff] to-[#f1f2ff] p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#5964d6] shadow-sm">
                      <Sparkles className="size-5" />
                    </span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Online
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight">
                    Leadia Sales Agent
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your agent is active and qualifying website visitors right
                    now.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <MiniStat label="Handled today" value="37" />
                    <MiniStat label="Qualification" value="74%" />
                  </div>
                  <Link
                    href="/dashboard/agents"
                    className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-[#5964d6] shadow-sm transition hover:bg-[#f8f9ff]"
                  >
                    Open agent studio <ChevronRight className="size-4" />
                  </Link>
                </article>
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="font-semibold tracking-tight">
                    Needs your attention
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Continue with the most important tasks
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {shortcuts.map(({ label, detail, href, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      className="soft-lift group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:border-[#d9ddfa]"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f2ff] text-[#5964d6]">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-700">
                          {label}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {detail}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#5964d6]" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
      <ChatWidget />
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-emerald-600">
        <CheckCircle2 className="size-3.5" />
        <span className="text-lg font-semibold text-slate-800">{value}</span>
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{label}</p>
    </div>
  );
}
