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

## Organisation cible

Le projet utilise Next.js App Router avec `app/` à la racine pour l'interface Leadia et les routes API. Les dossiers `src/` présents dans la branche distante restent conservés pour les modules préparés par l'équipe, mais le frontend actif ajouté ici est sous `app/`.

- `app/`: pages Next.js et routes API.
- `components/leadia/`: composants métier de l'interface workspace.
- `components/ui/`: composants UI réutilisables.
- `lib/crm/`: exports HubSpot, Salesforce, Slack et webhook générique.
- `lib/database/`: client Supabase et futurs repositories.
- `lib/ai/`, `lib/scoring/`, `lib/dataset/`: emplacements pour agent IA, scoring et données simulées.
- `supabase/migrations/`: schéma SQL.
