export type Period = "7d" | "30d" | "90d";

export type AnalyticsData = {
  agentData: Array<{
    name: string;
    qualification: number;
    response: string;
    satisfaction: number;
    sessions: number;
  }>;
  metrics: {
    averageResponse: number;
    conversations: number;
    handoffRate: number;
    meetings: number;
    qualificationRate: number;
    qualified: number;
    wonRevenue: number;
  };
  objections: Array<{ count: number; label: string }>;
  questionData: Array<{ count: number; label: string; rate: number }>;
  sourceData: Array<{ color: string; name: string; value: number }>;
  trendData: Array<{
    conversations: number;
    day: string;
    meetings: number;
    qualified: number;
  }>;
};
