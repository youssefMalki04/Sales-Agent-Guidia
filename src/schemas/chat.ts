import { z } from "zod";

export const chatRequestSchema = z
  .object({
    sessionId: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(4000),
    agentSlug: z.string().trim().min(1).max(200),
  })
  .strict();

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export function parseChatRequest(input: unknown) {
  return chatRequestSchema.safeParse(input);
}