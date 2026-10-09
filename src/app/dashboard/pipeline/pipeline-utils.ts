import type { PipelineLead } from "./pipeline-types";

export function isOverdue(lead: PipelineLead, now = new Date()) {
  if (!lead.dueDateValue || lead.stage === "won" || lead.stage === "lost") return false;
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return lead.dueDateValue < today;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
