---
title: Plans tarifaires et système de crédits
category: pricing
language: fr
product_area: general
---

Guidia propose une gamme de plans tarifaires adaptés à différents besoins, allant d'une offre gratuite pour la découverte jusqu'à des solutions sur mesure pour les entreprises. Tous les plans incluent l'agent vocal Live, le widget embarqué et la base de connaissances RAG. La facturation peut être mensuelle ou annuelle, cette dernière offrant généralement une économie équivalente à deux mois.

## Les plans tarifaires Guidia

Voici le détail des six plans disponibles, avec leurs prix, volumes de support Live, stockage et crédits IA associés.

### Plan Free

Le plan **Free** est conçu pour découvrir Guidia sans engagement.
*   **Prix :** 0 $
*   **Live :** 20 minutes par mois
*   **Stockage :** 5 Go
*   **Crédits IA :** 200 crédits d'entrée (cr in) et 100 crédits de sortie (cr out) par mois. Le plan inclut également 2 000 crédits IA par mois.
*   **Notes :** Ce plan est strictement bloquant en cas de dépassement des quotas. La base de connaissance est limitée.

### Plan Light

Idéal pour les petites équipes qui débutent avec l'IA.
*   **Prix :** 39 $ par mois ou 400 $ par an
*   **Live :** 10 heures par mois
*   **Stockage :** 10 Go
*   **Crédits IA :** 10 000 crédits d'entrée (cr in) et 4 000 crédits de sortie (cr out) par mois, pour un total de 14 000 crédits IA par mois.
*   **Notes :** Accès ouvert avec des alertes par e-mail à 80 % et 95 % des limites atteintes. Le widget embarqué est illimité.

### Plan Starter

Ce plan est destiné aux entreprises qui souhaitent démarrer en production.
*   **Prix :** 199 $ par mois ou 2 000 $ par an
*   **Live :** 50 heures par mois
*   **Stockage :** 20 Go
*   **Crédits IA :** 50 000 crédits d'entrée (cr in) et 15 000 crédits de sortie (cr out) par mois, pour un total de 65 000 crédits IA par mois.
*   **Notes :** Ce plan est valide côté facturation mais n'est pas affiché sur la page `/pricing` publique.

### Plan Professional

Recommandé pour les équipes en croissance.
*   **Prix :** 399 $ par mois ou 4 000 $ par an
*   **Live :** 100 heures par mois
*   **Stockage :** 50 Go
*   **Crédits IA :** 100 000 crédits d'entrée (cr in) et 30 000 crédits de sortie (cr out) par mois, pour un total de 130 000 crédits IA par mois.
*   **Notes :** Ce plan inclut une base de connaissance avancée, des workspaces multi-équipes, des webhooks et des intégrations CRM, ainsi qu'un support prioritaire.

### Plan Ultra

Conçu pour les volumes intensifs de support IA.
*   **Prix :** 999 $ par mois ou 10 000 $ par an
*   **Live :** 250 heures par mois
*   **Stockage :** 100 Go
*   **Crédits IA :** 300 000 crédits d'entrée (cr in) et 85 000 crédits de sortie (cr out) par mois, pour un total de 385 000 crédits IA par mois.
*   **Notes :** Ce plan offre une base de connaissance illimitée, des workspaces multi-équipes, des webhooks, de l'audit et des intégrations avancées, avec un support prioritaire.

### Plan Enterprise

Pour les besoins en volume sur mesure et des exigences contractuelles spécifiques.
*   **Prix :** Sur devis
*   **Live :** Volume Live sur mesure
*   **Stockage :** Stockage et embeddings dédiés sur mesure
*   **Crédits IA :** Crédits IA sur mesure (illimités)
*   **Notes :** Pour ce plan, il est nécessaire de contacter l'équipe commerciale via `sales@guidia.dev` ou `sales@guidia.ai`. Il inclut un SLA contractuel, le SSO, l'audit et des contrôles avancés, un Customer Success Manager dédié, des déploiements on-premise / VPC sur demande et des intégrations sur mesure.

## Système de crédits unifié

Guidia utilise un système de crédits unifié pour mesurer la consommation des services IA.
*   **Valeur du crédit :** 1 crédit équivaut à 1 000 tokens.
*   **Comptabilisation :** Les crédits d'entrée (`credits_input`) et les crédits de sortie (`credits_output`) sont comptabilisés séparément.
*   **Blocage :** Le service est bloqué si l'un OU l'autre de ces deux quotas de crédits est épuisé.
*   **Temps Live :** Le temps Live (mesuré en secondes, affiché en heures/minutes) est une métrique informative non bloquante.
*   **Autres métriques :** Le stockage utilisé (`max_storage_bytes`) et le nombre maximum d'exécutions concurrentes (`max_concurrent_runs`) sont d'autres quotas, dont le stockage est également bloquant.

### Estimations d'usage

Pour aider à estimer les besoins en crédits, voici des repères basés sur des moyennes réelles :
*   **1 minute de support Live :** Environ 3 crédits d'entrée et 3 crédits de sortie.
*   **1 message de chat :** Environ 1 crédit d'entrée et 1 crédit de sortie.
*   **1 embedding :** Environ 0,1 crédit d'entrée.

Ces usages se cumulent, et les valeurs sont approximatives.

## Gestion de la facturation et des quotas

La console d'administration (`/admin/billing`) permet de suivre et de gérer l'abonnement.
*   **Statut d'abonnement :** Vérifiez le plan actuel, le statut Stripe (actif, en essai, impayé, annulé, etc.).
*   **Modification de plan :** Un portail de gestion d'abonnement dédié permet de modifier le plan et le moyen de paiement. Les mises à niveau (upgrade) sont immédiates avec une proratisation des coûts, tandis que les déclassements (downgrade) prennent effet à la fin de la période de facturation en cours.
*   **Annulation et réactivation :** Les abonnements peuvent être annulés en fin de période ou immédiatement, avec la possibilité de réactiver le plan.
*   **Suivi de consommation :** Accédez aux détails des crédits IA (entrée/sortie), du stockage utilisé et du temps Live consommé.
*   **Page Quotas :** La page `/admin/quota` offre un tableau de bord détaillé de la consommation pour l'organisation.

### Dépassements et alertes

Guidia a mis en place des mécanismes clairs pour gérer les dépassements de quotas :
*   **Plan Free :** Strictement bloquant en cas de dépassement des limites.
*   **Plans payants :** L'accès reste ouvert même en cas de dépassement des quotas IA. Des alertes sont envoyées par e-mail à 80 % et 95 % de la consommation des crédits. Une alerte visuelle apparaît également dans la console à partir de 80 %.
*   **Politiques de dépassement :** Les organisations peuvent configurer la politique de dépassement parmi les options suivantes : **Bloquant**, **Avertir & Continuer**, ou **Compter & Facturer**.
*   **Régularisation :** Une régularisation peut être appliquée sur la facture suivante en fonction de la politique choisie.

### Rate limiting de l'API

En complément des quotas mensuels, des limites de requêtes par minute s'appliquent à l'API :
*   **Plan Free :** 60 requêtes par minute.
*   **Plans Professional et Ultra :** 240 requêtes par minute.
*   **Plan Enterprise :** 1 200 requêtes par minute.

## FAQ Tarifs

### Que se passe-t-il si je dépasse mon plan ?

Le plan Free est strictement bloquant et votre accès sera suspendu. Pour les plans payants, l'accès reste généralement ouvert. Vous recevrez des alertes par e-mail à 80 % et 95 % de votre consommation de crédits, et une alerte visuelle apparaîtra dans la console à partir de 80 %. Une régularisation pourra être appliquée sur votre prochaine facture, en fonction de la politique de dépassement que vous avez configurée.

### Puis-je changer de plan à tout moment ?

Oui, vous pouvez changer de plan à tout moment via le portail Stripe accessible depuis l'interface d'administration. Les mises à niveau (upgrade) prennent effet immédiatement avec une proratisation de votre facture. Les déclassements (downgrade) sont appliqués à la fin de votre période de facturation en cours.

### Avez-vous un essai gratuit ?

Oui, le plan Free permet de découvrir Guidia sans nécessiter de carte bancaire. Pour les plans payants, un essai peut être accordé sur demande spécifique via un Customer Success Manager.