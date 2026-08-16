import type { ConsentLog, PrivacySettings } from "./privacy-types";

export const STORAGE_KEY = "leadia-privacy-settings-v1";
export const initialSettings: PrivacySettings = {
  requireConsent: true,
  consentText:
    "Nous utilisons vos informations pour répondre à votre demande et améliorer votre expérience. Vous pouvez retirer votre consentement à tout moment.",
  policyUrl: "https://example.com/privacy",
  analytics: false,
  functionalCookies: true,
  anonymizeIp: true,
  conversationRetention: "90",
  leadRetention: "365",
  autoDelete: true,
};

export const logs: ConsentLog[] = [
  {
    id: "consent-1",
    visitor: "Visitor 8F2A",
    country: "Tunisia",
    status: "accepted",
    date: "11 Aug 2026, 10:42",
    version: "v1.2",
  },
  {
    id: "consent-2",
    visitor: "Visitor 4C91",
    country: "France",
    status: "accepted",
    date: "11 Aug 2026, 09:18",
    version: "v1.2",
  },
  {
    id: "consent-3",
    visitor: "Visitor A730",
    country: "Germany",
    status: "declined",
    date: "10 Aug 2026, 17:06",
    version: "v1.2",
  },
  {
    id: "consent-4",
    visitor: "Visitor 19BE",
    country: "Belgium",
    status: "accepted",
    date: "10 Aug 2026, 15:31",
    version: "v1.2",
  },
];
