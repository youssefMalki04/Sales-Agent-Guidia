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
