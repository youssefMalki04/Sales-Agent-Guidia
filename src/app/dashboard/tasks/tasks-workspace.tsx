"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  History,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
  Columns3,
  List,
  UsersRound,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTaskDialog } from "./create-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { TaskActivityDialog } from "./task-activity-dialog";
import { TaskBoard, type BoardColumn } from "./task-board";
import { TeamWorkloadSheet } from "./team-workload-sheet";
import { initialMembers } from "../team/team-data";

type TaskFilter = "all" | "today" | "upcoming" | "overdue" | "completed";
type AssignmentFilter = "all" | "mine" | "unassigned";
type Priority = "low" | "medium" | "high" | "urgent";
type PriorityFilter = "all" | Priority;

export type FollowUpTask = {
  assignedTo: string | null;
  assignedToEmail: string | null;
  completedAt: string | null;
  createdAt: string;
  dueAt: string;
  id: string;
  lead: {
    company: string | null;
    email: string | null;
    id: string;
    name: string | null;
  } | null;
  leadId: string;
  notes: string | null;
  priority: Priority;
  status: "completed" | "upcoming";
  title: string;
};

export function TasksWorkspace({ initialTaskId }: { initialTaskId?: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [assignmentFilter, setAssignmentFilter] =
    useState<AssignmentFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<FollowUpTask | null>(null);
  const [activityTask, setActivityTask] = useState<FollowUpTask | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "board">("list");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [workloadOpen, setWorkloadOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await fetch("/api/follow-ups", { cache: "no-store" });
      const payload = (await response.json()) as {
        error?: string;
        reminders?: FollowUpTask[];
      };
      if (!response.ok)
        throw new Error(payload.error ?? "Tasks request failed");
      setTasks(payload.reminders ?? []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/follow-ups", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as {
          error?: string;
          reminders?: FollowUpTask[];
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "Tasks request failed");
        }
        return payload;
      })
      .then(async (payload) => {
        if (!active) return;
        setTasks(payload.reminders ?? []);
        setError("");
        if (initialTaskId) {
          const response = await fetch(`/api/follow-ups?taskId=${encodeURIComponent(initialTaskId)}`, { cache: "no-store" });
          const result = await response.json() as { error?: string; reminders?: FollowUpTask[] };
          if (!active) return;
          if (!response.ok) throw new Error(result.error ?? "Unable to open this task");
          const task = result.reminders?.find((item) => item.id === initialTaskId);
          if (!task) throw new Error("Cette tâche n’existe plus ou n’est plus accessible.");
          setEditingTask(task);
        }
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tasks",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialTaskId]);

  async function complete(id: string) {
    setUpdating(id);
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({ id, status: "completed" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Unable to complete this task");
      await loadTasks();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update task",
      );
    } finally {
      setUpdating(null);
    }
  }

  async function reopen(id: string) {
    await updateStatus(id, "upcoming");
  }

  async function updateStatus(id: string, status: "completed" | "upcoming") {
    setUpdating(id);
    setError("");
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify({ id, status }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Unable to update this task");
      await loadTasks();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update task",
      );
    } finally {
      setUpdating(null);
    }
  }

  async function moveTask(task: FollowUpTask, column: BoardColumn) {
    if (taskState(task, new Date()) === column) return;
    setUpdating(task.id);
    setError("");
    const body: Record<string, string> = { id: task.id };
    if (column === "completed") {
      body.status = "completed";
    } else {
      body.status = "upcoming";
      body.dueAt = dueDateForColumn(column).toISOString();
    }
    try {
      const response = await fetch("/api/follow-ups", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to move task");
      await loadTasks();
    } catch (moveError) {
      setError(moveError instanceof Error ? moveError.message : "Unable to move task");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteTask(task: FollowUpTask) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setUpdating(task.id);
    setError("");
    try {
      const response = await fetch(`/api/follow-ups?id=${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete this task");
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete task",
      );
    } finally {
      setUpdating(null);
    }
  }

  async function assignTasks(
    assignments: Array<{
      assignedTo: string;
      assignedToEmail: string;
      id: string;
    }>,
  ) {
    if (!assignments.length) return;
    setUpdating("assignment");
    setError("");
    try {
      const responses = await Promise.all(
        assignments.map((assignment) =>
          fetch("/api/follow-ups", {
            body: JSON.stringify(assignment),
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
          }),
        ),
      );
      if (responses.some((response) => !response.ok))
        throw new Error("Some tasks could not be assigned");
      setSelectedIds(new Set());
      await loadTasks();
    } catch (assignmentError) {
      setError(
        assignmentError instanceof Error
          ? assignmentError.message
          : "Unable to assign tasks",
      );
    } finally {
      setUpdating(null);
    }
  }

  async function autoAssignUnassigned() {
    const activeMembers = initialMembers.filter(
      (member) => member.status === "active",
    );
    const loads = new Map(
      activeMembers.map((member) => [
        member.email,
        tasks.filter(
          (task) =>
            task.status === "upcoming" && task.assignedToEmail === member.email,
        ).length,
      ]),
    );
    const assignments = tasks
      .filter((task) => task.status === "upcoming" && !task.assignedToEmail)
      .map((task) => {
        const member = [...activeMembers].sort(
          (first, second) =>
            (loads.get(first.email) ?? 0) - (loads.get(second.email) ?? 0),
        )[0];
        loads.set(member.email, (loads.get(member.email) ?? 0) + 1);
        return {
          assignedTo: member.name,
          assignedToEmail: member.email,
          id: task.id,
        };
      });
    await assignTasks(assignments);
  }

  const [now] = useState(() => new Date());
  const counts = useMemo(
    () => ({
      completed: tasks.filter((task) => task.status === "completed").length,
      overdue: tasks.filter((task) => taskState(task, now) === "overdue")
        .length,
      today: tasks.filter((task) => taskState(task, now) === "today").length,
      upcoming: tasks.filter((task) => taskState(task, now) === "upcoming")
        .length,
    }),
    [now, tasks],
  );
  const teamWorkload = useMemo(
    () =>
      initialMembers
        .filter((member) => member.status === "active")
        .map((member) => ({
          ...member,
          overdueTasks: tasks.filter(
            (task) =>
              task.assignedToEmail === member.email &&
              taskState(task, now) === "overdue",
          ).length,
          taskCount: tasks.filter(
            (task) =>
              task.status === "upcoming" &&
              task.assignedToEmail === member.email,
          ).length,
        }))
        .sort((first, second) => first.taskCount - second.taskCount),
    [now, tasks],
  );
  const unassignedCount = tasks.filter(
    (task) => task.status === "upcoming" && !task.assignedToEmail,
  ).length;
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const state = taskState(task, now);
        const matchesFilter = filter === "all" || state === filter;
        const matchesAssignment =
          assignmentFilter === "all" ||
          (assignmentFilter === "mine" &&
            task.assignedToEmail === initialMembers[0].email) ||
          (assignmentFilter === "unassigned" && !task.assignedToEmail);
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;
        const searchable = [
          task.title,
          task.notes,
          task.lead?.name,
          task.lead?.company,
          task.lead?.email,
          task.assignedTo,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          matchesFilter &&
          matchesAssignment &&
          matchesPriority &&
          (!normalizedQuery || searchable.includes(normalizedQuery))
        );
      })
      .sort((first, second) => {
        const priorityDifference =
          priorityRank(second.priority) - priorityRank(first.priority);
        return (
          priorityDifference ||
          new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime()
        );
      });
  }, [assignmentFilter, filter, now, priorityFilter, query, tasks]);
  const boardColumns = useMemo(() => {
    const columns: Record<BoardColumn, FollowUpTask[]> = {
      completed: [],
      overdue: [],
      today: [],
      upcoming: [],
    };
    for (const task of visibleTasks) columns[taskState(task, now)].push(task);
    return columns;
  }, [now, visibleTasks]);

  return (
    <>
      <section className="space-y-3">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setWorkloadOpen(true)}
            className="rounded-xl border-[#d8dbf6] text-[#5964d6]"
          >
            <UsersRound className="size-4" /> Team workload
            {unassignedCount ? (
              <span className="rounded-full bg-[#eef0ff] px-1.5 py-0.5 text-[10px] font-bold">
                {unassignedCount}
              </span>
            ) : null}
          </Button>
          <CreateTaskDialog onCreated={loadTasks} />
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white">
        <div className="flex min-w-0 flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "all",
                  "today",
                  "upcoming",
                  "overdue",
                  "completed",
                ] as TaskFilter[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${filter === item ? "bg-[#eef0ff] text-[#5964d6]" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {item}
                  <span className="text-[11px] tabular-nums opacity-70">{loading ? "…" : item === "all" ? tasks.length : counts[item]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <label className="relative block min-w-0 basis-full sm:flex-1 sm:basis-auto">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)}
                aria-label="Search task or lead" placeholder="Search task or lead…"
                className="h-10 border-slate-200 bg-slate-50/50 pl-9 shadow-none" />
            </label>
            <Button variant="outline" aria-expanded={filtersOpen} aria-controls="task-filters"
              onClick={() => setFiltersOpen(!filtersOpen)} className="h-10 rounded-xl text-slate-600">
              <SlidersHorizontal className="size-4" /> Filters
              {assignmentFilter !== "all" || priorityFilter !== "all" ? <span className="size-1.5 rounded-full bg-[#5964d6]" /> : null}
            </Button>
            <div className="flex h-10 rounded-xl bg-[#f5f6fa] p-1">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={`flex size-8 items-center justify-center rounded-lg transition ${view === "list" ? "bg-white text-[#5964d6] shadow-sm" : "text-slate-400"}`}
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Board view"
                aria-pressed={view === "board"}
                onClick={() => {
                  setFilter("all");
                  setView("board");
                }}
                className={`flex size-8 items-center justify-center rounded-lg transition ${view === "board" ? "bg-white text-[#5964d6] shadow-sm" : "text-slate-400"}`}
              >
                <Columns3 className="size-4" />
              </button>
            </div>
          </div>
          {filtersOpen ? <div id="task-filters" className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
            <select
              aria-label="Filter by owner"
              value={assignmentFilter}
              onChange={(event) =>
                setAssignmentFilter(event.target.value as AssignmentFilter)
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"
            >
              <option value="all">All owners</option>
              <option value="mine">My tasks</option>
              <option value="unassigned">Unassigned</option>
            </select>
            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as PriorityFilter)
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none"
            >
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button type="button" onClick={() => { setAssignmentFilter("all"); setPriorityFilter("all"); }}
              className="px-2 py-2 text-xs font-medium text-[#5964d6]">Reset filters</button>
          </div> : null}
        </div>

        {error ? (
          <p className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
        {view === "list" && visibleTasks.length ? (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-[#fafaff] px-5 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={
                  visibleTasks.length > 0 &&
                  visibleTasks.every((task) => selectedIds.has(task.id))
                }
                onChange={(event) =>
                  setSelectedIds(
                    event.target.checked
                      ? new Set(visibleTasks.map((task) => task.id))
                      : new Set(),
                  )
                }
                className="size-4 rounded border-slate-300 accent-[#5964d6]"
              />
              Select all
            </label>
            {selectedIds.size ? (
              <div className="ml-auto flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#5964d6]">
                  <UsersRound className="size-4" /> {selectedIds.size} selected
                </span>
                <select
                  defaultValue=""
                  disabled={updating === "assignment"}
                  onChange={(event) => {
                    const member = initialMembers.find(
                      (item) => item.email === event.target.value,
                    );
                    if (!member) return;
                    void assignTasks(
                      [...selectedIds].map((id) => ({
                        assignedTo: member.name,
                        assignedToEmail: member.email,
                        id,
                      })),
                    );
                    event.target.value = "";
                  }}
                  className="h-9 rounded-xl border border-[#d8dbf6] bg-white px-3 text-xs font-bold text-[#5964d6] outline-none"
                >
                  <option value="" disabled>
                    Assign selected…
                  </option>
                  {initialMembers
                    .filter((member) => member.status === "active")
                    .map((member) => (
                      <option key={member.id} value={member.email}>
                        {member.name} ·{" "}
                        {teamWorkload.find((item) => item.id === member.id)
                          ?.taskCount ?? 0}{" "}
                        tasks
                      </option>
                    ))}
                </select>
              </div>
            ) : null}
          </div>
        ) : null}
        {view === "board" && !loading ? (
          <TaskBoard
            columns={boardColumns}
            moving={updating}
            onMove={moveTask}
            onOpen={setActivityTask}
          />
        ) : (
          <div className="divide-y divide-slate-100">
          {loading ? (
            <p className="p-10 text-center text-sm text-slate-500">
              Loading tasks…
            </p>
          ) : visibleTasks.length ? (
            visibleTasks.map((task) => {
              const state = taskState(task, now);
              return (
                <article
                  key={task.id}
                  className={`grid min-w-0 grid-cols-[16px_minmax(0,1fr)] items-start gap-x-3 gap-y-3 px-4 py-4 transition sm:px-5 xl:grid-cols-[16px_minmax(0,1fr)_180px_auto] xl:items-center ${selectedIds.has(task.id) ? "bg-[#f5f6ff]" : "hover:bg-slate-50/60"}`}
                >
                  <input
                    type="checkbox"
                    aria-label={`Select ${task.title}`}
                    checked={selectedIds.has(task.id)}
                    onChange={(event) => {
                      setSelectedIds((current) => {
                        const next = new Set(current);
                        if (event.target.checked) next.add(task.id);
                        else next.delete(task.id);
                        return next;
                      });
                    }}
                    className="mt-3 size-4 shrink-0 rounded border-slate-300 accent-[#5964d6] sm:mt-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="w-full break-words text-sm font-medium leading-5 text-slate-900">{task.title}</h2>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize ${stateBadge(state)}`}
                      >
                        {state}
                      </span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize ${priorityBadge(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500">
                      <Link className="break-words hover:text-[#5964d6] hover:underline" href={`/dashboard/leads/${task.leadId}`}>
                        {task.lead?.name || task.lead?.email || "Unknown"}
                      </Link>
                      {task.lead?.company ? <span className="break-words">· {task.lead.company}</span> : null}
                    </div>
                    {task.notes ? (
                      <p title={task.notes} className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {task.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="col-start-2 min-w-0 space-y-2 xl:col-start-auto">
                    <p className={`flex items-center gap-1.5 text-xs tabular-nums ${state === "overdue" ? "text-red-600" : "text-slate-500"}`}>
                      <Clock3 className="size-3.5 shrink-0" /> {formatDate(task.dueAt)}
                    </p>
                    <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#eef0ff] text-[10px] font-bold text-[#5964d6]">
                        {initials(task.assignedTo)}
                      </span>
                      <span className="truncate" title={task.assignedTo || "Unassigned"}>
                        {task.assignedTo || "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div className="col-start-2 flex items-center gap-1 xl:col-start-auto">
                    {task.status === "upcoming" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updating === task.id}
                        onClick={() => complete(task.id)}
                      >
                        <Check className="size-4" />{" "}
                        {updating === task.id ? "Saving…" : "Done"}
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/dashboard/leads/${task.leadId}`}>
                        Lead <ChevronRight className="size-4" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Task actions"
                          disabled={updating === task.id}
                        >
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1.5">
                        <DropdownMenuItem
                          className="gap-2 px-3 py-2"
                          onSelect={() => setActivityTask(task)}
                        >
                          <History className="size-4" /> View activity
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 px-3 py-2"
                          onSelect={() => setEditingTask(task)}
                        >
                          <Pencil className="size-4" /> Edit task
                        </DropdownMenuItem>
                        {task.status === "completed" ? (
                          <DropdownMenuItem
                            className="gap-2 px-3 py-2"
                            onSelect={() => reopen(task.id)}
                          >
                            <RotateCcw className="size-4" /> Reopen task
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2 px-3 py-2"
                          onSelect={() => deleteTask(task)}
                        >
                          <Trash2 className="size-4" /> Delete task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <CalendarClock className="mx-auto size-8 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No tasks found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Schedule a follow-up from a lead page.
              </p>
            </div>
          )}
          </div>
        )}
      </section>
      {editingTask ? (
        <EditTaskDialog
          key={editingTask.id}
          open
          task={editingTask}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setEditingTask(null);
              if (initialTaskId) router.replace("/dashboard/tasks", { scroll: false });
            }
          }}
          onUpdated={loadTasks}
        />
      ) : null}
      {activityTask ? (
        <TaskActivityDialog
          key={activityTask.id}
          open
          task={activityTask}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setActivityTask(null);
          }}
        />
      ) : null}
      <TeamWorkloadSheet
        assigning={updating === "assignment"}
        members={teamWorkload}
        onAutoAssign={autoAssignUnassigned}
        onOpenChange={setWorkloadOpen}
        open={workloadOpen}
        unassignedCount={unassignedCount}
      />
    </>
  );
}

function taskState(task: FollowUpTask, now: Date): Exclude<TaskFilter, "all"> {
  if (task.status === "completed") return "completed";
  const due = new Date(task.dueAt);
  if (due.getTime() < now.getTime()) return "overdue";
  if (due.toDateString() === now.toDateString()) return "today";
  return "upcoming";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function initials(name: string | null) {
  if (!name) return "—";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function stateBadge(state: Exclude<TaskFilter, "all">) {
  if (state === "overdue") return "bg-red-50 text-red-700";
  if (state === "completed") return "bg-emerald-50 text-emerald-700";
  if (state === "today") return "bg-indigo-50 text-indigo-700";
  return "bg-sky-50 text-sky-700";
}

function priorityRank(priority: Priority) {
  return { low: 1, medium: 2, high: 3, urgent: 4 }[priority];
}

function priorityBadge(priority: Priority) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function dueDateForColumn(column: Exclude<BoardColumn, "completed">) {
  const date = new Date();
  if (column === "today") {
    date.setHours(Math.max(date.getHours() + 1, 17), 0, 0, 0);
    return date;
  }
  if (column === "overdue") {
    date.setDate(date.getDate() - 1);
    date.setHours(17, 0, 0, 0);
    return date;
  }
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return date;
}
