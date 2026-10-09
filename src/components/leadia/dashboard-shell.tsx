"use client";

import { useEffect, useState } from "react";

import { ChatWidget } from "./chat-widget";
import { DashboardTopbar } from "./dashboard-topbar";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfbfc] text-[#171717]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[296px_minmax(0,1fr)]">
        <div className="sticky top-0 hidden h-screen lg:block">
          <Sidebar />
        </div>
        <section className="min-w-0">
          <div className="sticky top-0 z-30">
            <DashboardTopbar onMenuClick={() => setMenuOpen(true)} />
          </div>
          {children}
        </section>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative h-full w-[min(88vw,320px)] shadow-2xl">
            <Sidebar mobile onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}

      <ChatWidget />
    </main>
  );
}
