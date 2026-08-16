export type LeadField =
  | "ignore"
  | "name"
  | "email"
  | "company"
  | "country"
  | "sector"
  | "score"
  | "temperature"
  | "status";

export type CsvRow = Record<string, string>;
