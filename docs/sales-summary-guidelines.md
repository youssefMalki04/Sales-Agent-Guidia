# Guidia - Regles qualite pour les fiches leads

Ce document definit les regles a suivre pour generer une fiche lead exploitable par une equipe commerciale. Il sert de reference interne pour ameliorer la qualite de `sales_summary`, `suggested_next_action` et l'affichage des objections detectees.

## Objectif

Une fiche lead doit aider un commercial a comprendre rapidement :

- qui est le prospect ;
- quel besoin il exprime ;
- son niveau d'urgence ;
- son budget si disponible ;
- les objections detectees ;
- la prochaine action commerciale a effectuer.

L'agent ne doit pas recopier toute la conversation. Il doit produire une synthese courte, fiable et directement actionnable.

## Regles pour `sales_summary`

Le resume commercial doit etre clair, court et factuel.

Regles obligatoires :

- Rediger 3 a 5 phrases maximum.
- Mentionner le besoin principal du prospect.
- Mentionner l'entreprise, le secteur ou le pays uniquement si l'information est connue.
- Mentionner le budget et l'urgence uniquement s'ils ont ete confirmes ou fortement indiques.
- Mentionner les objections importantes : prix, securite, integration, concurrence, timing ou demande humaine.
- Ne jamais inventer une information manquante.
- Si une information est absente, utiliser une formulation explicite comme "budget non confirme" ou "urgence non precisee".
- Eviter les phrases vagues comme "le prospect est interesse" sans expliquer pourquoi.

Exemple correct :

Le prospect demande si Guidia peut fonctionner avec Shopify pour qualifier les visiteurs et exporter les leads vers un CRM. Le besoin d'integration est clair et l'urgence semble elevee, mais le budget n'est pas encore confirme. L'objection principale concerne la compatibilite technique avec Shopify. Le lead doit etre traite comme prioritaire si l'entreprise confirme un volume de leads significatif.

Exemple incorrect :

Le prospect est interesse par Guidia. Il faut le contacter.

## Regles pour `suggested_next_action`

La prochaine action doit etre une seule action concrete.

Regles obligatoires :

- Commencer par un verbe d'action.
- Indiquer ce que le commercial doit faire.
- Indiquer pourquoi cette action est prioritaire.
- Adapter l'action a la temperature du lead.
- Ne pas proposer plusieurs actions contradictoires.

Actions recommandees selon la temperature :

- Lead chaud : proposer une demo ou un appel sous 24 heures.
- Lead tiede : demander l'information manquante la plus importante, par exemple budget, volume ou outil CRM.
- Lead froid : envoyer une ressource courte ou une reponse educative, puis relancer plus tard.

Exemples corrects :

- Proposer un appel de qualification sous 24 heures pour valider l'integration Shopify, le CRM cible et le volume de leads.
- Demander le budget mensuel prevu avant de proposer une demo commerciale.
- Envoyer un cas d'usage similaire et relancer si le prospect confirme un projet actif.

## Regles pour les objections

Chaque objection doit etre classee avec une categorie et un statut.

Categories autorisees :

- `price` : objection sur le prix, le budget ou le retour sur investissement.
- `security` : objection sur la securite, les donnees, la confidentialite ou la conformite.
- `integration` : objection sur Shopify, HubSpot, Salesforce, Slack, API, webhook ou compatibilite technique.
- `competitor` : comparaison avec un concurrent ou une solution deja utilisee.
- `timing` : projet non prioritaire, decision reportee ou manque d'urgence.
- `human_request` : demande de parler a un humain, un commercial ou un support.

Statuts recommandes :

- `detected` : objection identifiee mais pas encore traitee.
- `answered` : l'agent a deja donne une reponse.
- `needs_follow_up` : le commercial doit reprendre le sujet.
- `resolved` : le prospect a accepte la reponse.

Regles obligatoires :

- Ne pas dupliquer la meme objection.
- Garder une trace courte de la phrase ou du signal qui a declenche l'objection.
- Si une objection est critique, elle doit apparaitre dans le resume commercial.
- Une objection technique bloquante doit generalement etre en `needs_follow_up`.

## Exemples de cas commerciaux

### Cas Shopify

Question prospect :
"Votre solution fonctionne avec Shopify ?"

Resume attendu :
Le prospect cherche a verifier si Guidia peut s'integrer avec Shopify pour discuter avec les visiteurs et qualifier les leads. Le besoin d'integration est clair, mais le budget, le volume de leads et le CRM cible ne sont pas encore confirmes. L'objection principale concerne la compatibilite Shopify. Il faut qualifier rapidement le contexte technique avant de proposer une demo.

Prochaine action attendue :
Demander le CRM utilise, le volume mensuel de leads et le delai de mise en place souhaite pour confirmer si une demo Shopify est pertinente.

Objection attendue :
`integration`, statut `needs_follow_up`.

### Cas securite

Question prospect :
"Comment vous gerez les donnees des visiteurs ?"

Resume attendu :
Le prospect s'interesse a Guidia mais veut valider la gestion des donnees visiteurs avant d'avancer. Le besoin commercial n'est pas encore completement qualifie, mais l'objection securite est claire. Il faut rassurer sur les donnees collectees, la conservation et les integrations utilisees.

Prochaine action attendue :
Envoyer une reponse securite courte et proposer un appel technique si le prospect a des exigences de conformite.

Objection attendue :
`security`, statut `needs_follow_up`.

### Cas prix

Question prospect :
"C'est combien par mois ?"

Resume attendu :
Le prospect demande le prix avant d'avoir donne son volume de conversations ou son besoin exact. Le budget n'est pas confirme et le niveau d'urgence reste inconnu. La discussion doit d'abord clarifier le volume, le CRM utilise et l'objectif commercial pour proposer une estimation pertinente.

Prochaine action attendue :
Demander le volume mensuel de conversations et le CRM utilise afin de proposer une fourchette adaptee.

Objection attendue :
`price`, statut `detected`.

