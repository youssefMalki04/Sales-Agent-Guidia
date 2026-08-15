"use client";

import { ArrowLeft, Bot, Building2, CheckCircle2, Clock3, Flame, MessageSquareText, Send, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { readDemoConversations, type DemoConversation } from "@/lib/demo-conversations";

export default function LeadDetailsPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<DemoConversation | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  useEffect(() => {
    const load = window.setTimeout(() => {
      setLead(readDemoConversations().find((session) => session.id === params.id && session.status === "qualified") ?? null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(load);
  }, [params.id]);

  if (!loaded) return <div className="px-8 py-14 text-sm text-[#777780]">Loading lead…</div>;
  if (!lead) return <main className="px-8 py-14"><div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center"><h1 className="text-xl font-semibold">Lead not found</h1><p className="mt-2 text-sm text-[#777780]">This frontend lead may have been deleted or reset.</p><Button asChild className="mt-5"><Link href="/dashboard/leads"><ArrowLeft className="size-4" /> Back to leads</Link></Button></div></main>;

  const userMessages = lead.messages.filter((message) => message.role === "user");
  const need = userMessages.at(-1)?.content ?? "Commercial need identified in Playground";
  const score = Math.min(95, 65 + userMessages.length * 5);
  const objections = userMessages.flatMap((message) => {
    const content = message.content.toLowerCase();
    return [["price", "Price"], ["security", "Security"], ["integration", "Integration"], ["human", "Human request"]].filter(([key]) => content.includes(key)).map(([, label]) => label);
  });
  const uniqueObjections = [...new Set(objections)];
  const notify = (channel: string) => { setExported(channel); window.setTimeout(() => setExported(null), 1800); };

  return <main className="min-h-[calc(100vh-76px)] bg-[#fbfbfc] px-5 py-8 sm:px-8 xl:px-14"><div className="mx-auto max-w-[1180px] space-y-6">
    <Link href="/dashboard/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-[#686872] hover:text-[#202026]"><ArrowLeft className="size-4" /> Back to leads</Link>
    <header className="flex flex-col gap-4 border-b border-[#e5e5ea] pb-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2"><Badge className="bg-emerald-600">QUALIFIED</Badge><Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">HOT</Badge></div><h1 className="mt-4 text-3xl font-semibold">Visitor · {lead.agentName}</h1><p className="mt-2 text-sm text-[#777780]">Session {lead.id}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => notify("Slack")}>Notify Slack</Button><Button variant="outline" onClick={() => notify("HubSpot")}>Send HubSpot</Button><Button variant="outline" onClick={() => notify("Salesforce")}>Send Salesforce</Button><Button onClick={() => notify("Webhook")}><Send className="size-4" /> Webhook</Button></div></header>
    {exported && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Frontend demo: lead sent to {exported}.</div>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat icon={Flame} label="Conversion score" value={`${score}/100`} /><Stat icon={Building2} label="Source" value={lead.agentName} /><Stat icon={MessageSquareText} label="Messages" value={String(lead.messages.length)} /><Stat icon={Clock3} label="Last activity" value={new Date(lead.updatedAt).toLocaleDateString("fr-FR")} /></section>
    <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><section className="rounded-xl border border-[#e3e3e8] bg-white p-6"><h2 className="text-lg font-semibold">Full conversation</h2><div className="mt-5 space-y-3">{lead.messages.map((message) => <div key={message.id} className="flex gap-3 rounded-lg border border-[#eeeef1] bg-[#fbfbfc] p-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">{message.role === "assistant" ? <Bot className="size-4" /> : <User className="size-4" />}</span><div><p className="text-xs font-bold uppercase text-[#888892]">{message.role}</p><p className="mt-2 text-sm leading-6 text-[#50505a]">{message.content}</p><p className="mt-2 text-xs text-[#9999a2]">{new Date(message.createdAt).toLocaleString("fr-FR")}</p></div></div>)}</div></section>
      <aside className="space-y-5"><InfoSection title="Sales summary">Qualified visitor tested with {lead.agentName}. The conversation shows commercial interest and should be reviewed by the sales team.</InfoSection><InfoSection title="Identified need">{need}</InfoSection><InfoSection title="Objections">{uniqueObjections.length ? <div className="flex flex-wrap gap-2">{uniqueObjections.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}</div> : "No explicit objection detected."}</InfoSection><InfoSection title="Suggested next action"><span className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />Book a 20-minute product demonstration and confirm business requirements.</span></InfoSection></aside>
    </div>
  </div></main>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) { return <div className="rounded-lg border border-[#e3e3e8] bg-white p-5"><div className="flex items-center gap-2 text-sm font-semibold text-[#777780]"><Icon className="size-4" /> {label}</div><p className="mt-4 text-xl font-semibold">{value}</p></div>; }
function InfoSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-xl border border-[#e3e3e8] bg-white p-5"><h2 className="font-semibold">{title}</h2><div className="mt-3 text-sm leading-6 text-[#60606a]">{children}</div></section>; }
