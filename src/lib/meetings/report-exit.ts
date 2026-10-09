export type ReportEditState = { dirty: boolean; saving: boolean };

export function canLeaveMeetingReport(
  state: ReportEditState,
  confirmDiscard: (message: string) => boolean,
) {
  if (state.saving) return false;
  return !state.dirty || confirmDiscard(
    "Votre compte rendu n’est pas enregistré. Quitter et abandonner le texte ?\n\nChoisissez Annuler pour rester et l’enregistrer.",
  );
}
