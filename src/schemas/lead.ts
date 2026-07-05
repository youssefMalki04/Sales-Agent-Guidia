import { z } from "zod";

const optionalText = z.string().trim().min(1).max(1000).nullable().optional();

export const objectionSchema = z.object({
  category: z.enum([
    "price",
    "security",
    "integration",
    "competitor",
    "timing",
    "human_request",
  ]),
  status: z.enum(["detected", "answered", "needs_follow_up", "resolved"]),
  evidence: z.string().trim().min(1).max(500).optional(),
});

export const leadUpdateSchema = z
  .object({
    name: optionalText,
    email: z.string().trim().email().nullable().optional(),
    company: optionalText,
    country: optionalText,
    sector: optionalText,
    need: optionalText,
    budget: optionalText,
    urgency: optionalText,
    leadTemperature: z.enum(["cold", "warm", "hot"]).nullable().optional(),
    conversionScore: z.number().int().min(0).max(100).nullable().optional(),
    objections: z.array(objectionSchema).nullable().optional(),
    salesSummary: optionalText,
    suggestedNextAction: optionalText,
  })
  .strict();

export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
export type LeadObjection = z.infer<typeof objectionSchema>;

export function parseLeadUpdate(input: unknown) {
  return leadUpdateSchema.safeParse(input);
}

