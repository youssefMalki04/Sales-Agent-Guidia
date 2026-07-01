# Leadia - Sécurité

Leadia traite des conversations commerciales et des informations de leads. La sécurité des données est donc une priorité.

## Données collectées

Leadia peut collecter:

- Nom du visiteur.
- Email.
- Entreprise.
- Pays.
- Secteur.
- Besoin commercial.
- Budget.
- Urgence.
- Historique de conversation.

## Bonnes pratiques

Les clés API comme Supabase, Gemini, HubSpot, Salesforce et Slack doivent rester dans `.env.local` en développement et dans les variables d'environnement du serveur en production.

Les clés privées ne doivent jamais être exposées côté navigateur.

La clé Supabase service role doit être utilisée uniquement côté serveur ou dans des scripts internes.

## Accès aux données

Les leads qualifiés sont stockés dans Supabase. Les accès doivent être contrôlés avec des règles RLS et des endpoints serveur.

Les exports CRM doivent envoyer seulement les champs nécessaires au traitement commercial.

## Objection sécurité

Si un visiteur demande si les données sont sécurisées, l'agent doit expliquer que les informations sensibles sont stockées côté serveur, que les clés API ne sont pas exposées au client et que les exports CRM sont contrôlés.

L'agent peut proposer une discussion technique si le visiteur demande des détails sur conformité, hébergement ou politique de conservation des données.
