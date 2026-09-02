import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { calculateLeadScore } from "../src/lib/leads/calculate-lead-score";

type Temperature = "cold" | "warm" | "hot";
type Language = "ar" | "en" | "fr";
type ObjectionCategory =
  | "price"
  | "security"
  | "integration"
  | "competitor"
  | "timing"
  | "human_request";

type Seed = {
  language: Language;
  objection: ObjectionCategory;
  sector: string;
};

const coldSeeds: Seed[] = [
  { language: "fr", objection: "price", sector: "SaaS B2B" },
  { language: "en", objection: "security", sector: "E-commerce" },
  { language: "ar", objection: "integration", sector: "Agence marketing" },
  { language: "fr", objection: "competitor", sector: "Industrie" },
  { language: "en", objection: "timing", sector: "Santé" },
  { language: "ar", objection: "human_request", sector: "Banque" },
  { language: "fr", objection: "security", sector: "Conseil" },
  { language: "en", objection: "price", sector: "SaaS B2B" },
  { language: "ar", objection: "timing", sector: "E-commerce" },
  { language: "fr", objection: "integration", sector: "Agence marketing" },
  { language: "en", objection: "competitor", sector: "Industrie" },
  { language: "ar", objection: "security", sector: "Santé" },
  { language: "fr", objection: "human_request", sector: "Banque" },
  { language: "en", objection: "integration", sector: "Conseil" },
  { language: "ar", objection: "price", sector: "SaaS B2B" },
];

const warmSeeds: Seed[] = [
  { language: "fr", objection: "price", sector: "SaaS B2B" },
  { language: "en", objection: "security", sector: "E-commerce" },
  { language: "ar", objection: "integration", sector: "Agence marketing" },
  { language: "fr", objection: "competitor", sector: "Industrie" },
  { language: "en", objection: "timing", sector: "Santé" },
  { language: "ar", objection: "human_request", sector: "Banque" },
  { language: "fr", objection: "security", sector: "Conseil" },
  { language: "en", objection: "price", sector: "SaaS B2B" },
  { language: "ar", objection: "timing", sector: "E-commerce" },
  { language: "fr", objection: "integration", sector: "Agence marketing" },
  { language: "en", objection: "competitor", sector: "Industrie" },
  { language: "ar", objection: "security", sector: "Santé" },
  { language: "fr", objection: "human_request", sector: "Banque" },
  { language: "en", objection: "integration", sector: "Conseil" },
  { language: "ar", objection: "price", sector: "SaaS B2B" },
  { language: "fr", objection: "timing", sector: "E-commerce" },
  { language: "en", objection: "security", sector: "Agence marketing" },
  { language: "ar", objection: "competitor", sector: "Industrie" },
  { language: "fr", objection: "integration", sector: "Santé" },
  { language: "en", objection: "human_request", sector: "Conseil" },
];

const hotSeeds: Seed[] = [
  { language: "fr", objection: "price", sector: "SaaS B2B" },
  { language: "en", objection: "security", sector: "E-commerce" },
  { language: "ar", objection: "integration", sector: "Agence marketing" },
  { language: "fr", objection: "competitor", sector: "Industrie" },
  { language: "en", objection: "timing", sector: "Santé" },
  { language: "ar", objection: "human_request", sector: "Banque" },
  { language: "fr", objection: "security", sector: "Conseil" },
  { language: "en", objection: "price", sector: "SaaS B2B" },
  { language: "ar", objection: "timing", sector: "E-commerce" },
  { language: "fr", objection: "integration", sector: "Agence marketing" },
  { language: "en", objection: "competitor", sector: "Industrie" },
  { language: "ar", objection: "security", sector: "Santé" },
  { language: "fr", objection: "human_request", sector: "Banque" },
  { language: "en", objection: "integration", sector: "Conseil" },
  { language: "ar", objection: "price", sector: "SaaS B2B" },
];

const copy = {
  ar: {
    assistant:
      "يمكن لـ Leadia تأهيل الزوار وحفظ المعلومات المهمة لفريق المبيعات. ما هي حاجتكم الأساسية؟",
    cold: "مرحبا، أريد فقط معرفة المزيد عن الحل.",
    hot: "نستعمل HubSpot ونريد عرضا توضيحيا هذا الشهر. الميزانية 5000 يورو.",
    warm: "نريد تأهيل زوار موقعنا، لكننا ما زلنا ندرس المشروع.",
  },
  en: {
    assistant:
      "Leadia can qualify visitors and structure useful information for your sales team. What is your main requirement?",
    cold: "Hello, I am only browsing and would like general information.",
    hot: "We use HubSpot and want a demo this month. Our budget is EUR 5,000.",
    warm: "We need to qualify website visitors, but the project is still under review.",
  },
  fr: {
    assistant:
      "Leadia peut qualifier les visiteurs et structurer les informations utiles pour votre équipe commerciale. Quel est votre besoin principal ?",
    cold: "Bonjour, je regarde simplement et je souhaite des informations générales.",
    hot: "Nous utilisons HubSpot et souhaitons une démonstration ce mois-ci. Notre budget est de 5 000 €.",
    warm: "Nous voulons qualifier les visiteurs du site, mais le projet est encore à l'étude.",
  },
} satisfies Record<
  Language,
  { assistant: string; cold: string; hot: string; warm: string }
>;

function expectedSummary(
  temperature: Temperature,
  sector: string,
  objection: ObjectionCategory,
) {
  if (temperature === "cold") {
    return `Prospect ${sector} en phase de découverte, sans besoin, budget ou calendrier confirmé. Objection à explorer : ${objection}.`;
  }
  if (temperature === "warm") {
    return `Prospect ${sector} avec un besoin de qualification identifié, mais sans décision commerciale immédiate. Objection à traiter : ${objection}.`;
  }
  return `Prospect ${sector} avec besoin clair, budget de 5 000 EUR, démarrage ce mois-ci et demande de démonstration. Objection ${objection} traitée.`;
}

function expectedNextAction(temperature: Temperature) {
  if (temperature === "cold") return "Envoyer la documentation adaptée.";
  if (temperature === "warm") {
    return "Planifier une relance pour confirmer le budget et le calendrier.";
  }
  return "Organiser une démonstration et notifier immédiatement l'équipe commerciale.";
}

function createConversation(
  seed: Seed,
  temperature: Temperature,
  index: number,
) {
  const identity = index.toString().padStart(2, "0");
  const messages = [
    { role: "user" as const, message: copy[seed.language][temperature] },
    { role: "assistant" as const, message: copy[seed.language].assistant },
  ];
  const commonLead = {
    objections: [
      {
        category: seed.objection,
        evidence: `Dataset scenario ${identity}`,
        status:
          temperature === "hot" ? ("resolved" as const) : ("detected" as const),
      },
    ],
  };
  const lead =
    temperature === "cold"
      ? commonLead
      : temperature === "warm"
        ? {
            ...commonLead,
            company: `Prospect ${identity}`,
            name: `Contact ${identity}`,
            need: "Qualifier automatiquement les visiteurs du site web",
            sector: seed.sector,
          }
        : {
            ...commonLead,
            budget: "5000 EUR",
            company: `Entreprise ${identity}`,
            email: `contact${identity}@entreprise-${identity}.com`,
            name: `Décideur ${identity}`,
            need: "Qualifier les prospects et transmettre les opportunités au CRM",
            sector: seed.sector,
            urgency: "Démarrage ce mois-ci",
          };
  const result = calculateLeadScore({ conversation: messages, lead });

  if (result.temperature !== temperature) {
    throw new Error(
      `Scenario ${identity}: expected ${temperature}, received ${result.temperature} (${result.score})`,
    );
  }

  return {
    id: `sales-${temperature}-${identity}`,
    language: seed.language,
    lead,
    messages,
    objection: seed.objection,
    sector: seed.sector,
    expected: {
      nextAction: expectedNextAction(temperature),
      score: result.score,
      scoreBreakdown: result.breakdown,
      summary: expectedSummary(temperature, seed.sector, seed.objection),
      temperature: result.temperature,
    },
  };
}

const conversations = [
  ...coldSeeds.map((seed, index) =>
    createConversation(seed, "cold", index + 1),
  ),
  ...warmSeeds.map((seed, index) =>
    createConversation(seed, "warm", index + 1 + coldSeeds.length),
  ),
  ...hotSeeds.map((seed, index) =>
    createConversation(
      seed,
      "hot",
      index + 1 + coldSeeds.length + warmSeeds.length,
    ),
  ),
];

const counts = conversations.reduce(
  (result, conversation) => {
    result[conversation.expected.temperature] += 1;
    return result;
  },
  { cold: 0, hot: 0, warm: 0 },
);

if (
  conversations.length !== 50 ||
  counts.cold !== 15 ||
  counts.warm !== 20 ||
  counts.hot !== 15
) {
  throw new Error(`Invalid dataset distribution: ${JSON.stringify(counts)}`);
}

const outputArgument = process.argv.find((argument) =>
  argument.startsWith("--output="),
);
const outputPath = resolve(
  process.cwd(),
  outputArgument?.slice("--output=".length) ??
    "datasets/sales-conversations.json",
);

async function main() {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        conversations,
        generatedAt: new Date().toISOString(),
        summary: { ...counts, total: conversations.length },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(
    `Generated ${conversations.length} conversations (${counts.cold} cold, ${counts.warm} warm, ${counts.hot} hot) in ${outputPath}`,
  );
}

void main();
