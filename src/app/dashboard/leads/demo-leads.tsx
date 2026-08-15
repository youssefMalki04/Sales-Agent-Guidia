"use client";

import { Bot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { readDemoConversations } from "@/lib/demo-conversations";

export function DemoLeads() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<ReturnType<typeof readDemoConversations>>(
    [],
  );
  useEffect(() => {
    const load = window.setTimeout(
      () =>
        setLeads(
          readDemoConversations().filter(
            (session) => session.status === "qualified",
          ),
        ),
      0,
    );
    return () => window.clearTimeout(load);
  }, []);
  const temperature = searchParams.get("temperature")?.toLowerCase() ?? "";
  const country = searchParams.get("country")?.trim().toLowerCase() ?? "";
  const sector = searchParams.get("sector")?.trim().toLowerCase() ?? "";
  const urgency = searchParams.get("urgency")?.toLowerCase() ?? "";
  const crm = searchParams.get("crm")?.toLowerCase() ?? "";
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const filteredLeads = leads.filter(
    (lead) =>
      (!temperature || temperature === "hot") &&
      (!country || "france".includes(country)) &&
      (!sector || "sales ai".includes(sector)) &&
      (!urgency || urgency === "high") &&
      (!crm || crm === "not_sent") &&
      (!query ||
        lead.agentName.toLowerCase().includes(query) ||
        lead.messages.some((message) =>
          message.content.toLowerCase().includes(query),
        )),
  );
  if (!leads.length) return null;
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5">
      <div className="flex items-center gap-3">
        <Sparkles className="size-5 text-emerald-700" />
        <div>
          <h2 className="font-semibold">Qualified Playground leads</h2>
          <p className="text-sm text-[#686872]">
            {filteredLeads.length} of {leads.length} local leads match the
            current filters.
          </p>
        </div>
      </div>
      {filteredLeads.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {filteredLeads.map((lead) => (
            <Link
              href={`/dashboard/leads/${encodeURIComponent(lead.id)}`}
              key={lead.id}
              className="rounded-lg border border-emerald-100 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-[#f1f1f3]">
                    <Bot className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">Visitor · {lead.agentName}</p>
                    <p className="mt-1 text-xs text-[#777780]">
                      France · Sales AI · High urgency
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700"
                  >
                    Hot
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    Qualified
                  </Badge>
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-[#686872]">
                {lead.messages.findLast((message) => message.role === "user")
                  ?.content ?? "Qualified from Playground"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-sm text-[#777780]">
          No local lead matches these filters.
        </div>
      )}
    </section>
  );
}
