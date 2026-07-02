yaml
title: Cas d'usage par secteur d'activité
category: use_case
language: fr
product_area: general
---

Ce document présente comment la plateforme Guidia peut être déployée et exploitée dans divers secteurs d'activité pour répondre à des besoins spécifiques en matière de vente, support, formation et onboarding, en s'appuyant sur ses capacités d'agent IA autonome.

## 1. SaaS B2B

### Contexte et besoin typique
Les entreprises SaaS B2B sont confrontées à des cycles de vente longs, des processus d'onboarding produit complexes et un besoin constant de réduire le churn. Le support client est souvent coûteux et les équipes commerciales peinent à qualifier efficacement les prospects et à leur faire découvrir la valeur du produit sans multiplier les démonstrations manuelles. Elles cherchent à automatiser les tâches répétitives, à guider les utilisateurs vers leur "moment de valeur" et à scaler leurs opérations sans augmenter massivement les effectifs.

### Objections fréquentes
*   « Nous avons déjà un chatbot de base. »
*   « Notre produit est trop complexe, l'IA ne peut pas comprendre toutes les subtilités. »
*   « La sécurité de nos données clients est une priorité absolue, nous sommes réticents à les confier à une IA. »
*   « Le temps d'intégration de nouveaux outils est toujours sous-estimé et trop long. »

### Exemple de conversation Guidia - Agent Commercial
**Contexte :** Un prospect navigue sur le site vitrine d'un SaaS B2B et s'interroge sur l'onboarding.

**Visitor :** Bonjour, je m'intéresse à votre solution, mais j'ai peur que l'onboarding soit très long. Comment aidez-vous les nouveaux utilisateurs à démarrer rapidement ?

**Agent Guidia :** (en mode vocal avec avatar) Bonjour ! C'est une excellente question. Guidia est précisément conçu pour simplifier l'onboarding. Je peux vous montrer comment notre agent guide les nouveaux comptes, étape par étape, jusqu'à leur premier moment de valeur. Le plus simple est de vous faire une mini-démo interactive directement dans l'interface produit. Voulez-vous que je la lance ?

**Visitor :** Oui, volontiers. Ça m'intéresse de voir ça.

**Agent Guidia :** Parfait ! Je lance une démo de quelques minutes. Elle illustre un parcours typique. [L'agent lance une `open_app_demo` pour un scénario d'onboarding, le curseur virtuel navigue dans une interface capturée, met en évidence les champs importants et explique les étapes clés. L'agent utilise `browser_highlight` et `browser_explain_step`.]

**Visitor :** C'est très clair ! Et si j'ai d'autres questions pendant la démo ?

**Agent Guidia :** Je reste disponible pour répondre à tout moment. Cette démo montre comment notre "Tour Studio" fonctionne en direct dans votre produit. Nos clients constatent jusqu'à -30% de churn le premier mois grâce à ce guidage. Si vous le souhaitez, je peux vous guider pour ouvrir un compte test gratuit afin de voir comment l'agent s'intégrerait à votre propre application, cela prend deux minutes.

## 2. E-commerce Shopify

### Contexte et besoin typique
Les boutiques Shopify cherchent à maximiser leurs taux de conversion, réduire l'abandon de panier et gérer un volume élevé de requêtes clients concernant les produits, la livraison ou les retours. Elles ont besoin d'une assistance client disponible 24/7 et d'outils de qualification de leads pour leurs newsletters ou offres promotionnelles, le tout sans alourdir les coûts opérationnels. La personnalisation de l'expérience d'achat et la rapidité des réponses sont cruciales.

### Objections fréquentes
*   « Notre boutique est de petite taille, l'IA n'est peut-être pas adaptée à notre volume. »
*   « Nous utilisons déjà des plugins Shopify, l'intégration pourrait être complexe. »
*   « L'expérience d'achat est très personnelle, une IA risquerait de paraître impersonnelle. »
*   « Le coût d'une solution IA pourrait rogner nos marges, qui sont déjà faibles. »

### Exemple de conversation Guidia - Agent Commercial
**Contexte :** Un visiteur est sur une page produit d'une boutique Shopify et hésite sur la taille d'un article.

**Visitor :** Bonjour, la robe "Éclat Nocturne" m'intéresse, mais je ne sais pas quelle taille choisir. J'hésite entre un M et un L.

**Agent Guidia :** (en mode chat, après avoir détecté la page produit via `context.page.url`) Bonjour ! Je peux vous aider avec ça. La robe "Éclat Nocturne" a une coupe plutôt ajustée. Pour vous conseiller au mieux, pourriez-vous me donner vos mensurations (tour de poitrine, tour de taille et tour de hanches) ? Je peux aussi vous montrer le guide des tailles détaillé. [L'agent propose `show_knowledge_document` pour le guide des tailles.]

**Visitor :** Oh, je n'avais pas vu le guide des tailles. C'est utile ! Et si j'ai d'autres questions sur la livraison ?

**Agent Guidia :** Absolument ! Je peux répondre à toutes vos questions concernant la livraison, les retours, ou tout autre produit. Nos clients ont réduit de 80% les tickets de niveau 1. Avez-vous une question spécifique sur la livraison ? Pour ne rien manquer de nos offres exclusives, je peux aussi vous proposer de vous inscrire à notre newsletter. Souhaitez-vous que je qualifie votre profil ?

**Visitor :** Je vais juste consulter les frais de livraison pour l'instant.

## 3. Agence marketing

### Contexte et besoin typique
Les agences marketing doivent constamment innover pour capter l'attention de leurs clients et de leurs prospects. Elles cherchent des moyens efficaces de générer des leads qualifiés pour leurs clients, de créer des expériences interactives sur les landing pages et de présenter des démos produits convaincantes. La capacité à mesurer la performance des campagnes et à ajuster rapidement les stratégies est primordiale.

### Objections fréquentes
*   « Nous préférons une approche "humaine" pour la qualification des leads de nos clients. »
*   « Nos clients ont des produits très variés, l'IA aura du mal à s'adapter à chaque brief. »
*   « L'IA n'est pas réputée pour sa créativité dans la conception de campagnes. »
*   « Comment prouver le ROI d'une telle solution à nos clients ? »

### Exemple de conversation Guidia - Agent Commercial
**Contexte :** Un prospect d'agence marketing est sur une landing page client et interagit avec l'agent Guidia pour en savoir plus sur un service.

**Visitor :** Bonjour, je suis de l'agence *CreativeBoost* et je cherche des solutions pour générer des leads qualifiés pour nos clients SaaS B2B. Votre démo interactive a l'air prometteuse. Comment ça marche concrètement pour nos clients ?

**Agent Guidia :** (en mode vocal) Bonjour de l'agence *CreativeBoost* ! C'est une excellente approche. Avec Guidia, vous pouvez créer des démos interactives et des parcours guidés personnalisés qui s'intègrent directement sur les landing pages de vos clients. Je peux vous montrer un exemple où l'agent qualifie un lead tout en présentant les fonctionnalités clés du produit. [L'agent ouvre une `open_app_demo` pré-enregistrée pour une qualification de lead.]

**Visitor :** Impressionnant. Et comment on mesure l'efficacité de ces démos et de la qualification ?

**Agent Guidia :** Notre plateforme intègre des outils d'analytics complets (`/platform/analytics`). Vous pouvez suivre les vues des démos, les taux de complétion, les leads générés et les intentions des visiteurs en temps réel. Ces données sont exportables vers vos CRM via nos connecteurs ou des webhooks. Je peux vous faire une brève démonstration du tableau de bord analytics. [L'agent utilise `browser_navigate` vers `/platform/analytics` et `browser_highlight` des métriques clés.]

**Visitor :** Parfait ! Pourriez-vous me dire comment on peut intégrer ça à HubSpot, par exemple ?

**Agent Guidia :** Bien sûr. Nous avons une intégration directe avec HubSpot. Lorsque l'agent qualifie un lead, il peut créer automatiquement un contact ou une opportunité dans votre HubSpot. Pourrez-vous me donner votre email professionnel pour que je puisse vous envoyer la documentation détaillée sur cette intégration ?

## 4. Industrie

### Contexte et besoin typique
Le secteur industriel fait face à des défis complexes : formation du personnel sur des machines ou logiciels techniques, support 24/7 pour les opérations sur le terrain, gestion et mise à jour d'une documentation technique volumineuse et multilingue. La réduction des temps d'arrêt, l'efficacité des processus de formation et la conformité aux normes de sécurité sont des enjeux majeurs. L'intégration de nouvelles technologies doit être fiable et sécurisée.

### Objections fréquentes
*   « Nos équipements sont trop spécifiques et techniques pour être expliqués par une IA générique. »
*   « La sécurité des données et la protection de notre propriété intellectuelle sont non négociables. »
*   « Rien ne remplace la formation pratique et l'expertise humaine pour l'opération de nos machines. »
*   « L'intégration de nouvelles solutions dans nos systèmes existants est souvent un casse-tête. »

### Exemple de conversation Guidia - Agent Technique
**Contexte :** Un technicien de maintenance est sur le portail de support interne et rencontre un problème avec un logiciel de contrôle industriel.

**Visitor :** Bonjour, j'ai un souci avec le module de calibration du logiciel X. Il semble que mes capteurs ne soient pas reconnus après la dernière mise à jour.

**Agent Guidia :** (en mode chat, après avoir accédé à la base de connaissance technique via `knowledge_search`, scope `support` et `training`) Bonjour ! Je comprends votre situation avec le module de calibration. Avez-vous déjà essayé de réinitialiser la connexion des capteurs en suivant la procédure "Réinitialisation Capteurs v3.2" ? Je peux vous afficher les étapes directement dans l'interface ou vous fournir le document PDF si vous préférez. [L'agent utilise `show_knowledge_document` ou `start_app_flow` pour un parcours guidé dans le logiciel.]

**Visitor :** Je n'ai pas trouvé cette procédure. Pouvez-vous me la montrer pas à pas dans l'interface ?

**Agent Guidia :** Absolument. Je lance le parcours guidé "Réinitialisation Capteurs v3.2". Veuillez simplement suivre les indications que je mettrai en évidence à l'écran. [L'agent active `start_app_flow("reinitialisation-capteurs-v3.2")`, utilisant `browser_highlight` et `browser_click` pour guider l'utilisateur.] Si le problème persiste, je pourrai escalader vers un spécialiste technique avec toutes les informations de notre conversation.

**Visitor :** C'est beaucoup plus simple comme ça ! Merci.

## 5. Santé

### Contexte et besoin typique
Le secteur de la santé (hôpitaux, cliniques, plateformes de télémédecine) doit gérer un afflux constant de patients, nécessitant un onboarding clair pour les nouvelles plateformes, un support patient 24/7 pour les questions courantes et une formation continue pour le personnel soignant sur les nouveaux protocoles ou logiciels médicaux. La conformité réglementaire (RGPD, HIPAA) et la gestion sécurisée des données sensibles sont des impératifs absolus.

### Objections fréquentes
*   « La confidentialité et la sécurité des données patient sont trop critiques pour être confiées à une IA. »
*   « L'empathie et le contact humain sont essentiels dans le domaine de la santé, une IA ne peut pas le remplacer. »
*   « Nos systèmes informatiques sont souvent anciens et peu ouverts à de nouvelles intégrations. »
*   « Le risque de désinformation de la part d'une IA est inacceptable en santé. »

### Exemple de conversation Guidia - Agent Support Patient
**Contexte :** Un patient tente de se connecter à son portail sécurisé et a oublié son mot de passe.

**Visitor :** Bonjour, j'essaie de me connecter à mon espace patient pour voir mes résultats d'analyse, mais j'ai oublié mon mot de passe. Comment faire pour le réinitialiser ?

**Agent Guidia :** (en mode vocal avec un ton calme et rassurant, configuré via le profil agent `medical`) Bonjour. Je peux vous guider pour réinitialiser votre mot de passe en toute sécurité. Je vais vous montrer les étapes directement sur le portail. Aucun humain n'aura accès à votre mot de passe. [L'agent utilise `browser_navigate` pour aller à la page de réinitialisation de mot de passe du portail et `start_app_flow` pour guider le patient avec `browser_highlight` et `browser_fill` (pour l'e-mail par exemple).]

**Visitor :** C'est bon, j'ai reçu le lien de réinitialisation. Merci ! Une autre question : comment puis-je prendre rendez-vous avec un spécialiste ?

**Agent Guidia :** Parfait ! Pour la prise de rendez-vous, je peux vous montrer comment utiliser notre outil de planification en ligne. Il est directement accessible depuis votre portail. Souhaitez-vous que je vous guide à travers les étapes de sélection d'un spécialiste et d'un créneau ? [L'agent utilise `start_app_flow` pour le processus de prise de rendez-vous.] Si votre demande concerne une urgence médicale, je dois vous rediriger vers les services d'urgence.

## 6. Banque / Fintech

### Contexte et besoin typique
Les entreprises bancaires et fintech ont besoin de processus d'onboarding client digitalisés et fluides pour les produits financiers complexes, un support client disponible 24/7 pour les requêtes de base, une conformité réglementaire stricte (KYC, AML) et une sécurité des données infaillible. La qualification des leads pour les services d'investissement ou les prêts est également un enjeu, tout comme la formation continue des employés sur les réglementations changeantes.

### Objections fréquentes
*   « Nos obligations réglementaires (KYC, AML) sont trop strictes pour être gérées par une IA. »
*   « La sécurité des données financières de nos clients est notre priorité absolue. »
*   « Les clients préfèrent un conseiller humain pour les questions d'argent et d'investissement. »
*   « Nos systèmes bancaires sont très anciens, l'intégration est un défi majeur. »

### Exemple de conversation Guidia - Agent Commercial/Support
**Contexte :** Un visiteur est sur la page d'un produit d'épargne d'une banque en ligne et a des questions sur l'ouverture de compte.

**Visitor :** Bonjour, je suis intéressé par votre compte épargne à taux boosté. Quelles sont les conditions pour l'ouvrir ? Et est-ce que mes fonds sont garantis ?

**Agent Guidia :** (en mode vocal) Bonjour ! Notre compte épargne boosté est un excellent choix. Je peux vous lister les conditions principales et vous rassurer sur la garantie de vos fonds, conformément aux informations de notre base de connaissance. Premièrement, il est réservé aux personnes majeures résidant en France. Concernant la garantie, vos fonds sont couverts jusqu'à 100 000 euros par le Fonds de Garantie des Dépôts et de Résolution. Je peux vous montrer la page dédiée aux conditions générales. [L'agent utilise `browser_navigate` vers la page des conditions générales et `browser_highlight` la section de garantie.]

**Visitor :** C'est clair. Et l'ouverture de compte, c'est compliqué ?

**Agent Guidia :** Pas du tout ! Nous avons simplifié le processus au maximum. Je peux vous guider pas à pas pour ouvrir votre compte directement en ligne, cela prend moins de 10 minutes. Souhaitez-vous que nous commencions maintenant ? Je peux vous montrer où cliquer et quoi remplir. [L'agent propose `start_app_flow` pour la création de compte.] Si vous avez des besoins spécifiques ou si vous souhaitez discuter avec un conseiller, je peux aussi planifier un rendez-vous pour vous.

**Visitor :** D'accord, je veux bien que vous me montriez les premières étapes.

## 7. Conseil

### Contexte et besoin typique
Les cabinets de conseil cherchent à se différencier en qualifiant rapidement les prospects, en démontrant leur expertise de manière interactive et en offrant des parcours de formation sur mesure à leurs clients ou à leurs nouvelles recrues. La centralisation et l'accès facile à la base de connaissances (méthodologies, études de cas) sont essentiels pour l'efficacité interne. La capacité à générer des leads qualifiés pour des missions spécifiques est une priorité.

### Objections fréquentes
*   « Le conseil est avant tout une affaire de relation humaine et d'expertise sur mesure, une IA ne peut pas le remplacer. »
*   « Nos missions sont uniques, nous n'avons pas de "produit" à montrer ou à guider. »
*   « Comment une IA pourrait-elle comprendre les subtilités d'un problème métier complexe ? »
*   « Nos clients recherchent une interaction personnelle, pas une conversation avec un robot. »

### Exemple de conversation Guidia - Agent Commercial/Knowledge
**Contexte :** Un prospect est sur le site d'un cabinet de conseil et s'interroge sur ses services en transformation digitale.

**Visitor :** Bonjour, notre entreprise envisage une transformation digitale, et votre cabinet semble proposer des services pertinents. Comment pourriez-vous nous accompagner concrètement ?

**Agent Guidia :** (en mode vocal) Bonjour ! Nous sommes spécialisés dans l'accompagnement des transformations digitales. Pour mieux cerner vos besoins, j'aimerais vous poser quelques questions de qualification rapides. Quel est le principal défi que vous rencontrez actuellement ? [L'agent utilise `qualify_lead`.] Ensuite, je peux vous présenter des études de cas interactives de clients que nous avons accompagnés ou vous mettre en contact avec l'un de nos consultants seniors.

**Visitor :** Notre défi principal est l'intégration de nouvelles technologies sans perturber nos opérations existantes.

**Agent Guidia :** C'est un point crucial. Je peux vous montrer une démo interactive illustrant notre méthodologie d'intégration en douceur, avec un focus sur la gestion du changement. Cette démo dure environ 3 minutes et met en lumière nos leviers d'action. [L'agent ouvre une `open_app_demo` pour une étude de cas sur l'intégration technologique.] Nous avons aidé de nombreuses entreprises à réussir ce type de transition.

**Visitor :** La démo est très parlante. Et si je veux en savoir plus sur une méthodologie spécifique ?

**Agent Guidia :** Je peux rechercher dans notre base de connaissances pour vous fournir des informations détaillées sur nos méthodologies. Par exemple, si vous êtes intéressé par l'approche Agile ou DevOps, je peux extraire les documents pertinents. Si vous le souhaitez, je peux également capturer vos coordonnées pour qu'un de nos consultants puisse vous recontacter et échanger plus en détail sur votre projet.

---