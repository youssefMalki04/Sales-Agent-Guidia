# Doc3 Cas Usages Guidia

Source PDF: doc3-cas-usages-guidia.pdf

## Page 1

Guidia — Cas d'usage
Doc  3  —  Cas  d'usage  Guidia  (support,
formations, démo, sales, RH)
Pages /use-cases/* + capacité démo + profil agent RH (console)
Sources extraites du dépôt support-ia :
  • frontend/src/lib/i18n-app/useCaseArticles.ts
  • frontend/src/lib/i18n-app/platformArticles.ts (interactive-demos)
  • backend/services/agent_live_service.py (hr-agent)
  • supabase/migrations/00110_knowledge_scopes_pre_sale_hr.sql
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Cas d'usage
Hub cas d'usage — /use-cases
Les  cas  d'usage  livrés  avec  une  seule  intégration  —  Sales,  marketing,  onboarding,  formation,
support continu et customer success.
  • /use-cases/sales — Sales : Démos en voix, qualification et relance des deals.
  • /use-cases/marketing — Marketing : Landing pages avec démos interactives et capture de leads.
  • /use-cases/onboarding — Onboarding : Vos nouveaux comptes accompagnés jusqu'au premier
moment de valeur.
  •  /use-cases/self-serve-training  —  Formation  autonome  :  Vos  équipes  et  clients  formés  sans
recruter de formateurs.
  • /use-cases/support-24-7 — Support 24/7 : Niveau 1 automatisé, escalade quand il faut.
  • /use-cases/customer-success — Customer Success : Adoption, expansion et signaux de churn en
continu.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Cas d'usage
/use-cases/sales — Sales
Qualifier et montrer le produit sans multiplier les rendez-vous
Vous  publiez  des  démos  accessibles  par  lien,  vous  ouvrez  le  widget  vocal  sur  vos  pages  de
conversion et vous centralisez les leads capturés.
Démonstrations guidées
Les  démos  publiques  rejouent  un  parcours  enregistré  ou  scripté  dans  un  lecteur  dédié.  Vous
partagez un lien après un échange commercial sans obliger le prospect à installer votre logiciel.
Les parcours peuvent être protégés par mot de passe lorsque votre processus l'exige.
Voix et widget
Le  widget  peut  fonctionner  en  mode  vocal  lorsque  vous  l'activez  :  la  même  configuration  métier
sert au chat et à la prise de parole, ce qui évite de dupliquer les scripts.
La locale du widget (data-locale) aligne la langue de la session avec votre audience.
Suivi des leads
Les tables leads de la console agrègent les fiches issues des interactions pour que le commercial
retrouve coordonnées et contexte sans changer d'outil.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Cas d'usage
/use-cases/marketing — Marketing
Campagnes qui se terminent par une conversation utile
Le  snippet  widget  se  pose  sur  vos  pages  acquisition.  Les  démos  interactives  prolongent  une
campagne sans friction.
Installation légère
Le guide d'installation décrit la balise script et les attributs obligatoires pour relier une landing à
votre application Guidia.
Les couleurs et textes d'accueil reprennent votre branding depuis les réglages console.
Démo comme média
Une  démo  publique  devient  un  lien  à  insérer  dans  vos  newsletters  ou  pubs  :  la  lectrice  ouvre  la
page et voit un parcours fidèle au produit.
Mesure
Les écrans analytics comptent les vues de démo, les sessions widget et les intents récurrents pour
ajuster votre message sans export manuel permanent.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Cas d'usage
/use-cases/onboarding — Onboarding
Accompagner un nouveau compte dans l'interface réelle
Les tours publiés depuis le studio décrivent pages et actions. Le runtime Guidia met en avant les
éléments pertinents tant que votre SaaS charge le widget.
Modélisation
Le  studio  admin  assemble  pages,  actions  et  enchaînements.  Une  fois  publié,  le  parcours  est
disponible pour l'agent comme pour l'utilisateur final.
Guidage dans le DOM
Le moteur navigateur peut souligner un champ ou un bouton précis pendant que l'agent explique
l'étape suivante.
Combinaison conversationnelle
Le chat répond aux questions hors script pendant que le tour garde la progression : l'utilisateur n'a
pas à choisir entre FAQ et walkthrough.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Cas d'usage
/use-cases/self-serve-training — Formation autonome
Remplacer les sessions live répétitives par du contenu actionnable
La  même  base  de  connaissance  alimente  réponses  et  scripts.  Les  tours  couvrent  les  gestes
complexes ; les démos servent de replay.
Documentation vivante
Les  documents  indexés  dans  la  console  sont  cités  pendant  une  conversation  :  les  apprenants
obtiennent la procédure à jour sans fusionner plusieurs PDF.
Formats complémentaires
Une démo interactive résume un module long en quelques minutes.
Un parcours guidé force le passage dans les écrans critiques lorsque la lecture passive ne suffit pas.
Déploiement
Le widget reste disponible dans votre espace client ou intranet : aucune salle de formation n'est
nécessaire pour lancer une nouvelle vague d'utilisateurs.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.6

## Page 7

Guidia — Cas d'usage
/use-cases/support-24-7 — Support 24/7
Automatiser le premier niveau sans fermer la porte à un humain
L'agent consulte vos sources officielles, ouvre ou enrichit des tickets lorsque votre connecteur le
permet, et un membre de l'équipe peut reprendre la discussion.
Couverture continue
Le widget reste disponible sur vos fuseaux ouverts par défaut ; la langue suit la locale configurée
pour éviter les réponses hors contexte.
Escalade maîtrisée
Les  notifications  email  alertent  votre  équipe  lorsqu'un  utilisateur  demande  explicitement  un
humain.
La console conversations permet la reprise en direct et les réponses opérateur dans le même fil.
Traçabilité
Les intentions et sujets fréquents apparaissent dans les analytics pour savoir quelles sections de
documentation méritent un renforcement.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.7

## Page 8

Guidia — Cas d'usage
/use-cases/customer-success — Customer Success
Voir l'adoption sans construire un entrepôt ad hoc
Les métriques exploitent les événements déjà collectés : conversations, leads, tickets, formulaires
CSAT et NPS.
Santé du compte
Les  volumes  de  conversations  et  les  motifs  récurrents  donnent  un  signal  rapide  sur  les  espaces
clients qui peinent avec une fonctionnalité précise.
Expansion et leads
Le  funnel  leads  relie  les  demandes  qualifiées  aux  étapes  suivantes  dans  votre  processus
commercial lorsque vous synchronisez les données vers vos outils métiers.
Satisfaction
Les collects post-session alimentent les scores agrégés affichés sur le tableau de bord et peuvent
être découpées par mode vitrine ou widget intégré.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.8

## Page 9

Guidia — Cas d'usage
Cas  d'usage  Démo  (capacité  produit  —  pas  de  slug
/use-cases/demo)
URL  produit  :  /platform/interactive-demos  ·  Routes  publiques  :  /demo/[shareId],  /demo/runtime,
/demo/recordings/[shareId]
Démos interactives — page plateforme
Montrer  le  produit  sans  friction  —  démo  enregistrée  ou  scriptée,  identifiant  de  partage,  lecteur
dédié.
Partage contrôlé
Chaque démo publique possède une URL du site Guidia. Vous pouvez exiger un mot de passe ou
passer des variables d'accueil lorsque vous en définissez.
Les robots d'indexation sont exclus de ces pages pour éviter d'exposer un parcours interne.
Cas d'usage
Les équipes avant-vente envoient un lien après un appel. Le marketing dépose une version stable
après chaque release majeure.
Le lecteur rejoue le scénario sans demander à l'invité d'installer votre logiciel.
Cohérence avec la plateforme
Les  démos  réutilisent  les  ressources  Guidia  déjà  configurées  pour  votre  tenant  (voix,  avatar,
contenus). Il s'agit du même socle que le widget, présenté sous une forme isolée.
Cas  d'usage  RH  (profil  agent  console  —  pas  de  page
marketing dédiée)
Note documentaire : aucune page /use-cases/rh sur le site vitrine. Le domaine RH existe comme
profil d'agent et scope knowledge en console.
Profil hr-agent (backend/services/agent_live_service.py)
  • Label : Agent RH
  •  Description  :  Agent  dédié  aux  processus  RH,  à  l'onboarding  collaborateur  et  aux  politiques
internes.
  • Domain : hr · Persona : assistant · Ton : calm
  • Skills : hr-operations, knowledge-rag, ui-navigation, human-handoff
  • Participant : Leda — Spécialiste RH — guide employees through HR workflows, onboarding and
operational questions with policy-safe answers and escalate sensitive cases.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.9

## Page 10

Guidia — Cas d'usage
Mission domaine HR
Guide candidates and employees through HR operations, recruitment and onboarding with clarity.
Act  as  a  professional  HR  advisor:  explain  offers,  present  company  culture  and  mission,  process
applications live, and navigate HR portals while protecting sensitive data.
Message d'accueil RH
Bonjour. Je peux vous orienter sur les démarches RH et l'accès aux ressources internes (congés,
onboarding, politiques publiées). De quoi avez-vous besoin ?
Scopes knowledge (migration 00110)
Scopes  autorisés  :  support,  demo,  training,  pre_sale,  hr  —  le  scope  hr  alimente  la  base
documentaire RH.
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.10

## Page 11

Guidia — Cas d'usage
Playbook  agent  Sales  (skill_sales.py  —  extrait
opérationnel)
Mission  :  qualification,  démos  live,  conversion  compte  test,  objections  factuelles,  handoff
support/training.
Protocole compte test vitrine
  • 1. Valeur d'abord (1-2 tours) — KB ou mini-démo
  • 2. Proposer essai gratuit guidé (2 minutes)
  • 3. Guider signup live (browser_navigate, highlight, fill, click)
  • 4. remember_visitor_profile avec account_created=true
  • 5. request_specialist_session_switch vers support ou trainer + discussion_summary
  • 6. Intro verbale : le spécialiste reprend avec tout le contexte
Garde-fous Sales
  • Jamais inventer pricing, SLA, roadmap, remises
  •  Comparatif  concurrent  :  search  KB  —  2-3  différenciateurs  factuels,  pas  de  dénigrement  sans
preuve
  • Deal custom → request_specialist_session_switch profile=sales
  • Ne jamais affirmer lead/compte créé sans confirmation outil
Document  stratégie  vente  complet  :  docs/GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md  (PDF
doc7).
Source : useCaseArticles.ts, platformArticles, agent_live_service.py · guidia.dev · 2026-05-20 · p.11
