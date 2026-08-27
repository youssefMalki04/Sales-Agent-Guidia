import { Bot } from "lucide-react";
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

import type { AnalyticsData } from "./analytics-types";
import { Card, Legend } from "./analytics-ui";

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsData }) {
  const { agentData, objections, questionData, sourceData, trendData } =
    analytics;

  return (
    <>
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
                    <stop offset="5%" stopColor="#5964d6" stopOpacity={0.25} />
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
                <p className="text-2xl font-semibold">
                  {analytics.metrics.conversations}
                </p>
                <p className="text-[10px] uppercase text-[#8a8a93]">Visitors</p>
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
    </>
  );
}
