import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const leadId = "585099c2-c113-425f-9806-4e7706a6505e";
const meetingId = "585099c2-c113-425f-9806-4e7706a6505f";

test("report history filters both prospect and exact meeting", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("lead_id"), `eq.${leadId}`);
    assert.equal(url.searchParams.get("meeting_id"), `eq.${meetingId}`);
    return Response.json([]);
  });
  const { GET } = await import("../src/app/api/leads/notes/route");
  assert.equal((await GET(new Request(`http://localhost/api/leads/notes?leadId=${leadId}&meetingId=${meetingId}`))).status, 200);
});

test("invalid meeting filter never falls back to all prospect notes", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
  const { GET } = await import("../src/app/api/leads/notes/route");
  for (const value of ["", "invalid"]) assert.equal((await GET(new Request(`http://localhost/api/leads/notes?leadId=${leadId}&meetingId=${value}`))).status, 400);
});

for (const matches of [true, false]) {
  test(`report write verifies meeting's prospect: ${matches}`, async (context) => {
    let writes = 0;
    context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.pathname.endsWith("/meetings")) {
        assert.equal(options?.method, "GET");
        assert.equal(url.searchParams.get("id"), `eq.${meetingId}`);
        return Response.json({ id: meetingId, lead_id: matches ? leadId : "another" });
      }
      assert.ok(url.pathname.endsWith("/lead_notes"));
      assert.equal(options?.method, "POST");
      const body = JSON.parse(String(options?.body));
      assert.equal(body.meeting_id, meetingId);
      assert.equal(body.lead_id, leadId);
      writes++;
      return Response.json({ id: leadId, ...body }, { status: 201 });
    });
    const { POST } = await import("../src/app/api/leads/notes/route");
    const response = await POST(new Request("http://localhost/api/leads/notes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, meetingId, content: "Compte rendu — Démo\nEnvoyer un devis." }),
    }));
    assert.equal(response.status, matches ? 201 : 409);
    assert.equal(writes, matches ? 1 : 0);
  });
}
