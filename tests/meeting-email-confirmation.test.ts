import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const id = "585099c2-c113-425f-9806-4e7706a6505e";
const previousId = "585099c2-c113-425f-9806-4e7706a6505f";

for (const scenario of ["first", "unconfirmed", "stale", "confirmed", "unavailable"] as const) {
  test(`meeting email confirmation: ${scenario}`, async (context) => {
    const oldKey = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "mock-key";
    context.after(() => { if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey; });
    let sends = 0;
    let writes = 0;
    context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.hostname === "api.resend.com") { sends++; return Response.json({ id: "mock-email" }); }
      if (url.pathname.endsWith("/leads")) return Response.json({ id, email: "test@example.com" });
      if (url.pathname.endsWith("/meetings")) return Response.json({ id, lead_id: id });
      assert.ok(url.pathname.endsWith("/agent_events"));
      if (options?.method === "POST") { writes++; return new Response(null, { status: 201 }); }
      assert.equal(url.searchParams.get("payload->>meetingId"), `eq.${id}`);
      assert.equal(url.searchParams.get("event_type"), "eq.lead_email_sent");
      assert.equal(url.searchParams.get("limit"), "1");
      if (scenario === "unavailable") return Response.json({ message: "Unavailable" }, { status: 500 });
      return Response.json(scenario === "first" ? null : { id: previousId, created_at: "2026-09-22T10:00:00Z" });
    });
    const { POST } = await import("../src/app/api/leads/email/route");
    const response = await POST(new Request("http://localhost/api/leads/email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, meetingId: id, subject: "Suivi", message: "Merci", confirmedPreviousEmailId: scenario === "confirmed" ? previousId : scenario === "stale" ? id : undefined }),
    }));
    const allowed = scenario === "first" || scenario === "confirmed";
    assert.equal(response.status, allowed ? 200 : scenario === "unavailable" ? 503 : 409);
    assert.equal(sends, allowed ? 1 : 0);
    assert.equal(writes, allowed ? 1 : 0);
    if (response.status === 409) {
      const payload = await response.json();
      assert.equal(payload.code, "PREVIOUS_EMAIL_CONFIRMATION_REQUIRED");
      assert.equal(payload.previousEmail.id, previousId);
      assert.equal(payload.previousEmail.sentAt, "2026-09-22T10:00:00Z");
    }
  });
}
