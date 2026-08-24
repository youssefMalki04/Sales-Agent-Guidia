# Doc6 Abonnements Tarifs Guidia

Source PDF: doc6-abonnements-tarifs-guidia.pdf

## Page 1

Guidia — Abonnements et tarifs
Doc 6 — Abonnements, tarifs et détails
fonctionnels/techniques
Page /pricing + catalogue subscription_plans + système de crédits unifié
Sources extraites du dépôt support-ia :
  • frontend/src/lib/i18n/fr/billingContent.ts (pricingFr, billingFr)
  • frontend/src/lib/i18n/fr/messageBundle.ts (home.pricing.tiers)
  • supabase/migrations/00002_stripe_subscriptions.sql
  • supabase/migrations/00106_unified_credits_system.sql
  • docs/GUIDIA-FONCTIONNALITES.fr.md §22
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Abonnements et tarifs
Page tarifs publique — /pricing
Choisissez le plan qui correspond à votre support IA.
Tous les plans incluent l'agent vocal Live, le widget embarqué et la base de connaissances RAG.
Vous payez seulement le volume de support dont vous avez besoin.
Toggle mensuel / annuel — 2 mois offerts en annuel.
Grille accueil (home.pricing.tiers)
Free
  • Prix : 0 $
  • Live : 20 min Live · Stockage : 5 Go
  • Features : Widget embarqué, Démarrage en quelques minutes
Light
  • Prix : 39 $ / mois · 400 $ / an
  • Live : 10 h Live · Stockage : 10 Go
  • Features : Widget embarqué, Mémoire de conversation
Professional
  • Prix : 399 $ / mois · 4 000 $ / an
  • Live : 100 h Live · Stockage : 50 Go
  • Features : Multi-agents, Intégrations CRM
Ultra
  • Prix : 999 $ / mois · 10 000 $ / an
  • Live : 250 h Live · Stockage : 100 Go
  • Features : Multi-agents avancés, Analytics avancés
Enterprise
  • Prix : Sur devis
  • Live : Volume Live sur mesure · Stockage : —
  • Features : Sales dédié, Support prioritaire, Formations, SLA
Catalogue subscription_plans (base Supabase)
Free (free)
Pour découvrir Guidia
  • Prix : 0 $/mois · 0 $/an (USD, migration 00002)
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Abonnements et tarifs
  • Live : 20 min / mois
  • Stockage : 5 Go
  • Crédits unifiés (00106) : 200 cr in / 100 cr out par mois (1 cr = 1000 tokens)
  • 2 000 crédits IA / mois
  • 20 minutes de support Live / mois
  • 5 Go de stockage
  • Base de connaissance limitée
  • Communauté & email best-effort
Note : Plan Free strictement bloquant en cas de dépassement.
Light (light)
Pour les petites équipes qui démarrent
  • Prix : 39 $/mois · 400 $/an (USD, migration 00002)
  • Live : 10 h / mois
  • Stockage : 10 Go
  • Crédits unifiés (00106) : 10 000 cr in / 4 000 cr out par mois
  • 14 000 crédits IA / mois
  • 10 heures de support Live / mois
  • 10 Go de stockage
  • Base de connaissance étendue
  • Widget embarqué illimité
  • Support communautaire
Note : Accès ouvert avec alertes email à 80 % et 95 %.
Starter (starter)
Pour démarrer en production
  • Prix : 199 $/mois · 2000 $/an (USD, migration 00002)
  • Live : 50 h / mois
  • Stockage : 20 Go
  • Crédits unifiés (00106) : 50 000 cr in / 15 000 cr out par mois
  • 65 000 crédits IA / mois
  • 50 heures de support Live / mois
  • 20 Go de stockage
  • Base de connaissance étendue
  • Widget embarqué illimité
  • Support standard
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Abonnements et tarifs
Note : Plan valide côté billing mais masqué sur /pricing (PricingPageClient.tsx).
Professional (professional)
Pour les équipes en croissance
  • Prix : 399 $/mois · 4000 $/an (USD, migration 00002)
  • Live : 100 h / mois
  • Stockage : 50 Go
  • Crédits unifiés (00106) : 100 000 cr in / 30 000 cr out par mois
  • 130 000 crédits IA / mois
  • 100 heures de support Live / mois
  • 50 Go de stockage
  • Base de connaissance avancée
  • Workspaces multi-équipes
  • Webhooks & intégrations CRM
  • Support prioritaire
Note : Plan recommandé (is_featured) sur la vitrine accueil.
Ultra (ultra)
Pour les volumes intensifs
  • Prix : 999 $/mois · 10000 $/an (USD, migration 00002)
  • Live : 250 h / mois
  • Stockage : 100 Go
  • Crédits unifiés (00106) : 300 000 cr in / 85 000 cr out par mois
  • 385 000 crédits IA / mois
  • 250 heures de support Live / mois
  • 100 Go de stockage
  • Base de connaissance illimitée
  • Workspaces multi-équipes
  • Webhooks, audit & intégrations avancées
  • Support prioritaire
Enterprise (enterprise)
Volume sur mesure, SLA contractuel
  • Prix : Sur devis — contact sales
  • Live : sur mesure
  • Crédits unifiés (00106) : NULL / NULL (illimité)
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Abonnements et tarifs
  • Crédits IA sur mesure
  • Volume Live sur mesure
  • Stockage et embeddings dédiés
  • SLA contractuel
  • SSO, audit & contrôles avancés
  • Customer Success Manager dédié
  • Déploiement on-premise / VPC sur demande
  • Intégrations sur mesure
Note : contact_sales=true — mailto:sales@guidia.ai (metadata migration).
Système de crédits unifié (migration 00106)
2 métriques bloquantes : credits_input et credits_output — 1 crédit = 1000 tokens. Quotas séparés
: blocage si l'un OU l'autre est épuisé.
Métrique informative non bloquante : live_seconds (temps Live consommé, affiché en h/min).
Hors crédits : max_storage_bytes (stockage S3), max_concurrent_runs (anti-DDoS).
Estimation page tarifs : 1 min Live ≈ 3 cr in + 3 cr out · 1 message chat ≈ 1 cr in + 1 cr out · 1
embedding ≈ 0,1 cr in.
Facturation console — /admin/billing
Plan actuel, statut Stripe (actif, essai, impayé, annulé…), portail Stripe, annulation fin de période ou
immédiate, réactivation.
Consommation : crédits IA entrée/sortie, stockage utilisé, temps Live consommé.
Politiques de dépassement : Bloquant · Avertir & continuer · Compter & facturer.
Alertes : email à 80 % et 95 % des crédits ; alerte visuelle console au-delà de 80 %.
Rate limiting API (billingFr)
Free : 60 req/min · Pro : 240 req/min · Enterprise : 1 200 req/min — en complément des quotas
mensuels.
FAQ tarifs (pricingFr.faqItems)
Que se passe-t-il si je dépasse mon plan ?
Le plan Free est strictement bloquant. Sur les plans payants, l'accès reste ouvert : alertes e-mail à
80 % et 95 %, alerte visuelle console. Régularisation possible sur facture suivante selon politique de
dépassement.
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Abonnements et tarifs
Puis-je changer de plan à tout moment ?
Oui. Upgrade immédiat avec proration ; downgrade en fin de période. Portail Stripe dans l'admin.
Avez-vous un essai gratuit ?
Plan  Free  sans  carte  bancaire.  Essai  sur  demande  via  Customer  Success  Manager  pour  plans
payants.
Page quotas — /admin/quota
Suivez vos crédits IA, votre temps Live et votre stockage. Changez de plan ou gérez la facturation
depuis cette page.
Wizard  onboarding  admin  —  5  étapes
(GUIDIA-FONCTIONNALITES §3.3)
  • 1. Organisation : Nom, slug, choix plan Free/Pro/Enterprise → Espace de travail créé
  • 2. Application : Nom app, domaines autorisés (validation format) → Application principale prête
  • 3. Identité visuelle : Couleur, persona avatar, locale → Config widget appliquée
  • 4. Connaissances (opt.) : Sitemap/URL ou texte produit ou passer → Indexation best-effort
  • 5. Installation : Snippet HTML, doc, checklist → Fin parcours → console
Checklist  fin  :  snippet  inséré,  domaines  cohérents,  test  navigation  privée,  doc  sécurité  si  CSP
stricte.
Estimations usage mensuel (pricingFr — repères)
1 min Live ≈ 3 cr in + 3 cr out · 1 message chat ≈ 1 cr in + 1 cr out · 1 embedding ≈ 0,1 cr in.
Les usages se cumulent — valeurs approximatives basées sur moyennes réelles.
Source : billingContent.ts, migrations Supabase, GUIDIA §22 · guidia.dev · 2026-05-20 · p.6
