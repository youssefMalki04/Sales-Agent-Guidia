import {
  exchangeSalesforceCode,
  maskSecret,
} from "@/lib/crm/salesforce";

export const runtime = "nodejs";

function renderResultPage(params: {
  refreshToken?: string;
  instanceUrl?: string;
  error?: string;
}) {
  const status = params.error ? "Erreur Salesforce OAuth" : "Salesforce connecte";
  const body = params.error
    ? `<p>${params.error}</p>`
    : `<p>Ajoute cette valeur dans <code>.env.local</code>:</p>
       <pre>SALESFORCE_REFRESH_TOKEN=${params.refreshToken}</pre>
       <p>Instance: <code>${params.instanceUrl ?? "-"}</code></p>
       <p>Token masque: <code>${maskSecret(params.refreshToken)}</code></p>`;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${status}</title>
    <style>
      body {
        background: #f8fafc;
        color: #111827;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 48px;
      }
      main {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        max-width: 760px;
        padding: 28px;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 16px;
      }
      pre {
        background: #111827;
        border-radius: 6px;
        color: #f9fafb;
        overflow-x: auto;
        padding: 16px;
        white-space: pre-wrap;
        word-break: break-word;
      }
      code {
        background: #f3f4f6;
        border-radius: 4px;
        padding: 2px 5px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${status}</h1>
      ${body}
    </main>
  </body>
</html>`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description");

  if (error) {
    return new Response(renderResultPage({ error }), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (!code) {
    return new Response(renderResultPage({ error: "Missing Salesforce code" }), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const tokenResponse = await exchangeSalesforceCode(code, requestUrl.origin);

    return new Response(
      renderResultPage({
        refreshToken: tokenResponse.refresh_token,
        instanceUrl: tokenResponse.instance_url,
      }),
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  } catch (exchangeError) {
    return new Response(
      renderResultPage({
        error:
          exchangeError instanceof Error
            ? exchangeError.message
            : "Salesforce token exchange failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }
}
