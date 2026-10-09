import test from "node:test";
import assert from "node:assert/strict";
import { normalizeLeadSort, sortLeads } from "../src/app/dashboard/leads/leads-sort";
import type { LeadRow } from "../src/app/dashboard/leads/leads-types";

const rows = [
  { id: "a", created_at: "2026-01-01", conversion_score: 90 },
  { id: "b", created_at: "2026-03-01", conversion_score: null },
  { id: "c", created_at: "2026-02-01", conversion_score: 0 },
] as LeadRow[];
test("lead sorting preserves input and sorts dates both ways", () => {
  assert.deepEqual(sortLeads(rows, "newest").map(r => r.id), ["b", "c", "a"]);
  assert.deepEqual(sortLeads(rows, "oldest").map(r => r.id), ["a", "c", "b"]);
  assert.deepEqual(rows.map(r => r.id), ["a", "b", "c"]);
});
test("score sorting puts missing scores last; unknown sort defaults to newest", () => {
  assert.deepEqual(sortLeads(rows, "score").map(r => r.id), ["a", "c", "b"]);
  assert.equal(normalizeLeadSort("invalid"), "newest");
  assert.equal(normalizeLeadSort("score"), "score");
});
