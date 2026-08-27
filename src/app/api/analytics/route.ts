import { z } from "zod";

import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

const periodSchema = z.enum(["7d", "30d", "90d"]);

export async function GET(request: Request) {
  const period = periodSchema.catch("30d").parse(new URL(request.url).searchParams.get("period"));
  const days = Number(period.slice(0, -1));
  const from = new Date(Date.now() - days * 86_400_000).toISOString();
  const [messagesResult, leadsResult, meetingsResult, statesResult] = await Promise.all([
    supabaseAdmin.from("conversations").select("session_id,role,message,created_at").gte("created_at", from).order("created_at", { ascending: true }),
    supabaseAdmin.from("leads").select("id,session_id,created_at,conversion_score,lead_temperature,objections,pipeline_stage,deal_value").gte("created_at", from),
    supabaseAdmin.from("meetings").select("id,created_at").gte("created_at", from),
    supabaseAdmin.from("conversation_sessions").select("session_id,mode").gte("updated_at", from),
  ]);
  if (messagesResult.error || leadsResult.error) return Response.json({ error: messagesResult.error?.message ?? leadsResult.error?.message }, { status: 500 });

  const messages = messagesResult.data ?? [];
  const leads = leadsResult.data ?? [];
  const meetings = meetingsResult.data ?? [];
  const states = statesResult.data ?? [];
  const sessions = new Set(messages.map((message) => message.session_id));
  const qualified = leads.filter((lead) => (lead.conversion_score ?? 0) >= 70 || lead.lead_temperature === "hot");
  const handoffs = states.filter((state) => ["human", "waiting"].includes(state.mode)).length;
  const responseTimes: number[] = [];
  const lastVisitorAt = new Map<string, number>();
  for (const message of messages) {
    if (message.role === "user") lastVisitorAt.set(message.session_id, new Date(message.created_at).getTime());
    if (message.role === "assistant" && lastVisitorAt.has(message.session_id)) { responseTimes.push(new Date(message.created_at).getTime() - lastVisitorAt.get(message.session_id)!); lastVisitorAt.delete(message.session_id); }
  }
  const averageResponse = responseTimes.length ? responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length / 1000 : 0;
  const trendMap = new Map<string, { conversations: Set<string>; meetings: number; qualified: number }>();
  const bucket = (value: string) => new Date(value).toISOString().slice(0, 10);
  for (const message of messages) { const key = bucket(message.created_at); const row = trendMap.get(key) ?? { conversations: new Set<string>(), meetings: 0, qualified: 0 }; row.conversations.add(message.session_id); trendMap.set(key, row); }
  for (const lead of qualified) { const key = bucket(lead.created_at); const row = trendMap.get(key) ?? { conversations: new Set<string>(), meetings: 0, qualified: 0 }; row.qualified += 1; trendMap.set(key, row); }
  for (const meeting of meetings) { const key = bucket(meeting.created_at); const row = trendMap.get(key) ?? { conversations: new Set<string>(), meetings: 0, qualified: 0 }; row.meetings += 1; trendMap.set(key, row); }
  const trendData = Array.from(trendMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([day, row]) => ({ day: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(`${day}T12:00:00`)), conversations: row.conversations.size, qualified: row.qualified, meetings: row.meetings }));
  const objectionCounts = new Map<string, number>();
  for (const lead of leads) for (const objection of Array.isArray(lead.objections) ? lead.objections : []) { const label = String((objection as { category?: string }).category ?? "other"); objectionCounts.set(label, (objectionCounts.get(label) ?? 0) + 1); }
  const manual = leads.filter((lead) => lead.session_id.startsWith("manual-")).length;
  const website = Math.max(leads.length - manual, 0);
  const totalSources = Math.max(leads.length, 1);
  const visitorMessages = messages.filter((message) => message.role === "user");
  const topics = [
    { keywords: ["prix", "tarif", "budget", "price"], label: "Pricing and plans" },
    { keywords: ["crm", "hubspot", "salesforce", "intégration", "integration"], label: "CRM integrations" },
    { keywords: ["installation", "setup", "déploiement"], label: "Setup and deployment" },
    { keywords: ["sécurité", "security", "gdpr", "rgpd"], label: "Data security" },
    { keywords: ["solution", "fonction", "capabil"], label: "Product capabilities" },
  ];
  const questionData = topics.map((topic) => ({ label: topic.label, count: visitorMessages.filter((item) => topic.keywords.some((keyword) => item.message.toLowerCase().includes(keyword))).length, rate: 100 }));
  const wonRevenue = leads.filter((lead) => lead.pipeline_stage === "won").reduce((sum, lead) => sum + Number(lead.deal_value ?? 0), 0);

  return Response.json({
    metrics: { averageResponse, conversations: sessions.size, handoffRate: sessions.size ? (handoffs / sessions.size) * 100 : 0, meetings: meetings.length, qualificationRate: leads.length ? (qualified.length / leads.length) * 100 : 0, qualified: qualified.length, wonRevenue },
    trendData,
    sourceData: [{ name: "Website", value: Math.round((website / totalSources) * 100), color: "#5964d6" }, { name: "Manual", value: Math.round((manual / totalSources) * 100), color: "#aeb4ef" }],
    questionData,
    objections: Array.from(objectionCounts.entries()).map(([label, count]) => ({ label, count })),
    agentData: [{ name: "Leadia Sales Agent", sessions: sessions.size, qualification: Math.round(leads.length ? (qualified.length / leads.length) * 100 : 0), satisfaction: 100, response: `${averageResponse.toFixed(1)}s` }],
  });
}
