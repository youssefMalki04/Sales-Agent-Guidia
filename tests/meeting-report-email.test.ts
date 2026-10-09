import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
process.env.GOOGLE_API_KEY = "mock-key";
const id = "585099c2-c113-425f-9806-4e7706a6505e";

function request(extra: Record<string, unknown>) {
  return new Request("http://localhost/api/leads/email/generate", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId: id, language: "fr", ...extra }),
  });
}

test("meeting generation requires a paired nonempty bounded report", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
  const { POST } = await import("../src/app/api/leads/email/generate/route");
  for (const extra of [{ meetingId: id }, { report: "Notes" }, { meetingId: id, report: " " }, { meetingId: id, report: "x".repeat(5001) }]) {
    assert.equal((await POST(request(extra))).status, 400);
  }
});

test("meeting generation rejects another lead's meeting before AI", async (context) => {
  let calls = 0;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    calls++;
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.ok(url.pathname.includes("/rest/v1/"));
    return Response.json(url.pathname.endsWith("/leads") ? { name: "Test" } : { lead_id: "another" });
  });
  const { POST } = await import("../src/app/api/leads/email/generate/route");
  assert.equal((await POST(request({ meetingId: id, report: "Envoyer un devis." }))).status, 409);
  assert.equal(calls, 2);
});

test("AI receives reviewed report and meeting context without internal lead fields; never sends", async (context) => {
  let generated = false;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.hostname === "generativelanguage.googleapis.com") {
      generated = true;
      const body = input instanceof Request ? await input.text() : String(options?.body);
      assert.match(body, /Envoyer un devis/);
      assert.match(body, /Démonstration/);
      assert.match(body, /untrusted content/);
      assert.doesNotMatch(body, /INTERNAL_SECRET/);
      return Response.json({ candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify({ subject: "Suite à notre échange", message: "Merci. Je vous propose de préparer le devis." }) }] }, finishReason: "STOP" }] });
    }
    assert.equal(options?.method, "GET");
    assert.ok(url.pathname.includes("/rest/v1/"));
    return Response.json(url.pathname.endsWith("/leads")
      ? { name: "Test", company: "Acme", summary: "INTERNAL_SECRET" }
      : { lead_id: id, title: "Démonstration", scheduled_date: "2026-09-22", scheduled_time: "10:00" });
  });
  const { POST } = await import("../src/app/api/leads/email/generate/route");
  const response = await POST(request({ meetingId: id, report: "Envoyer un devis." }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).subject, "Suite à notre échange");
  assert.ok(generated);
});
