import { SunMedium } from "lucide-react";

import { MyDayWorkspace } from "./my-day-workspace";

export default function MyDayPage() {
  return (
    <main className="min-w-0 min-h-[calc(100vh-76px)] bg-white px-4 py-6 text-[#171717] sm:px-6 xl:px-8">
      <div className="soft-page-enter mx-auto w-full min-w-0 max-w-[1240px] space-y-5">
        <header>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-950">
            <SunMedium className="size-6 text-[#5964d6]" /> My Day
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Your most important commercial actions, in one clear view.
          </p>
        </header>
        <MyDayWorkspace />
      </div>
    </main>
  );
}
