"use client";

import { CalendarClock, Clock3, UserRound } from "lucide-react";

import type { FollowUpTask } from "./tasks-workspace";

export type BoardColumn = "today" | "upcoming" | "overdue" | "completed";

export function TaskBoard({
  columns,
  moving,
  onMove,
  onOpen,
}: {
  columns: Record<BoardColumn, FollowUpTask[]>;
  moving: string | null;
  onMove: (task: FollowUpTask, column: BoardColumn) => void;
  onOpen: (task: FollowUpTask) => void;
}) {
  const allTasks = Object.values(columns).flat();
  return (
    <div className="grid gap-4 p-4 lg:grid-cols-2 2xl:grid-cols-4">
      {(Object.keys(columns) as BoardColumn[]).map((column) => (
        <KanbanColumn
          key={column}
          column={column}
          allTasks={allTasks}
          moving={moving}
          tasks={columns[column]}
          onMove={onMove}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function KanbanColumn({
  allTasks,
  column,
  moving,
  tasks,
  onMove,
  onOpen,
}: {
  allTasks: FollowUpTask[];
  column: BoardColumn;
  moving: string | null;
  tasks: FollowUpTask[];
  onMove: (task: FollowUpTask, column: BoardColumn) => void;
  onOpen: (task: FollowUpTask) => void;
}) {
  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/task-id");
        const task = allTasks.find((item) => item.id === id);
        if (task) onMove(task, column);
      }}
      className={`min-h-80 rounded-2xl border p-3 ${columnStyle(column)}`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-800">{columnLabel(column)}</h2>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-slate-500 shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            draggable
            disabled={moving === task.id}
            onClick={() => onOpen(task)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/task-id", task.id);
            }}
            className="block w-full cursor-grab rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#c6caf3] hover:shadow-md active:cursor-grabbing disabled:opacity-50"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-900">
                {task.title}
              </p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityStyle(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <UserRound className="size-3.5 text-slate-400" />
              {task.lead?.name || task.lead?.email || "Unknown lead"}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock3 className="size-3.5" /> {formatDate(task.dueAt)}
              </span>
              <span className="max-w-24 truncate font-semibold">
                {task.assignedTo || "Unassigned"}
              </span>
            </div>
          </button>
        ))}
        {!tasks.length ? (
          <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 text-center">
            <CalendarClock className="size-6 text-slate-300" />
            <p className="mt-2 text-xs font-semibold text-slate-400">Drop a task here</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function columnLabel(column: BoardColumn) {
  return { today: "Today", upcoming: "Upcoming", overdue: "Overdue", completed: "Completed" }[column];
}

function columnStyle(column: BoardColumn) {
  if (column === "today") return "border-indigo-100 bg-indigo-50/50";
  if (column === "upcoming") return "border-sky-100 bg-sky-50/50";
  if (column === "overdue") return "border-red-100 bg-red-50/40";
  return "border-emerald-100 bg-emerald-50/40";
}

function priorityStyle(priority: FollowUpTask["priority"]) {
  if (priority === "urgent") return "bg-red-100 text-red-700";
  if (priority === "high") return "bg-orange-100 text-orange-700";
  if (priority === "medium") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(new Date(value));
}
