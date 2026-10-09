const stageLabels: Record<string, string> = {
  new: "New",
  qualified: "Qualified",
  meeting: "Meeting",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export function pipelineStageLabel(value: string) {
  return Object.hasOwn(stageLabels, value) ? stageLabels[value] : value;
}

export function toPipelineStageActivity(event: {
  id: string;
  event_type: string;
  payload: unknown;
  created_at: string;
}) {
  if (
    event.event_type !== "lead_pipeline_stage_changed" ||
    !event.payload ||
    typeof event.payload !== "object" ||
    Array.isArray(event.payload) ||
    !Number.isFinite(Date.parse(event.created_at))
  ) {
    return null;
  }

  const { fromStage, toStage } = event.payload as Record<string, unknown>;
  if (
    typeof fromStage !== "string" ||
    typeof toStage !== "string" ||
    !Object.hasOwn(stageLabels, fromStage) ||
    !Object.hasOwn(stageLabels, toStage) ||
    fromStage === toStage
  ) {
    return null;
  }

  return {
    description: `${pipelineStageLabel(fromStage)} → ${pipelineStageLabel(toStage)}`,
    id: `event-${event.id}`,
    kind: "pipeline" as const,
    status: "info" as const,
    timestamp: event.created_at,
    title: "Pipeline stage changed",
  };
}
