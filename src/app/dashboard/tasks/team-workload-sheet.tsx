"use client";

import { AlertTriangle, Sparkles, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type WorkloadMember = {
  email: string;
  id: string;
  name: string;
  overdueTasks: number;
  taskCount: number;
};

export function TeamWorkloadSheet({
  assigning,
  members,
  onAutoAssign,
  onOpenChange,
  open,
  unassignedCount,
}: {
  assigning: boolean;
  members: WorkloadMember[];
  onAutoAssign: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  unassignedCount: number;
}) {
  const overloaded = members.filter((member) => member.overdueTasks >= 3);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <span className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#5964d6]">
            <UsersRound className="size-5" />
          </span>
          <SheetTitle className="text-xl font-bold">Team workload</SheetTitle>
          <SheetDescription>
            Balance upcoming tasks between active salespeople.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {overloaded.length ? (
            <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                <span className="font-bold">Attention:</span>{" "}
                {overloaded.map((member) => member.name).join(", ")} has at
                least 3 overdue tasks.
              </p>
            </div>
          ) : null}
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-xs font-bold text-[#5964d6]">
                  {initials(member.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {member.email}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-slate-700">
                      {member.taskCount} tasks
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${member.taskCount >= 8 ? "bg-red-500" : member.taskCount >= 5 ? "bg-amber-500" : "bg-[#5964d6]"}`}
                      style={{
                        width: `${Math.min(100, member.taskCount * 12.5)}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`mt-2 text-xs font-semibold ${member.overdueTasks ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {member.overdueTasks
                      ? `${member.overdueTasks} overdue`
                      : "No overdue tasks"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="border-t bg-slate-50 px-6 py-5">
          <p className="mb-1 text-xs text-slate-500">
            {unassignedCount
              ? `${unassignedCount} unassigned task${unassignedCount > 1 ? "s" : ""} will be distributed to the least busy people.`
              : "All upcoming tasks are assigned."}
          </p>
          <Button
            disabled={!unassignedCount || assigning}
            onClick={onAutoAssign}
            className="h-11 w-full rounded-xl bg-[#5964d6] hover:bg-[#4f5acb]"
          >
            <Sparkles className="size-4" />
            {assigning ? "Assigning…" : "Auto-assign unassigned tasks"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
