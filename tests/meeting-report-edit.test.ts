import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const id = "585099c2-c113-425f-9806-4e7706a6505e";

for (const conflict of [false, true]) {
  test(`report edit uses conditional update and handles conflict=${conflict}`, async (context) => {
    context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      assert.equal(url.searchParams.get("id"), `eq.${id}`);
      if (options?.method === "GET") return Response.json({ author_name: "Test", lead_id: id });
      assert.equal(options?.method, "PATCH");
      assert.equal(url.searchParams.get("content"), "eq.Old report");
      const body = JSON.parse(String(options?.body));
      assert.equal(body.content, "Updated report");
      assert.deepEqual(Object.keys(body).sort(), ["content", "updated_at"]);
      return Response.json(conflict ? null : { id, content: body.content, lead_id: id });
    });
    const { PATCH } = await import("../src/app/api/leads/notes/route");
    const response = await PATCH(new Request("http://localhost/api/leads/notes", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: "Updated report", expectedContent: "Old report" }),
    }));
    assert.equal(response.status, conflict ? 409 : 200);
  });
}
