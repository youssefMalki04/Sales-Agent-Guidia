import test from "node:test";
import assert from "node:assert/strict";
import { overlapsMeeting } from "../src/lib/meetings/conflicts";
const slot = { id: "a", owner: "Yosra", date: "2026-10-01", time: "10:00", duration: 30, status: "pending" };
test("conflicts detect overlaps but allow adjacent meetings and other owners", () => {
  assert.equal(overlapsMeeting(slot, { ...slot, id: "b", time: "10:15" }), true);
  assert.equal(overlapsMeeting(slot, { ...slot, id: "b", time: "09:45", duration: 60 }), true);
  assert.equal(overlapsMeeting(slot, { ...slot, id: "b", time: "10:30" }), false);
  assert.equal(overlapsMeeting(slot, { ...slot, id: "b", owner: "Sami" }), false);
  assert.equal(overlapsMeeting(slot, { ...slot, id: "b", owner: " yosra " }), true);
  assert.equal(overlapsMeeting(slot, slot), false);
  for (const status of ["cancelled", "completed"]) assert.equal(overlapsMeeting(slot, { ...slot, id: "b", status }), false);
});
test("conflicts cover meetings crossing midnight", () => {
  assert.equal(overlapsMeeting({ ...slot, time: "23:45" }, { ...slot, id: "b", date: "2026-10-02", time: "00:00" }), true);
});
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
test("creation and modification return conflict without writing", async (context) => {
  context.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const row = { id: "b", owner: "Yosra", scheduled_date: slot.date, scheduled_time: "10:15:00", duration: 30, status: "pending" };
    const url = String(_input);
    return Response.json(url.includes("id=eq.") ? { ...row, id: "585099c2-c113-425f-9806-4e7706a6505e", scheduled_time: "09:00:00" } : [row]);
  });
  const { POST, PATCH } = await import("../src/app/api/meetings/route");
  const body = { title: "Demo", prospect: "Test", owner: slot.owner, date: slot.date, time: slot.time, duration: 30 };
  const create = await POST(new Request("http://localhost/api/meetings", { method: "POST", body: JSON.stringify(body) }));
  assert.equal(create.status, 409);
  const update = await PATCH(new Request("http://localhost/api/meetings", { method: "PATCH", body: JSON.stringify({ id: "585099c2-c113-425f-9806-4e7706a6505e", time: "10:00" }) }));
  assert.equal(update.status, 409);
});
