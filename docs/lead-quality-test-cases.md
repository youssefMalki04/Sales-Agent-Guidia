# Cas de test - qualite des fiches leads

Ce document liste des scenarios de test pour verifier la qualite des fiches leads generees par l'agent sales. Il permet de controler la coherence de `sales_summary`, `suggested_next_action`, des objections et de la temperature du lead.

## Objectif

Verifier que l'agent :

- comprend le besoin du visiteur ;
- ne perd pas les informations commerciales importantes ;
- n'invente pas les champs manquants ;
- detecte correctement les objections ;
- propose une prochaine action utile pour un commercial ;
- produit une fiche lead lisible sans relire toute la conversation.

## Format attendu pour chaque test

Chaque scenario doit verifier :

- message visiteur ;
- informations attendues dans la fiche lead ;
- objections attendues ;
- resume commercial attendu ;
- prochaine action attendue ;
- temperature probable du lead.

## Test 1 - Lead chaud avec Shopify

Message visiteur :
"Bonjour, votre solution fonctionne avec Shopify ? On a un site e-commerce et on veut qualifier les visiteurs avant de les envoyer dans HubSpot. On voudrait lancer ca ce mois-ci."

Informations attendues :

- besoin : qualification des visiteurs e-commerce ;
- integration : Shopify et HubSpot ;
- secteur : e-commerce ;
- urgence : lancement ce mois-ci ;
- budget : non confirme ;
- pays : non confirme.

Objections attendues :

- categorie : `integration` ;
- statut : `needs_follow_up` ;
- signal : demande de compatibilite Shopify.

Resume commercial attendu :
Le prospect cherche a utiliser Guidia sur un site Shopify pour qualifier les visiteurs avant export vers HubSpot. Le besoin est clair et l'urgence est elevee car le lancement est souhaite ce mois-ci. Le budget et le pays ne sont pas encore confirmes. L'objection principale concerne l'integration Shopify.

Prochaine action attendue :
Proposer un appel de qualification sous 24 heures pour valider le flux Shopify, HubSpot, le volume de leads et les contraintes techniques.

Temperature probable :
`hot`

## Test 2 - Lead tiede avec besoin clair mais budget absent

Message visiteur :
"On cherche un agent IA pour notre site B2B afin de repondre aux prospects et recuperer leurs informations. Pour l'instant on compare plusieurs solutions."

Informations attendues :

- besoin : agent IA pour site B2B ;
- objectif : repondre aux prospects et collecter les informations ;
- budget : non confirme ;
- urgence : non precisee ;
- secteur : B2B ;
- concurrence : comparaison de solutions.

Objections attendues :

- categorie : `competitor` ;
- statut : `detected` ;
- signal : comparaison de plusieurs solutions.

Resume commercial attendu :
Le prospect cherche un agent IA pour son site B2B afin de repondre aux prospects et collecter leurs informations. Le besoin est pertinent, mais le budget et l'urgence ne sont pas encore confirmes. Le prospect compare plusieurs solutions, ce qui indique une objection de concurrence a suivre. Le lead semble interesse mais necessite une qualification supplementaire.

Prochaine action attendue :
Demander le CRM utilise, le volume de leads mensuel et les criteres de comparaison pour positionner Guidia correctement.

Temperature probable :
`warm`

## Test 3 - Lead froid avec question generale

Message visiteur :
"C'est quoi Guidia exactement ?"

Informations attendues :

- besoin : non confirme ;
- budget : non confirme ;
- urgence : non confirmee ;
- secteur : non confirme ;
- pays : non confirme.

Objections attendues :

- aucune objection commerciale claire.

Resume commercial attendu :
Le visiteur demande une explication generale de Guidia sans exprimer encore de besoin commercial precis. Aucun budget, secteur, pays ou delai n'est confirme. Le lead doit etre considere comme peu qualifie a ce stade. L'objectif est de comprendre son contexte avant toute proposition commerciale.

Prochaine action attendue :
Repondre brievement sur la valeur de Guidia puis demander quel type de site ou d'activite le visiteur souhaite equiper.

Temperature probable :
`cold`

## Test 4 - Objection prix

Message visiteur :
"Votre solution est interessante, mais j'ai peur que ce soit trop cher pour une petite equipe."

Informations attendues :

- besoin : interet pour la solution ;
- budget : contrainte probable ;
- taille equipe : petite equipe ;
- urgence : non precisee.

Objections attendues :

- categorie : `price` ;
- statut : `needs_follow_up` ;
- signal : peur que la solution soit trop chere.

Resume commercial attendu :
Le prospect montre un interet pour Guidia mais exprime une objection prix liee a la taille de son equipe. Le besoin exact, le budget et l'urgence ne sont pas encore suffisamment qualifies. La discussion doit clarifier le volume de conversations et la valeur attendue avant de presenter une offre adaptee.

Prochaine action attendue :
Demander le volume mensuel de conversations et l'objectif commercial afin de proposer une formule adaptee a une petite equipe.

Temperature probable :
`warm`

## Test 5 - Objection securite

Message visiteur :
"Avant d'aller plus loin, je dois savoir comment les donnees des visiteurs sont stockees et protegees."

Informations attendues :

- besoin : interet potentiel ;
- objection : securite des donnees ;
- budget : non confirme ;
- urgence : non precisee.

Objections attendues :

- categorie : `security` ;
- statut : `needs_follow_up` ;
- signal : stockage et protection des donnees visiteurs.

Resume commercial attendu :
Le prospect veut valider la securite des donnees visiteurs avant de continuer la discussion. Le besoin commercial n'est pas encore completement detaille, mais l'objection securite est prioritaire. Le budget et l'urgence ne sont pas confirmes. Une reponse claire sur la gestion des donnees est necessaire pour avancer.

Prochaine action attendue :
Fournir une reponse securite concise et proposer un appel technique si le prospect a des contraintes de conformite.

Temperature probable :
`warm`

## Test 6 - Objection integration CRM

Message visiteur :
"Nous utilisons Salesforce. Est-ce que les leads peuvent etre envoyes automatiquement dedans ?"

Informations attendues :

- besoin : export automatique de leads ;
- integration : Salesforce ;
- budget : non confirme ;
- urgence : non precisee.

Objections attendues :

- categorie : `integration` ;
- statut : `needs_follow_up` ;
- signal : compatibilite Salesforce.

Resume commercial attendu :
Le prospect veut savoir si Guidia peut envoyer automatiquement les leads vers Salesforce. Le besoin d'integration CRM est clair, mais le budget, l'urgence et le volume de leads restent a confirmer. L'objection principale concerne la compatibilite Salesforce. Le lead est qualifiable si le projet est actif.

Prochaine action attendue :
Demander le type de donnees a envoyer vers Salesforce et le delai souhaite pour confirmer le flux d'export.

Temperature probable :
`warm`

## Test 7 - Demande de parler a un humain

Message visiteur :
"Je prefere parler directement avec quelqu'un de votre equipe commerciale."

Informations attendues :

- besoin : contact humain ;
- urgence : potentiellement elevee ;
- budget : non confirme ;
- secteur : non confirme.

Objections attendues :

- categorie : `human_request` ;
- statut : `needs_follow_up` ;
- signal : demande de parler a un commercial.

Resume commercial attendu :
Le prospect demande a parler directement avec un membre de l'equipe commerciale. Les informations de qualification restent limitees, mais la demande humaine indique une intention de poursuivre la discussion. Il faut collecter le nom, l'email, l'entreprise et le besoin principal avant de transmettre le lead.

Prochaine action attendue :
Demander les coordonnees du prospect et le sujet principal de l'appel afin de transmettre une fiche lead complete au commercial.

Temperature probable :
`warm`

