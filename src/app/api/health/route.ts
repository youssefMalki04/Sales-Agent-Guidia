export const runtime = "nodejs";

function isConfigured(name: string) {
  return Boolean(process.env[name]);
}

export async function GET() {
  const checks = {
    supabase: {
      url: isConfigured("NEXT_PUBLIC_SUPABASE_URL"),
      anonKey:
        isConfigured("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
        isConfigured("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      serviceRoleKey: isConfigured("SUPABASE_SERVICE_ROLE_KEY"),
    },
    ai: {
      googleApiKey: isConfigured("GOOGLE_API_KEY") || isConfigured("GEMINI_API_KEY"),
    },
    crm: {
      hubspotAccessToken: isConfigured("HUBSPOT_ACCESS_TOKEN"),
      salesforceClientId: isConfigured("SALESFORCE_CLIENT_ID"),
      salesforceClientSecret: isConfigured("SALESFORCE_CLIENT_SECRET"),
      salesforceInstanceUrl: isConfigured("SALESFORCE_INSTANCE_URL"),
      salesforceRefreshToken: isConfigured("SALESFORCE_REFRESH_TOKEN"),
    },
    notifications: {
      slackWebhookUrl: isConfigured("SLACK_WEBHOOK_URL"),
      genericWebhookUrl: isConfigured("GENERIC_WEBHOOK_URL"),
    },
  };

  const requiredChecks = [
    checks.supabase.url,
    checks.supabase.anonKey,
    checks.supabase.serviceRoleKey,
    checks.ai.googleApiKey,
  ];

  return Response.json({
    status: requiredChecks.every(Boolean) ? "ok" : "missing_required_config",
    checks,
  });
}
