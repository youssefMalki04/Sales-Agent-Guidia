import { GoogleGenAI } from "@google/genai";

const EMBEDDING_MODELS = ["text-embedding-004", "gemini-embedding-001"] as const;
const EMBEDDING_DIMENSIONS = 768;

const geminiApiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY");
}

const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

export function toEmbeddingLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

export async function generateQueryEmbedding(query: string) {
  let lastError: unknown;

  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await genAI.models.embedContent({
        model,
        contents: [query],
        config: {
          taskType: "RETRIEVAL_QUERY",
          outputDimensionality: EMBEDDING_DIMENSIONS,
        },
      });

      const values = response.embeddings?.[0]?.values ?? [];

      if (values.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(
          `Query embedding has ${values.length} dimensions, expected ${EMBEDDING_DIMENSIONS}`,
        );
      }

      return values;
    } catch (error) {
      lastError = error;

      const isNotFoundError =
        error instanceof Error &&
        /not found|not supported/i.test(error.message);

      if (!isNotFoundError || model === EMBEDDING_MODELS[EMBEDDING_MODELS.length - 1]) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Embedding generation failed");
}
