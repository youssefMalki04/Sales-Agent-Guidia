import test from "node:test";
import assert from "node:assert/strict";
import { paginateLeads } from "../src/app/dashboard/leads/leads-pagination";

const rows = Array.from({ length: 123 }, (_, i) => i);
test("pagination reaches leads beyond 100 without gaps", () => {
  const result = paginateLeads(rows, "5", "25");
  assert.deepEqual(result.rows, rows.slice(100));
  assert.equal(result.from, 101);
  assert.equal(result.to, 123);
  assert.equal(result.pages, 5);
});
test("page sizes, invalid pages and out-of-range pages are normalized", () => {
  assert.equal(paginateLeads(rows, "2", "50").rows[0], 50);
  for (const invalid of ["-1", "0", "bad", "1.5"]) assert.equal(paginateLeads(rows, invalid).page, 1);
  assert.equal(paginateLeads(rows, "999").page, 5);
  assert.equal(paginateLeads(rows, "1", "100").size, 25);
});
test("empty lists have a valid zero range and no rows", () => {
  const result = paginateLeads([], "8");
  assert.equal(result.page, 1);
  assert.equal(result.pages, 1);
  assert.equal(result.from, 0);
  assert.equal(result.to, 0);
  assert.deepEqual(result.rows, []);
});
