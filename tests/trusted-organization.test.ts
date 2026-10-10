import assert from "node:assert/strict";
import test from "node:test";
import { trustedOrganizationId } from "../src/lib/auth/trusted-organization";

test("organization scope comes from server-managed metadata", () => {
  assert.equal(trustedOrganizationId({ organization_id: " company-a " }), "company-a");
});

test("missing or malformed trusted scope cannot grant organization access", () => {
  for (const metadata of [undefined, {}, { organization_id: "" }, { organization_id: " " }, { organization_id: 123 }]) {
    assert.equal(trustedOrganizationId(metadata), null);
  }
});
