export type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  sector: string | null;
  need: string | null;
  suggested_next_action: string | null;
  summary: string | null;
  urgency: string | null;
  lead_temperature: string | null;
  conversion_score: number | null;
  crm_status: string | null;
  created_at: string;
};

export type LeadsPageProps = {
  searchParams?: Promise<{
    from?: string;
    q?: string;
    source?: string;
    status?: string;
    temperature?: string;
    country?: string;
    sector?: string;
    urgency?: string;
    crm?: string;
    to?: string;
  }>;
};
