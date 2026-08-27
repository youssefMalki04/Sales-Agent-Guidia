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

export type ImportResult = {
  imported: number;
  updated: number;
  skipped: number;
  invalid: Array<{ row: number; error: string }>;
};
