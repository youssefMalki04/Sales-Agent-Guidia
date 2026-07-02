---
title: Sécurité, hébergement et conformité RGPD
category: security
language: fr
product_area: general
---

Le présent document détaille les mesures de sécurité, les pratiques d'hébergement et les garanties de conformité RGPD mises en œuvre par Guidia pour assurer la protection des données et la robustesse de sa plateforme.

## Isolation des données

Guidia est conçue sur une architecture multi-tenant stricte garantissant une isolation totale des données par organisation (tenant) et par application.

Chaque organisation constitue un espace de travail racine, tandis que chaque application correspond à un déploiement spécifique du widget Guidia (un site, un environnement ou un produit). Le contenu et la configuration sont isolés par organisation puis rattachés à une application. Cette hiérarchie des données assure que les informations (agents, parcours, démos, conversations, leads, tickets, branding, webhooks et politiques d'outils) sont cloisonnées et accessibles uniquement au sein de leur périmètre défini. Pour garantir cette isolation, une gestion rigoureuse de la sécurité au niveau des lignes (Row Level Security - RLS) est activée systématiquement sur toutes les tables de la base de données pertinentes pour les données clients, telles que `leads`, `conversations`, `knowledge_documents`, `knowledge_chunks`, `crm_exports` et `agent_events`, avec des politiques d'accès strictes pour les environnements de développement et de production.

## Identification des utilisateurs connectés

Pour les applications SaaS authentifiées, Guidia utilise un protocole d'identification robuste basé sur les JSON Web Tokens (JWT), appelé `user_token`. Ce mécanisme permet d'associer une identité forte aux utilisateurs de votre application lorsqu'ils interagissent avec l'agent Guidia.

Le `user_token` est émis et signé côté serveur (votre backend client) à l'aide d'un secret d'application (`apps.user_token_secret`) qui utilise l'algorithme HS256. Ce secret est stocké uniquement côté serveur du client et ne doit jamais être exposé dans le navigateur. Le JWT attend un payload incluant au minimum un `sub` (identifiant unique de l'utilisateur dans votre SaaS), et peut inclure des champs recommandés comme `name`, `email`, `role`, `locale`, `iat` (issued at time) et `exp` (expiration time). Guidia utilise ce token pour vérifier l'identité de l'utilisateur et autoriser les actions natives sensibles du widget qui sont marquées comme `requires_user_token`. Les tokens ont une durée de vie courte (15 minutes par défaut, configurable) et peuvent être rafraîchis sans rechargement de page. En cas de fuite du secret, une régénération instantanée invalide tous les tokens en circulation.

## Chiffrement des données en transit et au repos

Guidia met en œuvre des mesures de chiffrement complètes pour protéger les données sensibles, tant en transit qu'au repos.

Les secrets des connecteurs tiers (tels que `tool_credentials`, les `access_token` et `refresh_token` des connexions OAuth, ainsi que le `user_token_secret` des applications) sont chiffrés au repos à l'aide de la cryptographie Fernet et de clés d'organisation (`APP_ENCRYPTION_KEYS`). Ces clés doivent être générées de manière sécurisée et peuvent être soumises à une rotation. Pour le stockage des objets sur S3, le chiffrement SSE-KMS est utilisé, avec un `S3_KMS_KEY_ID` spécifié, permettant une rotation des clés gérée via AWS CloudTrail et garantissant une protection accrue des données stockées. En transit, toutes les communications API sont effectuées via HTTPS, assurant l'intégrité et la confidentialité des échanges.

## Hébergement et infrastructure réseau

L'infrastructure de Guidia est conçue pour la haute disponibilité, la performance et la sécurité.

Pour gérer les sessions persistantes de la WebSocket Gemini Live (`/api/live/ws`), des "sticky sessions" sont mises en place. Cela se fait via un cookie `GUIDIA_ROUTE` (d'une durée de 8 heures, correspondant au `SESSION_TTL_SECONDS` côté backend) géré par un Load Balancer (tel que Nginx ou AWS ALB). Cela garantit qu'un client reste connecté au même pod applicatif, évitant la perte d'état. Pour la gestion des connexions à la base de données (Supabase), PgBouncer est déployé en mode `transaction` sur le port 6432. Ce proxy de pool de connexions multiplexe efficacement un grand nombre de connexions FastAPI vers un pool plus restreint de connexions backend, optimisant les ressources et la performance. Dans cette configuration, `statement_cache_size=0` est défini pour les drivers de base de données comme `asyncpg`/`psycopg` pour éviter les incompatibilités avec le mode transaction de PgBouncer.

## Protection et DDoS

Guidia utilise des solutions de sécurité multicouches pour protéger sa plateforme contre les attaques et les abus.

Cloudflare est déployé en tant que proxy inverse, filtrant une grande partie du trafic malveillant à la périphérie du réseau avant qu'il n'atteigne les serveurs de Guidia. Cela inclut l'activation du Web Application Firewall (WAF) avec les règles gérées de Cloudflare et le mode Bot Fight Mode (ou Super Bot Fight Mode pour les plans avancés) pour atténuer les requêtes de bots. Des limites de débit (`rate limiting`) sont appliquées de manière granulaire pour prévenir les abus et les attaques par déni de service distribué (DDoS) :
*   `60 requêtes/min/IP` pour l'endpoint `/widget/message`
*   `5 requêtes/min/IP` pour l'endpoint `/widget/lead-capture`
*   `20 requêtes/min/IP` pour les endpoints `/oauth/*`

## Directives Content Security Policy (CSP)

Pour les clients ayant une politique de sécurité de contenu (CSP) stricte sur leurs sites web, des directives spécifiques sont requises pour permettre au widget Guidia de fonctionner correctement et en toute sécurité.

Ces directives incluent :
*   `script-src` : Permet le chargement du chargeur Guidia (`loader.js`) depuis `https://share.guidia.dev`. Une option de nonce est disponible pour éviter l'utilisation de `'unsafe-inline'`.
*   `style-src` : Nécessite `'unsafe-inline'` car le widget injecte ses styles dans son Shadow DOM, mais ces styles sont encapsulés et n'affectent pas la page hôte.
*   `connect-src` : Autorise les appels REST et le chargement d'actifs par le widget vers `https://guidia.dev` et `https://share.guidia.dev`.
*   `img-src` : Permet les images et les captures d'écran servies par le widget, y compris les sources `data:` et `blob:`.
*   `media-src` : Autorise la lecture audio (`blob:`) côté navigateur.
*   `worker-src` : Nécessite `blob:` pour le rendu 3D qui peut utiliser un worker.
*   `font-src` : Permet les polices inline (`data:`).

L'API Guidia implémente également des contrôles CORS, vérifiant l'origine (`Origin / Referer`) des requêtes par rapport à la liste des `apps.allowed_domains` configurée dans la console d'administration Guidia pour chaque application, évitant ainsi les accès non autorisés.