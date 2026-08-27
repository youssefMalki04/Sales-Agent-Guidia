import { Clock3, Flame, Mail, MessageSquareText } from "lucide-react";

import type { InboxConversation } from "./inbox-types";
import { Avatar, Info, InfoMetric } from "./inbox-ui";

export function ConversationDetails({
  conversation,
}: {
  conversation: InboxConversation;
}) {
  return (
    <aside className="min-h-0 overflow-y-auto bg-white p-5">
      <div className="text-center">
        <Avatar name={conversation.visitor} large />
        <h2 className="mt-3 font-semibold">{conversation.visitor}</h2>
        <p className="mt-1 text-xs text-[#81818a]">{conversation.company}</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <InfoMetric
          icon={<Flame className="size-4 text-red-500" />}
          label="Score"
          value={`${conversation.score}/100`}
        />
        <InfoMetric
          icon={<Clock3 className="size-4 text-indigo-500" />}
          label="Status"
          value={conversation.mode}
        />
      </div>
      <Info title="Contact">
        <p className="flex items-center gap-2">
          <Mail className="size-4" /> {conversation.email}
        </p>
      </Info>
      <Info title="Identified need">
        <p>{conversation.need}</p>
      </Info>
      <Info title="Assigned to">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#5964d6] text-[10px] font-bold text-white">
            {conversation.owner?.[0] ?? "AI"}
          </span>
          <span>{conversation.owner ?? "AI Assistant"}</span>
        </div>
      </Info>
      <Info title="Suggested action">
        <p className="flex gap-2">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          Confirm the business need and propose a 20-minute demo.
        </p>
      </Info>
    </aside>
  );
}
