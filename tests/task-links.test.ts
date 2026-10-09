import assert from "node:assert/strict";
import test from "node:test";
import { duplicateTaskId } from "../src/components/leadia/duplicate-task-link";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
const taskId = "585099c2-c113-425f-9806-4e7706a6505e";

test("le lien est proposé uniquement pour un doublon avec un identifiant valide", () => {
  assert.equal(duplicateTaskId({ code: "DUPLICATE_OPEN_TASK", duplicate: { id: taskId } }), taskId);
  assert.equal(duplicateTaskId({ error: "Other error" }), null);
  assert.equal(duplicateTaskId({ code: "DUPLICATE_OPEN_TASK" }), null);
  assert.equal(duplicateTaskId({ code: "DUPLICATE_OPEN_TASK", duplicate: { id: "bad&id=other" } }), null);
});

test("le chargement ciblé filtre exactement la tâche demandée, sans écrire", async (context) => {
  let queries = 0;
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, options?: RequestInit) => {
    assert.equal(options?.method, "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.pathname.endsWith("follow_up_reminders")) {
      queries++;
      assert.equal(url.searchParams.get("id"), `eq.${taskId}`);
      return Response.json([{ id: taskId, lead_id: taskId, title: "Appeler le client", status: "upcoming" }]);
    }
    return Response.json([]);
  });
  const { GET } = await import("../src/app/api/follow-ups/route");
  const response = await GET(new Request(`http://localhost/api/follow-ups?taskId=${taskId}`));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reminders[0].id, taskId);
  assert.equal(queries, 1);
});

test("un identifiant invalide est refusé avant tout accès réseau", async (context) => {
  context.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
  const { GET } = await import("../src/app/api/follow-ups/route");
  assert.equal((await GET(new Request("http://localhost/api/follow-ups?taskId=invalid"))).status, 400);
});

test("une tâche supprimée renvoie une liste vide pour permettre un message explicite", async (context) => {
  context.mock.method(globalThis, "fetch", async () => Response.json([]));
  const { GET } = await import("../src/app/api/follow-ups/route");
  const response = await GET(new Request(`http://localhost/api/follow-ups?taskId=${taskId}`));
  assert.deepEqual((await response.json()).reminders, []);
});
