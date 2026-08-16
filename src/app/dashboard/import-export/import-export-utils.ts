import type { LeadField } from "./import-export-types";

export const normalizeHeader = (header: string): LeadField => {
  const value = header.trim().toLowerCase().replaceAll(" ", "_");
  if (["name", "full_name", "nom"].includes(value)) return "name";
  if (["email", "e-mail", "mail"].includes(value)) return "email";
  if (["company", "entreprise", "organization"].includes(value))
    return "company";
  if (["country", "pays"].includes(value)) return "country";
  if (["sector", "secteur", "industry"].includes(value)) return "sector";
  if (["score", "conversion_score"].includes(value)) return "score";
  if (["temperature", "lead_temperature"].includes(value)) return "temperature";
  if (["status", "statut"].includes(value)) return "status";
  return "ignore";
};

export function parseCsvLine(line: string, delimiter: string) {
  const result: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') quoted = !quoted;
    else if (character === delimiter && !quoted) {
      result.push(value);
      value = "";
    } else value += character;
  }
  result.push(value);
  return result;
}
export function escapeCsv(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}
