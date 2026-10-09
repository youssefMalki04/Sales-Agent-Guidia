import test from "node:test";
import assert from "node:assert/strict";
import { loadLeadsResult } from "../src/app/dashboard/leads/load-leads-result";
import type { LeadRow } from "../src/app/dashboard/leads/leads-types";

test("a connection failure is not mistaken for an empty list", async () => {
  assert.deepEqual(await loadLeadsResult(async () => { throw new TypeError("fetch failed"); }), { ok: false });
  assert.deepEqual(await loadLeadsResult(async () => []), { ok: true, leads: [] });
});
test("a later retry can return leads; errors do not expose raw service messages", async () => {
  const rows = [{ id: "lead" }] as LeadRow[];
  assert.deepEqual(await loadLeadsResult(async () => { throw new Error("private service details"); }), { ok: false });
  assert.deepEqual(await loadLeadsResult(async () => rows), { ok: true, leads: rows });
});
