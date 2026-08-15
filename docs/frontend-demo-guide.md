# Guide de demonstration frontend Leadia

## Objectif

Presenter un parcours commercial complet : un visiteur discute avec un agent
IA, devient un lead qualifie, est repris par un commercial, avance dans le
pipeline et reserve un rendez-vous.

Le parcours frontend est utilisable sans backend. Les actions signalees comme
demonstration sont sauvegardees dans le navigateur avec `localStorage`.

## Preparation

```bash
pnpm install
pnpm dev
```

Ouvrir `http://localhost:3000/dashboard/onboarding`.

Avant une nouvelle presentation :

1. Cliquer sur **Demo** dans la topbar.
2. Cliquer sur **Reset sample data**.
3. Confirmer la reinitialisation.
4. Verifier `/demo/widget` sur desktop et mobile.

Ne jamais montrer `.env.local`, les tokens CRM ou une cle de service Supabase
pendant la presentation.

## Scenario conseille — 7 a 10 minutes

### 1. Configuration de l'agent

Ouvrir `/dashboard/agents`.

- Montrer la creation et les presets d'agents.
- Ouvrir le detail d'un agent.
- Montrer le Playground et les scenarios de test.
- Expliquer qu'un agent doit etre teste avant publication.

### 2. Connaissances et qualification

Ouvrir `/dashboard/knowledge`, puis `/dashboard/qualification-flows`.

- Montrer les documents de connaissance.
- Expliquer les criteres de qualification et le score.
- Montrer que les informations commerciales ne dependent pas uniquement du
  modele IA.

### 3. Experience visiteur

Ouvrir `/demo/widget`.

- Presenter le site client fictif.
- Ouvrir la bulle en bas a droite.
- Envoyer deux messages et afficher le formulaire de contact progressif.
- Expliquer le consentement et le transfert humain.

La conversation est simulee tant que `/api/chat` n'est pas connecte au widget.

### 4. Reprise humaine

Ouvrir `/dashboard/inbox`.

- Selectionner Amira Ben Salah.
- Cliquer sur **Take over**.
- Envoyer une reponse manuelle.
- Montrer **Return to AI** et **Resolve**.
- Afficher le score, le besoin et l'action commerciale suggeree.

### 5. Cycle commercial

Ouvrir `/dashboard/pipeline`.

- Rechercher Amira.
- Deplacer sa carte de **New** vers **Qualified**.
- Montrer le deplacement par menu, utile sur mobile.
- Expliquer la valeur du pipeline et les temperatures Hot/Warm/Cold.

### 6. Rendez-vous

Ouvrir `/dashboard/meetings`.

- Basculer entre les vues calendrier et liste.
- Ouvrir un rendez-vous.
- Montrer les actions Confirm, Complete, Reschedule et Cancel.
- Creer un nouveau rendez-vous de demonstration.

### 7. Mesure des performances

Ouvrir `/dashboard/analytics`.

- Changer la periode entre 7, 30 et 90 jours.
- Presenter le taux de qualification et les rendez-vous.
- Montrer les objections, les questions non resolues et les recommandations.
- Comparer les performances des agents.

### 8. Integrations et conformite

Ouvrir `/dashboard/integrations`, puis `/dashboard/privacy`.

- Tester une connexion simulee.
- Preciser que les secrets sont reserves au backend.
- Montrer le consentement, l'anonymisation et la conservation des donnees.
- Presenter l'export et la suppression d'un visiteur comme simulations frontend.

## Fonctionnalites frontend reelles

- Navigation responsive et menu mobile.
- Filtres, recherches et formulaires locaux.
- Drag and drop du pipeline.
- Lecture, validation et association des colonnes CSV.
- Generation et telechargement d'un export CSV.
- Persistance des configurations avec `localStorage`.
- Apercus widget desktop et mobile.
- Graphiques et tableaux de bord responsives.
- Etats vides, statuts et panneaux de detail.

## Fonctionnalites simulees en attente du backend

- Reponses IA du widget public.
- Messages temps reel de la Live Inbox.
- Ecriture definitive des leads en base de donnees.
- Authentification et permissions serveur.
- Connexions OAuth CRM, calendrier et email.
- Envoi des invitations d'equipe.
- Verification distante du script widget.
- Demandes RGPD et journal de consentement serveur.
- Synchronisation automatique entre tous les modules.

## Correspondance frontend / backend

| Frontend | Backend attendu |
| --- | --- |
| Widget chat | `POST /api/chat` et creation de session |
| Live Inbox | WebSocket ou service Realtime |
| Leads et Pipeline | API CRUD Leads et historique des etapes |
| Meetings | API calendrier et OAuth fournisseur |
| Analytics | Agregations SQL et evenements produit |
| Integrations | OAuth, webhooks signes et coffre de secrets |
| Team | Authentification, invitations et RBAC |
| Privacy | Consentements, retention et demandes RGPD |

## Verification avant livraison

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm exec next typegen
pnpm build
```

Checklist manuelle :

- verifier Chrome desktop, tablette et mobile ;
- ouvrir et fermer la sidebar mobile avec le bouton et `Escape` ;
- verifier les tableaux avec defilement horizontal ;
- tester le widget sur `/demo/widget` ;
- reinitialiser le mode Demo ;
- importer le modele CSV puis exporter les leads ;
- verifier que les modales restent utilisables sur petit ecran ;
- confirmer qu'aucun secret n'est affiche dans le navigateur.

## Formulation recommandee pendant la soutenance

> Le frontend couvre tout le parcours utilisateur et commercial. Les donnees
> de demonstration sont locales pour permettre une presentation stable. Les
> interfaces identifient clairement les actions qui seront connectees aux API,
> au temps reel et aux integrations securisees dans la phase backend.
