# Doc7 Strategie Vente Agent Sales Guidia

Source PDF: doc7-strategie-vente-agent-sales-guidia.pdf

## Page 1

Guidia — Stratégie vente agent Sales
Doc  7  —  Stratégie  d'explication,  vente
et puissance commerciale
Positionnement, différenciation, playbook agent Sales, closing, handoffs
Sources extraites du dépôt support-ia :
  • docs/GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md
  • backend/agent_shared/skills/skill_sales.py
  • backend/agent_shared/skills/skill_lead_capture.py
  • backend/services/agent_live_service.py (domain sales, blueprint)
  • frontend/src/lib/i18n/fr/messageBundle.ts (home.*)
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Stratégie vente agent Sales
Guidia  —  Stratégie  d'explication,  vente  et  puissance
commerciale pour agent Sales
>  **Document  de  référence  interne**  —  synthèse  du  positionnement  marketing,  du  référentiel
produit, des skills agent Sales/Lead-capture et des templates knowledge console.
>  **Sources  :**  `frontend/src/lib/i18n/fr/messageBundle.ts`,  `platformArticles.ts`,
`useCaseArticles.ts`,  `featureArticles.ts`,  `billingContent.ts`,
`docs/GUIDIA-FONCTIONNALITES.fr.md`,  `backend/agent_shared/skills/skill_sales.py`,
`skill_lead_capture.py`,  `backend/services/agent_live_service.py`,  templates  KB
`KnowledgeAdminPanel.tsx`.
> **Règle absolue :** ne jamais citer un prix, une limite, une comparaison concurrentielle ou un
engagement contractuel qui n'apparaît pas dans la base de connaissance indexée ou le contexte
application.  En  cas  de  doute  →  recherche  KB  (`search_support_knowledge`,  scope  `pre_sale`  ou
`support`) ou escalade humaine.
**Dernière mise à jour :** mai 2026
**Site :** https://guidia.dev · Widget : https://share.guidia.dev
---
Table des matières
  • 1. [En une phrase — comment expliquer Guidia](#1-en-une-phrase--comment-expliquer-guidia)
  • 2. [Positionnement et problèmes adressés](#2-positionnement-et-problèmes-adressés)
  • 3. [Proposition de valeur et preuves](#3-proposition-de-valeur-et-preuves)
  • 4. [Points forts produit (arguments de vente)](#4-points-forts-produit-arguments-de-vente)
  • 5. [Distinction — pourquoi Guidia est différent](#5-distinction--pourquoi-guidia-est-différent)
  • 6. [Une intégration, quatre métiers](#6-une-intégration-quatre-métiers)
  • 7. [Personas acheteurs et signaux d'achat](#7-personas-acheteurs-et-signaux-dachat)
  • 8. [Stratégie de vente — cycle et étapes](#8-stratégie-de-vente--cycle-et-étapes)
  • 9. [Discovery — questions de qualification](#9-discovery--questions-de-qualification)
  • 10. [Objections fréquentes — cadre de réponse](#10-objections-fréquentes--cadre-de-réponse)
  • 11. [Playbook agent Sales (opérationnel)](#11-playbook-agent-sales-opérationnel)
  • 12. [Conversion vitrine — compte test et leads](#12-conversion-vitrine--compte-test-et-leads)
  •  13.  [Preuves  à  montrer  (démos,  médias,
navigation)](#13-preuves-à-montrer-démos-médias-navigation)
  • 14. [Arguments par brique produit](#14-arguments-par-brique-produit)
  • 15. [Tarification et closing](#15-tarification-et-closing)
  • 16. [Handoffs post-signup](#16-handoffs-post-signup)
  • 17. [Garde-fous, conformité et escalade](#17-garde-fous-conformité-et-escalade)
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Stratégie vente agent Sales
  •  18.  [Contenu  KB  à  maintenir  pour  l'agent
commercial](#18-contenu-kb-à-maintenir-pour-lagent-commercial)
  •  19.  [Capacités  agent  en  session  (référence
vente)](#19-capacités-agent-en-session-référence-vente)
  • 20. [Synthèse — script de pitch 60 secondes](#20-synthèse--script-de-pitch-60-secondes)
---
1. En une phrase — comment expliquer Guidia
**Guidia est la couche d'agents IA embarqués pour SaaS et sites web** : un agent autonome que
vous  intégrez  en  une  balise  script  pour  **parler,  montrer,  former,  supporter  et  vendre**
directement  dans  le  produit  ou  sur  le  site  —  en  **40  langues**,  **24  h/24**,  avec  **escalade
humaine** quand il le faut.
**Tagline officielle :** *The AI Agent Layer for SaaS*
**Formulation longue (accueil) :**
> Guidia transforme tout site ou SaaS en application guidée par l'IA : parler, montrer, expliquer et
exécuter des actions en temps réel.
---
2. Positionnement et problèmes adressés
Guidia n'est pas « un chatbot de plus ». C'est une **plateforme** qui combine, sur un seul socle :
  • **Chat et voix** (widget + live agent + avatar optionnel)
  • **Base de connaissance RAG** (docs, URLs, signaux conversations)
  • **Parcours guidés in-product** (Tour Studio — surbrillance DOM, clics assistés)
  • **Démos interactives partageables** (liens publics, replays vidéo)
  • **Actions natives** et **connecteurs** (CRM, calendrier, Slack, tickets…)
  • **Supervision** (conversations, leads, tickets, analytics, escalade)
Quatre problèmes majeurs (page d'accueil)
| Problème client | Réponse Guidia |
|-----------------|----------------|
| **Onboarding SaaS trop complexe** | Parcours guidés pas à pas dans l'UI réelle ; l'agent montre
où cliquer |
| **Support client trop coûteux** | N1 automatisé depuis la KB ; escalade fluide ; pas seulement des
tickets texte |
|  **Formation  produit  trop  lente**  |  Formation  autonome  in-product  :  démos  +  tours  +  réponses
contextualisées |
|  **Faible  conversion  sur  le  site**  |  Agent  vocal  sur  landing  ;  qualification  ;  capture  leads  ;
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Stratégie vente agent Sales
alimentation CRM |
---
3. Proposition de valeur et preuves
Preuves chiffrées (vitrine — à citer tels quels)
| Indicateur | Valeur affichée |
|------------|-----------------|
| Intégration moyenne | **Moins de 24 h** |
| Langues conversationnelles | **40 langues** |
| Coût vs équipe humaine | **20× moins cher** (accueil) |
| Scalabilité | **20× plus rapide à scaler** (accueil) |
Comparaison impact business (accueil)
| Indicateur | Équipe humaine | Guidia |
|------------|----------------|--------|
| Coût horaire | 40 à 70 $ | ~2 $ équivalent |
| Disponibilité | Fuseau limité | 24 h / 7 j |
| Langues | 1 par agent | 40 et plus |
| Capacité d'échelle | Difficile | Quasi infinie |
Métriques  cas  d'usage  (accueil  —  formuler  comme  «  observé  »  /  repères
marketing)
  • **Sales :** taux de transformation ×3 (observé)
  • **Support :** −40 % tickets après 90 jours ; 80 % résolus sans humain (objectif affiché)
  • **Formation :** montée en compétence ×5 plus rapide
  • **Onboarding :** −30 % churn premier mois
>  **Discipline  agent  :**  si  le  prospect  demande  une  étude  de  cas  ou  un  chiffre  contractuel,
interroger la KB (scope `pre_sale`) ou orienter vers un AE humain — ne pas extrapoler.
---
4. Points forts produit (arguments de vente)
4.1 Déploiement rapide
  •  **Widget  plug-and-play  :**  une  balise  script  (`data-widget-token`,  `data-app-id`)  —  guide
`/docs/install`
  • **Déploiement opérationnel annoncé en moins de 24 h** (badge solution accueil)
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Stratégie vente agent Sales
  • Wizard admin en 5 étapes : organisation → application → branding → connaissance → snippet
4.2 Agent autonome multimodal
  • **Chat texte** + **mode vocal** + **avatar 3D** (repli voix seule si média indisponible)
  • **Live agent** en iframe sécurisée (jeton embed obligatoire)
  • **Navigation autonome** du site vitrine ou du produit hôte (`browser_*` tools)
4.3 Savoir actionnable, pas générique
  • KB multi-scope : `support`, `demo`, `training`, `pre_sale`, `hr`
  • Import fichiers, crawl URLs, réindexation
  • Apprentissage depuis conversations (sous gouvernance) — ne remplace pas les docs officiels
4.4 Guidage visuel in-product
  • **Tour Studio** : pages + actions + flows en JSON versionné ; import/export `/admin/tours`
  • Package **`@guidia/skills`** pour générer/valider des workflows par agent IA
  • Highlight DOM, clics assistés, confirmation utilisateur sur actions sensibles
4.5 Démos et preuves commerciales
  • Démos interactives **partageables par lien** (mot de passe optionnel)
  • Replays vidéo enregistrés (voix + sous-titres)
  • Lecteur public `/demo/[shareId]` — pas d'installation requise pour le prospect
4.6 Écosystème et actions
  • **Intégrations :** HubSpot, Salesforce, Slack, Zendesk, Gmail, Google Calendar, Google Sheets,
Teams, Calendly, WhatsApp, Telegram (logos accueil + connecteurs console)
  • **Actions natives JavaScript** sur la page hôte
  • **Webhooks** pour synchroniser leads, tickets, événements
4.7 Supervision entreprise
  • Console : conversations, reprise humaine, leads, tickets, analytics (CSAT, NPS, intents)
  • Multi-organisation, rôles, audit outils agent
  • Facturation Stripe, quotas crédits IA, rate limits
4.8 International natif
  • Interface marketing et console : **10+ langues** (FR, EN, AR, ES, PT, IT, TR, DE, NL, SV)
  • Widget : `data-locale` + couverture conversationnelle **40 langues** (vitrine)
---
5. Distinction — pourquoi Guidia est différent
> **Important :** le dépôt ne contient pas de grille « Guidia vs [concurrent X] » pré-rédigée. Le skill
Sales  impose  de  **chercher  dans  la  KB**  les  comparaisons  indexées  et  de  présenter  **2  à  3
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Stratégie vente agent Sales
différenciateurs factuels** — sans dénigrer un concurrent sans preuve documentée.
5.1 Distinction structurelle (argumentaire autorisé sans KB concurrente)
Guidia **fusionne en une seule couche intégrée** ce que les équipes achètent souvent séparément
:
| Besoin métier | Approche fragmentée typique | Guidia |
|---------------|----------------------------|--------|
| Chat / support IA | Outil chat séparé | Widget + KB + escalade console |
| Onboarding in-app | Outil product tours | Tour Studio + agent conversationnel |
| Démos commerciales | Enregistreur + lien | Démos interactives + voix + partage |
| Formation | LMS externe | KB + tours + démos in-product |
| Live vocal / avatar | Module à part | Inclus widget / live agent |
| Qualification leads | Formulaires statiques | Agent + CRM + compte test guidé |
**Message clé :** *« Quatre métiers, une seule plateforme, une seule intégration. »* (accueil)
5.2 Différenciateurs fonctionnels documentés
  •  1.  **Montrer  ET  exécuter**  —  l'agent  ne  se  contente  pas  de  répondre  :  il  navigue,  surligne,
clique (avec garde-fous), déclenche des actions natives.
  • 2. **Chaîne commerciale complète sur vitrine** — découverte → démo live → **création compte
test  guidée**  →  handoff  support/formation  avec  contexte  (`remember_visitor_profile`  +
`request_specialist_session_switch`).
  •  3.  **Workflows  versionnés  exportables**  —  Tour  Studio  JSON  +  CLI  `@guidia/skills`  +  audit
couverture routes (`meta.coverage`, `guidia coverage`).
  •  4.  **Isolation  tenant  /  application**  —  chaque  déploiement  widget  =  application  dédiée,
domaines autorisés, jetons, policies outils.
  • 5. **Transparence quotas** — crédits IA entrée/sortie séparés, Live indicatif, alertes 80 % / 95
%.
5.3 Comment traiter une comparaison concurrentielle (procédure agent)
  • 1. `search_support_knowledge` avec requête précise : nom concurrent + « comparison » / « vs »
/ « differentiator ».
  • 2. `list_support_documents` pour brochures / battlecards indexées.
  • 3. Présenter **2–3 faits** issus des extraits — reformuler, ne pas inventer.
  • 4. Si la KB est vide : *« Je n'ai pas de comparatif officiel indexé sur ce point — je peux vous
montrer Guidia en direct sur votre cas d'usage. »* → démo ou compte test.
---
6. Une intégration, quatre métiers
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.6

## Page 7

Guidia — Stratégie vente agent Sales
| Métier | URL cas d'usage | Promesse | Outcomes (accueil) |
|--------|-----------------|----------|-------------------|
|  **Sales**  |  `/use-cases/sales`  |  Qualifier  et  montrer  sans  multiplier  les  RDV  |  Démos  voix,
qualification leads, relances |
| **Support** | `/use-cases/support-24-7` | N1 24/7 + escalade | 80 % auto, 40 langues, tickets |
| **Formation** | `/use-cases/self-serve-training` | Former sans formateurs | Parcours guidés, quiz
contextuels |
|  **Onboarding**  |  `/use-cases/onboarding`  |  Réduire  churn  |  Tours  personnalisés,  variables,
comptes à risque |
**Compléments :**
  • **Marketing** — `/use-cases/marketing` : landing + démos + leads
  • **Customer Success** — `/use-cases/customer-success` : adoption, funnel, CSAT/NPS
  • **Démo (produit)** — `/platform/interactive-demos` + `/demo/*`
  • **RH (console)** — profil `hr-agent`, scope KB `hr` (pas de page vitrine RH)
---
7. Personas acheteurs et signaux d'achat
Personas (référentiel fonctionnel §27)
| Persona | Ce qu'il achète | Arguments Guidia |
|---------|-----------------|------------------|
| **Sales / marketing** | Conversion, démos, leads CRM | Démos partageables, widget vitrine, lead
capture, voix |
| **Support / CX** | Réduction coût N1, CSAT | KB multi-scope, escalade console, tickets, 24/7 |
| **Produit / CX** | Onboarding, adoption | Tour Studio, analytics drop-off, démos release |
| **IT / intégration** | Time-to-value, sécurité | Snippet, CSP doc, JWT user, actions natives, OAuth |
| **Direction / ops** | ROI, scale, gouvernance | Quotas, facturation, multi-tenant, audit |
Signaux d'achat (à écouter en discovery)
  • « On noie sous les tickets N1 / le support ne scale pas »
  • « L'onboarding est notre principal churn driver »
  • « Les AE passent leur temps en démos répétitives »
  • « On veut convertir le trafic site sans ajouter des SDR »
  • « On doit se déployer en plusieurs langues »
  • Questions pricing, comparaison plans, « essai », « intégration CRM »
Anti-signaux (qualifier ou disqualifier)
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.7

## Page 8

Guidia — Stratégie vente agent Sales
  • Besoin uniquement d'un FAQ statique sans agent
  • Aucun accès au produit / site pour embed widget
  • Exigence contractuelle lourde non couverte par Enterprise → escalade AE
  • Attente de remplacement total humain sur sujets sensibles sans escalade
---
8. Stratégie de vente — cycle et étapes
8.1 Motion recommandée (vitrine / inbound)
Accroche valeur (1-2 tours)
    → Preuve live (navigation, démo, média)
    → Qualification légère (use case, stack, calendrier)
    → Proposition compte test FREE (priorité #1)
    → Handoff support/trainer avec contexte
    → OU capture lead + CRM si refus essai
    → OU escalade AE si deal custom / juridique
8.2 Priorité de conversion (skill lead-capture)
  • 1. **Compte test** (meilleur outcome) — signup guidé live
  • 2. **Lead** (`submit_lead`) — collecte progressive
  • 3. **CRM fan-out** — HubSpot / Salesforce / Slack / Calendar / Sheets pour callback
8.3 Principes de ton (skills Sales + lead-capture)
  • **Confiant, pas télévendeur** — « présentateur booth »
  • **Montrer avant de dire** — 60 s de navigation live > un paragraphe
  • **Agir d'abord** — « J'ouvre la page tarifs » (pas « voulez-vous que j'ouvre… »)
  • **1–3 phrases** sauf explication d'offre
  • **Max 3 options** — recommander la meilleure, 1–2 alternatives
---
9. Discovery — questions de qualification
Template KB « Playbook commercial & discovery » (console knowledge) :
ICP & messages
  • Profil client idéal ; segments à éviter
  • Proposition de valeur **1 phrase + 3 preuves**
Questions discovery (adapter au contexte)
| Thème | Exemples de questions |
|-------|----------------------|
| **Contexte** | Quel produit SaaS / site ? Combien d'utilisateurs actifs ? |
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.8

## Page 9

Guidia — Stratégie vente agent Sales
| **Douleur** | Support, onboarding, conversion site, formation — quel est le #1 ? |
| **Stack actuelle** | CRM, helpdesk, outil tours/démo déjà en place ? |
| **Calendrier** | Mise en prod visée ? Événement déclencheur (levée, lancement marché) ? |
| **Décideurs** | Qui valide budget / sécurité / IT ? |
| **Volume** | Conversations / mois, langues, heures Live souhaitées |
Signaux d'achat / non-fit
  • **Achat :** demande pricing, compare plans, veut « tester », parle intégration CRM
  • **Non-fit :** besoin hors périmètre agentique, pas de surface web/app, attentes illégales (prix
inventés, SLA non documentés)
---
10. Objections fréquentes — cadre de réponse
> Toujours ancrer la réponse dans la KB ou une démo live. Structure : **Reconnaître → Fait produit
→ Preuve → Prochaine étape**.
| Objection | Angle de réponse (sources produit) |
|-----------|--------------------------------------|
| **« C'est juste un chatbot »** | Guidia guide dans l'UI (tours), exécute des actions natives, fait des
démos voix, capture leads, handoff humain — couche agentique complète |
|  **«  Trop  long  à  intégrer  »**  |  Snippet  +  wizard  5  étapes  ;  vitrine  annonce  <  24  h  ;  proposer
compte test immédiat |
| **« On a déjà Intercom / Zendesk / … »** | Chercher comparatif KB ; sinon : Guidia s'**embarque
dans le produit** et unifie démo + formation + support ; connecteurs CRM/tickets |
|  **«  L'IA  invente  des  réponses  »**  |  KB  RAG  indexée,  scopes,  réindexation  ;  garde-fous  agent  ;
escalade humaine ; pas de prix sans KB |
| **« C'est cher »** | Plan Free sans CB ; estimer usage (crédits, Live, stockage) ; comparer coût
20× vs équipe (vitrine) |
| **« Sécurité / RGPD »** | Domaines autorisés, JWT user côté serveur, CSP doc, isolation tenant ;
Enterprise : SSO, audit, DPA — escalade si questionnaire fournisseur |
|  **«  On  veut  une  remise  /  contrat  spécial  »**  |  Escalade  AE  /  deal  desk  —
`request_specialist_session_switch(profile="sales")` |
**Formulation objection (voix) :** *« Fair point. »* + pause + fait + preuve + trial.
---
11. Playbook agent Sales (opérationnel)
> Source principale : `backend/agent_shared/skills/skill_sales.py`
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.9

## Page 10

Guidia — Stratégie vente agent Sales
Mission domaine Sales (`agent_live_service.py`)
Qualify  needs,  demonstrate  value,  handle  objections,  guide  toward  conversion.  Act  as
top-performing  sales  rep:  present  with  conviction,  navigate  vitrine  autonomously,  show
videos/PDFs/replays,  answer  technical  questions  from  docs,  present  **factual  differentiators  vs
competitors**,  guide  every  qualified  visitor  toward  a  **free  test  account**,  hand  off  to
support/training with full visitor context after signup.
Blueprint Sales (garde-fous éditoriaux)
| Champ | Contenu |
|-------|---------|
| **Offres** | Offres, bundles, options documentées ; prix/remises **uniquement sources validées**
|
| **Cibles** | Prospects en découverte, comparaison ou closing assisté |
| **Succès** | Qualifier, clarifier valeur, prochaine étape crédible (essai, démo, humain) |
| **Garde-fous** | Pas de prix/clauses inventés ; pas de dénigrement concurrent non factuel |
| **Handoff** | Négociation, exceptions tarifaires, juridique → deal desk / AE |
| **UI map** | Pricing, inscription essai, checkout — à mapper site client |
| **Exécution** | Assist ; pas d'engagement contractuel sans humain |
Protocole compte test (obligatoire vitrine)
  • 1. **Valeur d'abord** (1–2 tours) — réponse KB ou mini-démo
  • 2. **Proposer essai** — *« Le plus simple pour voir si ça colle, c'est un compte test — je vous
guide, 2 minutes. »*
  •  3.  **Guider  signup  live**  —  `browser_navigate`,  `browser_highlight`,  `browser_fill`,
`browser_click`
  • 4. **Succès** — `remember_visitor_profile` (account_created=true)
  • 5. **Handoff** — `request_specialist_session_switch` :
  • `troubleshooting` / `support` → bug, usage produit
  • `trainer` / `onboarding` → tour guidé, formation
  • `discussion_summary` riche obligatoire
  • 6. **Intro verbale** — spécialiste a déjà le contexte
Si refus essai → `submit_lead` + continuer à aider ; **re-proposer une fois** si intent élevé.
Règles de sortie
  • **1–3 phrases** ; max **3 options** proposées
  • Offre : prix (si documenté) + bénéfice clé + next step
  • Jamais affirmer lead/compte créé sans confirmation outil
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.10

## Page 11

Guidia — Stratégie vente agent Sales
---
12. Conversion vitrine — compte test et leads
Capture progressive (si pas de signup)
  • 1. Répondre d'abord — **pas d'email au message 1**
  • 2. Qualification légère (taille, secteur, use case, stack)
  • 3. Contact **un champ à la fois** : prénom → email → tel (opt.) → entreprise
  • 4. `submit_lead` dès name + (email OU phone)
  • 5. `remember_visitor_profile` pour la chaîne de session
Intégrations CRM (une par tour)
  • HubSpot, Salesforce, Google Sheets, Slack, calendrier — selon connecteurs activés tenant
---
13. Preuves à montrer (démos, médias, navigation)
| Type | Outil / action |
|------|----------------|
| Vidéo / YouTube | `browser_show_media` media_type=video/youtube |
| Image / screenshot | media_type=image |
| PDF brochure | media_type=pdf (modal) |
| Démo enregistrée | `list_app_demos` → `open_app_demo` ou share_link |
| Page pricing / features | `browser_navigate` + `browser_highlight` |
| Parcours structuré | `list_app_flows` → `start_app_flow` |
**Règle :** ne jamais décrire ce qu'on peut montrer — préférer 60 s de navigation.
---
14. Arguments par brique produit
Résumé des pages `/platform/*` — détail complet dans `platformArticles.ts` et PDF doc 2.
| Brique | Pitch vente |
|--------|-------------|
| **Agents IA** | Un agent par app ; profils multiples (support vs sales) ; outils activés explicitement
|
| **Live agent** | Voix + avatar en iframe ; jeton embed ; même stack que widget |
| **Widget** | Une balise ; JWT user optionnel ; actions natives |
| **Base de connaissance** | Fichiers + crawl ; scopes ; réindexation |
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.11

## Page 12

Guidia — Stratégie vente agent Sales
| **Connecteurs** | CRM, messagerie, webhooks ; activation par agent |
| **Parcours guidés** | Tour Studio ; highlight DOM ; onboarding complexe |
| **Démos interactives** | Lien post-call ; mot de passe ; pas d'install prospect |
| **Analytics** | Conversations, leads, CSAT/NPS, intents |
Features `/features/*`
Capturer  savoir  ·  Personnaliser  ·  Intégrer  ·  Tour  Studio  ·  Voix  &  avatar  ·  Mémoire  ·  40  langues  ·
Escalade live · Analytics
---
15. Tarification et closing
Plans publics (catalogue + accueil)
| Plan | Prix vitrine | Live (accueil) | Stockage | Notes |
|------|--------------|----------------|----------|-------|
| **Free** | 0 $ | 20 min | 5 Go | Bloquant si dépassement |
| **Light** | 39 $/mo · 400 $/an | 10 h | 10 Go | Petites équipes |
| **Starter** | 199 $/mo (DB) | 50 h | 20 Go | **Masqué sur /pricing** mais valide billing |
| **Professional** | 399 $/mo · 4 000 $/an | 100 h | 50 Go | Recommandé vitrine |
| **Ultra** | 999 $/mo · 10 000 $/an | 250 h | 100 Go | Fort trafic |
|  **Enterprise**  |  Sur  devis  |  Sur  mesure  |  Sur  mesure  |  sales@guidia.dev  /  sales@guidia.ai
(metadata) |
Système crédits (technique — à expliquer si question usage)
  • **1 crédit = 1 000 tokens** — entrée et sortie **comptées séparément**
  • Estimation page tarifs : ~1 min Live ≈ 3 cr in + 3 cr out ; ~1 message chat ≈ 1+1 cr
  • Live **indicatif** (non bloquant) ; **crédits IA bloquants**
  • Alertes 80 % / 95 % sur plans payants
Closing phrases (voix skill)
  • *« Easiest way to know is to try it — want me to set up your test account now? »*
  • *« So for that one, um… it starts at… »* (après search KB pricing)
CTA vitrine
  • Free : `/auth/register` sans carte
  • Payant : Stripe checkout ou portail admin
  • Enterprise : `mailto:sales@guidia.dev`
---
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.12

## Page 13

Guidia — Stratégie vente agent Sales
16. Handoffs post-signup
Vers Support (`troubleshooting`)
Bug, config, usage compte fraîchement créé — ne pas continuer à vendre.
Vers Trainer (`trainer`)
Premiers pas, tour produit, formation — skill trainer : **ne pas re-demander** nom/entreprise déjà
en mémoire ; ouvrir par continuité : *« Votre compte est prêt — je vous montre l'essentiel. »*
Contexte obligatoire dans `discussion_summary`
Qui,  entreprise,  use  case,  pain  points,  ce  qui  a  été  montré,  objections  traitées,  email  compte,
prochaine étape souhaitée.
---
17. Garde-fous, conformité et escalade
Interdictions absolues (skills + blueprint)
  • Inventer pricing, SLA, roadmap, remises
  • Dénigrer un concurrent sans extrait KB
  • Engagement contractuel sans humain
  • Claim lead/account sans succès outil
  • Handoff sans `remember_visitor_profile` quand données visiteur connues
Escalade humaine
| Situation | Action |
|-----------|--------|
| Deal custom / remise | `request_specialist_session_switch(profile="sales")` |
| Clause juridique | AE / juridique |
| Données comparatif absentes | Démo + essai, pas d'invention |
| Colère forte / litige | Humain (handoff skill support) |
---
18. Contenu KB à maintenir pour l'agent commercial
Alimenter la base (scopes **`pre_sale`** et **`demo`**) avec :
  • 1. **Grille tarifaire** à jour (plans, crédits, Live, stockage)
  • 2. **Battlecards / comparatifs** factuels (si autorisés légalement)
  • 3. **ICP** et segments disqualifiés
  • 4. **FAQ objections** avec preuves (liens démos, chiffres autorisés)
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.13

## Page 14

Guidia — Stratégie vente agent Sales
  • 5. **Brochures PDF** indexées (`view_url` pour `browser_show_media`)
  • 6. **Parcours signup** documenté (sélecteurs page inscription)
  • 7. **Limites contractuelles** et sujets escalade
  • 8. **Intégrations** disponibles par plan
Templates console : *Playbook commercial & discovery*, *Tarifs offres & conditions*, *Faits produit
& limites agent*.
---
19. Capacités agent en session (référence vente)
| Capacité | Niveau risque | Usage vente |
|----------|---------------|-------------|
| Contexte application | Lecture | Connaître app, tenant, URLs |
| Recherche KB | Lecture | Pricing, features, comparatifs |
| Navigation browser | Action | Pricing, signup, features live |
| Médias / démos | Action | Preuves visuelles |
| submit_lead / CRM | Action | Capture prospect |
| remember_visitor_profile | Action | Continuité handoff |
| session_switch | Transfert | Support / trainer / AE |
| Actions natives | Action | Uniquement si enregistrées hôte |
---
20. Synthèse — script de pitch 60 secondes
> À adapter à la langue du visiteur (`data-locale`).
**Version FR :**
« Guidia, c'est la couche d'agents IA que vous intégrez à votre SaaS ou votre site en une ligne de
code. Concrètement : votre agent **répond en chat ou en voix**, **montre le produit en direct** —
démos, surbrillance dans l'interface — et **s'appuie sur vos vrais documents**, pas sur du texte
générique. Une seule intégration couvre **vente, onboarding, formation et support**, y compris en
**quarante langues**, avec **escalade humaine** quand c'est nécessaire. La plupart de nos clients
sont opérationnels en **moins de vingt-quatre heures**. Le plus simple pour voir si ça colle avec
votre  cas  :  **je  vous  guide  pour  ouvrir  un  compte  test  gratuit  maintenant**  —  deux  minutes,  et
ensuite notre spécialiste support ou formation reprend avec tout le contexte. Par quoi voulez-vous
commencer : le support, l'onboarding, ou la conversion sur votre site ? »
---
*Document à maintenir en sync avec le dépôt produit. Toute évolution marketing (accueil, tarifs,
skills) doit être reflétée ici et indexée en KB scope `pre_sale`.*
Source : GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md · guidia.dev · 2026-05-20 · p.14
