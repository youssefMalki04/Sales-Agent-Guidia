import assert from "node:assert/strict";
import test from "node:test";
import { sameTaskTitle } from "../src/lib/follow-ups/task-title";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const leadId = "585099c2-c113-425f-9806-4e7706a6505e";
const request = () => new Request("http://localhost/api/follow-ups", {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ leadId, title: "  PLANIFIER une démonstration! ", dueAt: "2026-10-01T09:00:00.000Z" }),
});

test("les variantes de casse, accents et ponctuation sont détectées", () => {
  assert.ok(sameTaskTitle("  PLANIFIER une démonstration! ", "Planifier une demonstration."));
  assert.ok(sameTaskTitle("Obtenir l’adresse e-mail", "obtenir l'adresse e mail"));
  assert.ok(sameTaskTitle("إرسال رسالة", "ارسال رسالة"));
  assert.equal(sameTaskTitle("Appeler le client", "Envoyer un email au client"), false);
  assert.equal(sameTaskTitle("Appeler le client 1", "Appeler le client 2"), false);
  assert.equal(sameTaskTitle("!!!", "..."), false);
});

test("un doublon ouvert retourne un avertissement sans écriture ni notification", async (context) => {
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.searchParams.get("lead_id"), `eq.${leadId}`);
    assert.equal(url.searchParams.get("status"), "eq.upcoming");
    assert.equal(url.searchParams.has("due_at"), false);
    assert.equal(url.searchParams.has("assigned_to_email"), false);
    return Response.json([{ id: "existing", title: "Planifier une demonstration.", due_at: "2026-09-01T09:00:00Z" }]);
  });
  const { POST } = await import("../src/app/api/follow-ups/route");
  const response = await POST(request());
  assert.equal(response.status, 409);
  const body = await response.json();
  assert.equal(body.code, "DUPLICATE_OPEN_TASK");
  assert.equal(body.duplicate.id, "existing");
  assert.match(body.error, /déjà en cours/);
});

test("la vérification continue après la première page de tâches", async (context) => {
  let calls = 0;
  context.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    calls++;
    return Response.json(calls === 1
      ? Array.from({ length: 200 }, (_, i) => ({ id: String(i), title: `Autre action ${i}` }))
      : [{ id: "duplicate-page-2", title: "Planifier une démonstration" }]);
  });
  const { POST } = await import("../src/app/api/follow-ups/route");
  assert.equal((await POST(request())).status, 409);
  assert.equal(calls, 2);
});

test("une erreur de vérification ne crée pas de tâche", async (context) => {
  context.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    return Response.json({ code: "TEST", message: "Unavailable" }, { status: 400 });
  });
  const { POST } = await import("../src/app/api/follow-ups/route");
  const response = await POST(request());
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /Impossible de vérifier/);
});

test("sans doublon ouvert, la création conserve les données saisies", async (context) => {
  let writes = 0;
  context.mock.method(globalThis, "fetch", async (_input: unknown, options?: RequestInit) => {
    if (options?.method === "GET") return Response.json([]);
    assert.equal(options?.method, "POST");
    writes++;
    const body = JSON.parse(String(options?.body));
    assert.equal(body.title, "PLANIFIER une démonstration!");
    assert.equal(body.lead_id, leadId);
    // Stop at the insert boundary; do not deliver any real notification.
    return Response.json({ code: "TEST_INSERT", message: "Insert reached" }, { status: 400 });
  });
  const { POST } = await import("../src/app/api/follow-ups/route");
  assert.equal((await (await POST(request())).json()).error, "Insert reached");
  assert.equal(writes, 1);
});
