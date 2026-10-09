import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
process.env.GOOGLE_API_KEY ??= "test-google-api-key";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

function invalidJsonRequest(url: string) {
  return new Request(url, {
    body: "{invalid-json",
    headers: { "content-type": "application/json" },
    method: "POST",
  });
}

async function responseBody(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

test("GET /api/health expose l'état de la configuration", async () => {
  const { GET } = await import("../src/app/api/health/route");
  const response = await GET();
  const body = await responseBody(response);

  assert.equal(response.status, 200);
  assert.ok(["ok", "missing_required_config"].includes(String(body.status)));
  assert.equal(typeof body.checks, "object");
});

test("POST /api/chat refuse un JSON invalide", async () => {
  const { POST } = await import("../src/app/api/chat/route");
  const response = await POST(invalidJsonRequest("http://localhost/api/chat"));

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid JSON body",
  });
});

test("POST /api/chat exige un message et une session valides", async () => {
  const { POST } = await import("../src/app/api/chat/route");
  const response = await POST(
    jsonRequest("http://localhost/api/chat", {
      message: " ",
      sessionId: "",
    }),
  );
  const body = await responseBody(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Invalid chat data");
  assert.equal(typeof body.issues, "object");
});

test("POST /api/conversations refuse une action inconnue", async () => {
  const { POST } = await import("../src/app/api/conversations/route");
  const response = await POST(
    jsonRequest("http://localhost/api/conversations", {
      action: "delete-everything",
    }),
  );
  const body = await responseBody(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Invalid conversation data");
});

test("POST /api/conversations valide les coordonnées du contact", async () => {
  const { POST } = await import("../src/app/api/conversations/route");
  const response = await POST(
    jsonRequest("http://localhost/api/conversations", {
      action: "contact",
      email: "adresse-invalide",
      name: "",
      sessionId: "session-test",
    }),
  );

  assert.equal(response.status, 400);
  assert.equal(
    (await responseBody(response)).error,
    "Invalid conversation data",
  );
});

test("POST /api/rag/search exige une requête non vide", async () => {
  const { POST } = await import("../src/app/api/rag/search/route");
  const response = await POST(
    jsonRequest("http://localhost/api/rag/search", { query: " " }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Missing query" });
});

test("POST /api/leads valide les données commerciales", async () => {
  const { POST } = await import("../src/app/api/leads/route");
  const response = await POST(
    jsonRequest("http://localhost/api/leads", {
      email: "adresse-invalide",
      name: "",
      status: "unknown",
    }),
  );

  assert.equal(response.status, 400);
  assert.equal((await responseBody(response)).error, "Invalid lead data");
});

test("POST /api/leads/email/generate valide la langue et le lead", async () => {
  const { POST } = await import("../src/app/api/leads/email/generate/route");
  const response = await POST(
    jsonRequest("http://localhost/api/leads/email/generate", {
      language: "de",
      leadId: "not-a-uuid",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid generation request",
  });
});

test("DELETE /api/leads refuse un identifiant non UUID", async () => {
  const { DELETE } = await import("../src/app/api/leads/route");
  const response = await DELETE(
    new Request("http://localhost/api/leads?id=ID_DU_LEAD", {
      method: "DELETE",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid lead id",
  });
});

test("POST /api/leads/notes valide le contenu et le lead", async () => {
  const { POST } = await import("../src/app/api/leads/notes/route");
  const response = await POST(
    jsonRequest("http://localhost/api/leads/notes", {
      content: " ",
      leadId: "invalid",
    }),
  );
  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid lead note" });
});

test("POST /api/leads/notes valide les membres mentionnés", async () => {
  const { POST } = await import("../src/app/api/leads/notes/route");
  const response = await POST(
    jsonRequest("http://localhost/api/leads/notes", {
      content: "@Sami merci de vérifier",
      leadId: "585099c2-c113-425f-9806-4e7706a6505e",
      mentionedMembers: [{ email: "adresse-invalide", name: "Sami" }],
    }),
  );
  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid lead note" });
});

test("GET /api/leads/notes/attachments exige un lead UUID", async () => {
  const { GET } = await import("../src/app/api/leads/notes/attachments/route");
  const response = await GET(
    new Request("http://localhost/api/leads/notes/attachments?leadId=invalid"),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid lead id" });
});

test("GET /api/leads/notes/attachments valide le téléchargement", async () => {
  const { GET } = await import("../src/app/api/leads/notes/attachments/route");
  const response = await GET(
    new Request("http://localhost/api/leads/notes/attachments?action=download&id=invalid"),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid attachment id" });
});

test("POST /api/leads/notes/summary exige un lead UUID", async () => {
  const { POST } = await import("../src/app/api/leads/notes/summary/route");
  const response = await POST(
    jsonRequest("http://localhost/api/leads/notes/summary", { leadId: "invalid" }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid summary request" });
});

test("PUT /api/leads/notes/summary valide le résumé", async () => {
  const { PUT } = await import("../src/app/api/leads/notes/summary/route");
  const response = await PUT(
    new Request("http://localhost/api/leads/notes/summary", {
      body: JSON.stringify({ leadId: "invalid", source: "ai", summary: {} }),
      headers: { "content-type": "application/json" },
      method: "PUT",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid summary" });
});

test("DELETE /api/leads/notes/summary valide les identifiants", async () => {
  const { DELETE } = await import("../src/app/api/leads/notes/summary/route");
  const response = await DELETE(
    new Request("http://localhost/api/leads/notes/summary?id=invalid&leadId=invalid", {
      method: "DELETE",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid saved summary" });
});

test("POST /api/meetings valide date, heure et durée", async () => {
  const { POST } = await import("../src/app/api/meetings/route");
  const response = await POST(
    jsonRequest("http://localhost/api/meetings", {
      date: "date-invalide",
      duration: 25,
      prospect: "Prospect Test",
      time: "29:90",
      title: "Démonstration",
    }),
  );

  assert.equal(response.status, 400);
  assert.equal((await responseBody(response)).error, "Invalid meeting");
});

test("POST /api/follow-ups valide le rappel", async () => {
  const { POST } = await import("../src/app/api/follow-ups/route");
  const response = await POST(
    jsonRequest("http://localhost/api/follow-ups", {
      dueAt: "date-invalide",
      leadId: "not-a-uuid",
      title: "",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid follow-up reminder",
  });
});

test("PATCH /api/follow-ups valide le statut et l'identifiant", async () => {
  const { PATCH } = await import("../src/app/api/follow-ups/route");
  const response = await PATCH(
    new Request("http://localhost/api/follow-ups", {
      body: JSON.stringify({ id: "not-a-uuid", status: "cancelled" }),
      headers: { "content-type": "application/json" },
      method: "PATCH",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid follow-up update",
  });
});

test("DELETE /api/follow-ups refuse un identifiant non UUID", async () => {
  const { DELETE } = await import("../src/app/api/follow-ups/route");
  const response = await DELETE(
    new Request("http://localhost/api/follow-ups?id=invalid", {
      method: "DELETE",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid follow-up id",
  });
});

test("GET /api/follow-ups/activity refuse un identifiant non UUID", async () => {
  const { GET } = await import("../src/app/api/follow-ups/activity/route");
  const response = await GET(
    new Request("http://localhost/api/follow-ups/activity?id=invalid"),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "Invalid task id" });
});

test("POST /api/follow-ups/activity exige un commentaire valide", async () => {
  const { POST } = await import("../src/app/api/follow-ups/activity/route");
  const response = await POST(
    jsonRequest("http://localhost/api/follow-ups/activity", {
      id: "not-a-uuid",
      message: " ",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid task comment",
  });
});

test("GET /api/cron/follow-ups protège le traitement par secret", async () => {
  const previousSecret = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "test-cron-secret";
  const { GET } = await import("../src/app/api/cron/follow-ups/route");
  const response = await GET(
    new Request("http://localhost/api/cron/follow-ups"),
  );

  assert.equal(response.status, 401);
  assert.deepEqual(await responseBody(response), { error: "Unauthorized" });
  if (previousSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = previousSecret;
});

test("PATCH /api/notifications valide le report d'une tâche", async () => {
  const { PATCH } = await import("../src/app/api/notifications/route");
  const response = await PATCH(
    new Request("http://localhost/api/notifications", {
      body: JSON.stringify({
        action: "snooze",
        id: "invalid",
        snoozeUntil: "not-a-date",
        taskId: "invalid",
      }),
      headers: { "content-type": "application/json" },
      method: "PATCH",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: "Invalid notification action",
  });
});
