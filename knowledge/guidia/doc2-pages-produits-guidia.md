# Doc2 Pages Produits Guidia

Source PDF: doc2-pages-produits-guidia.pdf

## Page 1

Guidia — Pages produit /platform
Doc 2 — Toutes les pages produit Guidia
Contenu des 8 pages /platform/* — https://guidia.dev/platform/{slug}
Sources extraites du dépôt support-ia :
  • frontend/src/lib/i18n-app/platformArticles.ts (locale FR)
Document généré automatiquement — contenu strictement issu des pages marketing, de la documentation
développeur et des migrations de référence. Rien n'est inventé.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.1

## Page 2

Guidia — Pages produit /platform
/platform/agents — Agents IA
Agents pour la vente, le support et l'accompagnement
Chaque  agent  est  rattaché  à  une  application  Guidia.  Vous  le  configurez  dans  la  console  :  profil,
instructions et périmètre d'action.
Rôle dans le produit
L'agent  répond  aux  visiteurs  et  aux  utilisateurs  connectés  depuis  le  widget  ou  les  parcours  que
vous activez. Il s'appuie sur votre base de connaissance et sur les connecteurs que vous autorisez
explicitement.
La console centralise les agents, leurs profils et l'historique des conversations pour assurer le suivi
et la passation vers un humain si nécessaire.
Profil et instructions
Un  profil  regroupe  le  ton,  le  contexte  métier  et  les  consignes  que  l'agent  doit  respecter.  Vous
pouvez maintenir plusieurs profils si vos cas d'usage diffèrent (par exemple premier niveau support
et qualification commerciale).
Les changements sont pris en compte côté configuration ; vous gardez la main sur ce qui est dit et
sur les limites fixées.
Outils visibles par l'agent
Les  intégrations  et  actions  disponibles  pour  un  agent  sont  celles  que  vous  sélectionnez  dans  la
console. Cette sélection évite d'exposer des capacités non désirées au modèle.
Les actions natives déclarées sur votre site web complètent ce périmètre lorsque vous branchez le
widget sur votre propre interface.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.2

## Page 3

Guidia — Pages produit /platform
/platform/live-agent — Live agent
Sessions vocales dans votre interface
Le  mode  live  repose  sur  une  page  d'intégration  dédiée.  Vous  l'affichez  dans  une  iframe  avec  un
jeton d'embed fourni par la console.
Intégration
La  route  d'embed  attend  un  jeton  d'embed  valide.  Sans  jeton,  la  page  refuse  de  démarrer  la
session, ce qui évite les accès anonymes.
Le flux audio et les échanges suivent le même socle que le widget chat : même application, même
règles de contenu et mêmes outils activés.
Avatar et micro
Selon votre configuration widget, un avatar peut accompagner la voix. Vous pouvez aussi rester sur
une interface minimaliste si votre charte l'exige.
L'utilisateur déclenche la session depuis votre produit ; vous gardez le contrôle du contexte de la
page hôte.
Exploitation
Les sessions apparaissent dans les flux de conversations admin comme le chat, ce qui simplifie le
support et la mesure d'usage.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.3

## Page 4

Guidia — Pages produit /platform
/platform/widget — Widget embarqué
Un chat branché à votre stack
Le widget se charge comme une balise script sur votre domaine. Vous associez l'application via un
jeton public et des attributs de configuration documentés.
Installation
Le  guide  d'installation  décrit  les  attributs  requis  (data-widget-token,  data-app-id)  et  les  options
(locale, position, couleur, URL d'API de secours).
Une  fois  en  place,  le  widget  ouvre  le  volet  de  conversation  sans  que  l'utilisateur  quitte  votre
parcours.
Identité et contexte
Vous  pouvez  laisser  le  widget  anonyme  ou  fournir  un  jeton  utilisateur  signé  par  votre  backend
lorsque vous devez transmettre rôle, compte ou locale métier.
Les variables exposées au widget permettent d'aligner les réponses sur votre CRM ou vos segments
lorsque vous les reliez côté serveur.
Actions natives
Sur vos propres pages, vous pouvez enregistrer des fonctions JavaScript que l'agent sait décrire et
déclencher lorsque la conversation le nécessite, sous les garde-fous que vous codez.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.4

## Page 5

Guidia — Pages produit /platform
/platform/knowledge-base — Base de connaissance
Vos sources au centre des réponses
La console permet d'ajouter du contenu structuré ou crawlé, de le classer et de le réindexer lorsque
le texte change.
Contenu admis
Vous  importez  fichiers,  textes  ou  URLs  suivant  les  voies  prévues  dans  le  produit.  Un  périmètre
(support, expérience produit, etc.) précise où ce contenu est utilisé.
Les  métadonnées  simples  (titres,  tags,  catégories)  aident  à  organiser  les  jeux  de  documents  par
équipe ou par segment.
Indexation
Le texte est découpé et stocké sous une forme consultable pendant une conversation. Après une
modification importante, une réindexation remet la base à jour.
Ce  mécanisme  rattache  les  réponses  aux  passages  pertinents  de  vos  documents  plutôt  qu'à  du
texte générique.
Qualité opérationnelle
Surveillez  les  documents  obsolètes  comme  vous  le  feriez  pour  un  centre  d'aide  classique  :  la
console vous permet de désactiver ou remplacer une source sans toucher au widget.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.5

## Page 6

Guidia — Pages produit /platform
/platform/tools-connectors — Outils et connecteurs
Capacités métier sous contrôle
Les connecteurs relient Guidia à vos systèmes CRM, messagerie, agendas ou ticketing lorsque vous
les configurez pour votre organisation.
Activation
Chaque  famille  d'outil  expose  des  permissions  OAuth  ou  des  secrets  que  vous  saisissez  dans  la
console. Rien n'est exposé tant que la connexion n'est pas validée.
Vous décidez ensuite par agent quelles briques restent sélectionnables dans le studio.
Automatisation
Les webhooks et charges utiles standard permettent de réagir à des événements Guidia dans vos
backends sans passer par l'interface.
Utilisez ces hooks pour synchroniser tickets, leads ou journaux internes.
Sécurité fonctionnelle
Réduire la liste des outils activés limite les actions possibles pendant une conversation. C'est une
mesure produit, pas une option cachée : elle fait partie du réglage normal.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.6

## Page 7

Guidia — Pages produit /platform
/platform/guided-tours — Parcours guidés
Onboarding pas à pas dans votre UI
Vous  modélisez  des  parcours  comme  des  graphes  de  pages  et  d'actions.  Le  runtime  publié  sur
votre site comprend ces étapes.
Conception
Le  studio  admin  couvre  les  écrans  du  produit  à  expliquer,  les  actions  déclenchables  et  les
enchaînements possibles.
Une fois publié, un parcours devient une ressource que l'agent peut suivre pour accompagner un
utilisateur réel.
Expérience utilisateur
Le moteur côté navigateur peut mettre en évidence un bouton ou une zone précise tant que votre
application charge le bundle Guidia.
C'est adapté aux SaaS complexes où une démo linéaire ne suffit pas.
Complément au widget
Les tours fonctionnent avec le même socle de configuration que le widget : même tenant, même
charte, même politique d'accès.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.7

## Page 8

Guidia — Pages produit /platform
/platform/interactive-demos — Démos interactives
Montrer le produit sans friction
Vous préparez une démo enregistrée ou scriptée puis vous publiez un identifiant de partage. Les
invités ouvrent une page lecteur dédiée.
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
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.8

## Page 9

Guidia — Pages produit /platform
/platform/analytics — Analytics
Mesurer l'usage et la satisfaction
Les  métriques  sont  calculées  à  partir  des  événements  déjà  stockés  pour  votre  organisation  :
conversations, funnel leads et collectes post-session.
Vue opérationnelle
Le tableau de bord résume le volume de conversations, leur état en cours, la création de leads et
l'état des tickets associés.
Des graphiques journaliers montrent l'activité récente sans nécessiter d'export manuel.
Qualité perçue
Les formulaires de fin de session alimentent des agrégats CSAT et NPS ainsi que la distribution des
sentiments déclarés.
Vous  pouvez  comparer  les  résultats  selon  le  mode  de  déploiement  (vitrine  ou  widget  intégré)
lorsque les deux coexistent.
Exploration
Les intentions et sujets les plus fréquents aident les équipes produit à prioriser la documentation ou
les correctifs UX.
Les analyses restent dans la console ; reliez vos propres entrepôts via les exports ou webhooks si
votre process l'exige.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.9

## Page 10

Guidia — Pages produit /platform
Ressources complémentaires — /resources/*
/resources/documentation — Guides pour brancher Guidia sur votre
produit
Documentation d'intégration : balise widget, sécurité navigateur, endpoints exposés au navigateur.
Sommaire technique
La section /docs regroupe installation, actions natives, JWT, CSP et bundles Tour Studio.
Chaque page FR/EN via le sélecteur du bandeau.
Par où commencer
Guide installation → actions natives → /docs/tour-studio-bundle et @guidia/skills.
/resources/workflow-skill  —  Générer  des  workflows  Tour  Studio
depuis un agent IA
Package @guidia/skills : builder, validateur, CLI guidia — import sur /admin/tours.
Workflow typique
guidia init → édition → guidia validate → Importer JSON merge/replace sur /admin/tours.
Couverture routes
guidia coverage --mode bundle ; --mode custom pour votre inventaire routes.
Source : frontend/src/lib/i18n-app/platformArticles.ts · guidia.dev · 2026-05-20 · p.10
