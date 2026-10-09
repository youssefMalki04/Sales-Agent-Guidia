import test from "node:test";
import assert from "node:assert/strict";
import { savedMeetingReports } from "../src/lib/meetings/report-history";

const report = { id: "one", content: "Compte rendu — Démo\nRendez-vous du 2026-09-22\n\nSuite", createdAt: "2026-09-22T10:00:00Z", authorName: "Leadia team" };
test("report history excludes ordinary notes and malformed entries", () => {
  assert.deepEqual(savedMeetingReports([null, {}, report, { ...report, content: "Note commerciale" }, { ...report, createdAt: "invalid" }]), [report]);
});
test("report history orders by saved date, not pinned order, without changing input", () => {
  const recent = { ...report, id: "two", createdAt: "2026-09-23T10:00:00Z" };
  const notes = [report, recent];
  assert.deepEqual(savedMeetingReports(notes), [recent, report]);
  assert.deepEqual(notes, [report, recent]);
});
test("empty history is supported and full multiline content is preserved", () => {
  assert.deepEqual(savedMeetingReports([]), []);
  assert.equal(savedMeetingReports([report])[0].content, report.content);
});
