import { supabaseAdmin } from "@/lib/database/supabase-admin";
import { parseLeadUpdate, type LeadUpdate } from "@/lib/schemas/lead";

type ValidationContext = {
  leadId?: string;
  sessionId?: string;
};

type ValidationSuccess = {
  ok: true;
  data: LeadUpdate;
};

type ValidationFailure = {
  ok: false;
  data: null;
  visitorReply: string;
  event: {
    lead_id?: string;
    event_type: "lead_update_validation_failed";
    payload: {
      session_id?: string;
      issues: unknown;
      raw_payload: unknown;
    };
  };
};

export function validateLeadUpdate(input: unknown, context: ValidationContext = {}): ValidationSuccess | ValidationFailure {
  const parsed = parseLeadUpdate(input);

  if (parsed.success) {
    return {
      ok: true,
      data: parsed.data,
    };
  }

  return {
    ok: false,
    data: null,
    visitorReply:
      "Je peux continuer la discussion, mais je dois confirmer quelques informations avant de creer une fiche lead complete.",
    event: {
      lead_id: context.leadId,
      event_type: "lead_update_validation_failed",
      payload: {
        session_id: context.sessionId,
        issues: parsed.error.issues,
        raw_payload: input,
      },
    },
  };
}

export async function logLeadUpdateValidationFailed(event: ValidationFailure["event"]) {
  const { error } = await supabaseAdmin.from("agent_events").insert({
    lead_id: event.lead_id,
    event_type: event.event_type,
    payload: event.payload,
  });

  if (error) {
    console.error("Failed to log lead update validation error", error);
  }
}

