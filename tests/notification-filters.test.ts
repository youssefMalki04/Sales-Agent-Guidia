import { test } from "node:test";
import assert from "node:assert/strict";
import { filterNotifications } from "../src/app/dashboard/notifications/filter-notifications";
import type { NotificationRow } from "../src/app/dashboard/notifications/notification-types";

const rows: NotificationRow[] = [
  { id: "1", title: "Démonstration réservée", message: "TechShop demain", read_at: null, action_url: null, created_at: "", event_type: "meeting", severity: "info", task_id: null },
  { id: "2", title: "Relance", message: "Appeler TechShop", read_at: "2026-09-26", action_url: null, created_at: "", event_type: "follow-up", severity: "info", task_id: null },
];

test("search ignores accents, case and extra spaces across title and message", () => {
  assert.deepEqual(filterNotifications(rows, "all", "  DEMONSTRATION techshop ").map((row) => row.id), ["1"]);
});
test("search combines with unread and does not mutate notifications", () => {
  assert.equal(filterNotifications(rows, "all", "TechShop").length, 2);
  assert.equal(filterNotifications(rows, "unread", "TechShop").length, 1);
  assert.equal(filterNotifications(rows, "all", "missing").length, 0);
  assert.equal(filterNotifications(rows, "all", "   ").length, 2);
  assert.equal(rows.length, 2);
});
