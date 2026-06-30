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