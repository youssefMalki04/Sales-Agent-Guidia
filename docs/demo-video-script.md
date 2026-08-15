# Script de demo video

Objectif : enregistrer une demo courte de 3 a 5 minutes compréhensible par une personne non technique.

## Message principal

Leadia est un agent IA Sales qui discute avec un visiteur, comprend son besoin, qualifie son niveau d'interet, detecte les objections, genere une fiche lead et transmet le lead vers les outils commerciaux.

## Scenario de demo

Question visiteur :

```text
Votre solution fonctionne avec Shopify ? On utilise HubSpot et on veut lancer ce mois-ci.
```

Flux a montrer :

```text
Question Shopify
  -> reponse agent
  -> qualification progressive
  -> lead HOT
  -> resume commercial
  -> notification Slack
  -> dashboard
  -> export HubSpot
```

## Plan minute par minute

### 0:00 - 0:30 Introduction

Dire :

> Dans cette demo, on montre comment l'agent IA Sales transforme une conversation visiteur en lead qualifie et exploitable par l'equipe commerciale.

Montrer rapidement :

- l'interface du projet ;
- le widget chat ;
- le dashboard ou la fiche lead si disponible.

### 0:30 - 1:30 Conversation visiteur

Action :

- ouvrir le widget chat ;
- envoyer la question Shopify ;
- montrer que l'agent repond d'abord a la question ;
- montrer qu'il pose ensuite une question de qualification.

Dire :

> L'agent ne se contente pas de repondre. Il cherche aussi a comprendre le contexte commercial : CRM utilise, urgence, besoin et objections.

### 1:30 - 2:30 Qualification lead

Montrer :

- besoin detecte ;
- integration Shopify / HubSpot ;
- urgence ;
- budget non confirme ;
- objection integration ;
- score et temperature si disponibles.

Dire :

> La fiche lead est enrichie progressivement. Les champs deja connus ne sont pas ecrases par des valeurs vides, et les donnees retournees par l'IA sont validees avant stockage.

### 2:30 - 3:20 Notification et CRM

Action :

- declencher ou montrer une notification Slack de test ;
- montrer l'export HubSpot si le token est configure ;
- expliquer que Salesforce et webhook generique suivent le meme principe.

Dire :

> Quand le lead est qualifie, il peut etre transmis aux outils commerciaux. Ici on montre Slack pour alerter l'equipe, puis HubSpot pour creer une fiche contact.

### 3:20 - 4:20 Dashboard et lisibilite commerciale

Montrer :

- resume commercial ;
- prochaine action recommandee ;
- objections avec categorie et statut ;
- knowledge dashboard si necessaire.

Dire :

> Le but est qu'un commercial puisse comprendre le lead sans relire toute la conversation : besoin, urgence, objections et prochaine action sont directement visibles.

### 4:20 - 5:00 Conclusion

Dire :

> Le flux complet couvre la conversation, le RAG, la qualification, la sauvegarde Supabase et l'export CRM. Les prochaines ameliorations concernent le durcissement du pipeline complet, les tests automatises et l'optimisation des exports.

## Checklist avant enregistrement

- [ ] Serveur local lance.
- [ ] `.env.local` configure.
- [ ] Supabase accessible.
- [ ] RAG teste avec une question Shopify.
- [ ] Slack webhook configure ou resultat de test disponible.
- [ ] HubSpot token configure ou resultat de test disponible.
- [ ] Aucun secret visible a l'ecran.
- [ ] Onglets inutiles fermes.
- [ ] Donnees de test anonymes.

## Phrase courte pour la soutenance

> J'ai prepare la partie livraison cote Yosra : plan de tests E2E, documentation README, script de demo video et checklist pour que la demo soit compréhensible par une personne non technique.
