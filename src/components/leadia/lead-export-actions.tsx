"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LeadExportPayload } from "@/lib/crm/types";

export function LeadExportActions({ lead }: { lead: LeadExportPayload }) {
  const [notice, setNotice] = useState("");

  async function exportLead(type: "hubspot" | "salesforce" | "slack" | "webhook") {
    setNotice("");
    const response = await fetch("/api/crm/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead, target: type }) });
    setNotice(response.ok ? `Lead sent to ${type}.` : `Unable to send lead to ${type}.`);
  }

  return <div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => exportLead("slack")}>Notify Slack</Button><Button variant="outline" onClick={() => exportLead("hubspot")}>Send HubSpot</Button><Button variant="outline" onClick={() => exportLead("salesforce")}>Send Salesforce</Button><Button onClick={() => exportLead("webhook")}><Send className="size-4" /> Webhook</Button></div>{notice ? <p className="mt-2 text-xs font-semibold text-[#5964d6]">{notice}</p> : null}</div>;
}
