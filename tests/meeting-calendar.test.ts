import test from "node:test";
import assert from "node:assert/strict";
import { meetingCalendarFile } from "../src/lib/meetings/calendar-export";

const meeting = { id: "test-123", title: "Démo, client; test", date: "2026-10-01", time: "23:45", duration: 30, prospect: "Client", company: "Tech", notes: "Ligne 1\nLigne 2", status: "confirmed", videoUrl: "https://meet.google.com/abc" };
test("calendar reminders use display alarms only for supported offsets", () => {
  for (const minutes of [15, 30, 60]) {
    const file = meetingCalendarFile(meeting, new Date(), minutes);
    assert.ok(file.includes(`BEGIN:VALARM\r\nTRIGGER:-PT${minutes}M\r\nACTION:DISPLAY\r\n`));
    assert.ok(file.indexOf("END:VALARM") < file.indexOf("END:VEVENT"));
    assert.equal(file.includes("ACTION:EMAIL"), false);
  }
  assert.equal(meetingCalendarFile(meeting).includes("VALARM"), false);
  for (const status of ["cancelled", "completed"]) assert.equal(meetingCalendarFile({ ...meeting, status }, new Date(), 30).includes("VALARM"), false);
  assert.throws(() => meetingCalendarFile(meeting, new Date(), -15));
  assert.throws(() => meetingCalendarFile(meeting, new Date(), 5));
});
test("calendar export contains UTC times, duration, stable ID and video link without invitations", () => {
  const file = meetingCalendarFile(meeting);
  const start = new Date(`${meeting.date}T${meeting.time}:00`);
  const format = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.000Z$/, "Z");
  assert.ok(file.includes(`DTSTART:${format(start)}`));
  assert.ok(file.includes(`DTEND:${format(new Date(start.getTime() + 1800000))}`));
  assert.ok(file.includes("UID:test-123@leadia"));
  assert.ok(file.includes("URL:https://meet.google.com/abc"));
  assert.ok(file.includes("SUMMARY:Démo\\, client\\; test"));
  assert.equal(/ATTENDEE|ORGANIZER|METHOD:REQUEST/.test(file), false);
});
test("calendar text is escaped and folded without splitting unicode", () => {
  const title = "é😀".repeat(100) + "\r\nATTENDEE:bad";
  const file = meetingCalendarFile({ ...meeting, title });
  for (const line of file.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = file.replace(/\r\n /g, "");
  assert.ok(unfolded.includes("SUMMARY:" + title.replace(/\r\n/g, "\\n")));
  assert.equal(file.includes("\r\nATTENDEE:"), false);
  assert.throws(() => meetingCalendarFile({ ...meeting, time: "25:00" }));
});
