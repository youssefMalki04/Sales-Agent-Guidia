"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LeadExportPayload } from "@/lib/crm/types";

export function LeadExportActions({ lead }: { lead: LeadExportPayload }) {
  const [notice, setNotice] = useState("");

  async function exportLead(
    type: "hubspot" | "salesforce" | "slack" | "webhook",
  ) {
    setNotice("");
    try {
      const response = await fetch("/api/crm/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, target: type }),
      });
      const payload = (await response.json()) as {
        error?: string;
        results?: Array<{ message?: string; response?: { message?: string } }>;
      };
      const result = payload.results?.[0];
      const detail =
        result?.response?.message ?? result?.message ?? payload.error;
      setNotice(
        response.ok
          ? (detail ?? `Lead sent to ${type}.`)
          : (detail ?? `Unable to send lead to ${type}.`),
      );
    } catch {
      setNotice(`Unable to reach the server for ${type}.`);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="rounded-xl bg-white"
          variant="outline"
          onClick={() => exportLead("slack")}
        >
          Notify Slack
        </Button>
        <Button
          className="rounded-xl bg-white"
          variant="outline"
          onClick={() => exportLead("hubspot")}
        >
          Send HubSpot
        </Button>
        <Button
          className="rounded-xl bg-white"
          variant="outline"
          onClick={() => exportLead("salesforce")}
        >
          Send Salesforce
        </Button>
        <Button
          className="rounded-xl bg-[#252630] hover:bg-[#15161d]"
          onClick={() => exportLead("webhook")}
        >
          <Send className="size-4" /> Webhook
        </Button>
      </div>
      {notice ? (
        <p className="mt-2 text-xs font-semibold text-[#5964d6]">{notice}</p>
      ) : null}
    </div>
  );
}
