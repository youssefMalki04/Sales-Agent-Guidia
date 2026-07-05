import { sendLeadToHubSpot } from "@/lib/crm/hubspot";
import { sendLeadToSalesforce } from "@/lib/crm/salesforce";
import { sendLeadToSlack } from "@/lib/crm/slack";
import type { CrmExportTarget, LeadExportPayload } from "@/lib/crm/types";
import { sendLeadToGenericWebhook } from "@/lib/crm/webhook";

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

  const hasFailure = results.some((result) => result.status === "failed");

  return Response.json(
    {
      status: hasFailure ? "failed" : "ok",
      results,
    },
    { status: hasFailure ? 502 : 200 },
  );
}
