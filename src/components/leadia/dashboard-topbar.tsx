"use client";

import { usePathname } from "next/navigation";

import { Topbar } from "./topbar";

const pageTitles = [
  { href: "/dashboard/onboarding", title: "Getting started" },
  { href: "/dashboard/organization", title: "Organization" },
  { href: "/dashboard/team", title: "Team" },
  { href: "/dashboard/agents", title: "Agents" },
  { href: "/dashboard/knowledge", title: "Knowledge base" },
  { href: "/dashboard/qualification-flows", title: "Qualification flows" },
  { href: "/dashboard/replay-sessions", title: "Replay sessions" },
  { href: "/dashboard/branding", title: "Branding" },
  { href: "/dashboard/privacy", title: "Privacy & GDPR" },
  { href: "/dashboard/analytics", title: "Dashboard" },
  { href: "/dashboard/inbox", title: "Live inbox" },
  { href: "/dashboard/conversations", title: "Conversations" },
  { href: "/dashboard/notifications", title: "Notifications" },
  { href: "/dashboard/leads", title: "Leads" },
  { href: "/dashboard/meetings", title: "Meetings" },
  { href: "/dashboard/tickets", title: "Tickets" },
  { href: "/dashboard/docs", title: "Docs" },
  { href: "/dashboard/import-export", title: "Import / Export" },
  { href: "/dashboard/crm-payloads", title: "CRM payloads" },
  { href: "/dashboard/integrations", title: "Integration center" },
  { href: "/dashboard/webhooks", title: "Webhooks" },
];

export function DashboardTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const page = pageTitles.find((item) => pathname.startsWith(item.href));

  return <Topbar title={page?.title ?? "Dashboard"} agentName="lynara" onMenuClick={onMenuClick} />;
}
