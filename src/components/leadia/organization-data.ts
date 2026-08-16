export type ActiveTab = "organizations" | "applications";

export type OrganizationRecord = {
  name: string;
  slug: string;
  initial: string;
  createdAt: string;
  active: boolean;
};

export type ApplicationRecord = {
  id: string;
  token: string;
  name: string;
  slug: string;
  description: string;
  baseUrl: string;
  publicUrl: string;
  allowedDomains: string;
  createdAt: string;
  createdAtFull: string;
  active: boolean;
};

export type ApplicationForm = Pick<
  ApplicationRecord,
  "name" | "slug" | "description" | "baseUrl" | "allowedDomains"
>;

export const initialOrganization: OrganizationRecord = {
  name: "yosra's prod",
  slug: "yosra-s-prod",
  initial: "Y",
  createdAt: "6/15/2026",
  active: true,
};

export const defaultApplicationForm: ApplicationForm = {
  name: "Lynara ERP",
  slug: "lynara-erp",
  description: "",
  baseUrl: "https://lynara.ai",
  allowedDomains: "*.guidia.dev",
};

export const fieldClass =
  "h-11 w-full rounded-xl border border-[#dfe2eb] bg-white px-3 text-sm font-normal text-[#343849] shadow-none outline-none transition placeholder:text-[#a0a4b2] focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
export const textareaClass =
  "min-h-[104px] w-full resize-y rounded-xl border border-[#dfe2eb] bg-white px-3 py-2.5 text-sm font-normal leading-5 text-[#343849] shadow-none outline-none transition placeholder:text-[#a0a4b2] focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
export const labelClass = "text-xs font-bold leading-none text-[#555a6b]";
