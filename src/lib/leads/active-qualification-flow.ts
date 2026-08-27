import { supabaseAdmin } from "@/lib/database/supabase-admin";

export type ActiveQualificationFlow = {
  title: string;
  businessGoal: string;
  safetyMode: "guide" | "confirm" | "auto";
  steps: Array<{ title: string; field?: string; required?: boolean; weight?: number }>;
  scoring: { coldMax: number; warmMax: number };
};

export async function getActiveQualificationFlow(): Promise<ActiveQualificationFlow | null> {
  const { data, error } = await supabaseAdmin
    .from("qualification_flows")
    .select("title,business_goal,safety_mode,steps,scoring")
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // The application remains usable before migration 013 is installed.
  if (error) return null;
  if (!data) return null;
  return {
    title: data.title,
    businessGoal: data.business_goal,
    safetyMode: data.safety_mode,
    steps: Array.isArray(data.steps) ? data.steps : [],
    scoring: data.scoring ?? { coldMax: 34, warmMax: 69 },
  } as ActiveQualificationFlow;
}

export function flowPrompt(flow: ActiveQualificationFlow | null) {
  if (!flow) return "";
  const questions = flow.steps.map((step, index) => `${index + 1}. ${step.title} [field=${step.field ?? "need"}, weight=${step.weight ?? 0}, required=${Boolean(step.required)}]`).join("\n");
  return `\nACTIVE QUALIFICATION FLOW: ${flow.title}\nGoal: ${flow.businessGoal}\nQuestions/criteria:\n${questions}\nAsk at most one useful unanswered qualification question per response. Do not repeat information already provided.`;
}
