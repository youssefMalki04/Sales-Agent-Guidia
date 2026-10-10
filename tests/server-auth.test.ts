import assert from "node:assert/strict";
import test from "node:test";

import { getServerAuthContext, requireServerAuth } from "../src/lib/auth/server-auth";

test("getServerAuthContext refuse les requêtes sans jeton en production", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  Object.assign(process.env, { NODE_ENV: "production" });
  delete process.env.REQUIRE_SERVER_AUTH;

  const ctx = await getServerAuthContext(
    new Request("http://localhost/api/leads"),
  );

  assert.equal(ctx.isAuthenticated, false);
  assert.equal(ctx.userId, null);
});

test("requireServerAuth bloque les requêtes non authentifiées en production", async (t) => {
  const previous = { ...process.env };
  t.after(() => { process.env = previous; });
  Object.assign(process.env, { NODE_ENV: "production" });
  delete process.env.REQUIRE_SERVER_AUTH;

  const result = await requireServerAuth(
    new Request("http://localhost/api/leads"),
    { requireOrg: true },
  );

  assert.equal(result.ok, false);
  assert.equal(result.response.status, 401);
});
