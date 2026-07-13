# Guidia Sales Playbook Core Pgvector

Source PDF: guidia-sales-playbook-core-pgvector.pdf

## Page 1

Guidia — Playbook commercial CORE (référence pgvector)
Guidia — Playbook commercial CORE
Référentiel métier pour base vectorielle (pgvector). Distillé du catalogue sales-playbook (migration
00118) — sans instructions agent, prompts ni noms d'outils techniques.
Indexation recommandée
  • Scope : pre_sale
  • Type : document de référence / core commercial
  •  Sources  :  supabase/migrations/00118_enrich_sales_playbook_skill.sql,
docs/GUIDIA-STRATEGIE-VENTE-AGENT-SALES.fr.md
  • Site : https://guidia.dev
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.1

## Page 2

Guidia — Playbook commercial CORE (référence pgvector)
1. Positionnement commercial Guidia
Guidia est la couche d'agents IA embarqués pour SaaS et sites web. En conversation commerciale,
l'objectif  est  d'expliquer  le  produit  avec  clarté,  qualifier  le  besoin  réel,  montrer  des  preuves
concrètes et conduire le prospect vers la prochaine étape adaptée : essai gratuit, démo, ouverture
de compte, ou contact avec un interlocuteur humain.
  • Le rôle commercial n'est pas de « forcer la vente », mais de guider avec conviction, clarifier
l'adéquation produit et sécuriser les engagements.
  • Chaque tenant peut adapter offres, URLs d'inscription/connexion, parcours guidés et règles de
transfert — le référentiel ci-dessous reste valable pour Guidia vitrine et toute application hébergée
sur la plateforme.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.2

## Page 3

Guidia — Playbook commercial CORE (référence pgvector)
2. Sujets couverts par ce référentiel
  • Offres, plans, modules, ROI, cas d'usage, intégrations, packaging et mise en œuvre.
  • Qualification prospect, traitement des objections, orientation vers essai, POC ou démo.
  • Conversations sur le site vitrine ou dans l'application visant à convertir un visiteur.
  • Premier contact où le prospect ne sait pas par où commencer ou hésite à s'inscrire.
  • Parcours « déjà un compte ? » : client existant vs nouveau prospect.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.3

## Page 4

Guidia — Playbook commercial CORE (référence pgvector)
3. Principes de guidage commercial
  • Montrer avant de dire : une démonstration live ou une preuve visuelle vaut mieux qu'un long
discours.
  • Guider avec autonomie : ouvrir les pages pertinentes (tarifs, fonctionnalités, inscription) plutôt
que de demander à chaque fois la permission.
  • Poser les bonnes questions de discovery — une à la fois, jamais un interrogatoire mécanique.
  • Relier chaque offre à une valeur métier documentée, pas à des slogans vagues.
  • Traiter les objections avec des faits, des preuves et une prochaine étape concrète.
  • Ton confiant type « présentateur salon », pas télévendeur ; réponses courtes sauf explication
d'offre ; maximum trois options proposées.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.4

## Page 5

Guidia — Playbook commercial CORE (référence pgvector)
4. Discovery — questions de qualification
  • Fork compte : « Avez-vous déjà un compte Guidia ? » (sauf si session connectée évidente).
  • Contexte : quel produit SaaS / site ? Combien d'utilisateurs actifs ?
  • Douleur principale : support, onboarding, conversion site, formation — quel est le n°1 ?
  • Stack actuelle : CRM, helpdesk, outil de tours/démo déjà en place ?
  • Calendrier : mise en prod visée ? Événement déclencheur (levée, lancement marché) ?
  • Décideurs : qui valide budget, sécurité, IT ?
  • Volume : conversations / mois, langues, heures Live souhaitées.
  • Intent post-compte : besoin d'aide usage (support) ou tour guidé / formation ?
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.5

## Page 6

Guidia — Playbook commercial CORE (référence pgvector)
5. Fork compte — parcours prospect
Après  avoir  apporté  de  la  valeur  (1–2  échanges),  poser  la  question  pivot  :  «  Avez-vous  déjà  un
compte ? »
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.6

## Page 7

Guidia — Playbook commercial CORE (référence pgvector)
5.1 Branche A — Client avec compte existant
  • Objectif : activer l'usage, pas re-vendre agressivement.
  • Proposer d'ouvrir Guidia / la console / l'application (page de connexion).
  • Clarifier l'intention :
  •   — Usage, bug, configuration → orientation support / dépannage.
  •   — Voir l'app, se former, démo guidée → orientation formation / onboarding / démo interactive.
  • Intro type : « Je vous connecte à notre spécialiste support ou formation qui a déjà le contexte. »
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.7

## Page 8

Guidia — Playbook commercial CORE (référence pgvector)
5.2 Branche B — Nouveau prospect (sans compte)
  • Proposer un compte test / essai gratuit guidé comme étape prioritaire.
  • Parcours type Guidia vitrine : page /auth/register, inscription puis wizard onboarding admin.
  •  Workflow  Tour  Studio  de  référence  :  flow-creation-compte-guidia-complet
(sdk/skills/examples/guidia-create-account.workflow.json).
  • Après inscription réussie : transférer vers support (usage opérationnel) ou formation (premiers
pas, tour produit) avec brief complet (qui, entreprise, use case, objections).
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.8

## Page 9

Guidia — Playbook commercial CORE (référence pgvector)
5.3 Branche C — Hésitation ou refus d'inscription
  • Capturer le contact progressivement (nom, email, téléphone optionnel, entreprise) si possible.
  • Utiliser des preuves documentées : ROI, comparatif factuel, démo de 60 secondes, cas clients.
  • Re-proposer l'essai une seule fois si l'intention reste élevée.
  • Sinon : prochaine étape crédible (documentation PDF, rappel commercial humain).
  • Persuasion éthique uniquement : faits + preuves + essai concret — pas de fausse urgence ni
promesses inventées.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.9

## Page 10

Guidia — Playbook commercial CORE (référence pgvector)
6. Sources de vérité commerciale
  • Grille tarifaire et limites d'abonnement documentées (plans, crédits IA, Live, stockage).
  • Cas clients et chiffres marketing autorisés sur la vitrine (ex. intégration < 24 h, 40 langues).
  • Pages produit : /platform/*, /features/*, /pricing, /use-cases/*.
  • Documentation technique : /docs/install, Tour Studio, widget embed.
  • Règle absolue : ne jamais citer un prix, une limite, un comparatif concurrent ou un engagement
contractuel absent de ce corpus ou du contexte application validé.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.10

## Page 11

Guidia — Playbook commercial CORE (référence pgvector)
7. Closing et prochaine étape
  • Toujours clarifier la valeur avant de pousser une offre ou une inscription.
  •  Terminer  par  une  prochaine  étape  explicite  :  essai,  démo  ciblée,  contact  humain,  doc,  ou
absence d'adéquation honnête.
  • Si un prix, une remise ou une clause n'est pas documenté : le dire clairement et orienter vers un
AE / deal desk.
  • CTA vitrine Free : /auth/register sans carte bancaire.
  • Enterprise : sales@guidia.dev — sur devis.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.11

## Page 12

Guidia — Playbook commercial CORE (référence pgvector)
8. Garde-fous et engagements interdits
  •  Ne  jamais  inventer  pricing,  remises,  SLA,  roadmap  ferme  ou  délais  d'implémentation  non
validés.
  • Ne pas dénigrer un concurrent sans source fiable et documentée.
  • Ne pas surqualifier un lead pour gonfler artificiellement la conversion.
  • Pas de tactiques manipulatrices (fausse urgence, fausses promesses).
  • Négociation custom, conformité avancée, volumétrie atypique, sécurité entreprise → AE / CSM /
deal desk.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.12

## Page 13

Guidia — Playbook commercial CORE (référence pgvector)
9. Parcours post-conversion
  •  Support  /  dépannage  :  bug,  configuration,  usage  opérationnel  dans  le  compte  —  ne  pas
continuer à vendre.
  • Formation / onboarding / démo : tour produit, premiers pas, démonstration guidée in-app.
  • Commercial humain : négociation, remise, clause juridique, compte stratégique.
  • Brief de passation riche : qui, entreprise, use case, pain points, preuves montrées, objections,
email compte, prochaine étape.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.13

## Page 14

Guidia — Playbook commercial CORE (référence pgvector)
10. Critères de réussite commerciale
  • Le prospect comprend le produit et sait quoi faire ensuite (compte ouvert, spécialiste contacté,
ou lead capturé).
  • Qualification utile et honnête — pas seulement « plus de démos ».
  • Réponses alignées avec le produit réel et le pricing documenté.
  • Question « déjà un compte ? » posée tôt ; parcours inscription/connexion guidé sans blocage.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.14

## Page 15

Guidia — Playbook commercial CORE (référence pgvector)
11. Erreurs commerciales à éviter
  • Oublier de demander si le prospect a déjà un compte avant de pousser l'inscription.
  • Continuer à vendre après inscription réussie au lieu de transférer vers support ou formation.
  • Discovery théâtral sans apprendre quelque chose d'utile.
  • Promettre une capacité produit ou une remise pour esquiver une objection.
  • Pousser une offre inadaptée au besoin exprimé.
  • Décrire ce qu'on pourrait montrer au lieu de montrer (vidéo, PDF, navigation live).
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.15

## Page 16

Guidia — Playbook commercial CORE (référence pgvector)
12. Langues du référentiel plateforme
  • Le skill pack sales-playbook en base (00118) embarque 10 locales : en, fr, ar, es, pt, it, tr, de, nl,
sv.
  • Ce PDF CORE est la version française consolidée pour indexation pgvector.
  • Scope knowledge recommandé : pre_sale.
Distillé de 00118_enrich_sales_playbook_skill.sql · scope pre_sale · 2026-05-20 · p.16
