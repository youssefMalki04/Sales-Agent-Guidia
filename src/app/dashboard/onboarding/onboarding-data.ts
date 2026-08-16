import {
  Bot,
  BrainCircuit,
  Code2,
  Database,
  Palette,
  PlugZap,
  Rocket,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type { Step } from "./onboarding-types";

export const STORAGE_KEY = "leadia-onboarding-v1";

export const steps: Step[] = [
  {
    id: "agent",
    title: "Create your AI sales agent",
    description: "Define its name, goal, language and sales personality.",
    href: "/dashboard/agents",
    action: "Open Agent Studio",
    icon: Bot,
    estimate: "3 min",
    phase: "build",
  },
  {
    id: "knowledge",
    title: "Add your knowledge base",
    description: "Upload product documents and useful commercial answers.",
    href: "/dashboard/knowledge",
    action: "Add knowledge",
    icon: Database,
    estimate: "5 min",
    phase: "build",
  },
  {
    id: "qualification",
    title: "Configure qualification rules",
    description:
      "Choose the information and scoring signals that identify a good lead.",
    href: "/dashboard/qualification-flows",
    action: "Configure flow",
    icon: BrainCircuit,
    estimate: "4 min",
    phase: "build",
  },
  {
    id: "branding",
    title: "Customize the widget",
    description:
      "Match the assistant colors, welcome message and position to your brand.",
    href: "/dashboard/branding",
    action: "Customize widget",
    icon: Palette,
    estimate: "3 min",
    phase: "build",
  },
  {
    id: "test",
    title: "Test the agent",
    description:
      "Run realistic visitor scenarios before exposing the agent to customers.",
    href: "/dashboard/agents",
    action: "Open Playground",
    icon: Sparkles,
    estimate: "5 min",
    phase: "test",
  },
  {
    id: "install",
    title: "Install the website widget",
    description:
      "Copy the generated snippet into a test page or customer website.",
    href: "/dashboard/widget-installation",
    action: "Install widget",
    icon: Code2,
    estimate: "2 min",
    phase: "test",
  },
  {
    id: "integration",
    title: "Connect your sales stack",
    description:
      "Send qualified leads to a CRM and alert the right sales channel.",
    href: "/dashboard/integrations",
    action: "Connect integration",
    icon: PlugZap,
    estimate: "5 min",
    phase: "launch",
  },
  {
    id: "team",
    title: "Invite your sales team",
    description:
      "Assign roles and decide how incoming opportunities are distributed.",
    href: "/dashboard/team",
    action: "Invite team",
    icon: UsersRound,
    estimate: "2 min",
    phase: "launch",
  },
  {
    id: "publish",
    title: "Publish and monitor",
    description: "Activate the agent and follow its conversion performance.",
    href: "/dashboard/analytics",
    action: "View performance",
    icon: Rocket,
    estimate: "1 min",
    phase: "launch",
  },
];

export const phases = [
  {
    id: "build",
    label: "Build",
    detail: "Create the foundation",
    color: "bg-[#5964d6]",
  },
  {
    id: "test",
    label: "Test",
    detail: "Validate the experience",
    color: "bg-[#9b6bd6]",
  },
  {
    id: "launch",
    label: "Launch",
    detail: "Connect and go live",
    color: "bg-[#2aaa83]",
  },
] as const;
