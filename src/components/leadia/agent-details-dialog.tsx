import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DetailRow } from "./form-field";
import type { SalesAgentApp } from "./types";

export function AgentDetailsDialog({
  agent,
  onOpenChange,
  onOpenRecord,
}: {
  agent: SalesAgentApp | null;
  onOpenChange: (open: boolean) => void;
  onOpenRecord: (agent: SalesAgentApp) => void;
}) {
  return (
    <Dialog open={Boolean(agent)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-7">
        {agent ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                Sales agent <span>{agent.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <DetailRow label="Agent ID" value={agent.id} />
              <DetailRow label="Slug" value={agent.slug} />
              <DetailRow label="Description" value={agent.description || "-"} />
              <DetailRow label="Base URL" value={agent.baseUrl || "-"} />
              <DetailRow label="Allowed domains" value={agent.allowedDomains || "-"} />
              <DetailRow label="Created" value={agent.created} />
            </div>
            <DialogFooter className="mt-6 bg-transparent p-0">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => onOpenRecord(agent)}>Open full record</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
