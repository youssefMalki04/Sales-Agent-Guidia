import assert from "node:assert/strict";
import test from "node:test";

test("GET /api/team renvoie la liste des membres", async () => {
  const { GET } = await import("../src/app/api/team/route");
  const response = await GET(
    new Request("http://localhost/api/team"),
  );

  assert.equal(response.status, 200);
  const body = (await response.json()) as { members?: unknown[] };
  assert.ok(Array.isArray(body.members));
});

test("POST /api/team crée un membre à partir d’un email", async () => {
  const { POST } = await import("../src/app/api/team/route");
  const response = await POST(
    new Request("http://localhost/api/team", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: "new.member@leadia.ai",
        name: "New Member",
        role: "sales",
      }),
    }),
  );

  assert.equal(response.status, 201);
  const body = (await response.json()) as { member?: { email?: string } };
  assert.equal(body.member?.email, "new.member@leadia.ai");
});
