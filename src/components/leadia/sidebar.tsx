"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { dataItems, integrationItems, platformItems } from "./data";
import type { NavItem } from "./types";

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-[#e7e9f2] bg-[#fcfcfe]">
      <div className="flex h-[76px] items-center justify-between px-5">
        <Link href="/dashboard/onboarding" onClick={onClose} className="group flex items-center gap-3">
          <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#5865d8] to-[#7b61d9] text-white shadow-[0_8px_20px_rgba(79,95,215,.24)]">
            <Sparkles className="size-[18px]" />
            <span className="absolute inset-x-1 top-0 h-px bg-white/50" />
          </span>
          <span>
            <span className="block text-[22px] font-bold leading-none tracking-[-0.045em] text-[#262938]">Leadia</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.2em] text-[#9a9eae]">AI Sales</span>
          </span>
        </Link>
        {mobile ? <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex size-9 items-center justify-center rounded-xl border border-[#e7e9f1] bg-white text-[#7d8294] shadow-sm hover:bg-[#f5f6fb]"
        >
          <X className="size-4" />
        </button> : null}
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-3 [scrollbar-width:thin]">
        <NavGroup title="Platform" items={platformItems} onNavigate={onClose} />
        <NavGroup title="Data" items={dataItems} onNavigate={onClose} />
        <NavGroup title="Integrations" items={integrationItems} onNavigate={onClose} />
      </nav>

      <div className="mx-3 mb-3 rounded-2xl border border-[#dfe3fb] bg-gradient-to-br from-[#f0f2ff] to-[#f8f5ff] p-4">
        <div className="flex items-center justify-between">
          <span className="flex size-8 items-center justify-center rounded-xl bg-white text-[#5964d6] shadow-sm"><Sparkles className="size-4" /></span>
          <span className="rounded-full bg-white/80 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#6370d6]">Active</span>
        </div>
        <p className="mt-3 text-xs font-bold text-[#33374a]">Leadia Sales Agent</p>
        <p className="mt-1 text-[11px] leading-4 text-[#85899a]">Ready to qualify website visitors.</p>
      </div>

      <div className="border-t border-[#e8eaf1] p-3">
        <Link
          href="/"
          onClick={onClose}
          className="group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#656a7c] transition hover:bg-[#f1f2f8] hover:text-[#303443]"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#f1f2f7] text-[#858a9c] group-hover:bg-white"><Home className="size-4" /></span>
          Home
          <ChevronRight className="ml-auto size-3.5 text-[#b0b3c0]" />
        </Link>
      </div>
    </aside>
  );
}

function NavGroup({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div>
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a3a7b7]">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const href = item.href ?? "#";
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href
                ? pathname.startsWith(item.href)
                : item.active;

          return (
            <Link
              key={item.label}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[#eef0ff] to-[#f5f2ff] text-[#4c57c8] shadow-[inset_0_0_0_1px_rgba(91,101,214,.08)]"
                  : "text-[#656a7c] hover:bg-[#f3f4f9] hover:text-[#343849]",
              )}
            >
              {isActive ? (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#5964d6] shadow-[0_0_10px_rgba(89,100,214,.45)]" />
              ) : null}
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-[10px] transition", isActive ? "bg-white text-[#5964d6] shadow-sm" : "bg-transparent text-[#9296a6] group-hover:bg-white group-hover:text-[#676d83]")}><Icon className="size-[16px]" /></span>
              {item.label}
              {isActive ? <ChevronRight className="ml-auto size-3.5 text-[#828ae0]" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
