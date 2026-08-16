import type { LeadField } from "./import-export-types";

export const sampleLeads = [
  {
    name: "Amira Ben Salah",
    email: "amira@nexa.tn",
    company: "Nexa Retail",
    country: "Tunisia",
    sector: "Retail",
    score: "87",
    temperature: "Hot",
    status: "Qualified",
  },
  {
    name: "Thomas Martin",
    email: "thomas@flowdesk.fr",
    company: "Flowdesk",
    country: "France",
    sector: "SaaS",
    score: "76",
    temperature: "Warm",
    status: "New",
  },
  {
    name: "Sara Trabelsi",
    email: "sara@kite.tn",
    company: "Kite Finance",
    country: "Tunisia",
    sector: "Finance",
    score: "64",
    temperature: "Warm",
    status: "Meeting",
  },
];

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
