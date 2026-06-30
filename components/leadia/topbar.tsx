import {
  AppWindow,
  Building2,
  ChevronDown,
  CircleHelp,
  Globe2,
} from "lucide-react";

export function Topbar({
  title,
  agentName,
}: {
  title: string;
  agentName?: string;
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e7e7ea] bg-white px-5 sm:px-8 xl:px-14">
      <div className="flex min-w-0 items-center gap-8">
        <h1 className="text-base font-semibold text-[#202026]">{title}</h1>
        <div className="hidden items-center gap-2 text-sm font-medium text-[#9b9ba4] md:flex">
          <Building2 className="size-4" />
          <span>Workspace</span>
          <span className="max-w-[160px] truncate text-[#c3c3c8]">
            leadia workspace
          </span>
        </div>
        <div className="hidden items-center gap-2 text-sm font-medium text-[#9b9ba4] lg:flex">
          <AppWindow className="size-4" />
          <span>Sales agent</span>
          <span>{agentName ?? "No active agent"}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm font-semibold text-[#24242b]">
        <button className="hidden items-center gap-2 text-[#4b4b55] sm:flex">
          <Globe2 className="size-4 text-[#9d9da5]" />
          EN
          <ChevronDown className="size-3 text-[#b1b1b7]" />
        </button>
        <button
          aria-label="Theme"
          className="hidden size-8 items-center justify-center rounded-lg text-[#d6ac35] hover:bg-[#f5f5f6] sm:flex"
        >
          <CircleHelp className="size-4" />
        </button>
        <button className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f4] text-xs font-bold">
            YO
          </span>
          <span className="hidden max-w-[190px] truncate text-[#b7b7bd] xl:block">
            yosra@leadia.ai
          </span>
          <ChevronDown className="size-3 text-[#b1b1b7]" />
        </button>
      </div>
    </header>
  );
}
