import type { LeadField } from "./import-export-types";

export const fieldOptions: Array<{ value: LeadField; label: string }> = [
  { value: "ignore", label: "Do not import" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "company", label: "Company" },
  { value: "country", label: "Country" },
  { value: "sector", label: "Sector" },
  { value: "score", label: "Conversion score" },
  { value: "temperature", label: "Temperature" },
  { value: "status", label: "Status" },
];
