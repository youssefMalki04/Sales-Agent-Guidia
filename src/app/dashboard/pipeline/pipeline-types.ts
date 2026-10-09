export type Stage =
  "new" | "qualified" | "meeting" | "proposal" | "won" | "lost";
export type Temperature = "hot" | "warm" | "cold";

export type PipelineLead = {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  score: number;
  temperature: Temperature;
  stage: Stage;
  owner: string;
  dueDate: string;
  dueDateValue?: string | null;
};
