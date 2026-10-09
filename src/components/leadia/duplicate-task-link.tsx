import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type TaskCreationResponse = {
  error?: string;
  code?: string;
  duplicate?: { id: string };
};

export function duplicateTaskId(payload: TaskCreationResponse) {
  const id = payload.duplicate?.id;
  return payload.code === "DUPLICATE_OPEN_TASK" && typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
}

export function DuplicateTaskLink({ taskId }: { taskId: string | null }) {
  if (!taskId) return null;
  return <Link href={`/dashboard/tasks?taskId=${encodeURIComponent(taskId)}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#5964d6] underline underline-offset-4">
    Voir la tâche existante <ArrowUpRight className="size-4" />
  </Link>;
}
