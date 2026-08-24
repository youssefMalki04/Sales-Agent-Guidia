import { ChatWidget } from "@/components/leadia/chat-widget";
import { getAgentBySlug } from "@/lib/agents/get-agent-by-slug";

type EmbedPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EmbedWidgetPage({ params }: EmbedPageProps) {
  const { slug } = await params;

  const agent = await getAgentBySlug(slug);

  if (!agent || !agent.active) {
    return (
      <div className="flex h-screen w-screen items-end justify-end bg-transparent p-5">
        <div className="max-w-[280px] rounded-lg border border-[#dedee3] bg-white px-4 py-3 text-sm text-[#555] shadow-[0_18px_45px_rgba(18,18,23,0.15)]">
          Cet assistant n&apos;est pas disponible actuellement.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-transparent">
      <ChatWidget embedded agentSlug={agent.slug} />
    </div>
  );
}