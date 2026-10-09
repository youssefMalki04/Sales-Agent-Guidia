import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const id = "585099c2-c113-425f-9806-4e7706a6505e";

test("meeting email reads the exact linked lead contact without writes", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("id"), `eq.${id}`);
    return Response.json({ id, name: "Test", email: "current@example.com", company: null });
  });
  const { GET } = await import("../src/app/api/leads/contact/route");
  const response = await GET(new Request(`http://localhost/api/leads/contact?leadId=${id}`));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).lead.email, "current@example.com");
});

test("changed recipient blocks email before any send or write", async (context) => {
  let calls = 0;
  context.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    calls++;
    assert.equal(options?.method, "GET");
    return Response.json({ id, email: "changed@example.com", name: "Test", company: null });
  });
  const { POST } = await import("../src/app/api/leads/email/route");
  const response = await POST(new Request("http://localhost/api/leads/email", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId: id, expectedEmail: "old@example.com", subject: "Suivi", message: "Merci." }),
  }));
  assert.equal(response.status, 409);
  assert.equal(calls, 1);
});
