import type { CrmExportResult, LeadExportPayload } from "./types";

function splitName(name?: string) {
  if (!name) {
    return {};
  }

  const parts = name.trim().split(/\s+/);
  const [firstname, ...rest] = parts;
  const lastname = rest.join(" ");

  return {
    firstname,
    ...(lastname ? { lastname } : {}),
  };
}

function buildContactProperties(lead: LeadExportPayload) {
  return {
    ...(lead.email ? { email: lead.email } : {}),
    ...splitName(lead.name),
    ...(lead.company ? { company: lead.company } : {}),
    ...(lead.country ? { country: lead.country } : {}),
  };
}

export async function sendLeadToHubSpot(
  lead: LeadExportPayload,
): Promise<CrmExportResult> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      target: "hubspot",
      status: "skipped",
      message: "HUBSPOT_ACCESS_TOKEN is not configured",
    };
  }

  const properties = buildContactProperties(lead);

  if (Object.keys(properties).length === 0) {
    return {
      target: "hubspot",
      status: "skipped",
      message: "Lead does not contain enough contact data for HubSpot",
    };
  }

  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    },
  );

  const responseBody = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      target: "hubspot",
      status: "failed",
      message: `HubSpot responded with ${response.status}`,
      response: responseBody,
    };
  }

  return {
    target: "hubspot",
    status: "sent",
    message: "Lead sent to HubSpot",
    response: responseBody,
  };
}
