# Architecture — Flux bout en bout

Visiteur site web
   ↓
Widget chat (Next.js, session_id)
   ↓
API POST /api/chat (reçoit session_id + message)
   ↓
Recherche RAG Supabase (top 5 chunks pertinents)
   ↓
Agent Gemini Sales (réponse + extraction JSON structurée)
   ↓
Supabase (leads, conversations, knowledge_chunks)
   ↓
Lead engine (score, température, résumé, next action)
   ↓
Dashboard leads qualifiés (liste, filtres, fiche détaillée)
   ↓
Export CRM (si score élevé)
   ├── HubSpot
   ├── Salesforce
   ├── Slack
   └── Webhook générique

## Organisation active du projet

Le projet suit la structure demandee dans le document de stage : le code applicatif est centralise dans `src/`, tandis que les fichiers de configuration restent a la racine.

- `src/app/` : pages Next.js et routes API.
- `src/components/leadia/` : composants metier de l'interface Leadia et du widget chat.
- `src/components/ui/` : composants UI reutilisables.
- `src/lib/ai/` : helpers IA, embeddings et appels Gemini lies au RAG.
- `src/lib/crm/` : exports HubSpot, Salesforce, Slack et webhook generique.
- `src/lib/database/` : clients Supabase cote navigateur et cote serveur.
- `src/lib/leads/` : logique lead, validation, merge progressif et anti-crash.
- `src/schemas/` : schemas Zod partages.
- `src/types/` : types TypeScript partages quand un type ne depend pas d'un module specifique.
- `knowledge/guidia/` : documents entreprise Guidia utilises par le RAG.
- `scripts/` : scripts techniques, ingestion RAG et smoke tests.
- `supabase/migrations/` : schema SQL, pgvector, RPC et index.
- `docs/` : documentation projet, architecture, tests et livraison.

## Regle de rangement

Un fichier doit etre place selon sa responsabilite :

- route API Next.js -> `src/app/api/.../route.ts`
- composant React -> `src/components/...`
- logique metier reutilisable -> `src/lib/...`
- schema de validation -> `src/schemas/...`
- type TypeScript partage -> `src/types/...`
- document RAG fourni par l'entreprise -> `knowledge/guidia/...`
- document interne du projet -> `docs/...`
- script lance en terminal -> `scripts/...`
- migration Supabase -> `supabase/migrations/...`
