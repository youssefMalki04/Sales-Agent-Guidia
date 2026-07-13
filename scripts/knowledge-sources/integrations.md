yaml
---
title: Intégrations et connecteurs tiers
category: integration
language: fr
product_area: general
---

Guidia est conçu pour s'intégrer harmonieusement à l'écosystème d'outils que votre équipe utilise déjà. La plateforme agit comme une couche d'agents IA embarqués qui peut se connecter à vos systèmes CRM, de messagerie, d'agendas et de ticketing. Ces connecteurs permettent à l'agent Guidia d'interagir directement avec vos outils métier pour automatiser des workflows, capturer des données et fournir un support contextuel.

### Familles d'intégration disponibles

La plateforme Guidia propose des intégrations natives avec plusieurs familles d'outils populaires, ainsi que la possibilité de créer des connecteurs personnalisés via des webhooks. Les familles d'intégration incluent :

*   **CRM et Gestion de leads** : HubSpot, Salesforce
*   **Support et Helpdesk** : Zendesk, Freshdesk, Jira
*   **Messagerie et Communication** : Slack, Microsoft Teams, Telegram, WhatsApp, Gmail
*   **Agendas et Prise de rendez-vous** : Google Calendar, Calendly
*   **Productivité et Données** : Google Sheets
*   **Connecteurs personnalisés** : Webhooks custom

### Connecteurs CRM

Les connecteurs CRM sont essentiels pour les équipes de vente et de marketing, permettant à l'agent Guidia de gérer les prospects et les contacts directement dans vos systèmes existants.

*   **HubSpot** : Permet la création automatique de leads et de contacts à partir des interactions de l'agent.
*   **Salesforce** : Offre une intégration complète avec votre CRM Salesforce, facilitant la synchronisation des données et la mise à jour des fiches clients par l'agent.

### Connecteurs Support et Helpdesk

Pour un support client efficace, Guidia s'intègre à vos outils de ticketing afin de rationaliser la gestion des demandes.

*   **Zendesk** : Facilite la création et la synchronisation des tickets de support. Lorsqu'un utilisateur demande un humain ou qu'un problème complexe est identifié, l'agent peut ouvrir ou enrichir un ticket directement dans Zendesk.
*   **Freshdesk** : De manière similaire à Zendesk, cette intégration permet de gérer les tickets support, assurant une transition fluide des conversations automatisées vers l'intervention humaine.
*   **Jira** : Permet la création de tickets de développement ou de suivi de bogues directement depuis les conversations de l'agent, aidant les équipes produit et techniques.

### Messageries et Notifications

Les intégrations de messagerie et de notification assurent que les informations importantes et les alertes sont transmises aux bonnes personnes, au bon moment.

*   **Slack** : L'agent peut envoyer des messages et des alertes d'événements conversationnels, comme la détection d'une intention forte, un dépassement de quotas, ou une demande de transfert à un humain.
*   **Microsoft Teams** : Permet l'envoi de messages et de notifications aux équipes via Microsoft Teams.
*   **Telegram et WhatsApp** : Ces connecteurs de messagerie instantanée étendent les canaux de communication de l'agent, lui permettant d'interagir avec les utilisateurs ou d'envoyer des notifications sur ces plateformes.
*   **Gmail** : L'agent peut envoyer des e-mails, par exemple pour confirmer une action ou relayer des informations importantes à un prospect ou un client.

### Connecteurs d'Agendas

Les intégrations d'agendas simplifient la prise de rendez-vous et la planification.

*   **Google Calendar** : Permet à l'agent de consulter les disponibilités et de prendre des rendez-vous directement dans Google Calendar.
*   **Calendly** : L'agent peut utiliser Calendly pour proposer des créneaux de rendez-vous et automatiser la planification de démos ou d'appels.

### Connecteurs Productivité et Données

Pour la gestion des données et l'automatisation des tâches de productivité.

*   **Google Sheets** : Facilite l'exportation de lignes de leads ou d'autres données structurées directement vers une feuille de calcul Google Sheets, utile pour les suivis personnalisés.

### Webhooks Sortants

Les webhooks Guidia offrent une flexibilité maximale pour connecter la plateforme à n'importe quel système supportant les requêtes HTTP.

*   **Destination HTTPS générique** : Vous pouvez configurer des webhooks pour envoyer des charges utiles JSON à n'importe quelle URL HTTPS. Une signature HMAC optionnelle garantit l'intégrité et l'authenticité des données.
*   **Slack (incoming webhook)** : Une option simplifiée pour envoyer des notifications à un canal Slack spécifique.

Les webhooks peuvent être déclenchés par divers événements Guidia, notamment :
*   `Démo vue / complétée` : Lorsqu'une démonstration interactive est visionnée ou terminée.
*   `Intention forte (high_intent)` : Lorsqu'une intention de conversation particulièrement engageante est détectée.
*   `Run agent terminé / erreur / handoff demandé` : Pour suivre le cycle de vie des interactions de l'agent.
*   `Quota dépassé` : Pour être alerté en cas de consommation excessive des ressources.

### Comportement des outils et sécurité

La sécurité et le contrôle sont des piliers centraux de la gestion des intégrations Guidia.

*   **Activation via OAuth et secrets** : L'activation de chaque connecteur passe par la saisie de permissions OAuth ou de secrets dans la console Guidia. Aucune capacité n'est exposée tant que la connexion n'est pas validée.
*   **Périmètre d'action de l'agent** : Vous décidez explicitement, par profil d'agent, quels outils et intégrations sont sélectionnables et utilisables. Cette sélection granulaire limite les actions possibles pendant une conversation, évitant d'exposer des capacités non désirées au modèle.
*   **Confirmation obligatoire pour actions sensibles** : Pour les actions considérées comme sensibles (ex: paiement, création de lead, modification de paramètres), une confirmation explicite de l'utilisateur est toujours requise avant l'exécution.
*   **Masquage des arguments sensibles** : Les arguments sensibles passés aux outils sont masqués dans les logs pour protéger la confidentialité des données.
*   **Échec explicite** : Si un connecteur n'est pas configuré ou est inaccessible, l'agent signale un échec explicite, évitant toute action non intentionnelle ou non autorisée.
*   **Actions natives JavaScript** : En plus des connecteurs tiers, Guidia permet d'enregistrer des fonctions JavaScript côté page hôte. Ces "actions natives" permettent à l'agent de décrire et de déclencher des fonctions métier directement dans votre interface, avec des garde-fous de sécurité configurables, incluant la nécessité d'un jeton utilisateur signé pour les actions sensibles.