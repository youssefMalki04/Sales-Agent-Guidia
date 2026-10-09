import test from "node:test";
import assert from "node:assert/strict";
import { meetingReportContent } from "../src/lib/meetings/report";

const meeting = { title: "Démo TechShop", date: "2026-10-01", time: "10:00" };
test("meeting reports include context and preserve multiline notes", () => {
  assert.equal(meetingReportContent(meeting, "  Client intéressé.\nEnvoyer un devis.  "), "Compte rendu — Démo TechShop\nRendez-vous du 2026-10-01 à 10:00\n\nClient intéressé.\nEnvoyer un devis.");
});
test("meeting reports reject empty or oversized content", () => {
  assert.throws(() => meetingReportContent(meeting, " \n "));
  assert.throws(() => meetingReportContent(meeting, "x".repeat(4001)));
  assert.ok(meetingReportContent({ ...meeting, title: "x".repeat(500) }, "x".repeat(4000)).length <= 5000);
});
