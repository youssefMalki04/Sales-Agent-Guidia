import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  calculateLeadScore,
  classifyLeadTemperature,
  isProfessionalEmail,
} from "../src/lib/leads/calculate-lead-score";

type Dataset = {
  conversations: Array<{
    expected: {
      score: number;
      temperature: "cold" | "warm" | "hot";
    };
    id: string;
    lead: Parameters<typeof calculateLeadScore>[0]["lead"];
    messages: NonNullable<
      Parameters<typeof calculateLeadScore>[0]["conversation"]
    >;
  }>;
  summary: {
    cold: number;
    hot: number;
    total: number;
    warm: number;
  };
};

test("classe correctement les valeurs aux limites du barème", () => {
  assert.equal(classifyLeadTemperature(0), "cold");
  assert.equal(classifyLeadTemperature(39), "cold");
  assert.equal(classifyLeadTemperature(40), "warm");
  assert.equal(classifyLeadTemperature(69), "warm");
  assert.equal(classifyLeadTemperature(70), "hot");
  assert.equal(classifyLeadTemperature(100), "hot");
});

test("distingue une adresse professionnelle d'une adresse personnelle", () => {
  assert.equal(isProfessionalEmail("contact@entreprise.com"), true);
  assert.equal(isProfessionalEmail("contact@gmail.com"), false);
  assert.equal(isProfessionalEmail("contact@outlook.com"), false);
  assert.equal(isProfessionalEmail(""), false);
  assert.equal(isProfessionalEmail(null), false);
});

test("applique tous les critères du barème commercial", () => {
  const result = calculateLeadScore({
    conversation: [
      {
        message:
          "Nous utilisons HubSpot et souhaitons une démonstration urgente ce mois-ci.",
        role: "user",
      },
    ],
    lead: {
      budget: "5 000 EUR",
      company: "Acme",
      email: "contact@acme.test",
      name: "Alice",
      need: "Qualifier les prospects",
      objections: [
        {
          category: "price",
          evidence: "Budget validé",
          status: "resolved",
        },
      ],
      sector: "SaaS B2B",
      urgency: "Ce mois-ci",
    },
  });

  assert.deepEqual(result.breakdown, {
    budget: 15,
    commercialIntent: 15,
    company: 10,
    crmOrIntegration: 5,
    highUrgency: 15,
    name: 5,
    need: 20,
    professionalEmail: 10,
    resolvedObjection: 5,
    sector: 10,
  });
  assert.equal(result.score, 100);
  assert.equal(result.temperature, "hot");
});

test("ignore les messages assistant pour les signaux commerciaux", () => {
  const result = calculateLeadScore({
    conversation: [
      {
        message: "Je peux organiser une démonstration HubSpot ce mois-ci.",
        role: "assistant",
      },
      { message: "Je regarde seulement.", role: "user" },
    ],
    lead: {},
  });

  assert.equal(result.breakdown.commercialIntent, 0);
  assert.equal(result.breakdown.crmOrIntegration, 0);
  assert.equal(result.breakdown.highUrgency, 0);
  assert.equal(result.score, 0);
});

test("les 50 conversations du dataset conservent leur score attendu", async (t) => {
  const dataset = JSON.parse(
    await readFile("datasets/sales-conversations.json", "utf8"),
  ) as Dataset;

  assert.deepEqual(dataset.summary, {
    cold: 15,
    hot: 15,
    total: 50,
    warm: 20,
  });
  assert.equal(dataset.conversations.length, 50);

  for (const scenario of dataset.conversations) {
    await t.test(scenario.id, () => {
      const result = calculateLeadScore({
        conversation: scenario.messages,
        lead: scenario.lead,
      });

      assert.equal(result.score, scenario.expected.score);
      assert.equal(result.temperature, scenario.expected.temperature);
    });
  }
});
