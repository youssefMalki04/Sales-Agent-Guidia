import test from "node:test";
import assert from "node:assert/strict";
import { addMeetingDays, localMeetingDate, meetingMonthRange } from "../src/lib/meetings/dates";

test("le report traverse les fins de mois et d’année", () => {
  assert.equal(addMeetingDays("2026-01-28", 7), "2026-02-04");
  assert.equal(addMeetingDays("2026-12-28", 7), "2027-01-04");
  assert.equal(addMeetingDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addMeetingDays("2026-02-28", 1), "2026-03-01");
});
test("les dates impossibles sont refusées", () => {
  assert.throws(() => addMeetingDays("2026-02-30", 7));
  assert.throws(() => addMeetingDays("invalid", 7));
});
test("la période conserve les dates locales du mois", () => {
  assert.deepEqual(meetingMonthRange(new Date(2028, 1, 20)), { from: "2028-02-01", to: "2028-02-29" });
  assert.equal(localMeetingDate(new Date(2026, 0, 1, 0, 30)), "2026-01-01");
});
