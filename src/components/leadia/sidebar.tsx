import { Home, PanelLeftClose } from "lucide-react";

import { cn } from "@/lib/utils";

import { dataItems, integrationItems, platformItems } from "./data";
import type { NavItem } from "./types";

export function Sidebar() {
  return (
    <aside className="flex min-h-screen flex-col border-r border-[#e7e7ea] bg-white">
      <div className="flex h-[76px] items-center justify-between px-6">
        <div className="text-[40px] font-semibold leading-none tracking-[-0.055em] text-[#173f8a]">
          Leadia
        </div>
        <button
          aria-label="Collapse sidebar"
          className="flex size-8 items-center justify-center rounded-lg text-[#90909a] hover:bg-[#f3f3f5]"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-7 px-2 pt-2">
        <NavGroup title="Platform" items={platformItems} />
        <NavGroup title="Data" items={dataItems} />
        <NavGroup title="Integrations" items={integrationItems} />
      </nav>

      <div className="border-t border-[#e7e7ea] p-2">
        <a
          href="#"
          className="flex h-14 items-center gap-4 rounded-xl px-5 text-sm font-semibold text-[#5c5c66] hover:bg-[#f6f6f7]"
        >
          <Home className="size-5 text-[#9b9ba3]" />
          Home
        </a>
      </div>
    </aside>
  );
}

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a9a9b2]">
        {title}
      </p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href="#"
              className={cn(
                "relative flex h-[50px] items-center gap-4 rounded-xl px-5 text-sm font-semibold text-[#55555f] transition-colors",
                item.active
                  ? "bg-[#f4f4f5] text-[#2b2b31]"
                  : "hover:bg-[#f8f8f9]",
              )}
            >
              {item.active ? (
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#171717]" />
              ) : null}
              <Icon className="size-[18px] text-[#9a9aa2]" />
              {item.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
