"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudOff, RefreshCw } from "lucide-react";

export function LeadsLoadError() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <main className="min-h-[calc(100vh-76px)] bg-white px-4 py-6 sm:px-6 xl:px-8">
    <div className="mx-auto max-w-[1240px]">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Leads</h1>
      <section aria-busy={pending} className="mt-5 rounded-2xl border border-indigo-100 bg-white px-6 py-10 text-center">
        <CloudOff aria-hidden="true" className="mx-auto size-8 text-indigo-400" />
        <div role="alert">
          <h2 className="mt-4 text-base font-semibold text-slate-900">Impossible de charger les prospects</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">La connexion au service de données a échoué. Vérifie ta connexion, puis réessaie. Si le problème persiste, le service peut être temporairement indisponible.</p>
        </div>
        <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#5964d6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4f5acb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50">
          <RefreshCw aria-hidden="true" className={`size-4 ${pending ? "animate-spin" : ""}`} />
          {pending ? "Chargement…" : "Réessayer"}
        </button>
        <p role="status" className="mt-3 text-xs text-slate-500">{pending ? "Nouvelle tentative en cours…" : "Tes filtres et ta page sont conservés. Aucune donnée n’a été modifiée."}</p>
      </section>
    </div>
  </main>;
}
