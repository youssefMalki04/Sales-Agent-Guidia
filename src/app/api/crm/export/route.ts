import { sendLeadToHubSpot } from "@/lib/crm/hubspot";
import { sendLeadToSalesforce } from "@/lib/crm/salesforce";
import { sendLeadToSlack } from "@/lib/crm/slack";
import type { CrmExportTarget, LeadExportPayload } from "@/lib/crm/types";
import { sendLeadToGenericWebhook } from "@/lib/crm/webhook";
import { createNotification } from "@/lib/notifications/create-notification";
import { supabaseAdmin } from "@/lib/database/supabase-admin";

export const runtime = "nodejs";

type ExportRequestBody = {
  target?: CrmExportTarget | "all";
  lead?: LeadExportPayload;
};

export async function POST(request: Request) {
  let body: ExportRequestBody;

  try {
    body = (await request.json()) as ExportRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.lead) {
    return Response.json({ error: "Missing lead payload" }, { status: 400 });
  }

  const target = body.target ?? "all";

  if (!["all", "hubspot", "salesforce", "slack", "webhook"].includes(target)) {
    return Response.json(
      { error: "Unsupported CRM export target" },
      { status: 400 },
    );
  }

  const results =
    target === "all"
      ? await Promise.all([
          sendLeadToHubSpot(body.lead),
          sendLeadToSlack(body.lead),
          sendLeadToGenericWebhook(body.lead),
        ])
      : target === "hubspot"
        ? [await sendLeadToHubSpot(body.lead)]
        : target === "salesforce"
          ? [await sendLeadToSalesforce(body.lead)]
          : target === "slack"
            ? [await sendLeadToSlack(body.lead)]
            : [await sendLeadToGenericWebhook(body.lead)];

  const hasFailure = results.some((result) => result.status !== "sent");

  const leadId = body.lead.id && /^[0-9a-f-]{36}$/i.test(body.lead.id) ? body.lead.id : null;
  const records = results.map((result) => ({
    lead_id: leadId,
    type: result.target,
    status: result.status === "sent" ? "sent" : "failed",
    payload: body.lead,
    response: { message: result.message, data: result.response ?? null, originalStatus: result.status },
  }));
  const { error: historyError } = await supabaseAdmin.from("crm_exports").insert(records);

  if (hasFailure) {
    await createNotification({ eventType: "crm-error", leadId: body.lead.id, message: `At least one CRM export failed for ${body.lead.name ?? body.lead.email ?? "a lead"}.`, sessionId: body.lead.sessionId, severity: "error", title: "CRM export failed" });
  }

  return Response.json(
    {
      status: hasFailure ? "failed" : "ok",
      results,
      historySaved: !historyError,
    },
    { status: hasFailure ? 502 : 200 },
  );
}
