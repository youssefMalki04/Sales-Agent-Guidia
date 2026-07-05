import type { CrmExportResult, LeadExportPayload } from "./types";

export async function sendLeadToGenericWebhook(
  lead: LeadExportPayload,
): Promise<CrmExportResult> {
  const webhookUrl = process.env.GENERIC_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      target: "webhook",
      status: "skipped",
      message: "GENERIC_WEBHOOK_URL is not configured",
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: "leadia",
      event: "lead.qualified",
      lead,
      sentAt: new Date().toISOString(),
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    return {
      target: "webhook",
      status: "failed",
      message: `Webhook responded with ${response.status}`,
      response: responseText,
    };
  }

  return {
    target: "webhook",
    status: "sent",
    message: "Lead sent to generic webhook",
    response: responseText,
  };
}
