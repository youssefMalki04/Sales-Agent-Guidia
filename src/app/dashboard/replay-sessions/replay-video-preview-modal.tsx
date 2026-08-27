import { Button } from "@/components/ui/button";
import {
  InformationCard,
  ModalHeader,
  ModalOverlay,
} from "./replay-modal-components";
import type { VideoReplay } from "./replay-types";

export function VideoPreviewModal({
  replay,
  onClose,
}: {
  replay: VideoReplay;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full max-w-[850px] overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader
          title={replay.title}
          subtitle="Video replay"
          onClose={onClose}
        />

        <div className="p-5">
          <video
            src={replay.videoUrl}
            controls
            autoPlay
            className="aspect-video w-full rounded-2xl bg-black shadow-sm"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InformationCard label="Duration" value={replay.duration} />

            <InformationCard label="Size" value={replay.size} />

            <InformationCard label="Status" value={replay.status} />
          </div>
        </div>

        <div className="flex justify-end border-t border-[#e1e1e5] bg-[#fafafa] px-5 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* -------------------------------------------------------------------------- */
