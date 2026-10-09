import test from "node:test";
import assert from "node:assert/strict";
import { analyticsTrend } from "../src/lib/analytics/trend";
test("daily series fills empty days and deduplicates sessions within each day", () => {
  const result = analyticsTrend("2026-09-01T00:00:00Z", "2026-09-04T00:00:00Z", [
    { session_id: "s1", created_at: "2026-09-01T08:00:00Z" },
    { session_id: "s1", created_at: "2026-09-01T09:00:00Z" },
    { session_id: "s1", created_at: "2026-09-03T09:00:00Z" },
  ], [{ created_at: "2026-09-03T09:00:00Z" }], [{ created_at: "2026-09-01T09:00:00Z" }]);
  assert.deepEqual(result.map((row) => row.conversations), [1, 0, 1]);
  assert.equal(result[1].leads, 0);
  assert.equal(result[2].leads, 1);
  assert.equal(result[0].meetings, 1);
});
test("UTC buckets respect partial and exclusive interval boundaries", () => {
  const result = analyticsTrend("2026-12-31T12:00:00Z", "2027-01-01T12:00:00Z", [], [
    { created_at: "2026-12-31T11:59:59Z" },
    { created_at: "2027-01-01T01:00:00+02:00" },
    { created_at: "2027-01-01T12:00:00Z" },
  ], []);
  assert.deepEqual(result.map((row) => row.leads), [1, 0]);
  assert.deepEqual(analyticsTrend("invalid", "invalid", [], [], []), []);
});
