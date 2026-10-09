"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  History,
  MessageSquareText,
  Pencil,
  PlusCircle,
  RotateCcw,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { initialMembers } from "../team/team-data";
import type { FollowUpTask } from "./tasks-workspace";

type TaskActivity = {
  action: "created" | "updated" | "completed" | "reopened" | "commented";
  actorName: string;
  createdAt: string;
  id: string;
  message: string;
};

export function TaskActivityDialog({
  open,
  task,
  onOpenChange,
}: {
  open: boolean;
  task: FollowUpTask;
  onOpenChange: (open: boolean) => void;
}) {
  const [activity, setActivity] = useState<TaskActivity[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadActivity() {
    setLoading(true);
    try {
      const response = await fetch(`/api/follow-ups/activity?id=${task.id}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        activity?: TaskActivity[];
        error?: string;
      };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to load activity");
      setActivity(payload.activity ?? []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load activity",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch(`/api/follow-ups/activity?id=${task.id}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as {
          activity?: TaskActivity[];
          error?: string;
        };
        if (!response.ok)
          throw new Error(payload.error ?? "Unable to load activity");
        return payload.activity ?? [];
      })
      .then((items) => {
        if (!active) return;
        setActivity(items);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load activity",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, task.id]);

  async function addComment() {
    if (!comment.trim()) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/follow-ups/activity", {
        body: JSON.stringify({
          actorName: initialMembers[0].name,
          id: task.id,
          message: comment,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(payload.error ?? "Unable to add comment");
      setComment("");
      await loadActivity();
    } catch (commentError) {
      setError(
        commentError instanceof Error
          ? commentError.message
          : "Unable to add comment",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[24px] p-0 sm:max-w-[620px]">
        <DialogHeader className="border-b bg-gradient-to-br from-[#f0f2ff] to-white px-6 py-5">
          <span className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-[#5964d6] text-white">
            <History className="size-5" />
          </span>
          <DialogTitle className="text-xl font-bold">Task activity</DialogTitle>
          <DialogDescription className="line-clamp-1">
            {task.title} · {task.lead?.name || task.lead?.email || "Unknown lead"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[42vh] min-h-48 overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading activity…</p>
          ) : activity.length ? (
            <div className="space-y-5">
              {activity.map((item, index) => {
                const Icon = activityIcon(item.action);
                return (
                  <div key={item.id} className="relative flex gap-3">
                    {index < activity.length - 1 ? (
                      <span className="absolute left-4 top-9 h-[calc(100%+4px)] w-px bg-slate-200" />
                    ) : null}
                    <span className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${activityTone(item.action)}`}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800">{item.actorName}</p>
                        <time className="text-xs text-slate-400">{formatActivityDate(item.createdAt)}</time>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <History className="mx-auto size-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">No activity yet</p>
              <p className="mt-1 text-xs text-slate-500">New changes and comments will appear here.</p>
            </div>
          )}
          {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        </div>

        <div className="border-t bg-slate-50/70 px-6 py-4">
          <label className="text-sm font-bold text-slate-800">Internal comment</label>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add context for your team…"
            className="mt-2 min-h-20 resize-none bg-white"
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={addComment}
              disabled={saving || !comment.trim()}
              className="rounded-xl bg-[#5964d6] hover:bg-[#4f5acb]"
            >
              <Send className="size-4" /> {saving ? "Adding…" : "Add comment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function activityIcon(action: TaskActivity["action"]) {
  if (action === "created") return PlusCircle;
  if (action === "completed") return CheckCircle2;
  if (action === "reopened") return RotateCcw;
  if (action === "commented") return MessageSquareText;
  return Pencil;
}

function activityTone(action: TaskActivity["action"]) {
  if (action === "completed") return "bg-emerald-100 text-emerald-700";
  if (action === "commented") return "bg-violet-100 text-violet-700";
  if (action === "reopened") return "bg-sky-100 text-sky-700";
  return "bg-slate-100 text-slate-600";
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
