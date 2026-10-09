import test from "node:test";
import assert from "node:assert/strict";
import { availableMeetingSlots } from "../src/lib/meetings/available-slots";

const date = "2026-10-01", now = new Date("2026-09-01T00:00:00Z");
const busy = { id: "meeting", owner: "Yosra", date, time: "10:00", duration: 30, status: "confirmed" };
test("suggestions respect owner, overlaps, duration and business window", () => {
  const slots = availableMeetingSlots(date, "Yosra", 30, [busy], undefined, now);
  assert.equal(slots[0], "09:00");
  assert.equal(slots.at(-1), "17:30");
  for (const time of ["09:45", "10:00", "10:15"]) assert.equal(slots.includes(time), false);
  assert.ok(slots.includes("10:30"));
  assert.ok(availableMeetingSlots(date, "Sami", 30, [busy], undefined, now).includes("10:00"));
  assert.ok(availableMeetingSlots(date, "Yosra", 30, [busy], busy.id, now).includes("10:00"));
  assert.equal(availableMeetingSlots(date, "Yosra", 60, [], undefined, now).at(-1), "17:00");
});
test("suggestions omit past starts, cancelled events and invalid inputs", () => {
  assert.equal(availableMeetingSlots(date, "Yosra", 30, [], undefined, new Date(`${date}T10:00:00`))[0], "10:15");
  assert.ok(availableMeetingSlots(date, "Yosra", 30, [{ ...busy, status: "cancelled" }], undefined, now).includes("10:00"));
  assert.deepEqual(availableMeetingSlots(date, "Yosra", 5, [], undefined, now), []);
  assert.deepEqual(availableMeetingSlots("", "Yosra", 30, [], undefined, now), []);
  assert.deepEqual(availableMeetingSlots(date, "Yosra", 30, [], undefined, new Date(`${date}T18:00:00`)), []);
});
