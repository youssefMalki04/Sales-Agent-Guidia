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
| `POST /api/chat` | Disponible | Tester le flux conversationnel complet |
| `GET /api/leads` | Disponible | Verifier la liste des leads |
| `/dashboard/leads/[id]` | Disponible | Verifier une fiche lead detaillee |

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

- [x] Le serveur local demarre.
- [x] `GET /api/health` repond.
- [x] `POST /api/rag/search` retourne des chunks pertinents.
- [x] Le widget chat conserve un `session_id`.
- [x] Le lead contient les informations extraites.
- [x] Le score et la temperature sont coherents.
- [x] Les objections sont visibles avec categorie et statut.
- [x] Le resume commercial est lisible sans relire la conversation.
- [x] La prochaine action est concrete.
- [x] Slack recoit une notification de test.
- [x] HubSpot cree ou met a jour un contact de test.
- [x] Le webhook generique recoit un lead de test.
- [x] Les contrats API invalides sont couverts par les tests automatises.

## Historique des changements de phase

Pré-requis : appliquer `supabase/migrations/028_pipeline_stage_history.sql`
dans le SQL Editor du projet Supabase, après les migrations précédentes.
Seuls les changements effectués après cette installation sont historisés.
La migration ne reconstitue pas les anciens déplacements et ne modifie pas
les phases actuelles ni les statuts CRM.

1. Dans **Sales pipeline**, choisir une carte de test dans **New**.
2. Utiliser **Move to Qualified**, attendre la fin de l'enregistrement.
3. Ouvrir **⋯ → Open lead**, puis descendre jusqu'à **Activity timeline**.
4. Vérifier l'entrée **Pipeline stage changed**, **New → Qualified**, avec sa date.
5. Actualiser la fiche : l'entrée doit rester présente.
6. Revenir au pipeline, déplacer la même carte vers **New**. La fiche doit afficher
   **Qualified → New** au-dessus de l'entrée précédente.
7. Modifier uniquement le montant, le responsable ou l'échéance via **Edit opportunity** :
   aucune nouvelle entrée de changement de phase ne doit apparaître.
8. Tester une tentative hors ligne, sans actualiser la page : le déplacement échoue.
   Repasser sur **No throttling**, puis actualiser. Aucune entrée ne doit être créée
   pour cette tentative qui n'a pas atteint le serveur.

Les changements de phase automatiques (qualification et rendez-vous) utilisent
le même historique. En base, le changement et son événement sont enregistrés
dans une seule transaction : si l'écriture de l'historique échoue, la phase reste
inchangée. Un passage vers **Lost** n'est pas présenté comme une erreur technique.

Tests automatisés : `npm test` vérifie la présentation, les phases valides,
les événements mal formés et leur intégration aux activités existantes avec une
base simulée. Le script SQL `supabase/tests/pipeline_stage_history.sql` vérifie
le déclencheur sur une base PostgreSQL de test isolée ; ne pas l'exécuter sur
un projet de production.

## My Day : prospects sans relance

1. Ouvrir **My Day → Without follow-up**. Jusqu'à cinq prospects ouverts sont
   affichés, par score décroissant ; le compteur indique le total correspondant.
2. Cliquer sur **Plan follow-up**, saisir une action et une date, puis enregistrer.
   Après le rafraîchissement automatique, ce prospect doit disparaître de cette
   liste et le rappel doit être visible dans **Tasks**.
3. Annuler le formulaire : le prospect reste dans la liste. En cas d'échec
   d'enregistrement, le formulaire affiche l'erreur sans retirer le prospect.
4. Les phases **Won/Lost** sont exclues. Un rappel non terminé, même en retard
   ou assigné à un autre membre, exclut aussi le prospect. Un rappel uniquement
   terminé ne l'exclut pas : une prochaine action peut être planifiée.
5. Au-delà de cinq prospects, traiter une ligne puis vérifier que la suivante
   apparaît. Aucune migration supplémentaire n'est nécessaire.

La sélection utilise l'anti-jointure documentée par
[PostgREST](https://docs.postgrest.org/en/v13/references/api/resource_embedding.html#null-filtering-on-embedded-resources),
avant l'application de la limite ; elle ne dépend pas des vingt tâches de My Day.

## Avertissement de tâche déjà ouverte

1. Repérer une tâche ouverte et son prospect dans **Tasks**.
2. Tenter de créer une tâche pour ce même prospect avec le même titre, même
   en changeant la casse, les accents ou la ponctuation.
3. Vérifier le message « Une tâche similaire est déjà en cours… » : le
   formulaire reste ouvert, sans création supplémentaire ni notification.
4. Un titre différent ou un autre prospect reste autorisé. Une tâche terminée
   n'empêche pas une nouvelle création. Les tâches en retard et celles confiées
   à un collègue sont prises en compte.

La vérification est commune aux créations depuis Tasks, les fiches leads,
My Day et les briefs commerciaux. Elle compare les titres normalisés, pas leur
sens : des reformulations différentes ne sont pas détectées. C'est une
vérification avant insertion, pas une contrainte d'unicité transactionnelle
contre deux créations simultanées. Aucune tâche existante n'est supprimée ;
les modifications de tâches existantes ne sont pas concernées.

## Notes de livraison

Validation manuelle realisee le 1er septembre 2026 : flux chatbot vers lead chaud (85/100), resume commercial, Slack, HubSpot et webhook generique. Salesforce OAuth reste reporte car le compte de test n'est pas disponible.

Validation automatisee : lint, TypeScript, 64 tests et build Next.js de production valides.
