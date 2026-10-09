import test from "node:test";
import assert from "node:assert/strict";
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";

test("lead meetings are filtered by exact ID without writes", async (context) => {
  const id = "585099c2-c113-425f-9806-4e7706a6505e";
  let calls = 0;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    calls++;
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("lead_id"), `eq.${id}`);
    return Response.json([]);
  });
  const { GET } = await import("../src/app/api/meetings/route");
  const response = await GET(new Request(`http://localhost/api/meetings?leadId=${id}`));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).meetings, []);
  assert.equal(calls, 1);
});
test("invalid lead filter is rejected without falling back to all meetings", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
  const { GET } = await import("../src/app/api/meetings/route");
  for (const value of ["", "invalid"]) assert.equal((await GET(new Request(`http://localhost/api/meetings?leadId=${value}`))).status, 400);
});
