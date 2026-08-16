export type PrivacySettings = {
  requireConsent: boolean;
  consentText: string;
  policyUrl: string;
  analytics: boolean;
  functionalCookies: boolean;
  anonymizeIp: boolean;
  conversationRetention: string;
  leadRetention: string;
  autoDelete: boolean;
};

export type ConsentLog = {
  id: string;
  visitor: string;
  country: string;
  status: "accepted" | "declined";
  date: string;
  version: string;
};
