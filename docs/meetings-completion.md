# Meetings — livraison et activation

## Implémenté dans ce lot

- Report de sept jours depuis la date du rendez-vous, y compris fin de mois/année.
- Même mois en liste et calendrier ; agenda compact sur mobile.
- Filtres période, statut, responsable, terminés sans compte rendu, archives.
- Actualisation manuelle, erreur avec nouvelle tentative, chargement paginé.
- Responsables issus de l’équipe locale ; protection contre les doubles clics.
- Confirmation avant abandon du formulaire ou d’un e-mail modifié.
- Statut absent, archivage/restauration sans suppression.
- Historique des changements (après activation de la migration).
- Nouvelles tâches liées explicitement au rendez-vous.
- Contrainte SQL anti-chevauchement préparée.

## Activation Supabase nécessaire

Les migrations n’ont pas été exécutées par l’assistant. Sauvegarder la base et tester en préproduction.

1. Vérifier que les migrations précédentes, notamment 030, sont appliquées.
2. Appliquer `031_meetings_management.sql` : archivage, statut absent, lien tâche et journal.
3. Avant `032_meetings_atomic_conflicts.sql`, rechercher les chevauchements avec la requête ci-dessous. Les résoudre manuellement, sans supprimer de rendez-vous automatiquement.
4. Appliquer 032. Elle échoue volontairement si des chevauchements existent.

```sql
select a.id as first_meeting, b.id as second_meeting, a.owner
from public.meetings a
join public.meetings b on a.id < b.id
  and lower(btrim(a.owner)) = lower(btrim(b.owner))
  and tsrange(a.scheduled_date + a.scheduled_time,
    a.scheduled_date + a.scheduled_time + a.duration * interval '1 minute', '[)')
  && tsrange(b.scheduled_date + b.scheduled_time,
    b.scheduled_date + b.scheduled_time + b.duration * interval '1 minute', '[)')
where a.status in ('pending', 'confirmed') and b.status in ('pending', 'confirmed')
  and a.archived_at is null and b.archived_at is null;
```

La comparaison utilise le nom du responsable. Deux alias du même utilisateur ne sont pas identifiés comme une seule personne : des identifiants d’équipe persistants sont requis en production.

## Recette manuelle à effectuer

1. Créer un rendez-vous de test lié à un prospect, puis actualiser : vérifier sa présence.
2. Reporter un rendez-vous du 28 décembre de sept jours : vérifier le 4 janvier suivant.
3. Vérifier le même mois en liste et calendrier et chaque filtre ; réinitialiser.
4. Archiver, retrouver dans Archives, restaurer ; vérifier la fiche prospect.
5. Modifier un horaire et consulter l’historique ; tester un créneau occupé.
6. Créer une tâche depuis Suivi : vérifier son affichage dans le rendez-vous et Tasks.
7. Modifier un formulaire/e-mail puis fermer : refuser l’abandon et vérifier le texte.
8. Tester à 390 px et sur ordinateur : défilement, boutons et formulaires accessibles.
9. Tester une erreur réseau puis Réessayer, sans envoyer d’e-mail réel.

## Pas encore livré / décisions nécessaires

- Fuseau horaire métier : actuellement horaires locaux de l’appareil, pas de fuseau persisté par rendez-vous. Choisir Africa/Tunis commun ou plusieurs fuseaux avant les rappels serveur.
- Rappels automatiques Leadia : non implémentés pour Meetings ; les alarmes existantes concernent l’export calendrier.
- Authentification, rôles et isolation par organisation : pas de vraie identité utilisateur actuellement. Le journal ne prouve donc pas l’auteur d’une action.
- Synchronisation Google/Outlook, invitations et RSVP, création automatique de lien vidéo : fournisseur et autorisations OAuth nécessaires.
- Rendez-vous récurrents et réservation publique : règles de disponibilité, accès et fuseaux à définir.
- Envoi de production : domaine Resend vérifié et expéditeur à configurer, sans exposer les secrets.
- Traduction intégrale des composants partagés et vérification navigateur de bout en bout restent à terminer.

Les tests automatisés ne remplacent pas l’exécution des migrations ni cette recette navigateur.
