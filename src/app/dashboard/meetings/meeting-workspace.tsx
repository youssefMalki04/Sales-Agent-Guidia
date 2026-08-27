import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
} from "lucide-react";

import type { Meeting, MeetingStatus } from "./meeting-data";
import { CalendarGrid, MeetingList, ViewButton } from "./meeting-calendar";

type MeetingWorkspaceProps = {
  meetings: Meeting[];
  selectedMonth: Date;
  monthLabel: string;
  query: string;
  owner: string;
  status: "all" | MeetingStatus;
  view: "calendar" | "list";
  onToday: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onQueryChange: (query: string) => void;
  onOwnerChange: (owner: string) => void;
  onStatusChange: (status: "all" | MeetingStatus) => void;
  onViewChange: (view: "calendar" | "list") => void;
  onSelectMeeting: (id: string) => void;
};

export function MeetingWorkspace({
  meetings,
  selectedMonth,
  monthLabel,
  query,
  owner,
  status,
  view,
  onToday,
  onPreviousMonth,
  onNextMonth,
  onQueryChange,
  onOwnerChange,
  onStatusChange,
  onViewChange,
  onSelectMeeting,
}: MeetingWorkspaceProps) {
  return (
    <section className="soft-panel-enter overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="flex flex-col gap-3 border-b border-[#e8e8ec] p-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="h-9 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-[#5964d6] hover:bg-[#f5f6ff]"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPreviousMonth}
            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-[#f5f6ff]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-[#f5f6ff]"
          >
            <ChevronRight className="size-4" />
          </button>
          <h2 className="ml-2 text-lg font-semibold">{monthLabel}</h2>
        </div>

        <MeetingFilters
          query={query}
          owner={owner}
          status={status}
          view={view}
          onQueryChange={onQueryChange}
          onOwnerChange={onOwnerChange}
          onStatusChange={onStatusChange}
          onViewChange={onViewChange}
        />
      </div>

      {view === "calendar" ? (
        <CalendarGrid
          month={selectedMonth}
          meetings={meetings}
          onSelect={onSelectMeeting}
        />
      ) : (
        <MeetingList meetings={meetings} onSelect={onSelectMeeting} />
      )}
    </section>
  );
}

function MeetingFilters({
  query,
  owner,
  status,
  view,
  onQueryChange,
  onOwnerChange,
  onStatusChange,
  onViewChange,
}: Pick<
  MeetingWorkspaceProps,
  | "query"
  | "owner"
  | "status"
  | "view"
  | "onQueryChange"
  | "onOwnerChange"
  | "onStatusChange"
  | "onViewChange"
>) {
  return (
    <div className="flex flex-wrap gap-2">
      <label className="relative min-w-52 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9999a2]" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search meetings…"
          className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-[#939ae2]"
        />
      </label>
      <select
        value={owner}
        onChange={(event) => onOwnerChange(event.target.value)}
        className="h-9 rounded-md border border-[#dedee4] bg-white px-3 text-xs font-semibold"
      >
        <option value="all">All owners</option>
        <option>Yosra</option>
        <option>Sami</option>
      </select>
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as "all" | MeetingStatus)
        }
        className="h-9 rounded-md border border-[#dedee4] bg-white px-3 text-xs font-semibold"
      >
        <option value="all">All statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <div className="flex rounded-md border border-[#dedee4] p-1">
        <ViewButton
          active={view === "calendar"}
          label="Calendar"
          onClick={() => onViewChange("calendar")}
        >
          <CalendarDays className="size-4" />
        </ViewButton>
        <ViewButton
          active={view === "list"}
          label="List"
          onClick={() => onViewChange("list")}
        >
          <List className="size-4" />
        </ViewButton>
      </div>
    </div>
  );
}
