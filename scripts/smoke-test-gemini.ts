/**
 * scripts/smoke-test-gemini.ts
 *
 * Smoke test pour valider l'intégration API Google Gemini.
 * À exécuter AVANT de démarrer le module RAG, pour s'assurer
 * que la clé API est valide et que le SDK répond correctement.
 *
 * Usage : pnpm smoke-test
 */

import dotenv from "dotenv";
import path from "path";

// Charge explicitement .env.local (dotenv/config ne lit que .env par défaut)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { GoogleGenerativeAI } from "@google/generative-ai";


// ─── Constantes ────────────────────────────────────────────────────────────────

/** Modèle utilisé pour le smoke test — cohérent avec le choix projet */
const MODEL_NAME = "gemini-2.5-flash";

/** Prompt minimaliste : on attend uniquement "OK" comme réponse */
const TEST_PROMPT =
  "Réponds uniquement par OK si tu reçois ce message.";

// ─── Validation de la clé API ──────────────────────────────────────────────────

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey || apiKey.trim() === "") {
  console.error("❌ ERREUR : la variable GOOGLE_API_KEY est absente ou vide.");
  console.error(
    "   → Remplis la valeur dans .env.local à la racine du projet."
  );
  process.exit(1); // Sortie propre avec code d'erreur
}

// ─── Smoke test ────────────────────────────────────────────────────────────────

async function runSmokeTest(): Promise<void> {
  console.log("🔍 Smoke test Gemini — démarrage…");
  console.log(`   Modèle : ${MODEL_NAME}`);
  console.log(`   Prompt : "${TEST_PROMPT}"\n`);

  try {
    // Initialisation du client SDK Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Envoi de la requête et attente de la réponse
    const result = await model.generateContent(TEST_PROMPT);
    const response = result.response;
    const text = response.text().trim();

    // ─── Affichage des résultats ───────────────────────────────────────────────
    console.log("✅ Réponse reçue avec succès !");
    console.log("─────────────────────────────────────────");
    console.log(`   Statut    : OK (200)`);
    console.log(`   Modèle    : ${MODEL_NAME}`);
    console.log(`   Réponse   : "${text}"`);
    console.log("─────────────────────────────────────────");

    // Vérification optionnelle : le modèle a-t-il bien répondu "OK" ?
    if (text.toUpperCase().includes("OK")) {
      console.log("\n🎉 Le modèle a validé le message — intégration fonctionnelle.");
    } else {
      console.warn(
        '\n⚠️  Le modèle a répondu mais pas exactement "OK".',
        "Vérifie le prompt ou les paramètres du modèle."
      );
    }
  } catch (error: unknown) {
    // Gestion propre des erreurs (clé invalide, quota dépassé, réseau, etc.)
    console.error("\n❌ Échec du smoke test :");

    if (error instanceof Error) {
      // Erreurs API courantes : clé invalide, quota, modèle inexistant
      if (error.message.includes("API key")) {
        console.error("   → Clé API invalide ou révoquée.");
        console.error("   → Vérifie GOOGLE_API_KEY dans .env.local.");
      } else if (error.message.includes("quota")) {
        console.error("   → Quota API dépassé. Attends ou vérifie ta facturation.");
      } else if (error.message.includes("404")) {
        console.error(
          `   → Modèle "${MODEL_NAME}" introuvable. Vérifie le nom du modèle.`
        );
      } else {
        console.error(`   → ${error.message}`);
      }
    } else {
      console.error("   → Erreur inconnue :", error);
    }

    process.exit(1); // Sortie avec code d'erreur pour CI/CD
  }
}

// Point d'entrée
runSmokeTest();
