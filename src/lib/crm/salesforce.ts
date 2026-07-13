import type { CrmExportResult, LeadExportPayload } from "./types";

type SalesforceTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  instance_url?: string;
  id?: string;
  issued_at?: string;
  signature?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type SalesforceLeadResponse = {
  id?: string;
  success?: boolean;
  errors?: unknown[];
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function getRedirectUri(origin: string) {
  return `${origin}/api/crm/salesforce/callback`;
}

export function buildSalesforceAuthorizationUrl(origin: string) {
  const instanceUrl = getRequiredEnv("SALESFORCE_INSTANCE_URL");
  const clientId = getRequiredEnv("SALESFORCE_CLIENT_ID");
  const redirectUri = getRedirectUri(origin);

  const url = new URL("/services/oauth2/authorize", instanceUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "api refresh_token offline_access");
  url.searchParams.set("prompt", "consent");

  return url;
}

export async function exchangeSalesforceCode(
  code: string,
  origin: string,
): Promise<SalesforceTokenResponse> {
  const instanceUrl = getRequiredEnv("SALESFORCE_INSTANCE_URL");
  const clientId = getRequiredEnv("SALESFORCE_CLIENT_ID");
  const clientSecret = getRequiredEnv("SALESFORCE_CLIENT_SECRET");
  const redirectUri = getRedirectUri(origin);

  const response = await fetch(new URL("/services/oauth2/token", instanceUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const data = (await response.json()) as SalesforceTokenResponse;

  if (!response.ok) {
    throw new Error(
      data.error_description ?? data.error ?? "Salesforce token exchange failed",
    );
  }

  return data;
}

export function maskSecret(value?: string) {
  if (!value) {
    return "";
  }

  if (value.length <= 12) {
    return `${value.slice(0, 3)}...`;
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function splitLeadName(name?: string) {
  if (!name) {
    return {
      lastName: "Unknown",
    };
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      lastName: parts[0],
    };
  }

  const [firstName, ...lastNameParts] = parts;

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
}

function buildSalesforceLeadPayload(lead: LeadExportPayload) {
  const { firstName, lastName } = splitLeadName(lead.name);
  const descriptionLines = [
    lead.need ? `Need: ${lead.need}` : null,
    lead.budget ? `Budget: ${lead.budget}` : null,
    lead.urgency ? `Urgency: ${lead.urgency}` : null,
    lead.sector ? `Sector: ${lead.sector}` : null,
    lead.leadTemperature ? `Temperature: ${lead.leadTemperature}` : null,
    typeof lead.conversionScore === "number"
      ? `Conversion score: ${lead.conversionScore}/100`
      : null,
    lead.summary ? `Summary: ${lead.summary}` : null,
    lead.suggestedNextAction
      ? `Suggested next action: ${lead.suggestedNextAction}`
      : null,
  ].filter(Boolean);

  return {
    ...(firstName ? { FirstName: firstName } : {}),
    LastName: lastName,
    Company: lead.company ?? "Unknown",
    ...(lead.email ? { Email: lead.email } : {}),
    ...(lead.country ? { Country: lead.country } : {}),
    LeadSource: "Leadia",
    ...(descriptionLines.length
      ? { Description: descriptionLines.join("\n") }
      : {}),
  };
}

async function getSalesforceAccessToken() {
  const instanceUrl = getRequiredEnv("SALESFORCE_INSTANCE_URL");
  const clientId = getRequiredEnv("SALESFORCE_CLIENT_ID");
  const clientSecret = getRequiredEnv("SALESFORCE_CLIENT_SECRET");
  const refreshToken = process.env.SALESFORCE_REFRESH_TOKEN;

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(new URL("/services/oauth2/token", instanceUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const data = (await response.json()) as SalesforceTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description ?? data.error ?? "Salesforce refresh failed",
    );
  }

  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url ?? instanceUrl,
  };
}

export async function sendLeadToSalesforce(
  lead: LeadExportPayload,
): Promise<CrmExportResult> {
  const access = await getSalesforceAccessToken();

  if (!access) {
    return {
      target: "salesforce",
      status: "skipped",
      message: "SALESFORCE_REFRESH_TOKEN is not configured",
    };
  }

  const response = await fetch(
    new URL("/services/data/v61.0/sobjects/Lead", access.instanceUrl),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildSalesforceLeadPayload(lead)),
    },
  );

  const responseBody = (await response.json().catch(() => null)) as
    | SalesforceLeadResponse
    | unknown;

  if (!response.ok) {
    return {
      target: "salesforce",
      status: "failed",
      message: `Salesforce responded with ${response.status}`,
      response: responseBody,
    };
  }

  return {
    target: "salesforce",
    status: "sent",
    message: "Lead sent to Salesforce",
    response: responseBody,
  };
}
