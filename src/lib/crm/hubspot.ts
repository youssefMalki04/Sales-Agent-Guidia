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

  const canUpsert = Boolean(lead.email);
  const endpoint = canUpsert
    ? "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert"
    : "https://api.hubapi.com/crm/v3/objects/contacts";

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        canUpsert
          ? {
              inputs: [
                {
                  id: lead.email,
                  idProperty: "email",
                  properties,
                },
              ],
            }
          : { properties },
      ),
    });
  } catch (error) {
    return {
      target: "hubspot",
      status: "failed",
      message:
        error instanceof Error
          ? `Unable to reach HubSpot: ${error.message}`
          : "Unable to reach HubSpot",
    };
  }

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
    message: canUpsert ? "HubSpot contact created or updated" : "Lead sent to HubSpot",
    response: responseBody,
  };
}
