import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";

test("My Day filtre les prospects sans rappel en base avant la limite de cinq", async (context) => {
  let withoutReminder = true;
  const requests: URL[] = [];
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    requests.push(url);
    const unplanned = url.searchParams.get("select")?.includes("open_follow_ups:");
    const rows = unplanned && withoutReminder ? Array.from({ length: 5 }, (_, index) => ({
      id: `lead-${index}`, name: index ? null : "TechShop contact", email: "test@example.com",
      company: "TechShop", conversion_score: 90 - index, pipeline_stage: "qualified",
    })) : [];
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "content-type": "application/json", "content-range": unplanned && withoutReminder ? "0-4/7" : "*/0" },
    });
  });
  const { GET } = await import("../src/app/api/my-day/route");
  const response = await GET();
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.unplannedLeadCount, 7);
  assert.equal(data.unplannedLeads.length, 5);
  assert.deepEqual(data.unplannedLeads[0], {
    id: "lead-0", name: "TechShop contact", email: "test@example.com",
    company: "TechShop", score: 90, stage: "qualified",
  });
  assert.deepEqual(data.tasks, []);
  assert.deepEqual(data.hotLeads, []);
  assert.deepEqual(data.meetings, []);

  const query = requests.find((url) => url.searchParams.get("select")?.includes("open_follow_ups:"))!.searchParams;
  assert.equal(query.get("pipeline_stage"), "in.(new,qualified,meeting,proposal)");
  assert.equal(query.get("open_follow_ups.status"), "eq.upcoming");
  assert.equal(query.get("open_follow_ups"), "is.null");
  assert.equal(query.get("limit"), "5");
  assert.equal(query.get("order"), "conversion_score.desc,created_at.asc,id.asc");
  assert.equal(query.has("open_follow_ups.assigned_to_email"), false);
  assert.equal(query.has("open_follow_ups.due_at"), false);
  assert.equal(query.has("or"), false);

  // A refresh must use the new server result rather than retain an old list.
  withoutReminder = false;
  const refreshed = await (await GET()).json();
  assert.equal(refreshed.unplannedLeadCount, 0);
  assert.deepEqual(refreshed.unplannedLeads, []);
});

test("My Day ne présente pas une erreur de rappels comme une liste vide réussie", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const unplanned = url.searchParams.get("select")?.includes("open_follow_ups:");
    return new Response(JSON.stringify(unplanned ? { message: "Reminder query failed", code: "TEST" } : []), {
      status: unplanned ? 400 : 200,
      headers: { "content-type": "application/json" },
    });
  });
  const { GET } = await import("../src/app/api/my-day/route");
  const response = await GET();
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { error: "Reminder query failed" });
});
