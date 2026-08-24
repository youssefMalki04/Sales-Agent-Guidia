# Doc4 Fonctionnalites Guidia

Source PDF: doc4-fonctionnalites-guidia.pdf

## Page 1

Guidia — Fonctionnalités
Doc  4  —  Toutes  les  fonctionnalités  du
projet Guidia
Articles /features/* complets + référentiel fonctionnel intégral
Sources extraites du dépôt support-ia :
  • docs/GUIDIA-FONCTIONNALITES.fr.md (~1000 lignes, mai 2026)
  • frontend/src/lib/i18n-app/featureArticles.ts (9 articles FR)
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Fonctionnalités
Articles marketing /features/* — contenu intégral
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Fonctionnalités
/features/capture-knowledge — Capturer le savoir
Alimenter l'agent avec vos sources réelles
La console knowledge accepte fichiers, texte et URLs crawlées. Contenus rangés par périmètre et
préparés pour retrieval.
Fichiers et pages
Formats  admin  :  documents  texte,  bureautiques,  images,  vidéo  si  déploiement  autorise.  Résumé
métier indexable avec la pièce.
URLs  crawlées  →  docs  alignés  site  public  ou  centre  d'aide.  Titre,  tags,  périmètre  (support,
expérience produit…).
Ce qui est indexé
Texte découpé et stocké. Réindexation après mise à jour importante.
Retours conversations
Apprentissage auto depuis transcripts si activé — alimente mémoire agent sous gouvernance, ne
remplace pas docs officiels.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Fonctionnalités
/features/personalize — Personnaliser
Variables, charte et voix par contexte
Console  :  marque  organisationnelle,  thème  widget,  écrans  plein  page.  Profils  agent  =  ton  et
consignes.
Marque et widget
Couleurs, textes d'accueil, comportement widget. Section expériences plein écran.
Réglages injectés au bootstrap.
Variables dynamiques
Bootstrap et attributs balise : identité compte, segment, page courante.
Ton et instructions
Agent Studio : style et limites par cas d'usage. Dupliquer profil pour audiences multiples.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Fonctionnalités
/features/embed — Intégrer
Une balise pour rendre l'agent disponible
Guide installation : attributs obligatoires et options pour brancher le widget.
Ce que vous ajoutez
Script Guidia + jeton public + app id. Locale, position, couleur, API override debug.
Contexte navigateur
URL, titre, langue document remontés. JWT user si identité forte requise.
Cadre sécurité
Docs CSP et headers pour pages durcies — éviter blocage chargeur.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Fonctionnalités
/features/tour-studio — Tour Studio
Composer, exporter et importer des parcours guidés
Workflow JSON versionné — import/export /admin/tours ou @guidia/skills hors ligne.
Trois couches
Page (vue stable) · Action (clic, saisie…) · Flow (étapes guidées). Clés lisibles, pas d'ids DB.
Import / Export console
merge (upsert) ou replace (destructif). Tags import:<id> pour rollback.
Génération IA
Onglet Générer : captures, vidéo, HTML, Git/ZIP + complément JSON import.
Package @guidia/skills
Builder workflow(), validateur, CLI guidia init|validate|coverage. Doc /docs/tour-studio-bundle.
Couverture
meta.coverage + guidia coverage --mode bundle|custom|repo.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.6

## Page 7

Guidia — Fonctionnalités
/features/voice-and-avatar — Voix et avatar
Parler à l'agent comme dans un produit natif
Mode vocal widget + avatar 3D optionnel ; repli voix seule si média échoue.
Voix
Session  vocale  depuis  widget  si  activé.  Synthèse  et  reconnaissance  selon  navigateur  et  réglages
org.
Avatar 3D
Accompagne la parole si assets disponibles ; fallback voix seule.
Session live intégrée
Route embed live : micro plein écran, même config métier que widget.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.7

## Page 8

Guidia — Fonctionnalités
/features/memory-and-context — Mémoire et contexte
Gardez le fil sans dupliquer votre CRM
Mémoire session + historique widget + données structurées transmises par l'hôte.
Conversation active
Tours et messages conservés ; historique récent si activé.
Faits visiteur
Extractions sous opt-in, TTL configurable, validation équipe possible.
Données fournies
Variables  bootstrap  et  JWT  =  source  de  vérité  compte/rôle  —  Guidia  complète,  ne  remplace  pas
CRM.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.8

## Page 9

Guidia — Fonctionnalités
/features/languages — 40 langues
Servir plusieurs marchés sans multiplier les équipes
data-locale ou langue document ; vitrine annonce couverture large conversationnelle.
Réglage site
data-locale → bootstrap et contexte alignés accueil, prompts, TTS basique.
Interface widget
Chaînes multilingues dans bundle widget rebuildable.
Expérience conversationnelle
Langue session + docs traduits fournis par le client — éviter mélanges.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.9

## Page 10

Guidia — Fonctionnalités
/features/live-escalation — Escalade live
Passer la main quand la situation l'exige
Reprise humaine console, réponses opérateur, notifications email.
Reprise console
Bascule mode humain — fil conservé pour le client.
Modes visibles
Agent, humain ou hybride listés pour supervision.
Notifications
Emails internes si visiteur demande humain ou agent signale blocage.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.10

## Page 11

Guidia — Fonctionnalités
/features/analytics — Analytics
Mesurer ce qui se passe après l'installation
Agrégats événements tenant : conversations, funnel leads, tickets, CSAT/NPS.
Opérationnel
Volume conversations, leads, tendances journalières, intents et sujets.
Qualité
Formulaires fin de session → CSAT, NPS, sentiment. Segment vitrine vs widget.
Pour aller plus loin
Exports et webhooks vers entrepôt si besoin.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.11

## Page 12

Guidia — Fonctionnalités
Référentiel fonctionnel complet
Contenu intégral de docs/GUIDIA-FONCTIONNALITES.fr.md ci-dessous.
Guidia — Référentiel fonctionnel complet
> Document de référence interne : **toutes les capacités produit** telles qu’elles existent dans la
plateforme Guidia, décrites du point de vue **métier et utilisateur**, sans détail d’implémentation
technique ni de fournisseurs d’infrastructure.
**Dernière mise à jour :** mai 2026
**Périmètre  :**  console  administrateur,  widget  embarqué,  pages  publiques  (démos,  replays,
documentation), API d’orchestration.
---
Table des matières
  • 1. [Vision produit](#1-vision-produit)
  • 2. [Modèle organisationnel](#2-modèle-organisationnel)
  • 3. [Parcours de mise en route](#3-parcours-de-mise-en-route)
  • 4. [Console administrateur](#4-console-administrateur)
  • 5. [Applications et sécurité d’intégration](#5-applications-et-sécurité-dintégration)
  • 6. [Widget embarqué](#6-widget-embarqué)
  • 7. [Agent conversationnel (chat)](#7-agent-conversationnel-chat)
  • 8. [Agent Live (voix et avatar)](#8-agent-live-voix-et-avatar)
  • 9. [Agent Studio — configuration des agents](#9-agent-studio--configuration-des-agents)
  • 10. [Base de connaissances](#10-base-de-connaissances)
  •  11.  [Tour  Studio  —  parcours  guidés  dans  le
produit](#11-tour-studio--parcours-guidés-dans-le-produit)
  • 12. [Démonstrations interactives](#12-démonstrations-interactives)
  • 13. [Replays vidéo des démos](#13-replays-vidéo-des-démos)
  • 14. [Conversations et escalade humaine](#14-conversations-et-escalade-humaine)
  • 15. [Leads](#15-leads)
  • 16. [Tickets support](#16-tickets-support)
  • 17. [Analytics et mesure](#17-analytics-et-mesure)
  • 18. [Connecteurs et outils agent](#18-connecteurs-et-outils-agent)
  • 19. [Webhooks et alertes](#19-webhooks-et-alertes)
  • 20. [Branding et personnalisation](#20-branding-et-personnalisation)
  • 21. [Collaboration et gouvernance](#21-collaboration-et-gouvernance)
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.12

## Page 13

Guidia — Fonctionnalités
  • 22. [Facturation, plans et quotas](#22-facturation-plans-et-quotas)
  •  23.  [Ressources  médias  et  documents
d’expérience](#23-ressources-médias-et-documents-dexpérience)
  •  24.  [Site  vitrine,  documentation  et  contenus
marketing](#24-site-vitrine-documentation-et-contenus-marketing)
  • 25. [Capacités de l’agent en session (référence)](#25-capacités-de-lagent-en-session-référence)
  • 26. [Matrice des rôles et permissions](#26-matrice-des-rôles-et-permissions)
  • 27. [Synthèse par persona](#27-synthèse-par-persona)
---
1. Vision produit
Guidia est une **plateforme d’agents IA embarqués** conçue pour les éditeurs de logiciels (SaaS,
applications métier, portails clients). Elle permet de :
  • **Répondre** aux utilisateurs et visiteurs dans le produit (chat, voix, avatar optionnel).
  • **Guider** visuellement dans l’interface (parcours pas à pas, surbrillance, clics assistés).
  • **Démontrer** le produit (scénarios interactifs, partage public, replays vidéo).
  • **Capturer** le savoir (documents, pages web, notes métier, signaux issus des conversations).
  •  **Agir**  dans  l’écosystème  client  (actions  natives  sur  la  page  hôte,  connecteurs  CRM,
messagerie, calendrier, tickets).
  • **Superviser** l’activité (conversations, leads, tickets, analytics, escalade humaine).
Tout  le  contenu  et  la  configuration  sont  **isolés  par  organisation**  puis  **rattachés  à  une
application** (un site ou un produit où le widget est déployé).
---
2. Modèle organisationnel
2.1 Organisation (tenant)
Une **organisation** est l’espace de travail racine. Elle porte :
| Attribut | Description |
|----------|-------------|
| Nom | Libellé affiché dans la console |
| Slug | Identifiant URL unique (minuscules, chiffres, tirets) |
| Plan tarifaire | Free, Light, Starter, Professional, Ultra, Enterprise (selon déploiement) |
| Locale par défaut | Langue organisationnelle de référence |
| Domaine personnalisé | Optionnel (ex. `app.exemple.com`) |
| Couleur primaire | Identité visuelle de base |
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.13

## Page 14

Guidia — Fonctionnalités
| Statut | Active ou désactivée (suspension de l’accès) |
**Actions  disponibles  :**  création,  édition,  activation/désactivation,  suppression  définitive  (avec
suppression  en  cascade  de  toutes  les  applications  et  données  liées),  consultation  du  détail
(identifiant, date de création).
2.2 Application
Une  **application**  correspond  à  **un  déploiement  du  widget**  (un  site,  un  environnement,  un
produit). Chaque application possède :
| Attribut | Description |
|----------|-------------|
| Nom et slug | Identifiants métier (slug unique par organisation) |
| Description | Texte libre |
| URL de base | URL publique du produit (recommandé en production) |
| Domaines autorisés | Liste des hôtes autorisés à charger le widget (vide = toute origine, réservé
au développement) |
| Jeton widget | Secret d’intégration côté client (régénérable ; invalide l’ancien immédiatement) |
| Identifiant public | Référence non secrète de l’application |
| Statut | Active ou inactive |
| Secret utilisateur | Pour signer les jetons d’identité des utilisateurs connectés (voir §5.3) |
| API utilisateur courant | Configuration optionnelle d’un point de terminaison hôte pour résoudre
l’utilisateur connecté |
**Suppression d’une application :** action irréversible ; efface sessions, démos, parcours, base de
connaissance, configurations widget et contenus associés. Confirmation par saisie du slug.
2.3 Sélecteur de périmètre (console)
En haut de la console, un **sélecteur Organisation / Application** filtre toutes les pages métier :
connaissance,  parcours,  agents,  branding,  conversations,  etc.  Sans  application  sélectionnée,  les
écrans affichent un état vide guidé.
2.4 Hiérarchie des données
Organisation
 └── Application(s)
      ├── Agents (profils, skills, blueprint)
      ├── Base de connaissances
      ├── Tour Studio (pages, actions, flows)
      ├── Démonstrations (scénarios)
      ├── Replays vidéo
      ├── Conversations / sessions
      ├── Leads / tickets
      ├── Branding widget
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.14

## Page 15

Guidia — Fonctionnalités
      ├── Webhooks / alertes
      └── Politiques d’outils
---
3. Parcours de mise en route
3.1 Inscription et authentification
  • **Création de compte** par e-mail (confirmation par lien).
  • **Connexion** / déconnexion.
  • **Mot de passe oublié** et **mise à jour du mot de passe** (ré-authentification requise pour le
changement).
  • **Acceptation d’invitation** (lien magique, validité limitée dans le temps).
  • Redirection automatique vers la page demandée après connexion (`?next=`).
3.2 Onboarding minimal
Si l’espace de travail n’est pas configuré, redirection vers **`/admin/onboarding`** :
  • Création d’une organisation (nom + slug).
  • Création d’une première application par défaut.
  • Accès immédiat à la console après validation.
3.3 Assistant guidé en 5 étapes (`/admin/onboarding/wizard`)
| Étape | Contenu | Résultat |
|-------|---------|----------|
| 1. Organisation | Nom, slug, choix du plan (Free / Pro / Enterprise) | Espace de travail créé |
| 2. Application | Nom de l’app, domaines autorisés (un par ligne, validation de format) | Application
« principale » prête |
| 3. Identité visuelle | Couleur primaire, persona avatar (femme / homme / aucun), locale par défaut
| Configuration widget appliquée |
| 4. Connaissances (optionnel) | Sitemap/URL à indexer **ou** texte libre produit **ou** passer |
Indexation best-effort ; sinon rappel d’enrichir plus tard |
|  5.  Installation  |  Snippet  HTML  à  copier,  lien  documentation,  checklist  de  vérification  |  Fin  du
parcours → console |
**Checklist  de  fin  :**  snippet  inséré,  domaines  cohérents,  test  en  navigation  privée,  consultation
doc sécurité si politique de contenu stricte sur le site hôte.
3.4 Complétion du profil utilisateur
Page dédiée pour la **facturation et le support** :
  • Coordonnées (nom, téléphone).
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.15

## Page 16

Guidia — Fonctionnalités
  • Type de compte : particulier ou entreprise.
  • Adresse postale complète.
  • Pour les entreprises : raison sociale, n° TVA, n° d’enregistrement (obligatoires).
---
4. Console administrateur
4.1 Structure du menu
**Plateforme**
| Entrée | Rôle |
|--------|------|
| Organisation | Gestion des tenants |
| Base de connaissances | Documents et indexation |
| Parcours | Tour Studio |
| Replays vidéo | Bibliothèque d’enregistrements démo |
| Agents | Agent Studio |
| Branding | Apparence et déploiement du widget |
**Données**
| Entrée | Rôle |
|--------|------|
| Tableau de bord | Vue d’ensemble et accès rapides |
| Conversations | Historique et reprise humaine |
| Notifications | Alertes e-mail sur événements conversation |
| Leads | Pipeline commercial |
| Docs (expérience) | Inventaire des médias et fichiers générés |
**Intégrations**
| Entrée | Rôle |
|--------|------|
| Connecteurs | OAuth et configuration des outils |
| Webhooks | Événements sortants HTTP |
**Menu utilisateur (raccourcis)**
  • Mon profil, Quotas & usage, Tarifs, Paramètres, Membres & invitations.
4.2 Tableau de bord
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.16

## Page 17

Guidia — Fonctionnalités
Tuiles d’accès rapide vers : organisations, applications, agents, parcours, connaissance, analytics,
branding, webhooks, connecteurs, démos, dossiers, équipes, paramètres.
4.3 Paramètres du compte
  • Session et e-mail connecté.
  • Changement de mot de passe.
  • **Raccourcis vers les modules** (branding, tokens, politiques d’outils, organisations, webhooks,
alertes, ressources partagées, commentaires) — la configuration réelle reste dans chaque module
pour rester alignée sur les données.
4.4 Observabilité (administration système)
Page de **métriques runtime** de l’API (rafraîchissement périodique) :
  • Uptime, requêtes HTTP, taux d’erreur, agent runs en cours/terminés.
  • Graphiques trafic et erreurs par fenêtre de 5 secondes.
  • Top routes (identifiants masqués en `:id`).
  • Webhooks dispatchés par type d’événement.
  • Distribution des codes HTTP.
  • Snapshot brut exportable (debug incident).
4.5 Catalogue d’outils (policy)
Inventaire exhaustif de ce que l’agent peut invoquer :
| Source | Description |
|--------|-------------|
| Built-in | Outils plateforme (navigateur, guide, tour, démo, connaissance, dispatcher natif) |
| Custom | Actions métier définies par l’équipe |
| Native runtime | Actions déclarées dynamiquement par le widget sur la page hôte |
**Politique  par  outil  :**  autorisé,  bloqué,  confirmation  requise,  ou  hors  liste.  Statistiques
d’invocation  sur  fenêtre  glissante  (jours).  Actions  :  autoriser,  exiger  confirmation,  bloquer,
réinitialiser, désactiver côté admin, purger du catalogue, supprimer (custom).
**Résumé policy :** nom de la policy active, compteurs autorisés / confirmation / bloqués.
---
5. Applications et sécurité d’intégration
5.1 Liste et fiche application
  • Création avec slug unique, URL de base, domaines.
  • Activation / désactivation sans suppression.
  • Fiche complète : général, jetons, intégration (modèle d’appel bootstrap), API utilisateur courant,
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.17

## Page 18

Guidia — Fonctionnalités
zone de danger.
5.2 Contrôle d’origine du widget
À  chaque  chargement,  le  widget  vérifie  **Origin  /  Referer**  par  rapport  à  la  liste  des  domaines
autorisés. En production, une liste vide est déconseillée (ouverture à toute origine).
5.3 Identification de l’utilisateur connecté
**Sans jeton utilisateur :** session anonyme ; personnalisation limitée au contexte navigateur.
**Avec jeton utilisateur signé** (émis par le backend du client) :
  • Identité, rôle, e-mail, locale connus de Guidia.
  • Autorisation des **actions natives sensibles** marquées comme nécessitant une identité forte.
  • Renouvellement sans rechargement de page (`setUserToken`).
**Flux :** le secret de signature reste **uniquement côté serveur** du client ; jamais dans le front.
Régénération immédiate en cas de fuite.
5.4 API utilisateur courant (alternative)
Le  widget  peut  appeler  un  **endpoint  configuré  sur  le  domaine  du  produit  hôte**  (GET/POST,
en-têtes et corps JSON, mapping par chemins pointés) pour récupérer id, nom, e-mail, rôle — en
s’appuyant sur la session navigateur de l’utilisateur (cookies du site hôte).
5.5 Content Security Policy (documentation)
Guide des directives minimales pour autoriser le chargeur, les connexions API, images, styles inline
du widget, workers et médias — afin que le widget ne soit pas bloqué sur un site durci.
---
6. Widget embarqué
6.1 Installation
  • **Une balise script asynchrone** (dans `<head>` ou avant `</body>`).
  • Attributs obligatoires : jeton widget, identifiant d’application.
  •  Attributs  optionnels  :  locale,  couleur  d’accent,  position  à  l’écran,  jeton  utilisateur,  surcharge
d’URL API (debug).
  • Configuration avancée possible via objet global avant chargement (callbacks, contexte initial).
6.2 Modes de déploiement
| Mode | Usage |
|------|-------|
| Widget classique | Bulle flottante ou rail latéral ; chat + onglets parcours/démos |
| Widget Agent Live | Expérience orientée agent autonome et guidage visuel |
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.18

## Page 19

Guidia — Fonctionnalités
| Intégré dans l’application | Support et autonomie dans le SaaS |
| Site vitrine | Lead-gen et démos externes (showcase) |
6.3 Contexte remonté automatiquement
À  chaque  chargement  :  URL  de  la  page,  titre  du  document,  langue  du  navigateur.  Complété  par
variables métier et jeton utilisateur si fournis.
6.4 Interface utilisateur du widget
**Onglets principaux :**
  • **Chat** — conversation textuelle (et pièces jointes selon configuration).
  • **Parcours** — liste des flows Tour Studio actifs pour la page courante.
  • **Démos** — scénarios interactifs disponibles.
**Contrôles  :**  agrandir/réduire,  fermer,  mode  vocal  (micro,  interruption,  raccrocher),  statut
connecté.
**Repli :** si l’avatar ne charge pas → mode voix seul, sans bloquer la session.
6.5 Actions natives (côté page hôte)
Le site hôte **enregistre des fonctions métier** exposées à l’agent :
| Champ | Rôle |
|-------|------|
| `name` | Identifiant unique (snake_case) |
| `description` | Phrase lue par l’agent pour décider |
| `parameters` | Schéma des arguments |
| `requires_confirmation` | Validation utilisateur avant exécution |
| `requires_user_token` | Identité signée obligatoire |
| `handler` | Exécution async côté client, résultat sérialisable |
**Contexte  dynamique  :**  `pushContext({  ...  })`  pour  refléter  page  courante,  sélection,  filtres  —
sans recharger.
6.6 Outils navigateur (guidage autonome)
En mode Agent Live / assistance autonome, l’agent peut :
  • Lire un **résumé DOM** de la page.
  • **Cliquer**, remplir des champs, sélectionner des options, scroller, surligner, naviguer, survoler,
simuler clavier, attendre, afficher des messages.
  •  **Ouvrir  une  démo**  ou  **démarrer  un  parcours  guidé**  directement  dans  la  page  (pas  en
modale fictive).
Règle  produit  :  privilégier  l’action  réelle  plutôt  qu’une  description  textuelle  quand  l’utilisateur
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.19

## Page 20

Guidia — Fonctionnalités
demande « montre-moi » ou « fais-le ».
6.7 Déclencheurs proactifs (branding)
Configuration  des  **conditions  d’ouverture  automatique**  ou  de  suggestion  :  page  visitée,
inactivité, intention détectée, etc. (depuis branding / paramètres liés).
6.8 Internationalisation du widget
Locales supportées dans l’interface : **fr, en, ar, es, pt, it, tr, de, nl, sv** (et extension possible via
reconstruction du bundle). `data-locale` prime ; sinon langue du document.
---
7. Agent conversationnel (chat)
7.1 Comportement général
  • Réponses fondées sur la **base de connaissances** (recherche sémantique multi-périmètres).
  • Historique de session conservé (limite de tours récents pour la cohérence).
  • **Pièces jointes** : traitement selon type (affichage, analyse si autorisé).
  • Ton, limites et domaine métier définis par le **profil agent** actif.
7.2 Canaux sans guidage navigateur
Sur certains canaux, les outils « client_* » (manipulation page) ne sont pas disponibles : l’agent ne
doit  **pas  prétendre**  avoir  cliqué  ou  modifié  l’interface  ;  il  utilise  les  **intégrations  serveur**
(tickets, CRM, etc.).
7.3 Mémoire et continuité
  • Historique des conversations dans le panneau widget (sessions récentes).
  • **Faits visiteur** optionnels (sous consentement et TTL configurable).
  • Variables bootstrap et jeton utilisateur = source de vérité pour compte/rôle/périmètre.
7.4 Apprentissage depuis les conversations
Si activé pour l’application : extraction d’enseignements depuis les transcripts → alimentation de la
mémoire  agent  sous  gouvernance  (validation  possible).  **Ne  remplace  pas**  les  documents
officiels.
7.5 Satisfaction fin de session
Formulaires CSAT / NPS en fin de conversation → agrégats sur le tableau de bord analytics.
---
8. Agent Live (voix et avatar)
8.1 Session vocale
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.20

## Page 21

Guidia — Fonctionnalités
  • Démarrage depuis le widget ou page d’**embed dédiée** (iframe).
  • Micro, lecture audio, permissions navigateur gérées côté client.
  • Même logique métier que le chat : profil, connaissance, outils autorisés.
8.2 Embed sécurisé
  • Route d’embed exige un **jeton d’embed** valide (pas de session anonyme sur l’embed).
  • Mise en page optimisée **micro plein écran** et conversation continue.
8.3 Avatar trois dimensions
  • Persona prédéfinie (féminin / masculin) ou modèle personnalisé (fichier 3D).
  • **Lipsync** sur la voix ; humeurs (neutre, joyeux, sérieux, etc.).
  • Position : encart latéral ou flottant (coins).
  • **Repli automatique** vers voix seule si le rendu 3D échoue.
8.4 Page de démonstration Agent Live (admin)
Sandbox  intégrée  :  tableau  de  bord  /  projets  /  paramètres  factices  ;  prompt  suggéré  pour  tester
curseur, clics et remplissage de formulaire par l’agent.
8.5 Consommation
Le temps Live est **suivi** dans les quotas (indicatif) ; le blocage opérationnel principal reste lié
aux **crédits de conversation** (entrée/sortie).
---
9. Agent Studio — configuration des agents
Accessible via **Agents** dans la console (par application).
9.1 Onglets du studio
| Onglet | Contenu |
|--------|---------|
| Base de connaissances | Raccourci gestion KB |
| Skills | Packs de compétences activables |
| Agents | Profils, création, édition |
| Mémoire | Faits et mémoire agent |
| Live | Test live du profil sélectionné |
9.2 Profil agent
Chaque profil comprend :
| Dimension | Détail |
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.21

## Page 22

Guidia — Fonctionnalités
|-----------|--------|
| Nom et description | Identification dans la console |
| Domaine métier | Support, commercial, RH, formation, médical, personnalisé |
|  Profil  spécialiste  |  Onboarding,  produit,  dépannage,  intégrations,  automatisation,  facturation,
vente, RH, formation, médical, généraliste |
| Messages d’accueil | Par langue (FR, EN, SV, + champs pour autres locales UI) |
| Prompt métier | Instructions, ton, expertise, garde-fous — multilingue |
| Persona et ton | Affichage widget / live |
| Profil par défaut | Un seul défaut par application pour l’export runtime |
| Skill packs | Liste activée/désactivée |
|  Blueprint  métier  |  Contexte,  offres,  utilisateurs  cibles,  résultats  attendus,  guardrails,  règles
d’escalade, notes UI, politique d’exécution |
|  Équipe  live  (roster)  |  Participants  multiples  :  orchestrateur  vs  spécialiste,  voix,  titre  affiché,
mission |
| Outils / intégrations | Mode auto (tout configuré) ou sélection explicite |
| Carte UI | Injection de synthèse de la carte d’interface dans le blueprint |
9.3 Création guidée (drawer multi-étapes)
Étapes : modèle → profil → blueprint → skills → outils → équipe. Gabarits préremplissent l’équipe
selon le domaine choisi.
9.4 Vue détail profil
Onglets : vue d’ensemble, prompts et identité, skills et panel live, blueprint, technique (identifiants,
dates, template source).
9.5 Runtime exporté
  • Choix **widget classique** vs **Agent Live** dans branding.
  • **Profil exporté par défaut** pour le catalogue widget.
  • Snippet et aperçu runtime réel (iframe de prévisualisation).
9.6 Handoff spécialiste
Capacité de demander le **passage à un agent spécialiste** (session live) quand le besoin dépasse
le profil courant.
---
10. Base de connaissances
10.1 Types de sources
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.22

## Page 23

Guidia — Fonctionnalités
| Source | Comportement |
|--------|--------------|
| Fichier uploadé | Formats texte, bureautique courant, images ; vidéo si le déploiement l’autorise |
| Note métier | Création manuelle titre + contenu + catégorie |
| URL / crawl | Découverte de pages internes, extraction du texte principal, création automatique de
documents |
| Conversations | Enseignements extraits si apprentissage auto activé |
10.2 Périmètres (scopes)
Chaque document est classé :
  • **Support**
  • **Démo**
  • **Formation**
  • **Pré-vente (commercial)**
  • **RH**
L’agent interroge les périmètres pertinents selon le contexte de la session.
10.3 Métadonnées document
  • Titre, catégorie, étiquettes, URL source éventuelle.
  • Compteur de **chunks** (segments indexés).
  • Statut **actif / inactif** (exclusion temporaire sans suppression).
  • Résumé ou note métier indexée avec la pièce pour orienter les réponses.
10.4 Indexation
  • Découpage du texte utile et stockage pour recherche lors des réponses.
  • **Réindexation** par document ou **globale** (régénération chunks + vecteurs).
  • Suivi de tâche de crawl : pages visitées, indexées, échecs, erreurs.
10.5 Paramètres de crawl
  • URL de départ, scope, catégorie optionnelle.
  • Pages max, profondeur max.
  • Inclusion sous-domaines, limitation au même chemin racine.
10.6 Interface admin
  • Filtres par type de source (HTTP vs sans URL).
  • Pagination, recherche, détail lecture seule, édition, suppression.
  • Compteurs par scope sur le périmètre application.
---
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.23

## Page 24

Guidia — Fonctionnalités
11. Tour Studio — parcours guidés dans le produit
11.1 Modèle en trois couches
| Couche | Rôle |
|--------|------|
| **Page** | Vue stable : URL, pattern, sélecteurs de détection |
| **Action** | Opération utilisateur : clic, saisie, navigation… |
|  **Flow**  |  Enchaînement  d’actions  en  étapes  guidées  (instructions,  narration,  mode  UI  :
surbrillance, confirmation) |
Liaison  par  **clés  lisibles**  (`dashboard`,  `open-billing`,  …)  —  jamais  par  identifiants  internes  —
pour import/export symétrique.
11.2 Console Tour Studio (`/admin/tours`)
Onglets :
  • **Pages** — CRUD, traductions localisées.
  • **Actions** — paramètres typés, traductions.
  • **Flows** — étapes, modes UI, activation.
  • **Générer avec l’IA** — brouillons depuis captures, vidéo, HTML, dépôt Git/ZIP.
11.3 Import / export JSON
  • **Exporter** : fichier `guidia-tour-studio-*.json` = studio complet de l’application.
  • **Importer** :
  • **Fusion** : upsert par clé, le reste conservé.
  • **Remplacement** : purge complète puis écriture.
  • Tag `import:<id>` pour rollback ciblé.
11.4 Couverture (`meta.coverage`)
Vérification  d’intégrité  des  routes  déclarées  vs  application  cible  (pas  le  site  marketing  Guidia).
Modes bundle ou liste de routes personnalisée.
11.5 Package skills (hors ligne)
Builder déclaratif, validateur schéma + références croisées, CLI (`init`, `validate`, `coverage`) pour
préparer des bundles hors console puis import en un clic.
11.6 Parcours legacy (liste simplifiée)
Liste des parcours par application : nom, clé de page, nombre d’étapes, version, actif/inactif, édition
pas à pas, suppression.
11.7 Côté widget
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.24

## Page 25

Guidia — Fonctionnalités
Driver de parcours : précédent/suivant, progression, terminer ; détection de la page courante pour
proposer le bon flow.
---
12. Démonstrations interactives
12.1 Cycle de vie d’un scénario
  • 1. **Capture** depuis une URL (modes : capture d’écran, HTML, vidéo).
  • 2. Persistance des **étapes** en base.
  • 3. Enrichissement éditorial (titres, descriptions, voiceover).
  • 4. **Partage** public (lien, mot de passe, domaines, expiration).
  • 5. **Analytics** par scénario (vues, complétion, drop-off).
12.2 Organisation
  • **Dossiers** : arborescence colorée, renommage rapide (double-clic), compteur de scénarios par
dossier.
12.3 Édition des étapes
  • Annotations par étape.
  • Export **PDF**, **GIF**, **vidéo**.
  • Historique des **versions** (sauvegarde/restauration).
  • **Variables de personnalisation** (merge dans le player public).
12.4 Génération et enrichissement IA
  • **Génération** depuis un brief : titre, description, voiceover par étape, nombre max d’étapes,
langue de sortie, contexte produit.
  •  **Enrichissement**  multimodal  :  réécriture  titre/description/message  à  partir  des  visuels  des
étapes.
  • **Traduction** : copie traduite ou remplacement sur place.
12.5 Voix off
  • Synthèse par étape (texte : message → description → titre).
  • Voix et langue BCP-47 configurables.
  • Génération uniquement des manquants ou forcée sur tout le scénario.
  • Aperçu et détachement des voiceovers.
12.6 Avatar dans le player démo
  • Activation par scénario, persona, humeur, position (sidebar, coins).
  • Modèle 3D personnalisé optionnel (URL .glb, corps F/M pour lipsync).
  • Synchronisation sur voiceover pré-généré ; idle sans audio.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.25

## Page 26

Guidia — Fonctionnalités
12.7 Exécution autonome (agent)
  • Lancement headless avec **curseur virtuel**, frappe, commentaire vocal.
  • Visualisation temps réel du run (stream, timeline, plan d’étapes).
  • **Replay** timeline ou vidéo MP4.
  • **Handoff** : pause agent, intervention humaine, reprise.
  • Mémorisation / réutilisation de session navigateur de test.
12.8 Player public
  • Navigation étape par étape, lecture auto, voix on/off (serveur ou navigateur).
  • Sous-titres (CC).
  • **Enregistrement replay** depuis le player (voir §13).
  • Fin de démo : remerciement, rejouer, fermer.
  • Contrôles d’accès : privé, expiré, domaine, mot de passe.
---
13. Replays vidéo des démos
13.1 Création
Depuis le **player public** : enregistrement de la session (voix + sous-titres), upload, finalisation.
Métadonnées : scénario lié, session, titre, description, locale, dimensions, FPS, méta voix, langue
sous-titres, créateur.
Sources possibles : widget, run agent, saisie admin manuelle.
13.2 Pipeline
  • 1. Init (statut « en cours d’envoi »).
  • 2. Upload du blob vidéo.
  • 3. Finalize (durée, taille, codec, VTT, transcript).
13.3 Administration
  • Liste des replays par organisation/application.
  • Édition titre, description, tags, partage.
  • Page d’**enregistrement** dédiée côté admin.
  • Consultation publique par `shareId`.
13.4 Sous-titres
Construction WebVTT à partir des messages d’étapes cumulés sur les durées voiceover.
---
14. Conversations et escalade humaine
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.26

## Page 27

Guidia — Fonctionnalités
14.1 Liste des conversations
  • Filtres : statut (en cours, en pause, terminée, reprise), mode (agent, humain, hybride).
  • Recherche textuelle.
  • Pagination.
  • Compteur de messages, horodatage relatif.
14.2 Détail conversation
  • Fil chronologique : visiteur, agent, opérateur humain, système.
  • **Reprise** : bascule en mode humain ; bannière « vous avez repris ».
  • Réponses opérateur dans le même fil (continuité côté visiteur).
  • **Terminer** la conversation.
  • **Retour à l’IA** après reprise.
14.3 Profil visiteur
Données agrégées lorsque disponibles (nom, e-mail, historique lié).
14.4 Notifications (`/admin/conversation-notifications`)
Configuration d’**e-mails internes** lorsque :
  • Un visiteur demande un humain.
  • L’agent signale un blocage ou handoff.
Liste des destinataires maintenue dans les réglages tenant.
14.5 Alignement widget / console
Les  sessions  live  embed  et  widget  alimentent  le  **même  flux**  conversations  pour  supervision
unifiée.
---
15. Leads
15.1 Sources
`manual`, `demo`, `chat`, `agent_high_intent`, `webhook`, `import`.
15.2 Cycle de vie
Statuts : **nouveau → contacté → qualifié → proposition → gagné → perdu**.
15.3 Fiche lead
  • Coordonnées : nom, e-mail, téléphone, entreprise.
  • Notes, étiquettes, champs personnalisés JSON.
  • Lien session / scénario démo.
  • Attribution **UTM** (source, medium, campaign).
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.27

## Page 28

Guidia — Fonctionnalités
  • Géolocalisation approximative, appareil, navigateur.
  • Synchronisation tableur (horodatage + URL de ligne si configuré).
15.4 Enrichissement IA (champs dérivés)
Résumé  IA,  sentiment,  catégorie,  priorité,  actions  suggérées,  intentions,  flag  urgence  —  stockés
dans `custom_fields`.
15.5 Usage métier
Qualification  automatique  depuis  le  chat  ou  la  démo  ;  export  vers  CRM  via  connecteurs  ou
webhooks.
---
16. Tickets support
16.1 Création et sources
Sources : manuel, chat, e-mail, conversation.
16.2 Attributs
  • Sujet, description, catégorie, étiquettes.
  • Statuts : ouvert, en cours, en attente, résolu, fermé.
  • Priorités : urgent, haute, moyenne, basse.
  • Assignation utilisateur ou **équipe**.
  • SLA (échéance), dates première réponse / résolution / clôture.
  • Lien conversation et visiteur.
16.3 Fil et historique
  • Messages publics et **notes internes**.
  • Historique des changements de champs (audit).
16.4 Agent
Ouverture  de  ticket  via  outils  connectés  (helpdesk)  lorsque  l’utilisateur  le  demande  ou  en  cas
d’escalade.
---
17. Analytics et mesure
17.1 Tableau de bord principal
  • Conversations ouvertes / terminées.
  • Leads créés, évolution journalière.
  • Graphiques **intentions** et **sujets** (libellés issus des agents).
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.28

## Page 29

Guidia — Fonctionnalités
  • **CSAT / NPS** (enquêtes fin de session).
  • Segmentation **vitrine vs widget embarqué**.
17.2 Analytics démo (par scénario)
| Métrique | Description |
|----------|-------------|
| Sessions / messages | Volume d’engagement |
| Tours / démos complétés | Succès parcours |
| Vues totales / visionneurs uniques | Portée |
| Taux de complétion | Conversion funnel |
| Temps moyen | Engagement |
| Flow visionneurs | Entonnoir par étape + drop-off |
| Analytics par étape | Vues par step |
| Top entreprises | Firmographie si collectée |
| UTM | Campagnes marketing |
| Visionneurs haute intention | Liste priorisée |
17.3 Exports
Complément via webhooks ou exports pour entrepôt de données client.
---
18. Connecteurs et outils agent
18.1 Connecteurs OAuth (page Outils)
Configuration par organisation ; l’agent n’expose que les outils **sélectionnés** dans le profil.
Familles d’intégration présentes dans la plateforme :
| Famille | Capacités typiques |
|---------|-------------------|
| HubSpot | Création lead/contact |
| Salesforce | CRM |
| Slack | Messages, alertes |
| Microsoft Teams | Messages |
| Telegram / WhatsApp | Messagerie |
| Gmail | E-mail |
| Google Calendar / Calendly | Prise de rendez-vous |
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.29

## Page 30

Guidia — Fonctionnalités
| Google Sheets | Export lignes |
| Jira | Tickets développement |
| Zendesk / Freshdesk | Tickets support |
| Webhook custom | Appel HTTP métier |
18.2 Comportement des outils
  • **Confirmation** avant actions sensibles (paiement, création lead, etc.).
  • Arguments sensibles masqués dans les logs.
  • Échec explicite si connecteur non configuré.
18.3 Réunion / invitations
Page dédiée **invitations de réunion** (outil calendrier lié).
18.4 Catalogue produit
Référentiel produit interrogeable par l’agent (offres, fiches) selon configuration application.
---
19. Webhooks et alertes
19.1 Webhooks sortants
  • Destination **HTTPS** générique (JSON + signature HMAC optionnelle) ou **Slack** (incoming
webhook).
  • Nom, URL, secret, liste d’**événements** souscrits, actif/inactif.
  • **Test** depuis la console avec retour succès/échec.
  • Compteur d’échecs, dernier envoi.
**Événements (exemples) :**
  • Démo vue / complétée.
  • Intention forte (`high_intent`).
  • Run agent terminé / erreur / handoff demandé.
  • Quota dépassé.
19.2 Alertes (règles)
Déclenchement sur :
  • Intention élevée.
  • Démo terminée / abandonnée.
  • Satisfaction basse.
  • Anomalie d’usage.
**Canaux :** e-mail, Slack, MS Teams, webhook.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.30

## Page 31

Guidia — Fonctionnalités
**Paramètres :** cooldown (minutes), scénario optionnel, configuration JSON du canal, activation.
---
20. Branding et personnalisation
20.1 Apparence widget
  • Titre du widget, message de bienvenue.
  • Couleur primaire.
  • Position : bas droite/gauche, haut droite/gauche, **rail** droit/gauche.
  • Forme du panneau : coins arrondis ou droits (rail bord écran sans arrondi).
  • Barre supérieure : fond, texte, icônes (ou défauts).
  • Icône de la bulle (choix prédéfinis).
20.2 Fonctionnalités
  • Avatar 3D on/off (persona, voix avatar).
  • Mode runtime : classique vs Agent Live.
  • Mode déploiement : intégré vs vitrine.
  • Profil exporté par défaut.
20.3 Snippet et prévisualisation
  • Génération snippet HTML avec attributs `data-*`.
  • Copie en un clic, exemples d’intégration (HTML pur, frameworks courants).
  • **Iframe d’aperçu** du vrai runtime (pas une maquette statique).
20.4 Variables dynamiques
Passées au bootstrap ou en attributs : segment, compte, page courante, etc. — consommées par
l’agent et les parcours.
20.5 Personnalisation des démos
Variables  merge  dans  le  player  (entreprise,  prénom,  etc.)  pour  démos  commerciales
contextualisées.
---
21. Collaboration et gouvernance
21.1 Membres et invitations
**Rôles organisation :**
| Rôle | Droits |
|------|--------|
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.31

## Page 32

Guidia — Fonctionnalités
| Propriétaire | Accès complet, facturation, gestion organisation |
| Administrateur | Apps, équipe, invitations |
| Membre | Édition contenus (parcours, démos, KB) |
| Lecteur | Lecture seule |
**Invitations  :**  e-mail  avec  lien  magique,  expiration  **7  jours**,  renvoi,  révocation,  historique
(acceptée, expirée, révoquée). Copie du lien si l’e-mail n’arrive pas.
21.2 Équipes
Groupes  au  sein  d’une  organisation  ;  ajout  de  membres  déjà  présents  dans  l’organisation  (sinon
invitation préalable). Nom, description, couleur. Utilisées pour assignation tickets.
21.3 Commentaires
Fils de discussion sur ressources :
  • Scénario démo, parcours, document connaissance, session, run agent.
Actions : publier, résoudre, supprimer (et réponses).
21.4 Ressources partagées
Bibliothèque d’URL médias (image, vidéo, document, audio) réutilisables dans démos, parcours et
messages agent. Ajout par URL publique, détection type MIME, suppression.
21.5 Versioning et historique (composants Guidia)
  • **Historique de versions** sur certains contenus éditoriaux (panel dédié dans l’UI Guidia).
  • **Fil de commentaires** intégré aux workflows de relecture.
---
22. Facturation, plans et quotas
22.1 Page facturation
  • Plan actuel et statut d’abonnement (actif, essai, impayé, annulé, etc.).
  • Portail de gestion d’abonnement (modifier plan, moyen de paiement).
  • Annulation en fin de période ou immédiate ; réactivation possible.
  • Dates de renouvellement / fin d’essai.
22.2 Consommation
| Type | Mesure |
|------|--------|
| Crédits IA entrée | Tokens entrants (1 crédit = 1000 tokens) |
| Crédits IA sortie | Tokens sortants |
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.32

## Page 33

Guidia — Fonctionnalités
| Stockage | Octets utilisés |
| Temps Live | Secondes consommées (indicatif) |
Politiques de dépassement : **bloquant**, **avertir et continuer**, **compter et facturer**.
Seuils d’alerte à 80 % ; blocage si quota épuisé (par type entrée/sortie indépendamment).
22.3 Rate limiting API
Limites par minute selon plan (ex. paliers 60 / 240 / 1200 req/min) — en complément des quotas
mensuels.
22.4 Page tarifs publique
Plans  avec  bascule  mensuel/annuel,  estimation  d’usage  (heures  Live,  messages  chat,  documents
indexés), FAQ, CTA inscription.
22.5 Page quotas (`/admin/quota`)
Tableau de bord consommation détaillée pour l’organisation courante.
---
23. Ressources médias et documents d’expérience
23.1 Documents d’expérience (`/admin/experience-documents`)
Inventaire transversal des **fichiers générés ou stockés** pour l’application :
  • Dossiers logiques : connaissance, captures tour, vidéos tour, HTML tour, branding, voiceover,
agent runs, autre.
  • Métadonnées : titre, clé, URL canonique/publique, type, taille, date, scope, catégorie, tags.
  • Flags : indexé dans la KB, orphelin.
  • Actions : ouvrir, télécharger, archiver, supprimer, recherche et filtres.
Permet l’**audit stockage** et le nettoyage sans passer module par module.
---
24. Site vitrine, documentation et contenus marketing
24.1 Pages publiques
  •  Accueil,  tarifs,  fonctionnalités  (articles  par  slug),  plateforme,  cas  d’usage,  ressources,
documentation.
  • **Démo publique** par identifiant de partage.
  • **Replay public** par shareId.
  • **Runtime démo** et embed agent live.
24.2 Documentation intégration (`/docs`)
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.33

## Page 34

Guidia — Fonctionnalités
| Page | Sujet |
|------|-------|
| Installation | Snippet, paramètres, vérification |
| Actions natives | Enregistrement, contexte, champs |
| Auth utilisateur | Jeton signé, flux, bonnes pratiques |
| CSP | Directives pour sites stricts |
| Bundles Tour Studio | Import/export, couverture, CLI skills |
24.3 Internationalisation site
Interface marketing et console : **10+ langues** (FR, EN, AR, ES, PT, IT, TR, DE, NL, SV). Bascule de
locale persistée.
24.4 Préférences utilisateur
Menu : thème clair/sombre, langue interface.
---
25. Capacités de l’agent en session (référence)
Classification par **niveau de risque** :
| Capacité | Risque | Description fonctionnelle |
|----------|--------|---------------------------|
| Contexte application | Lecture | Tenant, app, URL de base, domaines, périmètre session |
| Recherche connaissance | Lecture | Interroger la KB indexée |
| Vue documents | Lecture | Lister les documents récents disponibles |
| Revue catalogue d’actions | Lecture | Expliquer ce qui est automatisable (actions natives) |
| Guidance formation | Brouillon | Expliquer workflows, plans onboarding/dépannage sans prétendre
exécuter |
| Guidance navigateur | Action | Inspecter et guider visuellement l’app hôte (si widget live déployé)
|
| Exécution action native | Action | Déclencher une action enregistrée sur la page hôte |
| Handoff spécialiste | Transfert | Faire intervenir un profil expert dans la session live |
**Règle :** lecture = contexte vérifié ; brouillon = pas d’exécution alléguée ; action = uniquement
via outils confirmés ; transfert = spécialiste approprié.
---
26. Matrice des rôles et permissions
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.34

## Page 35

Guidia — Fonctionnalités
| Capacité | Lecteur | Membre | Admin | Propriétaire |
|----------|---------|--------|-------|--------------|
| Voir conversations/analytics | ✓ | ✓ | ✓ | ✓ |
| Éditer KB, tours, démos | — | ✓ | ✓ | ✓ |
| Gérer agents, branding, outils | — | ✓* | ✓ | ✓ |
| Inviter / rôles membres | — | — | ✓ | ✓ |
| Organisations, facturation | — | — | — | ✓ |
\* Selon politique interne ; en pratique membre = contenu, admin = configuration.
---
27. Synthèse par persona
Équipe produit / CX
  • Tour Studio + démos + replays pour onboarding et release notes interactives.
  • Analytics drop-off et complétion pour améliorer les parcours.
Support
  • Widget + KB multi-scope + tickets + escalade console + notifications.
  • Catalogue d’outils et policies pour encadrer les actions automatiques.
Sales / marketing
  • Démos partagées, variables de personnalisation, leads enrichis IA, UTM, high-intent.
  • Mode vitrine et webhooks vers CRM.
IT / intégration
  • Snippet, domaines autorisés, jeton utilisateur, actions natives, CSP doc.
  • Connecteurs OAuth, webhooks signés, API utilisateur courant.
Direction / ops
  • Quotas, facturation, observabilité API, alertes anomalies.
  • Multi-organisation, équipes, rôles, audit tickets.
---
Annexes — limites et bonnes pratiques
  • 1. **Domaines autorisés** : toujours renseigner en production.
  •  2.  **Secrets**  :  jeton  widget  et  secret  utilisateur  uniquement  côté  serveur  client  pour  la
signature.
  •  3.  **KB  multilingue**  :  fournir  des  sources  par  langue  pour  éviter  les  mélanges  dans  les
réponses.
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.35

## Page 36

Guidia — Fonctionnalités
  • 4. **Actions sensibles** : toujours `requires_confirmation` + jeton utilisateur si impact compte.
  •  5.  **Import  Tour  Studio**  :  préférer  fusion  en  production  ;  remplacement  réservé  aux
environnements de reset.
  • 6. **Replays** : prévoir voiceover pour avatar lipsync cohérent dans le player.
---
*Ce document décrit le comportement fonctionnel observé dans le dépôt produit Guidia. Pour toute
évolution, mettre à jour ce fichier en même temps que les écrans ou routes concernés.*
Source : GUIDIA-FONCTIONNALITES.fr.md + featureArticles.ts · guidia.dev · 2026-05-20 · p.36
