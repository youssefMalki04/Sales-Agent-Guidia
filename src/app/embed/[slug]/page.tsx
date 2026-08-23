import { notFound } from "next/navigation";

import { ChatWidget } from "@/components/leadia/chat-widget";
import { getAgentBySlug } from "@/lib/agents/get-agent-by-slug";

type EmbedPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EmbedWidgetPage({ params }: EmbedPageProps) {
  const { slug } = await params;

  const agent = await getAgentBySlug(slug);

  if (!agent || !agent.active) {
    notFound();
  }

  return (
    <div className="h-screen w-screen bg-transparent">
      <ChatWidget embedded />
    </div>
  );
}