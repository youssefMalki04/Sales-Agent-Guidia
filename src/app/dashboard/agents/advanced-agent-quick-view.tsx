import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { AgentProfile } from "./agent-types";

export function QuickView({
  profile,
  onClose,
  onOpen,
}: {
  profile: AgentProfile | null;
  onClose: () => void;
  onOpen: () => void;
}) {
  if (!profile) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{profile.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Domain" value={profile.template} />
          <Info label="Skills" value={String(profile.selectedSkills.length)} />
          <Info label="Participants" value={String(profile.members.length)} />
        </div>
        <p className="mt-4 text-sm leading-6 text-[#686872]">
          {profile.description}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onOpen}>Open full record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f1f1f3] p-4">
      <p className="text-xs font-bold uppercase text-[#777780]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
