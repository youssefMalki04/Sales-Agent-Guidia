# Sales-Agent-Guidia

Agent IA Sales capable de discuter avec un visiteur, comprendre son besoin, qualifier son niveau d'interet, detecter son budget, son secteur et son urgence, puis transmettre un lead structure vers un CRM.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Supabase PostgreSQL
- pgvector pour la recherche RAG
- Google Gemini pour embeddings et generation IA
- Integrations CRM : Slack, HubSpot, Salesforce, webhook generique

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Ouvrir ensuite :

```text
http://localhost:3000
```

## Frontend Leadia

Le frontend peut etre presente sans connexion a Supabase. Par defaut, les
interfaces de demonstration utilisent des donnees locales et `localStorage`.
Les lectures du dashboard Supabase ne sont activees que si :

```env
ENABLE_SUPABASE_DASHBOARD=true
```

Routes principales :

| Interface | Route | Objectif |
| --- | --- | --- |
| Getting started | `/dashboard/onboarding` | Guider la configuration et suivre la progression |
| Agent Studio | `/dashboard/agents` | Creer, configurer et tester les agents IA |
| Knowledge base | `/dashboard/knowledge` | Gerer les connaissances utilisees par les agents |
| Widget demo | `/demo/widget` | Montrer le widget sur un site client fictif |
| Widget installation | `/dashboard/widget-installation` | Personnaliser et copier le code d'installation |
| Live Inbox | `/dashboard/inbox` | Reprendre une conversation transferee par l'IA |
| Leads | `/dashboard/leads` | Rechercher et analyser les prospects qualifies |
| Sales pipeline | `/dashboard/pipeline` | Faire avancer les opportunites dans le cycle commercial |
| Meetings | `/dashboard/meetings` | Planifier et suivre les rendez-vous commerciaux |
| AI performance | `/dashboard/analytics` | Analyser conversion, objections et qualite des reponses |
| Integration center | `/dashboard/integrations` | Simuler CRM, Slack, email, calendrier et webhooks |
| Team | `/dashboard/team` | Gerer les roles, permissions et charges de travail |
| Privacy & GDPR | `/dashboard/privacy` | Configurer consentement et conservation des donnees |
| Import / Export | `/dashboard/import-export` | Importer, valider et exporter des leads CSV |

Le bouton **Demo** dans la topbar fournit le parcours recommande et permet de
reinitialiser toutes les donnees locales de demonstration.

Documentation detaillee :

- `docs/frontend-demo-guide.md` : parcours de demo, statut des fonctionnalites et checklist de livraison.

## Variables d'environnement

Les variables locales se mettent dans `.env.local`. Ce fichier ne doit jamais etre committe.

Variables principales :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_API_KEY=
HUBSPOT_ACCESS_TOKEN=
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_INSTANCE_URL=
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_REFRESH_TOKEN=
SLACK_WEBHOOK_URL=
GENERIC_WEBHOOK_URL=
```

## Architecture

```text
Visiteur
  -> Widget chat Next.js
  -> API Next.js
  -> Recherche RAG Supabase Vector
  -> Gemini
  -> Validation Zod + merge lead
  -> Supabase
  -> Dashboard
  -> Export CRM / Slack / webhook
```

Structure principale :

```text
src/app/                 Pages Next.js et routes API
src/components/leadia/   Composants metier Leadia
src/components/ui/       Composants UI reutilisables
src/lib/ai/              Embeddings et helpers IA
src/lib/database/        Clients Supabase
src/lib/leads/           Validation, merge, qualite lead
src/lib/crm/             Exports CRM
src/schemas/             Schemas Zod
src/types/               Types partages
scripts/                 Scripts ingestion et smoke tests
supabase/migrations/     Schema SQL, pgvector, RPC
knowledge/guidia/        Documents entreprise indexes
docs/                    Documentation projet et tests
```

## Endpoints

Disponibles dans le code actuel :

| Methode | Endpoint | Role |
| --- | --- | --- |
| GET | `/api/health` | Verifier que l'API repond |
| POST | `/api/rag/search` | Rechercher des chunks RAG pertinents |
| POST | `/api/crm/export` | Exporter un lead vers Slack, HubSpot, Salesforce ou webhook selon la configuration |
| GET | `/api/crm/salesforce/auth` | Demarrer l'auth Salesforce |
| GET | `/api/crm/salesforce/callback` | Callback OAuth Salesforce |

Endpoints prevus dans le flux final :

| Methode | Endpoint | Role |
| --- | --- | --- |
| POST | `/api/chat` | Pipeline conversationnel complet |
| GET | `/api/leads` | Liste des leads qualifies |
| GET | `/api/leads/[id]` | Detail d'un lead |
| POST | `/api/knowledge/ingest` | Ingestion knowledge depuis API |
| POST | `/api/webhook/send` | Envoi webhook generique dedie |

## Scripts utiles

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm smoke-test
pnpm ingest:knowledge -- --source knowledge
```

## Tests et livraison

Documents de reference :

- `docs/architecture.md` : flux technique et organisation des dossiers.
- `docs/e2e-test-plan.md` : scenarios E2E et cas d'erreur a verifier.
- `docs/demo-video-script.md` : script de demo 3 a 5 minutes.
- `docs/rag-low-similarity-analysis.md` : analyse qualite RAG.
- `docs/sales-summary-guidelines.md` : regles de qualite des fiches leads.
- `docs/lead-quality-test-cases.md` : cas de test pour leads, scores et objections.

## Regles de securite

- Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` cote navigateur.
- Ne jamais committer `.env.local`.
- Garder les tokens CRM uniquement cote serveur.
- Valider les donnees IA avec Zod avant stockage.
- Journaliser les erreurs sans afficher les secrets.
