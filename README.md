# Sales-Agent-Guidia

Créer un agent IA capable de discuter avec un visiteur, comprendre son besoin, qualifier son niveau d’intérêt, détecter son budget, son secteur, son urgence, puis transmettre un lead structuré à un CRM.

## Description du projet
**Agent IA Sales** — Agent de qualification automatique des leads pour Guidia, une plateforme d'agents IA commerciaux.

## Stack technique
*   **Framework :** Next.js 14 (App Router)
*   **Langage :** TypeScript
*   **Style :** TailwindCSS
*   **Base de données :** Supabase (avec extension `pgvector`)
*   **Modèle IA :** Gemini API (Flash/Pro)
*   **Validation :** Zod
*   **Gestionnaire de paquets :** pnpm

## Structure du projet
*   `src/app` : Tableau de bord (dashboard) et routes d'API (`/api/chat`, `/api/leads`, `/api/rag`, `/api/crm`)
*   `src/components` : Composants de widget de chat et de tableau de bord
*   `src/lib` : Services et intégrations (Gemini, CRM, etc.)
*   `src/schemas` & `src/types` : Validation Zod et types TypeScript du projet
*   `supabase/migrations` : Migrations et schémas de la base de données PostgreSQL
*   `scripts` : Scripts d'ingestion RAG (`ingest-knowledge.ts`), génération de données de test (`generate-test-conversations.ts`) et sources RAG (`knowledge-sources`)
*   `docs` : Architecture et documentation technique du projet

## Installation et démarrage
1.  Installez les dépendances du projet :
    ```bash
    pnpm install
    ```
2.  Si un avertissement de scripts de build apparaît, vérifiez la configuration `allowBuilds` dans le fichier `pnpm-workspace.yaml`.
3.  Copiez le fichier `.env.example` (ou `.env.local.example` s'il existe) vers `.env.local` et renseignez les clés requises :
    ```bash
    cp .env.example .env.local
    ```

## Variables d'environnement requises
Configurez les variables suivantes dans votre fichier `.env.local` :
*   `GOOGLE_API_KEY`
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `SUPABASE_SERVICE_ROLE_KEY`

## Workflow Git
*   `main` : Branche principale protégée, aucun commit direct autorisé.
*   `dev` : Branche d'intégration.
*   `feature/<task>` : Une branche par tâche (ex. `feature/widget-chat`, `feature/rag-search`, `feature/scoring`, `feature/crm-export`).
*   **Pull Requests (PR) :** Des Pull Requests courtes et claires sont obligatoires pour chaque fusion vers la branche `dev`.
*   **Format des messages de commit :** Respectez les préfixes de commits conventionnels (ex. `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).

## Sources de connaissances RAG (RAG Knowledge Sources)
Les documents de référence formatés en markdown sont stockés dans le dossier `/scripts/knowledge-sources/` :
*   `pricing.md` : Offres, plans, tarifs et crédits IA.
*   `integrations.md` : Connexions CRM, ticketing et webhooks.
*   `security-rgpd.md` : Isolation tenant, conformité RGPD, clés d'API et CSP.
*   `objections.md` : Réponses types de l'agent aux objections fréquentes.
*   `use-cases.md` : Scénarios et conversations de démonstration par secteur d'activité.

Ces fichiers sont lus par le script `scripts/ingest-knowledge.ts` pour être découpés (chunking) et stockés sous forme d'embeddings vectoriels. Les documents PDF bruts fournis par le maître de stage sont conservés dans `/scripts/knowledge-sources/raw/` et sont ignorés par Git via le fichier `.gitignore`. Ils ne doivent pas être versionnés.
