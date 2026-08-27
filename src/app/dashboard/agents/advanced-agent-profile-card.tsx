import {
  Bot,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  Pause,
  Pencil,
  Play,
  Rocket,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AgentProfile } from "./agent-types";

export function ProfileCard({
  profile,
  onView,
  onQuickView,
  onEdit,
  onClone,
  onDefault,
  onDelete,
  onStatusChange,
  onTest,
}: {
  profile: AgentProfile;
  onView: () => void;
  onQuickView: () => void;
  onEdit: () => void;
  onClone: () => void;
  onDefault: () => void;
  onDelete: () => void;
  onStatusChange: () => void;
  onTest: () => void;
}) {
  return (
    <article className="soft-lift group overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8eaff] to-[#f1f2ff] text-[#5964d6] ring-1 ring-[#e1e4f8]">
            <Bot className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {profile.template === "support" ? "Support" : "Sales"} ·{" "}
              {profile.members.length} participant ·{" "}
              {profile.selectedSkills.length} skills
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.integrationStatus === "ready" && (
            <Badge
              variant="outline"
              className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <Check className="mr-1 size-3" /> READY
            </Badge>
          )}
          <StatusBadge status={profile.status} />
          {profile.isDefault && (
            <Badge className="rounded-full bg-[#f1f2ff] text-[#5964d6] hover:bg-[#f1f2ff]">
              DEFAULT
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {profile.description}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {profile.selectedSkills.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Skills</p>
        </div>
        <div className="border-x border-slate-200">
          <p className="text-lg font-semibold text-slate-900">
            {profile.selectedTools.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Tools</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {profile.members.length}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Members</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Button
          size="sm"
          onClick={onTest}
          className="rounded-lg bg-[#5964d6] text-white hover:bg-[#4f5acb]"
        >
          <Play className="size-4" /> Test agent
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="rounded-lg"
        >
          <Pencil className="size-4" /> Edit
        </Button>
        <Button size="sm" variant="outline" onClick={onQuickView}>
          <Eye className="size-4" /> View details
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={profile.isDefault}
          onClick={onDefault}
        >
          Set as default
        </Button>
        <Button size="sm" variant="outline" onClick={onClone}>
          <Copy className="size-4" /> Clone
        </Button>
        <Button size="sm" variant="outline" onClick={onStatusChange}>
          {profile.status === "published" ? (
            <Pause className="size-4" />
          ) : (
            <Rocket className="size-4" />
          )}
          {profile.status === "published" ? "Pause" : "Publish"}
        </Button>
        {profile.status === "published" ? (
          <Button size="sm" variant="outline" asChild>
            <Link
              href={`/dashboard/branding?agentId=${encodeURIComponent(profile.id)}`}
            >
              <Code2 className="size-4" /> Integrate
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled
            title="Publish the agent before integration"
          >
            <Code2 className="size-4" /> Integrate
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          className="border-rose-200 bg-rose-50 text-rose-600"
        >
          <Trash2 className="size-4" /> Delete
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onView}
          className="ml-auto text-[#5964d6] hover:bg-[#f1f2ff] hover:text-[#4f5acb]"
        >
          Open profile <ChevronRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: AgentProfile["status"] }) {
  const styles = {
    draft: "border-amber-200 bg-amber-50 text-amber-700",
    published: "border-emerald-200 bg-emerald-50 text-emerald-700",
    paused: "border-slate-200 bg-slate-50 text-slate-600",
  }[status];
  return (
    <Badge variant="outline" className={cn("rounded-full", styles)}>
      {status.toUpperCase()}
    </Badge>
  );
}
