import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

type EvaluationCase = {
  id: string;
  language: "fr" | "en" | "ar";
  answerable: boolean;
  question: string;
  expectedTerms: string[];
  expectedCategory?: string;
};

type RagMatch = {
  content: string;
  similarity: number;
  category: string | null;
  title: string | null;
};

type RagResponse = {
  matches?: RagMatch[];
  error?: string;
  details?: string;
};

const baseUrl = (process.env.RAG_EVAL_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const knownSimilarityFloor = Number(process.env.RAG_KNOWN_SIMILARITY_FLOOR ?? "0.5");
const unknownSimilarityCeiling = Number(process.env.RAG_UNKNOWN_SIMILARITY_CEILING ?? "0.55");

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function evaluate(testCase: EvaluationCase) {
  const response = await fetch(`${baseUrl}/api/rag/search`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: testCase.question, matchCount: 5, matchThreshold: -1 }),
  });
  const payload = (await response.json()) as RagResponse;

  if (!response.ok) {
    throw new Error(`${testCase.id}: ${payload.error ?? response.statusText} ${payload.details ?? ""}`.trim());
  }

  const matches = payload.matches ?? [];
  const searchableText = normalize(matches.map((match) => match.content).join("\n"));
  const topSimilarity = matches[0]?.similarity ?? 0;
  const foundTerms = testCase.expectedTerms.filter((term) => searchableText.includes(normalize(term)));
  const termCoverage = testCase.expectedTerms.length
    ? foundTerms.length / testCase.expectedTerms.length
    : 1;
  const categoryFound = testCase.expectedCategory
    ? matches.some((match) => normalize(match.category ?? "") === normalize(testCase.expectedCategory!))
    : true;

  const passed = testCase.answerable
    ? matches.length > 0 && topSimilarity >= knownSimilarityFloor && termCoverage === 1 && categoryFound
    : topSimilarity < unknownSimilarityCeiling;

  return {
    ...testCase,
    passed,
    topSimilarity: Number(topSimilarity.toFixed(4)),
    termCoverage: Number(termCoverage.toFixed(2)),
    foundTerms,
    categoryFound,
    topMatch: matches[0]?.title ?? null,
  };
}

async function main() {
  const datasetPath = path.join(process.cwd(), "datasets", "rag-evaluation.json");
  const cases = JSON.parse(await readFile(datasetPath, "utf8")) as EvaluationCase[];
  const results = [];

  for (const testCase of cases) {
    process.stdout.write(`RAG ${testCase.id}... `);
    const result = await evaluate(testCase);
    results.push(result);
    console.log(result.passed ? "PASS" : "FAIL", `(similarity ${result.topSimilarity})`);
  }

  const passed = results.filter((result) => result.passed).length;
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    thresholds: { knownSimilarityFloor, unknownSimilarityCeiling },
    summary: { total: results.length, passed, failed: results.length - passed },
    results,
  };

  const reportsDirectory = path.join(process.cwd(), "reports");
  await mkdir(reportsDirectory, { recursive: true });
  const reportPath = path.join(reportsDirectory, "rag-evaluation-report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`\nResult: ${passed}/${results.length} checks passed.`);
  console.log(`Report: ${reportPath}`);
  if (passed !== results.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
