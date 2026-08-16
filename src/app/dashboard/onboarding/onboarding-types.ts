import type { LucideIcon } from "lucide-react";

export type Step = {
  id: string;
  title: string;
  description: string;
  href: string;
  action: string;
  icon: LucideIcon;
  estimate: string;
  phase: "build" | "test" | "launch";
};
