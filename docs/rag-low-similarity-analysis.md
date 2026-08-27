# Analyse des faibles similarites RAG

Ce document sert a suivre les tests manuels de recherche RAG et a identifier les cas ou les resultats sont faibles, absents ou peu pertinents.

## Objectif

Verifier que la recherche RAG retourne des chunks utiles pour les questions commerciales frequentes, puis decider s'il faut :

- garder les parametres actuels ;
- ajouter une FAQ ou un document dans la base knowledge ;
- ajuster `matchThreshold` ;
- ajuster `matchCount` ;
- revoir le decoupage des chunks.

## Commande de test

```bash
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{"query":"Votre solution fonctionne avec Shopify ?","matchCount":5}'
```

## Grille d'analyse

| Question testee | Resultats | Similarite observee | Pertinence | Decision |
| --- | --- | --- | --- | --- |
| Votre solution fonctionne avec Shopify ? | Chunks integration / CRM / webhooks | Correcte | Pertinent, mais Shopify peut etre rendu plus explicite | Ajouter une FAQ Shopify si l'encadrant valide |
| Quels sont vos tarifs et abonnements ? | Chunks pricing et plans | Bonne | Pertinent | Garder les parametres actuels |
| Comment vous protegez les donnees des clients ? | Chunks securite / RGPD | Bonne | Pertinent | Garder les parametres actuels |

## Cas a surveiller

| Type de probleme | Exemple | Action recommandee |
| --- | --- | --- |
| Aucun resultat | Question sur un cas d'usage non documente | Ajouter une FAQ ou un document source |
| Score faible mais contenu utile | Question avec vocabulaire different de celui des docs | Ajouter des synonymes dans la base knowledge |
| Score correct mais mauvais sujet | Resultat pricing pour une question securite | Revoir le chunking ou augmenter la precision du seuil |
| Trop peu de contexte | Un seul chunk retourne alors que la question est large | Augmenter `matchCount` |
| Trop de bruit | Plusieurs chunks hors sujet | Augmenter `matchThreshold` |

## Regle de decision

Un cas est considere comme faible si :

- aucun chunk n'est retourne ;
- le meilleur chunk ne repond pas directement a la question ;
- la categorie retournee ne correspond pas au sujet demande ;
- le commercial ne peut pas utiliser le contexte pour repondre au prospect.

Avant de modifier les parametres RAG, verifier d'abord si l'information existe vraiment dans les documents indexes.
