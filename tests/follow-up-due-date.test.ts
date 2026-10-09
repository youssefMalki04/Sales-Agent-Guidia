import test from "node:test";
import assert from "node:assert/strict";
import { dueDateState } from "../src/lib/follow-ups/due-date";
const now = Date.parse("2026-09-15T10:00:00Z");
test("past dates require confirmation, future dates do not", () => {
  assert.equal(dueDateState("2000-05-06T09:00:00Z", now), "past");
  assert.equal(dueDateState("2026-09-16T10:00:00Z", now), "future");
  assert.equal(dueDateState("2026-09-15T10:00:00Z", now), "future");
});
test("invalid and missing dates are rejected", () => {
  assert.equal(dueDateState("", now), "invalid");
  assert.equal(dueDateState("invalid", now), "invalid");
});
