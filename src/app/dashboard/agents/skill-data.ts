import type { SkillForm, SkillPack } from "./skill-types";

export const initialForm: SkillForm = {
  key: "",
  label: "",
  mission: "",
  activation: "",
  capabilities: "",
  packType: "custom",
  executionMode: "assist",
  focusAreasText: "",
};

export const steps = [
  { title: "Identity", subtitle: "Key & label" },
  { title: "Description", subtitle: "Mission & behavior" },
  { title: "Behavior", subtitle: "Type & execution" },
  { title: "Focus", subtitle: "Business areas" },
  { title: "Validation", subtitle: "Summary" },
];

export const platformSkills: SkillPack[] = [
  {
    id: "action-execution",
    key: "action-execution",
    label: "Action Execution",
    source: "platform",
    packType: "execution",
    executionMode: "guarded_act",
    languages: ["FR", "EN"],
    tags: ["native-actions", "automation", "confirmations"],
    focusAreas: ["native-actions", "automation", "confirmations"],
    accent: "red",
    translations: [
      {
        language: "EN",
        mission:
          "Govern the skill packs that let the agent move from recommendation to action: native actions, guarded automation, form filling, or active navigation.",
        activation:
          "Activate when the user explicitly requests an operation or when a permitted native tool can complete the requested action.",
        capabilities:
          "Choose the correct action, prepare parameters, explain the expected effect, request confirmation when needed, and report the final result.",
      },
      {
        language: "FR",
        mission:
          "Encadrer les compétences qui permettent à l’agent de passer de la recommandation à l’action : actions natives, automatisation contrôlée, formulaires ou navigation active.",
        activation:
          "Activer lorsque l’utilisateur demande explicitement une opération ou lorsqu’un outil natif autorisé peut exécuter l’action demandée.",
        capabilities:
          "Choisir la bonne action, préparer les paramètres, expliquer l’effet attendu, demander une confirmation si nécessaire et présenter le résultat.",
      },
    ],
  },
  {
    id: "human-handoff",
    key: "human-handoff",
    label: "Human Handoff",
    source: "platform",
    packType: "compliance",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["uncertainty", "sensitive-actions", "escalation"],
    focusAreas: ["uncertainty", "sensitive-actions", "escalation"],
    accent: "green",
    translations: [
      {
        language: "EN",
        mission:
          "Ensure the agent knows how to stop cleanly and transfer to a human when automation is no longer safe or sufficient.",
        activation:
          "Activate for sensitive requests, low confidence, repeated failure, explicit human requests, or policy limits.",
        capabilities:
          "Summarize context, preserve useful details, explain why escalation is needed, and hand off without inventing certainty.",
      },
      {
        language: "FR",
        mission:
          "S’assurer que l’agent sache s’arrêter proprement et transférer vers un humain lorsque l’automatisation n’est plus sûre ou suffisante.",
        activation:
          "Activer pour les demandes sensibles, une faible confiance, des échecs répétés, une demande humaine ou une limite de politique.",
        capabilities:
          "Résumer le contexte, préserver les informations utiles, expliquer pourquoi l’escalade est nécessaire et transférer sans inventer de certitude.",
      },
    ],
  },
  {
    id: "knowledge-rag",
    key: "knowledge-rag",
    label: "Knowledge RAG",
    source: "platform",
    packType: "knowledge",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["documents", "faq", "procedures", "product-truth"],
    focusAreas: ["documents", "faq", "procedures", "product-truth"],
    accent: "yellow",
    translations: [
      {
        language: "EN",
        mission:
          "Make the client and product corpus the agent’s primary source of truth and reduce hallucinations.",
        activation:
          "Activate when an answer depends on product documentation, internal procedures, FAQs, policies, or indexed content.",
        capabilities:
          "Retrieve relevant passages, prefer authoritative sources, distinguish facts from inference, and clearly signal missing evidence.",
      },
      {
        language: "FR",
        mission:
          "Faire du corpus client et produit la principale source de vérité de l’agent et réduire les hallucinations.",
        activation:
          "Activer lorsqu’une réponse dépend de la documentation produit, des procédures internes, des FAQ, des politiques ou du contenu indexé.",
        capabilities:
          "Récupérer les passages pertinents, préférer les sources fiables, distinguer les faits des déductions et signaler clairement les informations manquantes.",
      },
    ],
  },
  {
    id: "navigation-ui",
    key: "navigation-ui",
    label: "Navigation UI",
    source: "platform",
    packType: "training",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["pages", "selectors", "flows", "walkthroughs"],
    focusAreas: ["pages", "selectors", "flows", "walkthroughs"],
    accent: "cyan",
    translations: [
      {
        language: "EN",
        mission:
          "Specialize the agent in reading the interface and user journeys: pages, menus, components, selectors, and workflows.",
        activation:
          "Activate when the user needs guidance through screens, navigation, onboarding, or a multi-step interface flow.",
        capabilities:
          "Identify the correct page, explain the next interaction, preserve user context, and provide short step-by-step guidance.",
      },
      {
        language: "FR",
        mission:
          "Spécialiser l’agent dans la lecture de l’interface et des parcours utilisateur : pages, menus, composants, sélecteurs et workflows.",
        activation:
          "Activer lorsque l’utilisateur a besoin d’aide dans des écrans, la navigation, l’onboarding ou un parcours en plusieurs étapes.",
        capabilities:
          "Identifier la bonne page, expliquer la prochaine interaction, préserver le contexte utilisateur et fournir des étapes courtes.",
      },
    ],
  },
  {
    id: "sales-playbook",
    key: "sales-playbook",
    label: "Sales Playbook",
    source: "platform",
    packType: "domain",
    executionMode: "assist",
    languages: ["FR", "EN", "AR", "ES", "PT", "IT", "TR", "DE", "NL", "SV"],
    tags: ["discovery", "qualification", "offers", "conversion"],
    focusAreas: ["discovery", "qualification", "offers", "conversion"],
    accent: "neutral",
    translations: [
      {
        language: "EN",
        mission:
          "Turn the agent into an autonomous sales advisor for a hosted application: explain the product, qualify intent, and guide the next step.",
        activation:
          "Activate during commercial discovery, lead qualification, product comparison, objection handling, or conversion support.",
        capabilities:
          "Ask focused questions, identify need and urgency, explain value, handle objections, and recommend a concrete next action.",
      },
      {
        language: "FR",
        mission:
          "Transformer l’agent en conseiller commercial autonome : expliquer le produit, qualifier l’intention et guider la prochaine étape.",
        activation:
          "Activer pendant la découverte commerciale, la qualification, la comparaison, le traitement des objections ou l’aide à la conversion.",
        capabilities:
          "Poser des questions ciblées, identifier le besoin et l’urgence, expliquer la valeur, traiter les objections et proposer une prochaine action.",
      },
    ],
  },
  {
    id: "support-core",
    key: "support-core",
    label: "Support Core",
    source: "platform",
    packType: "domain",
    executionMode: "assist",
    languages: ["FR", "EN"],
    tags: ["support", "troubleshooting", "customer-care"],
    focusAreas: ["support", "troubleshooting", "customer-care"],
    accent: "neutral",
    translations: [
      {
        language: "EN",
        mission:
          "Make product support a real agent discipline: understand the symptom quickly, frame the problem, and resolve it safely.",
        activation:
          "Activate when the user reports an error, a blocked workflow, an unexpected result, or a request for technical assistance.",
        capabilities:
          "Collect the relevant context, propose safe checks, avoid destructive steps, and escalate with a concise diagnostic summary.",
      },
      {
        language: "FR",
        mission:
          "Faire du support produit une vraie discipline d’agent : comprendre rapidement le symptôme, cadrer le problème et le résoudre en sécurité.",
        activation:
          "Activer lorsque l’utilisateur signale une erreur, un parcours bloqué, un résultat inattendu ou une demande d’assistance technique.",
        capabilities:
          "Collecter le contexte pertinent, proposer des vérifications sûres, éviter les étapes destructrices et escalader avec un diagnostic concis.",
      },
    ],
  },
];
