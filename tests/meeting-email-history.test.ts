import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const id = "585099c2-c113-425f-9806-4e7706a6505e";

test("history filters by exact meeting and exposes only email metadata", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("payload->>meetingId"), `eq.${id}`);
    assert.equal(url.searchParams.get("limit"), "50");
    assert.equal(url.searchParams.get("order"), "created_at.desc");
    assert.equal(url.searchParams.get("event_type"), "in.(lead_email_sent,lead_email_failed)");
    return Response.json([{ id: "event", created_at: "2026-09-22T12:00:00Z", event_type: "lead_email_sent", payload: { subject: "Suivi", recipient: "test@example.com", body: "Private text" } }]);
  });
  const { GET } = await import("../src/app/api/meetings/email-history/route");
  const response = await GET(new Request(`http://localhost/api/meetings/email-history?meetingId=${id}`));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.emails[0].status, "sent");
  assert.equal(payload.emails[0].body, undefined);
});

test("invalid meeting history ID never queries all events", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
  const { GET } = await import("../src/app/api/meetings/email-history/route");
  assert.equal((await GET(new Request("http://localhost/api/meetings/email-history?meetingId=bad"))).status, 400);
});

test("mismatched meeting lead blocks sending and writing history", async (context) => {
  let calls = 0;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    calls++;
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    return Response.json(url.pathname.endsWith("/leads") ? { id, email: "test@example.com" } : { id, lead_id: "another-lead" });
  });
  const { POST } = await import("../src/app/api/leads/email/route");
  const response = await POST(new Request("http://localhost/api/leads/email", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId: id, meetingId: id, subject: "Suivi", message: "Merci" }),
  }));
  assert.equal(response.status, 409);
  assert.equal(calls, 2);
});

test("successful send records meeting and recipient; history failure does not invite a resend", async (context) => {
  const previousKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "mock-key";
  context.after(() => { if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey; });
  let sends = 0;
  let writes = 0;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.hostname === "api.resend.com") { sends++; return Response.json({ id: "mock-email" }); }
    if (url.pathname.endsWith("/agent_events")) {
      if (options?.method === "GET") return Response.json(null);
      writes++;
      const event = JSON.parse(String(options?.body));
      assert.equal(event.payload.meetingId, id);
      assert.equal(event.payload.recipient, "test@example.com");
      assert.equal(event.payload.deliveryStatus, "sent");
      return Response.json({ message: "Storage unavailable" }, { status: 500 });
    }
    return Response.json(url.pathname.endsWith("/leads") ? { id, email: "test@example.com" } : { id, lead_id: id });
  });
  const { POST } = await import("../src/app/api/leads/email/route");
  const response = await POST(new Request("http://localhost/api/leads/email", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId: id, meetingId: id, subject: "Suivi", message: "Merci" }),
  }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).message, /Ne renvoyez pas/);
  assert.equal(sends, 1);
  assert.equal(writes, 1);
});
