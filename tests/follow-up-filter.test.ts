import test from "node:test";
import assert from "node:assert/strict";
import { matchesFollowUp } from "../src/app/dashboard/leads/follow-up-filter";
const now = Date.parse("2026-09-15T10:00:00Z");
const tasks = [
  { lead_id: "a", status: "upcoming", due_at: "2026-09-14T10:00:00Z" },
  { lead_id: "b", status: "completed", due_at: "2026-09-14T10:00:00Z" },
  { lead_id: "c", status: "upcoming", due_at: "2026-09-16T10:00:00Z" },
];
test("without follow-up excludes overdue and future pending tasks, not completed tasks", () => {
  assert.equal(matchesFollowUp("a", "none", tasks, now), false);
  assert.equal(matchesFollowUp("c", "none", tasks, now), false);
  assert.equal(matchesFollowUp("b", "none", tasks, now), true);
  assert.equal(matchesFollowUp("missing", "none", tasks, now), true);
});
test("overdue includes only pending tasks strictly before now", () => {
  assert.equal(matchesFollowUp("a", "overdue", tasks, now), true);
  assert.equal(matchesFollowUp("b", "overdue", tasks, now), false);
  assert.equal(matchesFollowUp("c", "overdue", tasks, now), false);
  assert.equal(matchesFollowUp("a", "overdue", tasks, Date.parse(tasks[0].due_at)), false);
  assert.equal(matchesFollowUp("a", "", [], now), true);
});
