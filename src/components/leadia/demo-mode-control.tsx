"use client";

import { CheckCircle2, ChevronDown, Play, RefreshCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DEMO_MODE_KEY = "leadia-demo-mode-v1";
const demoPrefixes = ["leadia-", "guidia-"];

const journey = [
  { label: "1. Customer website", href: "/demo/widget" },
  { label: "2. Human handoff", href: "/dashboard/inbox" },
  { label: "3. Sales pipeline", href: "/dashboard/pipeline" },
  { label: "4. Booked meetings", href: "/dashboard/meetings" },
  { label: "5. AI performance", href: "/dashboard/analytics" },
];

export function DemoModeControl() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const stored = localStorage.getItem(DEMO_MODE_KEY);
      if (stored === "off") setEnabled(false);
    }, 0);
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("mousedown", close);
    };
  }, []);

  function toggleMode() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(DEMO_MODE_KEY, next ? "on" : "off");
  }

  function resetDemo() {
    if (!window.confirm("Reset all local demo data and restore the sample scenario?")) return;
    const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter((key): key is string => Boolean(key));
    keys.forEach((key) => {
      if (demoPrefixes.some((prefix) => key.startsWith(prefix))) localStorage.removeItem(key);
    });
    localStorage.setItem(DEMO_MODE_KEY, "on");
    window.location.assign("/dashboard/onboarding");
  }

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-bold ${enabled ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-[#dedee4] bg-white text-[#73737c]"}`}>
        <span className={`size-2 rounded-full ${enabled ? "bg-emerald-500" : "bg-[#b4b4bb]"}`} />
        <span className="hidden sm:inline">Demo</span>
        <ChevronDown className="size-3" />
      </button>
      {open ? <div className="absolute right-0 top-12 z-50 w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-xl border border-[#dedee4] bg-white shadow-2xl">
        <div className="border-b border-[#eeeeF1] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">Demo mode</p><p className="mt-1 text-xs font-normal leading-5 text-[#777780]">A consistent sample sales journey for presentations.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close demo menu"><X className="size-4 text-[#85858e]" /></button></div><button type="button" role="switch" aria-checked={enabled} onClick={toggleMode} className="mt-4 flex w-full items-center justify-between rounded-lg bg-[#f5f5f7] p-3 text-xs font-semibold"><span>{enabled ? "Sample data enabled" : "Sample data hidden"}</span><span className={`relative h-6 w-11 rounded-full ${enabled ? "bg-[#171717]" : "bg-[#d4d4d9]"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} /></span></button></div>
        <div className="p-2"><p className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9999a2]">Presentation journey</p>{journey.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#55555e] hover:bg-[#f5f5f7]"><span className={`flex size-6 items-center justify-center rounded-full ${index === 0 ? "bg-indigo-50 text-indigo-700" : "bg-[#f0f0f2] text-[#777780]"}`}>{index === 0 ? <Play className="size-3" /> : <CheckCircle2 className="size-3" />}</span>{item.label}</Link>)}</div>
        <div className="border-t border-[#eeeeF1] p-3"><button type="button" onClick={resetDemo} className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#dedee4] text-xs font-semibold text-[#5e5e67] hover:bg-[#f7f7f8]"><RefreshCcw className="size-3.5" />Reset sample data</button></div>
      </div> : null}
    </div>
  );
}
