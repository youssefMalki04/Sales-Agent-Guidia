import { createHash, randomBytes } from "node:crypto";

import { buildSalesforceAuthorizationUrl } from "@/lib/crm/salesforce";

export const runtime = "nodejs";

function createOAuthCookie(name: string, value: string, secure: boolean) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Max-Age=600; Path=/api/crm/salesforce/callback${secure ? "; Secure" : ""}`;
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const codeVerifier = randomBytes(64).toString("base64url");
    const codeChallenge = createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    const state = randomBytes(32).toString("base64url");
    const authorizationUrl = buildSalesforceAuthorizationUrl(
      requestUrl.origin,
      { codeChallenge, state },
    );
    const headers = new Headers({ Location: authorizationUrl.toString() });
    const secure = requestUrl.protocol === "https:";

    headers.append(
      "Set-Cookie",
      createOAuthCookie("salesforce_oauth_state", state, secure),
    );
    headers.append(
      "Set-Cookie",
      createOAuthCookie("salesforce_code_verifier", codeVerifier, secure),
    );

    return new Response(null, { status: 302, headers });
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
