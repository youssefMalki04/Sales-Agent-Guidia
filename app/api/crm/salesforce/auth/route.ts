import { buildSalesforceAuthorizationUrl } from "@/lib/crm/salesforce";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const authorizationUrl = buildSalesforceAuthorizationUrl(origin);

    return Response.redirect(authorizationUrl);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Salesforce authorization failed",
      },
      { status: 500 },
    );
  }
}
