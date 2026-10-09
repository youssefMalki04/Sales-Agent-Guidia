import test from "node:test";
import assert from "node:assert/strict";
import { summarizeLeads, type AnalyticsLead } from "../src/lib/analytics/summary";
const lead = (id: string, session_id: string | null, overrides: Partial<AnalyticsLead> = {}): AnalyticsLead => ({ id, session_id, conversion_score: 0, lead_temperature: null, pipeline_stage: "new", created_at: "2026-09-01", ...overrides });
test("analytics deduplicates conversations and conversions", () => {
  const result = summarizeLeads([lead("a", "s1"), lead("b", "s1"), lead("c", "manual-1")], ["s1", "s1", "s2"]);
  assert.equal(result.conversations, 2);
  assert.equal(result.converted, 1);
  assert.equal(result.conversionRate, 50);
  assert.equal(result.sources.reduce((sum, row) => sum + row.total, 0), 3);
});
test("analytics handles unknown sources and distinguishes score from won status", () => {
  const result = summarizeLeads([lead("a", null, { conversion_score: 75 }), lead("b", "", { pipeline_stage: "won" }), lead("c", "manual-2", { lead_temperature: "hot" })], []);
  assert.equal(result.conversionRate, null);
  assert.equal(result.qualified, 2);
  assert.equal(result.won, 1);
  assert.equal(result.sources[2].total, 2);
});
test("empty analytics does not invent activity", () => {
  const result = summarizeLeads([], []);
  assert.equal(result.leads, 0);
  assert.equal(result.conversionRate, null);
  assert.ok(result.sources.every((row) => row.total === 0));
});
