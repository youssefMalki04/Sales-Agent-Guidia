import assert from "node:assert/strict";
import test from "node:test";

import {
  pipelineStageLabel,
  toPipelineStageActivity,
} from "../src/lib/leads/pipeline-stage-history";

const event = {
  id: "stage-event-1",
  event_type: "lead_pipeline_stage_changed",
  created_at: "2026-09-12T11:15:00.000Z",
  payload: { fromStage: "new", toStage: "qualified" },
};

test("l'historique affiche les deux phases et la date enregistrée", () => {
  assert.deepEqual(toPipelineStageActivity(event), {
    id: "event-stage-event-1",
    description: "New → Qualified",
    kind: "pipeline",
    status: "info",
    timestamp: event.created_at,
    title: "Pipeline stage changed",
  });
});

test("l'historique accepte toutes les phases, y compris les retours en arrière", () => {
  const stages = ["new", "qualified", "meeting", "proposal", "won", "lost"];
  for (const fromStage of stages) {
    for (const toStage of stages) {
      const item = toPipelineStageActivity({ ...event, payload: { fromStage, toStage } });
      if (fromStage === toStage) {
        assert.equal(item, null);
      } else {
        assert.equal(item?.description, `${pipelineStageLabel(fromStage)} → ${pipelineStageLabel(toStage)}`);
        // Lost is a commercial phase, not an error saving the change.
        assert.equal(item?.status, "info");
      }
    }
  }
});

test("l'historique ignore les événements sans changement réel ou mal formés", () => {
  for (const payload of [
    null, undefined, [], "new", {},
    { fromStage: "new" },
    { toStage: "qualified" },
    { fromStage: "new", toStage: "new" },
    { fromStage: "unknown", toStage: "qualified" },
    { fromStage: "new", toStage: "unknown" },
    { fromStage: "constructor", toStage: "qualified" },
    { fromStage: 0, toStage: "qualified" },
  ]) {
    assert.equal(toPipelineStageActivity({ ...event, payload }), null);
  }
  assert.equal(toPipelineStageActivity({ ...event, created_at: "invalid" }), null);
});

test("l'historique ne convertit pas les autres événements en changements de phase", () => {
  assert.equal(toPipelineStageActivity({ ...event, event_type: "lead_email_sent" }), null);
});

test("des passages identiques à des dates différentes gardent des identifiants distincts", () => {
  const first = toPipelineStageActivity(event);
  const second = toPipelineStageActivity({ ...event, id: "stage-event-2", created_at: "2026-09-13T11:15:00.000Z" });
  assert.notEqual(first?.id, second?.id);
  assert.notEqual(first?.timestamp, second?.timestamp);
});

test("la fiche mélange les changements de phase aux activités existantes, du plus récent au plus ancien", async (context) => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
  const { supabaseAdmin } = await import("../src/lib/database/supabase-admin");
  const { getLeadDetail } = await import("../src/app/dashboard/leads/lead-detail-data");
  const leadId = "585099c2-c113-425f-9806-4e7706a6505e";
  const sessionId = "session-history-test";
  const lead = {
    id: leadId,
    session_id: sessionId,
    pipeline_stage: "qualified",
    created_at: "2026-09-10T10:00:00.000Z",
    updated_at: event.created_at,
  };
  const emailEvent = {
    id: "email-1",
    event_type: "lead_email_sent",
    payload: { subject: "Suivi", recipient: "test@example.com" },
    created_at: "2026-09-11T10:00:00.000Z",
  };
  const queries: { table: string; field: string; value: unknown }[] = [];
  let events = [event, emailEvent];

  // Replace database access entirely: no request to a real Supabase project.
  context.mock.method(supabaseAdmin, "from", (table: string) => {
    let eventTypes: string[] | undefined;
    const builder = {
      select() { return builder; },
      eq(field: string, value: unknown) {
        queries.push({ table, field, value });
        return builder;
      },
      in(_field: string, values: string[]) { eventTypes = values; return builder; },
      order() { return builder; },
      maybeSingle() { return Promise.resolve({ data: lead, error: null }); },
      then(resolve: (value: { data: unknown[]; error: null }) => unknown) {
        const data = table === "agent_events"
          ? events.filter((item) => !eventTypes || eventTypes.includes(item.event_type))
          : table === "conversations"
            ? [{ id: "message-1", role: "user", message: "Bonjour", created_at: "2026-09-10T10:00:00.000Z" }]
            : [];
        return Promise.resolve({ data, error: null }).then(resolve);
      },
    };
    return builder as unknown as ReturnType<typeof supabaseAdmin.from>;
  });

  const detail = await getLeadDetail(leadId);
  assert.ok(detail);
  assert.deepEqual(detail.activity.map((item) => item.kind), ["pipeline", "email", "conversation"]);
  assert.equal(detail.activity[0].description, "New → Qualified");
  assert.equal(detail.lastActivity, event.created_at);
  assert.equal(detail.emailHistory.length, 1);
  assert.equal(detail.pipelineStage, "qualified");
  for (const query of queries) {
    assert.equal(query.value, query.table === "conversations" ? sessionId : leadId);
    assert.equal(query.field, query.table === "conversations" ? "session_id" : query.table === "leads" ? "id" : "lead_id");
  }

  // Existing leads still render before any stage history has been recorded.
  events = [emailEvent];
  const withoutHistory = await getLeadDetail(leadId);
  assert.deepEqual(withoutHistory?.activity.map((item) => item.kind), ["email", "conversation"]);
  assert.equal(withoutHistory?.lastActivity, lead.updated_at);
});
