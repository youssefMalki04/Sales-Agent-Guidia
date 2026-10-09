import test from "node:test";
import assert from "node:assert/strict";
import { cleanViewQuery, readLeadViews } from "../src/app/dashboard/leads/saved-view-data";
test("saved views preserve filters and sort but omit pagination and unknown parameters", () => {
  const query = new URLSearchParams(cleanViewQuery("q=Tech&status=qualified&followUp=overdue&sort=score&page=8&pageSize=50&redirect=https://example.com"));
  assert.equal(query.get("followUp"), "overdue");
  assert.equal(query.get("sort"), "score");
  assert.equal(query.get("pageSize"), "50");
  assert.equal(query.has("page"), false);
  assert.equal(query.has("redirect"), false);
});
test("stored views validate structure and tolerate missing storage", () => {
  assert.deepEqual(readLeadViews(null), []);
  assert.deepEqual(readLeadViews('[null,{"id":3}]'), []);
  assert.throws(() => readLeadViews("broken"));
  assert.equal(readLeadViews('[{"id":"1","name":"Hot leads","query":"status=qualified&page=5"}]')[0].query, "status=qualified");
});
