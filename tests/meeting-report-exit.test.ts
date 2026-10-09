import test from "node:test";
import assert from "node:assert/strict";
import { canLeaveMeetingReport } from "../src/lib/meetings/report-exit";

test("empty or successfully saved report closes without confirmation", () => {
  assert.equal(canLeaveMeetingReport({ dirty: false, saving: false }, () => { throw new Error("Unexpected confirmation"); }), true);
});
test("declining discard preserves the report by refusing exit", () => {
  let asked = false;
  assert.equal(canLeaveMeetingReport({ dirty: true, saving: false }, (message) => { asked = true; assert.match(message, /pas enregistré/); return false; }), false);
  assert.ok(asked);
});
test("explicit discard allows exit", () => {
  assert.equal(canLeaveMeetingReport({ dirty: true, saving: false }, () => true), true);
});
test("an in-flight save blocks exit even if discard would be accepted", () => {
  assert.equal(canLeaveMeetingReport({ dirty: true, saving: true }, () => { throw new Error("Unexpected confirmation"); }), false);
});
