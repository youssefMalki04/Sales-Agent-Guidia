import assert from "node:assert/strict";
import test from "node:test";
import { safeMeetingUrl } from "../src/lib/meetings/video-url";

test("meeting links accept only web URLs without embedded credentials", () => {
  assert.equal(safeMeetingUrl(" https://meet.google.com/abc-defg-hij "), "https://meet.google.com/abc-defg-hij");
  for (const value of [null, "", "not a url", "javascript:alert(1)", "data:text/html,test", "https://user:password@example.com"]) {
    assert.equal(safeMeetingUrl(value), null);
  }
});

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";

test("meeting creation rejects unsafe links and invalid lead IDs before any database write", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
  const { POST } = await import("../src/app/api/meetings/route");
  const valid = { prospect: "Test prospect", title: "Demo", date: "2026-10-01", time: "10:00", duration: 30 };
  for (const extra of [{ videoUrl: "javascript:alert(1)" }, { leadId: "invalid" }]) {
    const response = await POST(new Request("http://localhost/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...valid, ...extra }) }));
    assert.equal(response.status, 400);
  }
});

test("meeting editing validates title, lead and video URL before writing", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
  const { PATCH } = await import("../src/app/api/meetings/route");
  for (const extra of [{ title: " " }, { videoUrl: "javascript:alert(1)" }, { leadId: "invalid" }]) {
    const response = await PATCH(new Request("http://localhost/api/meetings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: "585099c2-c113-425f-9806-4e7706a6505e", ...extra }) }));
    assert.equal(response.status, 400);
  }
});
