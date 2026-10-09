import { ListChecks } from "lucide-react";

import { TasksWorkspace } from "./tasks-workspace";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ taskId?: string | string[] }> }) {
  const params = await searchParams;
  const taskId = typeof params.taskId === "string" ? params.taskId : undefined;
  return (
    <main className="min-h-[calc(100vh-76px)] min-w-0 bg-white px-4 py-6 text-[#171717] sm:px-6 xl:px-8">
      <div className="soft-page-enter mx-auto max-w-[1240px] space-y-5">
        <header>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-950">
            <ListChecks className="size-6 text-[#5964d6]" /> Tasks
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Keep every commercial follow-up visible and on time.
          </p>
        </header>
        <TasksWorkspace key={taskId ?? "tasks"} initialTaskId={taskId} />
      </div>
    </main>
  );
}
