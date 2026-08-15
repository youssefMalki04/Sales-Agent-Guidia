import {
  AppWindow,
  Building2,
  ChevronDown,
  CircleHelp,
  Globe2,
  Menu,
  Search,
} from "lucide-react";
import Link from "next/link";

import { DemoModeControl } from "./demo-mode-control";

export function Topbar({
  title,
  agentName,
  onMenuClick,
}: {
  title: string;
  agentName?: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e7e9f1] bg-white/95 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
      <div className="flex min-w-0 items-center gap-3 sm:gap-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e5e7ef] bg-[#fafafd] text-[#666b7d] shadow-sm hover:bg-[#f3f4fa] lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-bold tracking-[-.01em] text-[#292d3b]">{title}</h1>
          <p className="mt-0.5 hidden text-[10px] font-medium text-[#9a9eae] sm:block">Leadia workspace</p>
        </div>
        <div className="hidden h-7 w-px bg-[#eceef4] md:block" />
        <div className="hidden items-center gap-2 rounded-full bg-[#f5f6fa] px-3 py-2 text-xs font-semibold text-[#73788a] md:flex">
          <Building2 className="size-3.5 text-[#969aaa]" />
          <span className="max-w-[140px] truncate">Leadia</span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[#e7e9f1] bg-white px-3 py-2 text-xs font-semibold text-[#626779] xl:flex">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.1)]" />
          <AppWindow className="size-3.5 text-[#8c91a2]" />
          <span>{agentName ?? "No active agent"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-[#24242b] sm:gap-3">
        <DemoModeControl />
        <Link href="/dashboard/leads" title="Search leads" aria-label="Search leads" className="hidden size-9 items-center justify-center rounded-xl text-[#858a9b] hover:bg-[#f4f5f9] md:flex"><Search className="size-4" /></Link>
        <button type="button" className="hidden items-center gap-2 rounded-xl px-2 py-2 text-xs text-[#626779] hover:bg-[#f4f5f9] sm:flex">
          <Globe2 className="size-4 text-[#969aaa]" />
          EN
          <ChevronDown className="size-3 text-[#a8abb8]" />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="hidden size-9 items-center justify-center rounded-xl text-[#8d91a1] hover:bg-[#f4f5f9] sm:flex"
        >
          <CircleHelp className="size-4" />
        </button>
        <button type="button" className="flex items-center gap-2 rounded-xl border border-[#e7e9f1] bg-[#fafafd] p-1.5 pr-2 shadow-sm hover:bg-[#f5f6fa]">
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#5964d6] to-[#7865d8] text-[10px] font-bold text-white shadow-sm">
            YO
          </span>
          <span className="hidden max-w-[160px] truncate text-xs font-semibold text-[#565b6d] 2xl:block">
            yosra@leadia.ai
          </span>
          <ChevronDown className="size-3 text-[#a4a8b6]" />
        </button>
      </div>
    </header>
  );
}
