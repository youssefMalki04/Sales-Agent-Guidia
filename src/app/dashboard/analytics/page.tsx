"use client";

import {
  Bot,
  CalendarDays,
  CircleAlert,
  Clock3,
  Download,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { readDemoConversations } from "@/lib/demo-conversations";
import {
  agentData,
  objections,
  questionData,
  sourceData,
  trendData,
  unresolved,
} from "./analytics-data";
import type { Period } from "./analytics-types";
import { Card, Change, Legend, Recommendation } from "./analytics-ui";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [sessions, setSessions] = useState<
    ReturnType<typeof readDemoConversations>
  >([]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setSessions(readDemoConversations()),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const metrics = useMemo(() => {
    const factor = period === "7d" ? 0.28 : period === "90d" ? 2.7 : 1;
    const localQualified = sessions.filter(
      (session) => session.status === "qualified",
    ).length;
    return [
      {
        label: "Conversations",
        value: String(Math.round(588 * factor) + sessions.length),
        change: 18.4,
        icon: MessageSquareText,
        tone: "text-indigo-600 bg-indigo-50",
      },
      {
        label: "Qualification rate",
        value: `${36 + Math.min(localQualified, 4)}%`,
        change: 6.2,
        icon: TrendingUp,
        tone: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "Qualified leads",
        value: String(Math.round(212 * factor) + localQualified),
        change: 14.8,
        icon: Users,
        tone: "text-violet-600 bg-violet-50",
      },
      {
        label: "Meetings booked",
        value: String(Math.round(74 * factor)),
        change: 9.7,
        icon: CalendarDays,
        tone: "text-cyan-600 bg-cyan-50",
      },
      {
        label: "Human handoff",
        value: "12.6%",
        change: -3.1,
        icon: UserRoundCheck,
        tone: "text-amber-600 bg-amber-50",
      },
      {
        label: "Average response",
        value: "1.2s",
        change: -11.3,
        icon: Clock3,
        tone: "text-sky-600 bg-sky-50",
      },
    ];
  }, [period, sessions]);

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

        <section className="grid gap-5 xl:grid-cols-[1.65fr_.75fr]">
          <Card
            title="Performance over time"
            subtitle="Conversations, qualified leads and meetings"
          >
            <div className="h-[320px] pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="conversationFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#5964d6"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#5964d6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ececf0" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#85858e" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#85858e" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#e1e4f8",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversations"
                    stroke="#5964d6"
                    strokeWidth={2}
                    fill="url(#conversationFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="qualified"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="meetings"
                    stroke="#8189e6"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-5 text-xs text-[#74747d]">
              <Legend color="bg-[#5964d6]" label="Conversations" />
              <Legend color="bg-emerald-500" label="Qualified" />
              <Legend color="bg-[#8189e6]" label="Meetings" />
            </div>
          </Card>
          <Card title="Visitor sources" subtitle="Where conversations started">
            <div className="relative h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {sourceData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-semibold">588</p>
                  <p className="text-[10px] uppercase text-[#8a8a93]">
                    Visitors
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sourceData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 text-[#6d6d76]">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <b>{item.value}%</b>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <Card
            title="Frequently asked questions"
            subtitle="Answer quality by visitor topic"
          >
            <div className="mt-5 space-y-4">
              {questionData.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-[#7e7e87]">
                      {item.count} questions · {item.rate}% resolved
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#eeeef1]">
                    <div
                      className="h-full rounded-full bg-[#5964d6]"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Top objections"
            subtitle="Commercial friction detected by the AI"
          >
            <div className="h-[270px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={objections}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid stroke="#ececf0" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={130}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#63636c" }}
                  />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar
                    dataKey="count"
                    fill="#5964d6"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <Card
          title="Agent performance"
          subtitle="Compare conversion and response quality"
        >
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-y border-[#ececf0] bg-[#fafafa] text-[11px] uppercase text-[#85858e]">
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Sessions</th>
                  <th className="px-4 py-3">Qualification</th>
                  <th className="px-4 py-3">Satisfaction</th>
                  <th className="px-4 py-3">Avg. response</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {agentData.map((agent) => (
                  <tr key={agent.name} className="border-b border-[#eeeeF1]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                          <Bot className="size-4" />
                        </span>
                        <b>{agent.name}</b>
                      </div>
                    </td>
                    <td className="px-4 py-4">{agent.sessions}</td>
                    <td className="px-4 py-4">
                      <b>{agent.qualification}%</b>
                    </td>
                    <td className="px-4 py-4">{agent.satisfaction}%</td>
                    <td className="px-4 py-4">{agent.response}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

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
