# Plan de tests E2E

Ce document sert a verifier le flux complet de l'agent IA Sales avant la livraison finale.

## Objectif

Valider qu'un utilisateur non technique peut suivre le parcours complet :

```text
question visiteur -> reponse agent -> qualification -> score -> dashboard -> notification Slack -> export HubSpot
```

## Pre-requis

- Serveur local lance avec `pnpm dev`.
- Variables `.env.local` renseignees.
- Supabase connecte.
- Documents RAG indexes.
- Webhook Slack configure pour les tests.
- Token HubSpot configure pour l'export sandbox.

## Endpoints a documenter dans Postman

| Endpoint | Statut actuel | Objectif du test |
| --- | --- | --- |
| `GET /api/health` | Disponible | Verifier que l'API repond |
| `POST /api/rag/search` | Disponible | Verifier la recherche RAG |
| `POST /api/crm/export` | Disponible | Tester Slack, HubSpot, Salesforce ou webhook |
| `POST /api/chat` | Prevu | Tester le flux conversationnel complet quand le pipeline est branche |
| `GET /api/leads` | Prevu | Verifier la liste des leads |
| `GET /api/leads/[id]` | Prevu | Verifier une fiche lead detaillee |

## Scenario principal - Lead chaud Shopify

Message visiteur :

```text
Bonjour, votre solution fonctionne avec Shopify ? On utilise HubSpot et on veut qualifier les visiteurs avant de les envoyer au CRM. On voudrait lancer ce mois-ci.
```

Resultat attendu :

- L'agent repond d'abord a la question Shopify.
- L'agent pose une seule question commerciale a la fois.
- La fiche lead contient :
  - besoin : qualification des visiteurs e-commerce ;
  - secteur : e-commerce ;
  - integration : Shopify + HubSpot ;
  - urgence : ce mois-ci ;
  - budget : non confirme ;
  - objection : `integration`.
- Le lead est classe chaud si le score est superieur ou egal a 70.
- Le `sales_summary` est court et directement lisible.
- La `suggested_next_action` propose un appel ou une demo.
- Une notification Slack est envoyee si l'export est declenche.
- L'export HubSpot cree ou met a jour un contact de test.

## Tests d'erreur

| Cas | Manipulation | Resultat attendu |
| --- | --- | --- |
| Reseau coupe | Couper le serveur local puis envoyer une requete | Le frontend affiche une erreur claire |
| JSON mal forme | Envoyer un body invalide dans Postman | L'API retourne une erreur controlee |
| `session_id` manquant | Appeler `/api/chat` sans `session_id` quand l'endpoint existe | L'API refuse la requete ou genere une erreur explicite |
| Validation Zod echouee | Simuler une reponse IA avec mauvais format | L'erreur est loggee dans `agent_events`, sans crash |
| Export CRM sans token | Supprimer temporairement une variable CRM | L'export est marque `skipped` ou `failed`, sans crash |

## Checklist de validation

- [ ] Le serveur local demarre.
- [ ] `GET /api/health` repond.
- [ ] `POST /api/rag/search` retourne des chunks pertinents.
- [ ] Le widget chat conserve un `session_id`.
- [ ] Le lead contient les informations extraites.
- [ ] Le score et la temperature sont coherents.
- [ ] Les objections sont visibles avec categorie et statut.
- [ ] Le resume commercial est lisible sans relire la conversation.
- [ ] La prochaine action est concrete.
- [ ] Slack recoit une notification de test.
- [ ] HubSpot recoit un contact de test.
- [ ] Les cas d'erreur ne font pas crasher l'application.

## Notes de livraison

Les endpoints notes comme "prevus" doivent etre testes des que les branches backend correspondantes sont fusionnees. Les tests disponibles aujourd'hui couvrent deja le RAG et l'export CRM centralise.
