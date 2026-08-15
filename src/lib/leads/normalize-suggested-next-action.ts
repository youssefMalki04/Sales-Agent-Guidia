const MAX_NEXT_ACTION_LENGTH = 300;

const ACTION_VERBS = [
  "demander",
  "envoyer",
  "proposer",
  "planifier",
  "relancer",
  "transferer",
  "valider",
];

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function keepFirstAction(value: string) {
  return value.split(/\s+(?:puis|ensuite|et ensuite)\s+/i)[0]?.trim() ?? value;
}

function startsWithActionVerb(value: string) {
  const normalized = value.toLowerCase();
  return ACTION_VERBS.some((verb) => normalized.startsWith(verb));
}

export function normalizeSuggestedNextAction(action: string | null | undefined) {
  if (typeof action !== "string") {
    return null;
  }

  const normalized = compactWhitespace(action);

  if (normalized.length === 0) {
    return null;
  }

  const singleAction = keepFirstAction(normalized);
  const actionText = startsWithActionVerb(singleAction)
    ? singleAction
    : `Demander ${singleAction.charAt(0).toLowerCase()}${singleAction.slice(1)}`;

  if (actionText.length <= MAX_NEXT_ACTION_LENGTH) {
    return actionText;
  }

  return `${actionText.slice(0, MAX_NEXT_ACTION_LENGTH).trimEnd()}...`;
}
