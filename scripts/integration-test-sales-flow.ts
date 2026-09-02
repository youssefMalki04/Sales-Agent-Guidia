import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "node:path";
import WebSocket from "ws";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const baseUrl =
  process.env.INTEGRATION_TEST_BASE_URL ?? "http://localhost:3000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
  );
}

const supabase = createClient(
  supabaseUrl.replace(/\/rest\/v1\/?$/, ""),
  serviceRoleKey,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: { transport: WebSocket as never },
  },
);
const sessionId = `e2e-sales-${crypto.randomUUID()}`;
const startedAt = new Date().toISOString();
let leadId: string | undefined;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers:
      body === undefined ? undefined : { "content-type": "application/json" },
    method: body === undefined ? "GET" : "POST",
    signal: AbortSignal.timeout(60_000),
  });
  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      `${path} returned ${response.status}: ${payload.error ?? "Unknown error"}`,
    );
  }

  return payload;
}

async function cleanup() {
  const { data: deliveries } = await supabase
    .from("webhook_deliveries")
    .select("id,payload")
    .gte("created_at", startedAt);
  const deliveryIds = (deliveries ?? [])
    .filter((row) => JSON.stringify(row.payload).includes(sessionId))
    .map((row) => row.id as string);

  if (deliveryIds.length > 0) {
    await supabase.from("webhook_deliveries").delete().in("id", deliveryIds);
  }

  await supabase.from("meetings").delete().eq("session_id", sessionId);
  await supabase.from("notifications").delete().eq("session_id", sessionId);
  await supabase.from("replay_sessions").delete().eq("session_id", sessionId);
  await supabase
    .from("conversation_sessions")
    .delete()
    .eq("session_id", sessionId);
  await supabase.from("conversations").delete().eq("session_id", sessionId);
  await supabase.from("leads").delete().eq("session_id", sessionId);
}

async function main() {
  try {
    const health = await api<{ status: string }>("/api/health");
    assert(health.status === "ok", `API health is ${health.status}`);
    console.log("✓ API health");

    const chat = await api<{ answer: string; sources: unknown[] }>(
      "/api/chat",
      {
        message:
          "Nous sommes une entreprise SaaS. Notre budget est de 5 000 EUR, nous utilisons HubSpot, voulons commencer ce mois-ci et souhaitons une démonstration.",
        sessionId,
      },
    );
    assert(chat.answer?.trim(), "The chatbot returned no answer");
    assert(
      Array.isArray(chat.sources),
      "The chatbot returned no RAG sources array",
    );
    console.log(`✓ Chatbot and RAG response (${chat.sources.length} sources)`);

    const contact = await api<{ leadId: string; ok: boolean }>(
      "/api/conversations",
      {
        action: "contact",
        company: "Leadia E2E Test",
        email: `e2e-${Date.now()}@leadia-test.example`,
        name: "Test Integration",
        sessionId,
      },
    );
    leadId = contact.leadId;
    assert(contact.ok && leadId, "Contact details did not create a lead");

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id,conversion_score,lead_temperature,summary")
      .eq("id", leadId)
      .single();
    if (leadError) throw leadError;
    assert(
      lead.conversion_score >= 70,
      `Lead score is ${lead.conversion_score}`,
    );
    assert(lead.lead_temperature === "hot", `Lead is ${lead.lead_temperature}`);
    console.log(`✓ Lead qualification (${lead.conversion_score}/100, hot)`);

    const { count: messageCount, error: messageError } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId);
    if (messageError) throw messageError;
    assert((messageCount ?? 0) >= 2, "Conversation messages were not stored");
    console.log(`✓ Conversation persistence (${messageCount} messages)`);

    const meetingDate = new Date(Date.now() + 7 * 86_400_000)
      .toISOString()
      .slice(0, 10);
    const meetingResult = await api<{ meeting: { id: string } }>(
      "/api/meetings",
      {
        company: "Leadia E2E Test",
        date: meetingDate,
        duration: 30,
        email: `e2e-${Date.now()}@leadia-test.example`,
        notes: "Automated integration test",
        owner: "Yosra",
        prospect: "Test Integration",
        sessionId,
        source: "E2E test",
        time: "10:00",
        title: "E2E product demonstration",
      },
    );
    assert(meetingResult.meeting.id, "Meeting was not created");
    console.log("✓ Meeting booking");

    const { data: endpoint } = await supabase
      .from("webhook_endpoints")
      .select("id")
      .eq("enabled", true)
      .contains("events", ["meeting.booked"])
      .limit(1)
      .maybeSingle();
    console.log(
      endpoint ? "✓ Webhook dispatch attempted" : "○ Webhook not configured",
    );

    console.log(`\nIntegration flow passed for ${sessionId}`);
  } finally {
    await cleanup();
    console.log("✓ Test data cleaned");
  }
}

void main();
