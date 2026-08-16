export type MemoryTab = "traces" | "configuration";
export type TraceStatus = "active" | "rejected" | "promoted";
export type TraceType = "pitfall" | "summary" | "selector" | "strategy";

export type LearningTrace = {
  id: string;
  type: TraceType;
  status: TraceStatus;
  content: string;
  confidence: number;
  decay: number;
  usage: number;
  source: string;
};

export type MemoryConfig = {
  enabled: boolean;
  autoInject: Record<TraceType, boolean>;
  reviewRequired: Record<TraceType, boolean>;
  retentionDays: number;
  activeTraceLimit: number;
  minConfidence: number;
};

export const initialTraces: LearningTrace[] = [
  {
    id: "1",
    type: "pitfall",
    status: "active",
    content:
      "L'envoi de multiples messages de relance fragmentés par l'agent peut paraître intrusif lorsque le visiteur ne fournit que des réponses monosyllabiques.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "2",
    type: "pitfall",
    status: "active",
    content:
      "Éviter de basculer vers une autre langue sans confirmation, ce qui peut rompre la fluidité si le visiteur utilise des termes isolés.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "3",
    type: "summary",
    status: "active",
    content:
      "L'échange a échoué car l'agent n'a pas su interpréter certains termes isolés malgré une tentative de scan de page.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "4",
    type: "summary",
    status: "active",
    content:
      "Le visiteur a sollicité une aide en tunisien pour créer une facture, mais l'agent a rencontré une difficulté technique par manque de guide pré-configuré.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "5",
    type: "pitfall",
    status: "active",
    content:
      "Annoncer la recherche d'un guide automatisé pour finalement échouer crée une rupture dans le flux.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "6",
    type: "selector",
    status: "active",
    content:
      "Pour les demandes de facturation, le chemin d'accès standard est l'onglet Organisation situé dans le menu latéral gauche.",
    confidence: 0.7,
    decay: 1,
    usage: 0,
    source: "conversation_live",
  },
  {
    id: "7",
    type: "strategy",
    status: "active",
    content:
      "Commencer par reformuler la demande avant de proposer une action ou une navigation.",
    confidence: 0.82,
    decay: 0.96,
    usage: 4,
    source: "maintenance",
  },
];

export const initialConfig: MemoryConfig = {
  enabled: true,
  autoInject: { selector: true, pitfall: true, summary: true, strategy: false },
  reviewRequired: {
    selector: false,
    pitfall: false,
    summary: false,
    strategy: true,
  },
  retentionDays: 30,
  activeTraceLimit: 150,
  minConfidence: 0.4,
};
