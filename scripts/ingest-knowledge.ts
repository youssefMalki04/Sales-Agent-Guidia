import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

type KnowledgeFile = {
  relativePath: string;
  title: string;
  category: string;
  language: string;
  content: string;
};

type KnowledgeChunk = {
  content: string;
  tokenStart: number;
  tokenEnd: number;
  tokenCount: number;
};

const SUPPORTED_EXTENSIONS = new Set([".md", ".mdx", ".txt"]);
const DEFAULT_SOURCE_DIR = "knowledge";
const MIN_CHUNK_TOKENS = 500;
const MAX_CHUNK_TOKENS = 800;
const TARGET_CHUNK_TOKENS = 700;
const OVERLAP_TOKENS = 100;
const EMBEDDING_MODELS = ["text-embedding-004", "gemini-embedding-001"] as const;
const EMBEDDING_DIMENSIONS = 768;
const EMBEDDING_BATCH_SIZE = 10;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

function normalizeSupabaseUrl(url: string) {
  return url.replace(/\/rest\/v1\/?$/, "");
}

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

if (!geminiApiKey) {
  throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY");
}

const supabase = createClient(normalizeSupabaseUrl(supabaseUrl), supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket as never,
  },
});

const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

function getSourceDir() {
  const sourceArgIndex = process.argv.findIndex((arg) => arg === "--source");
  const sourceArg = sourceArgIndex >= 0 ? process.argv[sourceArgIndex + 1] : undefined;

  return path.resolve(process.cwd(), sourceArg ?? DEFAULT_SOURCE_DIR);
}

async function listKnowledgeFiles(sourceDir: string): Promise<string[]> {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        return listKnowledgeFiles(entryPath);
      }

      if (!entry.isFile() || !SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
        return [];
      }

      return [entryPath];
    }),
  );

  return files.flat().sort();
}

function toTitle(filePath: string) {
  const basename = path.basename(filePath, path.extname(filePath));

  return basename
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferCategory(relativePath: string) {
  const normalizedPath = relativePath.replace(/\\/g, "/").toLowerCase();
  const filename = path.basename(normalizedPath, path.extname(normalizedPath));

  const categoryByFilename: Record<string, string> = {
    "doc1-page-accueil-guidia": "presentation",
    "doc2-pages-produits-guidia": "presentation",
    "doc3-cas-usages-guidia": "cas_usage",
    "doc4-fonctionnalites-guidia": "fonctionnalites",
    "doc5-documentation-technique-guidia": "technique",
    "doc6-abonnements-tarifs-guidia": "pricing",
    "doc7-strategie-vente-agent-sales-guidia": "strategie_vente",
    "guidia-sales-playbook-core-pgvector": "strategie_vente",
  };

  if (filename in categoryByFilename) {
    return categoryByFilename[filename];
  }

  const firstFolder = normalizedPath.split("/")[0];

  if (firstFolder && firstFolder !== path.basename(normalizedPath)) {
    return firstFolder;
  }

  return filename.split(/[-_ ]+/)[0] || "general";
}

function normalizeContent(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tokenize(content: string) {
  return content.match(/\S+/g) ?? [];
}

function chunkContent(content: string): KnowledgeChunk[] {
  const tokens = tokenize(content);

  if (tokens.length === 0) {
    return [];
  }

  if (tokens.length <= MAX_CHUNK_TOKENS) {
    return [
      {
        content: tokens.join(" "),
        tokenStart: 0,
        tokenEnd: tokens.length,
        tokenCount: tokens.length,
      },
    ];
  }

  const chunks: KnowledgeChunk[] = [];
  let start = 0;

  while (start < tokens.length) {
    let end = Math.min(start + TARGET_CHUNK_TOKENS, tokens.length);
    const remainingTokens = tokens.length - end;

    if (remainingTokens > 0 && remainingTokens < MIN_CHUNK_TOKENS) {
      end = Math.min(start + MAX_CHUNK_TOKENS, tokens.length);
    }

    chunks.push({
      content: tokens.slice(start, end).join(" "),
      tokenStart: start,
      tokenEnd: end,
      tokenCount: end - start,
    });

    if (end >= tokens.length) {
      break;
    }

    start = Math.max(end - OVERLAP_TOKENS, start + 1);
  }

  return chunks;
}

async function loadKnowledgeFile(sourceDir: string, absolutePath: string): Promise<KnowledgeFile> {
  const relativePath = path.relative(sourceDir, absolutePath);
  const content = normalizeContent(await readFile(absolutePath, "utf8"));

  return {
    relativePath,
    title: toTitle(absolutePath),
    category: inferCategory(relativePath),
    language: "fr",
    content,
  };
}

function hashContent(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function toEmbeddingLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

async function embedChunkBatch(chunks: KnowledgeChunk[]) {
  let lastError: unknown;

  for (const model of EMBEDDING_MODELS) {
    try {
      const response = await genAI.models.embedContent({
        model,
        contents: chunks.map((chunk) => chunk.content),
        config: {
          taskType: "RETRIEVAL_DOCUMENT",
          outputDimensionality: EMBEDDING_DIMENSIONS,
        },
      });

      const embeddings = response.embeddings ?? [];

      if (embeddings.length !== chunks.length) {
        throw new Error(
          `Gemini returned ${embeddings.length} embeddings for ${chunks.length} chunks`,
        );
      }

      return embeddings.map((embedding, index) => {
        const values = embedding.values ?? [];

        if (values.length !== EMBEDDING_DIMENSIONS) {
          throw new Error(
            `Embedding ${index} has ${values.length} dimensions, expected ${EMBEDDING_DIMENSIONS}`,
          );
        }

        return values;
      });
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

async function embedChunks(chunks: KnowledgeChunk[]) {
  const embeddings: number[][] = [];

  for (let start = 0; start < chunks.length; start += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(start, start + EMBEDDING_BATCH_SIZE);
    const batchNumber = Math.floor(start / EMBEDDING_BATCH_SIZE) + 1;
    const batchCount = Math.ceil(chunks.length / EMBEDDING_BATCH_SIZE);

    console.log(`Embedding batch ${batchNumber}/${batchCount} (${batch.length} chunks)`);

    embeddings.push(...(await embedChunkBatch(batch)));
  }

  return embeddings;
}

async function insertKnowledgeFile(file: KnowledgeFile) {
  const chunks = chunkContent(file.content);

  if (chunks.length === 0) {
    console.warn(`Skipped empty file: ${file.relativePath}`);
    return { documents: 0, chunks: 0 };
  }

  const embeddings = await embedChunks(chunks);

  const { error: deleteError } = await supabase
    .from("knowledge_documents")
    .delete()
    .eq("source", file.relativePath);

  if (deleteError) {
    throw new Error(`Failed to replace document ${file.relativePath}: ${deleteError.message}`);
  }

  const { data: document, error: documentError } = await supabase
    .from("knowledge_documents")
    .insert({
      title: file.title,
      content: file.content,
      source: file.relativePath,
      category: file.category,
      language: file.language,
    })
    .select("id")
    .single();

  if (documentError) {
    throw new Error(`Failed to insert document ${file.relativePath}: ${documentError.message}`);
  }

  const chunkRows = chunks.map((chunk, index) => ({
    document_id: document.id,
    content: chunk.content,
    embedding: toEmbeddingLiteral(embeddings[index]),
    metadata: {
      source: file.relativePath,
      title: file.title,
      category: file.category,
      language: file.language,
      chunkIndex: index,
      tokenStart: chunk.tokenStart,
      tokenEnd: chunk.tokenEnd,
      tokenCount: chunk.tokenCount,
      contentHash: hashContent(chunk.content),
    },
  }));

  const { error: chunksError } = await supabase.from("knowledge_chunks").insert(chunkRows);

  if (chunksError) {
    throw new Error(`Failed to insert chunks for ${file.relativePath}: ${chunksError.message}`);
  }

  console.log(`Inserted ${file.relativePath}: 1 document, ${chunks.length} chunks`);

  return { documents: 1, chunks: chunks.length };
}

async function main() {
  const sourceDir = getSourceDir();

  if (!existsSync(sourceDir)) {
    throw new Error(
      `Knowledge source directory not found: ${sourceDir}. Create it or pass --source <folder>.`,
    );
  }

  const filePaths = await listKnowledgeFiles(sourceDir);

  if (filePaths.length === 0) {
    throw new Error(`No .md, .mdx or .txt files found in ${sourceDir}`);
  }

  let documentCount = 0;
  let chunkCount = 0;

  for (const filePath of filePaths) {
    const file = await loadKnowledgeFile(sourceDir, filePath);
    const result = await insertKnowledgeFile(file);

    documentCount += result.documents;
    chunkCount += result.chunks;
  }

  console.log(`Done. Inserted ${documentCount} documents and ${chunkCount} chunks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
